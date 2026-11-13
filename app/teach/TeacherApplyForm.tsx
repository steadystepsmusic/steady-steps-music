'use client'
import { useState } from 'react'

// PROTOTYPE (2026-11-13). Posts to the same Web3Forms inbox as the lesson form,
// but with its own subject so it never matches the Zapier "New Lesson Inquiry"
// search (no SMS, no student auto-reply). Fires GA4 `teacher_application`,
// never `generate_lead`, which is the Google Ads lesson conversion.

const INSTRUMENTS = ['Guitar', 'Bass', 'Piano', 'Voice', 'Something else']
const FORMATS = ['Online', 'In person (Boise area)', 'Both']

const inputClass =
  'w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors'
const labelClass = 'block text-sm font-medium text-slate-300 mb-1'

export default function TeacherApplyForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', years: '', format: '', link: '', message: '' })
  const [instruments, setInstruments] = useState<string[]>([])
  const [botcheck, setBotcheck] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const toggle = (name: string) =>
    setInstruments(cur => (cur.includes(name) ? cur.filter(i => i !== name) : [...cur, name]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || botcheck) return
    setSubmitting(true)
    setError(false)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '72672cac-8700-4b5b-824c-1b2471e1a7d6',
          subject: 'Teacher Application | Steady Steps Music',
          replyto: form.email,
          botcheck,
          ...form,
          instruments: instruments.join(', '),
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'teacher_application', { event_category: 'teach_page' })
        }
        setSent(true)
      } else {
        setError(true)
        setSubmitting(false)
      }
    } catch {
      setError(true)
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-slate-800 border border-teal-500/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-black text-white mb-3">Application received.</h3>
        <p className="text-slate-300 leading-relaxed">
          Thanks for applying. Nik reads every application himself and will email you within a few days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="checkbox" name="botcheck" checked={!!botcheck}
        onChange={e => setBotcheck(e.target.checked ? 'bot' : '')}
        className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="teach-name" className={labelClass}>Your Name</label>
          <input id="teach-name" required type="text" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="First and last name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="teach-email" className={labelClass}>Email Address</label>
          <input id="teach-email" required type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com" className={inputClass} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="teach-phone" className={labelClass}>Phone Number (optional)</label>
          <input id="teach-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="(208) 555-0123" className={inputClass} />
        </div>
        <div>
          <label htmlFor="teach-location" className={labelClass}>City and State</label>
          <input id="teach-location" required type="text" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="Boise, ID" className={inputClass} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>What do you teach?</legend>
        <div className="flex flex-wrap gap-2 mt-1">
          {INSTRUMENTS.map(name => {
            const on = instruments.includes(name)
            return (
              <button key={name} type="button" onClick={() => toggle(name)} aria-pressed={on}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${on ? 'bg-teal-500 border-teal-500 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-teal-400'}`}>
                {name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="teach-years" className={labelClass}>Years teaching lessons</label>
          <select id="teach-years" required value={form.years}
            onChange={e => setForm({ ...form, years: e.target.value })} className={inputClass}>
            <option value="">Select one</option>
            <option>Less than 1</option>
            <option>1 to 3</option>
            <option>4 to 9</option>
            <option>10 or more</option>
          </select>
        </div>
        <div>
          <label htmlFor="teach-format" className={labelClass}>How would you teach?</label>
          <select id="teach-format" required value={form.format}
            onChange={e => setForm({ ...form, format: e.target.value })} className={inputClass}>
            <option value="">Select one</option>
            {FORMATS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="teach-link" className={labelClass}>A link to you playing or teaching (optional)</label>
        <input id="teach-link" type="text" inputMode="url" value={form.link}
          onChange={e => setForm({ ...form, link: e.target.value })}
          placeholder="YouTube, Instagram, or your website" className={inputClass} />
      </div>
      <div>
        <label htmlFor="teach-message" className={labelClass}>Tell us about your teaching</label>
        <textarea id="teach-message" required rows={5} value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Who you've taught, what you like teaching most, and how many students you'd want."
          className={`${inputClass} resize-none`} />
      </div>
      <button type="submit" disabled={submitting}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 active:scale-95 text-slate-900 font-bold rounded-xl text-lg transition-all duration-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100">
        {submitting ? 'Sending…' : 'Send My Application →'}
      </button>
      {error && (
        <p className="text-center text-red-400 text-sm">Something went wrong. Please try again or email us at <a href="mailto:hello@steadystepsmusic.com" className="underline hover:text-red-300">hello@steadystepsmusic.com</a>.</p>
      )}
      <p className="text-center text-slate-400 text-sm">Nik reads every application himself.</p>
    </form>
  )
}
