import yfinance as yf
import statistics
import pandas as pd
import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict
from crewai import Agent


load_dotenv()
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print("key",openai)

class AnalyzerAgent:
    def __init__(self):
        self.agent = Agent(
            role="Stock Analyzer",
            goal="Analyze stock data to detect trends, growth, and historical performance.",
            backstory="A data analyst that provides key insights into price trends, growth, and volatility for better investment decisions.",
            verbose=True,
            memory=False
        )

    def get_market_data(self, tickers: List[str], period: str = "3mo", interval: str = "1d") -> Dict[str, List[Dict]]:
        data = {}
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period=period, interval=interval)
                data[ticker] = hist.reset_index().to_dict(orient="records")
            except Exception as e:
                data[ticker] = f"Error fetching data: {str(e)}"
        return data

    def analyze_trend(self, tickers: List[str], period="3mo", interval="1d") -> Dict[str, str]:
        data = self.get_market_data(tickers, period, interval)
        trends = {}

        for ticker, price_data in data.items():
            try:
                closes = [entry['Close'] for entry in price_data if 'Close' in entry]
                if len(closes) < 2:
                    trends[ticker] = "not enough data"
                    continue

                change = closes[-1] - closes[0]
                avg = statistics.mean(closes)
                volatility = statistics.stdev(closes) / avg if avg else 0

                if abs(change) > avg * 0.05:
                    trend = "upward" if change > 0 else "downward"
                elif volatility > 0.05:
                    trend = "volatile"
                else:
                    trend = "sideways"

                trends[ticker] = trend

            except Exception as e:
                trends[ticker] = f"Error: {str(e)}"

        return trends

    def analyze_growth(self, tickers: List[str], period="3mo", interval="1d") -> Dict[str, Dict]:
        data = self.get_market_data(tickers, period, interval)
        growth_result = {}

        for ticker, price_data in data.items():
            try:
                closes = [entry['Close'] for entry in price_data if 'Close' in entry]
                if len(closes) < 2:
                    growth_result[ticker] = {"growth_pct": 0.0, "start": None, "end": None}
                    continue

                growth_pct = ((closes[-1] - closes[0]) / closes[0]) * 100
                growth_result[ticker] = {
                    "growth_pct": round(growth_pct, 2),
                    "start": closes[0],
                    "end": closes[-1]
                }

            except Exception as e:
                growth_result[ticker] = f"Error: {str(e)}"

        return growth_result

    def analyze_support_resistance(self, tickers: List[str], period="3mo", interval="1d") -> dict:
        data = self.get_market_data(tickers, period, interval)
        results = {}

        for ticker, price_data in data.items():
            try:
                highs = [entry['High'] for entry in price_data if 'High' in entry]
                lows = [entry['Low'] for entry in price_data if 'Low' in entry]

                if not highs or not lows:
                    results[ticker] = {"support": None, "resistance": None}
                    continue

                results[ticker] = {
                    "support": round(min(lows), 2),
                    "resistance": round(max(highs), 2)
                }

            except Exception as e:
                results[ticker] = f"Error: {str(e)}"

        return results
    
    def analyze(self, tickers: List[str], period="3mo", interval="1d") -> Dict[str, Dict]:
        """Combines trend and growth analysis."""
        return {
            "trend": self.analyze_trend(tickers, period, interval),
            "growth": self.analyze_growth(tickers, period, interval),
            "support_resistance": self.analyze_support_resistance(tickers, period, interval)
        }

    def analyze_from_data(self, historical_data: Dict[str, List[Dict]]) -> Dict[str, Dict]:
        """
        Analyze already-fetched historical data.
        This is useful when MarketAgent fetches data in FastAPI or CrewAI flows.
        """
        insights = {}

        for ticker, records in historical_data.items():
            try:
                df = pd.DataFrame(records)
                if df.empty or 'Close' not in df.columns:
                    insights[ticker] = {"error": "Insufficient data"}
                    continue

                df['Close'] = pd.to_numeric(df['Close'], errors='coerce')
                df = df.dropna(subset=['Close'])

                if df.empty:
                    insights[ticker] = {"error": "Invalid closing prices"}
                    continue

                start_price = df['Close'].iloc[0]
                end_price = df['Close'].iloc[-1]
                price_change = ((end_price - start_price) / start_price) * 100
                volatility = df['Close'].pct_change().std() * 100
                avg_price = df['Close'].mean()

                insights[ticker] = {
                    "summary": (
                        f"{ticker} started at ${start_price:.2f} and ended at ${end_price:.2f}, "
                        f"with a change of {price_change:.2f}%. Average price was ${avg_price:.2f}. "
                        f"Volatility was {volatility:.2f}%."
                    ),
                    "start_price": start_price,
                    "end_price": end_price,
                    "price_change_percent": round(price_change, 2),
                    "average_price": round(avg_price, 2),
                    "volatility_percent": round(volatility, 2)
                }

            except Exception as e:
                insights[ticker] = {"error": f"Failed to analyze: {str(e)}"}

        return insights
    def summarize_openai(self, analysis: dict) -> str:
            """Use GPT to summarize the given trend/growth/support JSON."""
            prompt = (
                f"Trend Analysis:\n{analysis.get('trend')}\n\n"
                f"Growth Analysis:\n{analysis.get('growth')}\n\n"
                f"Support and Resistance:\n{analysis.get('support_resistance')}\n\n"
                "Summarize this data in a concise, professional tone for an investor."
            )

            try:
                response = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a financial analyst."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=300
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                return f"Error generating summary: {str(e)}"