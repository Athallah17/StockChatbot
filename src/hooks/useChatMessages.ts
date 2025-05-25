import { useQuery } from '@tanstack/react-query'
import { API_STOCKBOT } from '@/utils/api/axiosInstance'
import { API_URLS } from '@/utils/api/api-constants'

export interface ChatMessage {
  sender: 'user' | 'bot'
  text: string
  action?: string
  response?: any
}

export const useChatMessages = (sessionId: string | null) => {
  return useQuery<ChatMessage[]>({
    queryKey: ['chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return []
      const res = await API_STOCKBOT.get(`${API_URLS.HISTORY}/${sessionId}`)
      const messages = res.data.messages || []

      return messages.map((msg: any) => {
        if (msg.sender === 'bot') {
          try {
            const parsed = JSON.parse(msg.message) // ⬅️ `msg.text` harusnya `msg.message`
            console.log('Parsed bot message:', parsed)
            return {
            sender: 'bot',
            text: {
                action: parsed.action,
                response: parsed.response
            }
            }
          } catch {
            return { sender: 'bot', text: msg.message }
          }
        }

        // fallback untuk user
        return { sender: 'user', text: msg.message }
      })
    },
    enabled: !!sessionId,
  })
}
