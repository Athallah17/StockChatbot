// components/landing/WhoItsFor.tsx

import { Briefcase, GraduationCap, LineChart, Search } from "lucide-react"

const groups = [
  {
    icon: <LineChart className="w-6 h-6 text-indigo-600" />,
    title: "Retail Investors",
    desc: "Make informed decisions with AI-backed stock insights and real-time sentiment."
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
    title: "Finance Students",
    desc: "Learn market trends and trading signals using real-world stock data."
  },
  {
    icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
    title: "Busy Professionals",
    desc: "Save time by letting our AI summarize financial news and recommend actions."
  },
  {
    icon: <Search className="w-6 h-6 text-indigo-600" />,
    title: "Curious Beginners",
    desc: "Explore stocks with plain-language explanations and guided chat experience."
  },
]

const WhoItsFor = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
        Who Is This For?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {groups.map((g, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-md border text-center">
            <div className="mb-4 flex justify-center">{g.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{g.title}</h3>
            <p className="text-sm text-gray-600">{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhoItsFor;
