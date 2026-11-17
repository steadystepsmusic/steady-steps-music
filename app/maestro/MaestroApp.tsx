'use client'

import { useEffect, useState } from 'react'
import { Avatar, Btn, Chips, Choice, Label, Sheet, Stairs, Tag, Toggle, pill } from './ui'

// PROTOTYPE (2026-11-16). Clickable sketch of the teacher side. All data below
// is invented and lives in component state: a refresh resets it. Teachers see
// what a lesson pays them, never what the student paid.
//
// Design rules (Nik, 2026-11-16):
// - Phone first. About 90% of use is on a phone.
// - Everything clickable is a pill. Only actions are filled (black, or amber
//   for the one main action on a screen). Other clickable things are outlined.
// - Status labels are square tags, never pills, so they don't look clickable.
// - No line of text should wrap by accident on a phone.

type Tab = 'home' | 'students' | 'earnings' | 'messages'
type Overlay =
  | { kind: 'profile' }
  | { kind: 'refer' }
  | { kind: 'offer' }
  | { kind: 'finish'; lessonId: string }
  | { kind: 'move'; lessonId: string }
  | { kind: 'thread'; studentId: string }
  | { kind: 'office' }
  | null

type Student = {
  id: string
  name: string
  contact?: string
  instrument: string
  level: string
  age: string
  minutes: 30 | 45 | 60
  format: 'Zoom' | 'In-home'
  street?: string
  city?: string
  arrival?: string
  pays: number
  travel: number
  planNote: string
  notes: { date: string; by: string; text: string }[]
}

type Lesson = {
  id: string
  studentId: string
  offset: number // days from today
  day: string
  time: string
  status: 'needs-wrap-up' | 'upcoming' | 'submitted'
}

type Outcome = 'taught' | 'charge' | 'waive'
type EarningRow = {
  id: string; date: string; studentId: string; amount: number; label: string
  status: 'Approved' | 'In review' | 'Waived'
  lessonId?: string; notes?: string; outcome?: Outcome // kept so an unapproved lesson can be changed
}
type NewRow = Omit<EarningRow, 'id' | 'date' | 'studentId' | 'lessonId'>
type Demo = 'normal' | 'new' | 'offline'
type Message = { from: 'me' | 'them'; text: string; when: string }
type MapsApp = 'Apple Maps' | 'Google Maps'

const TEACHER = 'Jordan'

const STUDENTS: Student[] = [
  {
    id: 'maya', name: 'Maya R.', instrument: 'Guitar', level: 'Beginner', age: 'Adult', minutes: 30, format: 'Zoom',
    pays: 36, travel: 0, planNote: '2 lessons left this month',
    notes: [
      { date: 'Nov 9', by: 'You', text: 'G to C change is getting smoother. Started the strumming pattern for the verse. Practice: 5 slow changes a day.' },
      { date: 'Nov 2', by: 'You', text: 'First full lesson. Tuned by ear with the app, learned G and Em. She wants to play at a family campfire in June.' },
    ],
  },
  {
    id: 'owen', name: 'Owen T.', contact: 'Parent: Dana T.', instrument: 'Piano', level: 'Beginner', age: 'Age 11', minutes: 30, format: 'In-home',
    street: '4821 W Juniper Hollow Ct', city: 'Meridian, ID 83646', arrival: 'Side gate on the left. Piano is in the front room.',
    pays: 40, travel: 15, planNote: '1 lesson left',
    notes: [
      { date: 'Nov 3', by: 'You', text: 'Right hand melody of his video game theme, first 8 bars. Left hand next week. Loves figuring notes out by ear.' },
      { date: 'Oct 27', by: 'You (intro lesson)', text: 'Picks things up quickly by ear. Gets restless after about 20 minutes, so switch activities halfway.' },
    ],
  },
  {
    id: 'priya', name: 'Priya S.', instrument: 'Voice', level: 'Intermediate', age: 'Adult', minutes: 60, format: 'Zoom',
    pays: 72, travel: 0, planNote: '3 lessons left',
    notes: [
      { date: 'Nov 11', by: 'You', text: 'Breath support on long phrases. Moved the song down a whole step and the chorus opened up.' },
    ],
  },
  {
    id: 'leo', name: 'Leo K.', contact: 'Parent: Robin K.', instrument: 'Guitar', level: 'Intermediate', age: 'Age 15', minutes: 45, format: 'Zoom',
    pays: 56, travel: 0, planNote: 'Paid through this week. Steady Steps is handling the renewal.',
    notes: [
      { date: 'Nov 12', by: 'You', text: 'Minor pentatonic, box 1 and 2. Wrote a four-bar lick of his own. Send the backing track link.' },
    ],
  },
]

const LESSONS: Lesson[] = [
  { id: 'p1', studentId: 'leo', offset: -4, day: 'Thu, Nov 12', time: '5:00 PM', status: 'submitted' },
  { id: 'l1', studentId: 'maya', offset: 0, day: 'Today', time: '3:30 PM', status: 'needs-wrap-up' },
  { id: 'l2', studentId: 'leo', offset: 0, day: 'Today', time: '5:00 PM', status: 'upcoming' },
  { id: 'l3', studentId: 'owen', offset: 1, day: 'Tomorrow', time: '4:15 PM', status: 'upcoming' },
  { id: 'l4', studentId: 'priya', offset: 2, day: 'In 2 days', time: '6:00 PM', status: 'upcoming' },
]

const EARNINGS: EarningRow[] = [
  { id: 'e8', date: 'Nov 12', studentId: 'leo', amount: 56, label: '45 min', status: 'In review', lessonId: 'p1', outcome: 'taught', notes: 'Minor pentatonic, box 1 and 2. Wrote a four-bar lick of his own. Send the backing track link.' },
  { id: 'e7', date: 'Nov 11', studentId: 'priya', amount: 72, label: '60 min', status: 'Approved' },
  { id: 'e6', date: 'Nov 10', studentId: 'owen', amount: 0, label: 'Missed, waived', status: 'Waived' },
  { id: 'e5', date: 'Nov 9', studentId: 'maya', amount: 36, label: '30 min', status: 'Approved' },
  { id: 'e4', date: 'Nov 5', studentId: 'leo', amount: 56, label: '45 min', status: 'Approved' },
  { id: 'e3', date: 'Nov 4', studentId: 'priya', amount: 72, label: '60 min', status: 'Approved' },
  { id: 'e2', date: 'Nov 3', studentId: 'owen', amount: 55, label: '30 min + $15 travel', status: 'Approved' },
  { id: 'e1', date: 'Nov 2', studentId: 'maya', amount: 36, label: '30 min', status: 'Approved' },
]

const PAST_PAYOUTS = [
  { date: 'Nov 5', period: 'October lessons', amount: 498 },
  { date: 'Oct 5', period: 'September lessons', amount: 312 },
]

// The teacher's direct line to Steady Steps admin. Only admin sees it (Nik, 2026-11-17).
const OFFICE: Message[] = [
  { from: 'me', text: 'Is it OK if I move Priya to Thursdays starting next week? She asked.', when: 'Nov 13, 2:40 PM' },
  { from: 'them', text: 'Yes, go ahead. Thanks for checking. Nik', when: 'Nov 13, 3:05 PM' },
]

const THREADS: Record<string, Message[]> = {
  owen: [
    { from: 'them', text: 'Hi Jordan, the side gate will be open tomorrow. Owen has been playing his song for everyone who walks in the door.', when: 'Today, 9:12 AM' },
  ],
  maya: [
    { from: 'me', text: 'Here is the strumming pattern from today, slowed down. Count it out loud the first few times.', when: 'Nov 9, 4:10 PM' },
    { from: 'them', text: 'Got it, thank you! The counting helps a lot.', when: 'Nov 9, 7:45 PM' },
  ],
  priya: [
    { from: 'me', text: 'Nice work tonight. Try the chorus in the new key once a day this week.', when: 'Nov 11, 7:05 PM' },
  ],
}

const QUICK_REPLIES = ['Running 5 minutes late', 'See you at our usual time', 'Here is the link for today']
const ZOOM_SUMMARY = 'Reviewed the G to C change at a slower tempo, then played the full verse with the recording. Added the D chord. Practice plan: verse with the recording twice a day, D chord changes for two minutes.'

const INSTRUMENTS = ['Guitar', 'Bass', 'Piano', 'Voice', 'Ukulele', 'Songwriting']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const AGES = ['Kids 9 to 12', 'Teens', 'Adults']
type Teaching = { levels: Record<string, string[]>; ages: string[] }
const APPROVED: Teaching = {
  levels: { Guitar: ['Beginner', 'Intermediate', 'Advanced'], Piano: ['Beginner'], Voice: ['Beginner', 'Intermediate'] },
  ages: ['Kids 9 to 12', 'Teens', 'Adults'],
}

const student = (id: string) => STUDENTS.find(s => s.id === id)!
// Hours from now until a lesson starts. Inside 24 hours, moving it needs the family's OK (Nik, 2026-11-17).
const hoursUntil = (l: Lesson, now: Date | null) => {
  if (!now) return Infinity
  const [clock, ampm] = l.time.split(' ')
  const [h, m] = clock.split(':').map(Number)
  const start = new Date(now)
  start.setDate(start.getDate() + l.offset)
  start.setHours((h % 12) + (ampm === 'PM' ? 12 : 0), m, 0, 0)
  return (start.getTime() - now.getTime()) / 36e5
}
const money = (n: number) => `$${n.toFixed(2)}`
const flip = (list: string[], o: string) => (list.includes(o) ? list.filter(x => x !== o) : [...list, o])
const same = (a: Teaching, b: Teaching) =>
  [...a.ages].sort().join() === [...b.ages].sort().join() &&
  INSTRUMENTS.every(i => [...(a.levels[i] ?? [])].sort().join() === [...(b.levels[i] ?? [])].sort().join())
const directions = (s: Student, app: MapsApp) => {
  const dest = encodeURIComponent(`${s.street}, ${s.city}`)
  return app === 'Apple Maps' ? `https://maps.apple.com/?daddr=${dest}` : `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}

// ---------- Building blocks ----------

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
        <div className="font-semibold text-slate-900">{s.city}</div>
        {s.arrival && <div className="text-slate-600 mt-1 text-pretty">{s.arrival}</div>}
      </div>
    </div>
  )
}

// Profile state lives at the top so it survives closing the sheet.
function useProfile() {
  const [taking, setTaking] = useState(true)
  const [capacity, setCapacity] = useState(8)
  const [draft, setDraft] = useState<Teaching>(APPROVED)
  const [sent, setSent] = useState<Teaching | null>(null)
  const [maps, setMaps] = useState<MapsApp>('Apple Maps')
  const [picked, setPicked] = useState<Record<string, string[]>>({
    'Lesson lengths': ['30 min', '45 min', '60 min'],
    'Where you teach': ['Zoom', 'In-home'],
    'Days you teach': ['Mon', 'Tue', 'Wed', 'Thu'],
  })
  return { taking, setTaking, capacity, setCapacity, draft, setDraft, sent, setSent, maps, setMaps, picked, setPicked }
}
type Profile = ReturnType<typeof useProfile>

// ---------- App ----------

export default function MaestroApp() {
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [rawLessons, setLessons] = useState(LESSONS)
  const [now, setNow] = useState<Date | null>(null) // set after load, so it is the phone's own clock
  const [allEarnings, setEarnings] = useState(EARNINGS)
  const [allThreads, setThreads] = useState(THREADS)
  const [office, setOffice] = useState(OFFICE)
  const [offer, setOffer] = useState<'open' | 'accepted' | 'passed'>('open')
  const [introTime, setIntroTime] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [minutesLeft, setMinutesLeft] = useState(21 * 60 + 14)
  const [moved, setMoved] = useState<Record<string, string>>({}) // lessonId -> what was asked
  const [demo, setDemo] = useState<Demo>('normal') // prototype-only preview switch
  const [openStudent, setOpenStudent] = useState<string | null>(null)
  const profile = useProfile()
  const close = () => setOverlay(null)

  useEffect(() => {
    const tick = () => { setNow(new Date()); setMinutesLeft(m => Math.max(0, m - 1)) }
    const first = setTimeout(() => setNow(new Date()), 0)
    const t = setInterval(tick, 60000)
    return () => { clearTimeout(first); clearInterval(t) }
  }, [])

  const hour = now?.getHours()
  const greeting = hour === undefined ? 'Welcome' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = now?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) ?? '\u00a0'
  const isNew = demo === 'new' // a teacher on day one, before any students
  const students = isNew ? [] : STUDENTS
  const earnings = isNew ? [] : allEarnings
  const threads = isNew ? {} : allThreads
  const lessons = (isNew ? [] : rawLessons).map(l => {
    if (!now || l.offset < 2) return l
    const d = new Date(now); d.setDate(d.getDate() + l.offset)
    return { ...l, day: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }
  })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const countdown = `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m`
  const needsWrapUp = lessons.filter(l => l.status === 'needs-wrap-up')
  const upcoming = lessons.filter(l => l.status === 'upcoming')
  const days = [...new Set(upcoming.map(l => l.day))]
  const unread = Object.values(threads).filter(t => t[t.length - 1].from === 'them').length
  const payoutTotal = earnings.reduce((sum, r) => sum + r.amount, 0)
  const inReview = earnings.filter(r => r.status === 'In review').reduce((sum, r) => sum + r.amount, 0)

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'home', label: 'Home', badge: needsWrapUp.length + (offer === 'open' && !isNew ? 1 : 0) },
    { id: 'students', label: 'Students' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'messages', label: 'Messages', badge: unread },
  ]

  function submitLesson(lessonId: string, row: NewRow, message: string) {
    if (demo === 'offline') {
      setToast('Not sent. Check your connection and try again.') // the panel stays open, nothing is lost
      return
    }
    const lesson = lessons.find(l => l.id === lessonId)!
    setLessons(ls => ls.map(l => (l.id === lessonId ? { ...l, status: 'submitted' } : l)))
    setEarnings(rows => {
      const old = rows.find(r => r.lessonId === lessonId)
      if (old) return rows.map(r => (r === old ? { ...old, ...row } : r)) // changing an unapproved lesson
      const date = now?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? 'Today'
      return [{ id: `new-${lessonId}`, date, studentId: lesson.studentId, lessonId, ...row }, ...rows]
    })
    close()
    setToast(message)
  }

  function send(studentId: string, text: string) {
    if (!text.trim()) return
    setThreads(t => ({ ...t, [studentId]: [...(t[studentId] ?? []), { from: 'me', text: text.trim(), when: 'Just now' }] }))
  }

  const openThread = (studentId: string) => { setTab('messages'); setOverlay({ kind: 'thread', studentId }) }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-10">
      <div className="bg-amber-400 text-slate-900 text-xs font-bold px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="whitespace-nowrap">PROTOTYPE · Made-up data</span>
        <div className="flex items-center gap-1.5" role="group" aria-label="Preview a situation">
          {([['normal', 'Normal'], ['new', 'Day one'], ['offline', 'Offline']] as [Demo, string][]).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setDemo(id)} aria-pressed={demo === id} className={`min-h-8 px-3 rounded-full border-2 border-slate-900 whitespace-nowrap ${demo === id ? 'bg-slate-900 text-white' : 'text-slate-900'}`}>
              {label}
            </button>
          ))}
          <a href="/maestro/admin" className="min-h-8 px-3 inline-flex items-center rounded-full border-2 border-slate-900 text-slate-900 whitespace-nowrap">Admin view</a>
        </div>
      </div>

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
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`min-h-11 px-4 rounded-full text-sm font-bold transition-colors ${tab === t.id ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white'}`}
              >
                {t.label}
                {!!t.badge && <span className="ml-2 bg-amber-500 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => setOverlay({ kind: 'profile' })} className="rounded-full ring-2 ring-slate-500 hover:ring-teal-400 focus:outline-none focus:ring-teal-400" aria-label="Your profile">
            <Avatar name={TEACHER} tone="slate" />
          </button>
        </div>
      </header>

      {demo === 'offline' && (
        <div className="bg-red-50 border-b border-red-200" role="alert">
          <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 text-sm text-red-950">
              <div className="font-bold">No connection</div>
              <div className="text-pretty">Showing what was saved at 4:12 PM.</div>
            </div>
            <Btn className="shrink-0" onClick={() => { setDemo('normal'); setToast('Back online.') }}>Try again</Btn>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-5 pt-7">
        {tab === 'home' && (
          <div className="space-y-7">
            <div>
              <p className="text-slate-600 text-sm font-medium">{today}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{greeting}, {TEACHER}</h1>
            </div>

            {isNew && (
              <Empty title="You are all set up" text="Your first student will show up here. We will also email you, so you do not need to keep checking." />
            )}
            {!isNew && offer === 'open' && (
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 shadow-lg">
                <div className="text-teal-400 text-xs font-bold uppercase tracking-widest">New student for you</div>
                <div className="text-white text-2xl font-black mt-2">Adult beginner, guitar</div>
                <div className="text-slate-300 mt-1">Zoom · 30 min weekly</div>
                <div className="text-slate-300">Weekday evenings</div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Btn kind="primary" onClick={() => setOverlay({ kind: 'offer' })}>See the details</Btn>
                  <span className="text-amber-400 text-sm font-bold whitespace-nowrap">{countdown} left to answer</span>
                </div>
              </div>
            )}
            {!isNew && offer === 'accepted' && (
              <div className="rounded-3xl bg-teal-50 border border-teal-200 p-5">
                <div className="font-bold text-teal-900">Intro lesson with Elena M.</div>
                <div className="font-bold text-teal-900">{introTime}</div>
                <div className="text-sm text-teal-900 mt-1 text-pretty">She has been emailed the time and the Zoom link. It is on your calendar.</div>
              </div>
            )}
            {!isNew && offer === 'passed' && (
              <div className="rounded-3xl bg-white border border-slate-200 p-5 text-sm text-slate-600 text-pretty">
                You passed on a new student. Thanks for answering quickly.
              </div>
            )}

            {needsWrapUp.length > 0 && (
              <section>
                <Label>Wrap up</Label>
                <div className="space-y-3">
                  {needsWrapUp.map(l => {
                    const s = student(l.studentId)
                    return (
                      <div key={l.id} className="bg-white rounded-3xl border-2 border-amber-300 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Avatar name={s.name} />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900">{s.name}</div>
                            <div className="text-sm text-slate-600 whitespace-nowrap">{l.time} · {s.instrument} · {s.minutes} min</div>
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
                  {upcoming.filter(l => l.day === day).map(l => {
                    const s = student(l.studentId)
                    const [clock, ampm] = l.time.split(' ')
                    return (
                      <div key={l.id} className="bg-white rounded-3xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 shrink-0 text-center">
                            <div className="font-black text-slate-900 leading-tight">{clock}</div>
                            <div className="text-[11px] font-bold text-slate-500">{ampm}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">{s.name}</div>
                            <div className="text-sm text-slate-600 truncate">{s.instrument} · {s.minutes} min</div>
                          </div>
                          {s.format === 'Zoom'
                            ? <Btn kind="action" onClick={() => setToast('This would open the Zoom room.')}>Join Zoom</Btn>
                            : <a href={directions(s, profile.maps)} target="_blank" rel="noreferrer" className={pill('action')}>Directions</a>}
                        </div>
                        {s.street && (
                          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                            <Address s={s} />
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <Btn onClick={() => openThread(s.id)}>Message</Btn>
                          {moved[l.id]
                            ? <Tag tone="amber">{moved[l.id]}</Tag>
                            : <Btn onClick={() => setOverlay({ kind: 'move', lessonId: l.id })}>Reschedule</Btn>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}

            {!isNew && upcoming.length === 0 && needsWrapUp.length === 0 && (
              <Empty title="No lessons coming up" text="Lessons appear here when they are on your Steady Steps calendar." />
            )}

            <section className="bg-white rounded-3xl border border-slate-200 p-5">
              <div className="font-bold text-slate-900">Know someone who would fit?</div>
              <p className="text-sm text-slate-600 mt-1 mb-4 text-pretty">Send us a student who wants lessons, or a teacher you would vouch for.</p>
              <Btn onClick={() => setOverlay({ kind: 'refer' })}>Refer someone</Btn>
            </section>
          </div>
        )}

        {tab === 'students' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Your students</h1>
            {students.length === 0 && <Empty title="No students yet" text="When you take a student, they show up here with their notes and contact." />}
            {students.map(s => {
              const open = openStudent === s.id
              return (
                <div key={s.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                  <button type="button" onClick={() => setOpenStudent(open ? null : s.id)} aria-expanded={open} className="w-full text-left p-4 flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{s.name}</div>
                      <div className="text-sm text-slate-600 truncate">{s.instrument} · {s.level}</div>
                    </div>
                    <span className={pill('outline')}>{open ? 'Close' : 'Open'}</span>
                  </button>
                  {open && (
                    <div className="px-4 pb-5 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Tag tone="teal">{s.minutes} min weekly</Tag>
                        <Tag tone="slate">{s.format}</Tag>
                        <Tag tone="slate">{s.age}</Tag>
                      </div>
                      {s.contact && <p className="text-sm font-semibold text-slate-900">{s.contact}</p>}
                      <p className="text-sm text-slate-600 text-pretty">{s.planNote}</p>
                      {s.street && (
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 space-y-3">
                          <Address s={s} />
                          <a href={directions(s, profile.maps)} target="_blank" rel="noreferrer" className={pill('action')}>Directions</a>
                        </div>
                      )}
                      <div>
                        <Label>Lesson notes</Label>
                        <div className="space-y-3">
                          {s.notes.map(n => (
                            <div key={n.date} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                              <div className="text-xs font-semibold text-slate-600 mb-1">{n.date} · {n.by}</div>
                              <div className="text-sm text-slate-800 leading-relaxed text-pretty">{n.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Btn kind="action" onClick={() => openThread(s.id)}>
                        Message {s.contact ? s.contact.replace('Parent: ', '') : s.name}
                      </Btn>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'earnings' && (
          <div className="space-y-7">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Earnings</h1>
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 shadow-lg">
              <div className="text-teal-400 text-xs font-bold uppercase tracking-widest">Next payout · December 5</div>
              <div className="text-white text-5xl font-black mt-3 tracking-tight tabular-nums">{money(payoutTotal)}</div>
              <div className="text-slate-300 text-sm mt-2">November lessons so far</div>
              {inReview > 0 && <div className="text-amber-400 text-sm font-semibold">{money(inReview)} still in review</div>}
            </div>

            {earnings.length === 0 && <Empty title="Nothing earned yet" text="Each lesson you finish shows up here, with the day it will be paid." />}
            {earnings.length > 0 && (
            <section>
              <Label>November lessons</Label>
              <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
                {earnings.map(r => (
                  <div key={r.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 truncate">{student(r.studentId).name}</div>
                      <div className="text-xs text-slate-600 whitespace-nowrap">{r.date} · {r.label}</div>
                    </div>
                    {r.lessonId && r.status !== 'Approved' && (
                      <Btn className="shrink-0" onClick={() => setOverlay({ kind: 'finish', lessonId: r.lessonId! })} aria-label={`Change the ${r.date} lesson with ${student(r.studentId).name}`}>Change</Btn>
                    )}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <div className="font-black text-slate-900 tabular-nums">{money(r.amount)}</div>
                      <Tag tone={r.status === 'Approved' ? 'teal' : r.status === 'In review' ? 'amber' : 'slate'}>{r.status}</Tag>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-3 text-pretty">You can change a lesson until it is approved. After that, message Steady Steps.</p>
            </section>
            )}

            {!isNew && (
            <section>
              <Label>Paid</Label>
              <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
                {PAST_PAYOUTS.map(p => (
                  <div key={p.date} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 whitespace-nowrap">{p.period}</div>
                      <div className="text-xs text-slate-600 whitespace-nowrap">Paid {p.date} to your bank</div>
                    </div>
                    <div className="font-black text-slate-900 tabular-nums">{money(p.amount)}</div>
                  </div>
                ))}
              </div>
            </section>
            )}
          </div>
        )}

        {tab === 'messages' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Messages</h1>
            <button type="button" onClick={() => setOverlay({ kind: 'office' })} className="w-full text-left bg-slate-900 rounded-3xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-slate-800 flex items-center justify-center"><Stairs size={18} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">Steady Steps</div>
                <div className="text-sm text-slate-300 truncate">{office.length ? `${office[office.length - 1].from === 'me' ? 'You: ' : ''}${office[office.length - 1].text}` : 'Pay, schedule, a problem, anything'}</div>
              </div>
              <span className={pill('primary')}>Open</span>
            </button>
            <Label>Your students</Label>
            <p className="text-sm text-slate-600 -mt-1 text-pretty">These go out as email from Steady Steps Music. Replies come back here.</p>
            {students.length === 0 && <Empty title="No messages yet" text="Once you have a student, you can message them here." />}
            <div className={students.length ? 'bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100' : 'hidden'}>
              {students.map(s => {
                const thread = threads[s.id] ?? []
                const last = thread[thread.length - 1]
                const isNew = last?.from === 'them'
                return (
                  <button key={s.id} type="button" onClick={() => setOverlay({ kind: 'thread', studentId: s.id })} className="w-full text-left p-4 flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {s.contact ? `${s.contact.replace('Parent: ', '')} (${s.name})` : s.name}
                      </div>
                      <div className={`text-sm truncate ${isNew ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                        {last ? `${last.from === 'me' ? 'You: ' : ''}${last.text}` : 'No messages yet'}
                      </div>
                    </div>
                    <span className={pill(isNew ? 'action' : 'outline')}>{isNew ? 'Reply' : 'Open'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Phone tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-4 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`relative flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[11px] font-bold ${tab === t.id ? 'bg-teal-50 text-teal-800' : 'text-slate-600'}`}
          >
            <Icon name={t.id} />
            {t.label}
            {!!t.badge && <span className="absolute top-0.5 left-1/2 ml-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 rounded-full">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {overlay?.kind === 'profile' && <ProfileSheet profile={profile} current={students.length} onOffice={() => setOverlay({ kind: 'office' })} onClose={close} onToast={setToast} onRefer={() => setOverlay({ kind: 'refer' })} />}
      {overlay?.kind === 'refer' && <ReferSheet onClose={close} onSent={who => { close(); setToast(`Thank you. We will reach out to ${who}.`) }} />}
      {overlay?.kind === 'offer' && (
        <OfferSheet
          countdown={countdown}
          onClose={close}
          onAccept={time => { setOffer('accepted'); setIntroTime(time); close(); setToast('Intro lesson booked.') }}
          onPass={() => { setOffer('passed'); close(); setToast('Passed. The student goes back to Steady Steps.') }}
        />
      )}
      {overlay?.kind === 'finish' && (
        <FinishSheet
          lesson={lessons.find(l => l.id === overlay.lessonId)!}
          previous={earnings.find(r => r.lessonId === overlay.lessonId)}
          onClose={close}
          onSubmit={submitLesson}
        />
      )}
      {overlay?.kind === 'move' && (
        <MoveSheet
          lesson={lessons.find(l => l.id === overlay.lessonId)!}
          soon={hoursUntil(lessons.find(l => l.id === overlay.lessonId)!, now) < 24}
          onClose={close}
          onDone={(tag, message) => { setMoved(m => ({ ...m, [overlay.lessonId]: tag })); close(); setToast(message) }}
        />
      )}
      {overlay?.kind === 'thread' && (() => {
        const s = student(overlay.studentId)
        return (
          <ThreadSheet
            title={s.contact ? s.contact.replace('Parent: ', '') : s.name}
            subtitle={s.contact ? `Parent of ${s.name}` : undefined}
            quick={QUICK_REPLIES}
            footnote="Sent as email from Steady Steps Music. Replies show up here."
            messages={threads[overlay.studentId] ?? []}
            onClose={close}
            onSend={text => send(overlay.studentId, text)}
          />
        )
      })()}
      {overlay?.kind === 'office' && (
        <ThreadSheet
          title="Steady Steps"
          subtitle="Goes straight to Nik and the admin team. Students and families never see this."
          footnote="Pay questions, schedule changes, a problem with a student, anything."
          messages={office}
          onClose={close}
          onSend={text => text.trim() && setOffice(o => [...o, { from: 'me', text: text.trim(), when: 'Just now' }])}
        />
      )}

      {toast && (
        <div className="fixed bottom-28 md:bottom-8 inset-x-0 z-[60] flex justify-center px-5 pointer-events-none" role="status">
          <div className="bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-3xl shadow-xl text-center text-balance">{toast}</div>
        </div>
      )}
    </div>
  )
}

// ---------- Sheets ----------

function ProfileSheet({ profile: p, current, onOffice, onClose, onToast, onRefer }: { profile: Profile; current: number; onOffice: () => void; onClose: () => void; onToast: (m: string) => void; onRefer: () => void }) {
  const groups: Record<string, string[]> = {
    'Lesson lengths': ['30 min', '45 min', '60 min'],
    'Where you teach': ['Zoom', 'In-home'],
    'Days you teach': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  }
  const waiting = p.sent !== null
  const shown = p.sent ?? p.draft
  const changed = !waiting && !same(p.draft, APPROVED)
  const toggleLevel = (inst: string, level: string) =>
    p.setDraft(d => ({ ...d, levels: { ...d.levels, [inst]: flip(d.levels[inst] ?? [], level) } }))

  return (
    <Sheet title="Your profile" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-black">J</div>
          <div className="min-w-0">
            <div className="font-black text-slate-900 text-xl">Jordan Ellis</div>
            <div className="text-sm text-slate-600 whitespace-nowrap">Teaching since Sep 2026</div>
            <div className="text-sm text-slate-600">Boise, ID</div>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-bold text-slate-900">Taking new students</div>
              <div className="text-sm text-slate-600 text-pretty">{p.taking ? 'We send you students who fit.' : 'Paused. No new students.'}</div>
            </div>
            <Toggle on={p.taking} onClick={() => p.setTaking(o => !o)} label="Taking new students" />
          </div>
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="min-w-0">
              <div className="font-bold text-slate-900">Students you want</div>
              <div className="text-sm text-slate-600">You have {current} now</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => p.setCapacity(c => Math.max(current, c - 1))} className="w-11 h-11 rounded-full border-2 border-slate-300 hover:border-slate-500 text-slate-800 text-xl font-bold" aria-label="Fewer students">−</button>
              <span className="w-8 text-center text-2xl font-black text-slate-900 tabular-nums">{p.capacity}</span>
              <button type="button" onClick={() => p.setCapacity(c => Math.min(30, c + 1))} className="w-11 h-11 rounded-full border-2 border-slate-300 hover:border-slate-500 text-slate-800 text-xl font-bold" aria-label="More students">+</button>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border-2 p-4 ${waiting ? 'border-amber-300 bg-amber-50/50' : changed ? 'border-teal-500' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="font-bold text-slate-900">What you teach</div>
            {waiting && <Tag tone="amber">Waiting</Tag>}
          </div>
          <p className="text-sm text-slate-600 mb-3 text-pretty">
            {waiting
              ? 'Steady Steps is reviewing your changes. Until then, students are matched on your approved profile.'
              : 'Tap the levels you teach for each instrument. Changes go to Steady Steps for approval.'}
          </p>
          <div className="divide-y divide-slate-100">
            {INSTRUMENTS.map(inst => {
              const levels = shown.levels[inst] ?? []
              return (
                <div key={inst} className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${levels.length ? 'text-slate-900' : 'text-slate-500'}`}>{inst}</span>
                    {!levels.length && <span className="text-xs text-slate-500">Not teaching</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map(level => {
                      const on = levels.includes(level)
                      return (
                        <button
                          key={level}
                          type="button"
                          disabled={waiting}
                          onClick={() => toggleLevel(inst, level)}
                          aria-pressed={on}
                          aria-label={`${inst} ${level}`}
                          className={`min-h-11 rounded-full border-2 text-xs font-bold transition-colors ${on ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-slate-300 text-slate-600'} ${waiting ? 'opacity-70' : 'hover:border-slate-500'}`}
                        >
                          {level}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="pt-4 border-t border-slate-100">
            <div className="font-bold text-slate-900 mb-2">Ages</div>
            <Chips options={AGES} picked={shown.ages} disabled={waiting} onToggle={o => p.setDraft(d => ({ ...d, ages: flip(d.ages, o) }))} />
          </div>
          {changed && (
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Btn onClick={() => p.setDraft(APPROVED)}>Undo</Btn>
              <Btn kind="primary" onClick={() => { p.setSent(p.draft); onToast('Sent to Steady Steps for approval.') }}>Send to approve</Btn>
            </div>
          )}
          {waiting && (
            <Btn className="mt-4" onClick={() => { p.setSent(null); p.setDraft(APPROVED); onToast('Request withdrawn.') }}>Withdraw request</Btn>
          )}
        </div>

        {Object.keys(groups).map(g => (
          <div key={g}>
            <Label>{g}</Label>
            <Chips options={groups[g]} picked={p.picked[g]} onToggle={o => p.setPicked(prev => ({ ...prev, [g]: flip(prev[g], o) }))} />
            {g === 'Where you teach' && p.picked[g].includes('In-home') && (
              <p className="text-sm text-slate-600 mt-2 text-pretty">In-home within 10 miles of Boise. You keep the full $15 travel fee.</p>
            )}
            {g === 'Days you teach' && <p className="text-sm text-slate-600 mt-2 text-pretty">Your open times come from your Steady Steps calendar.</p>}
          </div>
        ))}

        <div>
          <Label>Maps app for directions</Label>
          <Chips options={['Apple Maps', 'Google Maps']} picked={[p.maps]} onToggle={o => p.setMaps(o as MapsApp)} />
        </div>

        <div>
          <Label>Getting paid</Label>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {[['Bank account', 'Checking ··4417'], ['Payday', '5th of each month'], ['Tax form', 'W-9 on file']].map(([k, v]) => (
              <div key={k} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-600 whitespace-nowrap">{k}</span>
                <span className="font-semibold text-slate-900 whitespace-nowrap">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Btn onClick={onRefer}>Refer a student or teacher</Btn>
          <Btn onClick={onOffice}>Message Steady Steps</Btn>
          {['Teacher agreement', 'Sign out'].map(item => (
            <Btn key={item} onClick={() => onToast('Not wired up in the prototype.')}>{item}</Btn>
          ))}
        </div>
      </div>
    </Sheet>
  )
}

function ReferSheet({ onClose, onSent }: { onClose: () => void; onSent: (who: string) => void }) {
  const [who, setWho] = useState<'student' | 'teacher' | null>(null)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [heads, setHeads] = useState<string | null>(null)
  const [instruments, setInstruments] = useState<string[]>([])
  const field = 'w-full min-h-12 rounded-2xl border-2 border-slate-300 focus:border-teal-500 outline-none px-4 text-slate-900'
  const ready = who && name.trim() && contact.trim() && heads

  return (
    <Sheet title="Refer someone" onClose={onClose}>
      <div className="space-y-5">
        <div className="space-y-3">
          <Choice active={who === 'student'} onClick={() => setWho('student')} title="A student" desc="Someone who wants lessons." />
          <Choice active={who === 'teacher'} onClick={() => setWho('teacher')} title="A teacher" desc="Someone you would vouch for." />
        </div>

        {who && (
          <>
            <div>
              <label htmlFor="ref-name" className="block text-sm font-bold text-slate-900 mb-1.5">Their name</label>
              <input id="ref-name" value={name} onChange={e => setName(e.target.value)} autoComplete="off" className={field} />
            </div>
            <div>
              <label htmlFor="ref-contact" className="block text-sm font-bold text-slate-900 mb-1.5">Their phone or email</label>
              <input id="ref-contact" value={contact} onChange={e => setContact(e.target.value)} autoComplete="off" className={field} />
            </div>
            <div>
              <Label>{who === 'student' ? 'What they want to learn' : 'What they teach'}</Label>
              <Chips options={INSTRUMENTS} picked={instruments} onToggle={o => setInstruments(i => flip(i, o))} />
            </div>
            <div>
              <Label>Do they know we will reach out?</Label>
              <Chips options={['Yes, they are expecting it', 'Not yet']} picked={heads ? [heads] : []} onToggle={setHeads} />
            </div>
            {who === 'student' && (
              <p className="text-sm text-slate-600 text-pretty">If they sign up and you teach their instrument, they are offered to you first.</p>
            )}
            <Btn kind="primary" disabled={!ready} onClick={() => onSent(name.trim())} className="w-full">Send referral</Btn>
          </>
        )}
      </div>
    </Sheet>
  )
}

function OfferSheet({ countdown, onClose, onAccept, onPass }: { countdown: string; onClose: () => void; onAccept: (time: string) => void; onPass: () => void }) {
  const [step, setStep] = useState<'details' | 'time' | 'pass'>('details')
  const [time, setTime] = useState<string | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const times = ['Wed, Nov 18 · 5:30 PM', 'Thu, Nov 19 · 6:00 PM', 'Mon, Nov 23 · 5:30 PM']
  const reasons = ['My schedule is full', 'Those times do not work', 'Not the right fit for me', 'Something else']
  const facts = [
    ['Instrument', 'Acoustic guitar'],
    ['Level', 'Beginner'],
    ['Age', 'Adult'],
    ['Lessons', 'Zoom · 30 min weekly'],
    ['Free times', 'Weekdays after 5 PM'],
    ['Each lesson pays you', '$40.00'],
  ]
  return (
    <Sheet title="New student" onClose={onClose}>
      {step === 'details' && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name="Elena M." />
            <div>
              <div className="font-black text-slate-900 text-xl">Elena M.</div>
              <div className="text-sm text-amber-800 font-bold whitespace-nowrap">{countdown} left to answer</div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
            <Label>In her words</Label>
            <p className="text-slate-800 leading-relaxed text-pretty">&ldquo;I want to play and sing a few songs for my kids. I played a little in high school, and my guitar has been in the closet for ten years.&rdquo;</p>
          </div>
          <dl className="divide-y divide-slate-100">
            {facts.map(([k, v]) => (
              <div key={k} className="py-2.5 flex justify-between gap-4 text-sm">
                <dt className="text-slate-600 whitespace-nowrap">{k}</dt>
                <dd className="font-bold text-slate-900 text-right whitespace-nowrap">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-slate-600 text-pretty">You give her a free 15-minute intro lesson. If she signs up, she is yours every week.</p>
          <div className="grid grid-cols-2 gap-3">
            <Btn onClick={() => setStep('pass')}>Pass</Btn>
            <Btn kind="primary" onClick={() => setStep('time')}>Take student</Btn>
          </div>
        </div>
      )}
      {step === 'time' && (
        <div className="space-y-4">
          <p className="text-slate-700 text-pretty">Pick a time for the free 15-minute intro. These are open on your calendar and match her free times.</p>
          {times.map(t => <Choice key={t} active={time === t} onClick={() => setTime(t)} title={t} />)}
          <div className="grid grid-cols-2 gap-3">
            <Btn onClick={() => setStep('details')}>Back</Btn>
            <Btn kind="primary" disabled={!time} onClick={() => time && onAccept(time)}>Book intro</Btn>
          </div>
        </div>
      )}
      {step === 'pass' && (
        <div className="space-y-4">
          <p className="text-slate-700 text-pretty">No problem. Passing never counts against you. What is the reason?</p>
          {reasons.map(r => <Choice key={r} active={reason === r} onClick={() => setReason(r)} title={r} />)}
          <div className="grid grid-cols-2 gap-3">
            <Btn onClick={() => setStep('details')}>Back</Btn>
            <Btn kind="action" disabled={!reason} onClick={onPass}>Pass</Btn>
          </div>
        </div>
      )}
    </Sheet>
  )
}

function LessonHead({ lesson }: { lesson: Lesson }) {
  const s = student(lesson.studentId)
  return (
    <div className="flex items-center gap-4">
      <Avatar name={s.name} />
      <div className="min-w-0">
        <div className="font-black text-slate-900 text-lg">{s.name}</div>
        <div className="text-sm text-slate-600 whitespace-nowrap">{lesson.day}, {lesson.time}</div>
        <div className="text-sm text-slate-600 whitespace-nowrap">{s.instrument} · {s.minutes} min · {s.format}</div>
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

// Rescheduling is the normal path. Asking for a sub is the last resort, one step further in.
function MoveSheet({ lesson, soon, onClose, onDone }: { lesson: Lesson; soon: boolean; onClose: () => void; onDone: (tag: string, message: string) => void }) {
  const s = student(lesson.studentId)
  const who = s.contact ? s.contact.replace('Parent: ', '') : s.name
  const [step, setStep] = useState<'move' | 'sub'>('move')
  const [time, setTime] = useState<string | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const times = ['Thursday · 4:30 PM', 'Friday · 3:00 PM', 'Saturday · 10:00 AM']
  const reasons = ['I am sick', 'Family emergency', 'Something else']
  return (
    <Sheet title={step === 'move' ? 'Reschedule' : 'Ask for a sub'} onClose={onClose}>
      <div className="space-y-5">
        <LessonHead lesson={lesson} />
        {step === 'move' && (
          <>
            <div>
              <Label>Pick a new time</Label>
              <div className="space-y-3">
                {times.map(t => <Choice key={t} active={time === t} onClick={() => setTime(t)} title={t} />)}
              </div>
              <p className="text-sm text-slate-600 mt-3 text-pretty">These are open on your calendar.</p>
            </div>
            {soon ? (
              <>
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950 space-y-2">
                  <p className="font-bold">This lesson is less than 24 hours away.</p>
                  <p className="text-pretty">Moving it now is a favor to ask, so {who} has to agree. The lesson stays where it is unless they say yes.</p>
                </div>
                <Btn kind="primary" className="w-full" disabled={!time} onClick={() => onDone('Asked to move', `Asked ${who} if the lesson can move.`)}>Ask {who}</Btn>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 text-pretty">The lesson is more than 24 hours away, so it moves right away. We let {who} know.</p>
                <Btn kind="primary" className="w-full" disabled={!time} onClick={() => onDone(`Moved to ${time}`, `Lesson moved. We let ${who} know.`)}>Move lesson</Btn>
              </>
            )}
            <div className="pt-5 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-3 text-pretty">None of these work and you cannot teach this lesson?</p>
              <Btn onClick={() => setStep('sub')}>Ask for a sub</Btn>
            </div>
          </>
        )}
        {step === 'sub' && (
          <>
            <p className="text-sm text-slate-700 text-pretty">Steady Steps will look for another teacher for this one lesson. {s.name} stays your student.</p>
            <div>
              <Label>Reason</Label>
              <div className="space-y-3">
                {reasons.map(r => <Choice key={r} active={reason === r} onClick={() => setReason(r)} title={r} />)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Btn onClick={() => setStep('move')}>Back</Btn>
              <Btn kind="action" disabled={!reason} onClick={() => onDone('Sub requested', 'Sub request sent to Steady Steps.')}>Send request</Btn>
            </div>
          </>
        )}
      </div>
    </Sheet>
  )
}

function FinishSheet({ lesson, previous, onClose, onSubmit }: {
  lesson: Lesson
  previous?: EarningRow // set when changing a lesson that is not approved yet
  onClose: () => void
  onSubmit: (lessonId: string, row: NewRow, message: string) => void
}) {
  const s = student(lesson.studentId)
  const was = previous?.outcome
  const [outcome, setOutcome] = useState<'taught' | 'missed' | null>(was ? (was === 'taught' ? 'taught' : 'missed') : null)
  const [missed, setMissed] = useState<'charge' | 'waive' | null>(was && was !== 'taught' ? was : null)
  const [notes, setNotes] = useState(previous?.notes ?? '')
  const total = s.pays + s.travel
  const base = `${s.minutes} min${s.travel ? ` + $${s.travel} travel` : ''}`

  return (
    <Sheet title={previous ? 'Change lesson' : 'Finish lesson'} onClose={onClose}>
      <div className="space-y-5">
        <LessonHead lesson={lesson} />

        <div className="space-y-3">
          <Choice active={outcome === 'taught'} onClick={() => setOutcome('taught')} title="We had the lesson" />
          <Choice active={outcome === 'missed'} onClick={() => setOutcome('missed')} title="The student missed it" desc="No-show or a last-minute cancel" />
        </div>

        {outcome === 'taught' && (
          <>
            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-slate-900 mb-2">Lesson notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={5}
                placeholder="What you worked on, and what to practice."
                className="w-full rounded-2xl border-2 border-slate-300 focus:border-teal-500 outline-none p-3.5 text-slate-900 leading-relaxed"
              />
              {s.format === 'Zoom' && <Btn className="mt-2" onClick={() => setNotes(ZOOM_SUMMARY)}>Use the Zoom summary</Btn>}
              <p className="text-xs text-slate-600 mt-2 text-pretty">Notes stay with the student, so whoever teaches them next can pick up where you left off.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3">
              <span className="text-slate-600 text-sm whitespace-nowrap">This lesson pays you</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">{money(total)}</span>
            </div>
            <Btn
              kind="primary"
              className="w-full"
              disabled={!notes.trim()}
              onClick={() => onSubmit(lesson.id, { amount: total, label: base, status: 'In review', outcome: 'taught', notes }, previous ? 'Lesson updated.' : `Submitted. ${money(total)} added to your payout.`)}
            >
              {previous ? 'Save changes' : 'Submit lesson'}
            </Btn>
          </>
        )}

        {outcome === 'missed' && (
          <>
            <div className="space-y-3">
              <Choice active={missed === 'charge'} onClick={() => setMissed('charge')} title="Count the lesson" desc={`The student uses a lesson. You are paid ${money(total)}.`} />
              <Choice active={missed === 'waive'} onClick={() => setMissed('waive')} title="Let it go this time" desc="The student keeps the lesson. You are not paid." />
            </div>
            <Btn
              kind="primary"
              className="w-full"
              disabled={!missed}
              onClick={() => missed === 'charge'
                ? onSubmit(lesson.id, { amount: total, label: 'Missed, counted', status: 'In review', outcome: 'charge' }, previous ? 'Lesson updated.' : `Submitted. ${money(total)} added to your payout.`)
                : onSubmit(lesson.id, { amount: 0, label: 'Missed, waived', status: 'Waived', outcome: 'waive' }, previous ? 'Lesson updated.' : 'Submitted. The student keeps the lesson.')}
            >
              {previous ? 'Save changes' : 'Submit'}
            </Btn>
          </>
        )}
      </div>
    </Sheet>
  )
}

function ThreadSheet({ title, subtitle, quick = [], footnote, messages, onClose, onSend }: {
  title: string
  subtitle?: string
  quick?: string[]
  footnote: string
  messages: Message[]
  onClose: () => void
  onSend: (text: string) => void
}) {
  const [draft, setDraft] = useState('')
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="space-y-4">
        {subtitle && <p className="text-sm text-slate-600 -mt-2 text-pretty">{subtitle}</p>}
        <div className="space-y-3 min-h-24">
          {messages.length === 0 && <p className="text-sm text-slate-600 text-center py-8">No messages yet.</p>}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                <div className={`px-4 py-2.5 rounded-3xl text-sm leading-relaxed text-pretty ${m.from === 'me' ? 'bg-slate-900 text-white rounded-br-lg' : 'bg-slate-100 text-slate-900 rounded-bl-lg'}`}>{m.text}</div>
                <div className={`text-[11px] text-slate-500 mt-1 ${m.from === 'me' ? 'text-right' : ''}`}>{m.when}</div>
              </div>
            </div>
          ))}
        </div>
        {quick.length > 0 && (
          <div className="flex flex-col items-start gap-2">
            {quick.map(q => <Btn key={q} onClick={() => onSend(q)}>{q}</Btn>)}
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); onSend(draft); setDraft('') }} className="flex gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Write a message"
            aria-label={`Message ${title}`}
            className="flex-1 min-w-0 min-h-11 rounded-full border-2 border-slate-300 focus:border-teal-500 outline-none px-4 text-slate-900"
          />
          <button type="submit" disabled={!draft.trim()} className={pill('primary')}>Send</button>
        </form>
        <p className="text-xs text-slate-600 text-pretty">{footnote}</p>
      </div>
    </Sheet>
  )
}
