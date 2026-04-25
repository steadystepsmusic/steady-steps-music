import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Guitar Tab Sheets — Steady Steps Music',
  robots: { index: false, follow: false },
}

const tabs = [
  {
    episode: 'EP05',
    title: 'Itsy Bitsy Spider',
    description: 'Your first melody — high e and B string. Perfect for building single-note picking technique.',
    sections: [
      {
        label: '',
        phrases: [
          {
            name: 'Phrase 1',
            lines: [
              'e|--------0--0--0--2--4--4--2--0---2--4---0-|',
              'B|--0-----------------------------------------|',
              'G|--------------------------------------------|',
              'D|--------------------------------------------|',
              'A|--------------------------------------------|',
              'E|--------------------------------------------|',
            ],
          },
          {
            name: 'Phrase 2',
            lines: [
              'e|--4--4--5--7--7--5--4--5--7--4--|',
              'B|--------------------------------|',
              'G|--------------------------------|',
              'D|--------------------------------|',
              'A|--------------------------------|',
              'E|--------------------------------|',
            ],
          },
          {
            name: 'Phrase 3',
            lines: [
              'e|--------0--0--0--2--4--4--2--0---2--4---0-|',
              'B|--0-----------------------------------------|',
              'G|--------------------------------------------|',
              'D|--------------------------------------------|',
              'A|--------------------------------------------|',
              'E|--------------------------------------------|',
            ],
          },
          {
            name: 'Phrase 4',
            lines: [
              'e|--------0--0--0--2--4--4--2--0--2--4--0-|',
              'B|--0--0-----------------------------------|',
              'G|----------------------------------------|',
              'D|----------------------------------------|',
              'A|----------------------------------------|',
              'E|----------------------------------------|',
            ],
          },
        ],
      },
    ],
    download: '/tab/ep05-itsy-bitsy-spider.pdf',
    filename: 'itsy-bitsy-spider-tab.pdf',
  },
  {
    episode: 'EP05',
    title: 'Twinkle Twinkle Little Star',
    description: 'Two ways to play the same melody -- on one string, then spread across two. Great for understanding how melodies move on the fretboard.',
    sections: [
      {
        label: 'Version 1 — High e String Only',
        phrases: [
          {
            name: 'Phrase 1 — Twinkle Twinkle Little Star',
            lines: [
              'e|--0--0--7--7--9--9--7--5--5--4--4--2--2--0--|',
              'B|---------------------------------------------|',
              'G|---------------------------------------------|',
              'D|---------------------------------------------|',
              'A|---------------------------------------------|',
              'E|---------------------------------------------|',
            ],
          },
          {
            name: 'Phrase 2 — How I Wonder What You Are (repeat x2)',
            lines: [
              'e|--7--7--5--5--4--4--2--7--7--5--5--4--4--2--|',
              'B|---------------------------------------------|',
              'G|---------------------------------------------|',
              'D|---------------------------------------------|',
              'A|---------------------------------------------|',
              'E|---------------------------------------------|',
            ],
          },
          {
            name: 'Phrase 3 — Twinkle Twinkle Little Star (repeat)',
            lines: [
              'e|--0--0--7--7--9--9--7--5--5--4--4--2--2--0--|',
              'B|---------------------------------------------|',
              'G|---------------------------------------------|',
              'D|---------------------------------------------|',
              'A|---------------------------------------------|',
              'E|---------------------------------------------|',
            ],
          },
        ],
      },
      {
        label: 'Version 2 — High e + B String',
        phrases: [
          {
            name: 'Phrase 1 — Twinkle Twinkle Little Star',
            lines: [
              'e|--------2--2--4--4--2--|',
              'B|--0--0-----------------|',
              'G|-----------------------|',
              'D|-----------------------|',
              'A|-----------------------|',
              'E|-----------------------|',
            ],
          },
          {
            name: 'Phrase 2 — How I Wonder What You Are',
            lines: [
              'e|--0--0-----------------|',
              'B|--------4--4--2--2--0--|',
              'G|-----------------------|',
              'D|-----------------------|',
              'A|-----------------------|',
              'E|-----------------------|',
            ],
          },
        ],
      },
    ],
    download: '/tab/ep05-twinkle-twinkle.pdf',
    filename: 'twinkle-twinkle-tab.pdf',
  },
]

function normalizeLines(lines: string[]): string[] {
  const maxLen = Math.max(...lines.map(l => l.length))
  return lines.map(l => {
    if (l.length >= maxLen) return l
    const lastPipe = l.lastIndexOf('|')
    return l.slice(0, lastPipe) + '-'.repeat(maxLen - l.length) + '|'
  })
}

function TabLines({ lines }: { lines: string[] }) {
  const normalized = normalizeLines(lines)
  return (
    <div className="bg-slate-950 rounded-xl p-5 font-mono text-sm leading-7 overflow-x-auto">
      {normalized.map((line, i) => (
        <div key={i}>
          <span className="text-teal-400 font-semibold">{line[0]}</span>
          <span className="text-slate-300">{line.slice(1)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TabPage() {
  return (
    <div className="min-h-screen bg-slate-900">

      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <a href="https://steadystepsmusic.com" className="flex items-center gap-2 no-underline mb-6 w-fit">
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
          <p className="text-teal-400 font-semibold text-xs uppercase tracking-widest mb-2">Free Downloads</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Guitar Tab Sheets</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            Tab sheets from the Steady Steps YouTube series. Download any sheet, open it in your browser, and print it or save it as a PDF to keep on your music stand.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        {tabs.map((tab, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">{tab.episode}</span>
                <h2 className="text-white font-black text-xl mt-1">{tab.title}</h2>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{tab.description}</p>
              </div>
              <a
                href={tab.download}
                download={tab.filename}
                className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors no-underline whitespace-nowrap"
              >
                Download Tab
              </a>
            </div>

            {'lines' in tab && tab.lines && (
              <TabLines lines={tab.lines} />
            )}

            {'sections' in tab && tab.sections && tab.sections.map((section, si) => (
              <div key={si} className={si > 0 ? 'mt-8' : ''}>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">{section.label}</p>
                <div className="space-y-5">
                  {section.phrases.map((phrase, pi) => (
                    <div key={pi}>
                      <p className="text-slate-500 text-xs mb-2">{phrase.name}</p>
                      <TabLines lines={phrase.lines} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-5 bg-slate-900 border-l-2 border-teal-500 rounded-r-xl px-4 py-3 text-slate-400 text-xs leading-relaxed">
              <strong className="text-slate-200">How to read tab:</strong> 0 = open string. Number = fret that string. Play one note at a time, left to right.
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-teal-600 rounded-2xl p-8 text-center">
          <h2 className="text-white font-black text-2xl mb-3">Ready to put this into practice?</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Tab sheets are great, but nothing replaces real feedback from a teacher. Book a free 15-minute lesson and let's work through these together.
          </p>
          <a
            href="https://steadystepsmusic.com/#contact"
            className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-xl text-base transition-colors no-underline"
          >
            Book Your Free Lesson
          </a>
        </div>
      </div>

    </div>
  )
}
