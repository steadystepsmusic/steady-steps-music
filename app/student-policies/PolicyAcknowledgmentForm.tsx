'use client'
import { useState } from 'react'
import { jsPDF } from 'jspdf'

const POLICY_SECTIONS = [
  {
    heading: '1. Payment',
    body: 'You may pay lesson-by-lesson or pre-pay for the month (4 lessons, 10% discount) at steadystepsmusic.com/pay. Payment must be completed before each lesson begins.',
  },
  {
    heading: '2. Cancellations and Rescheduling',
    body: 'Cancellations require at least 24 hours notice. If less than 24 hours notice is given (or in the case of a no-show), the session fee is still due. Reschedules are welcome anytime, as long as we can find a time that works within the same week.',
  },
  {
    heading: '3. Makeup Lessons',
    body: 'A properly-noticed, excused cancellation can be rescheduled within the same week when a slot is available. Lessons missed without proper notice are not eligible for a makeup.',
  },
]

const POLICY_CLOSING = 'By signing below, I acknowledge that I have read, understood, and agree to these policies.'

const POLICY_TEXT =
  POLICY_SECTIONS.map(s => `${s.heading}\n${s.body}`).join('\n\n') + `\n\n${POLICY_CLOSING}`

const BRAND = {
  navyText: '#0f172a',
  teal: '#0d9488',
  slate: '#475569',
  staircase: ['#162D6E', '#162D6E', '#2563EB', '#2563EB', '#7DD3FC', '#7DD3FC', '#2DD4BF'] as const,
}

function renderLogoToDataUrl(): string {
  const pixelScale = 8
  const canvas = document.createElement('canvas')
  canvas.width = 45 * pixelScale
  canvas.height = 35 * pixelScale
  const ctx = canvas.getContext('2d')!
  const rects: [number, number, number, number][] = [
    [0, 30, 15, 5], [10, 25, 5, 5], [10, 20, 15, 5], [20, 15, 5, 5],
    [20, 10, 15, 5], [30, 5, 5, 5], [30, 0, 15, 5],
  ]
  rects.forEach(([rx, ry, rw, rh], i) => {
    ctx.fillStyle = BRAND.staircase[i]
    ctx.fillRect(rx * pixelScale, ry * pixelScale, rw * pixelScale, rh * pixelScale)
  })
  return canvas.toDataURL('image/png')
}

function buildPolicyPdf(studentName: string, signerName: string, date: string): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = 612
  const margin = 56
  const maxWidth = pageWidth - margin * 2
  let y = margin

  const logoScale = 0.8
  const logoWidth = 45 * logoScale
  const logoHeight = 35 * logoScale
  doc.addImage(renderLogoToDataUrl(), 'PNG', margin, y, logoWidth, logoHeight)

  const wordmarkY = y + logoHeight * 0.7
  const textStartX = margin + logoWidth + 12
  let textX = textStartX
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(BRAND.navyText)
  doc.text('Steady ', textX, wordmarkY)
  textX += doc.getTextWidth('Steady ')
  doc.setTextColor(BRAND.teal)
  doc.text('Steps', textX, wordmarkY)
  textX += doc.getTextWidth('Steps')
  doc.setTextColor(BRAND.slate)
  doc.setFont('helvetica', 'normal')
  doc.text(' Music', textX, wordmarkY)

  y += logoHeight + 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(BRAND.slate)
  doc.text('Lesson Policy Acknowledgment', textStartX, y)

  y += 14
  doc.setDrawColor(BRAND.teal)
  doc.setLineWidth(2)
  doc.line(margin, y, pageWidth - margin, y)
  y += 30

  doc.setFontSize(11)
  POLICY_SECTIONS.forEach(section => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(BRAND.navyText)
    doc.text(section.heading, margin, y)
    y += 16

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(BRAND.slate)
    const lines = doc.splitTextToSize(section.body, maxWidth)
    doc.text(lines, margin, y)
    y += lines.length * 14 + 18
  })

  doc.setFont('helvetica', 'italic')
  doc.setTextColor(BRAND.slate)
  const closingLines = doc.splitTextToSize(POLICY_CLOSING, maxWidth)
  doc.text(closingLines, margin, y)
  y += closingLines.length * 14 + 36

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(BRAND.navyText)
  doc.text(`Student: ${studentName}`, margin, y)
  y += 18
  doc.text(`Signed by: ${signerName}`, margin, y)
  y += 18
  doc.text(`Date: ${date}`, margin, y)

  const footerY = 792 - 40
  doc.setDrawColor(BRAND.teal)
  doc.setLineWidth(1)
  doc.line(margin, footerY, pageWidth - margin, footerY)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(BRAND.slate)
  doc.text('steadystepsmusic.com', margin, footerY + 16)

  doc.setProperties({ title: `Steady Steps Music - Policy Acknowledgment - ${studentName}` })
  return doc
}

const EMAIL_PATTERN = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'

export default function PolicyAcknowledgmentForm() {
  const [form, setForm] = useState({ studentName: '', signerName: '', email: '', agree: false })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    const date = new Date().toLocaleDateString()
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '72672cac-8700-4b5b-824c-1b2471e1a7d6',
        subject: `Policy Acknowledgment - ${form.studentName}`,
        student_name: form.studentName,
        signed_by: form.signerName,
        email: form.email,
        date,
        agreed_policies: POLICY_TEXT,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setPdfDoc(buildPolicyPdf(form.studentName, form.signerName, date))
      setSent(true)
    } else setError(true)
  }

  if (sent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thanks, {form.signerName}!</h2>
        <p className="text-slate-500 mb-6">Your acknowledgment has been received. Click below to download a PDF copy of the signed policies for your records.</p>
        <button
          onClick={() => pdfDoc?.save(`Steady Steps Music - Policy Acknowledgment - ${form.studentName}.pdf`)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </button>
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
            pattern={EMAIL_PATTERN}
            title="Enter a complete email address, e.g. name@example.com"
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
      {error && <p className="text-center text-red-500 text-sm">Something went wrong, please try again or email steadystepsmusic@gmail.com.</p>}
    </form>
  )
}
