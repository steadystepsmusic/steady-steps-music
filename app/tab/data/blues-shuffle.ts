import { Song } from './types'

export const song: Song = {
  slug: 'blues-shuffle',
  episode: 'EP08',
  title: 'Blues Shuffle Riff',
  description: 'Your first riff: a classic 12-bar blues pattern on the low strings. Index finger on the 2nd fret, ring finger on the 4th fret throughout. Full sequence: Part 1 → Part 1 Variation → Part 2 → Part 1 → Turnaround.',
  sections: [
    {
      label: 'Part 1',
      phrases: [
        {
          name: 'Part 1',
          lines: [
            'e|----------------|',
            'B|----------------|',
            'G|----------------|',
            'D|--------2-------|',
            'A|----2-4---4-2---|',
            'E|0-4-----------4-|',
          ],
        },
        {
          name: 'Part 1 (Variation, Open D String)',
          lines: [
            'e|----------------|',
            'B|----------------|',
            'G|----------------|',
            'D|--------0-------|',
            'A|----2-4---4-2---|',
            'E|0-4-----------4-|',
          ],
        },
      ],
    },
    {
      label: 'Part 2 (IV Chord, Shift Up One String)',
      phrases: [
        {
          name: 'Part 2',
          lines: [
            'e|----------------|',
            'B|----------------|',
            'G|--------2-------|',
            'D|----2-4---4-2---|',
            'A|0-4-----------4-|',
            'E|----------------|',
          ],
        },
      ],
    },
    {
      label: 'Turnaround',
      phrases: [
        {
          name: 'Turnaround',
          lines: [
            'e|----------------------------------|',
            'B|----------------------------------|',
            'G|----------------------------------|',
            'D|----0-----------------------------|',
            'A|2-4---4-2-0---------0-1-2-0-------|',
            'E|------------4-2-0-4---------4-2---|',
          ],
        },
      ],
    },
  ],
  download: '/tab/ep08-blues-shuffle.pdf',
  filename: 'blues-shuffle-tab.pdf',
}
