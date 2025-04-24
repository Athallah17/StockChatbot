// utils/api/crew-api.ts

import { API_STOCKBOT } from "./axiosInstance";
import { API_URLS } from "./api-constants";

export interface CrewRequest {
  tickers: string[];
  period?: string;
  interval?: string;
}

export interface CrewAnalysisResponse {
  ticker: string;
  trend: string;
  growth_pct: number;
  support: number;
  resistance: number;
  summary: string;
}

export interface CrewBuySellResponse {
  ticker: string;
  metrics: {
    trend: string;
    growth_pct: number;
    support: number;
    resistance: number;
    PE_ratio: number;
  };
  recommendation: string;
}

export const CrewApi = {
  getStockAnalysis: async (
    payload: CrewRequest
  ): Promise<CrewAnalysisResponse[]> => {
    const res = await API_STOCKBOT.post(API_URLS.CREW_STOCK_ANALYSIS, payload);
    console.log("Crew Stock Analysis:", res.data);
    return res.data;
  },

  getBuySellRecommendation: async (
    payload: CrewRequest
  ): Promise<CrewBuySellResponse[]> => {
    const res = await API_STOCKBOT.post(API_URLS.CREW_BUY_SELL, payload);
    console.log("Crew Buy/Sell Recommendation:", res.data);
    return res.data;
  },
};
