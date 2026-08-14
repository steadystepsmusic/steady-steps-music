export type Phrase = {
  name: string
  lines: string[]
}

export type Section = {
  label: string
  phrases: Phrase[]
}

export type ChordProgression = {
  label: string
  lines: string[]
  note?: string
}

export type ChordShape = {
  name: string
  // fret per string, high to low: e, B, G, D, A, E. 'x' = muted.
  frets: [string, string, string, string, string, string]
  diagram?: string
}

export type ChordGrid = {
  label: string
  shapes: ChordShape[]
  sequence: string[]
  repeatNote: string
  tail: string[]
  strumPattern: string[]
  note?: string
}

export type Song = {
  slug: string
  episode: string
  title: string
  description: string
  sections: Section[]
  chordProgression?: ChordProgression
  chordGrid?: ChordGrid
  download?: string
  filename?: string
}
