'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function YouTubeFacade({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false)

  if (active) {
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="relative w-full block group cursor-pointer"
      style={{ paddingBottom: '56.25%' }}
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      {/* dark overlay */}
      <span className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      {/* play button */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-20 h-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
          <svg className="w-10 h-10 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
