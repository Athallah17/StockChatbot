import { useQuery } from '@tanstack/react-query'
import { MarketApi, TickerListRequest } from '@/utils/api/market-api'

const useMarketSector = (params: TickerListRequest) => {
    const {
        data = {},
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ['market-sector-info', params.tickers],
        queryFn: () => MarketApi.getSectorInfo(params),
        enabled: !!params.tickers?.length,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    return { sectorInfo: data, isLoading, isFetching, error }
}

export default useMarketSector
