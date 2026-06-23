import type { Metadata } from 'next'
import PayClient from './PayClient'

export const metadata: Metadata = {
  title: 'Book Your Lessons — Steady Steps Music',
  robots: { index: false, follow: false },
}

export default function PayPage() {
  return <PayClient />
}
