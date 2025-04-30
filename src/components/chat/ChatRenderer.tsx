// components/chat/ChatMessageRenderer.tsx
import { Message } from '@/types/chat'
import { DollarSign, Brain } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function ChatMessageRenderer({ message }: { message: Message }) {
  if (message.sender === 'user') {
    return <div className="text-right">{message.text}</div>
  }

  if (typeof message.text === 'string') {
    return <div className="text-left text-gray-800">{message.text}</div>
  }

  const { action, response } = message.text

  switch (action) {
    case 'get_live_price':
        return (
            <div className="text-left space-y-2">
            {response.tickers.map((ticker: any) => (
                <div key={ticker.symbol} className="rounded-xl p-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <DollarSign className="text-green-500 w-5 h-5" />
                    {ticker.symbol} — ${ticker.raw.price}
                </div>
                <p className="mt-2 text-sm text-gray-600">{ticker.summary}</p>
                </div>
            ))}
            </div>
        )
        case 'crew_buy_sell':
            return (
                <div className="space-y-4">
                    {response.map((item: any) => (
                    <div
                        key={item.ticker}
                        className="p-4  text-sm text-gray-800"
                    >
                        {/* Title */}
                        <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-8 h-8 text-red-500" />
                        <h3 className="text-lg font-semibold">
                            Recommendation for:
                            <div className="font-bold text-black">{item.ticker}</div>
                        </h3>
                        </div>
            
                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div><strong>Trend:</strong> {item.metrics.trend}</div>
                        <div><strong>Growth %:</strong> {item.metrics.growth_pct}%</div>
                        <div><strong>Support:</strong> {item.metrics.support}</div>
                        <div><strong>Resistance:</strong> {item.metrics.resistance}</div>
                        <div><strong>P/E Ratio:</strong> {item.metrics.PE_ratio.toFixed(2)}</div>
                        </div>
            
                        {/* Markdown-based recommendation */}
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => (
                                    <p className="prose prose-sm max-w-none" {...props} />
                                ),
                            }}
                        >
                        {item.recommendation}
                        </ReactMarkdown>
            
                        {/* Optional error handling */}
                        {item.error && (
                        <p className="mt-2 text-red-500 font-medium">⚠️ {item.error}</p>
                        )}
                    </div>
                    ))}
                </div>
                )
          
    // you can add other actions here like analyze_trend, full_analysis etc.
    default:
        return <div className="text-left">🤖 Unknown response type.</div>
    }
}
