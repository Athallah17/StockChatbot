import OpenAI from 'openai';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

/**
 * Determines user intent from input.
 * Extracts stock ticker, period, and insight type.
 */
export async function intentDetection(userInput: string) {
    const intentPrompt = `
        You are an AI assistant that extracts stock-related intents from user messages.
        Given a user's input, identify the following:
        - "intent": Either "stock_prediction" (if about stock market) or "general_chat"
        - "ticker": Extract the stock symbol (e.g., AAPL, TSLA, NVDA)
        - "period": The time range (e.g., '1d', '7d', '1mo'), default to '1d' if not specified. 
          VALID_PERIODS = {"1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"}.
          If the input period is not in VALID_PERIODS, adjust it to the closest valid period.
        - "insightType": What the user is asking for ("current_price", "market_history", or "trend_prediction")

        If no stock ticker is found, return intent as "general_chat".

        Example Inputs & Expected Outputs:
        1. "What is AAPL's price now?" → { "intent": "stock_prediction", "ticker": "AAPL", "insightType": "current_price" }
        2. "Show me TSLA stock trends last week" → { "intent": "stock_prediction", "ticker": "TSLA", "period": "5d", "insightType": "market_history" }
        3. "What will happen to NVDA stock?" → { "intent": "stock_prediction", "ticker": "NVDA", "insightType": "trend_prediction" }
        4. "Hello, how are you?" → { "intent": "general_chat" }

        User Input: "${userInput}"
        Respond only in valid JSON format.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: intentPrompt }],
            response_format: { type: "json_object" }, // Ensures structured JSON output
            max_tokens: 50,
        });

        return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
        console.error('Intent classification failed:', error);
        return { intent: 'general_chat' };
    }
}
