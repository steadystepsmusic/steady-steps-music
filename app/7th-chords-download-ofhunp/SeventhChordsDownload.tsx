import Image from 'next/image'
import { TabHeader, TabCta } from '../tab/TabShell'

const PDF_URL = '/downloads/ssm-7th-chords-jr289yin.pdf'

const bullets = [
  'Twenty-one 7th chords, A through G, in Major 7th, minor 7th, and Dominant 7th',
  'Finger numbers on every diagram, barre shapes marked',
  'Moveable shapes flagged so you can slide them anywhere on the neck',
  'The formula for each chord type, right at the top of the page',
]

// Shared by the paid download page (Stripe redirects here after checkout)
// and the free page linked from the YouTube 7th Chords episode description.
export default function SeventhChordsDownload({
  eyebrow,
  description,
  emailNote = false,
}: {
  eyebrow: string
  description: string
  emailNote?: boolean
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <TabHeader
        eyebrow={eyebrow}
        title="Guitar 7th Chord Vocabulary"
        description={description}
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
          <p className="text-slate-400 text-sm mt-4">
            On iPhone or iPad, the PDF opens in a new screen. Tap Share, then Save to Files to keep it.
          </p>
          {emailNote && <p className="text-slate-400 text-sm mt-1">A copy is also on its way to your email.</p>}
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
          <p className="text-white font-bold text-lg mb-2">Quick reminder from the video</p>
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
