import { useQuery } from '@tanstack/react-query'
import { MarketApi, MarketRequest } from '@/utils/api/market-api'

const useMarketHistorical = (params: MarketRequest) => {
    const {
        data = {},
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ['market-historical', params],
        queryFn: () => MarketApi.getHistoricalData(params),
        enabled: !!params.tickers?.length,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    return { historical: data, isLoading, isFetching, error }
}

export default useMarketHistorical
