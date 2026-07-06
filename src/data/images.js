const modules = import.meta.glob("../assets/ilustrasi/**/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const firstNumber = (str) => {
  const m = str.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 9999;
};

export function getImages(level, folder) {
  const prefix = `../assets/ilustrasi/${level}/${folder}/`;
  return Object.entries(modules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => firstNumber(a) - firstNumber(b))
    .map(([path, url]) => ({ url, cover: /cover/i.test(path) }));
}
