'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const MONTAGE_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage.mp4'
const YOUTUBE_ID = 'nRVzXqenyKc'

export default function VideoSection() {
  const ytPlayer = useRef<any>(null)
  const hostedVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      ytPlayer.current = new window.YT.Player('yt-player', {
        events: {
          onReady: (e: any) => {
            e.target.setPlaybackQuality('hd1080')
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              e.target.setPlaybackQuality('hd1080')
              hostedVideo.current?.pause()
            }
          },
        },
      })
    }
  }, [])

  function handleHostedPlay() {
    if (ytPlayer.current?.pauseVideo) ytPlayer.current.pauseVideo()
  }

  return (
    <section id="video" style={{ padding: '1.5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Watch &amp; Listen
        </p>

        {/* Hosted vertical montage */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '380px', aspectRatio: '9/16', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
            <video
              ref={hostedVideo}
              src={MONTAGE_URL}
              controls
              playsInline
              preload="metadata"
              onPlay={handleHostedPlay}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* YouTube second video */}
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
