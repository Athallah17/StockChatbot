'use client'

import React, { createContext, useContext, useState } from 'react'
import { API_STOCKBOT } from "@/utils/api/axiosInstance"

interface ChatSessionContextProps {
  activeSessionId: string | null
  setActiveSessionId: (id: string | null) => void
  createNewSession: () => void
localMessages: { sender: string; text: string; action?: string; response?: any }[]
  setLocalMessages: React.Dispatch<React.SetStateAction<{ sender: string; text: string; action?: string; response?: any }[]>>
}

const ChatSessionContext = createContext<ChatSessionContextProps | undefined>(undefined)

export const ChatSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [localMessages, setLocalMessages] = useState<{ sender: string; text: string }[]>([])
    const createNewSession = async () => {
      try {
        const res = await API_STOCKBOT.post("/chat/session/new")
        setActiveSessionId(res.data.session_id)
        setLocalMessages([])
      } catch (err) {
        console.error("Failed to create new session", err)
      }
    }

return (
    <ChatSessionContext.Provider value={{
        activeSessionId,
        setActiveSessionId,
        createNewSession,
        localMessages,
        setLocalMessages
    }}>
        {children}
    </ChatSessionContext.Provider>
)
}

export const useChatSession = () => {
  const context = useContext(ChatSessionContext)
  if (!context) {
    throw new Error('useChatSession must be used within a ChatSessionProvider')
  }
  return context
}
