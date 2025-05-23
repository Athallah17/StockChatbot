// components/landing/Showcase.tsx
'use client'
import { motion } from "framer-motion"
import { Sparkles, Search, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <Search className="w-5 h-5 text-indigo-600" />,
    title: "Ask a Question",
    desc: "Type any stock question, like 'Should I buy AAPL today?'."
  },
  {
    icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
    title: "Let AI Analyze",
    desc: "Our model pulls market data, news, and financials instantly."
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-indigo-600" />,
    title: "Get an Answer",
    desc: "Receive a clear, concise recommendation with rationale."
  },
]

const Showcase = () => {
  return (
    <div id="showcase" className="max-w-5xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
        <p className="text-gray-600 mt-2">Ask anything. Get real answers. Instantly.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.2 }}
            className="p-6 bg-white border rounded-xl shadow-sm text-center"
          >
            <div className="flex justify-center mb-3">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Showcase
