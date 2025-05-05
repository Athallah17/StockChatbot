import json

class BuySellAgent:
    def __init__(self):
        from crewai import Agent
        self.agent = Agent(
            role="Buy/Sell Advisor",
            goal="Decide whether a user should buy, sell, or hold a given stock.",
            backstory="You are a financial advisor who evaluates technical indicators and news sentiment to help investors make smart decisions.",
            verbose=True
        )

    def build_prompt(self, ticker: str, metrics: dict, news_sentiment: dict) -> str:
        sentiment_section = f"""
        📰 News Sentiment for {ticker}:
        - Overall: {news_sentiment.get("general_sentiment", "Unknown")}
        - Summary: {news_sentiment.get("summary", "No summary available")}
        """

        metrics_section = f"""
        📊 Technical Metrics for {ticker}:
        {json.dumps(metrics, indent=2)}
        """

        return (
            f"{metrics_section}\n"
            f"{sentiment_section}\n"
            f"Based on both the technical metrics and recent news sentiment above, provide a clear recommendation to BUY, SELL, or HOLD {ticker}. "
            f"Explain your reasoning concisely and professionally."
        )
