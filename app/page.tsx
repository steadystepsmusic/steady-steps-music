import Image from 'next/image'
import Nav from './components/Nav'
import ContactForm from './components/ContactForm'

// ─── Data ────────────────────────────────────────────────────────────────────

const lessons = [
  { name: 'Guitar',        desc: 'From your first open chord to advanced fingerpicking and lead playing. Acoustic or electric, all styles.', image: '/images/hero.jpeg' },
  { name: 'Bass',          desc: 'Lock in the groove and hold down the low end. Learn technique, theory, and how to play with a band.', image: '/images/bass.jpg' },
  { name: 'Piano',         desc: 'Build a strong foundation in keys: scales, chords, reading music, and playing songs you actually love.', image: '/images/piano.jpg' },
  { name: 'Voice',         desc: 'Develop your tone, range, and confidence. Breath control, pitch, technique, and performance covered.', image: '/images/singer.jpg' },
  { name: 'Music Theory',  desc: 'Understand how music actually works: intervals, scales, chord progressions, and how to apply it all.', image: '/images/music theory.jpg' },
  { name: 'Songwriting',   desc: 'Turn your ideas into real songs. Melody, lyrics, structure, and the creative process. All covered.', image: '/images/songwriting.jpg' },
]

const steps = [
  { step: '1', title: 'Book Your Free Lesson',  desc: "Fill out the contact form. I'll reach out within 24 hours to schedule your complimentary 15-minute demo session." },
  { step: '2', title: 'We Meet & Make a Plan',   desc: "We'll chat about your goals, your experience, and what you want to achieve. Then we'll map out a lesson plan just for you." },
  { step: '3', title: 'Start Making Progress',   desc: "Each lesson builds on the last. You'll leave every session with something new to practice and a clear sense of progress." },
]

const pricing = [
  {
    name: 'Demo Lesson',
    price: 'Free',
    duration: '15 min intro',
    highlight: true,
    features: ['No commitment required', 'Meet your teacher first', 'Get a personalized plan', 'Online or in-person'],
    cta: "Book Now. It's Free.",
  },
  {
    name: '30-Minute Lesson',
    price: '$50',
    duration: 'per session',
    highlight: false,
    features: ['Great for beginners & kids', 'Focused, efficient sessions', 'Online via Zoom or in-person', 'Session notes sent after each lesson', 'Save 10% with monthly pre-pay'],
    cta: 'Get Started',
  },
  {
    name: '60-Minute Lesson',
    price: '$90',
    duration: 'per session',
    highlight: false,
    features: ['Deep dives & faster progress', 'Ideal for dedicated students', 'Online via Zoom or in-person', 'Session notes sent after each lesson', 'Save 10% with monthly pre-pay'],
    cta: 'Get Started',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Guitar student, 6 months',
    quote: 'I went from not knowing a single chord to playing my favorite songs in just a few months. Nik has a gift for breaking things down so they actually make sense.',
  },
  {
    name: 'James T.',
    role: 'Piano student, adult learner',
    quote: "I always thought it was too late to learn piano as an adult. Nik proved me completely wrong. The lessons are structured, fun, and I'm making real progress every week.",
  },
  {
    name: 'Emily R.',
    role: 'Voice & songwriting student',
    quote: "Not only am I a better singer, I've written three songs I'm actually proud of. The songwriting sessions are the highlight of my week.",
  },
]

const faqs = [
  { q: 'Do I need my own instrument?',      a: "For in-person lessons, yes. Having your own instrument to practice at home is important. For online lessons you'll need the instrument plus a stable internet connection. I can recommend beginner-friendly instruments at any budget." },
  { q: 'What ages do you teach?',            a: 'I work with students from around 4th grade (age 9-10) and up: teenagers, adults, and seniors. Lessons are always tailored to your age, experience, and goals.' },
  { q: 'How do online lessons work?',        a: "We meet over Zoom or your preferred video platform. After each lesson I'll send you a summary of what we covered, exercises to practice, and any resources like chord charts or sheet music." },
  { q: 'Do I need any prior experience?',   a: "Not at all. Complete beginners are very welcome. Starting from scratch allows us to build good habits and attitudes about musical growth. I also work with intermediate and advanced students who want to break through a plateau." },
  { q: 'How often should I take lessons?',  a: "Once a week is the sweet spot for most students. It gives you enough time to practice between sessions without losing momentum. That said, I'm flexible. We can discuss what works best for your schedule." },
  { q: 'Can I cancel or reschedule?',       a: "Life happens! I ask for at least 24 hours notice to reschedule or cancel. Lessons cancelled with less than 24 hours notice may be charged in full." },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-slate-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
              Music Lessons in Boise, ID · Teaching Online Worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Music Lessons Made<br />
              <span className="text-teal-400">for You.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              Guitar, bass, piano, voice, music theory, and songwriting, online or in-person.
              Every lesson is built around <em>your</em> goals, your schedule, and your taste in music.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-colors text-center shadow-lg shadow-amber-500/20">
                Book a Free Lesson →
              </a>
              <a href="#lessons" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-lg transition-colors text-center border border-white/10">
                See All Lessons
              </a>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-slate-400 text-sm">
              <span className="whitespace-nowrap">✓ Free 15-min demo</span>
              <span className="whitespace-nowrap">✓ Student Interest Centered</span>
              <span className="whitespace-nowrap">✓ All skill levels</span>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-200 flex justify-center">
            <div className="relative w-full h-72 sm:h-96 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/20">
              <Image src="/images/hero.jpeg" alt="Nik Mathews, music teacher in Boise, Idaho" fill className="object-cover" priority />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
          <span className="text-xs">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="py-12 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 flex justify-center">
            <div className="relative w-full h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-xl">
              <Image src="/images/about.jpeg" alt="Nik Mathews, experienced music teacher in Boise, Idaho" fill className="object-cover" style={{objectPosition: '50% 25%'}} />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">About Your Teacher</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">Hi, I&apos;m Nik</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                I&apos;ve been playing music my whole life and teaching for over 20 years. I specialize in guitar, bass, piano, and voice. I believe anyone can learn to play music at any age, as long as they approach the learning in the right way.
              </p>
              <p>
                My approach is simple: we start with <strong className="text-slate-800">what you actually want to play</strong>. No boring exercises for the sake of it. No one-size-fits-all curriculum. Just clear, steady progress toward goals that matter to you.
              </p>
              <p>
                Based in Boise, Idaho, I teach students online across the country and in-person locally. Every lesson comes with a session summary so you always know what to practice and why.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[['20+', 'Years Teaching'], ['100+', 'Students Taught'], ['6', 'Musical Subjects']].map(([val, label]) => (
                <div key={label} className="bg-teal-50 rounded-2xl p-4">
                  <div className="text-2xl font-black text-teal-600">{val}</div>
                  <div className="text-slate-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lessons ──────────────────────────────────────────────────── */}
      <section id="lessons" className="py-12 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">What I Teach</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Six Paths to Musical Growth</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Whether you&apos;re picking up your first instrument or leveling up an existing skill, there&apos;s a path for you, online or in-person in Boise, Idaho.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(l => (
              <a key={l.name} href="#contact" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all group cursor-pointer flex flex-col no-underline">
                {l.image ? (
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image src={l.image} alt={l.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Photo Coming Soon</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">{l.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{l.desc}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
                    Start {l.name} Lessons →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-12 md:py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Three Steps to Get Started</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-2/3 w-full h-px border-t-2 border-dashed border-slate-700" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-full bg-teal-500 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
                  {s.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-12 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Clear, Simple Pricing</h2>
            <p className="text-slate-500 mt-4">Start with a free demo. No pressure, no commitment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {pricing.map(p => (
              <div key={p.name} className={`rounded-2xl p-8 border-2 transition-all ${p.highlight ? 'bg-teal-600 border-teal-600 shadow-2xl shadow-teal-500/20 md:scale-105' : 'bg-white border-slate-200 hover:border-teal-200'}`}>
                {p.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">Best Place to Start</span>
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</span>
                  <span className={`text-sm ml-2 ${p.highlight ? 'text-teal-100' : 'text-slate-400'}`}>{p.duration}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${p.highlight ? 'text-teal-50' : 'text-slate-600'}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${p.highlight ? 'text-teal-200' : 'text-teal-500'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block text-center py-3 rounded-xl font-bold transition-colors ${p.highlight ? 'bg-white text-teal-700 hover:bg-teal-50' : 'bg-teal-600 text-white hover:bg-teal-500'}`}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">Pre-pay for the month and save 10%. Mention it when you book.</p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-12 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Student Stories</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">What Students Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                <div className="text-amber-400 text-xl mb-4">★★★★★</div>
                <p className="text-slate-600 leading-relaxed mb-6 italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-slate-400 text-sm">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-12 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Questions</p>
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

      {/* ── Areas Served ─────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm mb-4">Serving Boise and the surrounding Treasure Valley</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Meridian',    href: '/meridian' },
              { label: 'Eagle',       href: '/eagle' },
              { label: 'Nampa',       href: '/nampa' },
              { label: 'Garden City', href: '/garden-city' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-500 text-sm hover:border-teal-400 hover:text-teal-600 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-12 md:py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Book Your Free Lesson</h2>
            <p className="text-slate-300 mt-4">Fill out the form and I&apos;ll get back to you within 24 hours to set up your free 15-minute demo session.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 45 35" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
              <rect x="0"  y="30" width="15" height="5" fill="#162D6E"/>
              <rect x="10" y="25" width="5"  height="5" fill="#162D6E"/>
              <rect x="10" y="20" width="15" height="5" fill="#2563EB"/>
              <rect x="20" y="15" width="5"  height="5" fill="#2563EB"/>
              <rect x="20" y="10" width="15" height="5" fill="#7DD3FC"/>
              <rect x="30" y="5"  width="5"  height="5" fill="#7DD3FC"/>
              <rect x="30" y="0"  width="15" height="5" fill="#2DD4BF"/>
            </svg>
            <span className="text-white font-bold">Steady <span className="text-teal-400">Steps</span> Music</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Steady Steps Music · Music Lessons in Boise, ID</p>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <a href="#lessons"      className="hover:text-teal-400 transition-colors">Lessons</a>
            <a href="#pricing"      className="hover:text-teal-400 transition-colors">Pricing</a>
            <a href="#contact"      className="hover:text-teal-400 transition-colors">Contact</a>
            <a href="https://www.instagram.com/steadystepsmusic?igsh=dm50MnlrcnJtbGVu&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/18av9MhPhH/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
