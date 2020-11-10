type Chapter = { start_offset_ms: number, title: string }
type ParentChapter = Chapter & { chapters: Chapter[] }

function isParent(node: Chapter): node is ParentChapter {
  return ("chapters" in node)
}

function zeroPad(num: number, places: number): string {
  return String(num).padStart(places, '0')
}

function startTimestamp(c: Chapter): string {
  return timestamp(c.start_offset_ms)
}

function isolateMs(time: number, seconds: number,
                   minutes: number, hours: number): string {
  const msCovered = seconds * 1e3 + minutes * 6e4 + hours * 36e5
  return zeroPad(Math.trunc(time - msCovered), 3)
}

function serializer(depth = 0) {
  return (c: Chapter) => serializeChapter(c, depth)
}

function serializeParent(chapters: Chapter[], depth = 0) {
  return chapters.map(serializer(depth)).join('\n')
}

function timestamp(ms: number): string {
  const hours = Math.trunc(ms / (36e5))
  const minutes = Math.trunc((ms / (6e4)) % 60)
  const seconds = Math.trunc((ms / 1e3) % 60)

  const msCovered = seconds * 1e3 + minutes * 6e4 + hours * 36e5
  const remainder = zeroPad(Math.trunc(ms - msCovered), 3)

  const h = zeroPad(hours, 2)
  const m = zeroPad(minutes, 2)
  const s = zeroPad(seconds, 2)

  return `${h}:${m}:${s}.${remainder}`
}

function serializeChapter(c: Chapter, depth = 0): string {
  const indent: string = (Array<string>(depth)).fill('  ').join('')
  const line: string = `${startTimestamp(c)} ${indent}${c.title}`

  if (isParent(c)) {
    const childLines = serializeParent(c.chapters, depth + 1)
    return [line, childLines].join('\n')
  }

  return line
}

/**
 * Main function
 */
(async function main() {
  await Deno.readTextFile('./chapters.json')
    .then(JSON.parse)
    .then(serializeParent)
    .then(console.log)
})()

