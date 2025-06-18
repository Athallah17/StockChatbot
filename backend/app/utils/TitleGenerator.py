from openai import AsyncOpenAI

async def generate_chat_title(message: str) -> str:
    """
    Generate a concise, meaningful title for a chat session based on the user's first message.
    """
    client = AsyncOpenAI()

    system_prompt = (
        "Buat judul singkat (maksimal 7 kata) yang menggambarkan topik pertanyaan berikut "
        "secara profesional dan relevan untuk sesi chat tentang saham:"
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.5,
            max_tokens=16,
        )
        title = response.choices[0].message.content.strip()
        return title
    except Exception as e:
        print(f"[generate_chat_title] Error generating title: {e}")
        return "New Chat Session"
