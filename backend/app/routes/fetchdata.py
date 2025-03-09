from fastapi import APIRouter, Query
import yfinance as yf

router = APIRouter()

@router.get("/marketdata")
async def get_market_data(ticker: str, periode : str = Query("1d", regex="1d|5d|1mo|3mo|6mo|1y|2y|5y|10y|ytd|max")):
    stock = yf.Ticker(ticker)
    data = stock.history(period=periode)
    return data.to_dict(orient="records")