'use client'

import { useEffect, useRef, useState } from 'react'

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
  const hostedVideo = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

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
              hostedVideo.current?.pause()
            }
          },
        },
      })
    }
  }, [])

  function handleClick() {
    const v = hostedVideo.current
    if (!v) return
    if (v.paused) {
      if (ytPlayer.current?.pauseVideo) ytPlayer.current.pauseVideo()
      v.play()
    } else {
      v.pause()
    }
  }

  return (
    <section id="video" style={{ padding: '1.5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Watch &amp; Listen
        </p>

        {/* Hosted vertical montage with custom play button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div
            onClick={handleClick}
            style={{ position: 'relative', width: '100%', maxWidth: '380px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)', cursor: 'pointer' }}
          >
            <video
              ref={hostedVideo}
              src={MONTAGE_URL}
              poster={POSTER_URL}
              controls={playing}
              playsInline
              preload="none"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              style={{ display: 'block', width: '100%' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: playing ? 0 : 1,
              transition: 'opacity 0.25s',
              background: playing ? 'transparent' : 'rgba(0,0,0,0.2)',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(201,168,76,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#0a0a0a">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
            </div>
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
