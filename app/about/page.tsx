import type { Metadata } from 'next'

import About from '@/components/About'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About DD IOT SOLUTIONS | MSME Registered IoT Company',
  description: 'DD IOT SOLUTIONS is an officially registered MSME/Udyam business (UDYAM-TN-04-0124631) providing IoT products, ready-made projects, and custom development services.',
  alternates: {
    canonical: 'https://dd-iot-solutions.web.app/about-us'
  },
  openGraph: {
    title: 'About DD IOT SOLUTIONS | Government MSME Registered',
    description: 'Official MSME/Udyam Registered business: DD IOT SOLUTIONS (UDYAM-TN-04-0124631).',
    url: 'https://dd-iot-solutions.web.app/about -us',
    type: 'website'
  }
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <About />
      <Footer />
    </main>
  )
}
