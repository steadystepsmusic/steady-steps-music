import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'In-Home Lesson Booking — Steady Steps Music',
  robots: { index: false, follow: false },
}

// ─── Stripe Payment Links ─────────────────────────────────────────────────────
// Create these in Stripe when a student requests in-home lessons, then paste the
// links here and redeploy.
const STRIPE = {
  single30: '#', // $65 — 30-min in-home (replace before sending to student)
  single45: '#', // $85 — 45-min in-home (replace before sending to student)
  single60: '#', // $105 — 60-min in-home (replace before sending to student)
}

// ─── Plan data ────────────────────────────────────────────────────────────────

const single = [
  { label: '30-Minute Lesson', price: '$65', note: 'per session', href: STRIPE.single30 },
  { label: '45-Minute Lesson', price: '$85', note: 'per session', href: STRIPE.single45 },
  { label: '60-Minute Lesson', price: '$105', note: 'per session', href: STRIPE.single60, highlight: true },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PayInHomePage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-center">
        <a href="/" className="flex items-center gap-3 group">
          <svg viewBox="0 0 45 35" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="0"  y="30" width="15" height="5" fill="#162D6E"/>
            <rect x="10" y="25" width="5"  height="5" fill="#162D6E"/>
            <rect x="10" y="20" width="15" height="5" fill="#2563EB"/>
            <rect x="20" y="15" width="5"  height="5" fill="#2563EB"/>
            <rect x="20" y="10" width="15" height="5" fill="#7DD3FC"/>
            <rect x="30" y="5"  width="5"  height="5" fill="#7DD3FC"/>
            <rect x="30" y="0"  width="15" height="5" fill="#2DD4BF"/>
          </svg>
          <span className="font-bold text-white text-2xl md:text-3xl leading-tight whitespace-nowrap">
            Steady <span className="text-teal-400">Steps</span> Music
          </span>
        </a>
      </div>

      {/* Hero copy */}
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-10 text-center">
        <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">In-Home Lessons</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Book Your Session</h1>
        <p className="text-slate-500 leading-relaxed">
          Prices below reflect an additional $15 travel fee per session on top of standard lesson rates. Pay securely with any major credit or debit card.
          Questions? Reach out at <a href="mailto:steadystepsmusic@gmail.com" className="text-teal-600 hover:underline">steadystepsmusic@gmail.com</a>.
        </p>
      </div>

      {/* Single sessions */}
      <div className="max-w-4xl mx-auto px-6 pb-14">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Single Sessions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {single.map(p => (
            <a
              key={p.label}
              href={p.href}
              className={`group block rounded-2xl p-6 border-2 transition-all hover:shadow-md ${
                p.highlight
                  ? 'bg-teal-600 border-teal-600 hover:bg-teal-500 hover:border-teal-500'
                  : 'bg-white border-slate-200 hover:border-teal-300'
              }`}
            >
              {p.highlight && (
                <div className="mb-3">
                  <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                </div>
              )}
              <div className={`text-sm font-semibold mb-1 ${p.highlight ? 'text-teal-100' : 'text-slate-500'}`}>{p.label}</div>
              <div className="flex items-baseline gap-2 mb-5">
                <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</span>
                <span className={`text-sm ${p.highlight ? 'text-teal-100' : 'text-slate-500'}`}>{p.note}</span>
              </div>
              <div className={`w-full text-center py-2.5 rounded-xl font-bold text-sm transition-colors ${
                p.highlight
                  ? 'bg-white text-teal-700 group-hover:bg-teal-50'
                  : 'bg-teal-600 text-white group-hover:bg-teal-500'
              }`}>
                Pay Now
              </div>
            </a>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-6">Cancellations require 24 hours notice or the session fee is still due. Reschedules are welcome anytime as long as we can find a time in the same week.</p>
        <p className="text-slate-400 text-xs mt-2">The $15 travel fee is in addition to standard lesson rates and covers travel within the Boise/Eagle/Meridian area.</p>
      </div>

      {/* Trust footer */}
      <div className="border-t border-slate-200 bg-white py-6 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure checkout powered by Stripe. Your card details are never stored.
        </div>
      </div>

    </div>
  )
}
