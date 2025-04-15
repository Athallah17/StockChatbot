import { useMutation } from '@tanstack/react-query'
import { handleIntentRouting } from '@/utils/classifier/intentRouter'

export const useChatMutation = () => {
  return useMutation({
    mutationFn: async (input: string) => {
      const reply = await handleIntentRouting(input)
      return reply
    }
  })
}
