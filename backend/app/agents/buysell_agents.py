# app/agents/buy_sell_agent.py

from crewai import Agent
from app.utils.summarizer import generate_summary  # Reuse OpenAI LLM wrapper

from crewai import Agent
from app.utils.summarizer import generate_summary

class BuySellAgent:
    def __init__(self):
        self.agent = Agent(
            role="Buy/Sell Recommender",
            goal="Provide buy, sell, or hold recommendations based on market indicators.",
            backstory="An experienced trader who analyzes growth, trends, and valuations to offer solid investment decisions.",
            verbose=True,
            memory=False
        )

    def build_prompt(self, ticker: str, metrics: dict) -> str:
        return f"""
        Ticker: {ticker}
        Trend: {metrics.get("trend")}
        Growth %: {metrics.get("growth_pct")}
        Support: {metrics.get("support")}
        Resistance: {metrics.get("resistance")}
        PE Ratio: {metrics.get("PE_ratio")}

        Based on the above metrics, provide a clear recommendation to BUY, SELL, or HOLD. Use Markdown format for the response.
        Include a summary of the reasoning behind the recommendation. The summary should be concise and focus on the most relevant metrics that influenced the decision.
        Explain the reasoning in 3-5 sentences.
        """

