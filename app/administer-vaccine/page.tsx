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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { WalletIcon, MenuIcon, Settings, User } from 'lucide-react'
import { cn } from "@/lib/utils"
import { PeraWalletConnect } from "@perawallet/connect"
import algosdk from "algosdk"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/vaccine-stock', label: 'Vaccine Stock' },
  { href: '/administer-vaccine', label: 'Administer Vaccine' },
  { href: '/request-vaccine', label: 'Request Vaccine' },
  { href: '/add-vaccine', label: 'Add Vaccine' },
]

const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
const peraWallet = new PeraWalletConnect()

interface Vaccine {
  id: number
  name: string
  manufacturer: string
  quantity: number
  expirationDate: string
}

export default function AdministerVaccine() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [accountAddress, setAccountAddress] = React.useState<string | null>(null)
  const [balance, setBalance] = React.useState<number | null>(null)
  const isConnectedToPeraWallet = !!accountAddress

  const [vaccines, setVaccines] = React.useState<Vaccine[]>([
    { id: 1, name: "COVID-19 Vaccine", manufacturer: "Pfizer", quantity: 1000, expirationDate: "2023-12-31" },
    { id: 2, name: "Flu Vaccine", manufacturer: "Moderna", quantity: 500, expirationDate: "2024-06-30" },
  ])
  const [selectedVaccine, setSelectedVaccine] = React.useState<Vaccine | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false)

  React.useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick)

        if (accounts.length) {
          setAccountAddress(accounts[0])
          fetchAccountBalance(accounts[0])
        }
      })
      .catch((e) => console.log(e))
  }, [])

  const fetchAccountBalance = async (address: string) => {
    try {
      const accountInfo = await algodClient.accountInformation(address).do()
      const accountBalance = algosdk.microalgosToAlgos(accountInfo.amount)
      setBalance(accountBalance)
    } catch (error) {
      console.log("Failed to fetch account balance", error)
    }
  }

  const handleConnectWalletClick = () => {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick)
        setAccountAddress(newAccounts[0])
        fetchAccountBalance(newAccounts[0])
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error)
        }
      })
  }

  const handleDisconnectWalletClick = () => {
    if (isConnectedToPeraWallet) {
      peraWallet.disconnect()
      setAccountAddress(null)
      setBalance(null)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }

  const handleUseVaccine = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine)
    setIsConfirmModalOpen(true)
  }

  const confirmUseVaccine = () => {
    if (selectedVaccine) {
      setVaccines(vaccines.map(v => 
        v.id === selectedVaccine.id 
          ? { ...v, quantity: v.quantity - 1 } 
          : v
      ))
      setIsConfirmModalOpen(false)
      setSelectedVaccine(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100/10 via-gray-900/5 to-transparent animate-pulse-slow"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-100/10 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-100/10 to-transparent"></div>
        </div>
      </div>

      <header className="relative z-10 flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
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
          {isConnectedToPeraWallet ? (
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="text-white">
                <Settings className="w-6 h-6" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    <User className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="truncate overflow-hidden whitespace-nowrap">
                      {truncateText(accountAddress, 12)}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDisconnectWalletClick} className="text-red-500">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={handleConnectWalletClick} variant="ghost" className="text-white border-white hover:bg-white hover:text-black">
              <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          )}
          
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
                  {isConnectedToPeraWallet ? (
                    <Button className="w-full justify-start text-left" variant="destructive" onClick={handleDisconnectWalletClick}>
                      <WalletIcon className="mr-2 h-4 w-4" /> Disconnect Wallet
                    </Button>
                  ) : (
                    <Button className="w-full justify-start text-left" variant="ghost" onClick={handleConnectWalletClick}>
                      <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Administer Vaccine</h1>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Available Vaccines</h2>
            <div className="rounded-md border border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Manufacturer</TableHead>
                    <TableHead className="text-white">Quantity</TableHead>
                    <TableHead className="text-white">Expiration Date</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccines.map((vaccine) => (
                    <TableRow key={vaccine.id}>
                      <TableCell className="font-medium">{vaccine.name}</TableCell>
                      <TableCell>{vaccine.manufacturer}</TableCell>
                      <TableCell>{vaccine.quantity}</TableCell>
                      <TableCell>{vaccine.expirationDate}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleUseVaccine(vaccine)}
                          disabled={vaccine.quantity === 0}
                        >
                          Use
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
              <DialogHeader>
                <DialogTitle>Confirm Vaccine Administration</DialogTitle>
                <DialogDescription>
                  Are you sure you want to administer this vaccine?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {selectedVaccine && (
                  <p>
                    You are about to use 1 dose of {selectedVaccine.name} manufactured by {selectedVaccine.manufacturer}.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                <Button onClick={confirmUseVaccine}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <footer className="relative z-10 bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">äkta Vaccination Clinic</h3>
              <p className="text-sm text-gray-400">Secure and efficient vaccine administration on the blockchain.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm text-gray-400">Email: info@aktavaccine.com</p>
              <p className="text-sm text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">&copy; 2023 äkta Vaccination Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}