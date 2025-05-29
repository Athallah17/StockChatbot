from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from app.utils.summarizer import generate_summary  # gunakan modul LLM milikmu

router = APIRouter()

class GeneralInfoRequest(BaseModel):
    message: str

@router.post("/general/info")
async def general_information(request: GeneralInfoRequest) -> Dict:
    """
    Handle general stock market or investment-related questions using GPT.
    """
    system_prompt = """
You are a knowledgeable and friendly yet expert financial assistant. Answer the user's question clearly and accurately, using simple, easy-to-understand language suitable for beginners in investing.

Focus on topics related to:
- Stock market concepts (e.g., dividends, stock splits, P/E ratio)
- Financial terms (e.g., earnings reports, market cap, revenue)
- Investment strategies (e.g., long-term vs. short-term, diversification)
- Market behavior (e.g., bull vs. bear markets, volatility)
- General guidance on how investing works

Always give concise, factual, and helpful explanations. Do not provide personalized financial advice. If the question is unclear or too broad, ask a clarifying question in return.

Respond in natural, conversational English.
""".strip()

    prompt = f"User's question: {request.message}"
    response = await generate_summary(prompt=prompt, system_prompt=system_prompt)

    return {
        "response": response
    }
