import os
from openai import OpenAI
import yfinance as yf
from crewai import Agent
from typing import List, Dict
import statistics
from dotenv import load_dotenv

load_dotenv()
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AnalyzerAgent:
    def __init__(self):
        self.agent_info = Agent (
            role= "Stock Data Analyzer",
            goal="Analyze trends, growth, and support/resistance from stock data.",
            backstory= "A smart financial analyst designed to interpret raw market data into actionable insights."
        )

    def get_market_data(self, tickers: list[str], period: str = "3mo", interval: str = "1d"):
        """Fetch historical market data for one or more tickers."""
        data = {}
        for ticker in tickers:
            stock = yf.Ticker(ticker)
            hist = stock.history(period=period, interval=interval)
            data[ticker] = hist.reset_index().to_dict(orient="records")
        return data

    def analyze_trend(self, tickers: list[str], period="3mo", interval="1d") -> dict:
        data = self.get_market_data(tickers, period, interval)
        results = {}
        for ticker, price_data in data.items():
            closes = [entry['Close'] for entry in price_data]
            if len(closes) < 2:
                results[ticker] = "not enough data"
                continue
            change = closes[-1] - closes[0]
            volatility = statistics.stdev(closes) / statistics.mean(closes) if statistics.mean(closes) != 0 else 0
            if abs(change) > statistics.mean(closes) * 0.05:
                trend = "upward" if change > 0 else "downward"
            elif volatility > 0.05:
                trend = "volatile"
            else:
                trend = "sideways"
            results[ticker] = trend
        return results

    def analyze_growth(self, tickers: list[str], period="3mo", interval="1d") -> dict:
        data = self.get_market_data(tickers, period, interval)
        results = {}
        for ticker, price_data in data.items():
            closes = [entry['Close'] for entry in price_data]
            if len(closes) < 2:
                results[ticker] = {"growth_pct": 0.0, "start": None, "end": None}
                continue
            growth_pct = ((closes[-1] - closes[0]) / closes[0]) * 100
            results[ticker] = {
                "growth_pct": round(growth_pct, 2),
                "start": closes[0],
                "end": closes[-1]
            }
        return results

    def analyze_support_resistance(self, tickers: list[str], period="3mo", interval="1d") -> dict:
        data = self.get_market_data(tickers, period, interval)
        results = {}
        for ticker, price_data in data.items():
            highs = [entry['High'] for entry in price_data if 'High' in entry]
            lows = [entry['Low'] for entry in price_data if 'Low' in entry]
            if not highs or not lows:
                results[ticker] = {"support": None, "resistance": None}
                continue
            results[ticker] = {
                "support": round(min(lows), 2),
                "resistance": round(max(highs), 2)
            }
        return results
    
    def summarize_analysis(self, tickers: list[str], period="3mo", interval="1d") -> dict:
        trend = self.analyze_trend(tickers, period, interval)
        growth = self.analyze_growth(tickers, period, interval)
        support_resistance = self.analyze_support_resistance(tickers, period, interval)

        # Combine all analysis data into a single summary
        analysis_data = {
            "trend": trend,
            "growth": growth,
            "support_resistance": support_resistance
        }

        # Prepare the prompt for OpenAI
        prompt = (
            f"Trend Analysis:\n{trend}\n\n"
            f"Growth Analysis:\n{growth}\n\n"
            f"Support and Resistance Analysis:\n{support_resistance}\n\n"
            "Summarize these insights in a concise and professional tone."
        )

        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial analyst."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            summary = response.choices[0].message.content.strip()
        except Exception as e:
            summary = f"Error generating summary: {e}"

        return {
            "trend": trend,
            "growth": growth,
            "support_resistance": support_resistance,
            "summary": summary
        }
