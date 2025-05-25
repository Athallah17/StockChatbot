from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.models.model import call_finetuned_model
from db.database import SessionLocal
from db.model.user import User
from db.model.chat import ChatSession, ChatMessage
from auth.dependencies import get_current_user
from db.database import get_db
import json
import httpx
import traceback
from sqlalchemy.orm import Session
from datetime import datetime

router = APIRouter()

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
    "get_calcucate_indicators": "/api/indicators/all",
    "get_predict_price": "/api/analyzer/predict",
    "get_charts": "/api/market/charts",
}


active_sessions = {}  # ⬅️ Simpan session_id per user sementara

class AskRequest(BaseModel):
    message: str

@router.post("/ask")
async def ask_bot(
    request: AskRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Step 1: Gunakan model untuk klasifikasi
    result = call_finetuned_model(request.message)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    action = result.get("action")
    payload = result.get("payload")
    if not action or not payload:
        raise HTTPException(status_code=422, detail="Invalid model output")

    route = ACTION_ROUTE_MAP.get(action)
    if not route:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

    # Step 2: Panggil endpoint analisis terkait
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8000", timeout=60.0) as client:
            response = await client.post(route, json=payload)
            response.raise_for_status()
            api_response = response.json()
    except Exception as e:
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"API call failed: {str(e)}\nTraceback:\n{tb}")

    # Step 3: Simpan ke DB (chat_sessions & chat_messages)
    user_id = user.id
    session_id = active_sessions.get(user_id)

    # Buat session jika belum ada
    if not session_id:
        new_session = ChatSession(user_id=user_id, title=request.message, created_at=datetime.utcnow())
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        session_id = new_session.id
        active_sessions[user_id] = session_id

    # Simpan pesan user
    db.add(ChatMessage(
        session_id=session_id,
        sender="user",
        message=request.message
    ))

    bot_payload = {
    "action": action,
    "payload": payload,
    "response": api_response
}

    # Simpan respon bot
    db.add(ChatMessage(
        session_id=session_id,
        sender="bot",
        message=json.dumps(bot_payload)  # Simpan sebagai JSON string
    ))

    db.commit()

    return {
        "action": action,
        "payload": payload,
        "response": api_response
    }
