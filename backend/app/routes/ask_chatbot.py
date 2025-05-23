# app/routes/ask.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.model import call_finetuned_model
import httpx
import traceback
from auth.dependencies import get_current_user
from db.models import User
from fastapi import Depends

router = APIRouter()

# Action → API route map #terakhir ada apada buy-sell
ACTION_ROUTE_MAP = {
    "get_live_price": "/api/market/prices",
    "get_historical_data": "/api/market/historical",
    "get_financials": "/api/market/financials",
    "get_sector_data": "/api/market/sector-info",
    "get_dividends": "/api/market/dividends",
    "analyze_trend": "/api/analyzer/trend",
    "analyze_full": "/api/analyzer/full",
    "crew_stock_summary": "/api/crew/stock-analysis",
    "crew_buy_sell": "/api/crew/buy-sell",
    "get_sentiment": "/api/news/sentiment",
    "get_calcucate_indicators":"/api/indicators/all",
    "get_predict_price":"/api/analyzer/predict",
    "get_charts": "/api/market/charts",
}

class AskRequest(BaseModel):
    message: str

@router.post("/ask")
async def ask_bot(request: AskRequest, user: User = Depends(get_current_user)):
    # Step 1: Use fine-tuned LLM to get action + payload
    result = call_finetuned_model(request.message)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    action = result.get("action")
    payload = result.get("payload")
    print('payload before:', payload)

    if not action or not payload:
        raise HTTPException(status_code=422, detail="Model did not return valid action and payload")

    route = ACTION_ROUTE_MAP.get(action)
    print('route:', route)
    if not route:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

    # Step 2: Call mapped route with payload
    timeout = httpx.Timeout(60.0)  # 60 seconds total timeout
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8000",timeout=timeout) as client:
            response = await client.post(route, json=payload)
            print('payload:', payload)
            response.raise_for_status()
            api_response = response.json()
    except Exception as e:
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"API call failed: {str(e)}\nTraceback:\n{tb}")

    # Step 3: Return detailed response
    return {
        "action": action,
        "payload": payload,
        "response": api_response
    }
