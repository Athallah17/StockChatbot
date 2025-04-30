from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.crew.stock_analyst import StockAnalysisCrew
import json

router = APIRouter()
crew_runner = StockAnalysisCrew()

class CrewRequest(BaseModel):
    tickers: List[str]
    period: str = "1mo"
    interval: str = "1d"

@router.post("/crew/stock-analysis")
async def run_stock_analysis_crew(request: CrewRequest):
    result = crew_runner.run(
        tickers=request.tickers,
        period=request.period,
        interval=request.interval
    )

    # Extract summary and market data
    summary_text = result["summary"]
    market_data_raw = None
    for task in result["tasks_output"]:
        if task["agent"] == "Market Data Collector":
            market_data_raw = task["raw"]
            break

    # Parse market data
    try:
        market_data = json.loads(market_data_raw)
    except Exception:
        market_data = {"error": "Failed to parse market data"}

    return {
        "summary": summary_text,
        "market_data": market_data
    }