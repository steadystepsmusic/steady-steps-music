import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '../components/Nav'
import { POLICY_SECTIONS } from '../student-policies/policies'

export const metadata: Metadata = {
  title: 'Lesson Policies | Steady Steps Music',
  description: 'Payment, cancellation, rescheduling, and makeup lesson policies for Steady Steps Music lessons in Boise, Idaho.',
  alternates: { canonical: 'https://steadystepsmusic.com/policies' },
}

export default function PoliciesPage() {
  return (
    <>
      <Nav />
      <div className="bg-slate-900 h-16" aria-hidden="true" />
      <main className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
          <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Lesson Policies</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">How Lessons Work</h1>
          <p className="text-slate-500 leading-relaxed mb-10">
            These are the policies every student agrees to before their first paid lesson. Questions? Reach out through the{' '}
            <Link href="/#contact" className="text-teal-600 hover:underline">contact form</Link>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-600 leading-relaxed flex flex-col gap-6">
            {POLICY_SECTIONS.map(section => (
              <div key={section.heading}>
                <h2 className="font-bold text-slate-900 mb-1">{section.heading}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/#contact" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-amber-500/20">
              Book a Free Lesson →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
