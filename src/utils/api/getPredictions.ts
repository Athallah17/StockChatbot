import OpenAI from 'openai';
import { fetchMarketData } from '@/utils/api/marketData';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

/**
 * Get Prediction
 * @param ticker The stock ticker symbol.
 */
export async function getPredictions(ticker: string) {
    try {
        // Fetch market data using POST method
        const marketData = await fetchMarketData(ticker, '1d', true);

        // Prepare the prompt for OpenAI
        const prompt = `
            Your task is to provide a brief stock price prediction for the next stock market opening day.
            You will be provided with the market data as follows:
            ${JSON.stringify(marketData)}

            Use the historical data and search for the latest trends before making your prediction.
        `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a stock market expert.' },
                { role: 'user', content: prompt },
            ],
        });

        const predictionResponse = completion.choices?.[0]?.message?.content || 'I could not generate a prediction.';
        return predictionResponse;
    } catch (error) {
        console.error('Error fetching OpenAI prediction:', error);
        throw error;
    }
}