import os
import re
import datetime
import pickle
import hashlib
import requests
import logging
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from newspaper import Article
from openai import OpenAI

# === Setup ===
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
EXPIRATION_LENGTH = datetime.timedelta(days=2)

client = OpenAI(api_key=OPENAI_API_KEY)
NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything'

@dataclass
class SentimentCacheEntry:
    cached_time: datetime.datetime
    sentiment: str
    confidence: int
    response: str
    content_hash: str
    content: str
    key_insights: str

# === GPT Query ===
def send_query(input_text: str, context: str) -> str:
    completion = client.chat.completions.create(
        model='gpt-4',
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": input_text}
        ],
        temperature=0.7
    )
    return completion.choices[0].message.content.strip()

# === Get News ===
def get_news_articles(topic: str, num_articles: int) -> list:
    params = {
        'q': topic,
        'language': 'en',
        'sortBy': 'publishedAt',
        'pageSize': num_articles,
        'apiKey': NEWS_API_KEY
    }
    response = requests.get(NEWS_API_ENDPOINT, params=params)
    response.raise_for_status()
    return response.json().get('articles', [])

# === Extract Full Content ===
def get_article_content(url: str, title: str) -> str:
    article = Article(url, language='en')
    try:
        article.download()
        article.parse()
        return article.text or title
    except:
        return title

# === Sentiment Analysis & Caching ===
def get_cached_sentiment_analysis(url: str, title: str, content: str,
                                   cache_file: str,
                                   sentiment_cache: Dict[str, SentimentCacheEntry]
                                   ) -> Tuple[str, int, str, str]:
    if not content:
        return "Unknown", 0, "", ""

    content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
    now = datetime.datetime.now()

    if url in sentiment_cache:
        entry = sentiment_cache[url]
        if now - entry.cached_time <= EXPIRATION_LENGTH:
            return entry.sentiment, entry.confidence, entry.response, entry.key_insights

    context_text = (
        "Analyze the sentiment of this article and rate it as 'bullish', 'very bullish', "
        "'neutral', 'bearish', or 'very bearish'. Then write:\n"
        "Sentiment: <sentiment>\nConfidence: <confidence (0-10)>\n<bullet point insights>"
    )
    response = send_query(content[:2048], context_text)

    match = re.search(r'Sentiment:\s*([a-zA-Z\s]+)\s*Confidence:\s*(\d+)', response, re.IGNORECASE)
    if match:
        sentiment = match.group(1).strip().lower()
        confidence = int(match.group(2))
        key_insights = response[match.end():].strip()
    else:
        sentiment, confidence, key_insights = "unknown", 0, ""

    sentiment_map = {
        'very bullish': 'Very Bullish',
        'bullish': 'Bullish',
        'neutral': 'Neutral',
        'bearish': 'Bearish',
        'very bearish': 'Very Bearish'
    }
    final_sentiment = sentiment_map.get(sentiment.lower(), "Unknown")

    cache_entry = SentimentCacheEntry(
        cached_time=now,
        sentiment=final_sentiment,
        confidence=confidence,
        response=response,
        content_hash=content_hash,
        content=content,
        key_insights=key_insights
    )
    sentiment_cache[url] = cache_entry

    try:
        with open(cache_file, "wb") as f:
            pickle.dump(sentiment_cache, f)
    except:
        pass

    return final_sentiment, confidence, response, key_insights

def get_sentiment_for_topic(topic: str, num_articles: int = 5) -> dict:
    topic_key = topic.lower().replace(" ", "-")
    cache_file = f"./cache/article-cache-{topic_key}.pkl"

    if not os.path.exists("./cache"):
        os.makedirs("./cache")

    try:
        with open(cache_file, "rb") as f:
            sentiment_cache = pickle.load(f)
    except:
        sentiment_cache = {}

    articles = get_news_articles(topic, num_articles)
    results = []
    total_conf = 0
    sentiment_count = {}

    for article in articles:
        url = article.get("url", "")
        title = article.get("title", "")
        if not url:
            continue

        content = get_article_content(url, title)
        sentiment, confidence, _, key_insights = get_cached_sentiment_analysis(
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

    return {
        "general_sentiment": general_sentiment,
        "average_confidence": avg_conf,
        "articles": results,
        "summary": summary
    }

# === Summary of Sentiments ===
def summarize_articles(results: List[Dict], topic: str) -> str:
    input_text = f"Summarize news sentiment on '{topic}'.\n"
    for r in results:
        input_text += f"Title: {r['title']}\nSentiment: {r['sentiment']}\nKey Insights: {r['key_insights']}\n\n"

    context = "Provide a summary that reflects overall sentiment, major themes, and key insights."
    return send_query(input_text, context)
