'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Avatar, Btn, Chips, Choice, Label, Sheet, Stairs, Tag, pill } from '../ui'
import {
  supabase, loadAll, lessonPay, lessonMinutes, inHome as isInHome,
  type Data, type Lesson, type Money, type Outcome, type Rate, type Report, type Student, type StudentDetails, type Teacher,
} from './data'

// Maestro v0, real data (2026-11-23). Same design rules as the prototype (Nik, 2026-11-16):
// - Phone first. About 90% of use is on a phone.
// - Everything clickable is a pill. Only actions are filled (black, or amber for the one
//   main action on a screen). Other clickable things are outlined.
// - Status labels are square tags, never pills. Panels close with "Done".
// - No line of text should wrap by accident on a phone.
// What is real: Home, Finish lesson, Students (+ details, notes, recaps), Earnings at the
// teacher rate. Messages through Maestro come later; that tab opens your own email/texts.

type Tab = 'home' | 'students' | 'earnings' | 'messages' | 'admin'
type Overlay =
  | { kind: 'finish'; lessonId: string }
  | { kind: 'edit'; studentId: string }
  | { kind: 'contact'; studentId: string }
  | { kind: 'me' }
  | { kind: 'welcome' }
  | null
type MapsApp = 'Apple Maps' | 'Google Maps'
// Nik doesn't use Apple Mail (2026-11-24): the first Email tap asks which app, then it sticks.
// Texts can open in Google Voice, which has no link to a specific thread, so the number is
// copied too. Both are saved per teacher, like maps.
const MAIL_APPS = ['Gmail', 'Apple Mail', 'Outlook', 'Spark', 'Yahoo Mail'] as const
type MailApp = typeof MAIL_APPS[number]
type TextApp = 'Messages' | 'Google Voice'

const INSTRUMENTS = ['Guitar', 'Bass', 'Piano', 'Voice', 'Ukulele', 'Banjo', 'Songwriting']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const AGES = ['Kid', 'Teen', 'Adult']
const MAPS_KEY = 'maestro-maps'
const MAIL_KEY = 'maestro-mail'
const TEXT_KEY = 'maestro-text'

const money = (n: number) => `$${Number(n).toFixed(2)}`
const time = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const shortDay = (iso: string) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const monthDay = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const dayKey = (d: Date) => d.toDateString()
const localIso = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
// What this lesson pays at 100%: the price of the payment box it falls in, else the package rate
const priceOf = (l: Lesson, r?: Rate) => (r ? r.by_date?.[localIso(l.starts_at)] ?? Number(r.lesson_rate) : undefined)
function dayLabel(iso: string, now: Date) {
  const d = new Date(iso)
  if (dayKey(d) === dayKey(now)) return 'Today'
  const t = new Date(now); t.setDate(t.getDate() + 1)
  if (dayKey(d) === dayKey(t)) return 'Tomorrow'
  return shortDay(iso)
}
function ago(iso: string, now: Date) {
  const m = Math.round((now.getTime() - new Date(iso).getTime()) / 60000)
  if (m < 2) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  return h < 24 ? `${h} hr ago` : monthDay(iso)
}
const directions = (s: Student, app: MapsApp) => {
  const dest = encodeURIComponent([s.street, s.city].filter(Boolean).join(', '))
  return app === 'Apple Maps' ? `https://maps.apple.com/?daddr=${dest}` : `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}
const onPhone = () => typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const mailHref = (app: MailApp, to: string) => {
  const e = encodeURIComponent(to)
  switch (app) {
    case 'Gmail': return onPhone() ? `googlegmail:///co?to=${e}` : `https://mail.google.com/mail/?view=cm&to=${e}`
    case 'Outlook': return onPhone() ? `ms-outlook://compose?to=${e}` : `https://outlook.live.com/mail/0/deeplink/compose?to=${e}`
    case 'Spark': return `readdle-spark://compose?recipient=${e}`
    case 'Yahoo Mail': return `ymail://mail/compose?to=${e}`
    default: return `mailto:${to}`
  }
}
const e164 = (p: string) => { const d = p.replace(/\D/g, ''); return d.length === 10 ? `+1${d}` : `+${d}` }
// Google Voice threads are addressed by number on voice.google.com; on the iPhone the app picks
// the link up when it's installed. The number is copied as a backup either way.
const voiceHref = (p: string) => `https://voice.google.com/u/0/messages?itemId=t.${encodeURIComponent(e164(p))}`
const who = (s: Student) => (s.contact_label ? s.contact_label.replace(/^Parent:\s*/i, '') : s.name)
const sub = (s: Student, minutes?: number) => [s.instrument ?? s.inquiry_instrument, minutes ? `${minutes} min` : s.default_minutes ? `${s.default_minutes} min` : null].filter(Boolean).join(' · ')
const missingDetails = (s: Student) => !s.instrument || !s.format

// ---------- Theme ----------

type Theme = 'Light' | 'Dark' | 'Match phone'
const THEME_KEY = 'maestro-theme'

function useTheme(): [Theme, (t: Theme, fromAccount?: boolean) => void] {
  const [theme, setThemeState] = useState<Theme>('Light')
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null
      if (saved === 'Dark' || saved === 'Match phone') setTimeout(() => setThemeState(saved), 0)
    } catch { /* private mode: stay light */ }
  }, [])
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('maestro-dark', theme === 'Dark' || (theme === 'Match phone' && mq.matches))
    apply()
    mq.addEventListener('change', apply)
    return () => { mq.removeEventListener('change', apply); document.documentElement.classList.remove('maestro-dark') }
  }, [theme])
  const setTheme = (t: Theme, fromAccount = false) => {
    setThemeState(t)
    try { localStorage.setItem(THEME_KEY, t) } catch { /* private mode */ }
    if (!fromAccount) savePref('theme', t)
  }
  return [theme, setTheme]
}

// Preferences are saved to the teacher's account too (Nik browses in private mode, where the
// browser forgets them). Each save sends the whole prefs object; a teacher can change only this.
let accountPrefs: { id: string; prefs: Record<string, string> } | null = null
function savePref(key: string, value: string) {
  if (!accountPrefs || !supabase) return
  accountPrefs.prefs = { ...accountPrefs.prefs, [key]: value }
  supabase.from('teachers').update({ prefs: accountPrefs.prefs }).eq('id', accountPrefs.id).then(() => {})
}

// ---------- Gate: config, sign in, teacher check ----------

export default function LiveApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [theme, setTheme] = useTheme()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return <Shell><Empty title="Maestro is not connected yet" text="The Supabase keys are missing from this build. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy." /></Shell>
  }
  if (session === undefined) return <Shell><p className="text-center text-slate-600 py-16">Loading…</p></Shell>
  if (!session) return <SignIn />
  return <TeacherGate session={session} theme={theme} setTheme={setTheme} />
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="maestro-keep bg-slate-900">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center gap-3">
          <Stairs />
          <div className="leading-tight">
            <div className="text-white font-black text-xl tracking-tight">Maestro</div>
            <div className="text-slate-400 text-[11px] font-medium -mt-0.5 whitespace-nowrap">Steady Steps Music</div>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto px-5 pt-10 pb-16">{children}</main>
    </div>
  )
}

// Email + password first: it works from a home-screen icon and needs no email. The emailed
// link or code stays as the backup for a forgotten password (Nik, 2026-11-23).
function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return 'That email and password do not match.'
  if (/security purposes|rate limit|too many/i.test(message)) return 'Too many sign-in emails in a short time. Use the newest email you already got, or wait a few minutes and try again.'
  if (/signups not allowed/i.test(message)) return 'That email is not set up for Maestro.'
  return message
}

function SignIn() {
  const [mode, setMode] = useState<'password' | 'link' | 'sent'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const field = 'w-full min-h-12 rounded-full border-2 border-slate-300 focus:border-teal-500 outline-none px-5 text-slate-900'
  const standalone = useStandalone()

  async function withPassword(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setError(friendly(error.message))
  }

  async function withPasskey() {
    setBusy(true); setError(null)
    const { error } = await supabase!.auth.signInWithPasskey()
    setBusy(false)
    if (error && !/abort|cancel|not allowed/i.test(error.message)) setError('Passkey sign-in did not work. Use your password, then set up the passkey again under your profile.')
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase!.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/maestro` },
    })
    setBusy(false)
    if (error) setError(friendly(error.message))
    else setMode('sent')
  }

  async function useCode(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase!.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' })
    setBusy(false)
    if (error) setError('That code did not work. Codes expire after an hour, so ask for a new one if it is old.')
  }

  return (
    <Shell>
      <h1 className="text-2xl font-black text-slate-900">Sign in</h1>
      {mode === 'password' && (
        <div className="mt-5">
          <Btn kind="action" className="w-full" disabled={busy} onClick={withPasskey}>Sign in with a passkey</Btn>
          <div className="flex items-center gap-3 my-6 text-xs font-bold uppercase tracking-widest text-slate-400"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
        </div>
      )}
      {mode === 'password' && (
        <form onSubmit={withPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className={field} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={field} />
          </div>
          <button type="submit" disabled={busy || !email.trim() || !password} className={pill('primary', 'w-full')}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <div className="pt-2 text-center">
            <Btn onClick={() => { setMode('link'); setError(null) }}>Forgot it? Email me a link</Btn>
          </div>
        </form>
      )}
      {mode === 'link' && (
        <form onSubmit={sendLink} className="mt-5 space-y-4">
          <label className="block text-sm font-bold text-slate-900" htmlFor="email">Your email</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className={field} />
          {standalone && <p className="text-sm text-slate-600 text-pretty">From the home-screen app, an emailed link opens in Safari instead of here. Sign in once in Safari, set a password under your profile, then use that password here.</p>}
          <button type="submit" disabled={busy || !email.trim()} className={pill('primary', 'w-full')}>{busy ? 'Sending…' : 'Email me a sign-in link'}</button>
          <div className="text-center"><Btn onClick={() => { setMode('password'); setError(null) }}>Back to password</Btn></div>
        </form>
      )}
      {mode === 'sent' && (
        <div className="mt-5 space-y-5">
          <p className="text-slate-700 text-pretty">Check your email and tap the link in it. If the email has a code, you can type it here instead.</p>
          <form onSubmit={useCode} className="space-y-4">
            <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="Code" aria-label="Sign-in code" maxLength={8}
              className={`${field} tracking-widest text-center text-lg`} />
            <button type="submit" disabled={busy || code.length < 6} className={pill('primary', 'w-full')}>Sign in</button>
          </form>
          <Btn onClick={() => { setMode('password'); setCode(''); setError(null) }}>Back to password</Btn>
        </div>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-red-700 text-pretty" role="alert">{error}</p>}
      <p className="mt-10 text-sm text-slate-600 text-pretty">Teaching for Steady Steps soon? <a href="/maestro/demo" className="font-bold text-teal-700 underline">See the demo</a></p>
    </Shell>
  )
}

function TeacherGate({ session, theme, setTheme }: { session: Session; theme: Theme; setTheme: (t: Theme, fromAccount?: boolean) => void }) {
  const [teacher, setTeacher] = useState<Teacher | null | undefined>(undefined)
  useEffect(() => {
    supabase!.from('teachers').select('*').ilike('email', session.user.email ?? '').maybeSingle()
      .then(({ data }) => {
        const t = (data as Teacher) ?? null
        if (t) {
          accountPrefs = { id: t.id, prefs: (t.prefs ?? {}) as Record<string, string> }
          const saved = t.prefs?.theme
          if (saved === 'Light' || saved === 'Dark' || saved === 'Match phone') setTheme(saved, true)
        }
        setTeacher(t)
      })
  }, [session]) // eslint-disable-line react-hooks/exhaustive-deps
  if (teacher === undefined) return <Shell><p className="text-center text-slate-600 py-16">Loading…</p></Shell>
  if (!teacher) {
    return (
      <Shell>
        <Empty title="Not set up as a teacher" text={`${session.user.email} can sign in, but it is not on the teacher list yet.`} />
        <Btn className="mt-5" onClick={() => supabase!.auth.signOut()}>Sign out</Btn>
      </Shell>
    )
  }
  return <App teacher={teacher} theme={theme} setTheme={setTheme} />
}

// ---------- App ----------

function App({ teacher, theme, setTheme }: { teacher: Teacher; theme: Theme; setTheme: (t: Theme, fromAccount?: boolean) => void }) {
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [data, setData] = useState<Data | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [toast, setToast] = useState<string | null>(null)
  const [openStudent, setOpenStudent] = useState<string | null>(null)
  const [maps, setMapsState] = useState<MapsApp>('Apple Maps')
  const [mail, setMailState] = useState<MailApp | null>(null)
  const [text, setTextState] = useState<TextApp>('Messages')
  // Admin only: see Maestro exactly as one teacher sees it (their students, their pay, no
  // contact info). Read-only, so nothing gets saved under the wrong person.
  const [viewAs, setViewAs] = useState<Teacher | null>(null)
  const me: Teacher = viewAs ? { ...viewAs, is_admin: false } : teacher
  const close = () => setOverlay(null)

  const refresh = useCallback(async () => {
    try {
      setData(await loadAll(supabase!))
      setLoadError(false)
    } catch {
      setLoadError(true)
    }
    setNow(new Date())
  }, [])

  useEffect(() => {
    const first = setTimeout(refresh, 0)
    let savedMaps = teacher.prefs?.maps
    try { savedMaps = savedMaps ?? localStorage.getItem(MAPS_KEY) ?? undefined } catch { /* private mode */ }
    if (savedMaps === 'Google Maps') setTimeout(() => setMapsState('Google Maps'), 0)
    let savedMail = teacher.prefs?.mail, savedText = teacher.prefs?.text
    try {
      savedMail = savedMail ?? localStorage.getItem(MAIL_KEY) ?? undefined
      savedText = savedText ?? localStorage.getItem(TEXT_KEY) ?? undefined
    } catch { /* private mode */ }
    if (savedMail && (MAIL_APPS as readonly string[]).includes(savedMail)) setTimeout(() => setMailState(savedMail as MailApp), 0)
    if (savedText === 'Google Voice') setTimeout(() => setTextState('Google Voice'), 0)
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => { clearTimeout(first); clearInterval(t) }
  }, [refresh, teacher])

  // Coming back to the app re-reads the data, but never while a panel is open (no surprise
  // changes mid-task; Nik disliked the tracker's old auto-reload)
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible' && !overlay) refresh() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [overlay, refresh])

  // First sign-in: a short welcome for a new teacher, once (saved to their account)
  useEffect(() => {
    if (!teacher.is_admin && !teacher.prefs?.welcomed) setTimeout(() => setOverlay({ kind: 'welcome' }), 0)
  }, [teacher])
  const finishWelcome = () => { if (!viewAs && !teacher.is_admin) savePref('welcomed', new Date().toISOString()); close() }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const setMail = (m: MailApp) => { setMailState(m); try { localStorage.setItem(MAIL_KEY, m) } catch { /* private mode */ } savePref('mail', m) }
  const setText = (t: TextApp) => { setTextState(t); try { localStorage.setItem(TEXT_KEY, t) } catch { /* private mode */ } savePref('text', t) }
  const setMaps = (m: MapsApp) => { setMapsState(m); try { localStorage.setItem(MAPS_KEY, m) } catch { /* private mode */ } savePref('maps', m) }

  const allStudents = useMemo(() => data?.students ?? [], [data])
  // A teacher's data is already limited to their students by the database; viewing as one
  // applies the same filter to the admin's data
  const students = useMemo(() => (viewAs ? allStudents.filter(s => s.teacher_id === viewAs.id) : allStudents), [allStudents, viewAs])
  const byId = useMemo(() => Object.fromEntries(students.map(s => [s.id, s])), [students])
  // Students lists active students only (Nik, 2026-11-24: paused Tatum "shouldn't be there").
  // Intro prospects show on Home for their lesson, but join Students only once they're on the roster.
  const roster = useMemo(() => students.filter(s => s.status === 'active'), [students])
  // One card per account; a sibling on the same block counts as a student (Brock + Teller)
  const studentCount = useMemo(() => roster.reduce((n, s) => n + 1 + (s.family_names?.length ?? 0), 0), [roster])
  const reportFor = useMemo(() => Object.fromEntries((data?.reports ?? []).map(r => [r.lesson_id, r])), [data])
  const lessons = useMemo(() => (data?.lessons ?? []).filter(l => byId[l.student_id]), [data, byId])

  // Only lessons from the day this teacher started on Maestro ask to be wrapped up. Older ones
  // were already handled outside it (Nik's first day showed 34 of them, 2026-11-23).
  const startedOn = new Date(me.created_at); startedOn.setHours(0, 0, 0, 0)
  const wrapUp = lessons.filter(l => new Date(l.ends_at) <= now && !reportFor[l.id] && new Date(l.starts_at) >= startedOn && now.getTime() - new Date(l.starts_at).getTime() < 21 * 864e5)
  const weekAhead = new Date(now); weekAhead.setDate(weekAhead.getDate() + 7)
  const upcoming = lessons.filter(l => new Date(l.ends_at) > now && new Date(l.starts_at) < weekAhead)
  const days = [...new Set(upcoming.map(l => dayLabel(l.starts_at, now)))]
  const needDetails = students.filter(s => s.status === 'active' && missingDetails(s))

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const reports = data?.reports ?? []
  const thisMonth = reports.filter(r => new Date(r.lesson_starts_at) >= monthStart)
  const lastMonth = reports.filter(r => new Date(r.lesson_starts_at) >= lastMonthStart && new Date(r.lesson_starts_at) < monthStart)
  const sum = (rs: Report[]) => rs.reduce((a, r) => a + Number(r.teacher_pay), 0)
  const monthName = now.toLocaleDateString('en-US', { month: 'long' })

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const syncOld = data?.syncedAt ? now.getTime() - new Date(data.syncedAt).getTime() > 60 * 60000 : true

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'home', label: 'Home', badge: wrapUp.length },
    { id: 'students', label: 'Students' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'messages', label: 'Messages' },
    ...(teacher.is_admin && !viewAs ? [{ id: 'admin' as Tab, label: 'Admin' }] : []),
  ]

  const rateOf = useMemo(() => Object.fromEntries((data?.rates ?? []).map(r => [r.id, r])), [data])
  // The owner keeps 100% (Nik, 2026-11-23: "i'm the 100% because im the owner"); teachers see their card pay
  const payFor = (l: Lesson) => {
    const base = lessonPay(l, byId[l.student_id])
    if (!me.is_admin) return base
    return { ...base, pay: l.is_intro ? 0 : priceOf(l, rateOf[l.student_id]) ?? 0 }
  }

  const previewOnly = () => { setToast(`Preview only. Switch back to your own view to change anything.`); return viewAs !== null }

  async function submitReport(l: Lesson, outcome: Outcome, notes: string) {
    if (viewAs && previewOnly()) return false
    const { minutes, pay } = payFor(l)
    const row = {
      lesson_id: l.id, student_id: l.student_id, lesson_starts_at: l.starts_at, outcome,
      notes: notes.trim() || null, minutes, teacher_pay: outcome === 'waive' ? 0 : pay,
      submitted_by: me.id, updated_at: new Date().toISOString(),
    }
    const { error } = await supabase!.from('lesson_reports').upsert(row, { onConflict: 'lesson_id' })
    if (error) { setToast('Not saved. Check your connection and try again.'); return false } // the panel stays open, nothing is lost
    const was = reportFor[l.id]
    close()
    setToast(was ? 'Lesson updated.' : outcome === 'waive' ? 'Submitted. The student keeps the lesson.' : `Submitted. ${money(row.teacher_pay)} for this lesson.`)
    refresh()
    return true
  }

  async function saveDetails(s: Student, d: StudentDetails) {
    if (viewAs && previewOnly()) return
    const { error } = await supabase!.from('students').update({ ...d, maestro_updated_at: new Date().toISOString() }).eq('id', s.id)
    if (error) { setToast('Not saved. Check your connection and try again.'); return }
    close(); setToast(`Saved ${s.name}.`); refresh()
  }

  async function addTeacher(name: string, email: string) {
    const { error } = await supabase!.rpc('add_teacher', { p_name: name, p_email: email })
    if (error) { setToast(/function|schema cache/i.test(error.message) ? 'Run 009_admin_teachers.sql in Supabase first.' : error.message); return false }
    setToast(`Added ${name}.`); refresh()
    return true
  }

  async function assign(s: Student, t: Teacher | null) {
    const { error } = await supabase!.rpc('assign_student', { p_student: s.id, p_teacher: t?.id ?? null })
    if (error) { setToast(/function|schema cache/i.test(error.message) ? 'Run 009_admin_teachers.sql in Supabase first.' : 'Not saved. Check your connection and try again.'); return }
    setToast(t ? `${s.name} is with ${t.name}.` : `${s.name} has no teacher.`); refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-10">
      <header className="maestro-keep sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Stairs />
            <div className="leading-tight">
              <div className="text-white font-black text-xl tracking-tight">Maestro</div>
              <div className="text-slate-400 text-[11px] font-medium -mt-0.5 whitespace-nowrap">Steady Steps Music</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`min-h-11 px-4 rounded-full text-sm font-bold transition-colors ${tab === t.id ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white'}`}>
                {t.label}
                {!!t.badge && <span className="ml-2 bg-amber-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => setOverlay({ kind: 'me' })} className="rounded-full ring-2 ring-slate-500 hover:ring-teal-400 focus:outline-none focus:ring-teal-400" aria-label="You">
            <Avatar name={me.name} tone="slate" />
          </button>
        </div>
      </header>

      {viewAs && (
        <div className="maestro-keep sticky top-16 z-30 bg-teal-900">
          <div className="max-w-3xl mx-auto px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0 text-sm text-white text-pretty"><span className="font-bold">Seeing what {viewAs.name} sees.</span> Read-only.</div>
            <button type="button" onClick={() => { setViewAs(null); setTab('admin') }} className={pill('outline', 'shrink-0')}>Back to admin</button>
          </div>
        </div>
      )}

      {data && syncOld && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-3xl mx-auto px-5 py-2.5 text-sm text-amber-950 text-pretty">
            <span className="font-bold">Your Mac has not synced {data.syncedAt ? `since ${ago(data.syncedAt, now)}` : 'yet'}.</span> New calendar changes show up once it is awake.
          </div>
        </div>
      )}
      {loadError && (
        <div className="bg-red-50 border-b border-red-200" role="alert">
          <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 text-sm text-red-950">
              <div className="font-bold">Could not load</div>
              <div className="text-pretty">{data ? 'Showing what loaded last.' : 'Check your connection.'}</div>
            </div>
            <Btn className="shrink-0" onClick={refresh}>Try again</Btn>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-5 pt-7">
        {!data && !loadError && <p className="text-center text-slate-600 py-16">Loading…</p>}

        {data && tab === 'home' && (
          <div className="space-y-7">
            <div>
              <p className="text-slate-600 text-sm font-medium">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{greeting}, {me.name}</h1>
            </div>

            {wrapUp.length > 0 && (
              <section>
                <Label>Wrap up</Label>
                <div className="space-y-3">
                  {wrapUp.map(l => {
                    const s = byId[l.student_id]
                    return (
                      <div key={l.id} className="bg-white rounded-3xl border-2 border-amber-300 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Avatar name={s.name} />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{s.name}</div>
                            <div className="text-sm text-slate-600 whitespace-nowrap">{dayLabel(l.starts_at, now)} · {time(l.starts_at)}{l.is_intro ? ' · Intro' : ''}</div>
                          </div>
                        </div>
                        <Btn kind="primary" onClick={() => setOverlay({ kind: 'finish', lessonId: l.id })} className="w-full sm:w-auto">Finish lesson</Btn>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {days.map(day => (
              <section key={day}>
                <Label>{day}</Label>
                <div className="space-y-3">
                  {upcoming.filter(l => dayLabel(l.starts_at, now) === day).map(l => {
                    const s = byId[l.student_id]
                    const [clock, ampm] = time(l.starts_at).split(' ')
                    const live = new Date(l.starts_at) <= now
                    const inHome = isInHome(s)
                    return (
                      <div key={l.id} className={`bg-white rounded-3xl border p-4 ${live ? 'border-teal-400 border-2' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-14 shrink-0 text-center">
                            <div className="font-black text-slate-900 leading-tight">{clock}</div>
                            <div className="text-[11px] font-bold text-slate-500">{ampm}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">{s.name}</div>
                            <div className="text-sm text-slate-600 truncate">{sub(s, lessonMinutes(l)) || l.title}</div>
                          </div>
                          {l.zoom_url && !inHome
                            ? <a href={l.zoom_url} target="_blank" rel="noreferrer" className={pill('action')}>Join Zoom</a>
                            : inHome ? <a href={directions(s, maps)} target="_blank" rel="noreferrer" className={pill('action')}>Directions</a> : null}
                        </div>
                        {(live || l.is_intro || l.has_guests === false) && (
                          <div className="mt-2 flex flex-wrap gap-2 pl-[68px]">
                            {live && <Tag tone="teal">Now</Tag>}
                            {l.is_intro && <Tag tone="amber">Intro</Tag>}
                            {l.has_guests === false && <Tag tone="amber">No invite sent</Tag>}
                          </div>
                        )}
                        {inHome && (
                          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3.5"><Address s={s} /></div>
                        )}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          {me.is_admin ? <Btn onClick={() => setOverlay({ kind: 'contact', studentId: s.id })}>Message</Btn> : <span />}
                          <Btn onClick={() => { setTab('students'); setOpenStudent(s.id) }}>Notes</Btn>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}

            {upcoming.length === 0 && wrapUp.length === 0 && (
              <Empty title="No lessons in the next 7 days" text="Lessons show up here when they are on the Steady Steps calendar." />
            )}

            {needDetails.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-200 p-5">
                <div className="font-bold text-slate-900">{needDetails.length} {needDetails.length === 1 ? 'student needs' : 'students need'} details</div>
                <p className="text-sm text-slate-600 mt-1 mb-4 text-pretty">Instrument and Zoom or in-home, so lessons and pay show right.</p>
                <Btn kind="action" onClick={() => setOverlay({ kind: 'edit', studentId: needDetails[0].id })}>Start with {needDetails[0].name}</Btn>
              </section>
            )}
          </div>
        )}

        {data && tab === 'students' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your students</h1>
              {roster.length > 0 && (
                <span className="text-sm font-bold text-slate-600">
                  {studentCount} student{studentCount === 1 ? '' : 's'}{studentCount !== roster.length && `, ${roster.length} accounts`}
                </span>
              )}
            </div>
            {roster.length === 0 && <Empty title="No students yet" text="Students show up here once your Mac syncs the roster." />}
            {roster.map(s => {
              const open = openStudent === s.id
              return (
                <div key={s.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                  <button type="button" onClick={() => setOpenStudent(open ? null : s.id)} aria-expanded={open} className="w-full text-left p-4 flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{[s.name, ...(s.family_names ?? [])].join(' + ')}</div>
                      <div className="text-sm text-slate-600 truncate">{[s.instrument ?? s.inquiry_instrument, s.level, s.family_names?.length ? `${s.family_names.length + 1} students` : null].filter(Boolean).join(' · ') || 'Details not set'}</div>
                    </div>
                    <span className={pill('outline')}>{open ? 'Close' : 'Open'}</span>
                  </button>
                  {open && (
                    <StudentPanel
                      s={s}
                      reports={reports.filter(r => r.student_id === s.id)}
                      recaps={data.recaps.filter(r => r.student_id === s.id)}
                      maps={maps}
                      onEdit={() => setOverlay({ kind: 'edit', studentId: s.id })}
                      onContact={me.is_admin ? () => setOverlay({ kind: 'contact', studentId: s.id }) : undefined}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {data && tab === 'earnings' && me.is_admin && (
          <AdminEarnings lessons={lessons} byId={byId} reportFor={reportFor} rates={data.rates} money={data.money} now={now} />
        )}

        {data && tab === 'earnings' && !me.is_admin && (
          <div className="space-y-7">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Earnings</h1>
            <div className="maestro-keep rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 shadow-lg">
              <div className="text-teal-400 text-xs font-bold uppercase tracking-widest">{monthName} at the teacher rate</div>
              <div className="text-white text-5xl font-black mt-3 tracking-tight tabular-nums">{money(sum(thisMonth))}</div>
              <div className="text-slate-300 text-sm mt-2">{thisMonth.length} {thisMonth.length === 1 ? 'lesson' : 'lessons'} finished · last month {money(sum(lastMonth))}</div>
            </div>
            <p className="text-sm text-slate-600 -mt-3 text-pretty">R&D view: what a teacher would be paid for your lessons at $42 / $58 / $75 plus $15 in-home. Nobody is paid from this.</p>

            {thisMonth.length === 0 && <Empty title="Nothing finished this month yet" text="Each lesson you finish shows up here." />}
            {thisMonth.length > 0 && (
              <section>
                <Label>{monthName} lessons</Label>
                <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
                  {thisMonth.map(r => {
                    const s = byId[r.student_id]
                    const lesson = lessons.find(l => l.id === r.lesson_id)
                    const label = r.outcome === 'waive' ? 'Missed, let go' : r.outcome === 'charge' ? 'Missed, counted' : `${r.minutes} min`
                    return (
                      <div key={r.lesson_id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">{s?.name ?? r.student_id}</div>
                          <div className="text-xs text-slate-600 whitespace-nowrap">{monthDay(r.lesson_starts_at)} · {label}</div>
                        </div>
                        {lesson && r.status !== 'approved' && (
                          <Btn className="shrink-0" onClick={() => setOverlay({ kind: 'finish', lessonId: lesson.id })} aria-label={`Change the ${monthDay(r.lesson_starts_at)} lesson`}>Change</Btn>
                        )}
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <div className="font-black text-slate-900 tabular-nums">{money(r.teacher_pay)}</div>
                          <Tag tone={r.status === 'approved' ? 'teal' : r.outcome === 'waive' ? 'slate' : 'amber'}>{r.status === 'approved' ? 'Approved' : 'Submitted'}</Tag>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {data && tab === 'messages' && !me.is_admin && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Messages</h1>
            <Empty title="Messages with families are coming to Maestro" text="You never need a family's number or email. Anything for a family, like running late or a question about a lesson, goes through Steady Steps for now." />
            {/* Texts the Steady Steps business number (Nik, 2026-11-25): opens their own Messages with it filled in */}
            <a href="sms:+12085469737" className={pill('action', 'w-full')}>Text Steady Steps</a>
          </div>
        )}

        {data && tab === 'admin' && teacher.is_admin && !viewAs && (
          <AdminPanel teachers={data.teachers} students={allStudents} onAdd={addTeacher} onAssign={assign}
            onViewAs={t => { setViewAs(t); setTab('home'); setOpenStudent(null) }}
            onPreviewWelcome={() => setOverlay({ kind: 'welcome' })} onToast={setToast} />
        )}

        {data && tab === 'messages' && me.is_admin && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Messages</h1>
              <p className="mt-1 text-sm text-slate-600 text-pretty">Opens your own email or texts.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
              {students.filter(s => s.status === 'active').map(s => (
                <button key={s.id} type="button" onClick={() => setOverlay({ kind: 'contact', studentId: s.id })} className="w-full text-left p-4 flex items-center gap-3">
                  <Avatar name={s.name} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{s.contact_label ? `${who(s)} (${s.name})` : s.name}</div>
                    <div className="text-sm text-slate-600 truncate">{s.emails[0] ?? s.phones[0] ?? 'No contact on file'}</div>
                  </div>
                  <span className={pill('outline')}>Open</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Phone tab bar */}
      <nav className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid ${tabs.length === 5 ? 'grid-cols-5' : 'grid-cols-4'} px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]`}>
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
            className={`relative flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[11px] font-bold ${tab === t.id ? 'bg-teal-50 text-teal-800' : 'text-slate-600'}`}>
            <Icon name={t.id} />
            {t.label}
            {!!t.badge && <span className="absolute top-0.5 left-1/2 ml-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {overlay?.kind === 'finish' && (() => {
        const l = lessons.find(x => x.id === overlay.lessonId)
        if (!l) return null
        const s = byId[l.student_id]
        const lastNote = reports.find(r => r.student_id === s.id && r.lesson_id !== l.id && r.notes)
        return <FinishSheet lesson={l} s={s} pay={payFor(l).pay} owner={me.is_admin} previous={reportFor[l.id]} lastNote={lastNote} onClose={close} onSubmit={submitReport} />
      })()}
      {overlay?.kind === 'edit' && byId[overlay.studentId] && (
        <EditSheet s={byId[overlay.studentId]} onClose={close} onSave={saveDetails}
          next={needDetails.find(x => x.id !== overlay.studentId)} />
      )}
      {overlay?.kind === 'contact' && byId[overlay.studentId] && <ContactSheet s={byId[overlay.studentId]} onClose={close} mail={mail} setMail={setMail} text={text} onToast={setToast} />}
      {overlay?.kind === 'me' && (
        <Sheet title="You" onClose={close}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={me.name} tone="slate" />
              <div className="min-w-0">
                <div className="font-black text-slate-900 text-lg">{me.name}</div>
                <div className="text-sm text-slate-600 truncate">{me.email}</div>
              </div>
            </div>
            <div>
              <Label>Appearance</Label>
              <Chips options={['Light', 'Dark', 'Match phone']} picked={[theme]} onToggle={o => setTheme(o as Theme)} />
            </div>
            <div>
              <Label>Directions open in</Label>
              <Chips options={['Apple Maps', 'Google Maps']} picked={[maps]} onToggle={o => setMaps(o as MapsApp)} />
            </div>
            {me.is_admin && <div>
              <div>
              <Label>Email opens in</Label>
              <Chips options={[...MAIL_APPS]} picked={mail ? [mail] : []} onToggle={o => setMail(o as MailApp)} />
            </div>
            <div className="mt-6">
              <Label>Texts open in</Label>
              <Chips options={['Messages', 'Google Voice']} picked={[text]} onToggle={o => setText(o as TextApp)} />
            </div>
            </div>}
            <HomeScreenTip />
            <PasskeySetup onToast={setToast} />
            <PasswordSetup email={teacher.email} onToast={setToast} />
            <div>
              <Label>Sync</Label>
              <p className="text-sm text-slate-700 text-pretty">{data?.syncedAt ? `Your Mac last synced ${ago(data.syncedAt, now)}.` : 'Your Mac has not synced yet.'} It sends your roster, calendar and recaps every 15 minutes while it is awake.</p>
              <Btn className="mt-3" onClick={() => { refresh(); setToast('Reloaded.') }}>Reload now</Btn>
            </div>
            <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-100">
              <a href="/maestro/demo" className={pill('outline')}>See the demo</a>
              <Btn onClick={() => supabase!.auth.signOut()}>Sign out</Btn>
            </div>
          </div>
        </Sheet>
      )}
      {overlay?.kind === 'welcome' && (
        <Welcome name={me.name.split(' ')[0]} onDone={finishWelcome} onSetUp={() => { finishWelcome(); setOverlay({ kind: 'me' }) }} />
      )}

      {toast && (
        <div className="fixed bottom-28 md:bottom-8 inset-x-0 z-[60] flex justify-center px-5 pointer-events-none" role="status">
          <div className="bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-3xl shadow-xl text-center text-balance">{toast}</div>
        </div>
      )}
    </div>
  )
}

// ---------- Admin ----------

// The enrollment email Nik sends by hand for now (2026-11-25). Brevo and a branded invite
// come when a real teacher is close.
const welcomeEmail = (name: string, email: string) => `Hi ${name.split(' ')[0]},

Welcome to Steady Steps! Maestro is where you'll see your lessons, your students and your pay, all in one place.

Getting set up takes about two minutes:

1. On your phone, open Safari and go to https://steadystepsmusic.com/maestro
2. Sign in with ${email} and this temporary password: [PASSWORD]
3. A short welcome walks you through the rest, including making your own password and putting Maestro on your home screen.

I book your lessons, and they show up in Maestro on their own. After each lesson, tap Finish lesson and add a quick note. That's how you get paid.

Any questions, just reply here.

Nik`

function AdminPanel({ teachers, students, onAdd, onAssign, onViewAs, onPreviewWelcome, onToast }: {
  teachers: Teacher[]; students: Student[]
  onAdd: (name: string, email: string) => Promise<boolean>
  onAssign: (s: Student, t: Teacher | null) => void
  onViewAs: (t: Teacher) => void
  onPreviewWelcome: () => void
  onToast: (m: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [added, setAdded] = useState<{ name: string; email: string } | null>(null)
  const field = 'w-full min-h-11 rounded-2xl border-2 border-slate-300 focus:border-teal-500 outline-none px-4 text-slate-900'

  const roster = students.filter(s => s.status === 'active' || s.status === 'paused')
  const label = (t: Teacher) => teachers.filter(x => x.name.split(' ')[0] === t.name.split(' ')[0]).length > 1 ? t.name : t.name.split(' ')[0]
  const byLabel = Object.fromEntries(teachers.map(t => [label(t), t]))
  const countFor = (t: Teacher) => roster.filter(s => s.status === 'active' && s.teacher_id === t.id).length
  const ordered = [...roster].sort((a, b) => Number(!!a.teacher_id) - Number(!!b.teacher_id) || a.name.localeCompare(b.name))
  const unassigned = roster.filter(s => !s.teacher_id).length

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const ok = await onAdd(name.trim(), email.trim())
    setBusy(false)
    if (ok) { setAdded({ name: name.trim(), email: email.trim().toLowerCase() }); setName(''); setEmail('') }
  }

  async function copyEmail() {
    if (!added) return
    try { await navigator.clipboard.writeText(welcomeEmail(added.name, added.email)); onToast('Welcome email copied. Fill in the password before you send it.') }
    catch { onToast('Could not copy. Your browser blocked the clipboard.') }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Admin</h1>
        <p className="mt-1 text-sm text-slate-600 text-pretty">Teachers, and who teaches whom. Only you see this.</p>
      </div>

      <section>
        <Label>Teachers</Label>
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
          {teachers.map(t => (
            <div key={t.id} className="p-4 flex items-center gap-3">
              <Avatar name={t.name} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate flex items-center gap-2">{t.name}{t.is_admin && <Tag tone="slate">Admin</Tag>}</div>
                <div className="text-sm text-slate-600 truncate">{countFor(t)} {countFor(t) === 1 ? 'student' : 'students'} · {t.email}</div>
              </div>
              <Btn className="shrink-0" onClick={() => onViewAs(t)}>See what they see</Btn>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Label>Add a teacher</Label>
        <form onSubmit={add} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
          <input className={field} placeholder="Name" aria-label="Teacher name" autoComplete="off" value={name} onChange={e => setName(e.target.value)} />
          <input className={field} type="email" placeholder="Email they'll sign in with" aria-label="Teacher email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit" disabled={busy || !name.trim() || !email.trim()} className={pill('primary', 'w-full')}>{busy ? 'Adding…' : 'Add teacher'}</button>
        </form>
        {added && (
          <div className="mt-3 rounded-3xl bg-teal-50 border border-teal-200 p-4 space-y-3 text-sm text-slate-800">
            <div className="font-bold text-slate-900">{added.name} is on the teacher list. Two steps left:</div>
            <ol className="list-decimal pl-5 space-y-1.5 text-pretty">
              <li>In Supabase, open Authentication, then Users, then Add user, then Create new user. Use {added.email}, make a temporary password, and leave Auto Confirm on.</li>
              <li>Copy the welcome email, put the password in, and send it from your Steady Steps Gmail.</li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <Btn kind="action" onClick={copyEmail}>Copy welcome email</Btn>
              <a href="https://supabase.com/dashboard/project/ezuykgvrcjsviiazolvd/auth/users" target="_blank" rel="noreferrer" className={pill('outline')}>Open Supabase users</a>
            </div>
          </div>
        )}
      </section>

      <section>
        <Label>Who teaches whom</Label>
        {unassigned > 0 && <p className="text-sm text-slate-600 mb-3 text-pretty">{unassigned} {unassigned === 1 ? 'student has' : 'students have'} no teacher yet. A teacher only sees the students you give them.</p>}
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
          {ordered.map(s => {
            const t = teachers.find(x => x.id === s.teacher_id)
            return (
              <div key={s.id} className="p-4 space-y-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{s.name}{s.family_names?.length ? ` + ${s.family_names.join(', ')}` : ''}</div>
                  {!t && <Tag tone="amber">No teacher</Tag>}
                  {s.status === 'paused' && <Tag tone="slate">Paused</Tag>}
                </div>
                <Chips options={teachers.map(label)} picked={t ? [label(t)] : []}
                  onToggle={o => onAssign(s, t && label(t) === o ? null : byLabel[o])} />
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <Label>New teacher welcome</Label>
        <p className="text-sm text-slate-600 mb-3 text-pretty">What a teacher sees the first time they sign in.</p>
        <Btn onClick={onPreviewWelcome}>Preview the welcome</Btn>
      </section>
    </div>
  )
}

// ---------- First sign-in ----------

const isStandalone = () => typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true)

function useStandalone() {
  const [on, setOn] = useState(false)
  useEffect(() => { setTimeout(() => setOn(isStandalone()), 0) }, [])
  return on
}

function Welcome({ name, onDone, onSetUp }: { name: string; onDone: () => void; onSetUp: () => void }) {
  const [step, setStep] = useState(0)
  const standalone = useStandalone()
  const steps: { title: string; text: string; icon?: Tab }[] = [
    { title: `Welcome to Maestro, ${name}`, text: 'Your lessons, your students and your pay, all in one place. Steady Steps books your lessons, and they show up here on their own.' },
    { title: 'Home is your week', icon: 'home', text: 'Every lesson for the next seven days, with Join Zoom or Directions right on it. When a lesson ends, tap Finish lesson, pick taught or missed, and add a quick note. That is how you get paid.' },
    { title: 'Students', icon: 'students', text: 'Who you teach, what each student is working on, and the notes from past lessons, so you always walk in knowing where they left off.' },
    { title: 'Earnings', icon: 'earnings', text: 'What every finished lesson pays you, plus travel for in-home lessons, adding up through the month. Pay goes out on the 5th of the month.' },
    { title: 'Messages', icon: 'messages', text: "You never need a family's number or email. Everything about a lesson goes through Steady Steps, so you can just teach." },
    { title: 'Make it yours', text: standalone
      ? 'You are already using Maestro from your home screen. Last step: set up a passkey or your own password so signing in is one tap.'
      : 'Put Maestro on your home screen so it opens like an app. In Safari, tap the Share button, then Add to Home Screen. Then set up a passkey or your own password, so signing in is one tap.' },
  ]
  const s = steps[step]
  const last = step === steps.length - 1
  return (
    <Sheet title="Welcome" onClose={onDone}>
      <div className="space-y-6">
        <div className="flex gap-1.5" aria-hidden="true">
          {steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-teal-500' : 'bg-slate-200'}`} />)}
        </div>
        <div className="min-h-48">
          {s.icon ? <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4"><Icon name={s.icon} /></div> : <div className="mb-4"><Stairs size={36} /></div>}
          <h2 className="text-2xl font-black text-slate-900 text-balance">{s.title}</h2>
          <p className="mt-3 text-slate-700 text-pretty">{s.text}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          {step > 0 ? <Btn onClick={() => setStep(step - 1)}>Back</Btn> : <Btn onClick={onDone}>Skip</Btn>}
          {last
            ? <div className="flex gap-3"><Btn onClick={onDone}>Later</Btn><Btn kind="primary" onClick={onSetUp}>Set up sign-in</Btn></div>
            : <Btn kind="primary" onClick={() => setStep(step + 1)}>Next</Btn>}
        </div>
      </div>
    </Sheet>
  )
}

// On the You panel: how to get the app icon, until it is there
function HomeScreenTip() {
  const standalone = useStandalone()
  if (standalone) return null
  return (
    <div>
      <Label>Home screen</Label>
      <p className="text-sm text-slate-700 text-pretty">To open Maestro like an app, tap Share in Safari, then Add to Home Screen. Sign in there once with your password or passkey and it stays signed in.</p>
    </div>
  )
}

// ---------- Pieces ----------

// The admin sees the month at 100%: what students pay for each lesson, taught and booked
// (Nik, 2026-11-23: "just show me what i'll get paid at 100%"). Teachers see only their pay.
function AdminEarnings({ lessons, byId, reportFor, rates, money: m, now }: {
  lessons: Lesson[]; byId: Record<string, Student>; reportFor: Record<string, Report>; rates: Rate[]; money: Money | null; now: Date
}) {
  const rateOf = Object.fromEntries(rates.map(r => [r.id, r]))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const monthName = now.toLocaleDateString('en-US', { month: 'long' })
  const rows = lessons
    .filter(l => { const d = new Date(l.starts_at); return d >= monthStart && d < monthEnd })
    .map(l => {
      const r = reportFor[l.id]
      const rate = priceOf(l, rateOf[l.student_id])
      const past = new Date(l.ends_at) <= now
      const status = l.is_intro ? 'Intro' : r?.outcome === 'waive' ? 'Missed, let go' : r?.outcome === 'charge' ? 'Missed, counted' : r ? 'Finished' : past ? 'From calendar' : 'Booked'
      const amount = l.is_intro || r?.outcome === 'waive' ? 0 : rate ?? null
      return { l, past, status, amount }
    })
  const taught = rows.filter(r => r.past).reverse()
  const booked = rows.filter(r => !r.past)
  const total = (rs: typeof rows) => rs.reduce((a, r) => a + (r.amount ?? 0), 0)
  const unset = [...new Set(rows.filter(r => r.amount === null).map(r => byId[r.l.student_id]?.name))]

  const list = (title: string, items: typeof rows) => items.length === 0 ? null : (
    <section>
      <Label>{title}</Label>
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
        {items.map(({ l, status, amount }) => (
          <div key={l.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 truncate">{byId[l.student_id]?.name}</div>
              <div className="text-xs text-slate-600 whitespace-nowrap">{shortDay(l.starts_at)} · {time(l.starts_at)}</div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className="font-black text-slate-900 tabular-nums">{amount === null ? 'No rate' : money(amount)}</div>
              <Tag tone={status === 'Finished' ? 'teal' : status === 'Booked' || status === 'From calendar' ? 'slate' : 'amber'}>{status}</Tag>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="space-y-7">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Earnings</h1>
      {m ? (
        <>
          {/* Nik is paid by Stripe right away, so his headline is money in, the same as the tracker (11/23) */}
          <div className="maestro-keep rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 shadow-lg">
            <div className="text-teal-400 text-xs font-bold uppercase tracking-widest">{m.month} payouts</div>
            <div className="text-white text-5xl font-black mt-3 tracking-tight tabular-nums">{money(Number(m.collected))}</div>
            <div className="text-slate-300 text-sm mt-2">{money(Number(m.to_come))} still to come · {m.last_month_name} was {money(Number(m.last_month))}</div>
            <div className="text-amber-400 text-sm font-semibold">On track for {money(Number(m.collected) + Number(m.to_come))}</div>
          </div>
          <p className="text-sm text-slate-600 -mt-3 text-pretty">From Stripe, through your tracker. Only you see this. Teachers see their own pay.</p>
          {m.payouts.length > 0 && (
            <section>
              <Label>Paid this month</Label>
              <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
                {m.payouts.map((p, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 truncate">{p.student || 'Not matched yet'}</div>
                      <div className="text-xs text-slate-600 whitespace-nowrap">{new Date(p.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div className="shrink-0 font-black text-slate-900 tabular-nums">{money(Number(p.amount))}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {rows.length > 0 && (
            <p className="text-sm text-slate-600 text-pretty">
              Lessons this month, by what each one is worth: {money(total(taught))} taught, {money(total(booked))} booked. Packages paid last month cover some of these, so this won&apos;t match payouts.
            </p>
          )}
        </>
      ) : (
        <>
          <div className="maestro-keep rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 shadow-lg">
            <div className="text-teal-400 text-xs font-bold uppercase tracking-widest">{monthName} so far</div>
            <div className="text-white text-5xl font-black mt-3 tracking-tight tabular-nums">{money(total(taught))}</div>
            <div className="text-slate-300 text-sm mt-2">{taught.length} {taught.length === 1 ? 'lesson' : 'lessons'} taught · {money(total(booked))} booked</div>
            <div className="text-amber-400 text-sm font-semibold">On track for {money(total(rows))}</div>
          </div>
          <p className="text-sm text-slate-600 -mt-3 text-pretty">
            At 100%: what each lesson pays, from the package or one-off payment that covers it in your tracker. Only you see this. Teachers see their own pay.
          </p>
        </>
      )}
      {unset.length > 0 && (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950 text-pretty">
          No monthly figure yet for {unset.join(', ')}. Set it in the tracker&apos;s Finance tab and it shows up after the next sync.
        </div>
      )}
      {rows.length === 0 && <Empty title={`No lessons in ${monthName}`} text="Lessons on the Steady Steps calendar show up here." />}
      {list(m ? 'Lessons booked' : 'Booked', booked)}
      {list(m ? 'Lessons taught' : 'Taught', taught)}
    </div>
  )
}

// new-password lets Safari suggest a strong password and save it to iCloud Keychain
function PasswordSetup({ email, onToast }: { email: string; onToast: (m: string) => void }) {
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase!.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) onToast(error.message.includes('weak') || error.message.includes('characters') ? 'Use at least 8 characters.' : 'Could not save. Try again in a moment.')
    else { setOpen(false); setPw(''); onToast('Password saved.') }
  }
  return (
    <div>
      <Label>Password</Label>
      {!open ? <Btn onClick={() => setOpen(true)}>Set a new password</Btn> : (
        <form onSubmit={save} className="space-y-3">
          <input type="email" autoComplete="username" value={email} readOnly hidden />
          <input type="password" autoComplete="new-password" minLength={8} required value={pw} onChange={e => setPw(e.target.value)} aria-label="New password" placeholder="New password"
            className="w-full min-h-12 rounded-full border-2 border-slate-300 focus:border-teal-500 outline-none px-5 text-slate-900" />
          <div className="flex gap-3">
            <button type="submit" disabled={busy || pw.length < 8} className={pill('action')}>{busy ? 'Saving…' : 'Save password'}</button>
            <Btn onClick={() => { setOpen(false); setPw('') }}>Cancel</Btn>
          </div>
        </form>
      )}
    </div>
  )
}

// One tap here saves a passkey (Face ID / Touch ID) on this device. After that, "Sign in with
// a passkey" on the sign-in screen needs no email or password.
function PasskeySetup({ onToast }: { onToast: (m: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  async function add() {
    setBusy(true)
    const { error } = await supabase!.auth.registerPasskey()
    setBusy(false)
    if (!error) { setDone(true); onToast('Passkey saved. Next time, sign in with Face ID.') }
    else if (!/abort|cancel|not allowed/i.test(error.message)) onToast('Could not save the passkey. Try again in a moment.')
  }
  return (
    <div>
      <Label>Passkey</Label>
      <p className="text-sm text-slate-700 text-pretty">Sign in with Face ID instead of a password on this phone.</p>
      {done ? <div className="mt-3"><Tag tone="teal">Saved on this device</Tag></div>
        : <Btn className="mt-3" disabled={busy} onClick={add}>{busy ? 'Waiting for Face ID…' : 'Set up a passkey'}</Btn>}
    </div>
  )
}

function Icon({ name }: { name: Tab }) {
  const paths: Record<Tab, string> = {
    home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
    students: 'M16 19v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V19M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 19v-1.5a4 4 0 0 0-3-3.85M15.5 3.2a3.5 3.5 0 0 1 0 6.6',
    earnings: 'M12 3v18M16.5 7.5c-.6-1.4-2.2-2.2-4.5-2.2-2.6 0-4.3 1.2-4.3 3.1 0 4.5 9.1 2.1 9.1 6.8 0 2-1.9 3.3-4.8 3.3-2.6 0-4.4-1-5-2.7',
    messages: 'M4 5h16v11H9l-5 4V5Z',
    admin: 'M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3ZM9 12l2 2 4-4',
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

function Address({ s }: { s: Student }) {
  return (
    <div className="flex items-start gap-2.5">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700 shrink-0 mt-0.5" aria-hidden="true">
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" />
      </svg>
      <div className="min-w-0 text-sm">
        <div className="font-semibold text-slate-900">{s.street}</div>
        {s.city && <div className="font-semibold text-slate-900">{s.city}</div>}
        {s.arrival && <div className="text-slate-600 mt-1 text-pretty">{s.arrival}</div>}
      </div>
    </div>
  )
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center">
      <div className="font-bold text-slate-900">{title}</div>
      <p className="text-sm text-slate-600 mt-1 text-pretty">{text}</p>
    </div>
  )
}

function StudentPanel({ s, reports, recaps, maps, onEdit, onContact }: {
  s: Student; reports: Report[]; recaps: Data['recaps']; maps: MapsApp; onEdit: () => void; onContact?: () => void
}) {
  const [allNotes, setAllNotes] = useState(false)
  const notes = [
    ...reports.filter(r => r.notes).map(r => ({ key: r.lesson_id, at: r.lesson_starts_at, by: 'Lesson notes', text: r.notes! })),
    ...recaps.map(r => ({ key: r.id, at: r.sent_at, by: 'Recap email', text: (r.body ?? '').trim() })),
  ].sort((a, b) => b.at.localeCompare(a.at))
  const shown = allNotes ? notes : notes.slice(0, 3)
  const w = s.working_on

  return (
    <div className="px-4 pb-5 space-y-5">
      <div className="flex flex-wrap gap-2">
        {s.default_minutes && <Tag tone="teal">{s.default_minutes} min</Tag>}
        {s.format && <Tag tone="slate">{s.format}</Tag>}
        {s.age_group && <Tag tone="slate">{s.age_group}</Tag>}
        {missingDetails(s) && <Tag tone="amber">Needs details</Tag>}
      </div>
      {s.contact_label && <p className="text-sm font-semibold text-slate-900">{s.contact_label}</p>}
      {isInHome(s) && (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 space-y-3">
          <Address s={s} />
          <a href={directions(s, maps)} target="_blank" rel="noreferrer" className={pill('action')}>Directions</a>
        </div>
      )}

      {w && (w.summary || w.current?.length) && (
        <div>
          <Label>Working on</Label>
          {w.summary && <p className="text-sm text-slate-700 leading-relaxed text-pretty">{w.summary}</p>}
          {!!w.current?.length && (
            <div className="mt-3 space-y-2">
              {w.current.map(c => (
                <div key={c.topic} className="flex items-start gap-2">
                  {c.stage && <Tag tone={c.stage === 'new' ? 'amber' : 'teal'}>{c.stage}</Tag>}
                  <div className="text-sm text-slate-800 min-w-0 text-pretty"><span className="font-bold">{c.topic}</span>{c.note ? `. ${c.note}` : ''}</div>
                </div>
              ))}
            </div>
          )}
          {!!w.next?.length && <p className="text-sm text-slate-600 mt-3 text-pretty"><span className="font-bold text-slate-800">Next up:</span> {w.next.join(', ')}</p>}
        </div>
      )}

      <div>
        <Label>Notes</Label>
        {notes.length === 0 && <p className="text-sm text-slate-600">No notes or recaps yet.</p>}
        <div className="space-y-3">
          {shown.map(n => <Note key={n.key} date={monthDay(n.at)} by={n.by} text={n.text} />)}
        </div>
        {notes.length > 3 && <Btn className="mt-3" onClick={() => setAllNotes(!allNotes)}>{allNotes ? 'Show fewer' : `Show all ${notes.length}`}</Btn>}
      </div>

      <div className="flex flex-wrap gap-3">
        {onContact && <Btn kind="action" onClick={onContact}>Message {who(s)}</Btn>}
        <Btn onClick={onEdit}>Edit details</Btn>
      </div>
    </div>
  )
}

function Note({ date, by, text }: { date: string; by: string; text: string }) {
  const long = text.length > 320
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
      <div className="text-xs font-semibold text-slate-600 mb-1">{date} · {by}</div>
      <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line text-pretty">{long && !open ? `${text.slice(0, 320).trimEnd()}…` : text}</div>
      {long && <button type="button" onClick={() => setOpen(!open)} className="mt-1 text-sm font-bold text-teal-700">{open ? 'Less' : 'More'}</button>}
    </div>
  )
}

function FinishSheet({ lesson, s, pay, owner, previous, lastNote, onClose, onSubmit }: {
  lesson: Lesson
  s: Student
  pay: number
  owner: boolean
  previous?: Report
  lastNote?: Report
  onClose: () => void
  onSubmit: (l: Lesson, outcome: Outcome, notes: string) => Promise<boolean>
}) {
  const was = previous?.outcome
  const [outcome, setOutcome] = useState<'taught' | 'missed' | null>(was ? (was === 'taught' ? 'taught' : 'missed') : null)
  const [missed, setMissed] = useState<'charge' | 'waive' | null>(was && was !== 'taught' ? was : null)
  const [notes, setNotes] = useState(previous?.notes ?? '')
  const [busy, setBusy] = useState(false)
  const { label } = lessonPay(lesson, s)

  const go = async (o: Outcome) => { setBusy(true); await onSubmit(lesson, o, notes); setBusy(false) }

  return (
    <Sheet title={previous ? 'Change lesson' : 'Finish lesson'} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name={s.name} />
          <div className="min-w-0">
            <div className="font-black text-slate-900 text-lg truncate">{s.name}</div>
            <div className="text-sm text-slate-600 whitespace-nowrap">{shortDay(lesson.starts_at)}, {time(lesson.starts_at)}</div>
            <div className="text-sm text-slate-600 whitespace-nowrap">{[s.instrument, label, s.format].filter(Boolean).join(' · ')}</div>
          </div>
        </div>

        {lastNote?.notes && (
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
            <div className="text-xs font-semibold text-slate-600 mb-1">Last time · {monthDay(lastNote.lesson_starts_at)}</div>
            <div className="text-sm text-slate-800 leading-relaxed text-pretty line-clamp-4">{lastNote.notes}</div>
          </div>
        )}

        <div className="space-y-3">
          <Choice active={outcome === 'taught'} onClick={() => setOutcome('taught')} title="We had the lesson" />
          <Choice active={outcome === 'missed'} onClick={() => setOutcome('missed')} title="The student missed it" desc="No-show or a last-minute cancel" />
        </div>

        {outcome === 'taught' && (
          <>
            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-slate-900 mb-2">Lesson notes</label>
              <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={5} placeholder="What you worked on, and what to practice."
                className="w-full rounded-2xl border-2 border-slate-300 focus:border-teal-500 outline-none p-3.5 text-slate-900 leading-relaxed" />
              <p className="text-xs text-slate-600 mt-2 text-pretty">Notes stay with the student and show in your tracker on the Mac.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3">
              <span className="text-slate-600 text-sm whitespace-nowrap">{lesson.is_intro ? (owner ? 'Intro lesson' : 'Intro pay is not decided yet') : owner ? 'This lesson pays you' : 'At the teacher rate'}</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">{money(pay)}</span>
            </div>
            <Btn kind="primary" className="w-full" disabled={busy || !notes.trim()} onClick={() => go('taught')}>
              {busy ? 'Saving…' : previous ? 'Save changes' : 'Submit lesson'}
            </Btn>
          </>
        )}

        {outcome === 'missed' && (
          <>
            <div className="space-y-3">
              <Choice active={missed === 'charge'} onClick={() => setMissed('charge')} title="Count the lesson" desc={`The student uses a lesson. You are paid ${money(pay)}.`} />
              <Choice active={missed === 'waive'} onClick={() => setMissed('waive')} title="Let it go this time" desc="The student keeps the lesson. No pay for it." />
            </div>
            <div>
              <label htmlFor="mnotes" className="block text-sm font-bold text-slate-900 mb-2">Note <span className="font-medium text-slate-500">(optional)</span></label>
              <textarea id="mnotes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="What happened"
                className="w-full rounded-2xl border-2 border-slate-300 focus:border-teal-500 outline-none p-3.5 text-slate-900 leading-relaxed" />
            </div>
            <Btn kind="primary" className="w-full" disabled={busy || !missed} onClick={() => missed && go(missed)}>
              {busy ? 'Saving…' : previous ? 'Save changes' : 'Submit'}
            </Btn>
          </>
        )}
      </div>
    </Sheet>
  )
}

function EditSheet({ s, next, onClose, onSave }: { s: Student; next?: Student; onClose: () => void; onSave: (s: Student, d: StudentDetails) => void }) {
  const guess = INSTRUMENTS.find(i => s.inquiry_instrument?.toLowerCase().includes(i.toLowerCase())) ?? null
  const [d, setD] = useState<StudentDetails>({
    instrument: s.instrument ?? guess, level: s.level, age_group: s.age_group, format: s.format,
    default_minutes: s.default_minutes, street: s.own_street ?? null, city: s.own_city ?? null, arrival: s.arrival, contact_label: s.contact_label,
  })
  const set = <K extends keyof StudentDetails>(k: K, v: StudentDetails[K]) => setD(x => ({ ...x, [k]: v }))
  const pick = <K extends keyof StudentDetails>(k: K, v: StudentDetails[K]) => set(k, d[k] === v ? null : v)
  const field = 'w-full min-h-11 rounded-2xl border-2 border-slate-300 focus:border-teal-500 outline-none px-4 text-slate-900'

  return (
    <Sheet title={s.name} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <Label>Instrument</Label>
          <Chips options={INSTRUMENTS} picked={d.instrument ? [d.instrument] : []} onToggle={o => pick('instrument', o)} />
          {s.inquiry_instrument && !s.instrument && <p className="text-xs text-slate-600 mt-2">Inquiry said: {s.inquiry_instrument}</p>}
        </div>
        <div>
          <Label>Level</Label>
          <Chips options={LEVELS} picked={d.level ? [d.level] : []} onToggle={o => pick('level', o)} />
        </div>
        <div>
          <Label>Age</Label>
          <Chips options={AGES} picked={d.age_group ? [d.age_group] : []} onToggle={o => pick('age_group', o)} />
        </div>
        <div>
          <Label>Usual length</Label>
          <Chips options={['30 min', '45 min', '60 min']} picked={d.default_minutes ? [`${d.default_minutes} min`] : []} onToggle={o => pick('default_minutes', parseInt(o))} />
        </div>
        <div>
          <Label>Where</Label>
          <Chips options={['Zoom', 'In-home']} picked={d.format ? [d.format] : []} onToggle={o => pick('format', o as Student['format'])} />
        </div>
        {d.format === 'In-home' && (
          <div className="space-y-3">
            <input className={field} placeholder={s.calendar_street ? `${s.calendar_street} (from the calendar invite)` : 'Street address'} aria-label="Street address" autoComplete="off" value={d.street ?? ''} onChange={e => set('street', e.target.value || null)} />
            <input className={field} placeholder={s.calendar_city ?? 'City, state, zip'} aria-label="City" autoComplete="off" value={d.city ?? ''} onChange={e => set('city', e.target.value || null)} />
            <textarea className={`${field} py-3`} rows={2} placeholder="Arrival notes (gate, parking, where the piano is)" aria-label="Arrival notes" value={d.arrival ?? ''} onChange={e => set('arrival', e.target.value || null)} />
          </div>
        )}
        <div>
          <Label>Parent or contact</Label>
          <input className={field} placeholder="Parent: Kelsey (leave empty for adults)" aria-label="Parent or contact" value={d.contact_label ?? ''} onChange={e => set('contact_label', e.target.value || null)} />
        </div>
        <Btn kind="primary" className="w-full" onClick={() => onSave(s, d)}>Save</Btn>
        {next && <p className="text-sm text-slate-600 text-center">Next to fill in: {next.name}</p>}
      </div>
    </Sheet>
  )
}

function ContactSheet({ s, onClose, mail, setMail, text, onToast }: {
  s: Student; onClose: () => void; mail: MailApp | null; setMail: (m: MailApp) => void; text: TextApp; onToast: (m: string) => void
}) {
  const digits = (p: string) => p.replace(/[^\d+]/g, '')
  const [askFor, setAskFor] = useState<string | null>(null) // email address waiting on "which app?"
  const openMail = (app: MailApp, to: string) => { window.location.assign(mailHref(app, to)) }
  const voiceText = (p: string) => {
    navigator.clipboard?.writeText(p).catch(() => {})
    onToast('Number copied, in case Google Voice opens to your inbox.')
  }
  return (
    <Sheet title={who(s)} onClose={onClose}>
      <div className="space-y-4">
        {s.contact_label && <p className="text-sm text-slate-600 -mt-2">Parent of {s.name}</p>}
        {s.emails.length === 0 && s.phones.length === 0 && <p className="text-sm text-slate-600">No email or phone tied to {s.name} in the tracker yet.</p>}
        {s.phones.map(p => (
          <div key={p} className="flex items-center justify-between gap-3">
            <span className="font-semibold text-slate-900 whitespace-nowrap">{p}</span>
            <div className="flex gap-2">
              {text === 'Google Voice'
                ? <a href={voiceHref(p)} onClick={() => voiceText(p)} className={pill('action')}>Text</a>
                : <a href={`sms:${digits(p)}`} className={pill('action')}>Text</a>}
              <a href={`tel:${digits(p)}`} className={pill('outline')}>Call</a>
            </div>
          </div>
        ))}
        {s.emails.map(e => (
          <div key={e}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-900 truncate min-w-0">{e}</span>
              {mail
                ? <a href={mailHref(mail, e)} className={pill('action', 'shrink-0')}>Email</a>
                : <button type="button" onClick={() => setAskFor(askFor === e ? null : e)} aria-expanded={askFor === e} className={pill('action', 'shrink-0')}>Email</button>}
            </div>
            {askFor === e && (
              <div className="mt-3 rounded-2xl border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-900 mb-2">Which email app? Maestro will remember.</p>
                <div className="flex flex-wrap gap-2">
                  {MAIL_APPS.map(app => (
                    <button key={app} type="button" onClick={() => { setMail(app); setAskFor(null); openMail(app, e) }} className={pill('outline')}>{app}</button>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-2">Change it anytime from your name, top right.</p>
              </div>
            )}
          </div>
        ))}
        <p className="text-xs text-slate-600 text-pretty pt-2">Opens your own phone or email for now. Messaging through Maestro comes later.</p>
      </div>
    </Sheet>
  )
}
