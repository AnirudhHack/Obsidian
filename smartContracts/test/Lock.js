const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
// const https = require('https');

describe("WSTETHVault", function () {

  let asset, weth, accounts, user, vault

  beforeEach(async function () {
    asset = "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452"
    const addressProvider = "0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D"
    weth = "0x4200000000000000000000000000000000000006"

    const Vault = await ethers.getContractFactory("WSTETHVault");
    vault = await Vault.deploy(
      asset,
      addressProvider,
      weth,
      50000,
      // {gasLimit: 10000000}
    );

    accounts = await ethers.getSigners();
    user = await accounts[0].getAddress();
  })

  // describe("deposit", function () {
  //   it("Genesis deposit", async function () {
  //     let amount = ethers.utils.parseEther("0.1");

  //     let wethContract = await hre.ethers.getContractAt("IWETH9", weth);
  //     await wethContract.deposit({value: amount})

  //     await wethContract.approve(vault.address, amount)
      
  //     let assetContract = await hre.ethers.getContractAt("IERC20", asset);
  //     const balBefore = await assetContract.balanceOf(vault.address)
  //     console.log("balBefore : ", balBefore.toString())
          
  //     const tx = await vault.connect(accounts[0]).deposit(amount.toString(), user, {gasLimit: 10000000});
  //     await tx.wait();

  //     const balAfter = await assetContract.balanceOf(vault.address)
  //     console.log("balAfter : ", balAfter.toString())

  //     const shares = await vault.balanceOf(user);
  //     console.log("Share bal : ", shares.toString())

  //     const totals = await vault.totalSupply()
  //     const totalAssets = await vault.totalAssets()
  //     const coll = await vault.getCollateralAssetBalance()
  //     const price = await vault.getAssetPriceFromAave(asset)
  //     console.log("console ", totals.toString(), totalAssets.toString(), coll.toString(), price[0].toString(), price[1].toString() )

  //     const tx1 = await vault.connect(accounts[0]).withdraw(shares.toString(), user, user, {gasLimit: 10000000});
  //     await tx1.wait();
      
  //     const sharesAfter = await vault.balanceOf(user);
  //     console.log("Share bal after withdraw : ", sharesAfter.toString())

      
  //     const UserbalAfter = await wethContract.balanceOf(user)
  //     console.log("UserbalAfter : ", UserbalAfter.toString())
        
  //     // expect(ethers.utils.formatEther(borrowedAmount[2].toString())).to.equal("2.0");
  //     // expect(await stEthVault.balanceOf(user)).to.equal(amountWithoutFee);   

  //   });

  // });

  describe("rebalance", function () {
    it("rebalance", async function () {
      let amount = ethers.utils.parseEther("0.1");

      let wethContract = await hre.ethers.getContractAt("IWETH9", weth);
      await wethContract.deposit({value: amount})

      await wethContract.approve(vault.address, amount)
      
      let assetContract = await hre.ethers.getContractAt("IERC20", asset);
      const balBefore = await assetContract.balanceOf(vault.address)
      console.log("balBefore : ", balBefore.toString())
          
      const tx = await vault.connect(accounts[0]).deposit(amount.toString(), user, {gasLimit: 10000000});
      await tx.wait();

      const balAfter = await assetContract.balanceOf(vault.address)
      console.log("balAfter : ", balAfter.toString())

      const shares = await vault.balanceOf(user);
      console.log("Share bal : ", shares.toString())

      const totals = await vault.totalSupply()
      const totalAssets = await vault.totalAssets()
      const coll = await vault.getCollateralAssetBalance()
      // const price = await vault.getAssetPriceFromAave(asset)
      console.log("console ", totals.toString(), totalAssets.toString(), coll.toString()) //, price[0].toString(), price[1].toString() )

      const abiCoder = new ethers.utils.AbiCoder();

      const types = [
        'uint256', // supplyAmount
        'uint256', // flAmount
        'uint256', // flAmountWithFee
        'uint256'  // slippagePercent
      ];

      const paramTypes = [
        'uint8', // vaultAction
        'bytes' // actionParam
      ];
      
      // Define the values
      const supplyAmount = ethers.utils.parseEther("0.0848663"); //0.1697326
      const flAmount = ethers.utils.parseEther("0.1");
      const flAmountWithFee = 0;
      const slippagePercent = 50000;
      
      // Encode the values
      const encodedActionParams = abiCoder.encode(types, [supplyAmount, flAmount, flAmountWithFee, slippagePercent]);

      const encodedParams = abiCoder.encode(paramTypes, [0, encodedActionParams]);
    

      const tx1 = await vault.connect(accounts[0]).callFlashloan(weth, flAmount, encodedParams, {gasLimit: 10000000});
      await tx1.wait();
      
      const sharesAfter = await vault.balanceOf(user);
      console.log("Share bal after withdraw : ", sharesAfter.toString())

      
      const UserbalAfter = await wethContract.balanceOf(user)
      console.log("UserbalAfter : ", UserbalAfter.toString())

      
      let aToken = await hre.ethers.getContractAt("IAToken", "");
      const abalance = await aToken.balanceOf(vault.address)
      console.log("supplyAmount : ", supplyAmount.toString())
      console.log("abalance : ", abalance.toString())
      
      let dToken = await hre.ethers.getContractAt("IDToken", "");
      const dbalBefore = await dToken.balanceOf(vault.address)
      console.log("dbalBefore : ", dbalBefore.toString())


        
      // expect(ethers.utils.formatEther(borrowedAmount[2].toString())).to.equal("2.0");
      // expect(await stEthVault.balanceOf(user)).to.equal(amountWithoutFee);   

    });

  });
});