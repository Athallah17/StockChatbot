# crew_buysell.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.crew.buysell_crew import BuySellCrew

router = APIRouter()
crew = BuySellCrew()

class BuySellRequest(BaseModel):
    tickers: List[str]
    period: str = "3mo"
    interval: str = "1d"

@router.post("/crew/buy-sell")
async def run_buy_sell_crew(request: BuySellRequest):
    responses = []

    for ticker in request.tickers:
        result = await crew.run(ticker=ticker, period=request.period, interval=request.interval)
        responses.append({
            "ticker": result["ticker"],
            "metrics": result["metrics"],
            "recommendation": result["recommendation"].raw
        })

    return responses
