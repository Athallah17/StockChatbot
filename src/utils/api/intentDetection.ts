import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export async function intentDetection(userInput: string) {
    const intentPrompt = `
    Analyze the user's input and extract structured details. 
    Respond in JSON format: 

    {
        "intent": "stock_prediction" | "general_chat",
        "ticker": "AAPL" | "NVDA" | null,
        "period": "tomorrow" | "next week" | "this year" | null,
        "specific_data": "current price" | "opening price" | "trend" | null
    }

    Examples:
    1. "What is the current price of AAPL?"
    → { "intent": "stock_prediction", "ticker": "AAPL", "period": "today", "specific_data": "current price" }

    2. "Will NVDA stock go up next week?"
    → { "intent": "stock_prediction", "ticker": "NVDA", "period": "next week", "specific_data": "trend" }

    3. "What will happen to TSLA tomorrow?"
    → { "intent": "stock_prediction", "ticker": "TSLA", "period": "tomorrow", "specific_data": "prediction" }

    4. "Who is the CEO of Google?"
    → { "intent": "general_chat", "ticker": null, "period": null, "specific_data": null }

    User input: "${userInput}"
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: intentPrompt }],
            response_format: { type: "json_object" }, // Ensures structured JSON output
            max_tokens: 100,
        });

        return JSON.parse(completion.choices?.[0]?.message?.content || '{}');
    } catch (error) {
        console.error('Intent classification failed:', error);
        return { intent: "general_chat", ticker: null, period: null, specific_data: null };
    }
}
