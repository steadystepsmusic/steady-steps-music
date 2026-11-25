import { createClient } from '@supabase/supabase-js'
import { randomInt } from 'crypto'

// Admin adds a teacher from Maestro's Admin tab (Nik, 2026-11-25: no trips into Supabase).
// Puts them on the teacher list AND creates their sign-in with a temporary password, which
// comes back once so it can go in the welcome email. Only a signed-in Maestro admin can call
// it. Needs SUPABASE_SERVICE_ROLE_KEY in the Vercel env (server only, never NEXT_PUBLIC).

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789' // no 0/O, 1/l/I
const tempPassword = () => Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return Response.json({ error: 'not_configured' }, { status: 503 })
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const { data: who } = token ? await db.auth.getUser(token) : { data: { user: null } }
  const callerEmail = who.user?.email
  if (!callerEmail) return Response.json({ error: 'Sign in again.' }, { status: 401 })
  const { data: caller } = await db.from('teachers').select('is_admin').ilike('email', callerEmail).maybeSingle()
  if (!caller?.is_admin) return Response.json({ error: 'Only an admin can add teachers.' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: 'A teacher needs a name and an email.' }, { status: 400 })
  }

  const { error: listErr } = await db.from('teachers').upsert({ name, email }, { onConflict: 'email' })
  if (listErr) return Response.json({ error: listErr.message }, { status: 500 })

  // A sign-in that already exists keeps its password; the admin just resends the link
  const password = tempPassword()
  const { error: authErr } = await db.auth.admin.createUser({ email, password, email_confirm: true })
  if (authErr) {
    if (/already|registered|exists/i.test(authErr.message)) return Response.json({ ok: true, existing: true })
    return Response.json({ error: authErr.message }, { status: 500 })
  }
  return Response.json({ ok: true, password })
}
