'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { WalletIcon, User, ArrowRight, Twitter, Instagram, Linkedin } from 'lucide-react'
import { cn } from "@/lib/utils"
import { PeraWalletConnect } from "@perawallet/connect"
import algosdk from "algosdk"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
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
  { name: "Partner 1", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Partner 2", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Partner 3", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
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

  const { scrollY } = useScroll()
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(248, 241, 236, 0)", "rgba(248, 241, 236, 1)"]
  )
  const headerColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(255, 255, 255)", "rgb(0, 82, 78)"]
  )

  React.useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      
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

  const dotCount = 15
  const dots = React.useMemo(() => Array.from({ length: dotCount }), [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (event: React.MouseEvent) => {
    mouseX.set(event.clientX)
    mouseY.set(event.clientY)
  }

  React.useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
  }, [mouseX, mouseY])

  return (
    <div className="min-h-screen bg-[#f8f1ec]" onMouseMove={handleMouseMove}>
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
        <div className="max-w-7xl mx-auto rounded-full bg-inherit backdrop-blur-sm border border-[#00524e]/10 px-6 py-4 flex justify-between items-center">
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
            
            {isConnectedToPeraWallet ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDisconnectWalletClick} className="text-red-500">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleConnectWalletClick} variant="ghost">
                <WalletIcon className="mr-2 h-4 w-4" /> Connect
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <main>
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative bg-[#f8f1ec]">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-px bg-[#00524e]/20"
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
              {dots.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-[#dedb7b]/20"
                  style={{
                    x: useSpring(useTransform(mouseX, [0, window.innerWidth], [-10 - i * 2, 10 + i * 2]), { stiffness: 100, damping: 30 }),
                    y: useSpring(useTransform(mouseY, [0, window.innerHeight], [-10 - i * 2, 10 + i * 2]), { stiffness: 100, damping: 30 }),
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4 + i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="inline-block mb-8">
                <div className="relative">
                  <h1 className="text-6xl md:text-8xl lg:text-8xl font-bold text-[#00524e] relative z-10">
                    All-in-one platform
                  </h1>
                  <div className="absolute -bottom-2 left-0 w-full h-6 bg-[#dedb7b] -skew-y-2" />
                </div>
              </div>
              <div className="max-w-3xl">
                <p className="text-xl md:text-2xl text-[#00524e]/80 mb-8">
                  All-in-one platform to efficiently manage and redistribute inventory between local points of sale using blockchain transparency.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="rounded-full px-8 py-6 text-lg bg-[#dedb7b] hover:bg-[#dedb7b]/90 text-[#00524e] flex items-center gap-2 group"
                  >
                    Try äkta
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-full px-8 py-6 text-lg border-[#00524e] text-[#00524e] hover:bg-[#00524e] hover:text-white"
                  >
                    Get a demo
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 overflow-hidden bg-[#00524e]/5">
          <div className="flex animate-scroll">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex space-x-12 whitespace-nowrap">
                {partnerLogos.map((logo, index) => (
                  <div key={index} className="w-48 h-16 relative flex-shrink-0">
                    <Image
                      src={logo.url}
                      alt={logo.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-screen flex items-center px-6 md:px-20 py-32 bg-[#00524e]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#dedb7b] rounded-full blur-3xl opacity-20" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BAA63B7AC-82D9-4A08-8F8C-4A0B6F2869BB%7D-5EzqBSw1wV6reyY4g7AoyviS3lfhOw.png"
                alt="Feature Image"
                width={500}
                height={500}
                className="relative z-10 rounded-full border-4 border-[#dedb7b]"
              />
            </div>
            <div className="text-white">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12"
              >
                Revolutionizing healthcare distribution
              </motion.h2>
              <p className="text-xl text-white/80 mb-8">
                Experience seamless and secure vaccine management with our blockchain-powered platform.
              </p>
              <Button 
                className="rounded-full px-8 py-6 text-lg bg-[#dedb7b] hover:bg-[#dedb7b]/90 text-[#00524e] flex items-center gap-2 group"
              >
                Try äkta
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 md:px-20 bg-[#f8f1ec]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-[#00524e]/10"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#00524e]">{item.label}</h3>
                <p className="text-[#00524e]/80">Experience seamless and secure vaccine management with our blockchain-powered platform.</p>
                <Link href={item.href}>
                  <Button variant="link" className="mt-4 p-0 text-[#00524e]">Learn More →</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="border-t border-[#00524e]/10 py-20 px-6 md:px-20 bg-[#f8f1ec]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 mb-20">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#00524e]">
                  If your brand has something to say, let&apos;s talk.
                </h2>
                <a 
                  href="mailto:hello@akta.com" 
                  className="text-xl md:text-2xl text-[#00524e]/80 hover:text-[#00524e] transition-colors"
                >
                  hello@akta.com
                </a>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm text-[#00524e]/60 mb-4">Social</h3>
                  <ul className="space-y-2">
                    {socialLinks.map((link) => (
                      <li key={link.label}>
                        <Link 
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-[#00524e]/80 hover:text-[#00524e] transition-colors"
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm text-[#00524e]/60 mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/privacy" className="text-sm text-[#00524e]/80 hover:text-[#00524e] transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-sm text-[#00524e]/80 hover:text-[#00524e] transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-[#00524e]/60">
              <div>
                <p>© {new Date().getFullYear()} äkta. All rights reserved.</p>
                <p>But feel free to share this website. Sharing is caring.</p>
              </div>
              <div className="flex gap-4">
                <Link href="/sitemap" className="hover:text-[#00524e] transition-colors">
                  Sitemap
                </Link>
                <Link href="/cookies" className="hover:text-[#00524e] transition-colors">
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