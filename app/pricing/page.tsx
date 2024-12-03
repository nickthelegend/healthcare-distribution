'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from "framer-motion"
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: '/docs', label: 'Docs' },
  { href: '/security', label: 'Security' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
]

const pricingPlans = [
  {
    name: "Basic",
    price: 25,
    features: [
      { name: "Landingpage Asset", quantity: 1 },
      { name: "Illustration Asset", quantity: 10 },
      { name: "Template Animation", quantity: 10 },
      { name: "Icon Asset", quantity: 15 },
      { name: "Photos Asset", quantity: 10 },
    ],
  },
  {
    name: "Standard",
    price: 50,
    features: [
      { name: "Landingpage Asset", quantity: 3 },
      { name: "Illustration Asset", quantity: 20 },
      { name: "Template Animation", quantity: 20 },
      { name: "Icon Asset", quantity: 30 },
      { name: "Photos Asset", quantity: 20 },
    ],
  },
  {
    name: "Premium",
    price: 75,
    isPopular: true,
    features: [
      { name: "Landingpage Asset", quantity: 5 },
      { name: "Illustration Asset", quantity: 30 },
      { name: "Template Animation", quantity: 30 },
      { name: "Icon Asset", quantity: 45 },
      { name: "Photos Asset", quantity: 30 },
    ],
  },
  {
    name: "Deluxe",
    price: 100,
    features: [
      { name: "Landingpage Asset", quantity: 10 },
      { name: "Illustration Asset", quantity: 50 },
      { name: "Template Animation", quantity: 50 },
      { name: "Icon Asset", quantity: 100 },
      { name: "Photos Asset", quantity: 50 },
    ],
  },
]

export default function PricingPage() {
  const { scrollY } = useScroll()
  const [isYearly, setIsYearly] = React.useState(false)
  
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

  const getAdjustedPrice = (basePrice: number) => {
    return isYearly ? basePrice * 10 : basePrice
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
            <Button className="bg-black text-white hover:bg-black/90">
              Sign Up
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-[#00524e]">Pricing Plans</h1>
            <p className="text-[#00524e]/60 max-w-xl mx-auto">
              Choose the perfect plan for your needs. Unlock premium features and scale your business with our flexible pricing options.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={cn("text-sm", !isYearly && "text-[#00524e] font-medium")}>Monthly</span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-[#00524e]"
              />
              <span className={cn("text-sm", isYearly && "text-[#00524e] font-medium")}>Yearly</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative",
                  plan.isPopular && "bg-[#00524e] text-white"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 right-4 bg-[#dedb7b] text-[#00524e] px-3 py-1 rounded-full text-sm font-medium">
                    Live
                  </div>
                )}
                <CardHeader>
                  <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold">
                    ${getAdjustedPrice(plan.price)}
                    <span className="text-base font-normal opacity-70">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2">
                        <Check className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>
                          <span className="font-medium">{feature.quantity}</span> {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={cn(
                      "w-full",
                      plan.isPopular
                        ? "bg-[#dedb7b] text-[#00524e] hover:bg-[#dedb7b]/90"
                        : "bg-[#00524e] text-white hover:bg-[#00524e]/90"
                    )}
                  >
                    Buy Package
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}