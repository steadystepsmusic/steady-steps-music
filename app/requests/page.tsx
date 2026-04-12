import Image from 'next/image'
import RequestsClient from './RequestsClient'

export const metadata = {
  title: 'Song Requests | Nik Mathews Music',
  description: 'Browse the setlist and request a song live!',
}

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-slate-900 px-6 py-16">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-slate-600">
            <Image
              src="/images/nik-mathews-hero.jpeg"
              alt="Nik Mathews"
              width={80}
              height={80}
              style={{ objectFit: 'cover', objectPosition: '15% 10%' }}
            />
          </div>
          <p className="text-slate-300 text-sm font-semibold mb-4">@nikmathewsmusic</p>
          <h1 className="text-4xl font-black text-white mb-2">Request a Song</h1>
          <p className="text-slate-400">Browse the setlist, tap a song, then hit send!</p>
        </div>

        <RequestsClient />

        {/* Tip link */}
        <div className="mt-6 text-center bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-300 text-sm mb-3">Feeling generous?<br />Send Nik a tip for your request.</p>
          <a
            href="https://venmo.com/code?user_id=2009457366138880646&created=1710189721.169592&printed=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#3D95CE] hover:bg-[#2e7db5] text-white font-bold rounded-xl transition-colors text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.4 2C20.1 3.3 20.4 4.6 20.4 6.3c0 5.1-4.3 11.7-7.8 16.3H4.9L2 3.1l6.7-.6 1.6 12.9c1.5-2.5 3.3-6.4 3.3-9.1 0-1.5-.3-2.5-.7-3.3L19.4 2z"/>
            </svg>
            Tip Nik on Venmo
          </a>
        </div>

        {/* Instagram */}
        <a
          href="https://instagram.com/nikmathewsmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 hover:bg-slate-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-sm">Follow Nik on Instagram</span>
        </a>

        {/* Book for event */}
        <a
          href="https://nikmathewsmusic.com/#booking"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 hover:bg-slate-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
            <Image src="/images/nik-mathews-hero.jpeg" alt="Book Nik" width={40} height={40} style={{ objectFit: 'cover', objectPosition: '15% 10%' }} />
          </div>
          <span className="text-white font-bold text-sm">Book Nik Mathews for Your Event</span>
        </a>

        {/* Funnel link */}
        <a
          href="https://steadystepsmusic.com"
          className="mt-4 flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 hover:bg-slate-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
            <Image src="/images/about.jpeg" alt="Book a lesson" width={40} height={40} style={{ objectFit: 'cover', objectPosition: '50% 25%' }} />
          </div>
          <span className="text-white font-bold text-sm">Book a Free Music Lesson with Nik</span>
        </a>

      </div>
    </div>
  )
}
