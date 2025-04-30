'use client'

import { ChatMessageRenderer } from './ChatRenderer'
import LoadingMessage from './Loading'
import { Bot, User } from 'lucide-react'
import { Message } from '@/types/chat'

const ChatMessages = ({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => {
        const isUser = msg.sender === 'user'
        return (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Left Avatar (Bot) */}
            {!isUser && (
              <div className="flex-shrink-0">
                <div className="bg-gray-200 rounded-full p-2">
                  <Bot className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                isUser
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border'
              }`}
            >
              <ChatMessageRenderer message={msg} />
            </div>

            {/* Right Avatar (User) */}
            {isUser && (
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            )}
          </div>
        )
      })}
      {isLoading && <LoadingMessage />}
    </div>
  )
}

export default ChatMessages