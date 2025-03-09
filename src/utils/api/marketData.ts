export const fetchMarketData = async (ticker: string, periode: string = '1d') => {
    try {
        const response = await fetch(`http://localhost:8000/marketdata?ticker=${ticker}&periode=${periode}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
};