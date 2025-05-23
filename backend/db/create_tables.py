from db.database import engine
from db.model import user
from db.model import chat
from db.database import Base


Base.metadata.create_all(bind=engine)
print("✅ Tables created: chat_sessions, chat_messages")
