'use client'

import { useEffect, useRef, useState } from 'react'
import type { Review } from '../site'

// Static class strings so Tailwind picks them up. Card width = (track - gaps) / cards per view.
const CARD_WIDTH = {
  2: 'w-[85%] sm:w-[calc((100%-1.5rem)/2)]',
  3: 'w-[85%] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)]',
}

export default function ReviewCarousel({ reviews, perView }: { reviews: Review[]; perView: 2 | 3 }) {
  const track = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = () => {
    const el = track.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  const arrow = 'w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 font-bold transition-opacity hover:bg-slate-100 disabled:opacity-30 disabled:cursor-default'

  return (
    <div>
      <div
        ref={track}
        onScroll={update}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map(r => (
          <div key={r.name} className={`${CARD_WIDTH[perView]} shrink-0 snap-start bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col`}>
            <div className="text-amber-400 text-lg mb-3" aria-label="Rated 5 out of 5 stars">★★★★★</div>
            <ReviewQuote quote={r.quote} />
            <div className="mt-auto">
              <div className="font-bold text-slate-900">{r.name}</div>
              <div className="text-slate-600 text-sm">{r.role}</div>
            </div>
          </div>
        ))}
      </div>
      {(canPrev || canNext) && (
        <div className="flex justify-center gap-3 mt-6">
          <button type="button" aria-label="Previous reviews" onClick={() => scroll(-1)} disabled={!canPrev} className={arrow}>←</button>
          <button type="button" aria-label="Next reviews" onClick={() => scroll(1)} disabled={!canNext} className={arrow}>→</button>
        </div>
      )}
    </div>
  )
}

// Fade the bottom edge only while there is more text below, so a fully read
// (or short) review doesn't look cut off.
function ReviewQuote({ quote }: { quote: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(true)

  const update = () => {
    const el = box.current
    if (el) setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 2)
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      ref={box}
      tabIndex={0}
      onScroll={update}
      className={`h-16 overflow-y-auto pr-2 mb-4 text-sm ${more ? '[mask-image:linear-gradient(to_bottom,black_calc(100%-1.25rem),transparent)]' : ''}`}
    >
      <p className="text-slate-600 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
    </div>
  )
}
