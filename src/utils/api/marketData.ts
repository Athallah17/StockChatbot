export const fetchMarketData = async (ticker: string, periode: string = '1d', full_data: boolean = false) => {
    try {
        const response = await fetch('http://localhost:8000/marketdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticker, periode, full_data }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Market data:', result);
        return result;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
};