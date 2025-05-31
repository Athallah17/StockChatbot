from fastapi import APIRouter, Query, Body
from pydantic import BaseModel
from typing import List, Literal
from app.agents.market_agents import MarketAgent
from app.agents.top_ticker_agents import TopTickerAgent

router = APIRouter()
market_agent = MarketAgent()
top_ticker_agent = TopTickerAgent()

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

@router.post("/market/top-tickers")
async def get_top_tickers_post(
    payload: dict = Body(...)
):
    category = payload.get("category", "gainers")
    limit = payload.get("limit", 5)

    data = await top_ticker_agent.get_top_tickers(category, limit)
    return {
        "category": category,
        "response": data
    }

@router.get("/market/top-tickers")
async def get_top_tickers(
    category: Literal["gainers", "losers", "most_active"] = "gainers",
    limit: int = Query(5, ge=1, le=20)
):
    try:
        data = await top_ticker_agent.get_top_tickers(category, limit)
        return {
            "category": category,
            "response": data
        }
    except Exception as e:
        return {
            "error": str(e)
        }
