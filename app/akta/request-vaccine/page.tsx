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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  { href: '/akta', label: 'Home' },
  { href: '/akta/vaccine-stock', label: 'Vaccine Stock' },
  { href: '/akta/administer-vaccine', label: 'Administer Vaccine' },
  { href: '/akta/request-vaccine', label: 'Request Vaccine' },
  { href: '/akta/add-vaccine', label: 'Add Vaccine' },
]

const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
const peraWallet = new PeraWalletConnect()

export default function RequestVaccine() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [accountAddress, setAccountAddress] = React.useState<string | null>(null)
  const [balance, setBalance] = React.useState<number | null>(null)
  const isConnectedToPeraWallet = !!accountAddress

  const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false)
  const [vaccineType, setVaccineType] = React.useState("")
  const [urgency, setUrgency] = React.useState("")

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

  const handleRequestVaccine = () => {
    // Here you would typically send the request to your backend
    console.log(`Requesting ${vaccineType} vaccine with ${urgency} urgency`)
    setIsRequestModalOpen(false)
    // Reset form
    setVaccineType("")
    setUrgency("")
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
          <Link href="/akta" className="text-2xl font-bold">
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
          <h1 className="text-4xl font-bold mb-8">Request Vaccine</h1>
          
          <div className="mb-6">
            <p className="text-lg mb-4">
              If you need a vaccine that is not currently available in our inventory, you can request it here. 
              Please provide the type of vaccine you need and the urgency of your request.
            </p>
            <Button onClick={() => setIsRequestModalOpen(true)}>
              Request Vaccine
            </Button>
          </div>
          
          <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
              <DialogHeader>
                <DialogTitle>Request Vaccine</DialogTitle>
                <DialogDescription>
                  Please provide the details for your vaccine request.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vaccine-type" className="text-right">
                    Vaccine Type
                  </Label>
                  <Select onValueChange={setVaccineType} value={vaccineType}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select vaccine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="covid-19">COVID-19</SelectItem>
                      <SelectItem value="flu">Flu</SelectItem>
                      <SelectItem value="mmr">MMR</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="urgency" className="text-right">
                    Urgency
                  </Label>
                  <Select onValueChange={setUrgency} value={urgency}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
                <Button onClick={handleRequestVaccine}>Submit Request</Button>
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