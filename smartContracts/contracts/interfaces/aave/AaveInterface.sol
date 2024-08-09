//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface AaveInterface {
	function supply(
		address asset,
		uint256 amount,
		address onBehalfOf,
		uint16 referralCode
	) external;

	function withdraw(
		address asset,
		uint256 amount,
		address to
	) external returns (uint256);

	function borrow(
		address asset,
		uint256 amount,
		uint256 interestRateMode,
		uint16 referralCode,
		address onBehalfOf
	) external;

	function repay(
		address asset,
		uint256 amount,
		uint256 interestRateMode,
		address onBehalfOf
	) external returns (uint256);
	
	function flashLoanSimple( address receiverAddress, address asset, uint256 amount, bytes calldata params, uint16 referralCode) external;

	function repayWithATokens(
		address asset,
		uint256 amount,
		uint256 interestRateMode
	) external returns (uint256);

	function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)
		external;

	function swapBorrowRateMode(address asset, uint256 interestRateMode)
		external;

	function setUserEMode(uint8 categoryId) external;
}

interface AavePoolProviderInterface {
	function getPool() external view returns (address);
	function getPriceOracle() external view returns (address);
}

interface AaveDataProviderInterface {
	function getReserveTokensAddresses(address _asset)
		external
		view
		returns (
			address aTokenAddress,
			address stableDebtTokenAddress,
			address variableDebtTokenAddress
		);

	function getUserReserveData(address _asset, address _user)
		external
		view
		returns (
			uint256 currentATokenBalance,
			uint256 currentStableDebt,
			uint256 currentVariableDebt,
			uint256 principalStableDebt,
			uint256 scaledVariableDebt,
			uint256 stableBorrowRate,
			uint256 liquidityRate,
			uint40 stableRateLastUpdated,
			bool usageAsCollateralEnabled
		);

	function getReserveEModeCategory(address asset)
		external
		view
		returns (uint256);
}

interface IPriceOracleGetter {
  /**
   * @notice Returns the base currency address
   * @dev Address 0x0 is reserved for USD as base currency.
   * @return Returns the base currency address.
   **/
  function BASE_CURRENCY() external view returns (address);

  /**
   * @notice Returns the base currency unit
   * @dev 1 ether for ETH, 1e8 for USD.
   * @return Returns the base currency unit.
   **/
  function BASE_CURRENCY_UNIT() external view returns (uint256);

  /**
   * @notice Returns the asset price in the base currency
   * @param asset The address of the asset
   * @return The price of the asset
   **/
  function getAssetPrice(address asset) external view returns (uint256);
}


interface IAaveV3Oracle is IPriceOracleGetter {
    
}

interface IAToken {
	function balanceOf(address _user) external view returns (uint256);
}

interface IDToken {
	function balanceOf(address _user) external view returns (uint256);
}