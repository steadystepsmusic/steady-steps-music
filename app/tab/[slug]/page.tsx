import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { songs, getSong } from '../data'
import { CombinedSection } from '../TabDisplay'
import { ChordGridDisplay } from '../ChordGridDisplay'
import { TabHeader, TabCta } from '../TabShell'

export function generateStaticParams() {
  return songs.map(song => ({ slug: song.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const song = getSong(slug)
  if (!song) return {}
  return {
    title: `${song.title} Tab: Steady Steps Music`,
    robots: { index: false, follow: false },
  }
}

export default async function TabSongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const song = getSong(slug)
  if (!song) notFound()

  return (
    <div className="min-h-screen bg-slate-900">
      <TabHeader
        eyebrow={song.episode}
        title={song.title}
        description={song.description}
        backLink={{ href: '/tab', label: 'All Tab Sheets' }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          {song.download && (
            <div className="flex justify-end mb-6">
              <a
                href={song.download}
                download={song.filename}
                className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors no-underline whitespace-nowrap"
              >
                Download Tab
              </a>
            </div>
          )}

          {song.sections.map((section, si) => (
            <div key={si} className={si > 0 ? 'mt-8' : ''}>
              {section.label && (
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">{section.label}</p>
              )}
              <CombinedSection phrases={section.phrases} />
            </div>
          ))}

          {song.chordGrid && (
            <div className="mt-8">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">{song.chordGrid.label}</p>

              {song.chordGrid.shapes.some(s => s.diagram) && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {song.chordGrid.shapes.map(shape => (
                    shape.diagram && (
                      <div key={shape.name} className="bg-slate-950 rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={shape.diagram} alt={`${shape.name} chord diagram`} className="w-full h-auto" />
                      </div>
                    )
                  ))}
                </div>
              )}

              <ChordGridDisplay grid={song.chordGrid} />
              {song.chordGrid.note && (
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{song.chordGrid.note}</p>
              )}
            </div>
          )}

          {song.chordProgression && (
            <div className="mt-8">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">{song.chordProgression.label}</p>
              <div className="bg-slate-950 rounded-xl p-5 font-mono text-sm text-slate-300 space-y-2">
                {song.chordProgression.lines.map((line, li) => (
                  <div key={li}>{line}</div>
                ))}
              </div>
              {song.chordProgression.note && (
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{song.chordProgression.note}</p>
              )}
            </div>
          )}

          <div className="mt-5 bg-slate-900 border-l-2 border-teal-500 rounded-r-xl px-4 py-3 text-slate-400 text-xs leading-relaxed">
            <strong className="text-slate-200">How to read tab:</strong> 0 = open string. Number = fret that string. Play one note at a time, left to right.
          </div>
        </div>
      </div>

      <TabCta />
    </div>
  )
}
