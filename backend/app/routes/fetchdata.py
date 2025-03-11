from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yfinance as yf

router = APIRouter()

# Define request body model
class MarketDataRequest(BaseModel):
    ticker: str
    periode: str  # User must provide a valid period
    full_data: bool = False  # Defaults to False if not provided

# Define valid periods for validation
VALID_PERIODS = {"1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"}

@router.post("/marketdata")
async def get_market_data(request: MarketDataRequest):
    ticker = request.ticker
    periode = request.periode
    full_data = request.full_data

    # Validate periode
    if periode not in VALID_PERIODS:
        raise HTTPException(status_code=400, detail="Invalid period. Choose from: " + ", ".join(VALID_PERIODS))

    stock = yf.Ticker(ticker)

    # Get historical data
    historical_data = stock.history(period=periode).to_dict(orient="records")

    # Get current price (only if historical data is empty)
    current_price = stock.history(period="1d")['Close'].iloc[-1] if not historical_data else None

    # Get stock fundamental data
    try:
        info = stock.info
    except Exception:
        raise HTTPException(status_code=404, detail=f"Data for {ticker} not found")

    data = {
        "ticker": ticker,
        "current_price": current_price,
        "open": info.get('open'),
        "previous_close": info.get('previousClose'),
        "day_range": f"{info.get('dayLow')} - {info.get('dayHigh')}",
        "volume": info.get('volume'),
        "historical_data": historical_data if full_data else None,

        # Fundamental data
        "name": info.get('longName'),
        "market_cap": info.get('marketCap'),
        "pe_ratio": info.get('trailingPE'),
        "revenue": info.get('totalRevenue'),
        "eps": info.get('trailingEps'),
        "dividend_yield": info.get('dividendYield'),
        "dividend_rate": info.get('dividendRate'),

        # Statistical data
        "beta": info.get('beta'),
        "52_week_range": f"{info.get('fiftyTwoWeekLow')} - {info.get('fiftyTwoWeekHigh')}",
        "average_volume": info.get('averageVolume'),
        "market_state": info.get('marketState'),

        # Earnings & Dividend Data
        "earnings_date": info.get('earningsDate'),
        "forward_pe": info.get('forwardPE'),
        "trailing_pe": info.get('trailingPE'),
    }

    return {k: v for k, v in data.items() if v is not None}  # Filter out None values
