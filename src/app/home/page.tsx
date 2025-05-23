'use client'

import { Navbar, Footer } from '@/components'
import { Hero, Features, Showcase, Faq, WhoItsFor } from '@/components/landing'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 scroll-smooth">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <Hero />
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <Features />
        </section>

        {/* Showcase / How It Works */}
        <section className="py-20 bg-white">
          <Showcase />
        </section>

        {/* Who It's For */}
        <section className="py-20 bg-gray-50">
          <WhoItsFor />
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <Faq />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
