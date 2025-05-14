from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import market, analyzer, crew_analyst, crew_buysell, ask_chatbot, news ,sentiment, indicators, predicitons

app = FastAPI(title="Stock Chatbot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(market.router,prefix="/api")
app.include_router(analyzer.router,prefix="/api")
app.include_router(crew_analyst.router,prefix="/api")
app.include_router(crew_buysell.router,prefix="/api")
app.include_router(ask_chatbot.router,prefix="/api")
app.include_router(news.router,prefix="/api")
app.include_router(sentiment.router,prefix="/api")
app.include_router(indicators.router,prefix="/api")
app.include_router(predicitons.router,prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}