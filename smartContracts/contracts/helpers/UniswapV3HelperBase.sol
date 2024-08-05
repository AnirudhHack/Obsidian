//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "../interfaces/UniswapV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract UniswapV3HelperBase {
	/**
	 * @dev uniswap v3 Swap Router
	 */
	ISwapRouter02 constant swapRouter =
		ISwapRouter02(0x2626664c2603336E57B271c5C0b26F421741e481);


	struct SellInfo {
		address buyAddr; //token to be bought
		address sellAddr; //token to be sold
		uint24 fee; //pool fees for buyAddr-sellAddr token pair
		uint256 slippageAmt; //slippage.
		uint256 sellAmt; //amount of token to be bought
	}

	/**
	 * @dev Swap Function
	 * @notice Swap token(sellAddr) with token(buyAddr), to get max buy tokens
	 * @param sellData Data input for the sell action
	 */
	function uniswapV3Swap(
		SellInfo memory sellData
	) internal returns(uint) {
		
		IERC20(sellData.sellAddr).approve(address(swapRouter), sellData.sellAmt);
		ExactInputSingleParams memory params = ExactInputSingleParams({
			tokenIn: sellData.sellAddr,
			tokenOut: sellData.buyAddr,
			fee: sellData.fee,
			recipient: address(this),
			amountIn: sellData.sellAmt,
			amountOutMinimum: sellData.slippageAmt, 
			sqrtPriceLimitX96: 0
		});
		uint256 _buyAmt = swapRouter.exactInputSingle(params);
		require(sellData.slippageAmt <= _buyAmt, "slippage hit");
		return _buyAmt;
	}
}