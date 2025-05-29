# app/core/model.py

from openai import OpenAI, AsyncOpenAI
import os
import json
from langchain.schema import HumanMessage

# Sync client (untuk legacy usage)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# Async client (untuk LangChain + memory)
async_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Prompt asli tetap dipakai
system_prompt = (
    "You are an intent and payload extractor for a stock market assistant.\n"
    "Given a user's question, respond with a JSON object containing:\n"
    "\n"
    "- \"action\": one of the following values depending on the user intent:\n"
    "    • \"get_live_price\"\n"
    "    • \"get_historical_data\"\n"
    "    • \"get_financials\"\n"
    "    • \"get_sector_data\"\n"
    "    • \"get_dividends\"\n"
    "    • \"analyze_trend\"\n"
    "    • \"analyze_full\"\n"
    "    • \"crew_stock_summary\"\n"
    "    • \"crew_buy_sell\"\n"
    "    • \"get_sentiment\"\n"
    "    • \"get_calcucate_indicators\"\n"
    "    • \"get_predict_price\"\n"
    "    • \"get_charts\"\n"
    "    • \"general_information\" (for general investing or stock-related questions that do not require data fetching)\n"
    "\n"
    "- If the user's input doesn't match any of the above intents, respond with:\n"
    "  {\n    \"action\": null,\n    \"payload\": {}\n  }\n"
    "\n"
    "- \"payload\": a dictionary of parameters required for the action (e.g., \"tickers\", \"period\", \"interval\", \"n_days\", \"message\")\n"
    "- For \"general_information\", include { \"message\": \"original user question\" } as the payload\n"
    "- For \"get_predict_price\", always include \"n_days\"\n"
    "- Use only valid Yahoo Finance tickers for financial actions\n"
    "\n"
    "Your output must be a valid JSON object in **exactly** this format:\n"
    "{\n  \"action\": \"...\",\n  \"payload\": { ... }\n}\n"
    "or\n"
    "{\n  \"action\": null,\n  \"payload\": {} \n}\n"
    "\n"
    "DO NOT provide explanations, comments, or any text other than the JSON object."
)

def call_finetuned_model(message: str, model_id: str = "ft:gpt-3.5-turbo-0125:personal::BcTbNRjx") -> dict:
    """
    Calls the fine-tuned OpenAI model and returns the structured action and payload.
    (Non-memory version)
    """
    response = client.chat.completions.create(
        model=model_id,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        temperature=0
    )

    content = response.choices[0].message.content.strip()
    print('content', content)
    try:
        return json.loads(content)
    except Exception as e:
        return {"error": f"Failed to parse LLM output: {e}", "raw": content}


async def call_finetuned_model_with_memory(user_message: str, memory, model_id: str = "ft:gpt-3.5-turbo-0125:personal::BcTbNRjx") -> dict:
    """
    Calls the fine-tuned model using LangChain memory for contextual multi-turn classification.
    """
    try:
        # Combine memory messages + new user message
        messages = memory.chat_memory.messages + [HumanMessage(content=user_message)]

        # Convert to OpenAI-style messages
        openai_messages = [{"role": "system", "content": system_prompt}]
        for msg in messages:
            role = "user" if msg.type == "human" else "assistant"
            openai_messages.append({"role": role, "content": msg.content})

        response = await async_client.chat.completions.create(
            model=model_id,
            messages=openai_messages,
            temperature=0
        )

        result = response.choices[0].message.content.strip()
        print("[LLM MEMORY OUTPUT]", result)

        return json.loads(result)
    except Exception as e:
        return {"error": f"Failed to parse model output: {e}"}
