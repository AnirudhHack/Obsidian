// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC4626.sol";
// import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import { IERC4626 } from "./interfaces/IERC4626.sol";
import { SafeTransferLib } from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import "./interfaces/aave/FlashLoanReceiverBase.sol";
import "./interfaces/IWETH9.sol";
import "./helpers/AaveHelperBase.sol";
import { AaveInterface, IAaveV3Oracle } from "./interfaces/aave/AaveInterface.sol";
import "./helpers/UniswapV3HelperBase.sol";

contract WSTETHVault is FlashLoanReceiverBase, ERC20, IERC4626, ReentrancyGuard, AaveHelperBase, UniswapV3HelperBase{
    using SafeTransferLib for ERC20;

    address public immutable asset;
    IWETH9 immutable WETH9;
    address public governance;
    address public pendingGovernance;
    uint public slippage;
    uint24 public fee;

    event PendingGovernance(address indexed governance);
    event GovernanceAccepted(address indexed newGovernance);

    /**
	 * @dev constructor
	 * @notice Intializes state variables of vault.
	 * @param _asset The address of the token to be supplied.
	 * @param _addressProvider address of aaveV2 LendingPoolAddressesProvider
	 * @param _weth9 address of WETH9
	 */
    constructor(
        address _asset,
        ILendingPoolAddressesProvider _addressProvider,
        address _weth9,
        uint _slippage
    ) ERC20("wstETHVault", "wstETHV") FlashLoanReceiverBase(_addressProvider) {
        asset = _asset;
        governance = msg.sender;
        WETH9 = IWETH9(_weth9);
        slippage = _slippage;
    }

    modifier onlyGovernance{
        require(msg.sender == governance, "Only governance can execute.");
        _;
    }

    /**
    * @dev deposit
    * @notice user will deposite Eth using this function
    * @param assets The amount of the token to be supplied.
    * @param receiver address of share receiver
	 */
    function deposit(uint256 assets, address receiver) external override nonReentrant returns (uint256 shares) {
        require(assets > 0 , "assets must be greater than zero");
        require(receiver != address(0) && receiver != address(this), "receiver shouldn't be 0 address or this contract");        
        
        // Need to transfer before minting or ERC777s could reenter.
        //Wrapping eth to Weth
        // WETH9.deposit{value : msg.value}(); //TODO
        bool _status = WETH9.transferFrom(msg.sender, address(this), assets);
        require(_status == true, "WETH9 trasferFrom failed");

        uint slippageAmt = calculateSlippageAmount(assets, slippage);

        uint returnAmount = uniswapV3Swap(SellInfo(
            address(WETH9),
            asset,
            fee,
            slippageAmt,
            assets
        ));
        require((shares = previewDeposit(returnAmount)) != 0, "ZERO_SHARES");

        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, returnAmount, shares);
    }


    /**
	 * @dev withdraw
	 * @notice Withdraw function allows user to withdraw there eth amount by burning shares.
	 * @param shares input share amount
	 * @param receiver address of receiver
	 * @param owner address of owner of the shares
	 */
    function withdraw(
        uint256 shares,
        address receiver,
        address owner
    ) external nonReentrant override returns (uint256 assets) {
        require(receiver != address(0) && receiver != address(this), "receiver shouldn't be 0 address or this contract");
        require(msg.sender == owner, "only owner can execute.");
        // if (msg.sender != owner) {
        //     uint256 allowed = allowance[owner][msg.sender]; // Saves gas for limited approvals.

        //     if (allowed != type(uint256).max) allowance[owner][msg.sender] = allowed - shares;
        // }

        // Check for rounding error since we round down in previewRedeem.
        require((assets = previewRedeem(shares)) != 0, "ZERO_ASSETS");

        _burn(owner, shares);

        uint slippageAmt = calculateSlippageAmount(assets, slippage);
        uint returnAmount = uniswapV3Swap(SellInfo(
            asset,
            address(WETH9),
            fee,
            slippageAmt,
            assets
        ));

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }
    
    /**
     * @dev Calculates the slippage amount given asset amount and slippage percentage.
     * @param assetAmount The asset amount with 18 decimal places.
     * @param slippagePercentage The slippage percentage in scaled format (1% = 10000).
     * @return slippageAmount The calculated slippage amount.
     */
    function calculateSlippageAmount(uint256 assetAmount, uint256 slippagePercentage) public pure returns (uint256) {
        require(slippagePercentage <= 100 * 10000, "Slippage percentage is too high"); // Ensure slippage percentage is within 100%
        
        // Calculate slippage amount: (assetAmount * slippagePercentage) / (100 * 10000)
        uint256 slippageAmount = (assetAmount * slippagePercentage) / (100 * 10000);
        
        return slippageAmount;
    }

    
    function totalAssets() public view override returns (uint256){
        uint amount = getVaultsActualBalance();
        
        (uint price, uint decimals) = getAssetPriceFromAave(asset);

        uint totalAsset = (amount * decimals) / price;
        // amount = amount + ERC20(asset).balanceOf(address(this));
        return totalAsset;
    }

    // function assetsOf(address user) external view returns (uint256){
    //     return previewRedeem(balanceOf[user]);
    // }

    // function assetsPerShare() external view returns (uint256){
    //     return previewRedeem(10**decimals);
    // }

    /**
     * @notice  Internal conversion function (from assets to shares)
     */
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.

        return supply == 0 ? assets : ((assets * supply) / totalAssets() ) ;
    }

    /**
     * @notice  Internal conversion function (from shares to assets)
    */
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.

        return supply == 0 ? shares : ((shares * totalAssets()) / supply);
    }

    /**
     * @notice  This function gives amount of supply token and borrow token required to remove in order to remove input assets amount from aave position by keeping the leverage same.
     */
    function convertToSupply(uint256 assets) public view returns (uint256 supplyAmount, uint256 borrowAmount) {
        uint256 amount = getVaultsActualBalance();
        uint supplyBal = getCollateralAssetBalance();
        uint borrowBal = getDebtAssetBalance();

        supplyAmount = assets == amount ? supplyBal : ((supplyBal * assets) / amount);

        borrowAmount = assets == amount ? borrowBal : ((borrowBal * assets) / amount);
    }

    function previewDeposit(uint256 assets) public view override returns (uint256) {
        return convertToShares(assets);
    }

    function previewRedeem(uint256 shares) public view override returns (uint256) {
        return convertToAssets(shares);
    }

    function maxDeposit(address) external pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxMint(address) external pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxWithdraw(address owner) external view override returns (uint256) {
        return convertToAssets(balanceOf(owner));
    }

    function maxRedeem(address owner) external view override returns (uint256) {
        return balanceOf(owner);
    }

    function getVaultsActualBalance() public view returns(uint amount){
        uint supplyBal = getCollateralAssetBalance();
        uint borrowBal = getDebtAssetBalance();
        amount = supplyBal - borrowBal;
    }



    /**
     * @notice `setGovernance()` should be called by the existing governance address prior to calling this function.
     */
    function setGovernance(address _governance) external onlyGovernance {
        require(_governance != address(0), "Zero Address");
        pendingGovernance = _governance;
        emit PendingGovernance(pendingGovernance);
    }

    /**
     * @notice Governance address is not updated until the new governance
     * address has called `acceptGovernance()` to accept this responsibility.
     */
    function acceptGovernance() external {
        require(msg.sender == pendingGovernance, "pendingGovernance");
        governance = msg.sender;
        emit GovernanceAccepted(governance);
    }

    function getAssetPriceFromAave(address asset)private view returns(uint price, uint decimals){
        address priceOracleAddress = aaveProvider.getPriceOracle();
        price = IAaveV3Oracle(priceOracleAddress).getAssetPrice(asset);
        decimals = IAaveV3Oracle(priceOracleAddress).BASE_CURRENCY_UNIT();
    }

    function getCollateralAssetBalance()public view returns(uint balanceUSD){
        (uint price, uint decimals) = getAssetPriceFromAave(asset);
        uint SupplyBalance = aTokenSupply.balanceOf(address(this));
        uint idleBalance = ERC20(asset).balanceOf(address(this));
        uint totalBal = idleBalance + SupplyBalance;
        if(totalBal <= 0) return 0;

        uint balanceUSD = (totalBal * price) / decimals;
    }

    function getDebtAssetBalance()public view returns(uint balanceUSD){
        (uint price, uint decimals) = getAssetPriceFromAave(address(WETH9));
        uint SupplyBalance = dTokenDebt.balanceOf(address(this));
        if(SupplyBalance <= 0) return 0;

        uint balanceUSD = (SupplyBalance * price) / decimals;
    }

    function mint(uint256 shares, address receiver) external override nonReentrant returns (uint256 assets) {
        // require(shares > 0 , "shares must be greater than zero");
        // require(receiver != address(0) && receiver != address(this), "receiver shouldn't be 0 address or this contract");        
        // require((shares = previewDeposit(returnAmount)) != 0, "ZERO_SHARES");
        
        // // Need to transfer before minting or ERC777s could reenter.
        // //Wrapping eth to Weth
        // // WETH9.deposit{value : msg.value}(); //TODO
        // bool _status = WETH9.transferFrom(msg.sender, address(this), assets);
        // require(_status == true, "WETH9 trasferFrom failed");

        // uint slippageAmt = calculateSlippageAmount(assets, slippage);

        // uint returnAmount = uniswapV3Swap(SellInfo(
        //     address(WETH9),
        //     asset,
        //     fee,
        //     slippageAmt,
        //     assets
        // ));

        // _mint(receiver, shares);

        // emit Deposit(msg.sender, receiver, returnAmount, shares);
    }

    function previewMint(uint256 shares) external view override returns (uint256 assets) {
        // Your implementation here
    }

    function previewWithdraw(uint256 assets) external view override returns (uint256 shares) {
        // Your implementation here
    }

    function redeem(uint256 shares, address receiver, address owner) external override returns (uint256 assets) {
        // Your implementation here
    }

    receive() external payable {}
}