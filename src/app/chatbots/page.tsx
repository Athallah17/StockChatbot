'use client'

import { useEffect, useState } from 'react'
import useAsk from '@/hooks/useAskChatbot'
import { ChatMessages, ChatInput, ChatSidebar } from '@/components/chat'
import { useChatSession } from '@/context/ChatSessionContext'
import { useChatMessages } from '@/hooks/useChatMessages'

const Chatbots = () => {
  const { askAsync, isAsking } = useAsk()

  const {
    activeSessionId,
    localMessages,
    setLocalMessages,
    createNewSession,
  } = useChatSession()

  const { data: sessionMessages = [], isLoading: isLoadingHistory } = useChatMessages(activeSessionId)

  const [input, setInput] = useState('')

  const messages = sessionMessages.length > 0 ? sessionMessages : localMessages

  const handleSend = async () => {
    if (!input.trim()) return

    const newUserMessage = { sender: 'user', text: input }
    const newBotMessage = { sender: 'bot', text: '...' }

    // Add user message immediately
    setLocalMessages((prev) => [...prev, newUserMessage])

    try {
      const res = await askAsync({ message: input })
      console.log("Answer:", res)

      const botMsg = typeof res === 'string'
        ? { sender: 'bot', text: res }
        : {
            sender: 'bot',
            text: res || 'Sorry, Theres some error please try again later.',
          }

      setLocalMessages((prev) => [...prev, botMsg])
    } catch {
      setLocalMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Oops! Something went wrong.' },
      ])
    } finally {
      setInput('')
    }
  }

  useEffect(() => {
    // Auto-create new session on mount if none
    if (!activeSessionId) createNewSession()
  }, [activeSessionId, createNewSession])

  return (
    <div className="flex h-screen">
      <ChatSidebar />

      <div className="flex flex-col w-full h-full bg-neutral-100">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <ChatMessages messages={messages} isLoading={isAsking} />
          </div>
        </div>

        <div className="w-full border-t border-gray-200 bg-white p-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <ChatInput value={input} onChange={setInput} onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbots
