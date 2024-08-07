// // SPDX-License-Identifier: AGPL-3.0-only
// pragma solidity ^0.8.0;

// import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol";

// abstract contract IERC4626 is ERC20 {
//     /*///////////////////////////////////////////////////////////////
//                                 Events
//     //////////////////////////////////////////////////////////////*/

//     event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);

//     event Withdraw(
//         address indexed caller,
//         address indexed receiver,
//         address indexed owner,
//         uint256 assets,
//         uint256 shares
//     );


//     /*///////////////////////////////////////////////////////////////
//                             Mutable Functions
//     //////////////////////////////////////////////////////////////*/

//     function deposit(uint256 amount, address to, bytes calldata _data1) external payable virtual returns (uint256 shares);

//     function withdraw(
//         uint256 shares,
//         address to,
//         address from, 
//         bytes calldata _data1
//     ) external virtual returns (uint256 amount);

//     /*///////////////////////////////////////////////////////////////
//                             View Functions
//     //////////////////////////////////////////////////////////////*/

//     function totalAssets() internal view virtual returns (uint256);

//     function assetsOf(address user) external view virtual returns (uint256);

//     function assetsPerShare() external view virtual returns (uint256);

//     function maxDeposit(address) external virtual returns (uint256);

//     function maxMint(address) external virtual returns (uint256);

//     function maxRedeem(address user) external view virtual returns (uint256);

//     function maxWithdraw(address user) external view virtual returns (uint256);

//     /**
//       @notice Returns the amount of vault tokens that would be obtained if depositing a given amount of underlying tokens in a `deposit` call.
//       @param underlyingAmount the input amount of underlying tokens
//       @return shareAmount the corresponding amount of shares out from a deposit call with `underlyingAmount` in
//      */
//     function previewDeposit(uint256 underlyingAmount) internal view virtual returns (uint256 shareAmount);

//     /**
//       @notice Returns the amount of underlying tokens that would be obtained if redeeming a given amount of shares in a `redeem` call.
//       @param shareAmount the amount of shares from a redeem call.
//       @return underlyingAmount the amount of underlying tokens corresponding to the redeem call
//      */
//     function previewRedeem(uint256 shareAmount) internal view virtual returns (uint256 underlyingAmount);
// }