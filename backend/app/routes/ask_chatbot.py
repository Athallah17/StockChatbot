from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
import json, httpx, traceback
from app.models.model import call_finetuned_model_with_memory
from app.models.memory import load_memory_from_db
from app.utils.TitleGenerator import generate_chat_title
from db.model.user import User
from db.model.chat import ChatSession, ChatMessage
from db.database import get_db
from auth.dependencies import get_current_user

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
    "general_information": "/api/general/info",
    "get_top_tickers": "/api/market/top-tickers",
}

active_sessions = {}  # user_id -> session_id

class AskRequest(BaseModel):
    message: str

@router.post("/ask")
async def ask_bot(
    request: AskRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = user.id
    session_id = active_sessions.get(user_id)

    # Buat session baru jika belum ada
    if not session_id:
        new_session = ChatSession(user_id=user_id, title="New Chat Session", created_at=datetime.utcnow())
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        session_id = new_session.id
        active_sessions[user_id] = session_id

    # Load LangChain memory dari pesan-pesan terakhir
    memory = load_memory_from_db(session_id, db)

    # Gunakan LLM + memory untuk klasifikasi intent
    result = await call_finetuned_model_with_memory(request.message, memory)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    action = result.get("action")
    payload = result.get("payload")
    if not action or not payload:
        raise HTTPException(status_code=422, detail="Invalid model output")

    route = ACTION_ROUTE_MAP.get(action)
    if not route:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

    # Panggil endpoint sesuai action
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8000", timeout=60.0) as client:
            response = await client.post(route, json=payload)
            response.raise_for_status()
            api_response = response.json()
    except Exception as e:
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"API call failed: {str(e)}\nTraceback:\n{tb}")

    # Update judul session jika masih default
    generated_title = await generate_chat_title(request.message)
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session and (not session.title or session.title == "New Chat Session"):
        session.title = generated_title
        db.commit()

    # Simpan pesan user
    db.add(ChatMessage(
        session_id=session_id,
        sender="user",
        message=request.message
    ))

    # Simpan pesan bot (dalam format JSON)
    bot_payload = {
        "action": action,
        "payload": payload,
        "response": api_response
    }

    db.add(ChatMessage(
        session_id=session_id,
        sender="bot",
        message=json.dumps(bot_payload)
    ))

    db.commit()

    return {
        "action": action,
        "payload": payload,
        "response": api_response
    }
