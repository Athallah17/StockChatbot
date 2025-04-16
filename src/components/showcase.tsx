'use client'

const Showcase = () => {
  return (
    <section className="bg-white text-black py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Image Placeholder */}
        <div className="w-full md:w-[500px] h-[300px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 text-xl">
          [ Chart / App Image ]
        </div>

        {/* Text */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Data that speaks clearly</h2>
          <p className="text-gray-700 mb-6">
            Our visual interface helps you understand the market like never before. Track everything from daily highs to long-term performance.
          </p>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Trend lines & historical graphs</li>
            <li>Sentiment indicators</li>
            <li>Custom chart overlays</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Showcase
