'use client'

import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Products from '@/components/Products'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Products />
      <Contact />
      <Footer />
    </main>
  )
}
