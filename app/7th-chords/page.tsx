import type { Metadata } from 'next'
import Image from 'next/image'
import { TabHeader, TabCta } from '../tab/TabShell'

export const metadata: Metadata = {
  title: 'Guitar 7th Chord Vocabulary PDF | Steady Steps Music',
  description:
    'All 21 Major 7th, minor 7th, and Dominant 7th guitar chords on one printable page, with finger numbers, barre shapes, and moveable shapes marked.',
  alternates: { canonical: 'https://steadystepsmusic.com/7th-chords' },
}

// Stripe Payment Link. After payment Stripe redirects to /7th-chords-download-ofhunp
const CHECKOUT_URL = 'https://buy.stripe.com/bJe5kvgXueni0J6fb11RC0g'
const PRICE = '$5'

const bullets = [
  'Twenty-one 7th chords, A through G, in Major 7th, minor 7th, and Dominant 7th',
  'Finger numbers on every diagram, barre shapes marked',
  'Moveable shapes flagged so you can slide them anywhere on the neck',
  'The formula for each chord type, right at the top of the page',
]

function BuyButton() {
  return (
    <a
      href={CHECKOUT_URL}
      className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors no-underline"
    >
      Get the PDF for {PRICE}
    </a>
  )
}

export default function SeventhChordsSalesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TabHeader
        eyebrow="Printable chord sheet"
        title="Guitar 7th Chord Vocabulary"
        description="The one-page chord sheet from the Steady Steps 7th Chords episode. Every Major 7th, minor 7th, and Dominant 7th chord from A to G, ready to print and keep on your music stand."
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-[3/2]">
          <Image
            src="/images/hero.jpeg"
            alt="Acoustic and electric guitars"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="text-center mt-10">
          <BuyButton />
          <p className="text-slate-400 text-sm mt-4">Instant download after checkout. Secure payment through Stripe.</p>
        </div>

        <ul className="space-y-3 mt-12 max-w-xl mx-auto">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-slate-300 text-lg">
              <span className="text-teal-400 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mt-12 text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
          <p className="text-white font-bold text-lg mb-2">Who it&apos;s for</p>
          <p>
            You know your open chords and want the next layer of color. Learn one family at a time,
            hear how each one changes the mood, and start spotting these chords in the songs you already love.
          </p>
        </div>
      </div>

      <TabCta body="Want help working these chords into real songs? Book a free 15-minute lesson and we'll work through them together." />
    </div>
  )
}
