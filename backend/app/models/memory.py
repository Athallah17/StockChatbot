from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage
from db.model.chat import ChatMessage
from sqlalchemy.orm import Session

def load_memory_from_db(session_id: int, db: Session, max_messages: int = 10) -> ConversationBufferMemory:
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.id.desc())
        .limit(max_messages)
        .all()
    )[::-1]  # reverse ke urutan kronologis

    for msg in messages:
        if msg.sender == "user":
            memory.chat_memory.add_message(HumanMessage(content=msg.message))
        else:
            try:
                import json
                parsed = json.loads(msg.message)
                memory.chat_memory.add_message(AIMessage(content=parsed.get("response", "")))
            except Exception:
                memory.chat_memory.add_message(AIMessage(content=msg.message))

    return memory
