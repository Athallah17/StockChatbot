'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-black">
      <div className="text-2xl font-bold tracking-tight text-white">
        📦 Stockers
      </div>

      <nav className="flex items-center space-x-8 text-white text-lg font-semibold">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <Link href="/features" className="hover:text-gray-300 transition-colors">
          Features
        </Link>
        <Link href="/chatbots" className="hover:text-gray-300 transition-colors">
          Chatbots
        </Link>
        <Link href="/contacts" className="hover:text-gray-300 transition-colors">
          Contacts
        </Link>
        <Button
          variant="outline"
          className="ml-4 text-white border-white hover:bg-white hover:text-blue-600"
        >
          Sign up
        </Button>
      </nav>
    </header>
  )
}

export default Navbar
