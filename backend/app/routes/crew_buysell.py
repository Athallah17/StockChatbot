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

        # Handle cases where 'metrics' or 'recommendation' might not exist
        responses.append({
            "ticker": result.get("ticker"),
            "metrics": result.get("metrics", None),  # Default to None if 'metrics' is missing
            "recommendation": result.get("recommendation", None),  # Default to None if 'recommendation' is missing
            "error": result.get("error", None)  # Include error if present
        })

    return responses
