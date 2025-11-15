'use client'

import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Products from '@/components/Products'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AnimatedCursor from '@/components/AnimatedCursor'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <AnimatedCursor />
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
