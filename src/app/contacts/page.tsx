'use client'
import { useState } from 'react';
import { Layout, Input, Button, Select, Table } from 'antd';
import { fetchMarketData } from '@/utils/api';

const { Content } = Layout;
const { Option } = Select;

const MarketData = () => {
    const [ticker, setTicker] = useState('');
    const [periode, setPeriod] = useState('1d');
    const [data, setData] = useState(null);

    const handleFetchMarketData = async () => {
        try {
            const result = await fetchMarketData(ticker, periode);
            setData(result);
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'Date',
            key: 'date',
        },
        {
            title: 'Open',
            dataIndex: 'Open',
            key: 'open',
        },
        {
            title: 'High',
            dataIndex: 'High',
            key: 'high',
        },
        {
            title: 'Low',
            dataIndex: 'Low',
            key: 'low',
        },
        {
            title: 'Close',
            dataIndex: 'Close',
            key: 'close',
        },
        {
            title: 'Volume',
            dataIndex: 'Volume',
            key: 'volume',
        },
    ];

    return (
        <Layout className="flex flex-col h-screen">
            <Content className="flex-grow flex flex-col justify-center items-center">
                <Input
                    placeholder="Enter ticker symbol"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    style={{ width: 200, marginBottom: 20 }}
                />
                <Select
                    value={periode}
                    onChange={(value) => setPeriod(value)}
                    style={{ width: 200, marginBottom: 20 }}
                >
                    <Option value="1d">1 Day</Option>
                    <Option value="5d">5 Days</Option>
                    <Option value="1mo">1 Month</Option>
                    <Option value="3mo">3 Months</Option>
                    <Option value="6mo">6 Months</Option>
                    <Option value="1y">1 Year</Option>
                    <Option value="2y">2 Years</Option>
                    <Option value="5y">5 Years</Option>
                    <Option value="10y">10 Years</Option>
                    <Option value="ytd">Year to Date</Option>
                    <Option value="max">Max</Option>
                </Select>
                <Button type="primary" onClick={handleFetchMarketData}>
                    Fetch Market Data
                </Button>
                <div className="mt-10" style={{ width: '80%' }}>
                    {data ? (
                        <Table
                            columns={columns}
                            dataSource={data.map((item, index) => ({ ...item, key: index }))}
                            pagination={false}
                            scroll={{ y: 240 }}
                        />
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default MarketData;