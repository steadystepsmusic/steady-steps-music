'use client'

import { useState } from 'react'

// ─── Stripe Payment Links ─────────────────────────────────────────────────────
const STRIPE = {
  studioSingle30:  'https://buy.stripe.com/4gM5kv4aIdje77ufb11RC00',
  studioSingle45:  'https://buy.stripe.com/fZu9ALbDa5QMgI49QH1RC01',
  studioSingle60:  'https://buy.stripe.com/00w7sD8qY3IE77ud2T1RC02',
  studioMonthly30: 'https://buy.stripe.com/6oU14f36EdjeajGbYP1RC03',
  studioMonthly45: 'https://buy.stripe.com/28E8wH4aI3IE2Refb11RC04',
  studioMonthly60: 'https://buy.stripe.com/eVq6ozcHebb61Nafb11RC05',
  inhomeSingle30:  'https://buy.stripe.com/fZu7sDfTq2EA2Re2of1RC0b',
  inhomeSingle45:  'https://buy.stripe.com/00w6oz5eMcfabnK1kb1RC0a',
  inhomeSingle60:  'https://buy.stripe.com/3cI8wHaz6bb6ajGaUL1RC09',
  inhomeMonthly30: 'https://buy.stripe.com/4gMaEPaz66UQ3Vifb11RC06',
  inhomeMonthly45: 'https://buy.stripe.com/eVqcMXdLia720J63sj1RC07',
  inhomeMonthly60: 'https://buy.stripe.com/28EaEPdLieni3Vi6Ev1RC08',
}

type Location = 'studio' | 'inhome'
type Plan = 'single' | 'monthly'

const PLANS: Record<Location, Record<Plan, { label: string; price: string; note: string; href: string; highlight?: boolean }[]>> = {
  studio: {
    single: [
      { label: '30-Minute Lesson', price: '$50', note: 'per session', href: STRIPE.studioSingle30 },
      { label: '45-Minute Lesson', price: '$70', note: 'per session', href: STRIPE.studioSingle45 },
      { label: '60-Minute Lesson', price: '$90', note: 'per session', href: STRIPE.studioSingle60, highlight: true },
    ],
    monthly: [
      { label: '30-Minute Lessons', price: '$180', note: '4 lessons / month', href: STRIPE.studioMonthly30 },
      { label: '45-Minute Lessons', price: '$252', note: '4 lessons / month', href: STRIPE.studioMonthly45 },
      { label: '60-Minute Lessons', price: '$324', note: '4 lessons / month', href: STRIPE.studioMonthly60, highlight: true },
    ],
  },
  inhome: {
    single: [
      { label: '30-Minute Lesson', price: '$65', note: 'per session', href: STRIPE.inhomeSingle30 },
      { label: '45-Minute Lesson', price: '$85', note: 'per session', href: STRIPE.inhomeSingle45 },
      { label: '60-Minute Lesson', price: '$105', note: 'per session', href: STRIPE.inhomeSingle60, highlight: true },
    ],
    monthly: [
      { label: '30-Minute Lessons', price: '$240', note: '4 lessons / month', href: STRIPE.inhomeMonthly30 },
      { label: '45-Minute Lessons', price: '$312', note: '4 lessons / month', href: STRIPE.inhomeMonthly45 },
      { label: '60-Minute Lessons', price: '$384', note: '4 lessons / month', href: STRIPE.inhomeMonthly60, highlight: true },
    ],
  },
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex bg-slate-100 rounded-xl p-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            value === opt.value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function PayClient() {
  const [location, setLocation] = useState<Location>('studio')
  const [plan, setPlan] = useState<Plan>('single')

  const plans = PLANS[location][plan]

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
        <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Book Your Lessons</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Choose Your Plan</h1>
        <p className="text-slate-500 leading-relaxed">
          Select where you&apos;d like lessons and how you&apos;d like to pay. Pay securely with any major credit or debit card.
          Questions? Reach out to us at <a href="mailto:steadystepsmusic@gmail.com" className="text-teal-600 hover:underline">steadystepsmusic@gmail.com</a> and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      {/* Toggles */}
      <div className="max-w-4xl mx-auto px-6 pb-10 flex flex-col items-center gap-4">
        <ToggleGroup
          value={location}
          onChange={setLocation}
          options={[
            { value: 'studio', label: 'Studio / Online' },
            { value: 'inhome', label: 'In-Home' },
          ]}
        />
        <ToggleGroup
          value={plan}
          onChange={setPlan}
          options={[
            { value: 'single', label: 'Pay Per Session' },
            { value: 'monthly', label: 'Monthly Prepay (Save 10%)' },
          ]}
        />
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-6 pb-14">
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map(p => (
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
              <div className="mb-5">
                <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</span>
                <div className={`text-sm ${p.highlight ? 'text-teal-100' : 'text-slate-500'}`}>{p.note}</div>
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
        {plan === 'monthly' && (
          <p className="text-slate-400 text-xs mt-4">Monthly prepay covers 4 lessons per billing cycle. In months with 5 weeks, additional lessons can be booked at the single-session rate.</p>
        )}
        {location === 'inhome' && (
          <p className="text-slate-400 text-xs mt-2">The $15 travel fee covers travel within the Boise/Eagle/Meridian area{plan === 'monthly' ? '; the 10% prepay discount applies to the lesson fee only' : ''}.</p>
        )}
        <p className="text-slate-400 text-xs mt-2">Cancellations require 24 hours notice or the session fee is still due. Reschedules are welcome anytime as long as we can find a time in the same week.</p>
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
