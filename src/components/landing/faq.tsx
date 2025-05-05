// components/landing/Faq.tsx

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    q: "Is this a real financial advisor?",
    a: "No, this is an AI-powered tool that gives recommendations based on data, not personalized financial advice."
  },
  {
    q: "What data sources does it use?",
    a: "We pull data from Yahoo Finance, NewsAPI, and sentiment analysis models."
  },
  {
    q: "How often is the data updated?",
    a: "Stock data and news are updated in real-time, based on market API responses."
  },
  {
    q: "Can I get predictions for any stock?",
    a: "Yes, as long as the stock is publicly listed and data is available."
  },
  {
    q: "Is my data stored or tracked?",
    a: "No user data is permanently stored or tracked. All queries are stateless."
  },
  {
    q: "Can this chatbot replace a financial advisor?",
    a: "No. While helpful, the bot is meant to supplement your research — not replace licensed professionals."
  },
  {
    q: "What kind of recommendations does it give?",
    a: "The AI provides trend-based analysis, buy/sell suggestions, and summaries based on financial indicators and market sentiment."
  }
]

const Faq = () => {
  return (
    <div className="max-w-3xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">FAQ</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Faq
