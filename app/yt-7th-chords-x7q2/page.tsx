import type { Metadata } from 'next'
import Image from 'next/image'
import { TabHeader, TabCta } from '../tab/TabShell'

export const metadata: Metadata = {
  title: 'Guitar 7th Chord Vocabulary: Steady Steps Music',
  description:
    'Free download for viewers of the Steady Steps 7th Chords episode. All 21 Major 7th, minor 7th, and Dominant 7th chords on one printable page.',
  robots: { index: false, follow: false },
}

const PDF_URL = '/downloads/ssm-7th-chords-x7q2mn.pdf'

const bullets = [
  '21 7th chords: A through G as Major 7th, minor 7th, and Dominant 7th',
  'Finger numbers on every diagram, barre shapes marked',
  'Moveable shapes flagged so you can slide them anywhere on the neck',
  'The formula for each chord type, right at the top of the page',
]

export default function SeventhChordsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TabHeader
        eyebrow="Free download for YouTube viewers"
        title="Guitar 7th Chord Vocabulary"
        description="The one-page chord sheet from the Steady Steps 7th Chords episode. Print it, keep it on your music stand, and work through the three chord types at your own pace."
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <a
          href={PDF_URL}
          download="Guitar 7th Chord Vocabulary - Steady Steps Music.pdf"
          className="block rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-colors shadow-2xl"
        >
          <Image
            src="/images/7th-chords-preview.jpg"
            alt="Preview of the Guitar 7th Chord Vocabulary sheet, 21 chord diagrams on one page"
            width={1650}
            height={1275}
            className="w-full h-auto"
            priority
          />
        </a>

        <div className="text-center mt-8">
          <a
            href={PDF_URL}
            download="Guitar 7th Chord Vocabulary - Steady Steps Music.pdf"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-base transition-colors no-underline"
          >
            Download the PDF
          </a>
        </div>

        <ul className="space-y-3 mt-12 max-w-xl mx-auto">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-slate-300 text-base">
              <span className="text-teal-400 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mt-12 text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
          <p className="text-white font-bold mb-2">Quick reminder from the video</p>
          <p>
            Find the 7th from the octave, the higher root. A half step below is the Major 7th.
            A whole step below is the minor 7th. A plain letter and a 7, like G7, is always a Dominant 7th:
            Major triad, minor 7th, and lots of tension.
          </p>
        </div>
      </div>

      <TabCta />
    </div>
  )
}
