import { classifyIntent, IntentType } from './classifyIntent'
import { AnalyzerApi } from '@/utils/api/analyzer-api'
import { MarketApi } from '@/utils/api/market-api'
import { CrewApi } from '@/utils/api/crew-api'

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
  
    console.log('Intent:', intent)
    switch (intent) {
      case "live_price": {
        const res = await MarketApi.getLivePrices({ tickers: [ticker] });
        const data = res[ticker];
        console.log('live',data)
        if (!data) return "No data found.";
        return `💵 **${ticker} Price**: $${data.price}\n📝 ${data.summary}`;
      }
  
      case "trend": {
        const res = await AnalyzerApi.getTrendAndGrowth(payload);
        const trendData = res?.analysis?.[ticker];
        if (!trendData) return `⚠️ No trend/growth info available for ${ticker}`;

        const { trend, growth_pct, raw, summary } = trendData;
        const startPrice = raw?.start?.toFixed(2) || "N/A";
        const endPrice = raw?.end?.toFixed(2) || "N/A";

        return (
          `📊 **${ticker} Trend Analysis**\n` +
          `📈 Trend: ${trend}\n` +
          `📉 Growth: ${growth_pct}%\n` +
          `💵 Price Change: From $${startPrice} to $${endPrice}\n` +
          `📝 Summary: ${summary}`
        );
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

      case 'buy_sell': {
        const res = await CrewApi.getBuySellRecommendation(payload);
      
        return res
          .map((r) => {
            const { ticker, metrics, recommendation } = r;
            return (
              `🧾 **Buy/Sell Recommendation for \`${ticker}\`**\n\n` +
              `**📉 Trend:** ${metrics.trend}\n` +
              `**📊 Growth %:** ${metrics.growth_pct}%\n` +
              `**📈 Support Level:** ${metrics.support}\n` +
              `**🛑 Resistance Level:** ${metrics.resistance}\n` +
              `**💼 PE Ratio:** ${metrics.PE_ratio}\n\n` +
              `${recommendation}`
            );
          })
          .join('\n\n---\n\n');
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
