# app/core/model.py

from openai import OpenAI
import os

# You must set OPENAI_API_KEY in your environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def call_finetuned_model(message: str, model_id: str = "ft:gpt-3.5-turbo-0125:personal::BXUYhZYs") -> dict:
    """
    Calls the fine-tuned OpenAI model and returns the structured action and payload.
    """
    system_prompt = (
        "You are an intent and payload extractor for a stock market assistant.\n"
        "Given a user's question, return a JSON object with two keys:\n"
        "- \"action\": the name of the action to perform (e.g., \"get_sentiment\", \"get_predict_price\", \"get_calculate_indicators\")\n"
        "- \"payload\": a dictionary of parameters required for that action (e.g., \"tickers\", \"period\", \"interval\", \"n_days\")\n\n"
        "Use only valid Yahoo Finance tickers. Match the time expression in the question to the appropriate \"period\" and \"n_days\" values always use \"n_days\" when action is \"get_predict_price\".\n\n"
        "Your output must be in this exact JSON format:\n"
        "{\n  \"action\": \"...\",\n  \"payload\": { ... }\n}\n\n"
        "Do not include any natural language explanation. Do not apologize. Output only the JSON."
    )

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
    # Extract JSON from response text (e.g., using regex or a structured parser if needed)
    try:
        import json
        return json.loads(content)
    except Exception as e:
        return {"error": f"Failed to parse LLM output: {e}", "raw": content}
