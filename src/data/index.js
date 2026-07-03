// Daftar semua cerita — hanya metadata untuk halaman list.
// Isi cerita (pages) di-lazy load lewat loader() saat dibaca.
export const stories = [
  {
    slug: 'timun-mas',
    level: 'N5',
    title: { jp: 'ティムン・マス', id: 'Timun Mas', en: 'Timun Mas' },
    region: 'Jawa Tengah',
    cover: '/images/stories/timun-mas/cover.png',
    loader: () => import('./stories/n5/timun-mas.js'),
  },
  {
    slug: 'malin-kundang',
    level: 'N4',
    title: { jp: 'マリン・クンダン', id: 'Malin Kundang', en: 'Malin Kundang' },
    region: 'Sumatera Barat',
    cover: '/images/stories/malin-kundang/cover.png',
    loader: () => import('./stories/n4/malin-kundang.js'),
  },
]

export const getStoriesByLevel = (level) =>
  stories.filter((s) => s.level.toLowerCase() === level.toLowerCase())

export const getStoryMeta = (slug) => stories.find((s) => s.slug === slug)

export const loadStory = async (slug) => {
  const meta = getStoryMeta(slug)
  if (!meta) return null
  const mod = await meta.loader()
  return mod.default
}
