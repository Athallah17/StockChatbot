import requests

YAHOO_JSON_ENDPOINTS = {
    "gainers": "day_gainers",
    "losers": "day_losers",
    "most_active": "most_actives"
}

def scrape_top_tickers(category: str = "gainers", limit: int = 5):
    screener_id = YAHOO_JSON_ENDPOINTS.get(category)
    if not screener_id:
        raise ValueError("Invalid category")

    url = f"https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds={screener_id}&count={limit}"

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers, timeout=10)
    data = response.json()

    try:
        quotes = data["finance"]["result"][0]["quotes"]
        tickers = [quote["symbol"] for quote in quotes]
        print("Fetched tickers:", tickers)
        return tickers
    except Exception as e:
        print("Error parsing JSON:", e)
        return []
