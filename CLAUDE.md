# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Strategic context (load before significant changes)

This site has **two jobs**, and as of the 2026-05-26 strategy update the second one is rising in priority:

1. Convert visitors to **lesson bookings** (the in-person/local lesson business — current revenue)
2. Convert visitors to **Steady Steps app installs** (the long-term internet-money pillar — see `~/.claude/plans/steady-steps-app-strategy.md`)

The app is meant to overtake lessons as Nik's largest income leg. That makes this site the **top of the app's funnel** — every page should consider whether it routes traffic toward the app, not just toward lesson bookings. When proposing changes, ask which of the two jobs the change serves; if it serves neither, push back.

Related memory pointers: `~/.claude/projects/-Users-nikmathews/memory/project_marketing_site.md`, `~/.claude/projects/-Users-nikmathews/memory/project_student_app.md`.

## Commands

```bash
npm run dev      # Start local dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is set up.

## Architecture

Two sites served from one Next.js deployment on Vercel:
- **steadystepsmusic.com** — music lessons marketing site
- **nikmathewsmusic.com** — solo performer promo page (routed via `proxy.ts`)

**Main page (`app/page.tsx`)** — one large file containing section data (lessons, pricing) as inline arrays at the top (reviews, FAQs, and shared constants like `OG_IMAGE` live in `app/site.ts`), followed by the full page JSX. Sections are: Hero → About → Lessons → How It Works → Pricing → Testimonials → FAQ → Contact → Footer. All sections anchor-link from the nav.

**Components (`app/components/`):**
- `Nav.tsx` — fixed sticky nav, transparent until scrolled 20px, collapses to hamburger on mobile. `'use client'`.
- `ContactForm.tsx` — contact/booking form. Posts JSON to Web3Forms (key `72672cac`), then redirects to `/thank-you`. `'use client'`.
- `CityPage.tsx` — shared layout for the 7 city landing pages (`app/meridian`, `eagle`, etc.).

**Song requests page (`app/requests/`):**
- `page.tsx` — server component wrapper with metadata
- `RequestsClient.tsx` — searchable setlist + request form, posts to Web3Forms (key `697211a3`). `'use client'`.
- `songs.ts` — flat array of `{ title, artist }` objects. Single source of truth — also imported by the promo page.

**Nik Mathews promo page (`app/nik-mathews/`):**
- `page.tsx` — standalone page, no nav/footer from main site. Black/gold branding. Indexed by Google (canonical www.nikmathewsmusic.com, noindex removed 2026-10-02). Booking form fires GA4 `booking_inquiry`, never `generate_lead` (that event is the Google Ads lesson conversion). Imports songs from `../requests/songs`.
- `BookingForm.tsx` — booking inquiry form, posts to Web3Forms (key `babdd6d6`). `'use client'`.
- Accessible at steadystepsmusic.com/nik-mathews and nikmathewsmusic.com (via proxy)

**Domain routing (`proxy.ts`):**
- Detects hostname `nikmathewsmusic.com` / `www.nikmathewsmusic.com` and rewrites `/` to `/nik-mathews`
- nikmathewsmusic.com is added as a second custom domain in Vercel

**Styling:** Tailwind v4 (imported via `@import "tailwindcss"` in `globals.css`). Color palette: slate-900 dark sections, white/slate-50 light sections, teal-400 brand accent on dark sections, teal-700 for teal text on light sections (teal-600 fails contrast on white), amber-500 CTA buttons. Promo page uses its own inline styles with black (#0a0a0a) and gold (#c9a84c).

## External integrations

All forms use **Web3Forms** (no Formspree anywhere). Access keys are public by design and live in client code.
- **Web3Forms `72672cac`** — lesson contact form + student policy acknowledgment → steadystepsmusic@gmail.com. The lead email triggers the Zapier SMS + auto-reply zap.
- **Web3Forms `697211a3`** — song request forms → zapiermail → Zapier SMS to Nik
- **Web3Forms `babdd6d6`** — promo page booking form → nikmathewsmusic@gmail.com (subject: "Booking Inquiry | Nik Mathews")
- **Brevo** — `app/api/subscribe` adds free-guide signups to a Brevo list (`BREVO_API_KEY` env var)
- **Vercel** — deployment (push to main auto-deploys). Both domains point to same deployment.
- Images served from `public/images/`

## Content notes

- Testimonials are real Google reviews, stored in `REVIEWS` in `app/site.ts`. Never paraphrase them.
- Pages that set their own `openGraph` metadata must include `images: [OG_IMAGE]`, because Next.js replaces the layout's openGraph object instead of merging it.
- Social links (Instagram + Facebook) are already wired in the footer
- The `business-card.html` file in the root is a standalone HTML file for print design, unrelated to the Next.js app
