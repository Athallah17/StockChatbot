from fastapi import APIRouter, Query, HTTPException
import pandas as pd
from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any, List
from app.agents.calculation_indicator_agents import IndicatorAgent

router = APIRouter()
agent=IndicatorAgent()

class IndicatorRequest(BaseModel):
    ticker: List[str]
    period: Optional[str] = "3mo"
    interval: Optional[str] = "1d"
    window: Optional[int] = None  # untuk indikator yang membutuhkan window

# 1️⃣ Route: Hitung semua indikator sekaligus
@router.post("/indicators/all")
def calculate_all_indicators(request: IndicatorRequest):
    try:
        df = agent.get_market_data(request.ticker, request.period, request.interval)
        df_ind = agent.calculate_all(df)
        return agent.get_latest(df_ind)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# 2️⃣ Route: Hitung satu indikator saja secara dinamis
@router.post("/indicators/{indicator_name}")
def calculate_specific_indicator(indicator_name: Literal[
    "SMA", "EMA", "MACD", "ADX", "RSI", "ROC", "OBV"
], request: IndicatorRequest):

    try:
        df = agent.get_market_data(request.ticker, request.period, request.interval)
        result = agent.compute(indicator_name, df, window=request.window) \
                if request.window else agent.compute(indicator_name, df)

        if isinstance(result, pd.Series):
            return {"value": result.dropna().iloc[-1]}
        elif isinstance(result, dict):
            return {k: v.dropna().iloc[-1] for k, v in result.items()}
        else:
            raise ValueError("Invalid indicator result format.")

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute indicator: {e}")
