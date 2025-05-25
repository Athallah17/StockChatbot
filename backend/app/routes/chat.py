from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.model.user import User
from db.model.chat import ChatSession, ChatMessage
from auth.dependencies import get_current_user

router = APIRouter()

@router.get("/chat/history")
def get_chat_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )

    results = []
    for session in sessions:
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session.id)
            .order_by(ChatMessage.timestamp.asc())
            .all()
        )
        results.append({
            "session_id": session.id,
            "title": session.title,
            "created_at": session.created_at,
            "messages": [
                {"sender": m.sender, "message": m.message, "timestamp": m.timestamp}
                for m in messages
            ]
        })

    return results

@router.get("/chat/history/{session_id}")
def get_chat_history(
    session_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )

    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for this session")

    return {
        "session_id": session_id,
        "messages": [
            {
                "sender": m.sender,
                "message": m.message,
                "created_at": m.timestamp.isoformat()
            }
            for m in messages
        ]
    }