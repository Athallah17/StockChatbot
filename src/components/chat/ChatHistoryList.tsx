'use client'

import { useEffect, useRef, useState } from 'react'

interface ChatSession {
  id: number
  title: string
  created_at: string
}

interface ChatHistoryListProps {
  sessions: ChatSession[]
}

const ChatHistoryList = ({ sessions }: ChatHistoryListProps) => {
  const [visibleCount, setVisibleCount] = useState(10)
  const listRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = listRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      // near bottom
      setVisibleCount((prev) => Math.min(prev + 10, sessions.length))
    }
  }

  useEffect(() => {
    const el = listRef.current
    if (el) el.addEventListener('scroll', handleScroll)
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll)
    }
  }, [sessions])

  const visibleSessions = sessions.slice(0, visibleCount)

  return (
    <div
      ref={listRef}
      className="overflow-y-auto max-h-[calc(100vh-160px)] pr-1 space-y-4"
    >
      {visibleSessions.map((session) => (
        <div
          key={session.id}
          className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
        >
          <h3 className="text-white font-semibold text-base">{session.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(session.created_at).toLocaleString()}
          </p>
        </div>
      ))}
      {visibleCount < sessions.length && (
        <p className="text-center text-gray-400 text-xs pt-4">Scroll to load more...</p>
      )}
    </div>
  )
}

export default ChatHistoryList
