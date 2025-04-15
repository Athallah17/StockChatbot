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
        return res.data
    },

    getLivePrices: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_PRICES, payload)
        return res.data
    },
  
    getFinancials: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_FINANCIALS, payload)
        return res.data
    },
  
    getSectorInfo: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_SECTOR_INFO, payload)
        return res.data
    },
  
    getDividendsEarnings: async (payload: TickerListRequest) => {
        const res = await API_STOCKBOT.post(API_URLS.MARKET_DIVIDENDS_EARNINGS, payload)
        return res.data
    },
  
    getFullReport: async (payload: MarketRequest): Promise<MarketResponse> => {
        const res = await API_STOCKBOT.post<MarketResponse>(API_URLS.MARKET_FULL, payload)
        return res.data
    },
  }