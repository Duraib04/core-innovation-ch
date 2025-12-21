'use client'

import { Suspense } from 'react'
import Products from '@/components/Products'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <Suspense fallback={null}>
        <Products />
      </Suspense>
      <Footer />
    </main>
  )
}
