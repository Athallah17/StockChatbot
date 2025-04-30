// components/chat/LoadingMessage.tsx
import { Loader2 } from 'lucide-react'

const LoadingMessage = () => {
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
        Let me Think... 🤔
      </div>
    </div>
  )
}

export default LoadingMessage