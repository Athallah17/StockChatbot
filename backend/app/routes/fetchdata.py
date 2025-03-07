from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

@router.get("/marketdata")
async def get_market_data(ticker: str):
    stock = yf.Ticker(ticker)
    data = stock.history(period="1d")
    return data.to_dict(orient="records")