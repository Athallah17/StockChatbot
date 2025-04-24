import { API_STOCKBOT } from './axiosInstance';
import { API_URLS } from './api-constants';

export interface MarketRequest {
  tickers: string[];
  period?: string;
  interval?: string;
}

export interface TickerListRequest {
    tickers: string[]
  }

export interface MarketResponse {
  tickers: string[];
  period: string;
  interval: string;
  data: {
    historical: any;
    live_prices: any;
    financials: any;
    sector_industry: any;
    dividends_earnings: any;
  };
}

export const MarketApi = {
    getHistoricalData: async (payload: MarketRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_HISTORICAL, payload)
        console.log('Historical:', res.data)
        return res.data
    },

    getLivePrices: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_PRICES, payload)
        console.log('Live:', res.data)
        return res.data
    },
  
    getFinancials: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_FINANCIALS, payload)
        console.log('Financials:', res.data)
        return res.data
    },
  
    getSectorInfo: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_SECTOR_INFO, payload)
        console.log('Sector:', res.data)
        return res.data
    },
  
    getDividendsEarnings: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_DIVIDENDS_EARNINGS, payload)
        console.log('Dividens:', res.data)
        return res.data
    },
  
    getFullReport: async (payload: MarketRequest): Promise<MarketResponse> => {
        const res = await API_STOCKBOT.post<MarketResponse>(API_URLS.MARKET_FULL, payload)
        console.log('Reports:', res.data)
        return res.data
    },
  }