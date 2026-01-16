import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import StructuredData from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://core-innovation-ch.vercel.app'),
  title: {
    default: 'Buy IoT Products & Projects Online | Custom IoT Solutions | DD-SHOP',
    template: '%s | DD-SHOP - IoT Products & Custom Development'
  },
  description: 'Buy IoT products, ready-made projects, and custom development services. Smart home automation, Industry 4.0 solutions, ESP32/Arduino projects, web & mobile apps. Custom IoT hardware and software tailored to your needs.',
  keywords: ['buy iot products online', 'iot products for sale', 'iot project selling', 'smart home products', 'iot hardware', 'custom iot solutions', 'iot development services', 'esp32 projects', 'arduino products', 'smart automation', 'industry 4.0', 'iot software development', 'custom electronics', 'ready-made iot projects', 'iot shop', 'buy smart devices', 'iot products india', 'custom project development', 'web development', 'mobile app development'],
  authors: [{ name: 'Durai', url: 'https://core-innovation-ch.vercel.app' }],
  creator: 'Durai',
  publisher: 'Core Innovation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Buy IoT Products & Projects Online | Custom IoT Development',
    description: 'Shop IoT products, ready-made projects, and get custom development services. Smart home, Industry 4.0, ESP32/Arduino, web & mobile apps. Custom solutions for your needs.',
    url: 'https://core-innovation-ch.vercel.app',
    siteName: 'DD-SHOP - IoT Products & Custom Development',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Core Innovation - IoT and Smart Technology Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy IoT Products & Projects | Custom Development Services',
    description: 'Shop IoT products, ready-made projects, custom IoT & software development',
    creator: '@Durai4444',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-verification-code-here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="canonical" href="https://core-innovation-ch.vercel.app" />
      </head>
      <body className={inter.className}>
        <Analytics />
        <StructuredData />
        {children}
      </body>
    </html>
  )
}
