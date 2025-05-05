import { Layout, Button, Row, Col, Typography,Image } from 'antd';
import Link from 'next/link';

import {Hero,Features,Showcase,Faq,WhoItsFor} from '@/components/landing'

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Content className="scroll-smooth bg-white text-gray-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <Hero />
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <Features />
      </section>

      {/* Showcase or How It Works */}
      <section className="py-20 bg-white">
        <Showcase />
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-gray-50">
        <WhoItsFor />
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <Faq />
      </section>
    </Content>
  )
}

export default Home;