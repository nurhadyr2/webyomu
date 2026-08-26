import storyCatalog from './stories/catalog'

const storyOrder = [
  'banyuwangi',
  'semarang',
  'roro-jonggrang',
  'manik-angkeran',
  'tangkuban-perahu',
  'kebo-iwa',
  'danau-toba',
  'raja-ampat',
  'legenda-surabaya',
  'rawa-pening',
  'putri-junjung-buih',
  'batu-badaong',
  'lutung-kasarung',
  'timun-mas',
  'bawang-merah-bawang-putih',
  'ande-ande-lumut',
  'ratu-ular',
  'batu-menangis',
  'putri-mambang-limau',
  'malin-kundang',
]

export const stories = storyCatalog.sort(
  (a, b) => storyOrder.indexOf(a.slug) - storyOrder.indexOf(b.slug),
)

export const getStoriesByLevel = (level) =>
  stories.filter((story) => story.level.toLowerCase() === level.toLowerCase())

export const getStoryMeta = (slug) => stories.find((story) => story.slug === slug)
export const loadStory = async (slug) => getStoryMeta(slug) || null
