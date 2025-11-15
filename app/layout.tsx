import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LoadingScreen from '@/components/LoadingScreen'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Durai - Innovation & Excellence | Core Innovation',
  description: 'Discover cutting-edge IoT projects and premium smart products by Durai. Software development, hardware solutions, and innovative technology.',
  keywords: ['IoT', 'Smart Products', 'Innovation', 'Technology', 'Durai', 'Core Innovation', 'Hardware', 'Software'],
  authors: [{ name: 'Durai' }],
  creator: 'Durai',
  openGraph: {
    title: 'Durai - Innovation & Excellence',
    description: 'Cutting-edge projects and premium IoT products',
    type: 'website',
    locale: 'en_US',
    siteName: 'Core Innovation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Durai - Innovation & Excellence',
    description: 'Cutting-edge projects and premium IoT products',
    creator: '@Durai4444',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  )
}
