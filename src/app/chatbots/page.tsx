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
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ])
  const [input, setInput] = useState('')

  const { mutate: sendChat, isPending } = useChatMutation()

  const handleSend = () => {
    if (!input.trim()) return

    const newUserMsg = { sender: 'user', text: input }
    setMessages(prev => [...prev, newUserMsg])
    setInput('')

    sendChat(input, {
      onSuccess: (botReply) => {
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }])
      },
      onError: () => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! Something went wrong.' }])
      }
    })
  }

  return (
    <Layout className="h-screen">
      <Sider theme="dark" className="p-4">
        <div className="text-2xl font-bold mb-4">Menu</div>
        <ul className="font-semibold">
          <li className="mb-6 cursor-pointer">History</li>
          <li className="mb-6 cursor-pointer">Settings</li>
        </ul>
      </Sider>

      <Layout>
        <Content className="p-4 flex flex-col h-full overflow-hidden">
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 m-2 max-w-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-200'
                } rounded-lg`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <TextArea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
              onPressEnter={(e) => {
                e.preventDefault()
                handleSend()
              }}
              disabled={isPending}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isPending}
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
