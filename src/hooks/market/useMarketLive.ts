import { useQuery } from '@tanstack/react-query'
import { MarketApi, TickerListRequest } from '@/utils/api/market-api'

const useMarketLive = (params: TickerListRequest) => {
  const {
    data = {},
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['market-prices', params.tickers],
    queryFn: () => MarketApi.getLivePrices(params),
    enabled: !!params.tickers?.length,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return { prices: data, isLoading, isFetching, error }
}

export default useMarketLive
