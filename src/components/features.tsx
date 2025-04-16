'use client'

const Features = () => {
  const features = [
    {
      title: 'Real-Time Data',
      desc: 'Access up-to-the-minute stock info.',
    },
    {
      title: 'AI Recommendations',
      desc: 'Smart insights tailored for investors.',
    },
    {
      title: 'Market Trends',
      desc: 'Visualize short- and long-term movement.',
    },
    {
      title: 'Personalized Watchlists',
      desc: 'Track your favorite stocks easily.',
    },
  ]

  return (
    <section className="bg-white text-black py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-lg font-bold mb-4">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-700">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
