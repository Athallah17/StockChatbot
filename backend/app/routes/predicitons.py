from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.agents.calculation_indicator_agents import IndicatorAgent
from app.agents.prediction_agents import PredictionAgent
from app.agents.news_sentiment import get_sentiment_for_topic
from app.utils.summarizer import generate_summary

router = APIRouter()
indicator_agent = IndicatorAgent()
prediction_agent = PredictionAgent()

class PredictInput(BaseModel):
    tickers: List[str]
    n_days: int
    period: Optional[str] = "3mo"
    interval: Optional[str] = "1d"
    
def safe_fmt(value):
    try:
        return f"{float(value):.2f}"
    except:
        return "N/A"

@router.post("/analyzer/predict")
async def predict_price(input: PredictInput) -> List[Dict[str, Any]]:
    results = []

    for t in input.tickers:
        try:
            # 1. Fetch and compute indicators
            features_df = indicator_agent.get_features_for_prediction(t, input.n_days)
            features_dict = features_df.iloc[0].to_dict()

            # 2. Price prediction
            prediction_result = prediction_agent.predict(features_dict, input.n_days)
            predicted_price = prediction_result["predicted_price"]
            used_horizon = prediction_result["used_horizon"]

            # 3. Sentiment analysis
            sentiment_result = get_sentiment_for_topic(t)

            # 4. LLM-based reasoning
            # Step 4: Format user prompt for LLM
            indicators = features_dict
            technical_section = f"""
Technical Summary:
- RSI: {safe_fmt(indicators.get("rsi"))}
- MACD: {safe_fmt(indicators.get("macd"))}
- SMA10: {safe_fmt(indicators.get("sma_10"))}
- SMA20: {safe_fmt(indicators.get("sma_20"))}
- EMA10: {safe_fmt(indicators.get("ema_10"))}
- EMA20: {safe_fmt(indicators.get("ema_20"))}
"""

            user_prompt = f"""
You are analyzing the following stock prediction.

- Ticker: {t}
- Horizon: {input.n_days} days (using model: {used_horizon}d)
- Predicted Price: ${predicted_price:.2f}
- Current Close Price: ${indicators.get("Close", "N/A"):.2f}

{technical_section}

Market Sentiment Summary:
{sentiment_result['summary']}

General Sentiment: {sentiment_result['general_sentiment']} (confidence: {sentiment_result['average_confidence']:.2f})

Write a concise Markdown investment reasoning as a financial analyst. Avoid headings, long intros, or bullet overuse.
"""

            system_prompt = """
You are a concise financial analyst. Based on technical indicators, predicted price, and sentiment,
write a clean, readable investment reasoning in Markdown.

Structure:
- 2-3 paragraph summary
- 2–3 bullet points max on key technicals
- 1 paragraph disscusion for sentiment
- 2-line recommendation

Avoid overuse of headings, repetition, or robotic formatting.
"""

            reasoning = await generate_summary(user_prompt, system_prompt)

            results.append({
                "ticker": t,
                "n_days": input.n_days,
                "predicted_price": float(predicted_price),
                "indicators": indicators,
                "sentiment": {
                    "general_sentiment": sentiment_result["general_sentiment"],
                    "average_confidence": sentiment_result["average_confidence"],
                },
                "reasoning": reasoning
            })

        except Exception as e:
            results.append({
                "ticker": t,
                "error": str(e)
            })

    return results
