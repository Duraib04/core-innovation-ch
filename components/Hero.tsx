'use client'

import VideoBackground from './VideoBackground'

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <VideoBackground opacity={0.3} />

      <div className="relative z-20 w-full px-4 md:px-6 text-center">
        <div className="mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white leading-tight">
            Buy IoT Products & Projects
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Software Solutions & Custom Development</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8">
            Your one-stop shop for <strong>IoT products</strong>, <strong>ready-made projects</strong>, <strong>software development</strong>, and <strong>custom IoT solutions</strong> tailored to your needs.
          </p>
          
          <p className="text-base md:text-lg text-gray-400 mb-8 md:mb-12">
            ✅ Smart Home Automation • Industry 4.0 Solutions • Custom IoT Hardware & Software • Web & Mobile Apps
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center flex-wrap">
            <button
              onClick={() => window.location.href = '/projects'}
              className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-full text-sm md:text-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Explore Projects
            </button>

            <button
              onClick={() => window.location.href = '/products'}
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-blue-600 text-blue-600 rounded-full text-sm md:text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
            >
              View Products
            </button>

            <a
              href="/custom-project"
              className="block px-6 md:px-8 py-3 md:py-4 bg-blue-500 text-white rounded-full text-sm md:text-lg font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              🎯 Request Custom Project
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
