// Auto-kumpulkan semua file cerita di stories/**. Tambah cerita baru cukup
// dengan membuat file baru di folder n5/ atau n4/ — tidak perlu daftar manual.
const storyModules = import.meta.glob('./stories/**/*.js', { eager: true })

const levelOrder = { N5: 0, N4: 1 }

export const stories = Object.values(storyModules)
  .map((m) => m.default)
  .sort((a, b) => {
    if (a.level !== b.level) return levelOrder[a.level] - levelOrder[b.level]
    return a.title.id.localeCompare(b.title.id)
  })

export const getStoriesByLevel = (level) =>
  stories.filter((s) => s.level.toLowerCase() === level.toLowerCase())

export const getStoryMeta = (slug) => stories.find((s) => s.slug === slug)

// Dipertahankan async agar StoryReader tetap kompatibel.
export const loadStory = async (slug) => getStoryMeta(slug) || null
