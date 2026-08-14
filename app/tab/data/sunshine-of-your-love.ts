import { Song } from './types'

export const song: Song = {
  slug: 'sunshine-of-your-love',
  episode: 'EP17',
  title: 'Sunshine of Your Love',
  description: 'The main riff from Cream\'s "Sunshine of Your Love": one shape, played in three positions on the low strings, then it drops into the chord progression.',
  sections: [
    {
      label: 'Riff: Position 1 (play 4x)',
      phrases: [
        {
          name: 'Position 1',
          lines: [
            'e|-------------------------------------------|',
            'B|-------------------------------------------|',
            'G|-------------------------------------------|',
            'D|---12--12--10--12--------------------------|',
            'A|-------------------12--11--10--------------|',
            'E|-------------------------------10--13--10--|',
          ],
        },
      ],
    },
    {
      label: 'Riff: Position 2, Shifted Up One String (play 2x)',
      phrases: [
        {
          name: 'Position 2',
          lines: [
            'e|-------------------------------------------|',
            'B|-------------------------------------------|',
            'G|---12--12--10--12--------------------------|',
            'D|-------------------12--11--10--------------|',
            'A|-------------------------------10--13--10--|',
            'E|-------------------------------------------|',
          ],
        },
      ],
    },
    {
      label: 'Riff: Back to Position 1 (play 2x), Then Into the Chords',
      phrases: [
        {
          name: 'Position 1 (repeat)',
          lines: [
            'e|-------------------------------------------|',
            'B|-------------------------------------------|',
            'G|-------------------------------------------|',
            'D|---12--12--10--12--------------------------|',
            'A|-------------------12--11--10--------------|',
            'E|-------------------------------10--13--10--|',
          ],
        },
      ],
    },
  ],
  chordProgression: {
    label: 'Chord Progression (Key of D)',
    lines: [
      'D  →  D  →  D  →  D',
      'G  →  G  →  D  →  D',
      'A  →  (C / G)  →  (C / G)  →  Turnaround (A)',
    ],
    note: 'Each box = 2 measures (8 beats). Cycle back to the top after the last box.',
  },
  chordGrid: {
    label: 'Last Line: Chord Strum (Turnaround)',
    shapes: [
      { name: 'A', frets: ['x', '2', '2', '2', '0', 'x'], diagram: '/tab/ep17-chord-a-major.png' },
      { name: 'C', frets: ['x', '5', '5', '5', '3', 'x'], diagram: '/tab/ep17-chord-c-major.png' },
      { name: 'G', frets: ['3', '3', '4', '5', '5', '3'], diagram: '/tab/ep17-chord-g-major.png' },
    ],
    sequence: ['A', 'A', 'A', 'C', 'G'],
    repeatNote: 'Play this 3x',
    tail: ['A'],
    strumPattern: ['D', 'U', 'U', 'D', 'U'],
    note: 'All notes in each chord are strummed together, not picked one at a time. D = downstrum, U = upstrum.',
  },
  download: '/tab/ep17-sunshine-of-your-love.pdf',
  filename: 'sunshine-of-your-love-tab.pdf',
}
