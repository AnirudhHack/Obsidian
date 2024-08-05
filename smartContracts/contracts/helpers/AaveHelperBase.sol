//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AavePoolProviderInterface, AaveDataProviderInterface } from "../interfaces/aave/AaveInterface.sol";

abstract contract AaveHelperBase {
	/**
	 * @dev Aave Pool Provider
    */
	AavePoolProviderInterface internal constant aaveProvider =
		AavePoolProviderInterface(0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D);
		
	AaveDataProviderInterface internal constant aaveData =
		AaveDataProviderInterface(0x2d8A3C5677189723C4cB8873CfC9C8976FDF38Ac);

	/**
	 * @dev Get total collateral balance for an asset
	 * @param token token address of the collateral.
	 */
    function getCollateralBalance(address token)
		internal
		view
		returns (uint256 bal)
	{
		(bal, , , , , , , , ) = aaveData.getUserReserveData(
			token,
			address(this)
		);
	}

	/**
	 * @dev Get debt token address for an asset
	 * @param token token address of the asset
	 * @param rateMode Debt type: stable-1, variable-2
	 */
	function getDTokenAddr(address token, uint256 rateMode)
		internal
		view
		returns(address dToken)
	{
		if (rateMode == 1) {
			(, dToken, ) = aaveData.getReserveTokensAddresses(token);
		} else {
			(, , dToken) = aaveData.getReserveTokensAddresses(token);
		}
	}
}