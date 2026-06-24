'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const MONTAGE2_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage%202%20-%20Vertical%20Web.mp4'
const POSTER2_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/montage-2-poster.jpg'
const MONTAGE_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage%20-%20Vertical%20Web.mp4'
const POSTER_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/montage-poster.jpg'
const YOUTUBE_ID = 'nRVzXqenyKc'

function HostedVideo({
  src,
  poster,
  songs,
  videoRef,
  onPlay,
}: {
  src: string
  poster: string
  songs: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  onPlay: () => void
}) {
  const [hasPlayed, setHasPlayed] = useState(false)

  function handleOverlayClick() {
    onPlay()
    videoRef.current?.play()
    setHasPlayed(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '380px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          onPlay={onPlay}
          style={{ display: 'block', width: '100%' }}
        />
        {!hasPlayed && (
          <div
            onClick={handleOverlayClick}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
          >
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
        )}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.05em', marginTop: '0.75rem', textAlign: 'center' }}>
        {songs}
      </p>
    </div>
  )
}

export default function VideoSection() {
  const ytPlayer = useRef<any>(null)
  const montage2Video = useRef<HTMLVideoElement>(null)
  const montageVideo = useRef<HTMLVideoElement>(null)

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
              montage2Video.current?.pause()
              montageVideo.current?.pause()
            }
          },
        },
      })
    }
  }, [])

  function pauseOthersFor(playing: 'montage2' | 'montage' | 'youtube') {
    if (playing !== 'youtube' && ytPlayer.current?.pauseVideo) ytPlayer.current.pauseVideo()
    if (playing !== 'montage2') montage2Video.current?.pause()
    if (playing !== 'montage') montageVideo.current?.pause()
  }

  return (
    <section id="video" style={{ padding: '1.5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Watch &amp; Listen
        </p>

        <HostedVideo
          src={MONTAGE2_URL}
          poster={POSTER2_URL}
          songs="Something in the Orange &middot; Lovely Day &middot; Black Water"
          videoRef={montage2Video}
          onPlay={() => pauseOthersFor('montage2')}
        />

        <HostedVideo
          src={MONTAGE_URL}
          poster={POSTER_URL}
          songs="The Joker &middot; Peaceful Easy Feeling &middot; Norwegian Wood &middot; Free Fallin'"
          videoRef={montageVideo}
          onPlay={() => pauseOthersFor('montage')}
        />

        {/* YouTube video */}
        <div
          onClick={() => pauseOthersFor('youtube')}
          style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}
        >
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
