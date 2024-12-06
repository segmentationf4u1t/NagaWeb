"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bitcoin, CreditCard, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const creditOptions = [
  { value: "5", label: "5 Credits", price: 5 },
  { value: "10", label: "10 Credits", price: 10 },
  { value: "20", label: "20 Credits", price: 20 },
  { value: "custom", label: "Custom Amount", price: 0 },
]

const cryptoOptions = [
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "usdt", label: "Tether (USDT)" },
]

export default function BillingForm() {
  const [selectedCredits, setSelectedCredits] = useState(creditOptions[0].value)
  const [customCredits, setCustomCredits] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0].value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your payment processor
    alert("Processing payment... This is a mock checkout.")
  }

  const getTotalPrice = () => {
    if (selectedCredits === "custom") {
      return Number.parseInt(customCredits) || 0
    }
    return creditOptions.find(option => option.value === selectedCredits)?.price || 0
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader>
            <CardTitle>Select Credits</CardTitle>
            <CardDescription>Choose the number of credits you want to purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <RadioGroup
                  value={selectedCredits}
                  onValueChange={setSelectedCredits}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {creditOptions.map((option) => (
                    <motion.div key={option.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary h-[120px]"
                      >
                        <DollarSign className="mb-3 h-6 w-6" />
                        {option.label}
                        {option.value === "custom" ? (
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={customCredits}
                            onChange={(e) => setCustomCredits(e.target.value)}
                            className="mt-2 w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="mt-2 font-semibold">${option.price}</p>
                        )}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="crypto">Select Cryptocurrency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger id="crypto">
                      <SelectValue placeholder="Select Cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet">Your {selectedCrypto.toUpperCase()} Wallet Address</Label>
                  <Input id="wallet" placeholder="Enter your wallet address" required />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold">
                    ${getTotalPrice()}
                  </span>
                </div>
                <Button type="submit" className="w-full">
                  Complete Purchase
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="mr-2 h-4 w-4" />
              Secure Payment
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Bitcoin className="mr-2 h-4 w-4" />
              Crypto Supported
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

