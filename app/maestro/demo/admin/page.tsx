import type { Metadata } from 'next'
import AdminGate from './AdminGate'

// PROTOTYPE (2026-11-16): sketch of the admin side of Maestro. Made-up data
// held in the browser. It does not share state with the teacher sketch at
// /maestro. noindex, not in the sitemap, not linked from the live site.
// Admin only (2026-11-23): signed-in Maestro admins or the local dev server; anyone
// else is sent to /maestro. See ../useIsAdmin.ts.

export const metadata: Metadata = {
  title: 'Maestro Admin | Steady Steps Music',
  description: 'The Steady Steps Music admin view.',
  robots: { index: false, follow: false },
}

export default function MaestroAdminPage() {
  return <AdminGate />
}
