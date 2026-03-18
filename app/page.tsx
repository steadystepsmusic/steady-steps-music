import Nav from './components/Nav'
import ContactForm from './components/ContactForm'

// ─── Data ────────────────────────────────────────────────────────────────────

const lessons = [
  { name: 'Guitar',        desc: 'From your first open chord to advanced fingerpicking and lead playing. Acoustic or electric, all styles.' },
  { name: 'Bass',          desc: 'Lock in the groove and hold down the low end. Learn technique, theory, and how to play with a band.' },
  { name: 'Piano',         desc: 'Build a strong foundation in keys — scales, chords, reading music, and playing songs you actually love.' },
  { name: 'Voice',         desc: 'Develop your tone, range, and confidence. Breath control, pitch, technique, and performance covered.' },
  { name: 'Music Theory',  desc: 'Understand how music actually works — intervals, scales, chord progressions, and how to apply it all.' },
  { name: 'Songwriting',   desc: 'Turn your ideas into real songs. Melody, lyrics, structure, and the creative process — all covered.' },
]

const steps = [
  { step: '01', title: 'Book Your Free Lesson',  desc: "Fill out the contact form. I'll reach out within 24 hours to schedule your complimentary 15-minute demo session." },
  { step: '02', title: 'We Meet & Make a Plan',   desc: "We'll chat about your goals, your experience, and what you want to achieve. Then we'll map out a lesson plan just for you." },
  { step: '03', title: 'Start Making Progress',   desc: "Each lesson builds on the last. You'll leave every session with something new to practice and a clear sense of progress." },
]

const pricing = [
  {
    name: 'Demo Lesson',
    price: 'Free',
    duration: '15 min intro',
    highlight: true,
    features: ['No commitment required', 'Meet your teacher first', 'Get a personalised plan', 'Online or in-person'],
    cta: "Book Now — It's Free",
  },
  {
    name: '30-Minute Lesson',
    price: '$50',
    duration: 'per session',
    highlight: false,
    features: ['Great for beginners & kids', 'Focused, efficient sessions', 'Online via Zoom or in-person', 'Session notes sent after each lesson'],
    cta: 'Get Started',
  },
  {
    name: '60-Minute Lesson',
    price: '$90',
    duration: 'per session',
    highlight: false,
    features: ['Deep dives & faster progress', 'Ideal for dedicated students', 'Online via Zoom or in-person', 'Session notes sent after each lesson'],
    cta: 'Get Started',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Guitar student, 6 months',
    quote: 'I went from not knowing a single chord to playing my favourite songs in just a few months. Nik has a gift for breaking things down so they actually make sense.',
  },
  {
    name: 'James T.',
    role: 'Piano student, adult learner',
    quote: "I always thought it was too late to learn piano as an adult. Nik proved me completely wrong. The lessons are structured, fun, and I'm making real progress every week.",
  },
  {
    name: 'Emily R.',
    role: 'Voice & songwriting student',
    quote: "Not only am I a better singer — I've written three songs I'm actually proud of. The songwriting sessions are the highlight of my week.",
  },
]

const faqs = [
  { q: 'Do I need my own instrument?',      a: "For in-person lessons, yes — having your own instrument to practice at home is important. For online lessons you'll need the instrument plus a stable internet connection. I can recommend beginner-friendly instruments at any budget." },
  { q: 'What ages do you teach?',            a: 'All ages! I work with kids as young as 6 (with parental support), teenagers, adults, and seniors. Lessons are always tailored to your age, experience, and goals.' },
  { q: 'How do online lessons work?',        a: "We meet over Zoom or your preferred video platform. After each lesson I'll send you a summary of what we covered, exercises to practice, and any resources like chord charts or sheet music." },
  { q: 'Do I need any prior experience?',   a: "Not at all — complete beginners are very welcome. In fact it's often easier to teach someone with no bad habits! I also work with intermediate and advanced students who want to break through a plateau." },
  { q: 'How often should I take lessons?',  a: "Once a week is the sweet spot for most students. It gives you enough time to practice between sessions without losing momentum. That said, I'm flexible — we can discuss what works best for your schedule." },
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
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
              Based in Boise, ID · Teaching Online Worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Music Lessons<br />
              <span className="text-teal-400">That Actually</span><br />
              Stick.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              Guitar, bass, piano, voice, theory, and songwriting — online or in-person.
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
            <p className="text-slate-400 text-sm mt-4">✓ Free 15-min demo &nbsp;·&nbsp; ✓ No commitment &nbsp;·&nbsp; ✓ All ages & levels</p>
          </div>

          <div className="animate-fade-up animate-delay-200 flex justify-center">
            <div className="relative w-full h-72 sm:h-96 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/20">
              <img src="/images/hero.jpeg" alt="Nik — music teacher" className="w-full h-full object-cover" />
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
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 flex justify-center">
            <div className="w-full h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-xl">
              <img src="/images/about.jpeg" alt="Nik — music teacher" className="w-full h-full object-cover" style={{objectPosition: '50% 25%'}} />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">About Your Teacher</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">Hi, I&apos;m Nik</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                I&apos;ve been playing music my whole life and teaching for over 20 years. I specialise in guitar, bass, piano, and voice — and I believe anyone can learn to play music at any age, as long as the teaching is right for them.
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
      <section id="lessons" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">What I Teach</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Six Paths to Musical Growth</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Whether you&apos;re picking up your first instrument or levelling up an existing skill, there&apos;s a path for you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(l => (
              <div key={l.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all group cursor-default">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">{l.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-slate-900">
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
      <section id="pricing" className="py-24 bg-white">
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
          <p className="text-center text-slate-400 text-sm mt-8">Monthly packages available — just ask!</p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-slate-50">
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
      <section id="faq" className="py-24 bg-white">
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

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-slate-900">
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
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">Steady Steps <span className="text-teal-400">Music</span></span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Steady Steps Music · Boise, ID</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#lessons"      className="hover:text-teal-400 transition-colors">Lessons</a>
            <a href="#pricing"      className="hover:text-teal-400 transition-colors">Pricing</a>
            <a href="#contact"      className="hover:text-teal-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
