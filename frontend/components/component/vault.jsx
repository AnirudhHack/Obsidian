
// import Link from "next/link"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export function Vault() {
//   return (
//     (<div className="flex flex-col min-h-[100dvh] bg-background">
//       <header className="px-4 lg:px-6 h-14 flex items-center border-b">
//         <Link href="#" className="flex items-center justify-center" prefetch={false}>
//           <VaultIcon className="h-6 w-6" />
//           <span className="sr-only">DeFi Vault</span>
//         </Link>
//         <nav className="ml-auto flex gap-4 sm:gap-6">
//           <Link
//             href="#"
//             className="text-sm font-medium hover:underline underline-offset-4"
//             prefetch={false}>
//             Vaults
//           </Link>
//           <Link
//             href="#"
//             className="text-sm font-medium hover:underline underline-offset-4"
//             prefetch={false}>
//             Dashboard
//           </Link>
//           <Link
//             href="#"
//             className="text-sm font-medium hover:underline underline-offset-4"
//             prefetch={false}>
//             FAQ
//           </Link>
//         </nav>
//       </header>
//       <main className="flex-1">
//         <section className="flex justify-center w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6">
//             <div
//               className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <h1
//                     className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                     Maximize Your DeFi Earnings
//                   </h1>
//                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
//                     Deposit your crypto assets into our secure vaults and earn competitive yields. Enjoy the benefits of
//                     DeFi without the complexity.
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                   <Link
//                     href="#"
//                     className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//                     prefetch={false}>
//                     Explore Vaults
//                   </Link>
//                   <Link
//                     href="#"
//                     className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//                     prefetch={false}>
//                     Deposit Funds
//                   </Link>
//                 </div>
//               </div>
//               <img
//                 src="/placeholder.svg"
//                 width="550"
//                 height="550"
//                 alt="Hero"
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square" />
//             </div>
//           </div>
//         </section>
//         {/* <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-muted">
//           <div className="container px-4 md:px-6">
//             <div
//               className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Vaults</div>
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Earn Competitive Yields</h2>
//                 <p
//                   className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Explore our selection of secure vaults and find the best opportunities to grow your crypto assets.
//                 </p>
//               </div>
//             </div>
//             <div
//               className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
//               <Link href="#" prefetch={false}>
//                 <Card>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle>WBTC Vault</CardTitle>
//                         <CardDescription>Earn 6.2% APY</CardDescription>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$2.3M TVL</div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Your Balance</p>
//                         <p className="text-2xl font-bold">0.5 WBTC</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline">Deposit</Button>
//                         <Button variant="outline">Withdraw</Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//               <Link href="#" prefetch={false}>
//                 <Card>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle>ETH Vault</CardTitle>
//                         <CardDescription>Earn 5.8% APY</CardDescription>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$5.1M TVL</div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Your Balance</p>
//                         <p className="text-2xl font-bold">2.1 ETH</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline">Deposit</Button>
//                         <Button variant="outline">Withdraw</Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//               <Link href="#" prefetch={false}>
//                 <Card>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle>USDC Vault</CardTitle>
//                         <CardDescription>Earn 4.9% APY</CardDescription>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$8.7M TVL</div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Your Balance</p>
//                         <p className="text-2xl font-bold">$5,000 USDC</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline">Deposit</Button>
//                         <Button variant="outline">Withdraw</Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//               <Link href="#" prefetch={false}>
//                 <Card>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle>LINK Vault</CardTitle>
//                         <CardDescription>Earn 7.1% APY</CardDescription>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$1.9M TVL</div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Your Balance</p>
//                         <p className="text-2xl font-bold">50 LINK</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline">Deposit</Button>
//                         <Button variant="outline">Withdraw</Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </div>
//           </div>
//         </section> */}
//         <section className="flex justify-center w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6">
//             <div
//               className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Dashboard</div>
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Manage Your DeFi Portfolio</h2>
//                 <p
//                   className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   View your current vault balances, total value, and transaction history all in one place.
//                 </p>
//               </div>
//             </div>
//             <div
//               className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Your Vault Balances</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">WBTC Vault</p>
//                         <p className="text-2xl font-bold">0.5 WBTC</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$25,000</div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">ETH Vault</p>
//                         <p className="text-2xl font-bold">2.1 ETH</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$7,350</div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">USDC Vault</p>
//                         <p className="text-2xl font-bold">$5,000 USDC</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$5,000</div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">LINK Vault</p>
//                         <p className="text-2xl font-bold">50 LINK</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">$350</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Transaction History</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Deposit WBTC</p>
//                         <p className="text-sm">April 15, 2023</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">+0.5 WBTC</div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Withdraw ETH</p>
//                         <p className="text-sm">March 28, 2023</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">-0.8 ETH</div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Deposit USDC</p>
//                         <p className="text-sm">February 12, 2023</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">+$2,500 USDC</div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-muted-foreground">Deposit LINK</p>
//                         <p className="text-sm">January 5, 2023</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">+25 LINK</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//         <section>
//           <div>
//             <img
//               src="/placeholder.svg"
//               width="1200"
//               height="300"
//               alt="WBTC Vault"
//               className="w-full rounded-t-lg object-cover"
//               style={{ aspectRatio: "1200/300", objectFit: "cover" }} />
//             <Card>
//               <CardHeader>
//                 <CardTitle>WBTC Vault</CardTitle>
//                 <CardDescription>
//                   Earn <span className="text-primary font-bold">6.2% APY</span>
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-muted-foreground">Total Value Locked (TVL)</p>
//                       <p className="text-2xl font-bold">$2.3M</p>
//                     </div>
//                     <div className="text-sm text-primary font-bold">6.2% APY</div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-muted-foreground">Your Balance</p>
//                       <p className="text-2xl font-bold">0.5 WBTC</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Input type="number" placeholder="Amount" />
//                       <Button variant="outline">Deposit</Button>
//                       <Button variant="outline">Withdraw</Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <div className="mt-8 flex flex-col gap-4">
//               <h3 className="text-xl font-bold">Vault Strategy</h3>
//               <p className="text-muted-foreground">
//                 The WBTC Vault employs a yield farming strategy that leverages various DeFi protocols to generate
//                 competitive returns for depositors. The vault's smart contracts automatically manage the deployment of
//                 funds, optimizing for yield while maintaining a high level of security and liquidity.
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>)
//   );
// }

// function VaultIcon(props) {
//   return (
//     (<svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <rect width="18" height="18" x="3" y="3" rx="2" />
//       <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
//       <path d="m7.9 7.9 2.7 2.7" />
//       <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
//       <path d="m13.4 10.6 2.7-2.7" />
//       <circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
//       <path d="m7.9 16.1 2.7-2.7" />
//       <circle cx="16.5" cy="16.5" r=".5" fill="currentColor" />
//       <path d="m13.4 13.4 2.7 2.7" />
//       <circle cx="12" cy="12" r="2" />
//     </svg>)
//   );
// }
