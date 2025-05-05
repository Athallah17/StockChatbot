// components/landing/Hero.tsx

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

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
    }, 60) // slower typing

    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % chatSteps.length)
    }, 20000) // 20 seconds for each step

    return () => {
      clearInterval(typing)
      clearTimeout(timer)
    }
  }, [step])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-6xl mx-auto py-32 px-6"
    >
      <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
        Invest Smarter with AI
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Your personal market analyst. Get data-driven insights, sentiment summaries, and buy/sell recommendations in real time.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/chatbots">
          <Button size="lg">Try the Chatbot</Button>
        </Link>
        <Link href="#showcase">
          <Button variant="outline" size="lg">How It Works</Button>
        </Link>
      </div>

      {/* Mock Chat Bubble Preview with Avatars */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mt-35 bg-white shadow-xl rounded-xl px-8 py-6 w-full max-w-3xl mx-auto text-left text-base text-gray-800 border border-gray-200"
      >
        <div className="space-y-6">
            <div className="flex justify-end items-start gap-2">
            <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[80%] shadow-sm">
              {chatSteps[step].user}
            </div>
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
                <User size={16} />
              </div>
            </div>
            <div className="flex justify-start items-start gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-800 rounded-full">
              <Bot size={16} />
            </div>
            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl max-w-[80%] shadow-sm">
              {botText}
            </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Hero
