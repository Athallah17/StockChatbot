'use client'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { Layout, Input, Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useChatMutation } from '@/hooks/useChatMutation'

const { Content, Sider } = Layout
const { TextArea } = Input

const Chatbots = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hello! Ask me anything about the stock market.' },
  ])
  const [input, setInput] = useState('')

  const chatMutation = useChatMutation()

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: 'user', text: input }])

    try {
      const reply = await chatMutation.mutateAsync(input)
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }])
    } catch (err) {
      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: '❌ Oops! Something went wrong.',
      }])
    } finally {
      setInput('')
    }
  }

  return (
    <Layout className="h-screen">
      <Sider theme="dark" className="p-4">
        <div className="text-2xl font-bold mb-4 text-white">📊 Stockers</div>
        <ul className="font-semibold text-white">
          <li className="mb-6 cursor-pointer">History</li>
          <li className="mb-6 cursor-pointer">Settings</li>
        </ul>
      </Sider>

      <Layout>
        <Content className="p-4 flex flex-col h-full overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 m-2 max-w-md whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-300 text-black'
                } rounded-lg`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex gap-2 items-end">
            <TextArea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={chatMutation.isPending}
            >
              Send
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Chatbots
