import yfinance as yf
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
        data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period=period, interval=interval)
                records = hist.reset_index().to_dict(orient="records")

                # 🧠 LLM summary
                prompt = f"Summarize the historical market data of {ticker} for the last {period}: {records[-5:]}"  # last 5 days
                summary = await generate_summary(prompt)

                data[ticker] = {
                    "raw": records,
                    "summary": summary
                }
            except Exception as e:
                data[ticker] = { "error": str(e) }
        return data

    async def get_live_price(self, tickers: List[str]) -> Dict[str, Any]:
        prices = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                price = stock.info.get("regularMarketPrice", "N/A")

                prompt = f"What is the current market price of {ticker}? It is {price}."
                summary = await generate_summary(prompt)

                prices[ticker] = {
                    "price": price,
                    "summary": summary
                }

            except Exception as e:
                prices[ticker] = { "error": str(e) }

        return prices


    async def get_financials(self, tickers: List[str]) -> Dict[str, Any]:
        financial_data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                pe = info.get("trailingPE")
                eps = info.get("trailingEps")
                cap = info.get("marketCap")

                raw = {
                    "PE_ratio": pe,
                    "EPS": eps,
                    "market_cap": cap
                }

                prompt = f"Summarize the financial condition of {ticker} with these values: {raw}"
                summary = await generate_summary(prompt)

                financial_data[ticker] = {
                    "raw": raw,
                    "summary": summary
                }

            except Exception as e:
                financial_data[ticker] = { "error": str(e) }
        return financial_data

    async def get_sector_industry(self, tickers: List[str]) -> Dict[str, Any]:
        sector_data = {}
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

                sector_data[ticker] = {
                    "raw": raw,
                    "summary": summary
                }

            except Exception as e:
                sector_data[ticker] = { "error": str(e) }
        return sector_data
    async def get_dividends_and_earnings(self, tickers: List[str]) -> Dict[str, Any]:
        dividend_data = {}
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

                dividend_data[ticker] = {
                    "raw": raw,
                    "summary": summary
                }

            except Exception as e:
                dividend_data[ticker] = { "error": str(e) }
        return dividend_data
