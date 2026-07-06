import { getImages } from "./images";
export function buildStory({ slug, level, folder, title, region, texts = [] }) {
  const images = getImages(level, folder);
  const coverImg = images.find((i) => i.cover) || images[0];

  return {
    slug,
    level,
    title,
    region,
    cover: coverImg?.url,
    pages: images.map((img, i) => ({
      image: img.url,
      text: texts[i] ?? "",
    })),
  };
}
