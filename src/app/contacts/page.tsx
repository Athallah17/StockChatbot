'use client'
import { useState } from 'react';
import { Layout, Input, Button } from 'antd';

const { Content } = Layout;

const MarketData = () => {
    const [ticker, setTicker] = useState('');
    const [data, setData] = useState(null);

    const fetchMarketData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/marketdata?ticker=${ticker}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };

    return (
        <Layout className="flex flex-col h-screen">
            <Content className="flex-grow flex flex-col justify-center items-center">
                <Input
                    placeholder="Enter ticker symbol"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    style={{ width: 200, marginBottom: 20 }}
                />
                <Button type="primary" onClick={fetchMarketData}>
                    Fetch Market Data
                </Button>
                <div className="mt-10">
                    {data ? (
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default MarketData;