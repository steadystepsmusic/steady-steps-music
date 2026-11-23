# Maestro v0 setup (2026-11-23)

Maestro at `/maestro` is now the real teacher app: signed in, real data, Nik as teacher #1.
The clickable prototype with made-up data moved to `/maestro/demo` (and `/maestro/demo/admin`;
the old `/maestro/admin` link redirects).

## How the data flows

```
Google Calendar + Gmail ──> student tracker (Mac, ~/coding/student-tracker)
                                 │  sync_maestro.py, every 15 min (cron)
                                 ▼
                           Supabase (hub)  <──>  Maestro on the phone
                                 │
                                 ▼
             maestro_cache.json ──> "From Maestro" card on the tracker's student page
```

- Tracker owns: roster (name, status, emails, phones), lessons from the calendar, recaps, "working on".
- Maestro owns: per-student teaching details (instrument, level, age, Zoom/in-home, address,
  arrival notes, usual length, parent) and lesson reports (taught/missed, notes, teacher pay).
- Neither side writes the other's columns, so nothing gets overwritten.
- Security: row level security on every table. Only emails in `teachers` see anything. Teachers
  can only change Maestro-owned columns. Schema: `supabase/maestro_schema.sql`.

## Nik's steps (about 10 minutes, one time)

1. **Create the project.** supabase.com > sign in > New project. Name `maestro`, region
   West US (Oregon), free plan. Save the database password in your password manager.
   Do NOT reuse or restore the paused "steadystepsmusic's Project" (us-east-1): that is the
   native app's database (shared with the old PWA), paused for inactivity. Maestro stays
   separate. Paused projects don't count toward the free plan's 2 active projects.
2. **Create the tables.** Left sidebar > SQL Editor > New query > paste all of
   `supabase/maestro_schema.sql` > Run. It should say "Success. No rows returned".
3. **Lock sign-ups.** Authentication > Sign In / Providers > Email: turn OFF
   "Allow new users to sign up". Then Authentication > Users > Add user > Create new user:
   `steadystepsmusic@gmail.com`, any password, check "Auto Confirm User".
4. **Allowed sign-in addresses.** Authentication > URL Configuration.
   - Site URL: `http://localhost:3001/maestro`
   - Redirect URLs, add all three:
     - `http://localhost:3001/**`
     - `http://192.168.1.8:3001/**`
     - `https://steady-steps-music-*.vercel.app/**`
5. **(Skipped 11/23, needs custom SMTP: do with Brevo later)** **Sign-in code in the email** (so it works from a home screen icon). Authentication >
   Emails > Magic Link. Add this line to the body: `<p>Or type this code: {{ .Token }}</p>`
6. **Hand Claude the keys.** Project Settings > API Keys (or "Data API"). Paste the Project URL,
   the anon/publishable key, and the service_role/secret key into the chat. The secret key only
   goes into `~/coding/student-tracker/maestro.json` on the Mac (gitignored), never the website.

## What Claude does after step 6

- Writes `maestro.json` (tracker) and `.env.local` (site), runs the first sync, checks the counts.
- Signs in with a test link and walks every screen at phone size before you touch it.
- Adds the 15-minute cron line for `sync_maestro.py`.
- Asks before adding the two `NEXT_PUBLIC_` keys to the Vercel preview environment and pushing
  the branch (a push redeploys the preview link you share with teachers).

## Known limits in v0

- The Mac has to be awake for new calendar changes to reach Maestro. Maestro shows an amber
  "Your Mac has not synced since..." line when the last sync is over an hour old.
- Messages tab opens your own email/texts. Relay through Maestro is a later build.
- Earnings is an R&D view at the teacher rate ($42/$58/$75 + $15 in-home). Intro pay shows $0
  until you decide whether intros are paid.
- Lesson outcomes do not change the tracker's package counting yet (a "let it go" miss still
  draws down a package there). That is the next data-flow decision.
- Reschedule lives in Google Calendar for now. The calendar is the source of truth.
