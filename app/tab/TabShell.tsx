export function TabHeader({
  eyebrow,
  title,
  description,
  backLink,
}: {
  eyebrow: string
  title: string
  description: string
  backLink?: { href: string; label: string }
}) {
  return (
    <div className="border-b border-slate-800 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <a href="https://steadystepsmusic.com" className="flex items-center gap-2 no-underline w-fit">
            <svg viewBox="0 0 45 35" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0"  y="30" width="15" height="5" fill="#162D6E"/>
              <rect x="10" y="25" width="5"  height="5" fill="#162D6E"/>
              <rect x="10" y="20" width="15" height="5" fill="#2563EB"/>
              <rect x="20" y="15" width="5"  height="5" fill="#2563EB"/>
              <rect x="20" y="10" width="15" height="5" fill="#7DD3FC"/>
              <rect x="30" y="5"  width="5"  height="5" fill="#7DD3FC"/>
              <rect x="30" y="0"  width="15" height="5" fill="#2DD4BF"/>
            </svg>
            <span className="text-white font-bold text-lg">Steady <span className="text-teal-400">Steps</span> Music</span>
          </a>
          <a href="https://steadystepsmusic.com" className="text-slate-400 hover:text-teal-400 text-xs font-semibold no-underline whitespace-nowrap">
            Visit Full Website →
          </a>
        </div>
        {backLink && (
          <a href={backLink.href} className="text-slate-400 hover:text-teal-400 text-xs font-semibold mb-4 inline-block no-underline">
            ← {backLink.label}
          </a>
        )}
        <p className="text-teal-400 font-semibold text-xs uppercase tracking-widest mb-2">{eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{title}</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{description}</p>
      </div>
    </div>
  )
}

export function TabCta() {
  return (
    <div className="max-w-3xl mx-auto px-6 pb-16">
      <div className="bg-teal-600 rounded-2xl p-8 text-center">
        <h2 className="text-white font-black text-2xl mb-3">Ready to put this into practice?</h2>
        <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-md mx-auto">
          Tab sheets are great, but nothing replaces real feedback from a teacher. Book a free 15-minute lesson and let&apos;s work through these together.
        </p>
        <a
          href="https://steadystepsmusic.com/#contact"
          className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-xl text-base transition-colors no-underline"
        >
          Book Your Free Lesson
        </a>
      </div>
    </div>
  )
}
