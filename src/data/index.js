import storyCatalog from './stories/catalog'

const levelOrder = { N5: 0, N4: 1 }

export const stories = storyCatalog.sort((a, b) => {
  if (a.level !== b.level) return levelOrder[a.level] - levelOrder[b.level]
  return a.title.id.localeCompare(b.title.id)
})

export const getStoriesByLevel = (level) =>
  stories.filter((story) => story.level.toLowerCase() === level.toLowerCase())

export const getStoryMeta = (slug) => stories.find((story) => story.slug === slug)
export const loadStory = async (slug) => getStoryMeta(slug) || null
