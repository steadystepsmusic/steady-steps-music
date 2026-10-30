import { Song } from './types'

export const song: Song = {
  slug: 'house-of-the-rising-sun',
  episode: 'EP09',
  title: 'House of the Rising Sun',
  description: 'The Animals classic: six open chords, each one picked as a slow arpeggio. Learn the shapes, then play the progression below.',
  chordDiagrams: [
    { name: 'A minor', src: '/tab/ep09-chord-a-minor.png' },
    { name: 'C Major', src: '/tab/ep09-chord-c-major.png' },
    { name: 'D Major', src: '/tab/ep09-chord-d-major.png' },
    { name: 'F Major', src: '/tab/ep09-chord-f-major.png' },
    { name: 'E Major', src: '/tab/ep09-chord-e-major.png' },
    { name: 'E7', src: '/tab/ep09-chord-e7.png' },
  ],
  sections: [
    {
      label: 'Arpeggio Patterns',
      layout: 'grid',
      phrases: [
        {
          name: 'A Minor (5 strings, skip low E)',
          lines: [
            'e|--------------0--------|',
            'B|-----------1-----1-----|',
            'G|--------2-----------2--|',
            'D|-----2-----------------|',
            'A|--0--------------------|',
            'E|-----------------------|',
          ],
        },
        {
          name: 'C Major (5 strings, skip low E)',
          lines: [
            'e|--------------0--------|',
            'B|-----------1-----1-----|',
            'G|--------0-----------0--|',
            'D|-----2-----------------|',
            'A|--3--------------------|',
            'E|-----------------------|',
          ],
        },
        {
          name: 'D Major (4 strings, skip low E and A)',
          lines: [
            'e|-----------2--2--------|',
            'B|--------3--------3-----|',
            'G|-----2--------------2--|',
            'D|--0--------------------|',
            'A|-----------------------|',
            'E|-----------------------|',
          ],
        },
        {
          name: 'F Major (4 strings, skip low E and A)',
          lines: [
            'e|-----------1--1--------|',
            'B|--------1--------1-----|',
            'G|-----2--------------2--|',
            'D|--3--------------------|',
            'A|-----------------------|',
            'E|-----------------------|',
          ],
        },
        {
          name: 'E Major (6 strings)',
          lines: [
            'e|--------------0--------|',
            'B|-----------------0-----|',
            'G|-----------1--------1--|',
            'D|--------2--------------|',
            'A|-----2-----------------|',
            'E|--0--------------------|',
          ],
        },
        {
          name: 'E7 (6 strings, lift ring finger)',
          lines: [
            'e|--------------0--------|',
            'B|-----------------0-----|',
            'G|-----------1--------1--|',
            'D|--------0--------------|',
            'A|-----2-----------------|',
            'E|--0--------------------|',
          ],
        },
      ],
    },
  ],
  chordProgression: {
    label: 'Chord Progression (Key of A minor)',
    lines: [
      'Am  →  C  →  D  →  F',
      'Am  →  C  →  E  →  E7',
      'Am  →  C  →  D  →  F',
      'Am  →  E  →  Am  →  E7',
    ],
    note: 'Play one arpeggio pattern per chord. The full progression repeats each verse.',
  },
  download: '/downloads/house-of-the-rising-sun-chords.pdf',
  filename: 'house-of-the-rising-sun-chords.pdf',
}
