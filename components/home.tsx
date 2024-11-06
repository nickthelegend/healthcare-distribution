'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { WalletIcon, MenuIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/vaccine-stock', label: 'Vaccine Stock' },
  { href: '/administer-vaccine', label: 'Administer Vaccine' },
  { href: '/request-vaccine', label: 'Request Vaccine' },
  { href: '/add-vaccine', label: 'Add Vaccine' },
]

export default function Home() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100/10 via-gray-900/5 to-transparent animate-pulse-slow"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-100/10 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-100/10 to-transparent"></div>
        </div>
      </div>

      <header className="relative z-10 flex justify-between items-center p-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            äkta
          </Link>
        </div>
        
        <div className="hidden md:flex justify-center flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" className="text-white border-white hover:bg-white hover:text-black mr-4 md:mr-0">
            <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-0 md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-gray-800 bg-black/95 backdrop-blur-xl">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-8 mt-4">
                  <Link href="/" className="text-2xl font-bold">
                    äkta
                  </Link>
                </div>
                <nav className="flex-1">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center px-4 py-3 text-lg transition-colors",
                        "hover:bg-gray-800/50",
                        pathname === item.href && "bg-gray-800/50 font-medium"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={cn(
                        "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-white/5 to-white/20 opacity-0 transition-opacity",
                        pathname === item.href && "opacity-100"
                      )} />
                      <span>{item.label}</span>
                      <div className="absolute right-4 opacity-0 transform translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        →
                      </div>
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-gray-800 pt-4 pb-6">
                  <Button className="w-full justify-start text-left" variant="ghost">
                    <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-8">
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