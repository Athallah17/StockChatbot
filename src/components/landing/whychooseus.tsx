'use client'

import { Brain, LineChart, MessageSquareText, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const features = [
    {
        icon: <Brain className="w-12 h-12 text-red-500" />,
        title: "AI-Driven Market Analysis",
        description: "Stay ahead of trends with real-time analytics powered by cutting-edge language models and data sources."
    },
    {
        icon: <LineChart className="w-12 h-12 text-blue-600" />,
        title: "Price Forecasts You Can Trust",
        description: "Leverage predictive algorithms trained on historical patterns, technical indicators, and sentiment data."
    },
    {
        icon: <MessageSquareText className="w-12 h-12 text-indigo-800" />,
        title: "Conversational Simplicity",
        description: "Just ask. Our chatbot delivers insights, predictions, and recommendations in plain language—instantly."
    },
    {
        icon: <ShieldCheck className="w-12 h-12 text-amber-300" />,
        title: "Built for Security & Accuracy",
        description: "We use verified market data and best-in-class models to ensure reliability with every response."
    }
]

const WhyChooseUs = () => {
return (
    <section className="w-full py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                    Smarter Tools. Better Results.
                </h2>
                <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                    Explore how we combine intelligence and simplicity to guide your financial journey.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                    key={index}
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                    }}
                    className={cn(
                        "group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 ease-in-out hover:bg-blue-300"
                    )}
                    >
                    <div className="mb-4 text-blue-600 group-hover:text-white font-black transition-colors duration-300">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">
                        {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 group-hover:text-white transition-colors duration-300">
                        {feature.description}
                    </p>
                    </motion.div>
                ))}
            </div>
        </div>
        </section>
    )
}

export default WhyChooseUs
