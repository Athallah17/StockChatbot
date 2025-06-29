'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter,usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const {isAuthenticated, logout, loading} = useAuth()

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    const timestamp = sessionStorage.getItem("tokenTimestampC")
    const isValid = token && timestamp && (Date.now() - parseInt(timestamp)) < 30 * 60 * 1000
    setIsLoggedIn(!!isValid)
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    setIsLoggedIn(false)
    router.push("/auth/login")
  }

    const handleNavigation = () => {
    if (pathname === "/chatbots") {
      router.push("/") // go back to homepage if already at chatbot
    } else {
      router.push("/chatbots")
    }
  }

  return (
    <header className="w-full border-b bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-extrabold text-black">
          StockBot
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* ✅ Always visible */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" onClick={handleNavigation}>
              {pathname === "/chatbots" ? "Home" : "Chatbot"}
            </Button>
          </motion.div>

          {/* Conditionally show Login or Logout */}
          {isAuthenticated? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline">
                <Link href="/auth/login">Login / Sign Up</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
