const {ethers} = require("ethers")
const erc4626vaultAbi = require("../constants/abi/ERC4626Vault.json")
const wethAbi = require("../constants/abi/IWETH.json")
const {baseAddress} = require("../constants/address/baseAddress")

export async function deposit(signer, amount) {
    try {
        if(parseFloat(amount) <= 0) throw new Error("amount must be greater than 0")
        // Create a new instance of the contract
        const contract = new ethers.Contract(baseAddress.wstETHVault, erc4626vaultAbi, signer);
        const address = await signer.getAddress();
        amount = ethers.utils.parseEther(amount)
        
        const tx = await contract.deposit(amount, address, {gasLimit: "1000000"});
        console.log('Transaction hash:', tx.hash);
    
        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();
        
        return true
    } catch (error) {
      console.error('Error deposit: ', error);
      return false
    }
}

export async function withdraw(signer, amount) {
    try {
        if(parseFloat(amount) <= 0) throw new Error("amount must be greater than 0")
        // Create a new instance of the contract
        const contract = new ethers.Contract(baseAddress.wstETHVault, erc4626vaultAbi, signer);
        const address = await signer.getAddress();
        amount = ethers.utils.parseEther(amount)
        
        const tx = await contract.withdraw(amount, address, address, {gasLimit: "1000000"});
        console.log('Transaction hash:', tx.hash);
    
        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();
        
        return true
    } catch (error) {
      console.error('Error withdraw: ', error);
      return false
    }
}

export async function approveWeth(signer, toAddress, amount) {
  try {
    if(parseFloat(amount) <= 0) throw new Error("amount must be greater than 0")
    // Create a new instance of the contract
    const contract = new ethers.Contract(baseAddress["weth"], wethAbi, signer);
    const address = await signer.getAddress();
    amount = ethers.utils.parseEther(amount)
    
    const tx = await contract.approve(toAddress, amount, {gasLimit: "1000000"});

    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();
    
    return true
  } catch (error) {
    console.error('Error approveWeth: ', error);
    return false
  }
}

/////////// GET FUNCTIONS 

export async function getTvlOfWstheth(provider) {
  try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(baseAddress.wstETHVault, erc4626vaultAbi, provider);
      
      const bal = await contract.getVaultsActualBalance();
      return ethers.utils.formatEther(bal.toString())
  } catch (error) {
    console.error('Error getTvlOfWstheth: ', error);
    return "0"
  }
}

export async function wstethVaultSharesOf(provider, address) {
  try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(baseAddress.wstETHVault, erc4626vaultAbi, provider);
      
      const bal = await contract.balanceOf(address);
      return ethers.utils.formatEther(bal.toString())
  } catch (error) {
    console.error('Error wstethVaultSharesOf: ', error);
    return "0"
  }
}

export async function wethbalance(provider, address) {
  try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(baseAddress.weth, wethAbi, provider);
      
      const bal = await contract.balanceOf(address);
      return ethers.utils.formatEther(bal.toString())
  } catch (error) {
    console.error('Error wethbalance: ', error);
    return "0"
  }
}

export async function wethAllowance(provider, ownerAddress, toAddress) {
  try {
      // Create a new instance of the contract
      const contract = new ethers.Contract(baseAddress["weth"], wethAbi, provider);
      
      const bal = await contract.allowance(ownerAddress, toAddress);
      return ethers.utils.formatEther(bal.toString())
  } catch (error) {
    console.error('Error wethbalance: ', error);
    return "0"
  }
}