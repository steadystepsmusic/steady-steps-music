import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'In-Home Lesson Block — Steady Steps Music',
  robots: { index: false, follow: false },
}

// ─── Stripe Payment Links ─────────────────────────────────────────────────────
// Custom block pricing for a single household. Paste the Stripe links here and
// redeploy. Keep this page name-free; it is shared by direct link only.
const STRIPE = {
  monthly: 'https://buy.stripe.com/9B6fZ90Yw1AwdvS2of1RC0c', // $920 — four weekly sessions, prepaid
  weekly:  'https://buy.stripe.com/00w8wHcHea72dvSgf51RC0d', // $255 — one weekly session, pay as you go
}

// ─── Plan data ────────────────────────────────────────────────────────────────

const plans = [
  {
    label: 'Monthly Prepay',
    price: '$920',
    note: 'per month',
    detail: 'Four weekly sessions, $230 per week',
    cta: 'Prepay the Month',
    href: STRIPE.monthly,
    highlight: true,
  },
  {
    label: 'Pay As You Go',
    price: '$255',
    note: 'per week',
    detail: 'One session, billed weekly',
    cta: 'Pay for This Week',
    href: STRIPE.weekly,
    highlight: false,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PayBlockPage() {
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
        <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">In-Home Lesson Block</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Two-Hour Weekly Block</h1>
        <p className="text-slate-500 leading-relaxed">
          Three lessons back to back, taught in your home once a week. Travel is included in both options.
          Pay securely with any major credit card. Questions? Reach out at{' '}
          <a href="mailto:steadystepsmusic@gmail.com" className="text-teal-600 hover:underline">steadystepsmusic@gmail.com</a>.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-3xl mx-auto px-6 pb-14">
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map(p => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block rounded-2xl p-6 border-2 transition-all hover:shadow-md ${
                p.highlight
                  ? 'bg-teal-600 border-teal-600 hover:bg-teal-500 hover:border-teal-500'
                  : 'bg-white border-slate-200 hover:border-teal-300'
              }`}
            >
              {p.highlight && (
                <div className="mb-3">
                  <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide">Best Value</span>
                </div>
              )}
              <div className={`text-sm font-semibold mb-1 ${p.highlight ? 'text-teal-100' : 'text-slate-500'}`}>{p.label}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</span>
                <span className={`text-sm ${p.highlight ? 'text-teal-100' : 'text-slate-500'}`}>{p.note}</span>
              </div>
              <div className={`text-sm mb-5 ${p.highlight ? 'text-teal-100' : 'text-slate-500'}`}>{p.detail}</div>
              <div className={`w-full text-center py-2.5 rounded-xl font-bold text-sm transition-colors ${
                p.highlight
                  ? 'bg-white text-teal-700 group-hover:bg-teal-50'
                  : 'bg-teal-600 text-white group-hover:bg-teal-500'
              }`}>
                {p.cta}
              </div>
            </a>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-6">Cancellations require 24 hours notice or the session fee is still due. Reschedules are welcome anytime as long as we can find a time in the same week.</p>
        <p className="text-slate-400 text-xs mt-2">The monthly prepay covers four consecutive weekly sessions. If a week is missed with notice, it rolls to the next available week.</p>
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
