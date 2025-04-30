# app/routes/ask.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.model import call_finetuned_model
import httpx

router = APIRouter()

# Action → API route map
ACTION_ROUTE_MAP = {
    "get_live_price": "/api/market/prices",
    "get_historical_data": "/api/market/historical",
    "get_financials": "/api/market/financials",
    "get_sector_data": "/api/market/sector-info",
    "get_dividends": "/api/market/dividends",
    "analyze_trend": "/api/analyzer/trend",
    "analyze_full": "/api/analyzer/full",
    "crew_summary": "/api/crew/analyst",
    "crew_buy_sell": "/api/crew/buy-sell"
}

class AskRequest(BaseModel):
    message: str

@router.post("/ask")
async def ask_bot(request: AskRequest):
    # Step 1: Use fine-tuned LLM to get action + payload
    result = call_finetuned_model(request.message)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    action = result.get("action")
    payload = result.get("payload")

    if not action or not payload:
        raise HTTPException(status_code=422, detail="Model did not return valid action and payload")

    route = ACTION_ROUTE_MAP.get(action)
    if not route:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

    # Step 2: Call mapped route with payload
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
            response = await client.post(route, json=payload)
            response.raise_for_status()
            api_response = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API call failed: {e}")

    # Step 3: Return detailed response
    return {
        "action": action,
        "response": api_response
    }
