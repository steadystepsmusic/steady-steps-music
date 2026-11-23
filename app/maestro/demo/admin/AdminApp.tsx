'use client'

import { useEffect, useState } from 'react'
import { Avatar, Btn, Choice, Label, Sheet, Stairs, Tag } from '../../ui'

// PROTOTYPE (2026-11-16). The admin side: what Nik (and later an admin hire)
// sees. Invented data in component state; a refresh resets it. Unlike the
// teacher view, admin sees what the student paid and the Steady Steps share.
// Same rules: phone first, every decision is one tap, pills for anything
// clickable, square tags for status.

type Tab = 'todo' | 'inbox' | 'leads' | 'teachers'

// One inbox for everyone who writes to Steady Steps directly: teachers, students
// and parents (billing questions included). Teachers never see family threads here.
type Msg = { from: 'them' | 'us'; text: string; when: string }
type Convo = { id: string; name: string; who: 'Teacher' | 'Parent' | 'Student'; about?: string; topic: string; msgs: Msg[] }
const INBOX: Convo[] = [
  { id: 'c1', name: 'Dana T.', who: 'Parent', about: 'Owen T. · with Jordan', topic: 'Billing', msgs: [
    { from: 'them', text: 'Hi! Can we switch Owen to the monthly prepay? And was the travel fee charged twice in October?', when: 'Today, 8:41 AM' },
  ] },
  { id: 'c2', name: 'Jordan Ellis', who: 'Teacher', topic: 'Schedule', msgs: [
    { from: 'them', text: 'Is it OK if I move Priya to Thursdays starting next week? She asked.', when: 'Nov 13, 2:40 PM' },
    { from: 'us', text: 'Yes, go ahead. Thanks for checking. Nik', when: 'Nov 13, 3:05 PM' },
  ] },
  { id: 'c3', name: 'Priya S.', who: 'Student', about: 'with Jordan', topic: 'Lessons', msgs: [
    { from: 'them', text: 'Loving lessons with Jordan. Is there a way to add a second lesson some weeks before my show?', when: 'Yesterday, 7:15 PM' },
  ] },
]

type Teacher = {
  id: string
  name: string
  teaches: string
  open: string
  students: number
  wants: number
  taking: boolean
  trials: string
  notesOnTime: string
  lateCancels: number
  rating: string
}

type Todo =
  | { id: string; kind: 'lesson'; teacher: string; student: string; when: string; length: string; paid: number; teacherPay: number; note: string }
  | { id: string; kind: 'profile'; teacher: string; changes: string[] }
  | { id: string; kind: 'sub'; teacher: string; student: string; when: string; reason: string; free: string[] }
  | { id: string; kind: 'move'; teacher: string; student: string; from: string; to: string }
  | { id: string; kind: 'referral'; teacher: string; who: string; type: 'student' | 'teacher'; detail: string }

type Lead = {
  id: string
  name: string
  summary: string
  detail: string
  words: string
  source: string
  status: 'new' | 'offered' | 'expired' | 'trial' | 'won'
  teacherId?: string
  hoursLeft?: number
  fits: { teacherId: string; why: string }[]
}

const TEACHERS: Teacher[] = [
  { id: 'nik', name: 'Nik Mathews', teaches: 'Guitar, piano, voice, bass', open: 'Mon to Thu afternoons', students: 14, wants: 14, taking: false, trials: '11 of 34', notesOnTime: '100%', lateCancels: 0, rating: '5.0' },
  { id: 'jordan', name: 'Jordan Ellis', teaches: 'Guitar, piano, voice', open: 'Mon to Thu evenings', students: 4, wants: 8, taking: true, trials: '4 of 6', notesOnTime: '92%', lateCancels: 0, rating: '4.9' },
  { id: 'casey', name: 'Casey Morgan', teaches: 'Piano, voice', open: 'Tue, Thu, Sat', students: 6, wants: 10, taking: true, trials: '5 of 9', notesOnTime: '78%', lateCancels: 1, rating: '4.7' },
  { id: 'riley', name: 'Riley Chen', teaches: 'Guitar, bass, ukulele', open: 'Weekday mornings', students: 2, wants: 6, taking: true, trials: '2 of 5', notesOnTime: '100%', lateCancels: 0, rating: '4.8' },
]

const TODOS: Todo[] = [
  { id: 't1', kind: 'sub', teacher: 'Jordan Ellis', student: 'Leo K.', when: 'Today · 5:00 PM', reason: 'Sick', free: ['Riley Chen', 'Nik Mathews'] },
  { id: 't2', kind: 'lesson', teacher: 'Jordan Ellis', student: 'Leo K.', when: 'Nov 12', length: '45 min', paid: 81, teacherPay: 56, note: 'Minor pentatonic, box 1 and 2. Wrote a four-bar lick of his own.' },
  { id: 't3', kind: 'lesson', teacher: 'Casey Morgan', student: 'Ines V.', when: 'Nov 13', length: '30 min · monthly plan', paid: 52.2, teacherPay: 36, note: 'Missed, counted. No notes.' },
  { id: 't4', kind: 'profile', teacher: 'Jordan Ellis', changes: ['Add Bass: Beginner', 'Add Piano: Intermediate'] },
  { id: 't5', kind: 'move', teacher: 'Casey Morgan', student: 'Theo B.', from: 'Tue · 4:00 PM', to: 'Thu · 4:30 PM' },
  { id: 't6', kind: 'referral', teacher: 'Riley Chen', who: 'Alex Rivera', type: 'student', detail: 'Wants guitar · Expecting a call' },
]

const LEADS: Lead[] = [
  {
    id: 'ld1', name: 'Elena M.', summary: 'Adult beginner · Guitar', detail: 'Zoom · 30 min · Weekdays after 5 PM',
    words: 'I want to play and sing a few songs for my kids.', source: 'Google Ads', status: 'new',
    fits: [
      { teacherId: 'jordan', why: 'Teaches beginner guitar · Open evenings · 4 of 8' },
      { teacherId: 'riley', why: 'Teaches beginner guitar · Mornings only · 2 of 6' },
    ],
  },
  {
    id: 'ld2', name: 'Marcus D.', summary: 'Age 10 beginner · Piano', detail: 'In-home, Eagle · 30 min · Saturdays',
    words: 'He keeps picking out songs on his grandma’s piano.', source: 'Referral from Riley Chen', status: 'new',
    fits: [
      { teacherId: 'casey', why: 'Teaches kids piano · Open Saturdays · 6 of 10' },
      { teacherId: 'jordan', why: 'Teaches beginner piano · No Saturdays · 4 of 8' },
    ],
  },
  {
    id: 'ld3', name: 'Tasha W.', summary: 'Adult intermediate · Voice', detail: 'Zoom · 60 min · Tue or Thu',
    words: 'I sing in a cover band and want more range.', source: 'AI search', status: 'offered', teacherId: 'casey', hoursLeft: 19,
    fits: [{ teacherId: 'jordan', why: 'Teaches intermediate voice · Open evenings · 4 of 8' }],
  },
  {
    id: 'ld4', name: 'Greg P.', summary: 'Adult beginner · Bass', detail: 'Zoom · 30 min · Mornings',
    words: 'Finally learning the bass I bought in 2019.', source: 'YouTube', status: 'expired', teacherId: 'riley',
    fits: [{ teacherId: 'nik', why: 'Teaches bass · Not taking new students' }],
  },
  {
    id: 'ld5', name: 'Hana S.', summary: 'Age 14 beginner · Guitar', detail: 'Zoom · 30 min · After school',
    words: 'She wants to play her favorite songs.', source: 'Google Ads', status: 'trial', teacherId: 'jordan',
    fits: [],
  },
]

const money = (n: number) => `$${n.toFixed(2)}`
const teacher = (id: string) => TEACHERS.find(t => t.id === id)!

function Card({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'urgent' }) {
  return <div className={`bg-white rounded-3xl p-4 space-y-3 ${tone === 'urgent' ? 'border-2 border-amber-300' : 'border border-slate-200'}`}>{children}</div>
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-600 whitespace-nowrap">{k}</span>
      <span className="font-bold text-slate-900 text-right whitespace-nowrap tabular-nums">{v}</span>
    </div>
  )
}

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>('todo')
  const [todos, setTodos] = useState(TODOS)
  const [inbox, setInbox] = useState(INBOX)
  const [openConvo, setOpenConvo] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [leads, setLeads] = useState(LEADS)
  const [openLead, setOpenLead] = useState<string | null>(null)
  const [openTeacher, setOpenTeacher] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const finish = (id: string, message: string) => { setTodos(ts => ts.filter(t => t.id !== id)); setToast(message) }
  const offerTo = (leadId: string, teacherId: string) => {
    setLeads(ls => ls.map(l => (l.id === leadId ? { ...l, status: 'offered', teacherId, hoursLeft: 24 } : l)))
    setOpenLead(null)
    setToast(`Offered to ${teacher(teacherId).name}. They have 24 hours.`)
  }

  const needsYou = leads.filter(l => l.status === 'new' || l.status === 'expired').length
  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'todo', label: 'To do', badge: todos.length },
    { id: 'inbox', label: 'Inbox', badge: inbox.filter(c => c.msgs[c.msgs.length - 1].from === 'them').length },
    { id: 'leads', label: 'Leads', badge: needsYou },
    { id: 'teachers', label: 'Teachers' },
  ]
  const lead = leads.find(l => l.id === openLead)
  const shownTeacher = TEACHERS.find(t => t.id === openTeacher)

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-10">
      <div className="bg-amber-400 text-slate-900 text-xs font-bold px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="whitespace-nowrap">PROTOTYPE · Made-up data</span>
        <a href="/maestro/demo" className="min-h-8 px-3 inline-flex items-center rounded-full border-2 border-slate-900 text-slate-900 whitespace-nowrap">Teacher view</a>
      </div>

      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Stairs />
            <div className="leading-tight">
              <div className="text-white font-black text-xl tracking-tight">Maestro</div>
              <div className="text-teal-400 text-[11px] font-bold -mt-0.5 whitespace-nowrap uppercase tracking-widest">Admin</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`min-h-11 px-4 rounded-full text-sm font-bold transition-colors ${tab === t.id ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white'}`}>
                {t.label}
                {!!t.badge && <span className="ml-2 bg-amber-500 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
              </button>
            ))}
          </nav>
          <Avatar name="Nik" tone="slate" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pt-7">
        {tab === 'todo' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">To do</h1>
            {todos.length === 0 && (
              <div className="rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center">
                <div className="font-bold text-slate-900">All caught up</div>
                <p className="text-sm text-slate-600 mt-1 text-pretty">Teacher requests and lessons to approve show up here.</p>
              </div>
            )}
            {todos.map(t => {
              if (t.kind === 'sub') return (
                <Card key={t.id} tone="urgent">
                  <div className="flex items-center justify-between gap-3">
                    <Tag tone="amber">Sub needed</Tag>
                    <span className="text-sm font-bold text-amber-800 whitespace-nowrap">{t.when}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.teacher} cannot teach {t.student}</div>
                    <div className="text-sm text-slate-600">Reason: {t.reason}</div>
                  </div>
                  <Label>Free at that time</Label>
                  <div className="flex flex-col gap-2 -mt-1">
                    {t.free.map(name => (
                      <Btn key={name} kind="action" onClick={() => finish(t.id, `Asked ${name} to cover.`)}>Ask {name}</Btn>
                    ))}
                    <Btn onClick={() => finish(t.id, `Lesson cancelled. ${t.student} keeps the lesson.`)}>Cancel the lesson</Btn>
                  </div>
                </Card>
              )
              if (t.kind === 'lesson') return (
                <Card key={t.id}>
                  <div className="flex items-center justify-between gap-3">
                    <Tag tone="teal">Lesson to approve</Tag>
                    <span className="text-sm text-slate-600 whitespace-nowrap">{t.when}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.teacher} taught {t.student}</div>
                    <div className="text-sm text-slate-600">{t.length}</div>
                  </div>
                  <p className="text-sm text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl p-3 text-pretty">{t.note}</p>
                  <div className="space-y-1.5">
                    <Row k="Student paid" v={money(t.paid)} />
                    <Row k="Teacher gets" v={money(t.teacherPay)} />
                    <Row k="Steady Steps keeps" v={money(t.paid - t.teacherPay)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Btn onClick={() => finish(t.id, `Sent back to ${t.teacher}.`)}>Send back</Btn>
                    <Btn kind="primary" onClick={() => finish(t.id, `Approved. ${money(t.teacherPay)} queued for ${t.teacher}.`)}>Approve</Btn>
                  </div>
                </Card>
              )
              if (t.kind === 'profile') return (
                <Card key={t.id}>
                  <Tag tone="slate">Profile change</Tag>
                  <div className="font-bold text-slate-900">{t.teacher} wants to teach more</div>
                  <ul className="text-sm text-slate-800 space-y-1">
                    {t.changes.map(c => <li key={c}>{c}</li>)}
                  </ul>
                  <div className="grid grid-cols-2 gap-3">
                    <Btn onClick={() => finish(t.id, 'Declined. The teacher is told.')}>Decline</Btn>
                    <Btn kind="primary" onClick={() => finish(t.id, 'Approved. Matching uses the new profile.')}>Approve</Btn>
                  </div>
                </Card>
              )
              if (t.kind === 'move') return (
                <Card key={t.id}>
                  <Tag tone="slate">Reschedule</Tag>
                  <div className="font-bold text-slate-900">{t.teacher} asked to move {t.student}</div>
                  <div className="space-y-1.5">
                    <Row k="From" v={t.from} />
                    <Row k="To" v={t.to} />
                  </div>
                  <p className="text-sm text-slate-600 text-pretty">Waiting on the family to confirm. Nothing for you to do unless they say no.</p>
                  <Btn onClick={() => finish(t.id, 'Cleared from your list.')}>Got it</Btn>
                </Card>
              )
              return (
                <Card key={t.id}>
                  <Tag tone="teal">Referral</Tag>
                  <div className="font-bold text-slate-900">{t.teacher} referred a {t.type}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.who}</div>
                    <div className="text-sm text-slate-600">{t.detail}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Btn onClick={() => finish(t.id, 'Dismissed.')}>Dismiss</Btn>
                    <Btn kind="primary" onClick={() => finish(t.id, `${t.who} added to Leads.`)}>Add as lead</Btn>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {tab === 'inbox' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Inbox</h1>
            <p className="text-sm text-slate-600 text-pretty">Teachers, students and parents writing to Steady Steps directly. Billing questions land here too.</p>
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
              {inbox.map(c => {
                const last = c.msgs[c.msgs.length - 1]
                const waiting = last.from === 'them'
                return (
                  <button key={c.id} type="button" onClick={() => setOpenConvo(c.id)} className="w-full text-left p-4 flex items-center gap-3">
                    <Avatar name={c.name} tone={c.who === 'Teacher' ? 'slate' : 'teal'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-900 truncate">{c.name}</span>
                        <Tag tone={c.who === 'Teacher' ? 'slate' : 'teal'}>{c.who}</Tag>
                      </div>
                      <div className={`text-sm truncate ${waiting ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>{c.topic} · {last.text}</div>
                    </div>
                    <span className={`inline-flex items-center min-h-11 px-4 rounded-full text-sm font-bold whitespace-nowrap ${waiting ? 'bg-slate-900 text-white' : 'border-2 border-slate-300 text-slate-800'}`}>{waiting ? 'Reply' : 'Open'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'leads' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Leads</h1>
            {leads.map(l => {
              const needs = l.status === 'new' || l.status === 'expired'
              return (
                <Card key={l.id} tone={needs ? 'urgent' : 'plain'}>
                  <div className="flex items-center justify-between gap-3">
                    {l.status === 'new' && <Tag tone="amber">New</Tag>}
                    {l.status === 'offered' && <Tag tone="slate">Offered</Tag>}
                    {l.status === 'expired' && <Tag tone="amber">No answer in 24h</Tag>}
                    {l.status === 'trial' && <Tag tone="teal">Intro booked</Tag>}
                    {l.status === 'won' && <Tag tone="teal">Won</Tag>}
                    <span className="text-xs text-slate-600 truncate">{l.source}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{l.name}</div>
                    <div className="text-sm text-slate-800">{l.summary}</div>
                    <div className="text-sm text-slate-600">{l.detail}</div>
                  </div>
                  {l.status === 'offered' && <p className="text-sm text-slate-600">With {teacher(l.teacherId!).name} · {l.hoursLeft}h left</p>}
                  {l.status === 'expired' && <p className="text-sm text-slate-600">{teacher(l.teacherId!).name} did not answer.</p>}
                  {l.status === 'trial' && <p className="text-sm text-slate-600">With {teacher(l.teacherId!).name} · Wed 5:30 PM</p>}
                  {needs && <Btn kind="primary" className="w-full" onClick={() => setOpenLead(l.id)}>Choose a teacher</Btn>}
                  {l.status === 'offered' && <Btn onClick={() => setOpenLead(l.id)}>Give to someone else</Btn>}
                  {l.status === 'trial' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Btn onClick={() => { setLeads(ls => ls.filter(x => x.id !== l.id)); setToast('Marked lost.') }}>Lost</Btn>
                      <Btn kind="primary" onClick={() => { setLeads(ls => ls.map(x => (x.id === l.id ? { ...x, status: 'won' } : x))); setToast(`${l.name} is now a student.`) }}>Signed up</Btn>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {tab === 'teachers' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Teachers</h1>
            {TEACHERS.map(t => (
              <button key={t.id} type="button" onClick={() => setOpenTeacher(t.id)} className="w-full text-left bg-white rounded-3xl border border-slate-200 p-4 flex items-center gap-3">
                <Avatar name={t.name} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{t.name}</div>
                  <div className="text-sm text-slate-600 truncate">{t.students} of {t.wants} students · {t.taking ? 'Taking more' : 'Full'}</div>
                </div>
                <span className="inline-flex items-center min-h-11 px-4 rounded-full border-2 border-slate-300 text-sm font-bold text-slate-800">Open</span>
              </button>
            ))}
            <Btn onClick={() => setToast('This would open the teacher applications.')}>Applications</Btn>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-4 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined} className={`min-h-12 rounded-full text-sm font-bold ${tab === t.id ? 'bg-teal-50 text-teal-800' : 'text-slate-600'}`}>
            {t.label}
            {!!t.badge && <span className="ml-1.5 bg-amber-500 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {lead && (
        <Sheet title="Choose a teacher" onClose={() => setOpenLead(null)}>
          <div className="space-y-5">
            <div>
              <div className="font-black text-slate-900 text-lg">{lead.name}</div>
              <div className="text-sm text-slate-800">{lead.summary}</div>
              <div className="text-sm text-slate-600">{lead.detail}</div>
            </div>
            <p className="text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl p-4 leading-relaxed text-pretty">&ldquo;{lead.words}&rdquo;</p>
            <div>
              <Label>Best fits</Label>
              <div className="space-y-3">
                {lead.fits.filter(f => f.teacherId !== lead.teacherId).map(f => (
                  <Choice key={f.teacherId} active={false} onClick={() => offerTo(lead.id, f.teacherId)} title={`Offer to ${teacher(f.teacherId).name}`} desc={f.why} />
                ))}
                {lead.fits.filter(f => f.teacherId !== lead.teacherId).length === 0 && <p className="text-sm text-slate-600">No other teacher fits right now.</p>}
              </div>
              <p className="text-sm text-slate-600 mt-3 text-pretty">The teacher gets 24 hours to answer. The family&apos;s address stays hidden until they accept.</p>
            </div>
          </div>
        </Sheet>
      )}

      {openConvo && (() => {
        const c = inbox.find(x => x.id === openConvo)!
        const sendReply = (e: React.FormEvent) => {
          e.preventDefault()
          if (!draft.trim()) return
          setInbox(list => list.map(x => (x.id === c.id ? { ...x, msgs: [...x.msgs, { from: 'us', text: draft.trim(), when: 'Just now' }] } : x)))
          setDraft('')
        }
        return (
          <Sheet title={c.name} onClose={() => { setOpenConvo(null); setDraft('') }}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 -mt-1">
                <Tag tone={c.who === 'Teacher' ? 'slate' : 'teal'}>{c.who}</Tag>
                <Tag tone="slate">{c.topic}</Tag>
                {c.about && <span className="text-sm text-slate-600">{c.about}</span>}
              </div>
              <div className="space-y-3">
                {c.msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'us' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%]">
                      <div className={`px-4 py-2.5 rounded-3xl text-sm leading-relaxed text-pretty ${m.from === 'us' ? 'bg-slate-900 text-white rounded-br-lg' : 'bg-slate-100 text-slate-900 rounded-bl-lg'}`}>{m.text}</div>
                      <div className={`text-[11px] text-slate-500 mt-1 ${m.from === 'us' ? 'text-right' : ''}`}>{m.when}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendReply} className="flex gap-2">
                <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write a reply" aria-label={`Reply to ${c.name}`} className="flex-1 min-w-0 min-h-11 rounded-full border-2 border-slate-300 focus:border-teal-500 outline-none px-4 text-slate-900" />
                <button type="submit" disabled={!draft.trim()} className="inline-flex items-center min-h-11 px-4 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 disabled:bg-slate-200 disabled:text-slate-500">Send</button>
              </form>
              {c.who !== 'Teacher' && <p className="text-xs text-slate-600 text-pretty">Their teacher does not see this conversation.</p>}
            </div>
          </Sheet>
        )
      })()}

      {shownTeacher && (
        <Sheet title={shownTeacher.name} onClose={() => setOpenTeacher(null)}>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Tag tone={shownTeacher.taking ? 'teal' : 'slate'}>{shownTeacher.taking ? 'Taking students' : 'Not taking students'}</Tag>
              {shownTeacher.id === 'nik' && <Tag tone="slate">Founder · keeps 100%</Tag>}
            </div>
            <div className="space-y-2">
              <Row k="Teaches" v={shownTeacher.teaches} />
              <Row k="Open" v={shownTeacher.open} />
              <Row k="Students" v={`${shownTeacher.students} of ${shownTeacher.wants}`} />
            </div>
            <div>
              <Label>How it is going</Label>
              <div className="space-y-2">
                <Row k="Intros that signed up" v={shownTeacher.trials} />
                <Row k="Notes in on time" v={shownTeacher.notesOnTime} />
                <Row k="Late cancels" v={String(shownTeacher.lateCancels)} />
                <Row k="Student rating" v={shownTeacher.rating} />
              </div>
              <p className="text-sm text-slate-600 mt-3 text-pretty">These are shown to you only. They do not change who gets leads yet.</p>
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
