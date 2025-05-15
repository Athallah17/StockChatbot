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
            system_prompt = (
                "You are a financial analyst that provides investment reasoning based on technical indicators, "
                "predicted price, and market sentiment. Use Markdown to highlight main points like predicted price, "
                "recommendation, and key indicators."
            )
            user_prompt = f"""
                Analyze the following stock prediction:

                Ticker: {t}
                Horizon: {input.n_days} days
                Predicted Price: {predicted_price}

                Technical Indicators:
                {indicators}

                Market Sentiment Summary:
                {sentiment_result['summary']}

                Sentiment: {sentiment_result['general_sentiment']} (Confidence: {sentiment_result['average_confidence']:.2f})

                Provide an investment reasoning summary on whether the predicted price is favorable or not.
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
