// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC4626.sol";
// import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import { IERC4626 } from "./interfaces/IERC4626.sol";
import { SafeTransferLib } from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import "./interfaces/IWETH9.sol";
import "./helpers/AaveHelperBase.sol";
import { AaveInterface, IAaveV3Oracle } from "./interfaces/aave/AaveInterface.sol";
import "./helpers/UniswapV3HelperBase.sol";
import {FlashLoanSimpleReceiverBase} from  "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from  "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract WSTETHVault is FlashLoanSimpleReceiverBase, ERC20, IERC4626, ReentrancyGuard, AaveHelperBase, UniswapV3HelperBase{
    using SafeTransferLib for ERC20;

    address public immutable asset;
    IWETH9 immutable WETH9;
    address public governance;
    address public pendingGovernance;
    uint public slippage;
    uint24 public fee = 100;

    event PendingGovernance(address indexed governance);
    event GovernanceAccepted(address indexed newGovernance);

    struct RebalanceInput{
        uint supplyAmount;
        uint flAmount;
        uint flAmountWithFee;
        uint slippagePercent;
    }

    enum VauitAction{
        Rebalance
    }

    /**
	 * @dev constructor
	 * @notice Intializes state variables of vault.
	 * @param _asset The address of the token to be supplied.
	 * @param _weth9 address of WETH9
	 */
    constructor(
        address _asset,
        address _addressProvider,
        address _weth9,
        uint _slippage
    ) ERC20("wstETHVault", "wstETHV") FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
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
        WETH9.transfer(receiver, returnAmount);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }

    function rebalance(uint supplyAmount, uint flAmount, uint flAmountWithFee, uint slippagePercent)private {
        AaveInterface aave = AaveInterface(aaveProvider.getPool());

        uint slippageAmt = calculateSlippageAmount(supplyAmount, slippagePercent);

        uint returnAmount = uniswapV3Swap(SellInfo(
            address(WETH9),
            asset,
            fee,
            slippageAmt,
            flAmount
        ));

        supplyAmount += returnAmount;
        // call supply
        ERC20(asset).approve(address(aave), supplyAmount);
        aave.supply(asset, supplyAmount, address(this), 0);

        aave.borrow(address(WETH9), flAmountWithFee, 2, 0, address(this));
    }

    function executeOperation(
        address assetaddr,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // require(msg.sender == address(LENDING_POOL), "only lending pool");
        // require(address(this) == initiator, "Untrusted loan initiator");
        // AaveInterface aave = AaveInterface(aaveProvider.getPool());

        // // abi.decode(params) to decode params
        // (uint8 operation, bytes memory data, address receiver, ,) = abi.decode(params, (uint8, bytes, address, uint, uint));
        // uint24 fee = 3000;
        // uint slippageAmt = 10;
        // // deposit and reinvestIdleWeth logic
        // if(operation == 0 || operation == 4){
        //     uint supplyAmount;
        //     if(vaultsLeverage == Leverage.Three) supplyAmount = amounts[0] + (amounts[0]/2);
        //     else supplyAmount = amounts[0] + amounts[0];
            
        //     uint returnAmount = uniswapV3Swap(SellInfo(
        //         address(WETH9),
        //         asset,
        //         fee,
        //         slippageAmt,
        //         supplyAmount
        //     ));

        //     // calculating assets in steth on which share to be calculated and minted (only for operation 1 (deposit))
        //     if(operation == 0){
        //         uint inputUserAssets;
        //         if(vaultsLeverage == Leverage.Three) inputUserAssets = returnAmount / 3;
        //         else inputUserAssets = returnAmount / 2;
                
        //         uint shares;
        //         require((shares = previewDeposit(inputUserAssets)) != 0, "ZERO_SHARES");
        //         usersShareToBeMinted[receiver] = shares;
        //     }

        //     // call supply
        //     ERC20(asset).approve(address(aave), returnAmount);
        //     aave.supply(asset, returnAmount, address(this), 0);

        //     aave.borrow(address(WETH9), amounts[0], 2, 0, address(this));
        // }
        // //withdraw
        // else if(operation == 1){
        //     ( , , , ,uint withdrawAmount) = abi.decode(params, (uint8, bytes, address, uint, uint));

        //     // repay Weth on aave
        //     WETH9.approve(address(aave), amounts[0]);
        //     aave.repay(address(WETH9), amounts[0], 2, address(this));

        //     // withdraw stEth from aave
        //     aave.withdraw(asset, withdrawAmount, address(this));

        //     // swap 
        //     uint returnAmount = uniswapV3Swap(SellInfo(
        //         asset,
        //         address(WETH9),
        //         fee,
        //         slippageAmt,
        //         withdrawAmount
        //     ));
        //     uint userReceivable = returnAmount - (amounts[0] + premiums[0]);
        //     WETH9.withdraw(userReceivable);
        //     payable(receiver).transfer(userReceivable);
        // }
        // // Deleverage to 2x
        // else if(operation == 2){
        //     ( , , , uint swapAmount,) = abi.decode(params, (uint8, bytes, address, uint, uint));

        //     // repay Weth on aave
        //     WETH9.approve(address(aave), amounts[0]);
        //     aave.repay(address(WETH9), amounts[0], 2, address(this));

        //     // withdraw stEth from aave
        //     aave.withdraw(asset, swapAmount, address(this));

        //     // swap steth to Weth
        //     uniswapV3Swap(SellInfo(
        //         asset,
        //         address(WETH9),
        //         fee,
        //         slippageAmt,
        //         swapAmount
        //     ));
        // }
        // // leverage 2x to 3x
        // else if(operation == 3){
        //     // swap Weth to supplyToken
        //     uint returnAmount = uniswapV3Swap(SellInfo(
        //         address(WETH9),
        //         asset,
        //         fee,
        //         slippageAmt,
        //         amounts[0]
        //     ));

        //     ERC20(asset).approve(address(aave), returnAmount);
        //     aave.supply(asset, returnAmount, address(this), 0);

        //     aave.borrow(address(WETH9), amounts[0] + premiums[0], 2, 0, address(this));
        // }

        uint amountOwing = amount + premium;
        (VauitAction _action, bytes memory _actionParam) = abi.decode(params, (VauitAction, bytes));
        RebalanceInput memory _rebalance = abi.decode(_actionParam, (RebalanceInput));
        _rebalance.flAmountWithFee = amountOwing;
        
        rebalance(_rebalance.supplyAmount, _rebalance.flAmount, _rebalance.flAmountWithFee, _rebalance.slippagePercent);

        IERC20(assetaddr).approve(aaveProvider.getPool(), amountOwing);
        
        // repay Aave
        return true;
    }

    // /**
	//  * @dev callFlashLoan
	//  * @notice callFlashLoan function triggers aave flashloan in order to perform any opration like open position, Close position, deleverage, leverage.
	//  * @param operation operation from enum operation
	//  * @param amount amount
	//  * @param _data1 data require for swap (dev : data is received from 1inch api by calling it offchain).
	//  * @param _receiver receiver
	//  */
    function callFlashloan(address assetAddr, uint flashLoanAmount, bytes calldata param)public {
        // uint supplyAmount;
        // if(operation == 1){
        //     // withdraw as per current leverage
        //     (supplyAmount, amount) = convertToSupply(amount);
        // }
        // address[] memory assets = new address[](1);
        // assets[0] = address(WETH9);

        // uint[] memory amounts = new uint[](1);
        // amounts[0] = amount;

        // // 0 = no debt, 1 = stable, 2 = variable
        // // 0 = pay all loaned
        // uint[] memory modes = new uint[](1);
        // modes[0] = 0;
        
        // (, SwapDescription memory desc,) = abi.decode(_data1[4:], (address, SwapDescription, bytes)); 

        // bytes memory params = abi.encode(operation, _data1, _receiver, desc.amount, supplyAmount); // extra data to pass abi.encode(...)
        // // uint16 referralCode = 0;


        AaveInterface(aaveProvider.getPool()).flashLoanSimple(
            address(this),
            assetAddr,
            flashLoanAmount,
            param,
            0
        );
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

    // /**
	//  * @dev deleverage
	//  * @notice Deleverage function can only be called by governance and it is used to deleverage the vault.
	//  * @param amount  amount of borrwed Weth need to repay to deleverage the vault (this is given by function getborrowedAmountForDeleverage() )
	//  * @param _data1 data require for swap (dev : data is received from 1inch api by calling it offchain).
	//  */
    // function deleverage(uint amount, bytes calldata _data1) external nonReentrant onlyGovernance{
    //     require(vaultsLeverage != Leverage.One, "can't go below 1x");
        
    //     triggerFlashLoan(uint8(Operation.Deleverage), amount, _data1, msg.sender);
    //     if(vaultsLeverage == Leverage.Three) vaultsLeverage = Leverage.Two;
    //     else vaultsLeverage = Leverage.One;
    // }

    // /**
	//  * @dev leverage
	//  * @notice leverage function can only be called by governance and it is used to leverage the vault.
	//  * @param amount amount of Weth need to borrow to leverage the vault  (this is given by function getVaultsActualBalance() )
	//  * @param _data1 data require for swap (dev : data is received from 1inch api by calling it offchain).
	//  */
    // function leverage(uint amount, bytes calldata _data1) external nonReentrant onlyGovernance{
    //     require(vaultsLeverage != Leverage.Three, "can't go above 3x");
        
    //     triggerFlashLoan(uint8(Operation.Leverage), amount, _data1, msg.sender);
    //     if(vaultsLeverage == Leverage.Two) vaultsLeverage = Leverage.Three;
    //     else vaultsLeverage = Leverage.Two;
    // }

    // function _open1xLeverage(uint amount, bytes calldata data, address receiver)private {
        
    //     WETH9.approve(AGGREGATION_ROUTER_V5, amount);
    //     uint returnAmount = swap(data);

    //     uint shares;
    //     require((shares = previewDeposit(returnAmount)) != 0, "ZERO_SHARES");
    //     usersShareToBeMinted[receiver] = shares;

    //     AaveInterface aave = AaveInterface(aaveProvider.getPool());
    //     ERC20(asset).approve(address(aave), returnAmount);
    //     aave.supply(asset, address(this), returnAmount);
    // }

    // function _close1xLeverage(uint amount, bytes calldata data, address _receiver) private{
    //     // withdraw stEth from morpho
    //     morpho.withdraw(pollToken, amount);

    //     // swap stEth to Weth
    //     ERC20(asset).approve(AGGREGATION_ROUTER_V5, amount);
    //     uint returnAmount = swap(data);
    //     WETH9.withdraw(returnAmount);
    //     payable(_receiver).transfer(returnAmount);
    // }

    
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

    // // This function returns amount of borrwed Weth need to repay to deleverage the vault.
    // function getborrowedAmountForDeleverage() public view returns(uint amount){
    //     require(vaultsLeverage != Leverage.One, "can't go below 1x");
    //     uint borrowBal = getDTokenAddr(address(WETH9), 2);
    //     if(vaultsLeverage == Leverage.Two){
    //         amount = borrowBal;
    //     }
    //     else{
    //         uint vaultBal = getVaultsActualBalance();
    //         amount = borrowBal - vaultBal;
    //     }
    // }

    // function getborrowedAmountForleverage() public view returns(uint amount){
    //     require(vaultsLeverage != Leverage.Three, "can't go above 3x");
    //     uint vaultBal = getVaultsActualBalance();
    //         amount = vaultBal;
    // }

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

    function getCollateralAssetBalance()public view returns(uint){ //usd
        (uint price, uint decimals) = getAssetPriceFromAave(asset);
        uint SupplyBalance = aTokenSupply.balanceOf(address(this));
        uint idleBalance = ERC20(asset).balanceOf(address(this));
        uint totalBal = idleBalance + SupplyBalance;
        if(totalBal <= 0) return 0;

        uint balanceUSD = (totalBal * price) / decimals;
        return balanceUSD;
    }

    function getDebtAssetBalance()public view returns(uint){
        (uint price, uint decimals) = getAssetPriceFromAave(address(WETH9));
        uint SupplyBalance = dTokenDebt.balanceOf(address(this));
        if(SupplyBalance <= 0) return 0;

        uint balanceUSD = (SupplyBalance * price) / decimals;
        return balanceUSD;
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