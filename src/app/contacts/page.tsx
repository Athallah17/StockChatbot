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

    const handleFetchMarketData = async (fullData = false) => {
        try {
            const result = await fetchMarketData(ticker, periode, fullData);
            setData(result);
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };

    const handleFetchFundamentalData = async () => {
        try {
            const result = await fetchMarketData(ticker, '1d', false);
            setData(result);
        } catch (error) {
            console.error('Error fetching fundamental data:', error);
        }
    };

    const historicalColumns = [
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

    const fundamentalColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const fundamentalData = data
        ? Object.entries(data).map(([key, value]) => ({
              key,
              title: key,
              value: value !== null ? value.toString() : 'N/A',
          }))
        : [];

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
                <div className="space-y-2">
                    <Button type="primary" onClick={() => handleFetchMarketData(true)} style={{ marginLeft: 10 }}>
                        Fetch Period Historical Data
                    </Button>
                    <Button type="primary" onClick={handleFetchFundamentalData} style={{ marginLeft: 10 }}>
                        Fetch Fundamental Data
                    </Button>
                </div>
                <div className="mt-10" style={{ width: '80%' }}>
                    {data ? (
                        <>
                            <Table
                                columns={fundamentalColumns}
                                dataSource={fundamentalData}
                                pagination={false}
                                scroll={{ y: 240 }}
                            />
                            {data.historical_data && (
                                <Table
                                    columns={historicalColumns}
                                    dataSource={data.historical_data.map((item, index) => ({ ...item, key: index }))}
                                    pagination={false}
                                    scroll={{ y: 240 }}
                                    style={{ marginTop: 20 }}
                                />
                            )}
                        </>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default MarketData;