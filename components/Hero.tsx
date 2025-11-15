'use client'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black text-white">
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
              onClick={() => {
                const element = document.getElementById('projects')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Explore Projects
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('products')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              View Products
            </button>

            <a
              href="/custom-project"
              className="block px-8 py-4 bg-gray-800 text-white border border-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              🎯 Request Custom Project
            </a>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-4xl text-white">
            ↓
          </div>
        </div>
      </div>
    </section>
  )
}
