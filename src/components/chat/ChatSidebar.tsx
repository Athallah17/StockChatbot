'use client'

import {
  MenuIcon, XIcon, Clock, Settings, ChevronDown, ChevronUp, Plus
} from 'lucide-react'
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
  const { activeSessionId, setActiveSessionId, createNewSession, setLocalMessages} = useChatSession()
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
      className={`h-full bg-teal-700 text-white border-r transition-all duration-300 ease-in-out
        ${open ? 'w-72' : 'w-20'} flex flex-col justify-between py-4 px-3 shadow-sm`}
    >
      {/* Top section */}
      <div className="w-full">
        {/* Sidebar top buttons (Toggle + Title) */}
        <div className="flex flex-col items-start w-full mb-4 px-1">
          <button
            onClick={() => setOpen(!open)}
            className={`
              mb-3 transition text-white
              ${open
                ? 'w-full flex justify-end pr-2'
                : 'w-10 h-10 flex items-center justify-center rounded-full mx-auto'}
            `}
            title="Toggle Sidebar"
          >
            {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          {open && (
            <h1 className="text-lg font-semibold px-2 tracking-tight">
              Market Chatbot (logo)
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-4 w-full">
          {/* New Chat Button */}
          <div className="w-full mt-4 px-1">
            <button
              onClick={createNewSession}
              className={`
                flex items-center justify-center gap-2 py-2 transition text-sm font-semibold
                ${open
                  ? 'w-full bg-blue-600 hover:bg-blue-500 text-white rounded-md'
                  : 'w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full mx-auto'}
              `}
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
              {open && 'New Chat'}
            </button>
          </div>
          {/* History */}
          <div className="w-full mt-4 px-1">
            <SidebarItem
              icon={<Clock className="w-6 h-6" />}
              label="History"
              open={open}
              expandable
              expanded={historyOpen}
              toggleExpand={() => setHistoryOpen(!historyOpen)}
            />

            {open && historyOpen && (
              <div className="pl-2 flex-1 flex flex-col">
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto space-y-1 text-sm pr-1 scrollbar-thin"
                >
                  {isLoading && sessions.length === 0 ? (
                    <p className="text-gray-400 px-2">Loading...</p>
                  ) : (
                    sessions.map((session: ChatSession) => (
                      <div
                        key={session.session_id}
                        onClick={() => {
                          setLocalMessages([]); // 🧹 clear current messages immediately
                          setActiveSessionId(session.session_id); // ✅ trigger session switch
                        }}
                        className={`px-3 py-2 rounded-md cursor-pointer transition truncate font-light
                          ${session.session_id === activeSessionId
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-white hover:bg-gray-700'
                          }`}
                      >
                        {session.title}
                      </div>
                    ))
                  )}
                  {isLoading && sessions.length > 0 && (
                    <p className="text-xs text-gray-400 px-3">Loading more...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="w-full mt-4 px-1">
            <SidebarItem
              icon={<Settings className="w-6 h-6" />}
              label="Settings"
              open={open}
            />
          </div>
        </nav>
      </div>
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
      className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition text-sm text-white font-medium"
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
