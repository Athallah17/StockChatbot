from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.agents.analyzer_agents import AnalyzerAgent

router = APIRouter()
analyzer_agent = AnalyzerAgent()

# === Request Model ===
class AnalysisRequest(BaseModel):
    tickers: List[str]
    period: str = "3mo"
    interval: str = "1d"

# === Route: Basic Analysis (Trend + Growth)
@router.post("/analyzer/trend")
async def basic_analysis(request: AnalysisRequest):
    return {
        "analysis": await analyzer_agent.analyze(
            tickers=request.tickers,
            period=request.period,
            interval=request.interval
        )
    }

# === Route: Full Statistical Analysis (Optional)
@router.post("/analyzer/full")
async def full_analysis(request: AnalysisRequest):
    historical_data = analyzer_agent.get_market_data(
        tickers=request.tickers,
        period=request.period,
        interval=request.interval
    )
    detailed = await analyzer_agent.analyze_from_data(historical_data)
    support = await analyzer_agent.analyze_support_resistance(
        tickers=request.tickers,
        period=request.period,
        interval=request.interval
    )

    return {
        "analysis": {
            "detailed": detailed,
            "support_resistance": support
        }
    }