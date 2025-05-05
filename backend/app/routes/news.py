from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx, os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
router = APIRouter()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

class NewsRequest(BaseModel):
    ticker: str

class NewsItem(BaseModel):
    title: str
    source: str
    url: str
    datetime: str

@router.post("/news/company-news", response_model=list[NewsItem])
async def get_mboum_company_news(request: NewsRequest):
    url = "https://mboum-finance.p.rapidapi.com/v2/markets/news"
    params = {"tickers": request.ticker.upper(), "type": "ALL"}
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "mboum-finance.p.rapidapi.com"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch news")

    news_list = response.json().get("data", [])[:5]  # top 5
    return [
        NewsItem(
            title=item["title"],
            publisher=item["publisher"],
            url=item["link"],
            datetime=datetime.utcfromtimestamp(item["providerPublishTime"]).isoformat()
        )
        for item in news_list
    ]