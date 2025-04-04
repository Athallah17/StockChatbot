import os
from openai import OpenAI
from crewai import Agent
from dotenv import load_dotenv

load_dotenv()

class AnalyzerAgent:
    def __init__(self):
        self.openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        print(f"OpenAI API Key: {self.openai.api_key}")
        self.agent = Agent(
            role="Financial Market Analyzer",
            goal="Analyze stock market trends and provide investment recommendations",
            backstory="A data-driven financial analyst trained to interpret stock data and derive actionable insights.",
            verbose=True,
            memory=False
        )

    def analyze_market_data(self, market_data: dict):
        if "data" not in market_data or not market_data["data"]:
            return "No market data available for analysis."

        prompt = f"""
        Analyze the following stock market data and provide a concise summary with potential insights or recommendations.

        Stock: {market_data['ticker']}
        Period: {market_data['period']}
        Data: {market_data['data'][:5]}  # Truncated to prevent overloading the prompt

        Please summarize key trends or notable patterns.
        """

        response =  self.openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": self.agent.backstory},
                {"role": "user", "content": prompt}
            ],
        )

        return response.choices[0].message.content
