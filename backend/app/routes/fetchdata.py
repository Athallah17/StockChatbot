from fastapi import APIRouter, Query, HTTPException
import yfinance as yf

router = APIRouter()

@router.get("/marketdata")
async def get_market_data(
    ticker: str, 
    periode: str = Query("1d", regex="1d|5d|1mo|3mo|6mo|1y|2y|5y|10y|ytd|max"), 
    full_data: bool = False  # Menampilkan semua data jika True
):
    stock = yf.Ticker(ticker)

    # Mengambil data historis saham berdasarkan periode
    historical_data = stock.history(period=periode).to_dict(orient="records")

    # Mengambil data harga saat ini
    current_price = stock.history(period="1d")['Close'].iloc[-1] if not historical_data else None

    # Mengambil data fundamental saham
    try:
        info = stock.info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Data for {ticker} not found")

    data = {
        "ticker": ticker,
        "current_price": current_price,
        "open": info.get('open'),
        "previous_close": info.get('previousClose'),
        "day_range": f"{info.get('dayLow')} - {info.get('dayHigh')}",
        "volume": info.get('volume'),
        "historical_data": historical_data if full_data else None,
        
        # Data Fundamental
        "name": info.get('longName'),
        "market_cap": info.get('marketCap'),
        "pe_ratio": info.get('trailingPE'),
        "revenue": info.get('totalRevenue'),
        "eps": info.get('trailingEps'),
        "dividend_yield": info.get('dividendYield'),
        "dividend_rate": info.get('dividendRate'),
        
        # Data Statistik
        "beta": info.get('beta'),
        "52_week_range": f"{info.get('fiftyTwoWeekLow')} - {info.get('fiftyTwoWeekHigh')}",
        "average_volume": info.get('averageVolume'),
        "market_state": info.get('marketState'),
        
        # Data Dividen & Penghasilan
        "earnings_date": info.get('earningsDate'),
        "forward_pe": info.get('forwardPE'),
        "trailing_pe": info.get('trailingPE'),
    }

    return {k: v for k, v in data.items() if v is not None}