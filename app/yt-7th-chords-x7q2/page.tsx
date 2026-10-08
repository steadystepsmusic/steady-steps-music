import type { Metadata } from 'next'
import SeventhChordsDownload from '../7th-chords-download-ofhunp/SeventhChordsDownload'

// Linked from the YouTube 7th Chords episode description, which promises a free download.
// Everyone else buys it at /7th-chords.
export const metadata: Metadata = {
  title: 'Guitar 7th Chord Vocabulary: Steady Steps Music',
  description:
    'Free download for viewers of the Steady Steps 7th Chords episode. All 21 Major 7th, minor 7th, and Dominant 7th chords on one printable page.',
  robots: { index: false, follow: false },
}

export default function SeventhChordsYouTubePage() {
  return (
    <SeventhChordsDownload
      eyebrow="Free for YouTube viewers"
      description="Thanks for watching the Steady Steps 7th Chords episode. Here's the chord sheet from the video. Print it, keep it on your music stand, and work through the three chord types at your own pace."
    />
  )
}
