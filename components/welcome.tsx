'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { WalletIcon, User, Twitter, Instagram, Linkedin } from 'lucide-react'

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
  { name: "Partner 1", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Partner 2", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
  { name: "Partner 3", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B52FA3B43-1F2F-48D2-8FC8-CB09A8FEE654%7D-gmBcqD3WqTymxi5GxfHvGeBe3ZQRfq.png" },
]

export default function Component() {
  const { scrollY } = useScroll()
  const [activeSection, setActiveSection] = React.useState(0)
  
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
            <Button className="bg-black text-white hover:bg-black/90">
              Sign Up
            </Button>
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