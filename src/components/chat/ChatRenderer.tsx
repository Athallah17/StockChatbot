// components/chat/ChatMessageRenderer.tsx
import { Message } from '@/types/chat'
import { DollarSign, Brain, LineChart, BarChart3, Briefcase, PieChart, StickyNote, Gauge, Newspaper,TrendingUp,Tag,
  TrendingDown, Info,
  Package}
from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import HistoricalChart from './Chart'
import { getSentimentBadge, ConfidenceBar } from './UtilityHelper'



export function ChatMessageRenderer({ message }: { message: Message }) {
  if (message.sender === 'user') {
    return <div className="text-right text-white">{message.text}</div>
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
    case 'get_historical_data':
        return(
            <div className="text-left space-y-2">
                {response.tickers.map((ticker: any) => (
                        <div
                        key={ticker.symbol}
                        className="p-4 text-sm text-gray-800"
                        >
                        <div className="flex items-center gap-2 font-bold text-blue-600 mb-2">
                            <LineChart className="w-8 h-8" />
                                {ticker.symbol} Historical Data 
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{ticker.summary}</p>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs border border-gray-200">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                <th className="px-3 py-2 text-left border">Date</th>
                                <th className="px-3 py-2 text-right border">Open</th>
                                <th className="px-3 py-2 text-right border">High</th>
                                <th className="px-3 py-2 text-right border">Low</th>
                                <th className="px-3 py-2 text-right border">Close</th>
                                <th className="px-3 py-2 text-right border">Volume</th>
                                <th className="px-3 py-2 text-right border">Dividends</th>
                                <th className="px-3 py-2 text-right border">Splits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticker.raw.historical_data.map((row: any, idx: number) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{new Date(row.Date).toLocaleDateString()}</td>
                                    <td className="px-3 py-2 text-right">${row.Open.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right">${row.High.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right">${row.Low.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right">${row.Close.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right">{row.Volume.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right">{row.Dividends}</td>
                                    <td className="px-3 py-2 text-right">{row['Stock Splits']}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    ))}
            </div>
        )
        case 'get_financials':
                return (
                <div className="space-y-4">
                    {response.tickers.map((ticker: any) => (
                    <div
                        key={ticker.symbol}
                        className="p-4 bg-white text-sm text-gray-800"
                    >
                        {/* Title */}
                        <div className="flex items-center gap-2 font-bold text-amber-600 mb-2">
                        <BarChart3 className="w-8 h-8" />
                        {ticker.symbol} Financials
                        </div>
            
                        {/* Summary */}
                        <p className="text-gray-600 mb-2">{ticker.summary}</p>
            
                        {/* Metrics */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <strong>P/E Ratio:</strong> {ticker.raw.PE_ratio.toFixed(2)}
                        </div>
                        <div>
                            <strong>EPS:</strong> {ticker.raw.EPS}
                        </div>
                        <div>
                            <strong>Market Cap:</strong> ${Number(ticker.raw.market_cap).toLocaleString()}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )
            case 'get_sector_data':
                return (
                    <div className="space-y-4">
                        {response.tickers.map((ticker: any) => (
                        <div
                            key={ticker.symbol}
                            className="p-4 text-sm text-gray-800"
                        >
                            {/* Title */}
                            <div className="flex items-center gap-2 font-bold text-cyan-700 mb-2">
                            <Briefcase className="w-8 h-8" />
                            {ticker.symbol} Sector Info
                            </div>
                
                            {/* Summary */}
                            <p className="text-gray-600 mb-2">{ticker.summary}</p>
                
                            {/* Sector Details */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <strong>Sector:</strong> {ticker.raw.sector}
                            </div>
                            <div>
                                <strong>Industry:</strong> {ticker.raw.industry}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    )
            case 'analyze_trend':
                return (
                    <div className="space-y-4">
                        {response.tickers.map((ticker: any) => (
                            <div
                                key={ticker.symbol}
                                className="p-4 text-sm text-gray-800"
                            >
                            <div className="flex items-center gap-2 font-bold text-blue-600 mb-1">
                                <LineChart className="w-8 h-8" />
                                    {ticker.symbol} Trend Analysis
                            </div>
                      
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                    <div><strong>Trend:</strong> {ticker.raw.trend}</div>
                                    <div><strong>Growth %:</strong> {ticker.raw.growth_pct}%</div>
                                    <div><strong>Start Price:</strong> ${ticker.raw.start.toFixed(2)}</div>
                                    <div><strong>End Price:</strong> ${ticker.raw.end.toFixed(2)}</div>
                                </div>
                      
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>
                                        {ticker.summary}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            ))}
                        </div>
                        )
            case 'analyze_full':
                 return (
                    <div className="space-y-4">
                        {response.tickers.map((ticker: any) => (
                            <div
                                key={ticker.symbol}
                                className="p-4 text-sm text-gray-800 space-y-4"
                            >
                            {/* Header */}
                            <div className="flex items-center gap-2 font-bold text-pink-600">
                                <PieChart className="w-8 h-8" />
                                    {ticker.symbol} Full Analysis
                            </div>
                          
                            {/* Detailed Price Info */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">📊 Price Metrics</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div><strong>Start:</strong> ${ticker.detailed.raw.start_price.toFixed(2)}</div>
                                    <div><strong>End:</strong> ${ticker.detailed.raw.end_price.toFixed(2)}</div>
                                    <div><strong>Change %:</strong> {ticker.detailed.raw.price_change_percent}%</div>
                                    <div><strong>Average:</strong> ${ticker.detailed.raw.average_price.toFixed(2)}</div>
                                    <div><strong>Volatility:</strong> {ticker.detailed.raw.volatility_percent}%</div>
                                </div>
                                    <div className="prose prose-sm mt-2 max-w-none">
                                        <ReactMarkdown>
                                        {ticker.detailed.summary}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                    {/* Support & Resistance */}
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-1">📈 Support & Resistance</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                        <div><strong>Support:</strong> ${ticker.support_resistance.raw.support}</div>
                                        <div><strong>Resistance:</strong> ${ticker.support_resistance.raw.resistance}</div>
                                    </div>
                                        <div className="prose prose-sm mt-2 max-w-none">
                                            <ReactMarkdown>
                                            {ticker.support_resistance.summary}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            )
            case 'get_sentiment':
                    return (
                        <div className="p-4  text-sm text-gray-800 space-y-4">
                            {/* Summary Header */}
                                <div className="flex items-center gap-2 font-bold text-red-500 text-lg">
                                    <Gauge className="w-8 h-8" />
                                    Market Sentiment Summary
                                </div>
                    
                                <p>
                                    <strong>Overall Sentiment:</strong> {response.general_sentiment} |{' '}
                                    <strong>Avg. Confidence:</strong> {response.average_confidence.toFixed(1)}/10
                                </p>
                              
                                {/* Summary markdown */}
                                <div className="prose prose-sm max-w-none mb-4">
                                    <ReactMarkdown>
                                        {response.summary}
                                    </ReactMarkdown>
                                </div>
                              
                                {/* Articles */}
                                <div className="space-y-4">
                                    {response.articles.map((article: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1"
                                        >
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-black text-lg font-bold hover:underline flex gap-2 items-center"
                                            >
                                                <Newspaper className="w-8 h-8" />
                                                {article.title}
                                            </a>

                                        <div className="flex items-center justify-between text-md  text-black">
                                        <div className="flex items-center gap-2">
                                            <strong>Sentiment:</strong> {getSentimentBadge(article.sentiment)}
                                        </div>
                                        <div className="w-32">
                                            <p className="text-xs text-gray-500">Confidence: {article.confidence}/10</p>
                                            <ConfidenceBar value={article.confidence} />
                                        </div>
                                        </div>
                              
                                        {/* Key Insights */}
                                        <ul className="list-disc list-inside mt-2 text-md  text-black">
                                            {article.key_insights
                                                .split('\n')
                                                .filter((line: string) => line.trim().startsWith('-'))
                                                .map((line: string, i: number) => (
                                                    <li key={i}>{line.replace('- ', '').trim()}</li>
                                            ))}
                                        </ul>
                                        </div>
                                    ))}
                                </div>
                                </div>
                            )
        case 'crew_stock_summary':
            return(
                    <div className="space-y-4">
                    <div className="p-4 text-sm text-gray-800">
                    {/* Summary section */}
                    <div className="flex items-center gap-2 font-bold text-black mb-2">
                        <StickyNote className="w-8 h-8" />
                        AI Analyst Summary: {response.market_data?.symbol}
                    </div>
            
                    <div className="prose prose-sm max-w-none mb-4">
                        <ReactMarkdown>
                            {response.summary}
                        </ReactMarkdown>
                    </div>
            
                    {/* Chart */}
                    {response.market_data?.historical_data && (
                    <HistoricalChart
                        data={response.market_data.historical_data.map((d: any) => ({
                        date: d.date,
                        close: d.close,
                        }))}
                    />
                    )}
                </div>
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
                                    <p className="prose prose-sm max-w-none font-medium text-md" {...props} />
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
                case 'get_predict_price': {
                    const prediction = response[0]
                    const priceDiff = prediction.predicted_price - prediction.indicators.Close
                    const percentChange = ((priceDiff / prediction.indicators.Close) * 100).toFixed(2)
                    const isPositive = priceDiff >= 0
                    const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
                  
                    const sentiment = prediction.sentiment.general_sentiment
                    const confidence = prediction.sentiment.average_confidence
                  
                    const sentimentBadge = {
                      Bullish: 'bg-green-100 text-green-800',
                      Bearish: 'bg-red-100 text-red-800',
                      Neutral: 'bg-gray-100 text-gray-700',
                    }[sentiment] || 'bg-gray-100 text-gray-600'
                  
                    const sentimentPulse = {
                      Bullish: 'bg-green-500',
                      Bearish: 'bg-red-500',
                      Neutral: 'bg-gray-400',
                    }[sentiment] || 'bg-gray-400'
                  
                    return (
                      <div className="p-4 space-y-4 text-sm text-gray-800">
                        {/* Header */}
                        <div className="flex items-center gap-2 font-bold text-lg text-indigo-700">
                          <LineChart className="w-8 h-8" />
                          Price Prediction for {prediction.ticker} ({prediction.n_days}-Day Horizon)
                        </div>
                  
                        {/* Price Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 border rounded-xl p-4 space-y-1">
                            <p><strong>Current Price:</strong> ${prediction.indicators.Close.toFixed(2)}</p>
                            <p><strong>Predicted Price:</strong> ${prediction.predicted_price.toFixed(2)}</p>
                            <p>
                              <strong>Expected Change:</strong>{' '}
                              <span className={`${changeColor} font-semibold`}>
                                {isPositive ? '+' : '-'}${Math.abs(priceDiff).toFixed(2)} ({Math.abs(percentChange)}%)
                              </span>
                            </p>
                          </div>
                  
                          {/* Sentiment + Confidence Visualization */}
                          <div className="bg-white border rounded-xl p-4 shadow-sm">
                            <p className="font-semibold mb-2">Market Sentiment</p>
                            <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`absolute left-0 top-0 h-full transition-all duration-700 ${sentimentPulse} animate-pulse`}
                                style={{ width: `${confidence * 10}%`, opacity: 0.8 }}
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${sentimentBadge}`}>
                                {sentiment}
                              </span>
                              <span className="text-gray-500">{confidence}/10 confidence</span>
                            </div>
                          </div>
                        </div>
                  
                        {/* Reasoning Summary */}
                        <div className="pt-2 border-t mt-4">
                          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-lg">
                            <TrendingUp className="w-8 h-8" />
                            AI-Generated Reasoning
                          </div>
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-md font-medium">
                                    <ReactMarkdown>
                                        {prediction.reasoning}
                                    </ReactMarkdown>
                            </div>
                        </div>
                      </div>
                    )
                  }
        case 'general_information':
            return (
                    <div className="w-full flex justify-start">
                        <div className="max-w-2xl px-4 py-3 text-gray-800 text-md  prose prose-sm">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {response?.response || 'No information available.'}
                        </Markdown>
                        </div>
                    </div>
                    )
        case 'get_top_tickers': {
        const topCategory = response.category.toUpperCase() || 'TICKERS'
        const data = response.response
        const stocks = data?.stocks || []
        const summary = data?.summary || ''

            return (
                <div className="space-y-4 p-4 ">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    📋 Top {topCategory.replace('_', ' ')}
                </h3>

                {/* Stock Pills */}
                <div className="flex flex-col gap-4">
                    {stocks.map((ticker: any) => {
                    const isUp = ticker.changePercent >= 0
                    const ChangeIcon = isUp ? TrendingUp : TrendingDown

                    return (
                        <div
                        key={ticker.symbol}
                        className="flex items-center justify-between bg-gray-100 px-6 py-4 shadow-sm hover:shadow-md transition w-full"
                        >
                        {/* Left Info */}
                        <div className="flex items-start gap-3 w-1/3">
                            <Tag className="w-5 h-5 mt-1 text-gray-500" />
                            <div>
                            <span className="text-xl font-bold text-gray-900">{ticker.symbol}</span>
                            <div className="text-sm text-gray-600">{ticker.shortName}</div>
                            <div className="text-xs text-gray-400">{ticker.sector}</div>
                            </div>
                        </div>

                        {/* Center Info */}
                        <div className="flex items-center gap-2 w-1/3 justify-center">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <p className="text-lg font-semibold text-gray-800">${ticker.price.toFixed(2)}</p>
                            <ChangeIcon
                            className={`w-4 h-4 ${isUp ? 'text-green-600' : 'text-red-600'}`}
                            />
                            <p className={`text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                            {isUp ? '+' : ''}
                            {ticker.changePercent.toFixed(2)}%
                            </p>
                        </div>

                        {/* Right Info */}
                        <div className="flex items-center gap-2 w-1/3 justify-end">
                            <Package className="w-4 h-4 text-gray-500" />
                            <p className="text-md font-semibold text-gray-700">
                            {ticker.volume.toLocaleString()}
                            </p>
                        </div>
                        </div>
                    )
                    })}
                </div>

                {/* Summary */}
                {summary && (
                    <div className="p-4 bg-neutral-50 rounded-lg border border-dashed text-lg mt-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold">
                        <Info className="w-4 h-4" />
                        Summary
                    </div>
                    <div className="prose prose-sm text-gray-700 text-sm">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {summary}
                        </Markdown>
                    </div>
                    </div>
                )}
                </div>
            )
        }
    // you can add other actions here like analyze_trend, full_analysis etc.
    default:
        return <div className="text-left">Something went wrong. Please try again soon or try different questions.</div>
    }
}