import { useQuery } from '@tanstack/react-query'
import { MarketApi, TickerListRequest } from '@/utils/api/market-api'

const useMarketFinancials = (params: TickerListRequest) => {
    const {
        data = {},
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ['market-financials', params.tickers],
        queryFn: () => MarketApi.getFinancials(params),
        enabled: !!params.tickers?.length,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    return { financials: data, isLoading, isFetching, error }
}

export default useMarketFinancials
