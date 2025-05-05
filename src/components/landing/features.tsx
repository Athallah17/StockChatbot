
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Bot, Newspaper, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Real-Time Stock Insights",
    description: "Stay up to date with the latest prices, trends, and movements.",
    icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "AI-Powered Recommendations",
    description: "Get intelligent buy/sell signals backed by analysis.",
    icon: <Bot className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Live Market Sentiment",
    description: "Understand the mood of the market through news analysis.",
    icon: <Newspaper className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Summarized Reports",
    description: "Let the bot condense financial data into plain English.",
    icon: <Lightbulb className="w-6 h-6 text-indigo-600" />,
  },
]

const Features = () => {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Features</h2>
        <p className="text-gray-600 mt-2">Your financial co-pilot has you covered.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.2 }}
          >
            <Card className="p-6">
              <CardContent className="space-y-4">
                {feat.icon}
                <h3 className="text-lg font-semibold text-gray-800">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Features
