import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/sign-in',
          '/sign-up',
          '/u/', // user profile listing prefix
        ],
        disallow: [
          '/dashboard', // private user dashboard
          '/api/', // API endpoints
          '/verify', // verification code pages
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, '')
  }
}