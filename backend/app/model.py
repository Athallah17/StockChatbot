# app/core/model.py

from openai import OpenAI
import os

# You must set OPENAI_API_KEY in your environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def call_finetuned_model(message: str) -> dict:
    """Calls the fine-tuned OpenAI model and returns action + payload."""
    response = client.chat.completions.create(
        model="ft:gpt-3.5-turbo-0125:personal::BRbyCcYC",  # change to your fine-tuned model ID
        messages=[
            {"role": "system", "content": "You are a stock market chatbot that returns a JSON with action and payload."},
            {"role": "user", "content": message}
        ],
        temperature=0.2
    )
    
    content = response.choices[0].message.content

    # Extract JSON from response text (e.g., using regex or a structured parser if needed)
    try:
        import json
        return json.loads(content)
    except Exception as e:
        return {"error": f"Failed to parse LLM output: {e}", "raw": content}
