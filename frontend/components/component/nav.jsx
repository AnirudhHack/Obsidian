"use client"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ConnectWallet from "./ConnectWallet"

export function Nav() {
  return (
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <VaultIcon className="h-6 w-6" />
          <h2>Obsidian</h2>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            style={{marginRight: "8px"}}
            href="https://github.com/AnirudhHack/Obsidian.git"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}>
            Doc
          </Link>

        </nav>
          <div>
            <ConnectWallet/>
            </div>
      </header>
  );
}

function VaultIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      <path d="m7.9 7.9 2.7 2.7" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
      <path d="m13.4 10.6 2.7-2.7" />
      <circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
      <path d="m7.9 16.1 2.7-2.7" />
      <circle cx="16.5" cy="16.5" r=".5" fill="currentColor" />
      <path d="m13.4 13.4 2.7 2.7" />
      <circle cx="12" cy="12" r="2" />
    </svg>)
  );
}
