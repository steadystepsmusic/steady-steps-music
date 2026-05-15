'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

const TAB_BOX_PADDING = 40 // p-5 = 20px each side

type Phrase = { name: string; lines: string[] }

function normalizeLines(lines: string[]): string[] {
  const maxLen = Math.max(...lines.map(l => l.length))
  return lines.map(l => {
    if (l.length >= maxLen) return l
    const lastPipe = l.lastIndexOf('|')
    return l.slice(0, lastPipe) + '-'.repeat(maxLen - l.length) + '|'
  })
}

function chunkLines(lines: string[], charsPerChunk: number): string[][] {
  const contentPerChunk = charsPerChunk - 2 // subtract "X|" prefix
  if (contentPerChunk <= 0) return [lines]
  const maxLen = Math.max(...lines.map(l => l.length))
  const contentLen = maxLen - 2
  const numChunks = Math.ceil(contentLen / contentPerChunk)
  if (numChunks <= 1) return [lines]

  return Array.from({ length: numChunks }, (_, ci) => {
    return lines.map(line => {
      const prefix = line.slice(0, 2)
      const content = line.slice(2).padEnd(contentLen, '-')
      return prefix + content.slice(ci * contentPerChunk, (ci + 1) * contentPerChunk)
    })
  })
}

function TabLine({ line }: { line: string }) {
  return (
    <div className="whitespace-nowrap">
      <span className="text-teal-400 font-semibold">{line[0]}</span>
      <span className="text-slate-300">{line.slice(1)}</span>
    </div>
  )
}

export function CombinedSection({ phrases }: { phrases: Phrase[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [charsPerLine, setCharsPerLine] = useState<number | null>(null)

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    // Measure actual monospace char width at runtime
    const probe = document.createElement('span')
    probe.style.visibility = 'hidden'
    probe.style.position = 'absolute'
    probe.style.whiteSpace = 'nowrap'
    probe.style.fontFamily = 'monospace'
    probe.style.fontSize = window.getComputedStyle(el).fontSize
    probe.textContent = '-'.repeat(40)
    el.appendChild(probe)
    const charWidth = probe.offsetWidth / 40
    el.removeChild(probe)

    const available = el.clientWidth - TAB_BOX_PADDING
    setCharsPerLine(Math.max(Math.floor(available / charWidth), 10))
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [measure])

  return (
    <div
      ref={containerRef}
      className="bg-slate-950 rounded-xl p-5 font-mono text-sm leading-7 overflow-x-hidden"
    >
      {phrases.map((phrase, pi) => {
        const normalized = normalizeLines(phrase.lines)
        const chunks = charsPerLine ? chunkLines(normalized, charsPerLine) : [normalized]
        return (
          <div key={pi}>
            {pi > 0 && <div className="h-4" />}
            <div className="text-slate-500 text-xs mb-1 font-sans whitespace-normal">{phrase.name}</div>
            {chunks.map((chunk, ci) => (
              <div key={ci} className={ci > 0 ? 'mt-3' : ''}>
                {chunk.map((line, li) => (
                  <TabLine key={li} line={line} />
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
