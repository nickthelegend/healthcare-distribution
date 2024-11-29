'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { WalletIcon, MenuIcon, Settings, User, ArrowRight, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'
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
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com/akta', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com/akta', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/akta', icon: Linkedin },
]

const partnerLogos = [
  { name: "Rover", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Disrup", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Decipad", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Capitalise", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Utrust", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
]

const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
const peraWallet = new PeraWalletConnect()

export default function Home() {
  const pathname = usePathname()
  const [accountAddress, setAccountAddress] = React.useState<string | null>(null)
  const [balance, setBalance] = React.useState<number | null>(null)
  const isConnectedToPeraWallet = !!accountAddress
  const [lastScrollY, setLastScrollY] = React.useState(0)
  const [shouldShowNav, setShouldShowNav] = React.useState(true)
  //const [isScrolledPastHero, setIsScrolledPastHero] = React.useState(false)

  const { scrollY } = useScroll()
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 1)"]
  )
  const headerColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(255, 255, 255)", "rgb(0, 0, 0)"]
  )

  React.useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      //setIsScrolledPastHero(currentScrollY > window.innerHeight * 0.5)
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShouldShowNav(false)
      } else {
        setShouldShowNav(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

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

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.header
        style={{
          backgroundColor: headerBg,
          color: headerColor,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 mx-4 mt-4",
          !shouldShowNav && "transform -translate-y-full"
        )}
      >
        <div className="max-w-7xl mx-auto rounded-full bg-inherit backdrop-blur-sm border border-gray-200/10 px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            äkta
          </Link>
          
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
            
          
          </div>
        </div>
      </motion.header>

      <main>
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-px bg-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
          
          <div className="relative max-w-7xl mx-auto">

            <div className="absolute -top-4 left-0 flex space-x-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-500/20" />
              ))}
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-8xl font-bold mb-8 max-w-4xl leading-tight"
            >
              An autonomous vaccine solution doesn't exi-
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <p className="text-xl md:text-2xl max-w-2xl text-gray-400">
                You can do more with your healthcare than you think.
                äkta is the autonomous and safe platform for vaccine distribution.
              </p>
              <Button 
                className="rounded-full px-8 py-6 text-lg bg-emerald-400 hover:bg-emerald-500 text-black flex items-center gap-2 group"
              >
                Try äkta
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 overflow-hidden bg-black/50">
          <div className="flex animate-scroll">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex space-x-12 whitespace-nowrap">
                {partnerLogos.map((logo, index) => (
                  <div key={index} className="w-48 h-16 relative flex-shrink-0">
                    <Image
                      src={logo.url}
                      alt={logo.name}
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-screen flex items-center px-6 md:px-20 py-32 bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12"
            >
              We tackle each project as a new partnership and make sure to simplify every process, even when facing the most complex problems.
            </motion.h2>
            <Button className="rounded-full px-8 py-6 text-lg bg-purple-400 hover:bg-purple-500 text-black">
              Know more about äkta
            </Button>
          </div>
        </section>

        <section className="py-32 px-6 md:px-20 bg-black/50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{item.label}</h3>
                <p className="text-gray-400">Experience seamless and secure vaccine management with our blockchain-powered platform.</p>
                <Link href={item.href}>
                  <Button variant="link" className="mt-4 p-0">Learn More →</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="border-t border-gray-800 py-20 px-6 md:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 mb-20">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  If your brand has something to say, let&apos;s talk.
                </h2>
                <a 
                  href="mailto:hello@akta.com" 
                  className="text-xl md:text-2xl text-gray-400 hover:text-white transition-colors"
                >
                  hello@akta.com
                </a>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm text-gray-400 mb-4">Social</h3>
                  <ul className="space-y-2">
                    {socialLinks.map((link) => (
                      <li key={link.label}>
                        <Link 
                          href={link.href}
                          className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors"
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/privacy" className="text-sm hover:text-gray-300 transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-sm hover:text-gray-300 transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-400">
              <div>
                <p>© {new Date().getFullYear()} äkta. All rights reserved.</p>
                <p>But feel free to share this website. Sharing is caring.</p>
              </div>
              <div className="flex gap-4">
                <Link href="/sitemap" className="hover:text-white transition-colors">
                  Sitemap
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}


