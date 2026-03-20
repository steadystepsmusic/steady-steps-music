# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**Main page (`app/page.tsx`)** — one large file containing all section data (lessons, pricing, testimonials, FAQs) as inline arrays at the top, followed by the full page JSX. Sections are: Hero → About → Lessons → How It Works → Pricing → Testimonials → FAQ → Contact → Footer. All sections anchor-link from the nav.

**Components (`app/components/`):**
- `Nav.tsx` — fixed sticky nav, transparent until scrolled 20px, collapses to hamburger on mobile. `'use client'`.
- `ContactForm.tsx` — contact/booking form. Posts JSON to Formspree endpoint `maqplgrl`. `'use client'`.

**Song requests page (`app/requests/`):**
- `page.tsx` — server component wrapper with metadata
- `RequestsClient.tsx` — searchable setlist + request form, posts to Formspree endpoint `xjgapnjy`. `'use client'`.
- `songs.ts` — flat array of `{ title, artist }` objects. Single source of truth — also imported by the promo page.

**Nik Mathews promo page (`app/nik-mathews/`):**
- `page.tsx` — standalone page, no nav/footer from main site. Black/gold branding. noindex/nofollow. Imports songs from `../requests/songs`.
- `BookingForm.tsx` — booking inquiry form, posts to Formspree `xjgazbee`. `'use client'`.
- Accessible at steadystepsmusic.com/nik-mathews and nikmathewsmusic.com (via proxy)

**Domain routing (`proxy.ts`):**
- Detects hostname `nikmathewsmusic.com` / `www.nikmathewsmusic.com` and rewrites `/` to `/nik-mathews`
- nikmathewsmusic.com is added as a second custom domain in Vercel

**Styling:** Tailwind v4 (imported via `@import "tailwindcss"` in `globals.css`). Color palette: slate-900 dark sections, white/slate-50 light sections, teal-400/600 brand accent, amber-500 CTA buttons. Promo page uses its own inline styles with black (#0a0a0a) and gold (#c9a84c).

## External integrations

- **Formspree `maqplgrl`** — contact form → steadystepsmusic@gmail.com
- **Formspree `xjgapnjy`** — song request form → triggers Zapier SMS to Nik
- **Formspree `xjgazbee`** — promo page booking form → steadystepsmusic@gmail.com (subject: "Booking Inquiry — Nik Mathews")
- **Vercel** — deployment (push to main auto-deploys). Both domains point to same deployment.
- Images served from `public/images/`

## Content notes

- Testimonials in `app/page.tsx` are currently placeholder — real ones to be added
- Social links (Instagram + Facebook) are already wired in the footer
- The `business-card.html` file in the root is a standalone HTML file for print design, unrelated to the Next.js app
- Promo page video embed is a placeholder — swap `WVxCpbQP9YQ` in `app/nik-mathews/page.tsx` for real video ID when ready
