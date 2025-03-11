import OpenAI from 'openai';
import { getPredictions } from '@/utils/api';
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
        // Check if the input is related to stock (100% need same text)
        const stockQueryMatch = userInput.match(/stock (.+)/i);
        if (stockQueryMatch) {
            const ticker = stockQueryMatch[1].trim();
            const predictionResponse = await getPredictions(ticker);
            return { choices: [{ message: { content: predictionResponse } }] };
        }

        // Handle normal chat messages
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: userInput },
            ],
        });

        const botResponse = completion.choices?.[0]?.message?.content || 'I could not generate a response.';
        return { choices: [{ message: { content: botResponse } }] };
    } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        return { choices: [{ message: { content: 'Oops! Something went wrong.' } }] };
    }
}