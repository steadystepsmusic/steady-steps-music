import { ChordGrid } from './data/types'

const STRING_ORDER = ['e', 'B', 'G', 'D', 'A', 'E'] as const

function gapFor(chords: string[], i: number): number {
  return i === 0 || chords[i] === chords[i - 1] ? 2 : 4
}

function TabBlock({ grid, chords, strumPattern }: { grid: ChordGrid; chords: string[]; strumPattern?: string[] }) {
  const shapeByName = Object.fromEntries(grid.shapes.map(s => [s.name, s]))
  const header = '  ' + chords.map((c, i) => '-'.repeat(gapFor(chords, i)).replace(/-/g, ' ') + c).join('')
  const stringLines = STRING_ORDER.map((label, idx) => {
    const cells = chords.map((c, i) => '-'.repeat(gapFor(chords, i)) + (shapeByName[c]?.frets[idx] ?? 'x'))
    return `${label}|${cells.join('')}--|`
  })

  return (
    <div className="bg-slate-950 rounded-xl p-5 font-mono text-sm leading-7 overflow-x-auto">
      <div className="whitespace-pre text-amber-400 font-semibold">{header}</div>
      {stringLines.map(line => (
        <div key={line} className="whitespace-pre">
          <span className="text-teal-400 font-semibold">{line[0]}</span>
          <span className="text-slate-300">{line.slice(1)}</span>
        </div>
      ))}
      {strumPattern && (
        <div className="whitespace-pre text-slate-400 mt-2">Strum:  {strumPattern.join('  ')}</div>
      )}
    </div>
  )
}

export function ChordGridDisplay({ grid }: { grid: ChordGrid }) {
  return (
    <div className="space-y-3">
      <div>
        <TabBlock grid={grid} chords={grid.sequence} />
        <p className="text-slate-400 text-xs mt-2 font-sans">{grid.repeatNote}</p>
      </div>
      <div>
        <TabBlock grid={grid} chords={grid.tail} strumPattern={grid.strumPattern} />
      </div>
    </div>
  )
}
