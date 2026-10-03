'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const MONTAGE3_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage%203%20-%20Vertical%20Web.mp4'
const POSTER3_URL = '/images/nik-mathews/montage-3-poster-web.jpg'
const MONTAGE2_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage%202%20-%20Vertical%20Web.mp4'
// Posters are 760px web copies of the Blob originals (full 1080px posters were ~1MB combined)
const POSTER2_URL = '/images/nik-mathews/montage-2-poster-web.jpg'
const MONTAGE_URL = 'https://s3zmevobweuhkkc2.public.blob.vercel-storage.com/Live%20Show%20Promo%20Montage%20-%20Vertical%20Web.mp4'
const POSTER_URL = '/images/nik-mathews/montage-poster-web.jpg'
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
  songs: string[]
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
    <div className="nmm-reel-tile">
      <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
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
        {/* Each title stays on one line; wraps only happen between songs */}
        {songs.map((song, i) => (
          <span key={song}>
            {i > 0 && ' \u00b7 '}
            <span style={{ whiteSpace: 'nowrap' }}>{song}</span>
          </span>
        ))}
      </p>
    </div>
  )
}

export default function VideoSection() {
  const ytPlayer = useRef<any>(null)
  const montage3Video = useRef<HTMLVideoElement>(null)
  const montage2Video = useRef<HTMLVideoElement>(null)
  const montageVideo = useRef<HTMLVideoElement>(null)
  const ytBox = useRef<HTMLDivElement>(null)
  const [showYouTube, setShowYouTube] = useState(false)

  // The YouTube embed pulls ~900KB of player JS, so only mount it once the
  // visitor scrolls near it. Keeps the hero and first paint fast.
  useEffect(() => {
    const box = ytBox.current
    if (!box) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setShowYouTube(true)
        observer.disconnect()
      }
    }, { rootMargin: '600px 0px' })
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!showYouTube) return
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
              montage3Video.current?.pause()
              montage2Video.current?.pause()
              montageVideo.current?.pause()
            }
          },
        },
      })
    }
  }, [showYouTube])

  function pauseOthersFor(playing: 'montage3' | 'montage2' | 'montage' | 'youtube') {
    if (playing !== 'youtube' && ytPlayer.current?.pauseVideo) ytPlayer.current.pauseVideo()
    if (playing !== 'montage3') montage3Video.current?.pause()
    if (playing !== 'montage2') montage2Video.current?.pause()
    if (playing !== 'montage') montageVideo.current?.pause()
  }

  return (
    <section id="video" style={{ padding: '1.5rem 1.5rem 4rem' }}>
      {/* Desktop: three reels side by side. Mobile: stacked, slightly narrower than full width to shorten the scroll. */}
      <style>{`
        .nmm-reel-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
        .nmm-reel-tile { display: flex; flex-direction: column; align-items: center; min-width: 0; }
        @media (max-width: 760px) {
          .nmm-reel-row { grid-template-columns: 1fr; gap: 2rem; justify-items: center; }
          .nmm-reel-tile { width: 85%; max-width: 340px; }
        }
      `}</style>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Watch &amp; Listen
        </p>

        <div className="nmm-reel-row">
        <HostedVideo
          src={MONTAGE3_URL}
          poster={POSTER3_URL}
          songs={["Ain't No Sunshine", 'Ring of Fire', 'Sundown']}
          videoRef={montage3Video}
          onPlay={() => pauseOthersFor('montage3')}
        />

        <HostedVideo
          src={MONTAGE2_URL}
          poster={POSTER2_URL}
          songs={['Something in the Orange', 'Lovely Day', 'Black Water']}
          videoRef={montage2Video}
          onPlay={() => pauseOthersFor('montage2')}
        />

        <HostedVideo
          src={MONTAGE_URL}
          poster={POSTER_URL}
          songs={['The Joker', 'Peaceful Easy Feeling', 'Norwegian Wood', "Free Fallin'"]}
          videoRef={montageVideo}
          onPlay={() => pauseOthersFor('montage')}
        />
        </div>

        {/* YouTube video */}
        <div
          ref={ytBox}
          onClick={() => pauseOthersFor('youtube')}
          style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          {showYouTube && <iframe
            id="yt-player"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&enablejsapi=1`}
            title="Nik Mathews Live Performance"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />}
        </div>
      </div>
    </section>
  )
}
