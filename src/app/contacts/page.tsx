'use client'
import { useEffect, useState } from 'react';
import { Layout } from "antd";

const { Content } = Layout;

const Contacts = () => {
    interface DataType {
        message: string;
    }

    const [data, setData] = useState<DataType | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/example')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <Layout className="flex flex-col h-screen">
            <Content className="flex-grow flex justify-center items-center">
                <div className="text-3xl text-black font-bold">
                    {data ? data.message : "Loading..."}
                </div>
            </Content>
        </Layout>
    )
}

export default Contacts;