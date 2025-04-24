'use client'

import { MenuIcon, XIcon, Clock, Settings } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  initialOpen?: boolean
}

const ChatSidebar = ({ initialOpen = true }: SidebarProps) => {
  const [open, setOpen] = useState(initialOpen)

  return (
    <aside
      className={`h-full bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-16'} flex flex-col items-start px-5 py-6`}
    >
      {/* Top toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="mb-6 text-white self-end"
        aria-label="Toggle sidebar"
      >
        {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Heading */}
      {open && <h1 className="text-lg font-bold mb-4">Market Chatbots TESTT</h1>}

      {/* Nav Items */}
      <nav className="space-y-6 text-sm w-full">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
          <Clock className="w-6 h-6" />
          {open && <span>History</span>}
        </div>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
          <Settings className="w-6 h-6" />
          {open && <span>Settings</span>}
        </div>
      </nav>
    </aside>
  )
}

export default ChatSidebar
