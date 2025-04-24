import { API_STOCKBOT } from './axiosInstance';
import { API_URLS } from './api-constants';

export interface AnalyzerRequest {
    tickers: string[]
    period?: string
    interval?: string
}

export interface AnalyzerBasicResponse {
    analysis: {
        trend: any
        growth: any
    }
}

export interface AnalyzerFullResponse {
    analysis: {
    detailed: {
        [ticker: string]: {
            start_price: number
            end_price: number
            price_change_percent: number
            average_price: number
            volatility_percent: number
            summary: string
        }
    }
    support_resistance: {
        [ticker: string]: {
            support: number | null
            resistance: number | null
        }
    }
    }
}

export const AnalyzerApi = {
    getTrendAndGrowth: async (payload: AnalyzerRequest): Promise<AnalyzerBasicResponse> => {
    const res = await API_STOCKBOT.post(API_URLS.ANALYZER_TREND, payload)
    console.log('Trend:', res.data)
    return res.data
    },

    getFullAnalysis: async (payload: AnalyzerRequest): Promise<AnalyzerFullResponse> => {
    const res = await API_STOCKBOT.post(API_URLS.ANALYZER_FULL, payload)
    console.log('Full:', res.data)
    return res.data
    }
}
