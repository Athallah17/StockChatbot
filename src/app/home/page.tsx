import { Layout, Button, Row, Col, Typography,Image } from 'antd';
import Link from 'next/link';

import {Hero,Features,Showcase,Faq} from '@/components/index';
const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
    return (
      <Content className="scroll-smooth">
        <section className="min-h-screen">
          <Hero />
        </section>
  
        <section className="py-20">
          <Features />
        </section>

        <section className="py-20">
          <Showcase />
        </section>
  
        <section className="py-20">
          <Faq />
        </section>
      </Content>
    )
  }

export default Home;