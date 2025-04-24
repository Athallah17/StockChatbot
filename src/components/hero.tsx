'use client'

import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <section className="w-full bg-white py-35 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Left Side - Text */}
        <div className="max-w-xl text-black">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Build smarter investment strategies <br /> with the power of AI
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Discover trends, track market insights, and make data-backed decisions using our AI-powered stock advisor.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => window.location.href = '/chatbots'}>Get Started</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Right Side - Placeholder Image/Icon */}
        <div className="w-full md:w-[500px] h-[380px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 text-xl">
            [ Illustration Placeholder ]
        </div>

      </div>
    </section>
  )
}

export default Hero
