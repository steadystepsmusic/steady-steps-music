import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Nav from '../components/Nav'

export const metadata: Metadata = {
  title: 'Privacy Policy | Steady Steps Music',
  description:
    'Privacy Policy for Steady Steps Music — how we collect, use, and protect your personal information across our website and iOS app.',
  alternates: {
    canonical: 'https://steadystepsmusic.com/privacy',
  },
  robots: {
    index: false,
    follow: true,
  },
}

const privacyHtml = fs.readFileSync(
  path.join(process.cwd(), 'app/privacy/privacy.html'),
  'utf8'
)

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <div className="bg-slate-900 h-16" aria-hidden="true" />
      <main className="bg-white text-slate-900 pt-10 pb-16">
        <div className="mx-auto max-w-3xl px-6 privacy-content">
          <div dangerouslySetInnerHTML={{ __html: privacyHtml }} />
        </div>
      </main>
    </>
  )
}
