'use client'

import { MenuIcon, XIcon, Clock, Settings, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useChatHistory } from '@/hooks/useChatHistory'
import { ChatSession } from '@/utils/api/chat-history-api'
import { useChatSession } from '@/context/ChatSessionContext'

interface SidebarProps {
  initialOpen?: boolean
}

const ChatSidebar = ({ initialOpen = true }: SidebarProps) => {
  const [open, setOpen] = useState(initialOpen)
  const [historyOpen, setHistoryOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { activeSessionId, setActiveSessionId, createNewSession } = useChatSession()
  const { sessions, isLoading, loadMore } = useChatHistory()

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        loadMore()
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  return (
    <aside
      className={`h-full bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-20'} flex flex-col items-start py-6 px-4 shadow-md`}
    >
      {/* Toggle Button */}
      <div className="w-full flex justify-end mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-300 hover:text-white transition"
        >
          {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Title */}
      {open && <h1 className="text-xl font-semibold mb-8 tracking-tight">Market Chatbot</h1>}

      {/* Nav */}
      <nav className="space-y-4 w-full">
        <div className="w-full">
          <SidebarItem
            icon={<Clock className="w-5 h-5" />}
            label="History"
            open={open}
            expandable
            expanded={historyOpen}
            toggleExpand={() => setHistoryOpen(!historyOpen)}
          />

          {/* Session list */}
          {open && historyOpen && (
            <div className="pl-4 flex-1 flex flex-col">
              <button
                onClick={createNewSession}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-2"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-1 text-sm pr-1 scrollbar-thin"
              >
                {isLoading && sessions.length === 0 ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  sessions.map((session: ChatSession) => (
                    <div
                      key={session.session_id}
                      onClick={() => setActiveSessionId(session.session_id)}
                      className={`px-2 py-1 rounded cursor-pointer transition truncate
                        ${session.session_id === activeSessionId
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      {session.title}
                    </div>
                  ))
                )}
                {isLoading && sessions.length > 0 && (
                  <p className="text-xs text-gray-500 px-2">Loading more...</p>
                )}
              </div>
            </div>
          )}
        </div>

        <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" open={open} />
      </nav>
    </aside>
  )
}

const SidebarItem = ({
  icon,
  label,
  open,
  expandable = false,
  expanded = false,
  toggleExpand,
}: {
  icon: React.ReactNode
  label: string
  open: boolean
  expandable?: boolean
  expanded?: boolean
  toggleExpand?: () => void
}) => {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition text-sm"
      onClick={toggleExpand}
    >
      <div className="flex items-center gap-3">
        {icon}
        {open && <span>{label}</span>}
      </div>
      {expandable && open && (
        expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </div>
  )
}

export default ChatSidebar
