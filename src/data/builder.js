import { getImages } from "./images";
import importedTexts from "./stories/imported-texts.json";
export function buildStory({ slug, level, folder, title, region, regionJp, texts = [] }) {
  const images = getImages(level, folder);
  const coverImg = images.find((i) => i.cover) || images[0];
  const finalTexts = importedTexts[slug] ?? texts;

  return {
    slug,
    level,
    title,
    region,
    regionJp,
    cover: coverImg?.url,
    pages: images.map((img, i) => ({
      image: img.url,
      text: finalTexts[i] ?? "",
    })),
  };
}
