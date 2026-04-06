'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', instrument: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: replace YOUR_FORM_ID with a Formspree endpoint (https://formspree.io)
    // or wire up to any backend/email service
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: '72672cac-8700-4b5b-824c-1b2471e1a7d6', subject: 'New Lesson Inquiry | Steady Steps Music', ...form }),
    })
    const data = await res.json()
    if (data.success) setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-white mb-2">Message received!</h3>
        <p className="text-slate-300">I&apos;ll get back to you within 24 hours to schedule your free lesson.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
          <input
            required type="text" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input
            required type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">I&apos;m interested in…</label>
        <select
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
        <label className="block text-sm font-medium text-slate-300 mb-1">Anything else? (optional)</label>
        <textarea
          rows={4} value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me a bit about your experience level, goals, or any questions you have..."
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors resize-none"
        />
      </div>
      <button type="submit"
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-lg transition-colors">
        Book My Free Lesson →
      </button>
      <p className="text-center text-slate-400 text-sm">No commitment. I&apos;ll reply within 24 hours.</p>
    </form>
  )
}
