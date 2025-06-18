'use client'

import { useEffect, useState } from 'react'
import useAsk from '@/hooks/useAskChatbot'
import {
  ChatMessages,
  ChatInput,
  ChatSidebar,
  ChatHeaders,
  ChatStarter
} from '@/components/chat'
import { useChatSession } from '@/context/ChatSessionContext'
import { useChatMessages } from '@/hooks/useChatMessages'
import { useChatHistory } from '@/hooks/useChatHistory'
import { Navbar } from '@/components'

const Chatbots = () => {
  const { askAsync, isAsking } = useAsk()

  const {
    activeSessionId,
    localMessages,
    setLocalMessages,
    createNewSession,
  } = useChatSession()

  const { data: sessionMessages = [], isLoading: isLoadingHistory } = useChatMessages(activeSessionId)
  const { refetchHistory } = useChatHistory()
  const [input, setInput] = useState('')
  const messages = sessionMessages.length > 0 ? sessionMessages : localMessages

  const handleSend = async (customText?: string) => {
    const textToSend = customText ?? input
    if (!textToSend.trim()) return

    const newUserMessage = { sender: 'user', text: textToSend }
    setLocalMessages((prev) => [...prev, newUserMessage])

    try {
      const res = await askAsync({
      message: textToSend,
      session_id: activeSessionId ? Number(activeSessionId) : undefined
    })
      console.log('Answer:', res)

      const botMsg = typeof res === 'string'
        ? { sender: 'bot', text: res }
        : {
            sender: 'bot',
            text: res || 'Sorry, there’s some error. Please try again later.',
          }

      setLocalMessages((prev) => [...prev, botMsg])
      await refetchHistory()
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
    if (!activeSessionId) createNewSession()
  }, [activeSessionId])

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <div className="z-40">
        <ChatSidebar />
      </div>

      {/* Main Area */}
      <div className="flex flex-col w-full h-full bg-neutral-100">
        {/* Navbar */}
        <div className="z-30 w-full shadow-md">
          <Navbar />
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="sticky top-0 z-20 bg-white">
              <ChatHeaders />
          </div>
          <div className="max-w-3xl py-6 mx-auto space-y-4">
            {messages.length === 0 && !isAsking ? (
              <ChatStarter onPromptClick={handleSend} />
            ) : (
              <ChatMessages messages={messages} isLoading={isAsking} />
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="w-full border-t border-gray-200 bg-white p-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <ChatInput value={input} onChange={setInput} onSend={() => handleSend()} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbots
