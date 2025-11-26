'use client'

import About from '@/components/About'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <About />
      <Footer />
    </main>
  )
}
