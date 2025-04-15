import { useQuery } from '@tanstack/react-query'
import { MarketApi, TickerListRequest } from '@/utils/api/market-api'

const useMarketDividends = (params: TickerListRequest) => {
    const {
        data = {},
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ['market-dividends', params.tickers],
        queryFn: () => MarketApi.getDividendsEarnings(params),
        enabled: !!params.tickers?.length,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    return { dividends: data, isLoading, isFetching, error }
}

export default useMarketDividends
