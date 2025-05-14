from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.agents.indicator_agents import IndicatorAgent
from app.agents.prediction_agents import PredictionAgent

router = APIRouter()
indicator_agent = IndicatorAgent()
prediction_agent = PredictionAgent()

class PredictInput(BaseModel):
    ticker: str
    n_days: int
    period: Optional[str] = "3mo"
    interval: Optional[str] = "1d"

@router.post("/predict")
def predict_price(input: PredictInput):
    try:
        # Ambil data & hitung indikator
        df = indicator_agent.get_market_data(input.ticker, input.period, input.interval)
        df = indicator_agent.calculate_all(df)
        latest = indicator_agent.get_latest(df)

        # Siapkan fitur untuk prediksi
        features = dict(latest)
        features["n_days"] = input.n_days

        # Jalankan prediksi
        predicted_price = prediction_agent.predict(features)

        return {
            "ticker": input.ticker,
            "n_days": input.n_days,
            "predicted_price": float(predicted_price) 
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
