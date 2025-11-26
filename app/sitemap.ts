import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://core-innovation-ch.vercel.app'
  
  // Static pages
  const routes = ['', '/about', '/projects', '/products', '/contact', '/custom-project'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : route === '/custom-project' ? 0.8 : 0.9,
  }))

  // Individual product pages
  const products = [
    'smart-iot-industry-ecosystem',
    'iot-smart-lift-guard',
    'smart-home-gas-monitoring',
    'iot-smart-door-lock-rfid',
    'iot-smart-water-planting-kit',
    'iot-smart-night-lamp',
    'real-time-chat-website',
  ].map((product) => ({
    url: `${baseUrl}/products/${product}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...products]
}
