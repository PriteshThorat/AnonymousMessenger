import type { MetadataRoute } from 'next'
import dbConnect from '@/src/lib/dbConnect'
import userModel from '@/src/models/user.model'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4
    }
  ]

  // Dynamic user profile routes
  let userRoutes: MetadataRoute.Sitemap = []
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect()
      const users = await userModel.find({ isVerified: true }).select('username').lean()
      userRoutes = users.map(u => ({
        url: `${baseUrl}/u/${encodeURIComponent(u.username)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7
      }))
    } catch {
      // Silent fail: if DB unavailable during build, omit dynamic routes
    }
  }

  return [...staticRoutes, ...userRoutes]
}