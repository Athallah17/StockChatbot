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

@router.post("/analyzer/predict")
async def predict_price(input: PredictInput) -> List[Dict[str, Any]]:
    results = []

    for t in input.tickers:
        try:
            # 1. Fetch and compute indicators
            df = indicator_agent.get_market_data(t, input.period, input.interval)
            df = indicator_agent.calculate_all(df)
            latest = indicator_agent.get_latest(df)
            indicators = dict(latest)
            indicators["n_days"] = input.n_days

            # 2. Price prediction
            predicted_price = prediction_agent.predict(indicators)

            # 3. Sentiment analysis
            sentiment_result = get_sentiment_for_topic(t)

            # 4. LLM-based reasoning
            # Step 4: Format user prompt for LLM
            technical_section = f"""
Technical Summary:
- RSI: {indicators.get("rsi", "N/A"):.2f}
- MACD: {indicators.get("macd", "N/A"):.2f}
- MACD Histogram: {indicators.get("macd_hist", "N/A"):.2f}
- SMA10: {indicators.get("sma_10", "N/A"):.2f}
- SMA20: {indicators.get("sma_20", "N/A"):.2f}
- EMA10: {indicators.get("ema_10", "N/A"):.2f}
- EMA20: {indicators.get("ema_20", "N/A"):.2f}
"""

            user_prompt = f"""
You are analyzing the following stock prediction.

- Ticker: {t}
- Horizon: {input.n_days} days
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
