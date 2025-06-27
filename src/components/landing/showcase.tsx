'use client'

import { useState } from 'react'
import { MessageSquare, Lightbulb, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

const steps = [
  {
    title: "Ask Anything",
    icon: MessageSquare,
    number: 1,
    shortDesc: "Type your question about stocks, trends, or strategies. The chatbot understands both casual and technical terms.",
    longDesc:
      "Simply type in questions like 'Should I buy AAPL?' or 'Show me resistance levels for TSLA'. The chatbot understands both natural and financial language, making it easy for beginners and experienced traders alike.",
    svg: "/svg/Chatbot-amico.svg",
  },
  {
    title: "Get Instant Insights",
    icon: Lightbulb,
    number: 2,
    shortDesc: "Real-time data is processed instantly using our AI. You’ll get actionable insights backed by indicators and sentiment.",
    longDesc:
      "Our system processes real-time data, technical indicators (like RSI, MACD), historical trends, and sentiment analysis from news sources to generate comprehensive but digestible answers—instantly.",
    svg: "/svg/Chatbot-cuate.svg",
  },
  {
    title: "Make Smarter Decisions",
    icon: BarChart3,
    number: 3,
    shortDesc: "Use the information to support your trades and investments, backed by AI-driven reasoning and risk factors.",
    longDesc:
      "With each response, our bot includes risk factors, market trends, and confidence ratings—helping you decide whether to hold, buy, or sell. This way, your decisions are never based on gut feeling alone.",
    svg: "/svg/SiteStats-bro.svg",
  },
]

const Showcase = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="relative w-full  py-24 lg:py-32" id="showcase">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-100 max-w-2xl mx-auto">
            Investing guidance—simplified. Here’s how you can go from question to insight in seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isEven = i % 2 === 0
            const isOpen = openIndex === i

            return (
              <div
                key={i}
                className={`flex flex-col-reverse lg:flex-row ${!isEven ? 'lg:flex-row-reverse' : ''} items-center gap-6`}
              >
                {/* Left: Text */}
                <div className='bg-white p-5 border-2 shadow-lg'>
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-600" />
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-600">{step.shortDesc}</p>
                </div>

                  {/* Toggleable Description */}
                  <button
                    onClick={() => toggleOpen(i)}
                    className="text-sm text-blue-600 font-medium inline-flex items-center"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide detailed explanation
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Read more
                      </>
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-sm text-gray-700 bg-gray-50 border rounded-md p-4">
                      {step.longDesc}
                    </p>
                  )}
                </div>

                {/* Right: Image */}
                <div className="w-full lg:w-1/2">
                  <div className="rounded-xl overflow-hidden">
                      <object
                        key={step.svg} // 👈 force remount when file changes
                        type="image/svg+xml"
                        data={step.svg}
                        className="w-full h-auto floating"
                        aria-label={step.title}
                        role="img"
                      />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Demo Video */}
        <div className="mt-28">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white">See It in Action</h3>
            <p className="text-gray-100 mt-2">
              Experience how our chatbot delivers intelligent stock market guidance—fast, simple, and human-like.
            </p>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src="/videos/demo.mp4"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Showcase
