'use client'
import { Layout } from 'antd';
import Link from 'next/link';

const Headers = () => {
    return (
        <Layout.Header className="bg-transparent flex items-center py-4">
            <div className="text-xl text-white font-bold flex-shrink-0 px-6 m-5">Stockers12131</div>
            <div className="flex-grow flex justify-end">
                <div className="flex text-xl space-x-8">
                    <Link href="/" className='text-xl text-white font-bold'>Home</Link>
                    <Link href="/features" className='text-xl text-white font-bold'>Features</Link>
                    <Link href="/chatbots" className='text-xl text-white font-bold'>Chatbots</Link>
                    <Link href="/contacts" className='text-xl text-white font-bold'>Contacts</Link>
                </div>
            </div>
        </Layout.Header>
    );
};

export default Headers;