'use client'

import { useEffect } from 'react'

// Shared building blocks for the Maestro prototype (teacher and admin views).
// Rule: everything clickable is a pill. Actions are filled, other clickable
// things are outlined. Status labels are square tags so they never look clickable.

export const PILL = 'inline-flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-colors'
export const KIND = {
  primary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:bg-slate-200 disabled:text-slate-500',
  action: 'bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-200 disabled:text-slate-500',
  outline: 'bg-white border-2 border-slate-300 hover:border-slate-500 text-slate-800',
}
export type BtnKind = keyof typeof KIND
export const pill = (kind: BtnKind, extra = '') => `${PILL} ${KIND[kind]} ${extra}`

export function Btn({ kind = 'outline', className = '', ...props }: { kind?: BtnKind } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={pill(kind, className)} />
}

export function Tag({ children, tone }: { children: React.ReactNode; tone: 'teal' | 'amber' | 'slate' }) {
  const cls = { teal: 'bg-teal-100 text-teal-900', amber: 'bg-amber-100 text-amber-900', slate: 'bg-slate-200 text-slate-700' }[tone]
  return <span className={`inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-md whitespace-nowrap ${cls}`}>{children}</span>
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5">{children}</div>
}

export function Stairs({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 45 35" height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="0" y="30" width="15" height="5" fill="#3B5BB5" />
      <rect x="10" y="25" width="5" height="5" fill="#3B5BB5" />
      <rect x="10" y="20" width="15" height="5" fill="#2563EB" />
      <rect x="20" y="15" width="5" height="5" fill="#2563EB" />
      <rect x="20" y="10" width="15" height="5" fill="#7DD3FC" />
      <rect x="30" y="5" width="5" height="5" fill="#7DD3FC" />
      <rect x="30" y="0" width="15" height="5" fill="#2DD4BF" />
    </svg>
  )
}

export function Avatar({ name, tone = 'teal' }: { name: string; tone?: 'teal' | 'slate' }) {
  const cls = tone === 'teal' ? 'bg-teal-100 text-teal-800' : 'bg-slate-700 text-white'
  return (
    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${cls}`}>
      {name.split(' ').map(p => p[0]).join('').slice(0, 2)}
    </div>
  )
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const before = document.body.style.overflow
    document.body.style.overflow = 'hidden' // the page behind must not scroll
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = before
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-x-0 top-0 h-dvh z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg max-h-[88dvh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="shrink-0 bg-white flex items-center justify-between gap-4 pl-6 pr-4 py-3 border-b border-slate-100">
          <h2 className="font-black text-slate-900 text-lg truncate">{title}</h2>
          <Btn kind="action" onClick={onClose} className="shrink-0">Done</Btn>
        </div>
        <div className="p-6 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  )
}

export function Choice({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left rounded-3xl border-2 px-5 py-3 transition-colors ${active ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-slate-500 bg-white'}`}
    >
      <div className="font-bold text-slate-900">{title}</div>
      {desc && <div className="text-sm text-slate-600 mt-0.5 text-pretty">{desc}</div>}
    </button>
  )
}

export function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} role="switch" aria-checked={on} aria-label={label} className={`relative w-14 h-8 shrink-0 rounded-full transition-colors ${on ? 'bg-teal-600' : 'bg-slate-300'}`}>
      <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : ''}`} />
    </button>
  )
}

export function Chips({ options, picked, onToggle, disabled }: { options: string[]; picked: string[]; onToggle: (o: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = picked.includes(o)
        return (
          <button
            key={o}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(o)}
            aria-pressed={on}
            className={`min-h-11 px-4 rounded-full border-2 text-sm font-bold whitespace-nowrap transition-colors ${on ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-slate-300 text-slate-600'} ${disabled ? 'opacity-70' : 'hover:border-slate-500'}`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
