import { Layout, Button, Row, Col, Typography } from 'antd';
import Link from 'next/link';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
    return (
        <Layout className="min-h-screen">
            {/* Navbar */}
            {/* Hero Section */}
            <Content className="flex flex-col justify-center items-center py-20">
                <div className="border-2 border-red-500 p-4">
                    <Row gutter={[32, 32]} align="middle" className="max-w-6xl">
                        {/* Left Side - Text */}
                        <Col xs={24} md={12} className="text-center md:text-left">
                            <Title className="text-white">New Developing Technology in Finance Field</Title>
                            <Paragraph className="text-white text-lg">
                                Chatbots and AI are revolutionizing the way humans interact with technology. They provide instant responses, streamline customer service, and enhance user experiences by offering personalized assistance. By automating routine tasks, AI allows humans to focus on more complex and creative endeavors, ultimately increasing productivity and efficiency.
                            </Paragraph>
                            <div className="mt-6 space-x-4">
                                <Button type="primary" size="large">Try Now</Button>
                                <Button type="default" size="large" className="border-white text-white">
                                    Learn More
                                </Button>
                            </div>
                        </Col>
                        {/* Right Side - Illustration Placeholder */}
                        <Col xs={24} md={12} className="flex justify-center">
                            <div className="w-96 h-64 border-2 border-black rounded-lg"></div>
                        </Col>
                    </Row>
                </div>
                {/* Features */}
                <div className="border-2 border-red-500 p-4 mt-64">
                    <Row gutter={[32, 32]} align="middle" className="flex flex-wrap justify-center">
                        <Col xs={24} md={6} className="text-center">
                            <img src="/path/to/icon1.png" alt="Feature 1" className="w-16 h-16 mx-auto mb-4" />
                            <Title level={4} className="text-white">Real Time Stock Market</Title>
                            <Paragraph className="text-white">
                                Short description about feature 1.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={6} className="text-center">
                            <img src="/path/to/icon2.png" alt="Feature 2" className="w-16 h-16 mx-auto mb-4" />
                            <Title level={4} className="text-white">Market Price Prediction</Title>
                            <Paragraph className="text-white">
                                Short description about feature 2.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={6} className="text-center">
                            <img src="/path/to/icon3.png" alt="Feature 3" className="w-16 h-16 mx-auto mb-4" />
                            <Title level={4} className="text-white">Ticker Sentiment Analyst</Title>
                            <Paragraph className="text-white">
                                Short description about feature 3.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={6} className="text-center">
                            <img src="/path/to/icon4.png" alt="Feature 4" className="w-16 h-16 mx-auto mb-4" />
                            <Title level={4} className="text-white">Risk Assessment</Title>
                            <Paragraph className="text-white">
                                Short description about feature 4.
                            </Paragraph>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
}

export default Home;