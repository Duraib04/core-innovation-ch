'use client'

import VideoBackground from './VideoBackground'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <VideoBackground opacity={0.3} />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Buy IoT Products & Projects
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Software Solutions & Custom Development</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Your one-stop shop for <strong>IoT products</strong>, <strong>ready-made projects</strong>, <strong>software development</strong>, and <strong>custom IoT solutions</strong> tailored to your needs.
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            ✅ Smart Home Automation • Industry 4.0 Solutions • Custom IoT Hardware & Software • Web & Mobile Apps
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.location.href = '/projects'}
              className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Projects
            </button>

            <button
              onClick={() => window.location.href = '/products'}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              View Products
            </button>

            <a
              href="/custom-project"
              className="block px-8 py-4 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              🎯 Request Custom Project
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
