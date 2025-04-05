from fastapi import APIRouter, HTTPException
import os
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Optional
from app.agents.analyzer_agents import AnalyzerAgent

router = APIRouter()
agent = AnalyzerAgent()
load_dotenv()
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class AnalyzeRequest(BaseModel):
    tickers: List[str]
    period: Optional[str] = "3mo"
    interval: Optional[str] = "1d"

@router.post("/analyze/trend")
def analyze_trend(request: AnalyzeRequest):
    return {"trend": agent.analyze_trend(request.tickers, request.period, request.interval)}

@router.post("/analyze/growth")
def analyze_growth(request: AnalyzeRequest):
    return {"growth": agent.analyze_growth(request.tickers, request.period, request.interval)}

@router.post("/analyze/support-resistance")
def analyze_support_resistance(request: AnalyzeRequest):
    return {"support_resistance": agent.analyze_support_resistance(request.tickers, request.period, request.interval)}

@router.post("/analyze/summary")
def summarize(request: AnalyzeRequest):
    return agent.summarize_analysis(request.tickers, request.period, request.interval)