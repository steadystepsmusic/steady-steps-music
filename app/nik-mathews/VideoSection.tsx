'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const MONTAGE_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage%20-%20Vertical%20Web.mp4'
const POSTER_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/montage-poster.jpg'
const YOUTUBE_ID = 'nRVzXqenyKc'

export default function VideoSection() {
  const ytPlayer = useRef<any>(null)

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => {
      ytPlayer.current = new window.YT.Player('yt-player', {
        events: {
          onReady: (e: any) => { e.target.setPlaybackQuality('hd1080') },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              e.target.setPlaybackQuality('hd1080')
            }
          },
        },
      })
    }
  }, [])

  return (
    <section id="video" style={{ padding: '1.5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Watch &amp; Listen
        </p>

        <video
          src={MONTAGE_URL}
          poster={POSTER_URL}
          controls
          playsInline
          preload="none"
          style={{ display: 'block', width: '100%', maxWidth: '380px', margin: '0 auto 1.5rem', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)' }}
        />

        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
          <iframe
            id="yt-player"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&enablejsapi=1`}
            title="Nik Mathews Live Performance"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </section>
  )
}
