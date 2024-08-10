"use client"
import Image from "next/image";
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Nav} from "@/components/component/nav";
import { useSearchParams } from 'next/navigation'

export default function Game() {
  const searchParams = useSearchParams()
 
  const strategy = searchParams.get('strategy')
  console.log(strategy)

  return (
      (<div className="flex flex-col min-h-[100dvh] bg-background">
        <Nav/>
        {
          strategy == 1 ?
            (
              <section className="flex justify-center w-full  bg-muted">
                <div className=" w-full flex flex-col items-center">
                  <img
                    src="/placeholder.svg"
                    width="1200"
                    height="300"
                    alt="WBTC Vault"
                    className="w-full rounded-t-lg object-cover"
                    style={{ aspectRatio: "1200/300", objectFit: "cover" }} />
                    
                <div className="container px-4 md:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>WBTC Vault</CardTitle>
                      <CardDescription>
                        Earn <span className="text-primary font-bold">6.2% APY</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground">Total Value Locked (TVL)</p>
                            <p className="text-2xl font-bold">$2.3M</p>
                          </div>
                          <div className="text-sm text-primary font-bold">6.2% APY</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground">Your Balance</p>
                            <p className="text-2xl font-bold">0.5 WBTC</p>
                          </div>
                          <div className="flex gap-2">
                            <Input type="number" placeholder="Amount" />
                            <Button variant="outline">Deposit</Button>
                            <Button variant="outline">Withdraw</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-8 flex flex-col gap-4">
                    <h3 className="text-xl font-bold">Vault Strategy</h3>
                    <p className="text-muted-foreground">
                      The WBTC Vault employs a yield farming strategy that leverages various DeFi protocols to generate
                      competitive returns for depositors. The vault's smart contracts automatically manage the deployment of
                      funds, optimizing for yield while maintaining a high level of security and liquidity.
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
                <Link href="/vault?strategy=1" prefetch={false}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>wstETH Vault</CardTitle>
                          <CardDescription>Earn 6.2% APY</CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">$2.3M TVL</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground">Your Balance</p>
                          <p className="text-2xl font-bold">0.5 WBTC</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">Deposit</Button>
                          <Button variant="outline">Withdraw</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="#" prefetch={false}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>ETH Vault</CardTitle>
                          <CardDescription>Earn 5.8% APY</CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">$5.1M TVL</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground">Your Balance</p>
                          <p className="text-2xl font-bold">2.1 ETH</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">Deposit</Button>
                          <Button variant="outline">Withdraw</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>)
        }
      </div>)
  );
}
