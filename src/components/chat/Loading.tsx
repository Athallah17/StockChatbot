'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const normalMessages = [
  'Let me think... 🤔',
  'Fetching insights... 📊',
  'Crunching the numbers...',
  'Analyzing your request...',
  'Just a moment...'
]

const longMessages = [
  'Still thinking... 🧠',
  'This one’s a bit tricky... 🔍',
  'Almost there, thanks for waiting!',
  'Gathering more data for you...',
  'Making sure everything is accurate...'
]

const LoadingMessage = () => {
  const [message, setMessage] = useState('')
  const [isLong, setIsLong] = useState(false)

  useEffect(() => {
    // Set initial short loading message
    setMessage(normalMessages[Math.floor(Math.random() * normalMessages.length)])

    // Switch to long loading after 30 seconds
    const switchToLong = setTimeout(() => {
      setIsLong(true)
    }, 30000)

    let interval: NodeJS.Timeout

    // Start rotating long messages every 3 seconds once in long mode
    if (isLong) {
      setMessage(longMessages[Math.floor(Math.random() * longMessages.length)])
      interval = setInterval(() => {
        setMessage(prev => {
          // Pick a new one that is different from previous
          const others = longMessages.filter(m => m !== prev)
          return others[Math.floor(Math.random() * others.length)]
        })
      }, 8000)
    }

    return () => {
      clearTimeout(switchToLong)
      if (interval) clearInterval(interval)
    }
  }, [isLong])

  return (
    <div className="flex items-start gap-2 justify-start">
      {/* Bot Avatar */}
      <div className="flex-shrink-0">
        <div className="bg-gray-200 rounded-full p-2">
          <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
        </div>
      </div>

      {/* Loading bubble */}
      <div className="px-4 py-2 bg-white border rounded-2xl text-gray-600 shadow-sm max-w-[80%] rounded-bl-none">
        {message}
      </div>
    </div>
  )
}

export default LoadingMessage
