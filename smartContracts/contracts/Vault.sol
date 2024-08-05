// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";
import { IERC4626 } from "./interfaces/IERC4626.sol";
import { SafeTransferLib } from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import "./interfaces/aave/FlashLoanReceiverBase.sol";
import "./interfaces/IWETH9.sol";
import "./helpers/AaveHelperBase.sol";
import { AaveInterface } from "./interfaces/aave/AaveInterface.sol";
import "./helpers/UniswapV3HelperBase.sol";

contract WSTETHVault is FlashLoanReceiverBase, ERC20, IERC4626, ReentrancyGuard, AaveHelperBase, UniswapV3HelperBase{
    using SafeTransferLib for ERC20;

    /**
	 * @dev constructor
	 * @notice Intializes state variables of vault.
	 */
    constructor(
        ERC20 _asset,
        ILendingPoolAddressesProvider _addressProvider
    ) ERC20("wstETHVault", "wstETHV", _asset.decimals()) FlashLoanReceiverBase(_addressProvider) {
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
    * @param _data1 data require for swap
	 */
    function deposit(uint256 assets, address receiver, bytes calldata _data1) external payable nonReentrant override returns (uint256 shares) {
        require(assets > 0 , "assets must be greater than zero");
        require(assets <= msg.value, "amount > msg.value" );
        require(receiver != address(0) && receiver != address(this), "receiver shouldn't be 0 address or this contract");
        require(usersShareToBeMinted[receiver] == 0, "receiver is already minting share.(avoiding reentrancy)");
        
    }


    /**
	 * @dev withdraw
	 * @notice Withdraw function allows user to withdraw there eth amount by burning shares.
	 * @param shares input share amount
	 * @param receiver address of receiver
	 * @param owner address of owner of the shares
	 * @param _data1 data require for swap
	 */
    function withdraw(
        uint256 shares,
        address receiver,
        address owner, 
        bytes calldata _data1
    ) external nonReentrant override returns (uint256 assets) {
        
    }
    
    function totalAssets() internal view override returns (uint256){
        uint amount = getVaultsActualBalance();
        // amount = amount + stEthToken.balanceOf(address(this));
        return amount;
    }

    function assetsOf(address user) external view override returns (uint256){
        return previewRedeem(balanceOf[user]);
    }

    function assetsPerShare() external view override returns (uint256){
        return previewRedeem(10**decimals);
    }

    /**
     * @notice  Internal conversion function (from assets to shares)
     */
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply; // Saves an extra SLOAD if totalSupply is non-zero.

        return supply == 0 ? assets : ((assets * supply) / totalAssets() ) ;
    }

    /**
     * @notice  Internal conversion function (from shares to assets)
    */
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply; // Saves an extra SLOAD if totalSupply is non-zero.

        return supply == 0 ? shares : ((shares * totalAssets()) / supply);
    }

    /**
     * @notice  This function gives amount of supply token and borrow token required to remove in order to remove input assets amount from aave position by keeping the leverage same.
     */
    function convertToSupply(uint256 assets) public view returns (uint256 supplyAmount, uint256 borrowAmount) {
        uint256 amount = getVaultsActualBalance();
        uint supplyBal = getCollateralBalance(address(stEthToken));
        uint borrowBal = getDTokenAddr(address(WETH9), 2);

        supplyAmount = assets == amount ? supplyBal : ((supplyBal * assets) / amount);

        borrowAmount = assets == amount ? borrowBal : ((borrowBal * assets) / amount);
    }

    function previewDeposit(uint256 assets) internal view override returns (uint256) {
        return convertToShares(assets);
    }

    function previewRedeem(uint256 shares) internal view override returns (uint256) {
        return convertToAssets(shares);
    }

    function maxDeposit(address) external pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxMint(address) external pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxWithdraw(address owner) external view override returns (uint256) {
        return convertToAssets(balanceOf[owner]);
    }

    function maxRedeem(address owner) external view override returns (uint256) {
        return balanceOf[owner];
    }

    function getVaultsActualBalance() public view returns(uint amount){
        uint supplyBal = getCollateralBalance(address(stEthToken));
        uint borrowBal = getDTokenAddr(address(WETH9), 2);
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

    receive() external payable {}
}