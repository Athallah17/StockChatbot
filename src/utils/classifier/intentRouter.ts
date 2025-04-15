import { classifyIntent, IntentType } from './classifyIntent'
import { AnalyzerApi } from '@/utils/api/analyzer-api'
import { MarketApi } from '@/utils/api/market-api'

interface ParsedIntent {
  intent: IntentType
  tickers: string[]
  period: string
  interval: string
}

export const handleIntentRouting = async (
    message: string,
    options?: { defaultTicker?: string }
  ): Promise<string> => {
    const intent = classifyIntent(message);
    const ticker = extractTicker(message) || options?.defaultTicker || "AAPL";
  
    const payload = {
      tickers: [ticker],
      period: "3mo",
      interval: "1d"
    };
  
    switch (intent) {
      case "live_price": {
        const res = await MarketApi.getLivePrices({ tickers: [ticker] });
        const data = res[ticker];
        if (!data) return "No data found.";
        return `💵 **${ticker} Price**: $${data.price}\n📝 ${data.summary}`;
      }
  
      case "trend": {
        const res = await AnalyzerApi.getTrendAndGrowth(payload);
        const trend = res?.analysis?.trend?.[ticker];
        const growth = res?.analysis?.growth?.[ticker];
        if (!trend || !growth)
          return `⚠️ No trend/growth info available for ${ticker}`;
        return `📊 **${ticker}**\nTrend: ${trend}\nGrowth: ${growth.growth_pct}%`;
      }
  
      case "historical": {
        const res = await MarketApi.getHistoricalData({ tickers: [ticker] });
        const data = res[ticker];
        if (!data) return "No historical data found.";
        return `📉 **${ticker} History Summary**:\n${data.summary}`;
      }
  
      case "financial": {
        const res = await MarketApi.getFinancials({ tickers: [ticker] });
        const data = res[ticker];
        if (!data) return "No financials found.";
        return `📊 **${ticker} Financials**\nPE Ratio: ${data.raw.PE_ratio}\nEPS: ${data.raw.EPS}\nMarket Cap: ${data.raw.market_cap}\n📝 ${data.summary}`;
      }
  
      case "dividends": {
        const res = await MarketApi.getDividendsEarnings({ tickers: [ticker] });
        const data = res[ticker];
        if (!data) return "No dividends/earnings info found.";
        return `📆 **${ticker} Dividends & Earnings**\n📝 ${data.summary}`;
      }
  
      case "sector_info": {
        const res = await MarketApi.getSectorInfo({ tickers: [ticker] });
        const data = res[ticker];
        if (!data) return "No sector info found.";
        return `🏢 **${ticker} Sector Info**\nSector: ${data.raw.sector}\nIndustry: ${data.raw.industry}\n📝 ${data.summary}`;
      }
  
      case "full_analysis": {
        const res = await AnalyzerApi.getFullAnalysis(payload);
        const detailed = res.analysis?.detailed?.[ticker];
        const support = res.analysis?.support_resistance?.[ticker];
  
        if (!detailed && !support) return "No full analysis available.";
  
        return (
          `🧠 **${ticker} Full Analysis**\n` +
          (detailed?.summary ? `📈 ${detailed.summary}\n` : "") +
          (support?.summary ? `📊 ${support.summary}` : "")
        );
      }
  
      default:
        return `❓ Sorry, I couldn't understand your request. Try asking about stock prices, trends, or financials.`;
    }
  };

// Simple ticker extractor
const extractTicker = (msg: string): string | null => {
  const knownTickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN']
  const upperMsg = msg.toUpperCase()
  return knownTickers.find(t => upperMsg.includes(t)) || null
}
