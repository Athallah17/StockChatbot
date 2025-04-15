import { useMutation } from '@tanstack/react-query'
import { MarketApi } from '@/utils/api/market-api'

export const useChatMutation = () => {
  return useMutation({
    mutationFn: async (input: string) => {
      const payload = { tickers: ['AAPL'] }

      const res = await MarketApi.getLivePrices(payload)
      const price = res.live_prices['AAPL']

      return `📈 Current price of AAPL is $${price}`
    }
  })
}
