"use client"
import Image from "next/image";
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Nav} from "@/components/component/nav";
// import { useSearchParams } from 'next/navigation'
import {deposit, withdraw, wethAllowance, wethbalance, approveWeth, getTvlOfWstheth} from "../../web3Functions/erc4626Vault"
import {getConnectedWalletAddress} from "../../web3Functions/wallet"
import React, { Suspense, useEffect, useState } from "react";
import {ethers} from "ethers"
import { baseAddress } from "@/constants/address/baseAddress";
import numeral from 'numeral'

const strategyToAddress = {
  1: baseAddress.wstETHVault
}

export default function Game() {
  const [strategy, setStrategy] = React.useState('');

  function HandleParam(){
    setStrategy(1)
  }

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   setStrategy(params.get('strategy'));
  // }, []);

  const [amount, setAmount] = React.useState('');
  const [wethAllow, setWethAllowance] = React.useState("0");
  const [wethBal, setWethBal] = React.useState("0");
  const [tvl, setTVL] = React.useState("0");
  // const [strategy, setStrategy] = React.useState(null);
  // Function to handle input changes
  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };
  
  const [walletAddress, setWalletAddress] = React.useState(null);

  React.useEffect(() => {
    // Call the function to get the connected wallet address
    getConnectedWalletAddress().then((address) => {
      // Set the wallet address in the state
      setWalletAddress(address);
    });
  }, [window.ethereum]);
  
  const handleDeposit = async () => {
    try {
      console.log("amount ", amount)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

      const success = await deposit(signer, amount);
      if (success) {
        alert('deposited sucessfully');
      } else {
        alert('Failed to deposit');
      }
    } catch (error) {
      console.error('Error deposit:', error);
      alert('Failed to deposit. Please try again.');
    }
  };

  const handleWithdraw = async () => {
    try {
      console.log("amount ", amount)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

      const success = await withdraw(signer, amount);
      if (success) {
        alert('deposited sucessfully');
      } else {
        alert('Failed to withdraw');
      }
    } catch (error) {
      console.error('Error withdraw:', error);
      alert('Failed to withdraw. Please try again.');
    }
  };

  const handleApprove = async () => {
    try {
      console.log("amount ", amount)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(strategyToAddress[1], " strategyToAddress[strategy]")
      const success = await approveWeth(signer, strategyToAddress[1], amount);
      if (success) {
        alert('approved sucessfully');
      } else {
        alert('Failed to approve');
      }
    } catch (error) {
      console.error('Error approve:', error);
      alert('Failed to approve. Please try again.');
    }
  };

  React.useEffect(() => {
    const checkWethAllowance = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      
      const address = await signer.getAddress();
      console.log(":address, strategyToAddress[strategy]", address, strategyToAddress[1])
      const val = await wethAllowance(provider, address, strategyToAddress[1])
      console.log("allowa ", val )
      setWethAllowance(val)
    }
  
    checkWethAllowance(); // Initial check
  
    const intervalId = setInterval(checkWethAllowance, 3000); // Call checkWethAllowance every 3 seconds
  
    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  }, []);

  React.useEffect(() => {
    const checkWethBal = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      
      const address = await signer.getAddress();
      const val = await wethbalance(provider, address)

      setWethBal(val)
    }
  
    checkWethBal(); // Initial check
  
    const intervalId = setInterval(checkWethBal, 3000); // Call checkWethBal every 3 seconds
  
    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  }, []);

  React.useEffect(() => {
    const getTVL = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      
      const address = await signer.getAddress();
      const val = await getTvlOfWstheth(provider)
      console.log("TVL ", val )
      setTVL(val)
    }
  
    getTVL(); // Initial check
  
    const intervalId = setInterval(getTVL, 3000); // Call getTVL every 3 seconds
  
    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  }, []);

  return (
      (<div className="flex flex-col min-h-[100dvh] bg-background">
        <Nav/>
        {
          strategy == 1 ?
            (
              <section className="flex justify-center w-full  bg-muted">
                <div className=" w-full flex flex-col items-center">
                  <img
                    src="/wstETH.png"
                    width="1200"
                    height="300"
                    alt="WBTC Vault"
                    className="w-full rounded-t-lg object-cover"
                    style={{ aspectRatio: "1200/300", objectFit: "cover" }} />
                    
                <div className="container px-4 md:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>wstETH Vault</CardTitle>
                      <CardDescription>
                        Earn <span className="text-primary font-bold">13% APY</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground">Total Value Locked (TVL)</p>
                            <p className="text-2xl font-bold">${numeral(parseFloat(tvl)).format('0.0a')}</p>
                          </div>
                          <div className="text-sm text-primary font-bold">13% APY</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground">Your Balance</p>
                            <p className="text-2xl font-bold">{parseFloat(wethBal).toFixed(2)} WETH</p>
                          </div>
                          <div className="flex gap-2">
                            <Input type="number" placeholder="Amount" 
                              value={amount} 
                              onChange={handleInputChange}
                            />
                            {
                              amount && parseFloat(amount) <= parseFloat(wethAllow) ?
                                <Button variant="outline" onClick={handleDeposit}>Deposit</Button>
                              :
                                <Button variant="outline" onClick={handleApprove}>Approve</Button>
                            }
                            <Button variant="outline" onClick={handleWithdraw}>Withdraw</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-8 flex flex-col gap-4">
                    <h3 className="text-xl font-bold">Vault Strategy</h3>
                    <p className="text-muted-foreground">
                      Convert WETH to Lido&apos;s wstETH and leverage more wstETH by borrowing WETH in order to increase yield received from staking rewards.
                      <br /><br />
                      While this strategy can increase rewards received through staking, it also has multiple variables and risks you should consider: First, the WETH borrow APY in Aave v3 is variable and may not always be lower than staking rewards received. Second, the value of wstETH versus ETH is also variable and drops in the wstETH/ETH price ratio can make your position risky or cause losses at the moment of exiting the position. Third, please note that the risk of liquidation exists for this type of position and you can find the wstETH/ETH liquidation rate for your position in the top right corner of our Aave dashboard.
                    </p>
                  </div>
                </div>
                </div>
              </section>
            )
          : 
            (<section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div
                className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Vaults</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Earn Competitive Yields</h2>
                  <p
                    className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Explore our selection of secure vaults and find the best opportunities to grow your crypto assets.
                  </p>
                </div>
              </div>
              <div
                className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                <button
                // href="/vault?strategy=1" 
                  prefetch={false} onClick={HandleParam}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>wstETH Vault</CardTitle>
                          <CardDescription>Earn 13% APY</CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">${numeral(parseFloat(tvl)).format('0.0a')} TVL</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground">Your Balance</p>
                          <p className="text-2xl font-bold">{parseFloat(wethBal).toFixed(2)} WETH</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">ERC4626</Button>
                          <Button variant="outline">wstETH</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </button>
                
              </div>
            </div>
          </section>)
        }
      </div>)
  );
}
