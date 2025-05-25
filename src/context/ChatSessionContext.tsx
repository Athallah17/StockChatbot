'use client'

import React, { createContext, useContext, useState } from 'react'

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
    const createNewSession = () => {
    const newId = crypto.randomUUID()
    setActiveSessionId(newId)
    setLocalMessages([
        { sender: 'bot', text: '👋 Hello! Ask me anything about the stock market.' }
    ])
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
