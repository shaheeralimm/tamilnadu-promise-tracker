// Pure: no I/O, no clock, never mutates its input. Keep this file to `import type` and erasable TS (no
// enums, namespaces or parameter properties) so `npm run check` can run it under Node type stripping.
import type { Promise as PromiseType, Source, SourceTier } from "@/types"

export interface RelatedEntry {
  id: string // Promise id, used as the React key
  slug: string
  title: string // Promise title
  sectorColor: string
  sourceTitle?: string // only when it differs from the card title
  note?: string // only when not empty and different from the card summary
}

export interface FeedCard {
  key: string // the Group_Key, or `${promiseId}#${sourceIndex}` for an Unlinkable_URL
  url: string | null // null means Unlinkable_URL: no "Read Source" link
  date: string // YYYY-MM-DD
  tier: SourceTier
  title: string
  summary: string // "" means none
  related: RelatedEntry[] // Input_Order, one per Promise
}

interface Entry {
  p: PromiseType
  s: Source
}

const isLinkable = (url: unknown): url is string =>
  typeof url === "string" && url.trim() !== "" && url !== "#"

// The value held by the most entries, but only if two or more hold it. Map iterates in first-seen order and
// `>` is strict, so a tie goes to the value seen first.
function mostShared(values: string[]): string | undefined {
  const count = new Map<string, number>()
  for (const v of values) count.set(v, (count.get(v) ?? 0) + 1)
  let best: string | undefined
  let top = 1
  for (const [v, n] of count) {
    if (n > top) {
      best = v
      top = n
    }
  }
  return best
}

// ponytail: URLs and dates compared as exact text; http vs https, a trailing slash or letter case keep
// duplicate cards apart. Upgrade: normalise the URL when the Group_Key is built.
// ponytail: dates are ISO text (YYYY-MM-DD). A non-ISO date sorts wrongly; an unparseable one prints
// "Invalid Date". Upgrade: validate dates where Sources are written.
// Precondition: promise ids are unique and contain no `|`. A linkable key always contains `|`, an
// unlinkable key never does, so the two kinds cannot collide.
export function groupFeed(promises: PromiseType[]): FeedCard[] {
  const buckets = new Map<string, Entry[]>()
  for (const p of promises) {
    p.sources.forEach((s, i) => {
      const key = isLinkable(s.url) ? `${s.url}|${s.date}` : `${p.id}#${i}`
      const bucket = buckets.get(key)
      if (bucket) bucket.push({ p, s })
      else buckets.set(key, [{ p, s }])
    })
  }

  const cards: FeedCard[] = []
  for (const [key, all] of buckets) {
    const seen = new Set<string>()
    const e = all.filter(({ p }) => {
      if (seen.has(p.id)) return false // a repeat of one promise in this group
      seen.add(p.id)
      return true
    })
    const first = e[0].s
    const title =
      e.length === 1
        ? first.title
        : (mostShared(e.map(({ s }) => s.title)) ?? (first.publication.trim() ? first.publication : first.title))
    const summary = e.length === 1 ? first.summary : (mostShared(e.map(({ s }) => s.summary)) ?? "")
    cards.push({
      key,
      url: isLinkable(first.url) ? first.url : null,
      date: first.date,
      tier: Math.min(...e.map(({ s }) => s.tier)) as SourceTier,
      title,
      summary,
      related: e.map(({ p, s }) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        sectorColor: p.sector.color,
        ...(s.title !== title && { sourceTitle: s.title }),
        ...(s.summary !== "" && s.summary !== summary && { note: s.summary }),
      })),
    })
  }

  // Newest first. Equal dates keep creation order, which is Input_Order of the first entry.
  return cards.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
