import { useQuery } from '@tanstack/react-query'
import { MarketApi, MarketRequest } from '@/utils/api/market-api'

const useMarketFull = (params: MarketRequest) => {
  const {
    data = { data: {} },
    isLoading,
    isFetching,
    error
  } = useQuery({
    queryKey: ['market', params],
    queryFn: () => MarketApi.getFullReport(params),
    enabled: !!params.tickers?.length,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return {
    marketData: data?.data,
    isLoading,
    isFetching,
    error,
  }
}

export default useMarketFull
