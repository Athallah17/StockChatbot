from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.crew.stock_analyst import StockAnalysisCrew
import ast, json

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

    # crew_summary is a CrewOutput object
    crew_summary = result["crew_summary"]

    summary_text = crew_summary.raw  # full final summary

    # Get market data from the first task (Market Data Collector)
    market_data_raw = None
    for task in crew_summary.tasks_output:
        if task.agent == "Market Data Collector":
            market_data_raw = task.raw
            break

    # Convert raw string JSON to dict
    try:
        market_data = json.loads(market_data_raw)
    except Exception:
        try:
            market_data = ast.literal_eval(market_data_raw)
        except:
            market_data = {"error": "Failed to parse market data"}

    return {
        "summary": summary_text,
        "market_data": market_data
    }