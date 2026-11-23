import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Maestro v0 (2026-11-23): Nik uses the teacher side with his own students to R&D it.
// Data lives in Supabase. The student tracker on Nik's Mac pushes the roster, calendar
// lessons and recaps every 15 minutes (sync_maestro.py) and pulls lesson reports back.
// Schema and security rules: supabase/maestro_schema.sql.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Implicit flow so a sign-in link works even when it is opened on a different device
// than the one that asked for it.
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } }) : null

export type Teacher = { id: string; email: string; name: string; is_admin: boolean; created_at: string }

export type WorkingOn = {
  summary?: string
  current?: { topic: string; stage?: string; note?: string }[]
  next?: string[]
}

export type Student = {
  id: string
  name: string
  status: string
  emails: string[]
  phones: string[]
  inquiry_instrument: string | null
  working_on: WorkingOn | null
  instrument: string | null
  level: string | null
  age_group: string | null
  format: 'Zoom' | 'In-home' | null
  default_minutes: number | null
  street: string | null
  city: string | null
  arrival: string | null
  contact_label: string | null
}
export type StudentDetails = Pick<Student, 'instrument' | 'level' | 'age_group' | 'format' | 'default_minutes' | 'street' | 'city' | 'arrival' | 'contact_label'>

export type Lesson = {
  id: string
  student_id: string
  starts_at: string
  ends_at: string
  title: string | null
  is_intro: boolean
  zoom_url: string | null
  location: string | null
}

export type Outcome = 'taught' | 'charge' | 'waive'
export type Report = {
  lesson_id: string
  student_id: string
  lesson_starts_at: string
  outcome: Outcome
  notes: string | null
  minutes: number
  teacher_pay: number
  status: 'submitted' | 'approved'
  submitted_at: string
}

// Admin only (RLS): what a student pays per lesson, from the tracker's monthly figure
export type Rate = { id: string; monthly_rate: number | null; lessons_per_month: number; lesson_rate: number; source: string | null; by_date?: Record<string, number> | null }

export type Recap = { id: string; student_id: string; sent_at: string; subject: string | null; body: string | null }

// Teacher pay on the $2/min card at the fixed 70/30 split, rounded down (Nik, 2026-11-17).
export const TEACHER_PAY: Record<number, number> = { 30: 42, 45: 58, 60: 75 }
export const TRAVEL = 15

export const lessonMinutes = (l: Lesson) => Math.round((new Date(l.ends_at).getTime() - new Date(l.starts_at).getTime()) / 60000)
// Calendar blocks are not always exact; pay goes by the nearest card length
export const cardMinutes = (m: number) => [30, 45, 60].reduce((a, b) => (Math.abs(b - m) < Math.abs(a - m) ? b : a))

export function lessonPay(l: Lesson, s: Student | undefined) {
  if (l.is_intro) return { minutes: lessonMinutes(l), pay: 0, label: 'Intro lesson' } // paid or not is still open (Nik, 11/17)
  const minutes = cardMinutes(lessonMinutes(l))
  const travel = s?.format === 'In-home' ? TRAVEL : 0
  return { minutes, pay: TEACHER_PAY[minutes] + travel, label: `${minutes} min${travel ? ` + $${travel} travel` : ''}` }
}

export async function loadAll(db: SupabaseClient) {
  const since = new Date(Date.now() - 45 * 864e5).toISOString()
  // Through the end of this month (for Earnings), and at least two weeks out (for Home)
  const now = new Date()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const until = new Date(Math.max(monthEnd.getTime(), Date.now() + 15 * 864e5)).toISOString()
  const [students, lessons, reports, recaps, sync, rates] = await Promise.all([
    db.from('students').select('*').in('status', ['active', 'paused']).order('name'),
    db.from('lessons').select('*').eq('cancelled', false).gte('starts_at', since).lte('starts_at', until).order('starts_at'),
    db.from('lesson_reports').select('*').gte('lesson_starts_at', new Date(Date.now() - 70 * 864e5).toISOString()).order('lesson_starts_at', { ascending: false }),
    db.from('recaps').select('*').order('sent_at', { ascending: false }),
    db.from('sync_status').select('*').eq('id', 'tracker').maybeSingle(),
    db.from('student_rates').select('*'), // empty for teachers; a missing table is not fatal
  ])
  const err = students.error || lessons.error || reports.error || recaps.error || sync.error
  if (err) throw err
  return {
    students: (students.data ?? []) as Student[],
    lessons: (lessons.data ?? []) as Lesson[],
    reports: (reports.data ?? []) as Report[],
    recaps: (recaps.data ?? []) as Recap[],
    syncedAt: (sync.data?.last_synced_at as string | undefined) ?? null,
    rates: (rates.error ? [] : rates.data ?? []) as Rate[],
  }
}
export type Data = Awaited<ReturnType<typeof loadAll>>
