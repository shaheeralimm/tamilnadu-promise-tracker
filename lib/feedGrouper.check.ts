// Assert-based check for lib/feedGrouper.ts, no framework. Run with `npm run check`.
// Feature: updates-feed-dedupe-dmk-toggle
// Runs under Node type stripping: erasable TS, `import type` for project types.
import assert from "node:assert/strict"
import type { Promise as PromiseType, Source, SourceTier } from "@/types"
import { groupFeed, type FeedCard } from "./feedGrouper.ts"

const sector = { id: "s", name: "S", nameTa: "S", icon: "i", color: "#abc" }

function src(url: string | undefined, date: string, overrides: Partial<Source> = {}): Source {
  return {
    title: "t",
    url: url ?? "",
    publication: "P",
    date,
    tier: 2,
    summary: "n",
    ...overrides,
  }
}

function mk(id: string, sources: Source[], partyId = "tvk"): PromiseType {
  return {
    id,
    slug: id,
    partyId,
    title: `promise-${id}`,
    titleTa: id,
    description: "d",
    manifestoQuote: "q",
    sector,
    status: "pending",
    icon: "i",
    sources,
    lastUpdated: "2026-01-01",
    createdAt: "2026-01-01",
  }
}

function deepFreeze(o: unknown): void {
  if (o && typeof o === "object") {
    for (const v of Object.values(Object.freeze(o))) deepFreeze(v)
  }
}

function isLinkable(url: unknown): url is string {
  return typeof url === "string" && url.trim() !== "" && url !== "#"
}

function groupKey(s: Source): string {
  return `${s.url}|${s.date}`
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 3: Cards partition the entries by Group_Key (hand-built)
{
  const a = mk("a", [src("https://u/same", "2026-01-02", { title: "A", summary: "sa", tier: 2 })], "tvk")
  const b = mk("b", [src("https://u/same", "2026-01-02", { title: "B", summary: "sb", tier: 1 })], "dmk")
  const c = mk("c", [src("https://u/same", "2026-01-01", { title: "C", summary: "sc", tier: 3 })], "tvk")
  const cards = groupFeed([a, b, c])
  assert.equal(cards.length, 2, "same URL different dates: two cards")
  const later = cards.find((x) => x.date === "2026-01-02")
  const earlier = cards.find((x) => x.date === "2026-01-01")
  assert.ok(later && earlier)
  assert.deepEqual(later.related.map((r) => r.id), ["a", "b"], "same URL+date lists every promise")
  assert.equal(later.key, "https://u/same|2026-01-02")
  assert.equal(earlier.related.length, 1)
}

{
  for (const url of [undefined, "", "   ", "#"] as const) {
    const p1 = mk("p1", [src(url, "2026-03-01")])
    const p2 = mk("p2", [src(url, "2026-03-01")])
    const cards = groupFeed([p1, p2])
    assert.equal(cards.length, 2, `unlinkable ${JSON.stringify(url)} never merge`)
    assert.ok(cards.every((c) => c.url === null))
  }
}

{
  const p = mk("dup", [
    src("https://u/x", "2026-02-01", { title: "Shared", tier: 1, summary: "keep" }),
    src("https://u/x", "2026-02-01", { title: "Shared", tier: 3, summary: "drop" }),
  ])
  const other = mk("o", [src("https://u/x", "2026-02-01", { title: "Shared", tier: 2, summary: "keep" })])
  const cards = groupFeed([p, other])
  assert.equal(cards.length, 1)
  assert.deepEqual(cards[0].related.map((r) => r.id), ["dup", "o"], "repeat of one promise listed once")
  assert.equal(cards[0].tier, 1, "dropped repeat must not be counted; lowest kept tier is 1")
  assert.equal(cards[0].title, "Shared")
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 6: The card tier is the lowest tier of its kept entries
{
  const cards = groupFeed([
    mk("a", [src("https://u/t", "2026-01-01", { tier: 3 })]),
    mk("b", [src("https://u/t", "2026-01-01", { tier: 2 })]),
    mk("c", [src("https://u/t", "2026-01-01", { tier: 1 })]),
  ])
  assert.equal(cards[0].tier, 1)
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 7: Title and summary follow the shared-value rule
{
  const one = groupFeed([mk("solo", [src("https://u/1", "2026-01-01", { title: "SoloTitle", summary: "SoloNote" })])])
  assert.equal(one[0].title, "SoloTitle")
  assert.equal(one[0].summary, "SoloNote")
}

{
  const cards = groupFeed([
    mk("a", [src("https://u/s", "2026-01-01", { title: "Main", summary: "n1" })]),
    mk("b", [src("https://u/s", "2026-01-01", { title: "Main", summary: "n2" })]),
    mk("c", [src("https://u/s", "2026-01-01", { title: "Odd", summary: "n3" })]),
  ])
  assert.equal(cards[0].title, "Main")
  const odd = cards[0].related.find((r) => r.id === "c")
  assert.equal(odd?.sourceTitle, "Odd")
  assert.equal(cards[0].related.find((r) => r.id === "a")?.sourceTitle, undefined)
}

{
  const order1 = groupFeed([
    mk("a", [src("https://u/tie", "2026-01-01", { title: "First" })]),
    mk("b", [src("https://u/tie", "2026-01-01", { title: "Second" })]),
  ])
  assert.equal(order1[0].title, "P", "no shared title: publication of first")
  const blankPub = groupFeed([
    mk("a", [src("https://u/tie2", "2026-01-01", { title: "First", publication: "   " })]),
    mk("b", [src("https://u/tie2", "2026-01-01", { title: "Second", publication: "Q" })]),
  ])
  assert.equal(blankPub[0].title, "First", "blank publication falls back to first Source_Title")

  const tieA = groupFeed([
    mk("a", [src("https://u/tie3", "2026-01-01", { title: "Alpha" })]),
    mk("b", [src("https://u/tie3", "2026-01-01", { title: "Beta" })]),
    mk("c", [src("https://u/tie3", "2026-01-01", { title: "Alpha" })]),
    mk("d", [src("https://u/tie3", "2026-01-01", { title: "Beta" })]),
  ])
  assert.equal(tieA[0].title, "Alpha", "title tie: first seen")
  const tieB = groupFeed([
    mk("a", [src("https://u/tie4", "2026-01-01", { title: "Beta" })]),
    mk("b", [src("https://u/tie4", "2026-01-01", { title: "Alpha" })]),
    mk("c", [src("https://u/tie4", "2026-01-01", { title: "Beta" })]),
    mk("d", [src("https://u/tie4", "2026-01-01", { title: "Alpha" })]),
  ])
  assert.equal(tieB[0].title, "Beta", "title tie reversed: first seen")
}

{
  const sharedNote = groupFeed([
    mk("a", [src("https://u/n", "2026-01-01", { summary: "Shared" })]),
    mk("b", [src("https://u/n", "2026-01-01", { summary: "Shared" })]),
    mk("c", [src("https://u/n", "2026-01-01", { summary: "Other" })]),
  ])
  assert.equal(sharedNote[0].summary, "Shared")
  assert.equal(sharedNote[0].related.find((r) => r.id === "c")?.note, "Other")

  const noneShared = groupFeed([
    mk("a", [src("https://u/n2", "2026-01-01", { summary: "x" })]),
    mk("b", [src("https://u/n2", "2026-01-01", { summary: "y" })]),
  ])
  assert.equal(noneShared[0].summary, "")
  assert.equal(noneShared[0].related[0].note, "x")
  assert.equal(noneShared[0].related[1].note, "y")

  const emptyBeside = groupFeed([
    mk("a", [src("https://u/n3", "2026-01-01", { summary: "Keep" })]),
    mk("b", [src("https://u/n3", "2026-01-01", { summary: "Keep" })]),
    mk("c", [src("https://u/n3", "2026-01-01", { summary: "" })]),
  ])
  assert.equal(emptyBeside[0].summary, "Keep")
  assert.equal(emptyBeside[0].related.find((r) => r.id === "c")?.note, undefined)
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 8: Related entries carry only what differs from the card
{
  const cards = groupFeed([
    mk("a", [src("https://u/d", "2026-01-01", { title: "Same", summary: "SameN" })]),
    mk("b", [src("https://u/d", "2026-01-01", { title: "Same", summary: "SameN" })]),
    mk("c", [src("https://u/d", "2026-01-01", { title: "Diff", summary: "OtherN" })]),
  ])
  assert.equal(cards[0].title, "Same")
  assert.equal(cards[0].summary, "SameN")
  assert.equal(cards[0].related[0].sourceTitle, undefined)
  assert.equal(cards[0].related[0].note, undefined)
  assert.equal(cards[0].related[1].sourceTitle, undefined)
  assert.equal(cards[0].related[1].note, undefined)
  assert.equal(cards[0].related[2].sourceTitle, "Diff")
  assert.equal(cards[0].related[2].note, "OtherN")
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 9: Newest first, then Input_Order
{
  const cards = groupFeed([
    mk("old", [src("https://u/a", "2026-01-01")]),
    mk("newA", [src("https://u/b", "2026-03-01")]),
    mk("mid", [src("https://u/c", "2026-02-01")]),
    mk("newB", [src("https://u/d", "2026-03-01")]),
  ])
  assert.deepEqual(cards.map((c) => c.related[0].id), ["newA", "newB", "mid", "old"])
}

{
  const cards = groupFeed([
    mk("first", [src("https://u/e1", "2026-01-01")]),
    mk("second", [src("https://u/e2", "2026-01-01")]),
  ])
  assert.deepEqual(cards.map((c) => c.related[0].id), ["first", "second"], "equal dates: Input_Order")
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 10: Keys are unique, stable, and derived from the source
{
  const p = mk("k", [
    src("https://u/link", "2026-01-01"),
    src("", "2026-01-01"),
    src("#", "2026-01-02"),
  ])
  const extra = mk("extra", [src("https://u/other", "2026-04-01")])
  const cards = groupFeed([p])
  const keys = cards.map((c) => c.key)
  assert.equal(new Set(keys).size, keys.length, "keys unique")
  assert.ok(keys.includes("https://u/link|2026-01-01"))
  assert.ok(keys.includes("k#1"))
  assert.ok(keys.includes("k#2"))
  const extended = groupFeed([extra, p])
  for (const k of keys) assert.ok(extended.some((c) => c.key === k), `key ${k} still present after prepend`)
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 5: Grouping is deterministic and does not change its input
{
  const input = [
    mk("a", [src("https://u/f", "2026-01-01"), src("#", "2026-01-02")]),
    mk("b", [src("https://u/f", "2026-01-01")]),
  ]
  const frozen = structuredClone(input)
  deepFreeze(frozen)
  const snapshot = structuredClone(frozen)
  let out: FeedCard[] = []
  assert.doesNotThrow(() => {
    out = groupFeed(frozen)
  })
  assert.deepEqual(frozen, snapshot, "frozen input unchanged")
  assert.deepEqual(out, groupFeed(input), "frozen result equals unfrozen")
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const URLS: (string | undefined)[] = ["https://u/1", "https://u/2", "", "#", "  ", undefined]
const DATES = ["2026-01-01", "2026-01-02", "2026-01-03"]
const TITLES = ["t1", "t2", "t3"]
const NOTES = ["x", "y", ""]
const TIERS: SourceTier[] = [1, 2, 3]
const PUBS = ["P", ""]

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function genList(rng: () => number): PromiseType[] {
  const n = 1 + Math.floor(rng() * 5)
  const out: PromiseType[] = []
  for (let i = 0; i < n; i++) {
    const nSrc = Math.floor(rng() * 4)
    const sources: Source[] = []
    for (let j = 0; j < nSrc; j++) {
      sources.push(
        src(pick(rng, URLS), pick(rng, DATES), {
          title: pick(rng, TITLES),
          summary: pick(rng, NOTES),
          tier: pick(rng, TIERS),
          publication: pick(rng, PUBS),
        }),
      )
    }
    out.push(mk(`p${i}`, sources, rng() < 0.5 ? "tvk" : "dmk"))
  }
  return out
}

function oracle(promises: PromiseType[]) {
  type Item = { p: PromiseType; s: Source; i: number; pos: number }
  const buckets = new Map<string, Item[]>()
  let pos = 0
  for (const p of promises) {
    p.sources.forEach((s, i) => {
      const key = isLinkable(s.url) ? groupKey(s) : `${p.id}#${i}`
      const bucket = buckets.get(key)
      const item = { p, s, i, pos }
      if (bucket) bucket.push(item)
      else buckets.set(key, [item])
      pos++
    })
  }
  const cards: { key: string; ids: string[]; firstPos: number; date: string }[] = []
  for (const [key, all] of buckets) {
    const seen = new Set<string>()
    const kept: Item[] = []
    for (const item of all) {
      if (seen.has(item.p.id)) continue
      seen.add(item.p.id)
      kept.push(item)
    }
    cards.push({
      key,
      ids: kept.map((x) => x.p.id),
      firstPos: kept[0].pos,
      date: kept[0].s.date,
    })
  }
  cards.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.firstPos - b.firstPos))
  return cards
}

function assertAgainstOracle(promises: PromiseType[], seed: number) {
  const cards = groupFeed(promises)
  const expected = oracle(promises)
  const label = `seed ${seed}`
  assert.equal(cards.length, expected.length, `${label}: card count`)
  assert.equal(new Set(cards.map((c) => c.key)).size, cards.length, `${label}: unique keys`)
  for (let i = 0; i < cards.length; i++) {
    assert.equal(cards[i].key, expected[i].key, `${label}: key ${i}`)
    assert.deepEqual(cards[i].related.map((r) => r.id), expected[i].ids, `${label}: related ${cards[i].key}`)
  }
  for (let i = 1; i < cards.length; i++) {
    assert.ok(cards[i - 1].date >= cards[i].date, `${label}: newest first`)
  }
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 3/4/5/9/10 generated lists
for (let seed = 1; seed <= 200; seed++) {
  const rng = mulberry32(seed)
  const list = genList(rng)
  assertAgainstOracle(list, seed)

  const extra = mk("zx-extra", [src("https://u/extra", "2026-12-01")])
  extra.id = "zx-extra"
  const origKeys = new Set(groupFeed(list).map((c) => c.key))
  const extendedKeys = new Set(groupFeed([...list, extra]).map((c) => c.key))
  for (const k of origKeys) {
    assert.ok(extendedKeys.has(k), `seed ${seed}: key ${k} still present after extra promise`)
  }

  const swapped = list.map((p) => ({ ...p, partyId: p.partyId === "tvk" ? "dmk" : "tvk" }))
  assert.deepEqual(groupFeed(swapped), groupFeed(list), `seed ${seed}: party has no effect`)

  const frozen = structuredClone(list)
  deepFreeze(frozen)
  let frozenOut: FeedCard[] = []
  assert.doesNotThrow(() => {
    frozenOut = groupFeed(frozen)
  }, `seed ${seed}: frozen does not throw`)
  assert.deepEqual(frozenOut, groupFeed(list), `seed ${seed}: frozen equals unfrozen`)
}

console.log("feedGrouper check: all passed")
