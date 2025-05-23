import yfinance as yf
import statistics
from crewai import Agent
from typing import List, Dict, Any
from app.utils.summarizer import generate_summary

class MarketAgent:
    def __init__(self):
        self.agent = Agent(
            role="Market Data Collector",
            goal="Fetch stock market data from Yahoo Finance",
            backstory="A data-driven tool for fetching real-time and historical stock market data using reliable sources like Yahoo Finance.",
            verbose=True,
            memory=False
        )

    async def get_market_data(self, tickers: List[str], period: str = "1mo", interval: str = "1d") -> Dict[str, Any]:
        result = {"tickers": []}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period=period, interval=interval)
                records = hist.reset_index().to_dict(orient="records")

                # 🧠 LLM summary
                prompt = f"Summarize the historical market data of {ticker} for the last {period}: {records[-5:]}"  # last 5 days
                summary = await generate_summary(prompt)

                result["tickers"].append({
                    "symbol": ticker,
                    "raw": {
                        "historical_data": records
                    },
                    "summary": summary
                })
            except Exception as e:
                result["tickers"].append({
                    "symbol": ticker,
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                })
        return result

    async def get_live_price(self, tickers: List[str]) -> Dict[str, Any]:
        result = {"tickers": []}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                price = stock.info.get("regularMarketPrice", "N/A")

                prompt = f"What is the current market price of {ticker}? It is {price}."
                summary = await generate_summary(prompt)

                result["tickers"].append({
                    "symbol": ticker,
                    "raw": {
                        "price": price
                    },
                    "summary": summary
                })
            except Exception as e:
                result["tickers"].append({
                    "symbol": ticker,
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                })
        return result


    async def get_financials(self, tickers: List[str]) -> Dict[str, Any]:
        result = {"tickers": []}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                raw = {
                    "PE_ratio": info.get("trailingPE"),
                    "EPS": info.get("trailingEps"),
                    "market_cap": info.get("marketCap")
                }

                prompt = f"Summarize the financial condition of {ticker} with these values: {raw}"
                summary = await generate_summary(prompt)

                result["tickers"].append({
                    "symbol": ticker,
                    "raw": raw,
                    "summary": summary
                })
            except Exception as e:
                result["tickers"].append({
                    "symbol": ticker,
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                })
        return result

    async def get_sector_industry(self, tickers: List[str]) -> Dict[str, Any]:
        result = {"tickers": []}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                raw = {
                    "sector": info.get("sector"),
                    "industry": info.get("industry")
                }

                prompt = f"Explain the sector and industry of {ticker}: {raw}"
                summary = await generate_summary(prompt)

                result["tickers"].append({
                    "symbol": ticker,
                    "raw": raw,
                    "summary": summary
                })
            except Exception as e:
                result["tickers"].append({
                    "symbol": ticker,
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                })
        return result
    
    async def get_dividends_and_earnings(self, tickers: List[str]) -> Dict[str, Any]:
        result = {"tickers": []}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)

                dividends_df = stock.dividends
                dividends = dividends_df.reset_index().to_dict(orient="records") if not dividends_df.empty else []

                calendar = stock.calendar
                if hasattr(calendar, "T"):
                    earnings = calendar.T.to_dict().get("Value", {})
                elif isinstance(calendar, dict):
                    earnings = calendar.get("Value", {})
                else:
                    earnings = {}

                raw = {
                    "dividends": dividends[-5:],  # show only last 5
                    "earnings_dates": earnings
                }

                prompt = f"Summarize recent dividend and earnings info for {ticker}: {raw}"
                summary = await generate_summary(prompt)

                result["tickers"].append({
                    "symbol": ticker,
                    "raw": raw,
                    "summary": summary
                })
            except Exception as e:
                result["tickers"].append({
                    "symbol": ticker,
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                })
        return result
    
    async def get_analysis(self, tickers: List[str], period: str = "3mo", interval: str = "1d") -> Dict[str, Any]:
        data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period=period, interval=interval).reset_index()

                closes = hist['Close'].tolist()
                highs = hist['High'].tolist()
                lows = hist['Low'].tolist()
                pe_ratio = stock.info.get("trailingPE")

                trend = "sideways"
                if len(closes) >= 2:
                    change = closes[-1] - closes[0]
                    avg = statistics.mean(closes)
                    if abs(change) > avg * 0.05:
                        trend = "upward" if change > 0 else "downward"
                    elif statistics.stdev(closes) / avg > 0.05:
                        trend = "volatile"

                    growth_pct = ((closes[-1] - closes[0]) / closes[0]) * 100 if closes[0] else 0
                else:
                    growth_pct = 0

                data[ticker] = {
                    "trend": trend,
                    "growth_pct": round(growth_pct, 2),
                    "support": round(min(lows), 2) if lows else None,
                    "resistance": round(max(highs), 2) if highs else None,
                    "PE_ratio": pe_ratio
                }
            except Exception as e:
                data[ticker] = {"error": str(e)}
        return data