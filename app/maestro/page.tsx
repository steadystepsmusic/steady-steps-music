import type { Metadata } from 'next'
import LiveApp from './live/LiveApp'

// Maestro v0 (2026-11-23): the real teacher app, signed in, with real data from Supabase.
// Nik is teacher #1 and uses it with his own students to R&D it. The clickable prototype
// with made-up data moved to /maestro/demo. noindex, not in the sitemap, not linked from
// the live site.

export const metadata: Metadata = {
  title: 'Maestro | Steady Steps Music',
  description: 'The Steady Steps Music teacher app.',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Maestro', statusBarStyle: 'black' },
}

export default function MaestroPage() {
  return <LiveApp />
}
