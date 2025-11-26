'use client'

import VideoBackground from './VideoBackground'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <VideoBackground opacity={0.3} />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
            Innovation
            <br />
            Meets Excellence
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Discover cutting-edge projects and premium products crafted with passion and precision
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
