'use client'

import { useState } from 'react'
import Markdown from 'react-markdown'
import { useChatMutation } from '@/hooks/useChatMutation'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MenuIcon, XIcon } from 'lucide-react'

export default function Chatbots() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hello! Ask me anything about the stock market.' },
  ])
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const chatMutation = useChatMutation()

  const handleSend = async () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { sender: 'user', text: input }])

    try {
      const reply = await chatMutation.mutateAsync(input)
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }])
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-blue-950 text-white p-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold whitespace-nowrap">📊 Stockers</h2>
          <button
        className="text-white"
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
          >
        <XIcon className="w-5 h-5" />
          </button>
        </div>
        {sidebarOpen && (
          <nav className="space-y-4 font-medium">
        <div className="cursor-pointer hover:underline">History</div>
        <div className="cursor-pointer hover:underline">Settings</div>
          </nav>
        )}
      </aside>

      {/* Main Area */}
      <main className="flex flex-col flex-grow p-4 bg-gray-50 relative">
        {/* Toggle Button (top-left) */}
        {!sidebarOpen && (
          <button
            className="absolute top-4 left-4 text-gray-700 z-10"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        )}

        {/* Chat Window */}
        <ScrollArea className="flex-grow pr-2 mb-4 rounded-md border bg-white p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xl px-4 py-2 my-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <Markdown>{msg.text}</Markdown>
            </div>
          ))}
        </ScrollArea>

        {/* Input Box */}
        <div className="flex gap-2 mt-2">
          <Textarea
            rows={2}
            value={input}
            placeholder="Type your message..."
            className="flex-grow resize-none"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button onClick={handleSend} disabled={chatMutation.isPending}>
            Send
          </Button>
        </div>
      </main>
    </div>
  )
}
