'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  MessageSquare,
  Bot,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  DollarSign,
  Globe,
  Timer,
  ShieldCheck,
  Users,
  Activity
} from 'lucide-react'

const faqItems = [
  {
    question: "How does StockBot help my investment strategy?",
    answer: "StockBot uses AI to analyze indicators, trends, and sentiment to provide actionable investment insights.",
    icon: Bot
  },
  {
    question: "Is StockBot suitable for beginner investors?",
    answer: "Yes, it understands plain English and gives clear, jargon-free answers ideal for new investors.",
    icon: HelpCircle
  },
  {
    question: "How accurate are the AI’s recommendations?",
    answer: "While not guaranteed, recommendations are data-driven using predictive models and market sentiment.",
    icon: CheckCircle2
  },
  {
    question: "Do you support all stock tickers?",
    answer: "We support most US-listed stocks and sectors. Global support is in development.",
    icon: Globe
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! Try StockBot for free with limited queries before upgrading.",
    icon: Timer
  },
  {
    question: "Can I use it for day trading?",
    answer: "Yes. Our AI detects intraday trends and volatility indicators to assist day traders.",
    icon: Activity
  },
  {
    question: "Does StockBot work with crypto assets?",
    answer: "Currently, we support only stock market tickers. Crypto support is coming soon.",
    icon: DollarSign
  },
  {
    question: "Can teams use StockBot collaboratively?",
    answer: "Yes, team plans allow multiple users with shared access to saved analysis sessions.",
    icon: Users
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use encryption and do not store personal trading or financial credentials.",
    icon: ShieldCheck
  },
  {
    question: "What devices is StockBot compatible with?",
    answer: "You can access StockBot via mobile, tablet, and desktop browsers—no installation needed.",
    icon: BookOpen
  }
]

const Faq = () => {
  return (
    <section className="relative w-full py-20" id="faq">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-100 text-lg max-w-2xl mx-auto">
            We're here to answer your top questions. Still unsure? Reach out to us for more details.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Illustration */}
          <div className="flex justify-center items-center">
            <object
              data="/svg/robot-asking.svg"
              type="image/svg+xml"
              aria-label="Illustration of robot asking questions"
              className="w-full max-w-md pointer-events-none"
            >
              <img
                src="/svg/robot-asking.svg"
                alt="Illustration of robot asking questions"
                className="w-full max-w-md"
              />
            </object>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-6 bg-white p-4 rounded-lg">
            {faqItems.map((faq, i) => {
              const Icon = faq.icon
              return (
                <Accordion
                  key={i}
                  type="single"
                  collapsible
                  className="border border-gray-200 rounded-xl shadow-sm bg-white"
                >
                  <AccordionItem value={`faq-${i}`}>
                    <AccordionTrigger className="text-left px-4 py-4 text-gray-900 font-medium flex items-center gap-3 text-base sm:text-lg">
                      <Icon className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-gray-700 text-sm sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faq
