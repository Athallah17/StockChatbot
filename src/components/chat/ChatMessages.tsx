import Markdown from 'react-markdown'

interface Props {
  messages: { sender: string; text: string }[]
}

const ChatMessages = ({ messages }: Props) => {
  return (
    <>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex px-3 py-2 ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap shadow-sm ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black border'
            }`}
          >
            <Markdown>{msg.text}</Markdown>
          </div>
        </div>
      ))}
    </>
  )
}

export default ChatMessages
