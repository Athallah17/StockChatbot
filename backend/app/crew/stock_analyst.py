from crewai import Task, Crew
from app.agents.market_agents import MarketAgent
from app.agents.analyzer_agents import AnalyzerAgent

class StockAnalysisCrew:
    def __init__(self):
        self.market_agent = MarketAgent()
        self.analyzer_agent = AnalyzerAgent()

    def run(self, tickers: list[str], period="3mo", interval="1d") -> dict:
        # === Step 1: Market Task (fetch historical data)
        market_task = Task(
            description=f"Fetch historical stock data for {tickers} for the past {period} with {interval} interval.",
            agent=self.market_agent.agent,
            expected_output="Structured historical market data in dictionary form."
        )

        # === Step 2: Analyzer Task (use that data to analyze)
        analyzer_task = Task(
            description=f"Analyze the stock data for {tickers}, including trend, growth, and support/resistance.",
            agent=self.analyzer_agent.agent,
            expected_output="An interpretation of stock movement, growth, and support/resistance levels."
        )
            
        # === Step 3: Create the Crew
        crew = Crew(
            agents=[self.market_agent.agent, self.analyzer_agent.agent],
            tasks=[market_task, analyzer_task],
            verbose=True
        )

        # === Step 4: Kickoff (this will simulate collaboration)
        crew_output = crew.kickoff()

        # Extract task outputs
        tasks_output = []
        for task in crew_output.tasks_output:
            tasks_output.append({
                "agent": task.agent,
                "description": task.description,
                "raw": task.raw
            })

        return {
            "summary": crew_output.raw,  # Final summary from the Crew
            "tasks_output": tasks_output
        }