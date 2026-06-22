import type { Metadata } from 'next'
import PolicyAcknowledgmentForm from './PolicyAcknowledgmentForm'

export const metadata: Metadata = {
  title: 'Lesson Policies — Steady Steps Music',
  robots: { index: false, follow: false },
}

export default function StudentPoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50">

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

      <div className="max-w-2xl mx-auto px-6 pt-14 pb-6 text-center">
        <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Welcome Aboard</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Lesson Policy Acknowledgment</h1>
        <p className="text-slate-500 leading-relaxed">
          Please review and sign below before your first paid lesson. Questions? Reach out at{' '}
          <a href="mailto:steadystepsmusic@gmail.com" className="text-teal-600 hover:underline">steadystepsmusic@gmail.com</a>.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-14">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <PolicyAcknowledgmentForm />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white py-6 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          A copy of these policies will be emailed to you for your records.
        </div>
      </div>

    </div>
  )
}
