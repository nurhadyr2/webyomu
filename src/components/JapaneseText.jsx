// Format sumber: 漢字[かんじ]. Teks biasa dan katakana dibiarkan apa adanya.
export default function JapaneseText({ children, as: Tag = 'span', className = '' }) {
  const source = String(children ?? '')
  const pattern = /([\p{Script=Han}々ヶ]+)\[([^\]]+)\]/gu
  const parts = []
  let cursor = 0

  for (const match of source.matchAll(pattern)) {
    if (match.index > cursor) parts.push(source.slice(cursor, match.index))
    parts.push(
      <ruby key={`ruby-${match.index}`}>
        {match[1]}<rp>（</rp><rt>{match[2]}</rt><rp>）</rp>
      </ruby>,
    )
    cursor = match.index + match[0].length
  }
  if (cursor < source.length) parts.push(source.slice(cursor))

  return <Tag className={className} lang="ja">{parts}</Tag>
}
