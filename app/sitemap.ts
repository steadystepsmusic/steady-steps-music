import { MetadataRoute } from 'next'

const cities = ['meridian', 'eagle', 'nampa', 'garden-city']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://steadystepsmusic.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...cities.map(city => ({
      url: `https://steadystepsmusic.com/${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
