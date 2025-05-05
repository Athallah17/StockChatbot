from crewai import Task, Crew
import httpx
from app.agents.market_agents import MarketAgent
from app.agents.buysell_agents import BuySellAgent
from app.agents.news_sentiment import get_sentiment_for_topic

class BuySellCrew:
    def __init__(self):
        self.market_agent = MarketAgent()
        self.buy_sell_agent = BuySellAgent()

    async def run(self, ticker: str, period: str = "3mo", interval: str = "1d") -> dict:
        # Step 1: Fetch analysis
        analysis = await self.market_agent.get_analysis([ticker], period, interval)
        metrics = analysis.get(ticker) if analysis else None

        # Handle cases where metrics are None or contain an error
        if not metrics:
            return {"ticker": ticker, "error": "No data returned from analysis"}

        if "error" in metrics:
            return {"ticker": ticker, "error": metrics["error"]}

        # Step 2: Fetch news sentiment
        news_sentiment = get_sentiment_for_topic(ticker)

        # Step 3: Build CrewAI prompt using both metrics & sentiment
        prompt = self.buy_sell_agent.build_prompt(ticker, metrics, news_sentiment)

        # Step 4: Create task and run crew
        recommendation_task = Task(
            description=prompt,
            agent=self.buy_sell_agent.agent,
            expected_output="A final BUY, SELL, or HOLD recommendation with reasoning."
        )

        crew = Crew(
            agents=[self.buy_sell_agent.agent],
            tasks=[recommendation_task],
            verbose=True
        )

        summary = crew.kickoff()
        print(news_sentiment)
        return {
            "ticker": ticker,
            "metrics": metrics,
            "news_sentiment": news_sentiment,
            "recommendation": summary.raw
        }
