from openai import AsyncOpenAI
import os

openai = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print ("key", openai)

async def generate_summary(prompt: str, system_prompt: str = "You are a stock market analyst. Your task is to generate a detailed response or summarize the given data in a way that is easy to understand for beginner to novice market enthusiasts and traders.") -> str:
    try:
        response = await openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                { "role": "system", "content": system_prompt },
                { "role": "user", "content": prompt }
            ],
            max_tokens=700,
            temperature=0.6
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[LLM Error] {e}"
