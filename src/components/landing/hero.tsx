'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const Hero = () => {
  const chatSteps = [
    {
      user: "Should I buy TSLA this week?",
      bot: "Based on current trend and sentiment, TSLA is showing signs of resistance around $190. Recommendation: Hold."
    },
    {
      user: "How is AAPL performing recently?",
      bot: "AAPL has experienced a 4.2% increase in the last month, indicating a short-term upward trend with moderate volatility."
    },
    {
      user: "What’s the market sentiment for NVDA?",
      bot: "Sentiment is Bullish with strong institutional support. Several hedge funds have recently increased their stakes."
    },
    {
      user: "Can you summarize AMD's recent performance?",
      bot: "AMD shows a neutral trend, but with solid fundamentals and consistent earnings, investors are holding."
    },
    {
      user: "Is META overvalued right now?",
      bot: "META’s PE ratio is currently 34.2, which is above the sector average. Valuation suggests caution."
    },
    {
      user: "Give me support and resistance for GOOGL",
      bot: "GOOGL has support at $115 and resistance around $129, showing consolidation within this range."
    },
    {
      user: "How volatile is NFLX recently?",
      bot: "NFLX has shown a volatility of 3.8% over the past 30 days, slightly above industry average."
    },
    {
      user: "What’s the dividend status of MSFT?",
      bot: "MSFT declared a quarterly dividend of $0.75, maintaining a steady payout ratio in line with prior quarters."
    },
    {
      user: "Summarize sentiment for SBUX",
      bot: "Sentiment around SBUX is mixed, with bearish short-term signals but long-term fundamentals remain strong."
    },
    {
      user: "What’s the average confidence on tech stocks today?",
      bot: "Across top 5 tech stocks, average sentiment confidence is 8.1/10 with a mildly bullish trend."
    }
  ]

  const [step, setStep] = useState(0)
  const [botText, setBotText] = useState("")

  useEffect(() => {
    let charIndex = 0
    const fullText = chatSteps[step].bot
    setBotText("")

    const typing = setInterval(() => {
      setBotText(prev => prev + fullText.charAt(charIndex))
      charIndex++
      if (charIndex >= fullText.length) clearInterval(typing)
    }, 60)

    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % chatSteps.length)
    }, 20000)

    return () => {
      clearInterval(typing)
      clearTimeout(timer)
    }
  }, [step])

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* ✅ Background texture */}
      <div className="absolute inset-0 z-[0] bg-[url('/svg/bank-note.svg')] bg-repeat opacity-6 pointer-events-none" />

      {/* ✅ Hero content above the background */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
        {/* Left: Headline & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-block text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
            AI-Powered Investment Assistant
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Your Smartest Investment Starts<br className="hidden md:block" />
            with <span
              className="text-emerald-300"
              style={{ textShadow: "6px 4px 4px rgba(0,0,0,0.2)" }}
            >
              StockBot
            </span>
          </h1>
          <p className="text-lg text-gray-100 max-w-xl">
            Tap into real-time market intelligence, AI-powered predictions, and curated insights—designed to elevate your investment decisions with clarity and confidence.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/chatbots">
              <Button size="lg">Get Started Now</Button>
            </Link>
            <Link href="#showcase">
              <Button variant="outline" size="lg">Explore Features</Button>
            </Link>
          </div>
        </motion.div>

        {/* Right: Illustration + Chat */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-xl flex flex-col items-center"
        >
          {/* SVG Illustration */}
          <div className="relative z-0 mb-2 justify-center">
            <a
              href="https://storyset.com/business"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center mt-2"
            >
              <img
                src="/svg/Investment-data.svg"
                alt="Investment Assistant"
                className="w-[800px] floating pointer-events-auto"
              />
            </a>
          </div>

          {/* Chat Simulation */}
          <div className="relative z-10 bg-gray-200 border border-gray-200 rounded-xl shadow-lg px-6 py-6 w-full">
            <div className="space-y-6 text-base text-gray-800">
              {/* User Message */}
              <div className="flex justify-end items-start gap-2">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[80%] shadow-sm">
                  {chatSteps[step].user}
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
                  <User size={16} />
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex justify-start items-start gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-800 rounded-full">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl max-w-[80%] shadow-sm">
                  {botText}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
