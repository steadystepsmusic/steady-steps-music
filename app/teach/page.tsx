import Image from 'next/image'
import type { Metadata } from 'next'
import Footer from '../components/Footer'
import TeacherApplyForm from './TeacherApplyForm'

// PROTOTYPE (2026-11-13): teacher recruitment page for Phase 2.
// noindex, not in the sitemap, not linked from the live site. All copy is a
// draft for Nik to edit. Pay is deliberately NOT published here (Nik, 2026-11-13):
// no split, no per-lesson figures, no founding-teacher deal. Those are discussed
// on the call.

export const metadata: Metadata = {
  title: 'Teach with Steady Steps Music',
  description: 'Steady Steps Music matches music teachers with students who are ready to start. We handle the advertising and the billing.',
  robots: { index: false, follow: false },
}

const benefits = [
  {
    title: 'Students who are ready to start',
    desc: "We match each new student to you by instrument, level and schedule. You meet them in a free 15-minute intro lesson, so the first lesson is already yours and you know what they want to play.",
  },
  {
    title: 'No invoices to chase',
    desc: 'Students pay Steady Steps. You get paid on the 5th of each month for the lessons you taught.',
  },
  {
    title: 'Your schedule, your call',
    desc: "You set the days and times you're open. Every new student is an offer, and you can take it or pass.",
  },
  {
    title: 'Tools included',
    desc: 'A teacher portal shows your students, your schedule and your earnings. You also get a Steady Steps email address, and a Zoom account when you need one.',
  },
]

const lookingFor = [
  "You've taught private lessons before and you like working with beginners.",
  'You live in the Treasure Valley.',
  'You teach guitar, piano, bass or voice.',
  'You have a quiet room and a solid internet connection for Zoom lessons.',
  "You're happy to build lessons around the songs a student already loves.",
]

const faqs = [
  {
    q: 'Am I an employee?',
    a: "No. Teachers are independent contractors. You set your own availability, and you're free to keep teaching your own private students on the side.",
  },
  {
    q: 'How does pay work?',
    a: 'You earn a set share of every lesson you teach, paid on the 5th of each month. Nik walks through the numbers on your first call.',
  },
  {
    q: 'How many students will I get?',
    a: "That depends on your availability and what students are asking for. We're a small company, so expect to start with a few students and grow from there. We won't promise you a full schedule on day one.",
  },
  {
    q: 'Whose students are they?',
    a: 'Students sign up with Steady Steps and pay Steady Steps. If you stop teaching with us, we match them with another teacher.',
  },
  {
    q: 'Is there a set curriculum?',
    a: 'There is a shared approach. We start from the music a student loves and we train the ear early. Inside that, how you run a lesson is up to you.',
  },
  {
    q: 'Where do I need to live?',
    a: "Right now we're bringing on teachers in the Treasure Valley. Many lessons are on Zoom and some are in person around Boise.",
  },
  {
    q: 'What happens after I apply?',
    a: "Nik reads every application. If it looks like a fit, you'll get an email to set up a video call, and we'll ask you to teach a short sample lesson.",
  },
]

function Logo() {
  return (
    <a href="/" className="flex items-center gap-3">
      <svg viewBox="0 0 45 35" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
        <rect x="0"  y="30" width="15" height="5" fill="#162D6E"/>
        <rect x="10" y="25" width="5"  height="5" fill="#162D6E"/>
        <rect x="10" y="20" width="15" height="5" fill="#2563EB"/>
        <rect x="20" y="15" width="5"  height="5" fill="#2563EB"/>
        <rect x="20" y="10" width="15" height="5" fill="#7DD3FC"/>
        <rect x="30" y="5"  width="5"  height="5" fill="#7DD3FC"/>
        <rect x="30" y="0"  width="15" height="5" fill="#2DD4BF"/>
      </svg>
      <span className="font-bold text-white text-xl sm:text-2xl leading-tight whitespace-nowrap">
        Steady <span className="text-teal-400">Steps</span> Music
      </span>
    </a>
  )
}

export default function TeachPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-amber-400 text-slate-900 text-xs font-bold text-center py-1.5 px-4">
        PROTOTYPE · Teacher recruitment page · Not live
      </div>

      {/* Header: teacher pages get their own bar, with no student "Book Free Lesson" button */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-5">
            <a href="/" className="hidden sm:inline text-slate-300 hover:text-teal-400 text-sm font-medium transition-colors whitespace-nowrap">Looking for lessons?</a>
            <a href="#apply" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors whitespace-nowrap">Apply</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-16 flex flex-col items-center text-center gap-6">
          <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium px-4 py-2 rounded-full">
            For Music Teachers in the Treasure Valley
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            You teach.<br />
            <span className="text-teal-400">We find the students.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
            Steady Steps Music matches teachers with students who are ready to start. We handle the advertising and the billing. You show up and teach.
          </p>
          <a href="#apply" className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-amber-500/20">
            Apply to Teach →
          </a>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-sm justify-center">
            <span className="whitespace-nowrap">✓ Set your own schedule</span>
            <span className="whitespace-nowrap">✓ Teach online or in person</span>
            <span className="whitespace-nowrap">✓ Keep your own students</span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">What You Get</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">The Parts of Teaching Nobody Likes, Handled</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
                <div className="w-10 h-1 bg-teal-500 rounded-full mb-5" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we're looking for */}
      <section className="py-12 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">Who We&apos;re Looking For</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Teachers Who Like Teaching</h2>
          </div>
          <ul className="space-y-4">
            {lookingFor.map(item => (
              <li key={item} className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-slate-200 text-slate-700">
                <span className="text-teal-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Founder note */}
      <section className="py-12 md:py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-[240px_1fr] gap-10 items-center">
          <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl overflow-hidden mx-auto shadow-xl">
            <Image src="/images/about.jpeg" alt="Nik Mathews, founder of Steady Steps Music" fill className="object-cover" style={{ objectPosition: '50% 20%' }} />
          </div>
          <div>
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">From the Founder</p>
            <h2 className="text-3xl font-black text-white mb-5">Hi, I&apos;m Nik</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                I&apos;ve taught music for over 20 years. For most of that time, finding students was the hardest part of the job.
              </p>
              <p>
                I started Steady Steps to take that part off a teacher&apos;s plate. I still teach here every week, so I use the same tools you will.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">Questions</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">What Teachers Ask</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="scroll-mt-20 py-12 md:py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Apply</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Teach with Steady Steps</h2>
            <p className="text-slate-300 mt-4 max-w-xl mx-auto">It takes about five minutes. No resume needed.</p>
          </div>
          <TeacherApplyForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
