'use client'

import { useChatSession } from '@/context/ChatSessionContext'
import { useChatHistory } from '@/hooks/useChatHistory'
import {
  Star,
  Pencil,
  Trash
} from 'lucide-react'
import { useState } from 'react'
import { formatDateTime } from '@/utils'

const ChatHeader = () => {
    const { activeSessionId, setActiveSessionId } = useChatSession()
    const { sessions } = useChatHistory()

    const activeSession = sessions.find(session => session.session_id === activeSessionId)
    const createdAt = activeSession?.created_at
    const title = activeSession?.title

    const [isFavorite, setIsFavorite] = useState(false)

    const handleRename = () => {
        // implement rename logic
    }

    const handleDelete = () => {
        // implement delete logic
    }

    // Don't render until session is available and has a proper title
    if (!title || title === 'New Chat Session') return null

return (
    <header className="w-full px-4 py-3 border-b bg-white text-gray-800 flex justify-between items-center shadow-sm">
        <div className="flex flex-col max-w-[70%]">
            <span className="text-lg font-bold truncate flex items-center gap-2">
            {title}
            </span>
            {createdAt && (
            <span className="text-sm px-6 py-2 text-gray-500 font-normal">
                {formatDateTime(createdAt)}
            </span>
            )}
        </div>

        <div className="flex items-center gap-2">
            <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1 rounded-md hover:bg-gray-100 transition"
            title="Favorite"
            >
            {isFavorite ? (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ) : (
                <Star className="w-5 h-5 text-gray-500" />
            )}
            </button>

            <button
            onClick={handleRename}
            className="p-1 rounded-md hover:bg-gray-100 transition"
            title="Rename"
            >
            <Pencil className="w-5 h-5 text-gray-500" />
            </button>

            <button
            onClick={handleDelete}
            className="p-1 rounded-md hover:bg-gray-100 transition"
            title="Delete"
            >
            <Trash className="w-5 h-5 text-red-500" />
            </button>
        </div>
    </header>
  )
}

export default ChatHeader
