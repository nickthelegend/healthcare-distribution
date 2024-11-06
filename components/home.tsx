'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { WalletIcon, MenuIcon } from "lucide-react"

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/vaccine-stock', label: 'Vaccine Stock' },
  { href: '/administer-vaccine', label: 'Administer Vaccine' },
  { href: '/request-vaccine', label: 'Request Vaccine' },
  { href: '/add-vaccine', label: 'Add Vaccine' },
]

export function HomeComponent() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-4">
        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
          <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
        
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-0 md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-black text-white">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-gray-300 text-lg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to äkta Vaccination Clinic</h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8">
          Our decentralized platform ensures secure and efficient vaccine administration. Connect your wallet to get started.
        </p>
        <Button size="lg" className="text-black bg-white hover:bg-gray-200">
          Learn More
        </Button>
      </main>
    </div>
  )
}