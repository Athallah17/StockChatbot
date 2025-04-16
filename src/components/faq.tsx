'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const Faq = () => {
  return (
    <section className="bg-white text-black py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does the AI chatbot work?</AccordionTrigger>
            <AccordionContent>
              It understands your questions and automatically fetches stock data to give smart, human-like answers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is the data real-time?</AccordionTrigger>
            <AccordionContent>
              Yes! It pulls live prices and updates regularly via Yahoo Finance API.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I track multiple stocks?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Just type in the tickers you’re interested in.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default Faq
