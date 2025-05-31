import yfinance as yf
import json
from app.utils.scrappers import scrape_top_tickers
from app.utils.summarizer import generate_summary

class TopTickerAgent:
    async def get_top_tickers(self, category: str = "gainers", limit: int = 5):
        symbols = scrape_top_tickers(category, limit)
        tickers = yf.Tickers(" ".join(symbols))

        result = []
        for symbol in symbols:
            try:
                info = tickers.tickers[symbol].info
                result.append({
                    "symbol": symbol,
                    "shortName": info.get("shortName"),
                    "price": info.get("regularMarketPrice"),
                    "changePercent": info.get("regularMarketChangePercent"),
                    "volume": info.get("volume"),
                    "sector": info.get("sector", "N/A")
                })
            except Exception as e:
                result.append({
                    "symbol": symbol,
                    "error": str(e)
                })
        summary = await generate_summary(
            system_prompt="You are a financial assistant. Summarize the list of top stocks for a user,give an analyst on the stock total of 1-2 paragraphs.",
            prompt=f"Category: {category}\nTop stocks:\n" + json.dumps(result[:5], indent=2)
        )
        return {
            "stocks": result,
            "summary": summary
        }
