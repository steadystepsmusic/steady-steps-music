import { Song } from './types'
import { song as itsyBitsySpider } from './itsy-bitsy-spider'
import { song as twinkleTwinkle } from './twinkle-twinkle'
import { song as bluesShuffle } from './blues-shuffle'
import { song as sunshineOfYourLove } from './sunshine-of-your-love'
import { song as houseOfTheRisingSun } from './house-of-the-rising-sun'

export const songs: Song[] = [
  itsyBitsySpider,
  twinkleTwinkle,
  bluesShuffle,
  houseOfTheRisingSun,
  sunshineOfYourLove,
]

export function getSong(slug: string): Song | undefined {
  return songs.find(s => s.slug === slug)
}
