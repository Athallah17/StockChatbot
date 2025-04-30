import yfinance as yf
import statistics
from typing import List, Dict, Any
import pandas as pd
from crewai import Agent
from app.utils.summarizer import generate_summary

class AnalyzerAgent:
    def __init__(self):
        self.agent = Agent(
            role="Stock Analyzer",
            goal="Analyze stock data to detect trends and growth performance.",
            backstory="A data analyst that provides key insights into price trends and growth for better investment decisions.",
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
                data[ticker] = f"Error: {str(e)}"
        return data

    async def analyze(self, tickers: List[str], period="3mo", interval="1d") -> Dict[str, Any]:
        data = self.get_market_data(tickers, period, interval)
        result = {"tickers": []}
        for ticker, price_data in data.items():
            try:
                closes = [entry['Close'] for entry in price_data if 'Close' in entry]
                if len(closes) < 2:
                    result["tickers"].append({
                        "symbol": ticker,
                        "raw": None,
                        "summary": None,
                        "error": "Not enough data"
                    })
                    continue

                change = closes[-1] - closes[0]
                growth_pct = ((closes[-1] - closes[0]) / closes[0]) * 100
                volatility = statistics.stdev(closes) / statistics.mean(closes) if statistics.mean(closes) else 0
                trend = (
                    "upward" if change > 0 and abs(change) > 0.05 * statistics.mean(closes)
                    else "downward" if change < 0 and abs(change) > 0.05 * statistics.mean(closes)
                    else "volatile" if volatility > 0.05
                    else "sideways"
                )

                raw = {
                    "trend": trend,
                    "growth_pct": round(growth_pct, 2),
                    "start": closes[0],
                    "end": closes[-1]
                }

                prompt = f"Summarize the trend and growth performance of {ticker} based on this data: {raw}"
                summary = await generate_summary(prompt)

                result["tickers"].append({
                    "symbol": ticker,
                    "raw": raw,
                    "summary": summary
                })

            except Exception as e:
                result["tickers"].append({
                    "symbol": ticker,
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                })

        return result

    async def analyze_from_data(self, historical_data: Dict[str, List[Dict]]) -> Dict[str, Any]:
        result = {}
        for ticker, records in historical_data.items():
            try:
                df = pd.DataFrame(records)
                df['Close'] = pd.to_numeric(df['Close'], errors='coerce')
                df.dropna(subset=['Close'], inplace=True)

                if df.empty:
                    result[ticker] = {
                        "raw": None,
                        "summary": None,
                        "error": "Invalid or missing data"
                    }
                    continue

                start_price = df['Close'].iloc[0]
                end_price = df['Close'].iloc[-1]
                price_change = ((end_price - start_price) / start_price) * 100
                volatility = df['Close'].pct_change().std() * 100
                avg_price = df['Close'].mean()

                raw = {
                    "start_price": start_price,
                    "end_price": end_price,
                    "price_change_percent": round(price_change, 2),
                    "average_price": round(avg_price, 2),
                    "volatility_percent": round(volatility, 2)
                }

                prompt = f"Give a concise analysis for {ticker} based on this: {raw}"
                summary = await generate_summary(prompt)

                result[ticker] = {
                    "raw": raw,
                    "summary": summary
                }

            except Exception as e:
                result[ticker] = {
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                }

        return result

    async def analyze_support_resistance(self, tickers: List[str], period="3mo", interval="1d") -> Dict[str, Any]:
        data = self.get_market_data(tickers, period, interval)
        result = {}

        for ticker, price_data in data.items():
            try:
                highs = [entry['High'] for entry in price_data if 'High' in entry]
                lows = [entry['Low'] for entry in price_data if 'Low' in entry]
                if not highs or not lows:
                    result[ticker] = {
                        "raw": None,
                        "summary": None,
                        "error": "Insufficient data"
                    }
                    continue

                raw = {
                    "support": round(min(lows), 2),
                    "resistance": round(max(highs), 2)
                }

                prompt = f"Summarize support and resistance levels for {ticker}: {raw}"
                summary = await generate_summary(prompt)

                result[ticker] = {
                    "raw": raw,
                    "summary": summary
                }

            except Exception as e:
                result[ticker] = {
                    "raw": None,
                    "summary": None,
                    "error": str(e)
                }

        return result
