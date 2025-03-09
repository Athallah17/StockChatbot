export const fetchMarketData = async (ticker: string, periode: string = '1d', fullData: boolean = false) => {
    try {
        const response = await fetch(`http://localhost:8000/marketdata?ticker=${ticker}&periode=${periode}&full_data=${fullData}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Market data fetched:', result);
        return result;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
};