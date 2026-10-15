// Assert-based check for lib/settings.ts, no framework. Run with `npm run check`.
// Feature: updates-feed-dedupe-dmk-toggle
// Runs under Node type stripping: erasable TS, `import type` for project types.
import assert from "node:assert/strict"
import type { Party, Promise as PromiseType } from "@/types"
import { applyVisibility, parseShowDmk } from "./settings.ts"

const sector = { id: "s", name: "S", nameTa: "S", icon: "i", color: "#000" }

const mk = (id: string, partyId: string): PromiseType => ({
  id,
  slug: id,
  partyId,
  title: id,
  titleTa: id,
  description: "d",
  manifestoQuote: "q",
  sector,
  status: "pending",
  icon: "i",
  sources: [],
  lastUpdated: "2026-01-01",
  createdAt: "2026-01-01",
})

const party = (id: string): Party => ({
  id,
  name: id,
  nameTa: id,
  shortName: id,
  color: "#000",
  electionYear: 2026,
  cmName: "cm",
  manifestoUrl: "https://example.com",
  status: "active",
})

// Feature: updates-feed-dedupe-dmk-toggle, Property 1: Only the boolean true shows DMK
assert.equal(parseShowDmk({ showDmk: true }), true, "object with showDmk true")
const notTrue: unknown[] = [
  undefined,
  null,
  true,
  1,
  "true",
  [],
  [true],
  {},
  { showDmk: false },
  { showDmk: "true" },
  { showDmk: 1 },
  { showDmk: null },
  { showdmk: true },
]
for (const v of notTrue) {
  assert.equal(parseShowDmk(v), false, `hidden for ${JSON.stringify(v)}`)
}

// Feature: updates-feed-dedupe-dmk-toggle, Property 2: The setting alone decides which promises and parties are visible
const tvkOnly = [mk("tvk-1", "tvk"), mk("tvk-2", "tvk")]
const stray = [mk("tvk-1", "tvk"), mk("stray", "dmk"), mk("tvk-2", "tvk")]
const dmkList = [mk("dmk-1", "dmk")]
const parties = [party("tvk"), party("dmk")]

function freezeSnap<T>(v: T): T {
  return structuredClone(v)
}

for (const [label, tvk] of [["clean", tvkOnly], ["stray-dmk", stray]] as const) {
  const tvkSnap = freezeSnap(tvk)
  const dmkSnap = freezeSnap(dmkList)
  const partySnap = freezeSnap(parties)

  const hidden = applyVisibility(false, tvk, dmkList, parties)
  assert.deepEqual(hidden.promises.map((p) => p.id), ["tvk-1", "tvk-2"], `${label} hidden: non-dmk in original order`)
  assert.ok(hidden.promises.every((p) => p.partyId !== "dmk"), `${label} hidden: no dmk promise`)
  assert.deepEqual(hidden.parties.map((p) => p.id), ["tvk"], `${label} hidden: no dmk party`)
  hidden.promises.forEach((p, i) => {
    const orig = tvk.filter((x) => x.partyId !== "dmk")[i]
    assert.equal(p, orig, `${label} hidden: same record reference ${p.id}`)
  })

  const shown = applyVisibility(true, tvk, dmkList, parties)
  assert.deepEqual(shown.promises.map((p) => p.id), tvk.map((p) => p.id).concat("dmk-1"), `${label} shown: TVK then DMK`)
  assert.deepEqual(shown.parties.map((p) => p.id), ["tvk", "dmk"], `${label} shown: every party`)
  shown.promises.forEach((p, i) => {
    const orig = i < tvk.length ? tvk[i] : dmkList[i - tvk.length]
    assert.equal(p, orig, `${label} shown: same record reference ${p.id}`)
  })
  shown.parties.forEach((p, i) => assert.equal(p, parties[i], `${label} shown: same party reference ${p.id}`))

  assert.deepEqual(tvk, tvkSnap, `${label}: tvk list unchanged`)
  assert.deepEqual(dmkList, dmkSnap, `${label}: dmk list unchanged`)
  assert.deepEqual(parties, partySnap, `${label}: parties unchanged`)
}

console.log("settings check: all passed")
