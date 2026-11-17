import Image from 'next/image'
import type { Metadata } from 'next'
import Nav from '../components/Nav'
import ContactForm from '../components/ContactForm'
import YouTubeFacade from '../components/YouTubeFacade'
import Footer from '../components/Footer'
import { REVIEWS, GOOGLE_LISTING_URL } from '../site'
import ReviewCarousel from '../components/ReviewCarousel'

// PROTOTYPE (2026-11-13): the homepage as a multi-teacher company for Phase 2.
// Same structure as app/page.tsx, with "we" voice, an Our Teachers section in
// place of "Hi, I'm Nik", and the free intro lesson with the matched teacher (Nik, 2026-11-17). No link to /teach
// anywhere on the student site (Nik, 2026-11-13).
// noindex, not in the sitemap, not linked from the live site. FAQs are local
// on purpose: the shared FAQS in site.ts feed the live FAQPage schema.

export const metadata: Metadata = {
  title: 'Team Homepage Prototype | Steady Steps Music',
  robots: { index: false, follow: false },
}

const teachers = [
  {
    name: 'Nik Mathews',
    role: 'Founder',
    teaches: 'Guitar · Bass · Piano · Voice',
    bio: 'Nik has taught for over 20 years and plays around Boise most weekends. He started Steady Steps and still teaches every week.',
    image: '/images/about.jpeg',
  },
  {
    name: 'Teacher Name',
    role: 'Teacher',
    teaches: 'Guitar · Voice',
    bio: 'A short bio goes here. Where they play, how long they have taught, and what they love teaching.',
    image: null,
  },
  {
    name: 'Teacher Name',
    role: 'Teacher',
    teaches: 'Piano · Music Theory',
    bio: 'A short bio goes here. Where they play, how long they have taught, and what they love teaching.',
    image: null,
  },
]

const lessons = [
  { name: 'Guitar',        desc: 'From your first open chord to advanced fingerpicking and lead playing. Acoustic or electric, all styles.', image: '/images/hero.jpeg' },
  { name: 'Bass',          desc: 'Lock in the groove and hold down the low end. Learn technique, theory, and how to play with a band.', image: '/images/bass.jpg' },
  { name: 'Piano',         desc: 'Build a strong foundation in keys: scales, chords, reading music, and playing songs you actually love.', image: '/images/piano.jpg' },
  { name: 'Voice',         desc: 'Develop your tone, range, and confidence. Breath control, pitch, technique, and performance covered.', image: '/images/singer.jpg' },
  { name: 'Music Theory',  desc: 'Understand how music actually works: intervals, scales, chord progressions, and how to apply it all.', image: '/images/music theory.jpg' },
  { name: 'Songwriting',   desc: 'Turn your ideas into real songs. Melody, lyrics, structure, and the creative process. All covered.', image: '/images/songwriting.jpg' },
]

const steps = [
  { title: 'Book Your Free Lesson', desc: "Fill out the form. We'll usually get back to you the same day and find a time for your free 15-minute intro lesson." },
  { title: 'Meet Your Teacher',     desc: "We match you with the teacher who fits what you want to play. Your free intro lesson is with them, so you know who you'd be learning from before you start." },
  { title: 'You Start Playing',     desc: "You'll leave your first lesson with something to work on. Every lesson after that picks up where the last one left off." },
]

const pricing = [
  {
    name: 'Intro Lesson',
    price: 'Free',
    duration: '15 min intro',
    highlight: true,
    features: ['No commitment required', 'Meet your teacher first', 'Matched to what you want to play', 'Online via Zoom'],
    cta: "Book Now. It's Free.",
  },
  {
    name: '30-Minute Lesson',
    price: '$58',
    duration: 'per session',
    highlight: false,
    features: ['Great for beginners & kids', 'Focused, efficient sessions', 'Online via Zoom or in-person*', 'Session notes sent after each lesson', 'Save 10% with monthly pre-pay'],
    cta: 'Get Started',
  },
  {
    name: '60-Minute Lesson',
    price: '$104',
    duration: 'per session',
    highlight: false,
    features: ['Deep dives & faster progress', 'Ideal for dedicated students', 'Online via Zoom or in-person*', 'Session notes sent after each lesson', 'Save 10% with monthly pre-pay'],
    cta: 'Get Started',
  },
]

const faqs = [
  {
    q: 'What happens in the free lesson?',
    a: "It's about 15 minutes, over Zoom, with Nik, our founder. He'll ask what you want to play and where you're starting from, and you can ask him anything. Nothing to prepare and no obligation to sign up after.",
  },
  {
    q: 'Who will my teacher be?',
    a: "Nik matches you after your free lesson, based on your instrument, your schedule and the music you want to play. If it isn't the right fit, tell us and we'll find you another teacher.",
  },
  {
    q: 'What ages do you teach?',
    a: "We teach from about 4th grade on up, including plenty of adults who are starting later than they wish they had. If your child is younger, reach out anyway and we'll talk about whether they're ready.",
  },
  {
    q: 'Do I need any prior experience?',
    a: 'No. Most of our students started with none. Beginning from scratch is an advantage, because we get to build the right habits before any bad ones set in. We also work with players who have hit a plateau and want a way through it.',
  },
  {
    q: "What if my child doesn't want to practice?",
    a: "That usually means the music isn't theirs yet. When a student picks what they're working on, practice stops feeling like a chore. Our teachers build lessons around what a student actually wants to play, and that's what keeps them coming back.",
  },
  {
    q: 'How do online lessons work?',
    a: 'You meet your teacher on Zoom. After each lesson you get a summary of what you covered and what to practice, plus any chord charts or sheet music you need.',
  },
  {
    q: 'Can I cancel or reschedule?',
    a: 'Life happens. We ask for at least 24 hours notice to reschedule or cancel. Lessons cancelled with less than 24 hours notice may be charged in full.',
  },
]

function Silhouette() {
  return (
    <div className="w-full h-full bg-slate-200 flex items-end justify-center">
      <svg viewBox="0 0 100 100" className="w-3/4 text-slate-400" fill="currentColor" aria-hidden="true">
        <circle cx="50" cy="38" r="18" />
        <path d="M14 100c0-22 16-34 36-34s36 12 36 34z" />
      </svg>
    </div>
  )
}

export default function TeamPreview() {
  return (
    <div className="min-h-screen">
      <Nav basePath="/team-preview" />

      {/* Hero */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-12 flex flex-col items-center text-center w-full gap-6">
          <div className="bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full">
            PROTOTYPE · Team version of the homepage · Not live
          </div>
          <div className="inline-flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium px-4 py-2 rounded-full">
            <span>Music Lessons in Boise, ID</span>
            <span className="hidden sm:inline">·</span>
            <span>Teaching Online by Zoom</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Want to learn music?<br />
            Start with <span className="text-teal-400 whitespace-nowrap">Steady Steps.</span>
          </h1>

          <a href="#contact" className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-colors text-center shadow-lg shadow-amber-500/20">
            Book a Free Lesson →
          </a>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-sm justify-center">
            <span className="whitespace-nowrap">✓ First lesson is free</span>
            <span className="whitespace-nowrap">✓ Kids 9+ and adults</span>
            <span className="whitespace-nowrap">✓ All skill levels</span>
          </div>

          <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
            <YouTubeFacade videoId="rrrnBaHFfa8" title="Welcome to Steady Steps Music" poster="/images/hero-video-poster.jpg" />
          </div>

          <p className="text-white text-base">
            Guitar &middot; Bass &middot; Piano &middot; Voice &middot; Songwriting &middot; Music Theory
          </p>
        </div>
      </section>

      {/* Our Teachers (replaces "Hi, I'm Nik") */}
      <section id="about" className="scroll-mt-20 py-12 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">Our Teachers</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Meet the People You&apos;ll Learn From</h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              Every Steady Steps teacher is a working musician, and they all teach the same way. We start with <strong className="text-slate-800">what you actually want to play</strong> and build from there.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden bg-white flex flex-col ${t.image ? 'border border-slate-100 shadow-sm' : 'border-2 border-dashed border-slate-300'}`}>
                <div className="relative w-full h-72">
                  {t.image
                    ? <Image src={t.image} alt={`${t.name}, ${t.role} at Steady Steps Music`} fill className="object-cover" style={{ objectPosition: '50% 20%' }} />
                    : <Silhouette />}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-teal-700 font-semibold text-xs uppercase tracking-widest mb-1">{t.role}</p>
                  <h3 className="text-xl font-bold text-slate-900">{t.name}</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-3">{t.teaches}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section id="lessons" className="scroll-mt-20 py-12 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">What We Teach</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Six Paths to Musical Growth</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Whether you&apos;re picking up your first instrument or leveling up an existing skill, there&apos;s a path for you, online or in-person in Boise, Idaho.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(l => (
              <a key={l.name} href="#contact" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all group cursor-pointer flex flex-col no-underline">
                <div className="relative w-full h-40 overflow-hidden">
                  <Image src={l.image} alt={l.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">{l.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{l.desc}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-700 group-hover:text-teal-800 transition-colors">
                    Start {l.name} Lessons →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-20 py-12 md:py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-teal-400">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map(s => (
              <div key={s.title}>
                <div className="w-10 h-1 bg-teal-500 rounded-full mb-5" />
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 py-12 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-teal-700">Pricing</h2>
            <p className="text-slate-600 mt-4">Start with a free intro lesson. No pressure, no commitment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {pricing.map(p => (
              <div key={p.name} className={`rounded-2xl p-8 border-2 transition-all ${p.highlight ? 'bg-teal-700 border-teal-700 shadow-2xl shadow-teal-500/20 md:scale-105' : 'bg-white border-slate-200 hover:border-teal-200'}`}>
                {p.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">Best Place to Start</span>
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</span>
                  <span className={`text-sm ml-2 ${p.highlight ? 'text-teal-100' : 'text-slate-600'}`}>{p.duration}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${p.highlight ? 'text-teal-50' : 'text-slate-600'}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${p.highlight ? 'text-teal-200' : 'text-teal-500'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block text-center py-3 rounded-xl font-bold transition-colors ${p.highlight ? 'bg-white text-teal-700 hover:bg-teal-50' : 'bg-teal-700 text-white hover:bg-teal-600'}`}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 text-sm mt-8">Pre-pay for the month and save 10%. Mention it when you book.</p>
          <p className="text-center text-slate-500 text-xs mt-3">* In-home lessons include an additional $15 travel fee per session, on top of the prices shown above.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-20 py-12 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">Student Stories</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">What Students Are Saying</h2>
            <p className="mt-3 text-slate-600"><span className="text-amber-400" aria-hidden="true">★</span> 5.0 on Google</p>
          </div>
          <ReviewCarousel reviews={REVIEWS.filter(t => t.quote)} perView={3} />
          <p className="text-center mt-8">
            <a href={GOOGLE_LISTING_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors">
              Read our reviews on Google →
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-12 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-700 font-semibold text-sm uppercase tracking-widest mb-3">Questions</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 py-12 md:py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Book Your Free Lesson</h2>
            <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-pretty">Fill out the form and we&apos;ll get back to you the same day to set up your{' '}
              <span className="whitespace-nowrap">free 15-minute intro lesson.</span></p>
          </div>
          <ContactForm team />
        </div>
      </section>

      <Footer />
    </div>
  )
}
