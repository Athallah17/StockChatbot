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
    return {
        "historical_data": market_agent.get_market_data(
            tickers=request.tickers,
            period=request.period,
            interval=request.interval
        )
    }

@router.post("/market/prices")
async def get_live_prices(request: TickerListRequest):
    return {
        "live_prices": market_agent.get_live_price(request.tickers)
    }

@router.post("/market/financials")
async def get_financial_ratios(request: TickerListRequest):
    return {
        "financials": market_agent.get_financials(request.tickers)
    }

@router.post("/market/sector-info")
async def get_sector_and_industry(request: TickerListRequest):
    return {
        "sector_industry_info": market_agent.get_sector_industry(request.tickers)
    }

@router.post("/market/dividends-earnings")
async def get_dividends_and_earnings(request: TickerListRequest):
    return {
        "dividends_earnings": market_agent.get_dividends_and_earnings(request.tickers)
    }

@router.post("/market/full")
async def get_full_market_report(request: FullReportRequest):
    return {
        "tickers": request.tickers,
        "period": request.period,
        "interval": request.interval,
        "data": {
            "historical": market_agent.get_market_data(request.tickers, request.period, request.interval),
            "live_prices": market_agent.get_live_price(request.tickers),
            "financials": market_agent.get_financials(request.tickers),
            "sector_industry": market_agent.get_sector_industry(request.tickers),
            "dividends_earnings": market_agent.get_dividends_and_earnings(request.tickers)
        }
    }