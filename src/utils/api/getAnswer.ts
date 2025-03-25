import OpenAI from 'openai';
import { getPredictions, intentDetection } from '@/utils/api';
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
    throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

/**
 * Determine user intent and provide a response.
 * @param userInput The user's input message.
 */
export async function getAnswer(userInput: string) {
    try {
        // Step 1: Detect intent & extract relevant data
        const intentInfo = await intentDetection(userInput);
        console.log('Detected Intent:', intentInfo);

        if (intentInfo?.intent === 'stock_prediction' && intentInfo.ticker) {
            const { ticker, period, insightType } = intentInfo;

            console.log(`Detected Stock Query - Ticker: ${ticker}, Period: ${period}, Insight: ${insightType}`);

            const predictionResponse = await getPredictions(ticker, period, insightType);
            console.log('Stock Prediction Response:', predictionResponse);
            return { choices: [{ message: { content: predictionResponse } }] };
        }

        // Step 2: Normal chatbot response
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: userInput },
            ],
        });

        const botResponse = completion.choices?.[0]?.message?.content || 'I could not generate a response.';
        console.log('Normal Bot Response:', botResponse);
        return { choices: [{ message: { content: botResponse } }] };

    } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        return { choices: [{ message: { content: 'Oops! Something went wrong.' } }] };
    }
}