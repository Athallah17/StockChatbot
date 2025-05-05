
export const getSentimentBadge = (sentiment: string) => {
  const base = "px-2 py-1 text-xs font-medium rounded-full"
  switch (sentiment.toLowerCase()) {
    case 'bullish':
      return <span className={`${base} bg-green-100 text-green-700`}>Bullish</span>
    case 'bearish':
      return <span className={`${base} bg-red-100 text-red-700`}>Bearish</span>
    default:
      return <span className={`${base} bg-gray-100 text-gray-700`}>Neutral</span>
  }
}

export const ConfidenceBar = ({ value }: { value: number }) => (
  <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
    <div
      className="h-full bg-indigo-500"
      style={{ width: `${(value / 10) * 100}%` }}
    ></div>
  </div>
)
