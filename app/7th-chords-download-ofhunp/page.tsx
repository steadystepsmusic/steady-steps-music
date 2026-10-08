import type { Metadata } from 'next'
import SeventhChordsDownload from './SeventhChordsDownload'

export const metadata: Metadata = {
  title: 'Guitar 7th Chord Vocabulary: Steady Steps Music',
  description:
    'Your download of the Guitar 7th Chord Vocabulary. All 21 Major 7th, minor 7th, and Dominant 7th chords on one printable page.',
  robots: { index: false, follow: false },
}

export default function SeventhChordsPurchasedPage() {
  return (
    <SeventhChordsDownload
      eyebrow="Thanks for your purchase"
      description="Here's your chord sheet from the Steady Steps 7th Chords episode. Download it now and bookmark this page in case you need it again. Print it, keep it on your music stand, and work through the three chord types at your own pace."
      emailNote
    />
  )
}
