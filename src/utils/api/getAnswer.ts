import OpenAI from 'openai';
import { getPredictions, intentDetection } from '@/utils/api';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

/**
 * Determine user intent using OpenAI with a more detailed prompt.
 * @param userInput The user's input message.
 */
export async function getAnswer(userInput: string) {
    try {
        // Step 1: Extract structured details
        const { intent, ticker, period, specific_data } = await intentDetection(userInput);
        console.log('Detected Intent:', intent, 'Ticker:', ticker, 'Period:', period, 'Data:', specific_data);

        // Step 2: If it's a stock prediction, call getPredictions
        if (intent === 'stock_prediction' && ticker) {
            console.log('Fetching stock prediction for:', ticker, period, specific_data);
            const predictionResponse = await getPredictions(ticker); // currently only take ticker TBA (periode,specific data)
            return { choices: [{ message: { content: predictionResponse } }] };
        }

        // Step 3: Normal chatbot response
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

