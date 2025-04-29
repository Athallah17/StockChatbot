from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import fetchdata, market, analyzer, crew_analyst, crew_buysell, ask_chatbot

app = FastAPI(title="Stock Chatbot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(fetchdata.router,prefix="/api")
app.include_router(market.router,prefix="/api")
app.include_router(analyzer.router,prefix="/api")
app.include_router(crew_analyst.router,prefix="/api")
app.include_router(crew_buysell.router,prefix="/api")
app.include_router(ask_chatbot.router,prefix="/api")



@app.get("/")
def read_root():
    return {"Hello": "World"}