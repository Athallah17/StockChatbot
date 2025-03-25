import OpenAI from 'openai';
import { fetchMarketData } from '@/utils/api';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

/**
 * Get Stock Insights (Market Data, Current Price, and Predictions)
 * @param ticker The stock ticker symbol.
 * @param period The time range for market history (e.g., '1d', '1w', '1mo').
 * @param insightType The type of insight ('current_price' | 'market_history' | 'trend_prediction').
 */
export async function getPredictions(
    ticker: string,
    period: string = '1d',
    insightType: 'current_price' | 'market_history' | 'trend_prediction' = 'trend_prediction'
) {
    try {
        // Fetch market data using POST method
        const marketData = await fetchMarketData(ticker, period, true);

        // Define prompt based on the insight type
        let prompt = '';
        if (insightType === 'current_price') {
            prompt = `
                You are a financial analyst. 
                Provide a concise update on the current stock price of ${ticker}. 
                Use the following market data:
                ${JSON.stringify(marketData)}
                
                Structure the response as:
                - **Stock:** ${ticker}
                - **Current Price:** $[latest price]
                - **Opening Price:** $[opening price]
                - **Volume:** [volume]
            `;
        } else if (insightType === 'market_history') {
            prompt = `
                You are a stock market analyst.
                Summarize the stock performance for ${ticker} over the last ${period}.
                Identify key trends from the following historical data:
                ${JSON.stringify(marketData)}

                Structure the response as:
                - **Stock:** ${ticker}
                - **Period:** ${period}
                - **Highest Price:** $[high]
                - **Lowest Price:** $[low]
                - **Closing Price:** $[closing price]
                - **Volume:** [volume]
                - **Overall Trend:** [Bullish/Bearish/Stable]
            `;
        } else if (insightType === 'trend_prediction') {
            prompt = `
                You are an AI stock market expert. Predict the short-term trend for ${ticker} based on recent data.
                Consider these historical trends before making a prediction:
                ${JSON.stringify(marketData)}

                Your prediction should be structured as:
                - **Stock:** ${ticker}
                - **Predicted Trend:** [Upward / Downward / Stable]
                - **Reasoning:** [Brief explanation based on historical data]
            `;
        }

        // Generate OpenAI completion
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a stock market expert providing insights.' },
                { role: 'user', content: prompt },
            ],
        });

        return completion.choices?.[0]?.message?.content || 'I could not generate a response.';
    } catch (error) {
        console.error('Error fetching OpenAI prediction:', error);
        throw error;
    }
}
