# 📈 StockBot – AI-Powered Investment Advisor Chatbot

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20By-OpenAI%20GPT--4-blue?style=for-the-badge&logo=openai" alt="Powered by OpenAI" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="Backend: FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" alt="Frontend: Next.js" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql" alt="Database: PostgreSQL" />
</p>

> **StockBot** is an AI-powered investment advisor chatbot that provides real-time stock market insights, predictions, sentiment analysis, and buy/sell recommendations — all in natural conversation.

---

## 🚀 Features

- **💬 Natural Conversations** – Ask about any stock, market trend, or financial data in plain language.
- **📊 Real-Time Data** – Live prices, historical data, sector & industry performance from Yahoo Finance.
- **📈 Technical Analysis** – Moving Averages, RSI, MACD, OBV, and more.
- **📰 Market Sentiment** – AI-powered news sentiment analysis from NewsAPI.
- **🤖 AI Agents** – Modular agents for Market Data, Analysis, Prediction, Buy/Sell Recommendations.
- **🔮 Price Predictions** – XGBoost-based forecasts up to **90 days** ahead.
- **📂 Chat History** – Stored sessions with full replay capability.
- **🌐 Web Interface** – Built with **Next.js** + **shadcn/ui** for a clean, modern UI.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (TypeScript + JSX)
- TailwindCSS + shadcn/ui
- Ant Design for layout
- TanStack Query for API calls

**Backend**
- FastAPI (Python)
- CrewAI for multi-agent orchestration
- LangChain for contextual LLM memory
- Yahoo Finance (yFinance)
- NewsAPI for sentiment analysis

**AI & ML**
- OpenAI GPT-4 / GPT-3.5 for reasoning & summarization
- XGBoost for price prediction
- Custom fine-tuned LLM for intent classification

**Database**
- PostgreSQL with chat history storage
- Optionally supports `pgvector` for semantic search

---
