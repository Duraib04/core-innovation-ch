import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import StructuredData from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://dd-products.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '32x32' },
      { url: '/favicon.svg', sizes: '16x16' },
    ],
    apple: { url: '/apple-icon.svg', type: 'image/svg+xml' },
  },
  title: {
    default: 'Buy IoT Products & Projects Online | Custom IoT Solutions | DD-SHOP',
    template: '%s | DD-SHOP - IoT Products & Custom Development'
  },
  description: 'Buy IoT products, ready-made projects, and custom development services. Smart home automation, Industry 4.0 solutions, ESP32/Arduino projects, web & mobile apps. Custom IoT hardware and software tailored to your needs.',
  keywords: [
    'safehome gas monitor with display', 
    'esp32 wifi lift access control system', 
    'multi gas detection lpg natural gas co sensor',
    'automated plant watering soil moisture kit',
    'rfid door lock access log system',
    'industrial iot ecosystem multi vendor platform',
    'esp32 smart night lamp voice control',
    'gas leak automatic shutoff valve system',
    'real time chat website source code',
    'lift guard password portal access',
    'ai driven ventilation gas detection',
    'centralized industrial equipment monitoring',
    'weather forecast smart irrigation system',
    'door lock rfid dashboard remote control',
    'custom esp32 arduino project development',
    'buy ready to deploy iot solutions',
    'turnkey smart home automation kits',
    'plug and play industrial iot devices',
    'DD products custom electronics india',
    'core innovation iot development services'
  ],
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
    url: 'https://dd-products.vercel.app',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="google-site-verification" content="google27a92eae85922e3d" />
        <link rel="canonical" href="https://dd-products.vercel.app" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
      </head>
      <body className={`${inter.className} mono-theme`} suppressHydrationWarning>
        <Analytics />
        <StructuredData />
        {children}
      </body>
    </html>
  )
}
