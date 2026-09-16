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
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CZeFRsw-tRznEBM/review'

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
