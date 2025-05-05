from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os
import pickle

from app.agents.news_sentiment import (
    get_news_articles, get_article_content,
    get_cached_sentiment_analysis, summarize_articles,
    SentimentCacheEntry
)
router = APIRouter()

class SentimentInput(BaseModel):
    tickers: List[str]
    period: str = "1mo"
    interval: str = "1d"

class ArticleResult(BaseModel):
    title: str
    url: str
    sentiment: str
    confidence: int
    key_insights: str

class SentimentResponse(BaseModel):
    general_sentiment: str
    average_confidence: float
    articles: List[ArticleResult]
    summary: str

@router.post("/news/sentiment", response_model=SentimentResponse)
async def analyze_news_sentiment(input: SentimentInput):
    if not input.tickers:
        raise HTTPException(status_code=400, detail="Tickers list cannot be empty")
    topic = input.tickers[0]

    num_articles = 5
    topic_key = topic.lower().replace(" ", "-")
    cache_file = f"./cache/article-cache-{topic_key}.pkl"

    if not os.path.exists("./cache"):
        os.makedirs("./cache")

    try:
        with open(cache_file, "rb") as f:
            sentiment_cache = pickle.load(f)
    except:
        sentiment_cache = {}

    try:
        articles = get_news_articles(topic, num_articles)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {e}")

    results = []
    total_conf = 0
    sentiment_count = {}

    for article in articles:
        url = article.get("url", "")
        title = article.get("title", "")
        if not url:
            continue

        content = get_article_content(url, title)
        sentiment, confidence, response, key_insights = get_cached_sentiment_analysis(
            url, title, content, cache_file, sentiment_cache
        )

        total_conf += confidence
        sentiment_count[sentiment] = sentiment_count.get(sentiment, 0) + 1

        results.append({
            "title": title,
            "url": url,
            "sentiment": sentiment,
            "confidence": confidence,
            "key_insights": key_insights
        })

    general_sentiment = max(sentiment_count.items(), key=lambda x: x[1])[0] if sentiment_count else "Unknown"
    avg_conf = total_conf / len(results) if results else 0.0
    summary = summarize_articles(results, topic)

    return SentimentResponse(
        general_sentiment=general_sentiment,
        average_confidence=avg_conf,
        articles=results,
        summary=summary
    )
