import type { Metadata } from 'next'
import Nav from '../components/Nav'

export const metadata: Metadata = {
  title: 'Message Received | Steady Steps Music',
  robots: { index: false },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-dvh bg-slate-900 flex flex-col">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-4">Message Received</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">You&apos;re all set!</h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            I&apos;ll get back to you within 24 hours to schedule your free 15-minute demo lesson.
          </p>

          {/* Free Guide CTA */}
          <a
            href="/free-guide"
            className="inline-block w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-amber-500/20 mb-12"
          >
            Download the Free Beginner&apos;s Guitar Guide →
          </a>

          {/* Social Links */}
          <div>
            <p className="text-slate-400 text-sm mb-6">While you wait, follow along for free lessons:</p>
            <div className="flex items-center justify-center gap-6">

              {/* YouTube */}
              <a
                href="https://youtube.com/@steadystepsmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-red-600 hover:bg-red-500 rounded-2xl flex items-center justify-center transition-colors shadow-lg">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-white transition-colors">YouTube</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/steadystepsmusic?igsh=dm50MnlrcnJtbGVu&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 hover:opacity-90 rounded-2xl flex items-center justify-center transition-opacity shadow-lg">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-white transition-colors">Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/18av9MhPhH/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-center transition-colors shadow-lg">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-white transition-colors">Facebook</span>
              </a>

            </div>
          </div>

          <div className="mt-12">
            <a href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              Back to Steady Steps Music
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
