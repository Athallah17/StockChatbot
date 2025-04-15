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

# === Updated Routes with Summaries Included ===

@router.post("/market/historical")
async def get_historical_data(request: MarketRequest):
    """Fetch historical market data with summary."""
    return await market_agent.get_market_data(
        tickers=request.tickers,
        period=request.period,
        interval=request.interval
    )

@router.post("/market/prices")
async def get_live_prices(request: TickerListRequest):
    """Fetch real-time market prices with summary."""
    return await market_agent.get_live_price(request.tickers)

@router.post("/market/financials")
async def get_financial_ratios(request: TickerListRequest):
    """Fetch financial data (P/E, EPS, market cap) with summary."""
    return await market_agent.get_financials(request.tickers)

@router.post("/market/sector-info")
async def get_sector_and_industry(request: TickerListRequest):
    """Fetch sector/industry info with summary."""
    return await market_agent.get_sector_industry(request.tickers)

@router.post("/market/dividends-earnings")
async def get_dividends_and_earnings(request: TickerListRequest):
    """Fetch dividends and earnings calendar with summary."""
    return await market_agent.get_dividends_and_earnings(request.tickers)

@router.post("/market/full")
async def get_full_market_report(request: FullReportRequest):
    """Aggregate all available market info with summaries."""
    return {
        "tickers": request.tickers,
        "period": request.period,
        "interval": request.interval,
        "data": {
            "historical": await market_agent.get_market_data(
                request.tickers, request.period, request.interval
            ),
            "live_prices": await market_agent.get_live_price(request.tickers),
            "financials": await market_agent.get_financials(request.tickers),
            "sector_industry": await market_agent.get_sector_industry(request.tickers),
            "dividends_earnings": await market_agent.get_dividends_and_earnings(request.tickers)
        }
    }
