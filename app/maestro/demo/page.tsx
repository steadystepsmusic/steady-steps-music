import type { Metadata } from 'next'
import MaestroApp from './MaestroApp'

// PROTOTYPE (2026-11-16): sketch of Maestro, the teacher web app for Phase 2.
// Everything here is made-up data held in the browser. Nothing is saved, no
// email is sent, and no real student or teacher appears. noindex, not in the
// sitemap, not linked from the live site.

export const metadata: Metadata = {
  title: 'Maestro | Steady Steps Music',
  description: 'The Steady Steps Music teacher app.',
  robots: { index: false, follow: false },
}

export default function MaestroPage() {
  return <MaestroApp />
}
