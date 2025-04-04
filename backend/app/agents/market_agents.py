
import yfinance as yf
from crewai import Agent, Task, Crew
from typing import Any, Dict, List

class MarketAgent:
    def __init__(self):
        self.agent = Agent(
            role="Market Data Collector",
            goal="Fetch stock market data from Yahoo Finance",
            backstory="A data-driven tool for fetching real-time and historical stock market data using reliable sources like Yahoo Finance.",
            verbose=True,
            memory=False
        )

    def get_market_data(self, tickers: list[str], period: str = "1mo", interval: str = "1d"):
        """Fetch historical market data for one or more tickers."""
        data = {}
        for ticker in tickers:
            stock = yf.Ticker(ticker)
            hist = stock.history(period=period, interval=interval)
            data[ticker] = hist.reset_index().to_dict(orient="records")
        return data

    def get_live_price(self, tickers: list[str]):
        """Fetch real-time prices."""
        prices = {}
        for ticker in tickers:
            stock = yf.Ticker(ticker)
            prices[ticker] = stock.info.get("regularMarketPrice", "N/A")
        return prices

    def get_financials(self, tickers: list[str]):
        """Retrieve basic financials like P/E ratio, EPS."""
        financial_data = {}
        for ticker in tickers:
            stock = yf.Ticker(ticker)
            info = stock.info
            financial_data[ticker] = {
                "PE_ratio": info.get("trailingPE"),
                "EPS": info.get("trailingEps"),
                "market_cap": info.get("marketCap"),
            }
        return financial_data

    def get_sector_industry(self, tickers: list[str]):
        """Get sector and industry information."""
        sector_data = {}
        for ticker in tickers:
            stock = yf.Ticker(ticker)
            info = stock.info
            sector_data[ticker] = {
                "sector": info.get("sector"),
                "industry": info.get("industry")
            }
        return sector_data

    def get_dividends_and_earnings(self, tickers: list[str]):
        """Get dividend history and upcoming earnings dates."""
        dividend_data = {}
        for ticker in tickers:
            stock = yf.Ticker(ticker)

            # Dividends
            dividends_df = stock.dividends
            dividends = (
                dividends_df.reset_index().to_dict(orient="records")
                if not dividends_df.empty else []
            )

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

        return dividend_data