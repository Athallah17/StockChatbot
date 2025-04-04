from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.agents.market_agents import MarketAgent

router = APIRouter()
market_agent = MarketAgent()

# === Request Models ===
class MarketRequest(BaseModel):
    tickers: List[str]
    period: str = "1mo"
    interval: str = "1d"

class TickerListRequest(BaseModel):
    tickers: List[str]

class FullReportRequest(BaseModel):
    tickers: List[str]
    period: str = "1mo"
    interval: str = "1d"
# === Routes ===

@router.post("/market/historical")
async def get_historical_data(request: MarketRequest):
    """Fetch historical market data."""
    return {
        "historical_data": market_agent.get_market_data(
            tickers=request.tickers,
            period=request.period,
            interval=request.interval
        )
    }

@router.post("/market/prices")
async def get_live_prices(request: TickerListRequest):
    """Fetch live/real-time market prices."""
    return {
        "live_prices": market_agent.get_live_price(request.tickers)
    }

@router.post("/market/financials")
async def get_financial_ratios(request: TickerListRequest):
    """Fetch P/E ratio, EPS, market cap, etc."""
    return {
        "financials": market_agent.get_financials(request.tickers)
    }

@router.post("/market/sector-info")
async def get_sector_and_industry(request: TickerListRequest):
    """Fetch sector and industry classification."""
    return {
        "sector_industry_info": market_agent.get_sector_industry(request.tickers)
    }

@router.post("/market/dividends-earnings")
async def get_dividends_and_earnings(request: TickerListRequest):
    """Fetch dividends history and earnings dates."""
    return {
        "dividends_earnings": market_agent.get_dividends_and_earnings(request.tickers)
    }

@router.post("/market/full")
async def get_full_market_report(request: FullReportRequest):
    """Fetch full market report for given tickers."""

    historical_data = market_agent.get_market_data(
        tickers=request.tickers,
        period=request.period,
        interval=request.interval
    )
    live_prices = market_agent.get_live_price(request.tickers)
    financials = market_agent.get_financials(request.tickers)
    sector_industry = market_agent.get_sector_industry(request.tickers)
    dividends_earnings = market_agent.get_dividends_and_earnings(request.tickers)

    return {
        "tickers": request.tickers,
        "period": request.period,
        "interval": request.interval,
        "data": {
            "historical": historical_data,
            "live_prices": live_prices,
            "financials": financials,
            "sector_industry": sector_industry,
            "dividends_earnings": dividends_earnings
        }
    }