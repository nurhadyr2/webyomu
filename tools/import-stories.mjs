import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import mammoth from 'mammoth'

const root = process.cwd()
const catalogPath = path.join(root, 'src/data/stories/catalog.js')
const outputPath = path.join(root, 'src/data/stories/imported-texts.json')
const assetRoot = path.join(root, 'src/assets/final')

const fail = (message) => {
  throw new Error(message)
}

function readArguments() {
  const args = process.argv.slice(2)
  const checkOnly = args.includes('--check')
  const inputs = args.filter((arg) => arg !== '--check')
  if (inputs.length !== 1) {
    fail('Gunakan: npm run import:stories -- <file.docx|folder> [--check]')
  }
  return { input: path.resolve(root, inputs[0]), checkOnly }
}

async function collectDocx(input) {
  const stat = await fs.stat(input).catch(() => fail(`Path tidak ditemukan: ${input}`))
  if (stat.isFile()) {
    if (path.extname(input).toLowerCase() !== '.docx') fail('Input harus berupa file .docx atau folder.')
    return [input]
  }
  if (!stat.isDirectory()) fail('Input harus berupa file .docx atau folder.')
  const entries = await fs.readdir(input, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.docx' && !entry.name.startsWith('~$'))
    .map((entry) => path.join(input, entry.name))
    .sort()
  if (!files.length) fail(`Tidak ada file .docx di folder: ${input}`)
  return files
}

async function loadStories() {
  const source = await fs.readFile(catalogPath, 'utf8')
  const stories = new Map()
  const pattern = /story\(\{\s*slug:\s*'([^']+)',\s*level:\s*'([^']+)',\s*folder:\s*'([^']+)'/g
  for (const match of source.matchAll(pattern)) {
    stories.set(match[1], { slug: match[1], level: match[2], folder: match[3] })
  }
  if (!stories.size) fail('Metadata cerita tidak dapat dibaca dari catalog.js.')
  return stories
}

export function toRubySource(text, slug, slide) {
  const normalized = text
    .normalize('NFC')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t ]+/g, ' ')
    .replace(/\s*\n\s*/g, ' ')
    .trim()

  const converted = normalized.replace(
    /([\p{Script=Han}々ヶ]+)[(（]([ぁ-ゖァ-ヺー]+)[)）]/gu,
    '$1[$2]',
  )

  const orphan = converted.match(/.{0,12}[(（][ぁ-ゖァ-ヺー]+[)）].{0,12}/u)
  if (orphan) {
    fail(`${slug}, slide ${slide}: furigana tidak menempel langsung pada kanji: “${orphan[0]}”`)
  }
  if (/[[\]]/.test(normalized)) {
    fail(`${slug}, slide ${slide}: dokumen tidak boleh memakai tanda [ atau ].`)
  }
  return converted
}

export function parseSlides(rawText, slug) {
  const lines = rawText.replace(/\r/g, '').split('\n')
  const slides = []
  let current = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const heading = line.match(/^slide\s+(\d+)\s*[:：-]?$/i)
    if (heading) {
      if (current) slides.push(current)
      current = { number: Number(heading[1]), lines: [] }
    } else if (current && line) {
      current.lines.push(line)
    } else if (!current && line) {
      fail(`${slug}: ditemukan teks sebelum heading “slide 1”: “${line.slice(0, 40)}”`)
    }
  }
  if (current) slides.push(current)
  if (!slides.length) fail(`${slug}: heading “slide 1” tidak ditemukan.`)

  slides.forEach((slide, index) => {
    const expected = index + 1
    if (slide.number !== expected) fail(`${slug}: urutan slide harus 1, 2, 3, ...; ditemukan slide ${slide.number} pada posisi ${expected}.`)
    if (!slide.lines.length) fail(`${slug}: slide ${slide.number} tidak memiliki teks.`)
  })
  return slides.map((slide) => toRubySource(slide.lines.join(' '), slug, slide.number))
}

async function expectedImageCount(story) {
  const folder = path.join(assetRoot, story.level, story.folder)
  const files = await fs.readdir(folder).catch(() => fail(`Folder ilustrasi tidak ditemukan: ${folder}`))
  return files.filter((file) => file.toLowerCase().endsWith('.png')).length
}

async function parseDocument(file, stories) {
  const slug = path.basename(file, path.extname(file))
  const story = stories.get(slug)
  if (!story) fail(`Nama file “${path.basename(file)}” tidak cocok dengan slug mana pun di catalog.js.`)
  const result = await mammoth.extractRawText({ path: file })
  const texts = parseSlides(result.value, slug)
  const expected = await expectedImageCount(story)
  if (texts.length !== expected) {
    fail(`${slug}: jumlah slide ${texts.length}, tetapi jumlah ilustrasi ${expected}. Keduanya harus sama.`)
  }
  return { slug, texts, warnings: result.messages }
}

async function main() {
  const { input, checkOnly } = readArguments()
  const [files, stories] = await Promise.all([collectDocx(input), loadStories()])
  const seen = new Set()
  const parsed = []

  for (const file of files) {
    const slug = path.basename(file, path.extname(file))
    if (seen.has(slug)) fail(`Slug ganda dalam input: ${slug}`)
    seen.add(slug)
    parsed.push(await parseDocument(file, stories))
  }

  for (const item of parsed) {
    console.log(`✓ ${item.slug}: ${item.texts.length} slide valid`)
    for (const warning of item.warnings) console.warn(`  DOCX: ${warning.message}`)
  }

  if (checkOnly) {
    console.log(`\nValidasi selesai. ${parsed.length} dokumen tidak ditulis (--check).`)
    return
  }

  const existing = JSON.parse(await fs.readFile(outputPath, 'utf8').catch(() => '{}'))
  for (const item of parsed) existing[item.slug] = item.texts
  const sorted = Object.fromEntries(Object.entries(existing).sort(([a], [b]) => a.localeCompare(b)))
  const temporary = `${outputPath}.tmp`
  await fs.writeFile(temporary, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')
  await fs.rename(temporary, outputPath)
  console.log(`\nBerhasil mengimpor ${parsed.length} cerita ke ${path.relative(root, outputPath)}.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`\nImport gagal: ${error.message}`)
    process.exitCode = 1
  })
}
