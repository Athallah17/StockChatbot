'use client'

import { useState } from 'react'
import { useChatMutation } from '@/hooks/useChatMutation'
import useAsk from '@/hooks/useAskChatbot'
import { ChatMessages,ChatInput,ChatSidebar } from '@/components/chat'

const Chatbots= () => {
  const chatMutation = useChatMutation()
  const { askAsync, isAsking } = useAsk()
  const [messages, setMessages] = useState([
      { sender: 'bot', text: '👋 Hello! Ask me anything about the stock market.' },
  ])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { sender: 'user', text: input }])
  
    try {
      const res = await askAsync({ message: input })
      console.log("Answer:", res)
      setMessages((prev) => [...prev, { sender: 'bot', text: res }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Oops! Something went wrong.' },
      ])
    } finally {
      setInput('')
    }
  }

return (
  <div className="flex h-screen">
    {/* Optional Sidebar */}
    <ChatSidebar />

    {/* Chat Panel */}
    <div className="flex flex-col w-full h-full bg-neutral-100">
      {/* Message Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <ChatMessages messages={messages} isLoading={isAsking} />
        </div>
      </div>

      {/* Input */}
      <div className="w-full border-t border-gray-200 bg-white p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
            <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
            />
        </div>
      </div>
    </div>
  </div>
)
}

export default Chatbots
