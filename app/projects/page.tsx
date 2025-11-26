'use client'

import Projects from '@/components/Projects'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <Projects />
      <Footer />
    </main>
  )
}
