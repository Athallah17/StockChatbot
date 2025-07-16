'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef} from 'react'
import {
TrendingUp,
TrendingDown,
LineChart,
DollarSign,
RefreshCw,
BarChart3,
BrainCog,
ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
Carousel,
CarouselContent,
CarouselItem,
} from '@/components/ui/carousel'

interface ChatStarterProps {
onPromptClick: (text: string) => void
}

const categories = [
    {
        icon: <TrendingUp className="w-5 h-5 text-green-600" />,
        title: 'Top Gainers / Losers',
        questions: [
        'Show me the top stock gainers today',
        'Show me the biggest losers this week',
        ],
    },
    {
        icon: <LineChart className="w-5 h-5 text-blue-600" />,
        title: 'Stock Analysis',
        questions: [
        'Analyze AAPL for the last 3 months',
        'Give me analysis on TSLA trend this year',
        ],
    },
    {
        icon: <DollarSign className="w-5 h-5 text-yellow-500" />,
        title: 'Buy or Hold',
        questions: [
        'Should I buy NVDA this week?',
        'Is AMZN a good long-term hold?',
        ],
    },
    {
        icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
        title: 'Compare Stocks',
        questions: [
        'Compare TSLA and MSFT performance',
        'Which is better: GOOGL or META?',
        ],
    },
    {
        icon: <RefreshCw className="w-5 h-5 text-pink-500" />,
        title: 'Price Prediction',
        questions: [
        'Predict AAPL stock for the next 7 days',
        'Give me price prediction for NVDA next month',
        ],
    },
    {
        icon: <BrainCog className="w-5 h-5 text-teal-600" />,
        title: 'Sentiment Analysis',
        questions: [
        'What is the sentiment on TSLA today?',
        'Analyze news sentiment for META stock',
        ],
    },
]

const flatCards = categories.flatMap((cat) =>
    cat.questions.map((q) => ({
        icon: cat.icon,
        title: cat.title,
        question: q,
    }))
)

const ChatStarter = ({ onPromptClick }: ChatStarterProps) => {
    const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))
    const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current])
    const flatCards = categories.flatMap((cat) =>
    cat.questions.map((q) => ({
        icon: cat.icon,
        title: cat.title,
        question: q,
    }))
)

return (
<div className="flex items-center justify-center h-full w-full px-4 py-36">
    <div className="max-w-6xl w-full text-center space-y-16">
        {/* Header */}
        <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800">How can I help you today?</h1>
            <p className="text-base font-medium text-gray-500 mt-2">
                Choose a question below or type your own to get started.
            </p>
        </div>

        {/* Carousel */}
        <div className='space-y-6'>
            <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-8 px-4">
                {flatCards.map((item, idx) => (
                <div
                    key={idx}
                    className="min-w-[85%] sm:min-w-[45%] md:min-w-[30%] animate-fade-in"
                >
                    <Card
                    className="bg-white border hover:bg-gradient-to-br from-teal-300 to-teal-700 transition cursor-pointer h-full text-left group"
                    onClick={() => onPromptClick(item.question)}
                    >
                        <CardContent className="p-5 flex flex-col gap-3 h-full justify-between">
                        <div className="flex items-center gap-2">
                            {React.cloneElement(item.icon, {
                            className: `${item.icon.props.className} group-hover:text-white`,
                            })}
                            <span className="text-md font-bold text-gray-800 group-hover:text-white">
                            {item.title}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-white">{item.question}</p>
                        <div className="flex justify-end mt-2">
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </div>
                        </CardContent>
                    </Card>
                </div>
                ))}
            </div>
            </div>

            <p className="text-md font-medium text-gray-400 ">
            Or type your own question below to begin chatting.
            </p>
        </div>
    </div>
</div>
)
}

export default ChatStarter
