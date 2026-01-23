import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/DdSQL/', '/customer/', '/login/'],
      },
    ],
    sitemap: 'https://dd-products.vercel.app/sitemap.xml',
  }
}
