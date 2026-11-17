import { MetadataRoute } from 'next'
import { songs } from './tab/data'

const cities = ['boise', 'meridian', 'eagle', 'nampa', 'garden-city', 'star', 'kuna', 'caldwell']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://steadystepsmusic.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://steadystepsmusic.com/free-guide',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://steadystepsmusic.com/7th-chords',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://steadystepsmusic.com/policies',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...cities.map(city => ({
      url: `https://steadystepsmusic.com/${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: 'https://steadystepsmusic.com/tab',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...songs.map(song => ({
      url: `https://steadystepsmusic.com/tab/${song.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
