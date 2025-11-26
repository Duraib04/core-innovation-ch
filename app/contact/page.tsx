'use client'

import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <Contact />
      <Footer />
    </main>
  )
}
