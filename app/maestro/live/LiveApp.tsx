'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Avatar, Btn, Chips, Choice, Label, Sheet, Stairs, Tag, pill } from '../ui'
import {
  supabase, loadAll, lessonPay, lessonMinutes,
  type Data, type Lesson, type Outcome, type Report, type Student, type StudentDetails, type Teacher,
} from './data'

// Maestro v0, real data (2026-11-23). Same design rules as the prototype (Nik, 2026-11-16):
// - Phone first. About 90% of use is on a phone.
// - Everything clickable is a pill. Only actions are filled (black, or amber for the one
//   main action on a screen). Other clickable things are outlined.
// - Status labels are square tags, never pills. Panels close with "Done".
// - No line of text should wrap by accident on a phone.
// What is real: Home, Finish lesson, Students (+ details, notes, recaps), Earnings at the
// teacher rate. Messages through Maestro come later; that tab opens your own email/texts.

type Tab = 'home' | 'students' | 'earnings' | 'messages'
type Overlay =
  | { kind: 'finish'; lessonId: string }
  | { kind: 'edit'; studentId: string }
  | { kind: 'contact'; studentId: string }
  | { kind: 'me' }
  | null
type MapsApp = 'Apple Maps' | 'Google Maps'

const INSTRUMENTS = ['Guitar', 'Bass', 'Piano', 'Voice', 'Ukulele', 'Banjo', 'Songwriting']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const AGES = ['Kid', 'Teen', 'Adult']
const MAPS_KEY = 'maestro-maps'

const money = (n: number) => `$${Number(n).toFixed(2)}`
const time = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const shortDay = (iso: string) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const monthDay = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const dayKey = (d: Date) => d.toDateString()
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
const who = (s: Student) => (s.contact_label ? s.contact_label.replace(/^Parent:\s*/i, '') : s.name)
const sub = (s: Student, minutes?: number) => [s.instrument ?? s.inquiry_instrument, minutes ? `${minutes} min` : s.default_minutes ? `${s.default_minutes} min` : null].filter(Boolean).join(' · ')
const missingDetails = (s: Student) => !s.instrument || !s.format

// ---------- Gate: config, sign in, teacher check ----------

export default function LiveApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

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
  return <TeacherGate session={session} />
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900">
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

function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase!.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/maestro` },
    })
    setBusy(false)
    if (error) setError(error.message.includes('Signups not allowed') ? 'That email is not set up for Maestro.' : error.message)
    else setSent(true)
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
      {!sent ? (
        <form onSubmit={sendLink} className="mt-5 space-y-4">
          <label className="block text-sm font-bold text-slate-900" htmlFor="email">Your email</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full min-h-12 rounded-full border-2 border-slate-300 focus:border-teal-500 outline-none px-5 text-slate-900" />
          <button type="submit" disabled={busy || !email.trim()} className={pill('primary', 'w-full')}>{busy ? 'Sending…' : 'Email me a sign-in link'}</button>
        </form>
      ) : (
        <div className="mt-5 space-y-5">
          <p className="text-slate-700 text-pretty">Check your email. Tap the link in it, or type the code here. The code is the way to go if you added Maestro to your home screen.</p>
          <form onSubmit={useCode} className="space-y-4">
            <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="Code" aria-label="Sign-in code" maxLength={8}
              className="w-full min-h-12 rounded-full border-2 border-slate-300 focus:border-teal-500 outline-none px-5 text-slate-900 tracking-widest text-center text-lg" />
            <button type="submit" disabled={busy || code.length < 6} className={pill('primary', 'w-full')}>Sign in</button>
          </form>
          <Btn onClick={() => { setSent(false); setCode('') }}>Use a different email</Btn>
        </div>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-red-700 text-pretty" role="alert">{error}</p>}
      <p className="mt-10 text-sm text-slate-600 text-pretty">Teaching for Steady Steps soon? <a href="/maestro/demo" className="font-bold text-teal-700 underline">See the demo</a></p>
    </Shell>
  )
}

function TeacherGate({ session }: { session: Session }) {
  const [teacher, setTeacher] = useState<Teacher | null | undefined>(undefined)
  useEffect(() => {
    supabase!.from('teachers').select('*').ilike('email', session.user.email ?? '').maybeSingle()
      .then(({ data }) => setTeacher((data as Teacher) ?? null))
  }, [session])
  if (teacher === undefined) return <Shell><p className="text-center text-slate-600 py-16">Loading…</p></Shell>
  if (!teacher) {
    return (
      <Shell>
        <Empty title="Not set up as a teacher" text={`${session.user.email} can sign in, but it is not on the teacher list yet.`} />
        <Btn className="mt-5" onClick={() => supabase!.auth.signOut()}>Sign out</Btn>
      </Shell>
    )
  }
  return <App teacher={teacher} />
}

// ---------- App ----------

function App({ teacher }: { teacher: Teacher }) {
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [data, setData] = useState<Data | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [toast, setToast] = useState<string | null>(null)
  const [openStudent, setOpenStudent] = useState<string | null>(null)
  const [maps, setMapsState] = useState<MapsApp>('Apple Maps')
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
    try { if (localStorage.getItem(MAPS_KEY) === 'Google Maps') setTimeout(() => setMapsState('Google Maps'), 0) } catch { /* private mode */ }
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => { clearTimeout(first); clearInterval(t) }
  }, [refresh])

  // Coming back to the app re-reads the data, but never while a panel is open (no surprise
  // changes mid-task; Nik disliked the tracker's old auto-reload)
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible' && !overlay) refresh() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [overlay, refresh])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const setMaps = (m: MapsApp) => { setMapsState(m); try { localStorage.setItem(MAPS_KEY, m) } catch { /* private mode */ } }

  const students = useMemo(() => data?.students ?? [], [data])
  const byId = useMemo(() => Object.fromEntries(students.map(s => [s.id, s])), [students])
  const reportFor = useMemo(() => Object.fromEntries((data?.reports ?? []).map(r => [r.lesson_id, r])), [data])
  const lessons = useMemo(() => (data?.lessons ?? []).filter(l => byId[l.student_id]), [data, byId])

  // Only lessons from the day this teacher started on Maestro ask to be wrapped up. Older ones
  // were already handled outside it (Nik's first day showed 34 of them, 2026-11-23).
  const startedOn = new Date(teacher.created_at); startedOn.setHours(0, 0, 0, 0)
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
  ]

  async function submitReport(l: Lesson, outcome: Outcome, notes: string) {
    const s = byId[l.student_id]
    const { minutes, pay } = lessonPay(l, s)
    const row = {
      lesson_id: l.id, student_id: l.student_id, lesson_starts_at: l.starts_at, outcome,
      notes: notes.trim() || null, minutes, teacher_pay: outcome === 'waive' ? 0 : pay,
      submitted_by: teacher.id, updated_at: new Date().toISOString(),
    }
    const { error } = await supabase!.from('lesson_reports').upsert(row, { onConflict: 'lesson_id' })
    if (error) { setToast('Not saved. Check your connection and try again.'); return false } // the panel stays open, nothing is lost
    const was = reportFor[l.id]
    close()
    setToast(was ? 'Lesson updated.' : outcome === 'waive' ? 'Submitted. The student keeps the lesson.' : `Submitted. ${money(row.teacher_pay)} at the teacher rate.`)
    refresh()
    return true
  }

  async function saveDetails(s: Student, d: StudentDetails) {
    const { error } = await supabase!.from('students').update({ ...d, maestro_updated_at: new Date().toISOString() }).eq('id', s.id)
    if (error) { setToast('Not saved. Check your connection and try again.'); return }
    close(); setToast(`Saved ${s.name}.`); refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-10">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
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
                {!!t.badge && <span className="ml-2 bg-amber-500 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => setOverlay({ kind: 'me' })} className="rounded-full ring-2 ring-slate-500 hover:ring-teal-400 focus:outline-none focus:ring-teal-400" aria-label="You">
            <Avatar name={teacher.name} tone="slate" />
          </button>
        </div>
      </header>

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
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{greeting}, {teacher.name}</h1>
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
                    const inHome = s.format === 'In-home' && !!s.street
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
                        {(live || l.is_intro) && (
                          <div className="mt-2 flex gap-2 pl-[68px]">
                            {live && <Tag tone="teal">Now</Tag>}
                            {l.is_intro && <Tag tone="amber">Intro</Tag>}
                          </div>
                        )}
                        {inHome && (
                          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3.5"><Address s={s} /></div>
                        )}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <Btn onClick={() => setOverlay({ kind: 'contact', studentId: s.id })}>Message</Btn>
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Your students</h1>
            {students.length === 0 && <Empty title="No students yet" text="Students show up here once your Mac syncs the roster." />}
            {students.map(s => {
              const open = openStudent === s.id
              return (
                <div key={s.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                  <button type="button" onClick={() => setOpenStudent(open ? null : s.id)} aria-expanded={open} className="w-full text-left p-4 flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{s.name}</div>
                      <div className="text-sm text-slate-600 truncate">{[s.instrument ?? s.inquiry_instrument, s.level].filter(Boolean).join(' · ') || 'Details not set'}</div>
                    </div>
                    {s.status === 'paused' && <Tag tone="slate">Paused</Tag>}
                    <span className={pill('outline')}>{open ? 'Close' : 'Open'}</span>
                  </button>
                  {open && (
                    <StudentPanel
                      s={s}
                      reports={reports.filter(r => r.student_id === s.id)}
                      recaps={data.recaps.filter(r => r.student_id === s.id)}
                      maps={maps}
                      onEdit={() => setOverlay({ kind: 'edit', studentId: s.id })}
                      onContact={() => setOverlay({ kind: 'contact', studentId: s.id })}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {data && tab === 'earnings' && (
          <div className="space-y-7">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Earnings</h1>
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 shadow-lg">
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

        {data && tab === 'messages' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Messages</h1>
            <div className="rounded-3xl bg-teal-50 border border-teal-200 p-4 text-sm text-teal-950 text-pretty">
              Messaging inside Maestro comes later. For now these open your own email and texts.
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
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-4 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
            className={`relative flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[11px] font-bold ${tab === t.id ? 'bg-teal-50 text-teal-800' : 'text-slate-600'}`}>
            <Icon name={t.id} />
            {t.label}
            {!!t.badge && <span className="absolute top-0.5 left-1/2 ml-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 rounded-full">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {overlay?.kind === 'finish' && (() => {
        const l = lessons.find(x => x.id === overlay.lessonId)
        if (!l) return null
        const s = byId[l.student_id]
        const lastNote = reports.find(r => r.student_id === s.id && r.lesson_id !== l.id && r.notes)
        return <FinishSheet lesson={l} s={s} previous={reportFor[l.id]} lastNote={lastNote} onClose={close} onSubmit={submitReport} />
      })()}
      {overlay?.kind === 'edit' && byId[overlay.studentId] && (
        <EditSheet s={byId[overlay.studentId]} onClose={close} onSave={saveDetails}
          next={needDetails.find(x => x.id !== overlay.studentId)} />
      )}
      {overlay?.kind === 'contact' && byId[overlay.studentId] && <ContactSheet s={byId[overlay.studentId]} onClose={close} />}
      {overlay?.kind === 'me' && (
        <Sheet title="You" onClose={close}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={teacher.name} tone="slate" />
              <div className="min-w-0">
                <div className="font-black text-slate-900 text-lg">{teacher.name}</div>
                <div className="text-sm text-slate-600 truncate">{teacher.email}</div>
              </div>
            </div>
            <div>
              <Label>Directions open in</Label>
              <Chips options={['Apple Maps', 'Google Maps']} picked={[maps]} onToggle={o => setMaps(o as MapsApp)} />
            </div>
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

      {toast && (
        <div className="fixed bottom-28 md:bottom-8 inset-x-0 z-[60] flex justify-center px-5 pointer-events-none" role="status">
          <div className="bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-3xl shadow-xl text-center text-balance">{toast}</div>
        </div>
      )}
    </div>
  )
}

// ---------- Pieces ----------

function Icon({ name }: { name: Tab }) {
  const paths: Record<Tab, string> = {
    home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
    students: 'M16 19v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V19M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 19v-1.5a4 4 0 0 0-3-3.85M15.5 3.2a3.5 3.5 0 0 1 0 6.6',
    earnings: 'M12 3v18M16.5 7.5c-.6-1.4-2.2-2.2-4.5-2.2-2.6 0-4.3 1.2-4.3 3.1 0 4.5 9.1 2.1 9.1 6.8 0 2-1.9 3.3-4.8 3.3-2.6 0-4.4-1-5-2.7',
    messages: 'M4 5h16v11H9l-5 4V5Z',
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
  s: Student; reports: Report[]; recaps: Data['recaps']; maps: MapsApp; onEdit: () => void; onContact: () => void
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
      {s.format === 'In-home' && s.street && (
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
        <Btn kind="action" onClick={onContact}>Message {who(s)}</Btn>
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

function FinishSheet({ lesson, s, previous, lastNote, onClose, onSubmit }: {
  lesson: Lesson
  s: Student
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
  const { pay, label } = lessonPay(lesson, s)

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
              <span className="text-slate-600 text-sm whitespace-nowrap">{lesson.is_intro ? 'Intro pay is not decided yet' : 'At the teacher rate'}</span>
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
              <Choice active={missed === 'charge'} onClick={() => setMissed('charge')} title="Count the lesson" desc={`The student uses a lesson. Teacher rate ${money(pay)}.`} />
              <Choice active={missed === 'waive'} onClick={() => setMissed('waive')} title="Let it go this time" desc="The student keeps the lesson. No teacher pay." />
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
    default_minutes: s.default_minutes, street: s.street, city: s.city, arrival: s.arrival, contact_label: s.contact_label,
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
            <input className={field} placeholder="Street address" aria-label="Street address" autoComplete="off" value={d.street ?? ''} onChange={e => set('street', e.target.value || null)} />
            <input className={field} placeholder="City, state, zip" aria-label="City" autoComplete="off" value={d.city ?? ''} onChange={e => set('city', e.target.value || null)} />
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

function ContactSheet({ s, onClose }: { s: Student; onClose: () => void }) {
  const digits = (p: string) => p.replace(/[^\d+]/g, '')
  return (
    <Sheet title={who(s)} onClose={onClose}>
      <div className="space-y-4">
        {s.contact_label && <p className="text-sm text-slate-600 -mt-2">Parent of {s.name}</p>}
        {s.emails.length === 0 && s.phones.length === 0 && <p className="text-sm text-slate-600">No email or phone tied to {s.name} in the tracker yet.</p>}
        {s.phones.map(p => (
          <div key={p} className="flex items-center justify-between gap-3">
            <span className="font-semibold text-slate-900 whitespace-nowrap">{p}</span>
            <div className="flex gap-2">
              <a href={`sms:${digits(p)}`} className={pill('action')}>Text</a>
              <a href={`tel:${digits(p)}`} className={pill('outline')}>Call</a>
            </div>
          </div>
        ))}
        {s.emails.map(e => (
          <div key={e} className="flex items-center justify-between gap-3">
            <span className="font-semibold text-slate-900 truncate min-w-0">{e}</span>
            <a href={`mailto:${e}`} className={pill('action', 'shrink-0')}>Email</a>
          </div>
        ))}
        <p className="text-xs text-slate-600 text-pretty pt-2">Opens your own phone or email for now. Messaging through Maestro comes later.</p>
      </div>
    </Sheet>
  )
}
