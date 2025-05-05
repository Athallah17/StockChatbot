// components/landing/Footer.tsx

import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-black border-t py-8 text-sm text-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} Stockers. All rights reserved.</p>
        <div className="space-x-4 mt-4 sm:mt-0">
          <Link href="/">Home</Link>
          <Link href="/chatbots">Chatbot</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="https://github.com/Athallah17" target="_blank">GitHub</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
