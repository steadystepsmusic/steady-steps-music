import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '../components/Nav'
import KitForm from './KitForm'

export const metadata: Metadata = {
  title: "Free Beginner's Guitar Guide | Steady Steps Music",
  description:
    "Get the free Steady Steps Beginner's Guitar Guide — understand the fretboard, learn your first chords, and start making real progress on guitar.",
  openGraph: {
    title: "Free Beginner's Guitar Guide | Steady Steps Music",
    description:
      "The free guide that walks you through exactly what beginners need to know — fretboard, chords, tuning, and more.",
    url: 'https://steadystepsmusic.com/free-guide',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

const bullets = [
  'Why the fretboard is more organized than it looks',
  'The one pattern that makes every note predictable',
  'How to get your guitar in tune every single time',
  'How to read any chord diagram so you can learn songs on your own',
  '10 beginner guitar chords to get you started and unlock hundreds of songs',
]

export default function FreeGuidePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <Nav basePath="https://steadystepsmusic.com" />

      {/* Hero */}
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-12 lg:pt-32 lg:pb-20 text-center">

        <p className="text-teal-400 text-base font-semibold uppercase tracking-wider mb-4">
          Free guide
        </p>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-8">
          Your first step to understanding the guitar.
        </h1>

        {/* Image below headline */}
        <div className="relative w-full sm:w-2/3 mx-auto aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl mb-10">
          <Image
            src="/images/lead-magnet.jpg"
            alt="Nik Mathews teaching guitar — Steady Steps Music"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <p className="text-slate-400 text-xl leading-relaxed mb-8">
          The Steady Steps Beginner's Guitar Guide covers everything a new guitarist
          needs to know, step-by-step.
        </p>

        <ul className="space-y-3 mb-10 inline-block text-left">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-slate-300 text-lg">
              <span className="text-teal-400 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <KitForm />
        <p className="text-slate-500 text-sm mt-4 text-center">
          Zero spam. One email when the guide lands, then weekly tips if you want them. Unsubscribe anytime.
        </p>

      </main>

      {/* Footer nudge */}
      <footer className="border-t border-slate-800 py-8 px-6 mt-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-slate-300 font-semibold text-lg">Ready to Get Started?</p>
          <Link
            href="https://steadystepsmusic.com/#contact"
            className="block border border-teal-500 text-teal-400 hover:bg-teal-500/10 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Book a free lesson
          </Link>
          <Link href="https://steadystepsmusic.com" className="block text-slate-500 text-sm hover:text-slate-400 transition-colors">
            steadystepsmusic.com
          </Link>
        </div>
      </footer>

    </div>
  )
}
