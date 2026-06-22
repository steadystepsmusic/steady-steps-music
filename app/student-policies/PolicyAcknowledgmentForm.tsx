'use client'
import { useState } from 'react'
import { jsPDF } from 'jspdf'

const POLICY_TEXT = `STEADY STEPS MUSIC — LESSON POLICIES

1. Payment
You may pay lesson-by-lesson or pre-pay for the month (4 lessons, 10% discount) at steadystepsmusic.com/pay. Payment must be completed before each lesson begins.

2. Cancellations & Rescheduling
Cancellations require at least 24 hours notice. If less than 24 hours notice is given (or in the case of a no-show), the session fee is still due. Reschedules are welcome anytime, as long as we can find a time that works within the same week.

3. Makeup Lessons
A properly-noticed, excused cancellation can be rescheduled within the same week when a slot is available. Lessons missed without proper notice are not eligible for a makeup.

By signing below, I acknowledge that I have read, understood, and agree to these policies.`

function downloadPolicyPdf(studentName: string, signerName: string, date: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 56
  const maxWidth = 612 - margin * 2
  let y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Steady Steps Music — Lesson Policy Acknowledgment', margin, y)
  y += 28

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const lines = doc.splitTextToSize(POLICY_TEXT, maxWidth)
  doc.text(lines, margin, y)
  y += lines.length * 14 + 24

  doc.setFont('helvetica', 'bold')
  doc.text(`Student: ${studentName}`, margin, y)
  y += 18
  doc.text(`Signed by: ${signerName}`, margin, y)
  y += 18
  doc.text(`Date: ${date}`, margin, y)

  doc.save(`Steady Steps Music - Policy Acknowledgment - ${studentName}.pdf`)
}

export default function PolicyAcknowledgmentForm() {
  const [form, setForm] = useState({ studentName: '', signerName: '', email: '', agree: false })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    const date = new Date().toLocaleDateString()
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '72672cac-8700-4b5b-824c-1b2471e1a7d6',
        subject: `Policy Acknowledgment — ${form.studentName}`,
        student_name: form.studentName,
        signed_by: form.signerName,
        email: form.email,
        date,
        agreed_policies: POLICY_TEXT,
      }),
    })
    const data = await res.json()
    if (data.success) {
      downloadPolicyPdf(form.studentName, form.signerName, date)
      setSent(true)
    } else setError(true)
  }

  if (sent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thanks, {form.signerName}!</h2>
        <p className="text-slate-500">Your acknowledgment has been received. A PDF copy of the signed policies has been downloaded to your device for your records.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-600 whitespace-pre-line leading-relaxed">
        {POLICY_TEXT}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="student-name" className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
          <input
            id="student-name"
            required type="text" value={form.studentName}
            onChange={e => setForm({ ...form, studentName: e.target.value })}
            placeholder="Student's full name"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="signer-email" className="block text-sm font-medium text-slate-700 mb-1">Your Email</label>
          <input
            id="signer-email"
            required type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="parent@example.com"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          required type="checkbox" checked={form.agree}
          onChange={e => setForm({ ...form, agree: e.target.checked })}
          className="mt-1 w-5 h-5 accent-teal-600"
        />
        <span className="text-sm text-slate-600">I have read and agree to the policies above.</span>
      </label>

      <div>
        <label htmlFor="signer-name" className="block text-sm font-medium text-slate-700 mb-1">Signature (type your full name)</label>
        <input
          id="signer-name"
          required type="text" value={form.signerName}
          onChange={e => setForm({ ...form, signerName: e.target.value })}
          placeholder="Your full name"
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors font-[cursive] text-lg"
        />
      </div>

      <button type="submit"
        className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-lg transition-colors">
        Submit Acknowledgment
      </button>
      {error && <p className="text-center text-red-500 text-sm">Something went wrong — please try again or email steadystepsmusic@gmail.com.</p>}
    </form>
  )
}
