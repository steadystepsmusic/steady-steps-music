import Link from 'next/link'
import Nav from './components/Nav'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Wrong note</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">That page isn&apos;t here.</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            The link may be old or mistyped. Everything you need is on the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-amber-500/20">
              Go to Home
            </Link>
            <Link href="/#contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-lg transition-colors border border-white/10">
              Book a Free Lesson
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
