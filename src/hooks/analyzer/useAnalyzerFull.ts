import { useQuery } from '@tanstack/react-query'
import { AnalyzerApi, AnalyzerRequest } from '@/utils/api/analyzer-api'

const useAnalyzerTrend = (params: AnalyzerRequest) => {
    const {
        data = { analysis: {} },
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ['analyzer-trend', params],
        queryFn: () => AnalyzerApi.getTrendAndGrowth(params),
        enabled: !!params.tickers?.length,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    return {
        trendGrowth: data.analysis,
        isLoading,
        isFetching,
        error,
    }
}

export default useAnalyzerTrend
