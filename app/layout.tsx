import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://core-innovation-ch.vercel.app'),
  title: {
    default: 'Durai - Innovation & Excellence | Core Innovation',
    template: '%s | Core Innovation'
  },
  description: 'Discover cutting-edge IoT projects and premium smart products by Durai. Software development, hardware solutions, and innovative technology. Smart Home, Industry 4.0, and custom IoT solutions.',
  keywords: ['IoT', 'Smart Products', 'Innovation', 'Technology', 'Durai', 'Core Innovation', 'Hardware', 'Software', 'Smart Home', 'Industry 4.0', 'IoT Solutions', 'ESP32', 'Arduino', 'RFID', 'Automation', 'AI', 'Machine Learning', 'Web Development', 'Mobile Apps'],
  authors: [{ name: 'Durai', url: 'https://core-innovation-ch.vercel.app' }],
  creator: 'Durai',
  publisher: 'Core Innovation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Durai - Innovation & Excellence | Core Innovation',
    description: 'Cutting-edge IoT projects and premium smart products. Industry 4.0, Smart Home automation, and custom technology solutions.',
    url: 'https://core-innovation-ch.vercel.app',
    siteName: 'Core Innovation',
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
    title: 'Durai - Innovation & Excellence | Core Innovation',
    description: 'Cutting-edge IoT projects and premium smart products',
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
        {children}
      </body>
    </html>
  )
}
