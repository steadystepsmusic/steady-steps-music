'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', instrument: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(false)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_key: '72672cac-8700-4b5b-824c-1b2471e1a7d6', subject: 'New Lesson Inquiry | Steady Steps Music', ...form }),
      })
      const data = await res.json()
      if (data.success) {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'generate_lead', { event_category: 'contact_form' })
        }
        router.push('/thank-you')
      } else {
        setError(true)
        setSubmitting(false)
      }
    } catch {
      setError(true)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* OOO — remove after 8/5/26 */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        I&apos;m currently out of office on a backpacking trip with limited connectivity until Wednesday, 8/5. I&apos;ll respond to booking inquiries with high priority when I&apos;m back Wednesday evening. Thanks for reaching out!
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
          <input
            id="contact-name"
            required type="text" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input
            id="contact-email"
            required type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-instrument" className="block text-sm font-medium text-slate-300 mb-1">I&apos;m interested in…</label>
        <select
          id="contact-instrument"
          value={form.instrument}
          onChange={e => setForm({ ...form, instrument: e.target.value })}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-400 transition-colors"
        >
          <option value="">Select a lesson type</option>
          <option>Guitar</option>
          <option>Bass</option>
          <option>Piano</option>
          <option>Voice / Singing</option>
          <option>Music Theory</option>
          <option>Songwriting</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-1">Anything else? (optional)</label>
        <textarea
          id="contact-message"
          rows={4} value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me a bit about your experience level, goals, or any questions you have..."
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors resize-none"
        />
      </div>
      <button type="submit" disabled={submitting}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 active:scale-95 text-slate-900 font-bold rounded-xl text-lg transition-all duration-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100">
        {submitting ? 'Sending…' : 'Book My Free Lesson →'}
      </button>
      {error && (
        <p className="text-center text-red-400 text-sm">Something went wrong. Please try again or email me directly.</p>
      )}
      <p className="text-center text-slate-400 text-sm">No commitment. I&apos;m currently out of office and will reply by Wednesday evening, 8/5.</p>
    </form>
  )
}
