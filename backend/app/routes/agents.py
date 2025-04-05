from fastapi import APIRouter , HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from app.agents.market_agents import MarketAgent
from app.agents.analyzer_agents import AnalyzerAgent

router = APIRouter()
market_agent = MarketAgent()
analyzer_agent = AnalyzerAgent()

class MarketRequest(BaseModel):
    ticker: str
    period: str = "1d"  # Default value is "1d"

class AnalyzeRequest(BaseModel):
    ticker: str
    period: str = "1d"
    data: List[Dict[str, Any]] # this will be market data returned from `/market`
    
@router.post("/market")
async def market_data(request: MarketRequest):
    """Fetch current or historical market data."""
    data = market_agent.get_market_data(request.ticker, request.period)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return {
        "market_data": data
    }

@router.post("/analyze")
async def analyze_data(request: AnalyzeRequest):
    result = analyzer_agent.analyze_market_data({
        "ticker": request.ticker,
        "period": request.period,
        "data": request.data
    })

    return {"analysis": result}