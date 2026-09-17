// Shared site-wide constants. Nav is reused across the city landing pages,
// so shared values live here rather than being repeated per-file.
//
// PHONE_* is intentionally NOT rendered anywhere on the site (2026-09-16).
// Decision: outbound contact only. We collect the prospect's number via the
// optional phone field on the contact form and reach out to them, rather than
// publishing a number that gets scraped. Publishing it on Google Business
// Profile previously produced heavy spam calls, which stopped once it was
// removed. Kept here so the placements can be restored in one commit if that
// ever changes.
export const PHONE_DISPLAY = '(208) 546-9737'
export const PHONE_HREF = 'tel:+12085469737'
// Write-a-review link: for personal asks only, never placed on the public site.
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CZeFRsw-tRznEBM/review'
// Read-only listing link for the public site.
export const GOOGLE_LISTING_URL = 'https://www.google.com/maps/search/?api=1&query=Steady%20Steps%20Music%20Boise%20ID'

export type Review = { name: string; role: string; quote: string }

// Real Google reviews. Gina's is trimmed verbatim with ellipses, never paraphrased.
export const REVIEWS: Review[] = [
  {
    name: 'Gina S.',
    role: 'Google review',
    quote: "Nik has been teaching our boys for approximately 12 years\u2026 He is so very knowledgeable and good at making music fun. Our (now) teenagers don't complain about lessons or practice, because they get to drive where they want to explore, and Nik has been THE BEST teacher.",
  },
  {
    name: 'Brian G.',
    role: 'Google review',
    quote: 'Great teacher, very knowledgeable and patient. Highly recommend.',
  },
  {
    name: 'Beth G.',
    role: 'Google review',
    quote: '',
  },
]

export type Faq = { q: string; a: string }

// Single source of truth. Rendered on the homepage and every city page, AND
// used to generate the FAQPage JSON-LD in layout.tsx. Google requires the
// structured data to match the visible copy, so never edit one without the
// others -- that is why this lives here instead of being duplicated per file.
export const FAQS: Faq[] = [
  {
    q: 'What happens in the free lesson?',
    a: "It's about 15 minutes, over Zoom. I'll ask what you want to play and where you're starting from, you can ask me anything, and we'll figure out together whether I'm the right teacher for you. Nothing to prepare and no obligation to sign up after.",
  },
  {
    q: 'What ages do you teach?',
    a: "I teach from about 4th grade on up, including plenty of adults who are starting later than they wish they had. If your child is younger, reach out anyway and we'll talk about whether they're ready.",
  },
  {
    q: 'Do I need any prior experience?',
    a: 'No. Most of my students started with none. Beginning from scratch is an advantage, because we get to build the right habits before any bad ones set in. I also work with players who have hit a plateau and want a way through it.',
  },
  {
    q: "What if my child doesn't want to practice?",
    a: "That usually means the music isn't theirs yet. When a student picks what they're working on, practice stops feeling like a chore. I build lessons around what they actually want to play, and that's what keeps them coming back.",
  },
  {
    q: 'How do online lessons work?',
    a: 'We meet on Zoom. After each lesson I send you a summary of what we covered and what to practice, plus any chord charts or sheet music you need.',
  },
  {
    q: 'How often should I take lessons?',
    a: "Once a week works best for most students. It gives you enough time to practice between sessions without losing momentum. That said, I'm flexible, and we can work out what fits your schedule.",
  },
  {
    q: 'Can I cancel or reschedule?',
    a: 'Life happens. I ask for at least 24 hours notice to reschedule or cancel. Lessons cancelled with less than 24 hours notice may be charged in full.',
  },
]
