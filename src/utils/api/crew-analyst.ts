// utils/api/crewStock.ts

export async function fetchCrewStockAnalysis(tickers: string[], period = "1mo", interval = "1d") {
    const response = await fetch("http://localhost:8000/api/crew/stock-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tickers, period, interval })
    });
  
    if (!response.ok) throw new Error("Failed to fetch stock analysis");
    return response.json();
  }
  