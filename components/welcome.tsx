'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { WalletIcon, User, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useEffect, useState } from "react"
import { Web3AuthNoModal } from "@web3auth/no-modal"
import {
  CHAIN_NAMESPACES,
  IProvider,
  UX_MODE,
  WALLET_ADAPTERS,
} from "@web3auth/base"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { CommonPrivateKeyProvider } from "@web3auth/base-provider"

const navigationItems = [
  { href: '/docs', label: 'Docs' },
  { href: '/security', label: 'Security' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
]

const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com/akta', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com/akta', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/akta', icon: Linkedin },
]

const partnerLogos = [
  { name: "Gavi", url: "https://www.gavi.org/sites/default/files/Gavi-logo_1b.png" },
  { name: "Bill & Melinda Gates Foundation", url: "https://www.ntd-ngonetwork.org/sites/nnn/files/styles/grid-6-wide-logo/public/content/organisation/logos/2023-08-04/Bill_%26_Melinda_Gates_Foundation_white%20bkgr.png?itok=CXTNJC5i&timestamp=1691122251" },
  { name: "Algorand", url: "https://mma.prnewswire.com/media/1229493/Algorand_Inc_Logo.jpg?p=publish" },
  { name: "National Health Mission (NHM)", url: "https://chfw.telangana.gov.in/images_new/nhm.png" },
  { name: "DHL", url: "https://content3.jdmagicbox.com/v2/comp/hyderabad/i3/040pxx40.xx40.120321155404.y3i3/catalogue/dhl-express-india-pvt-ltd-gachibowli-hyderabad-international-courier-services-for-corporate-g69zuomoxr.jpg" },
  { name: "Fedex", url: "https://assets.turbologo.com/blog/en/2019/12/19084817/Fedex-logo.png" },
  { name: "Blue Dart", url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Blue_Dart_logo_transparent.png" },
  { name: "Doctor Reddy's Laboratory", url: "https://www.cphi-online.com/DrR_Logo_Secondary_RGB-comp280807.jpg" },
  { name: "Max HealthCare", url: "https://media.assettype.com/freepressjournal/2021-12/b41a04f9-e1d6-4188-806f-1fae37de7cf2/640px_Max_Healthcare_Logo.png" },
]

export default function Component() {
  const { scrollY } = useScroll()
  const [activeSection, setActiveSection] = React.useState(0)
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [isWeb3AuthReady, setIsWeb3AuthReady] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 82, 78, 0)", "rgba(0, 82, 78, 1)"]
  )
  
  const headerColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(0, 82, 78)", "rgb(255, 255, 255)"]
  )

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing Web3Auth...");
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: "Algorand",
          rpcTarget: "https://testnet-api.algonode.cloud",
          displayName: "Algorand Mainnet",
          ticker: "ALGO",
          tickerName: "Algorand",
        }

        const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } })

        const web3authInstance = new Web3AuthNoModal({
          clientId: "BPLBWDRubxD8LfmkhkQpNbSgyLPYkUUIHVYqO_C3TeseZoiqaTc_ijUtCZHjM4f7DGakzaIQAMfH-KpPM80p1JA",
          privateKeyProvider,
          web3AuthNetwork: "sapphire_devnet",
        })

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
          },
        })

        web3authInstance.configureAdapter(openloginAdapter)

        setWeb3auth(web3authInstance)
        console.log("Web3Auth instance created, initializing...");
        await web3authInstance.init()
        console.log("Web3Auth initialized successfully");
        setIsWeb3AuthReady(true)

        if (web3authInstance.connected) {
          console.log("User is already connected");
          setProvider(web3authInstance.provider)
          const user = await web3authInstance.getUserInfo()
          console.log("User info retrieved:", user);
          setUserInfo(user)
        } else {
          console.log("User is not connected");
        }
      } catch (error) {
        console.error("Error during Web3Auth initialization:", error)
      }
    }

    init()
  }, [])

  useEffect(() => {
    console.log("web3auth state changed:", web3auth);
    console.log("isWeb3AuthReady state changed:", isWeb3AuthReady);
  }, [web3auth, isWeb3AuthReady]);

  const login = async () => {
    console.log("Login function called");
    if (!web3auth) {
      console.log("web3auth is null");
      return;
    }
    if (!isWeb3AuthReady) {
      console.log("Web3Auth is not ready yet");
      return;
    }
    try {
      console.log("Attempting to connect...");
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "google",
        }
      );
      console.log("Connected successfully");
      setProvider(web3authProvider);
      await getUserInfo();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const getUserInfo = async () => {
    console.log("getUserInfo function called");
    if (!web3auth) {
      console.log("web3auth is null");
      return;
    }
    if (!isWeb3AuthReady) {
      console.log("Web3Auth is not ready yet");
      return;
    }
    try {
      const user = await web3auth.getUserInfo();
      console.log("User info retrieved:", user);
      setUserInfo(user);
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet")
      return
    }
    await web3auth.logout()
    setProvider(null)
    setUserInfo(null)
  }

  return (
    <div className="min-h-screen bg-[#f8f1ec]">
      <motion.header
        style={{
          backgroundColor: headerBg,
          color: headerColor,
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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
            
            <Button variant="ghost" className="text-sm">
              Get a Demo
            </Button>
            {!userInfo ? (
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={login}
                disabled={!isWeb3AuthReady}
              >
                {isWeb3AuthReady ? "Sign Up" : "Initializing..."}
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{userInfo.email}</span>
                <Button 
                  className="bg-black text-white hover:bg-black/90"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <main>
        <section className="min-h-screen flex flex-col justify-center px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="inline-block mb-8">
                <div className="relative">
                  <h1 className="text-6xl md:text-8xl font-bold text-[#00524e] relative z-10">
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
                  <Link href="/pricing">
                    <Button 
                      className="rounded-full px-8 py-6 text-lg bg-[#dedb7b] hover:bg-[#dedb7b]/90 text-[#00524e] flex items-center gap-2 group"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/akta">
                    <Button 
                      variant="outline"
                      className="rounded-full px-8 py-6 text-lg border-[#00524e] text-[#00524e] hover:bg-[#00524e] hover:text-white"
                    >
                      Get a demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {userInfo && (
          <section className="py-10 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#00524e]">User Information</h2>
                <Button 
                  onClick={logout}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </Button>
              </div>
              <div className="bg-[#f8f1ec] p-6 rounded-lg shadow-md">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                {userInfo.profileImage && (
                  <div className="mt-4">
                    <p><strong>Profile Image:</strong></p>
                    <Image 
                      src={userInfo.profileImage} 
                      alt="Profile" 
                      width={100} 
                      height={100} 
                      className="rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        
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

        <section className="min-h-screen flex items-center px-6 bg-[#00524e] relative overflow-hidden">
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-6">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full bg-[#f8f1ec]/20"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid gap-20">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                >
                  Start quickly,<br />scale effortlessly.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl text-white/60 max-w-xl"
                >
                  We learn from every experience by pushing the boundaries past the ordinary. Let's simplify fintech and web3, together.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl font-bold text-white justify-self-end max-w-lg"
              >
                Secure your applications without any hassle.
              </motion.div>
            </div>
          </div>
        </section>
      </main>

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

