'use client'

import { Navbar, Footer } from '@/components'
import { Hero, Features, Showcase, Faq } from '@/components/landing'

const Home = () => {
  return (
    <div className="relative flex flex-col min-h-screen text-gray-900 scroll-smooth overflow-hidden">
      {/* Global Background Texture */}
      <div className="fixed inset-0 z-[0] bg-[url('/svg/bank-note.svg')] bg-repeat opacity-3 pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-teal-400 via-teal-700 to-cyan-900">
        <section className="min-h-screen flex items-center justify-center">
          <Hero />
        </section>

        <section className="py-12 z-10">
          <Features />
        </section>

        <section className="py-12 z-10">
          <Showcase />
        </section>

        <section className="py-12 z-10">
          <Faq />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
