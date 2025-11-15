import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://core-innovation-ch.vercel.app'
  
  // Static pages
  const routes = ['', '/custom-project'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Products for indexing
  const products = [
    'smart-iot-industry-ecosystem',
    'iot-smart-lift-guard',
    'smart-home-gas-monitoring',
    'iot-smart-door-lock-rfid',
    'iot-smart-water-planting-kit',
    'iot-smart-night-lamp',
  ].map((product) => ({
    url: `${baseUrl}#products`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...products]
}
