import yfinance as yf
from crewai import Agent
from typing import List, Dict, Any

class MarketAgent:
    def __init__(self):
        self.agent = Agent(
            role="Market Data Collector",
            goal="Fetch stock market data from Yahoo Finance",
            backstory="A data-driven tool for fetching real-time and historical stock market data using reliable sources like Yahoo Finance.",
            verbose=True,
            memory=False
        )

    def get_market_data(self, tickers: List[str], period: str = "1mo", interval: str = "1d") -> Dict[str, Any]:
        data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period=period, interval=interval)
                data[ticker] = hist.reset_index().to_dict(orient="records")
            except Exception as e:
                data[ticker] = f"Error fetching history: {str(e)}"
        return data

    def get_live_price(self, tickers: List[str]) -> Dict[str, Any]:
        prices = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                prices[ticker] = stock.info.get("regularMarketPrice", "N/A")
            except Exception as e:
                prices[ticker] = f"Error fetching price: {str(e)}"
        return prices

    def get_financials(self, tickers: List[str]) -> Dict[str, Any]:
        financial_data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                pe = info.get("trailingPE")
                eps = info.get("trailingEps")
                cap = info.get("marketCap")

                financial_data[ticker] = {
                    "summary": f"{ticker} has a P/E ratio of {pe}, EPS of {eps}, and market cap of {cap}.",
                    "PE_ratio": pe,
                    "EPS": eps,
                    "market_cap": cap
                }
            except Exception as e:
                financial_data[ticker] = f"Error fetching financials: {str(e)}"
        return financial_data

    def get_sector_industry(self, tickers: List[str]) -> Dict[str, Any]:
        sector_data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                sector_data[ticker] = {
                    "summary": f"{ticker} operates in the {info.get('sector')} sector, under {info.get('industry')} industry.",
                    "sector": info.get("sector"),
                    "industry": info.get("industry")
                }
            except Exception as e:
                sector_data[ticker] = f"Error fetching sector info: {str(e)}"
        return sector_data

    def get_dividends_and_earnings(self, tickers: List[str]) -> Dict[str, Any]:
        dividend_data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)

                # Dividends
                dividends_df = stock.dividends
                dividends = dividends_df.reset_index().to_dict(orient="records") if not dividends_df.empty else []

                # Earnings calendar
                calendar = stock.calendar
                if hasattr(calendar, "T"):
                    earnings = calendar.T.to_dict().get("Value", {})
                elif isinstance(calendar, dict):
                    earnings = calendar.get("Value", {})
                else:
                    earnings = {}

                dividend_data[ticker] = {
                    "dividends": dividends,
                    "earnings_dates": earnings
                }
            except Exception as e:
                dividend_data[ticker] = f"Error fetching dividend/earnings: {str(e)}"
        return dividend_data
