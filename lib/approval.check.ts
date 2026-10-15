// Assert-based check for lib/approval.ts, no framework. Run with `npm run check`.
// Properties 1 to 4 of the upstash-promises-integration design.
// Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 9.1, 9.2
//
// Runs under Node type stripping: keep to erasable TS (no enums, namespaces or parameter
// properties) and `import type` for "@/types" (erased, so the alias is never resolved).
import assert from "node:assert/strict"
import type { Promise as PromiseType } from "@/types"
import { applyApproval } from "./approval.ts"

// Late UTC on purpose: a date taken in local time (IST, say) would roll over to the 16th.
const NOW = "2026-06-15T23:30:00.000Z"
const DAY = "2026-06-15"
const OLD = "https://example.com/old" // already cited by tvk-002
const NEW = "https://news.example.org/story" // fresh evidence

const mk = (id: string, slug: string, ...urls: string[]): PromiseType => ({
  id,
  slug,
  partyId: "tvk",
  title: id,
  titleTa: id,
  description: "d",
  manifestoQuote: "q",
  sector: { id: "s", name: "S", nameTa: "S", icon: "i", color: "#000" },
  status: "pending",
  icon: "i",
  sources: urls.map((url) => ({ title: "t", url, publication: "p", date: "2026-01-01", tier: 1, summary: "s" })),
  lastUpdated: "2026-01-01",
  createdAt: "2026-01-01",
})

const list = [
  mk("tvk-001", "free-electricity"),
  mk("tvk-002", "women-safety-force", OLD),
  mk("tvk-003", "anti-narcotics-task-force", "https://example.com/b"),
]
const ev = { evidenceUrl: NEW, details: "Gazette notice" }

// Property 1: a match by id or by slug updates that promise and nothing else.
for (const [by, promiseId, i] of [["id", "tvk-001", 0], ["slug", "anti-narcotics-task-force", 2]] as const) {
  const out = applyApproval(list, { ...ev, promiseId }, NOW)
  const hit = out[i]
  assert.notEqual(out, list, `match by ${by}: output is a new array`)
  assert.notEqual(hit, list[i], `match by ${by}: matched promise is a new object`)
  assert.equal(hit.status, "fulfilled", `match by ${by}: status is fulfilled`)
  assert.equal(hit.lastUpdated, DAY, `match by ${by}: lastUpdated is the date part of now`)
  assert.deepEqual(hit.sources.slice(0, -1), list[i].sources, `match by ${by}: existing sources are kept`)
  assert.equal(hit.sources.at(-1)?.url, NEW, `match by ${by}: evidenceUrl is appended to sources`)
  assert.equal(hit.sources.at(-1)?.tier, 3, `match by ${by}: appended source is tier 3`)
  const { status, lastUpdated, sources } = list[i]
  assert.deepEqual({ ...hit, status, lastUpdated, sources }, list[i], `match by ${by}: no other field changes`)
  out.forEach((p, j) => {
    if (j !== i) assert.equal(p, list[j], `match by ${by}: promise ${j} is the same reference`)
  })
}

// Property 3: a miss changes nothing. Matching is exact and case-sensitive, so near misses
// (wrong case, id prefix, slug fragment) must not match: a wrong match marks the wrong promise.
for (const promiseId of ["no-such-promise", "TVK-001", "tvk-00", "electricity", "", "   ", null]) {
  const out = applyApproval(list, { ...ev, promiseId }, NOW)
  const label = `miss (${JSON.stringify(promiseId)})`
  assert.deepEqual(out, list, `${label}: output deep-equals input`)
  assert.notEqual(out, list, `${label}: output is a new array`)
  assert.ok(out.every((p, j) => p === list[j]), `${label}: same promise objects, so callers can skip the write`)
}

// Property 2: duplicate evidence leaves sources alone, and applying twice equals applying once.
const dup = { promiseId: "tvk-002", evidenceUrl: OLD, details: "again" }
const dupHit = applyApproval(list, dup, NOW)[1]
assert.deepEqual(dupHit.sources, list[1].sources, "duplicate evidenceUrl: sources unchanged")
assert.equal(dupHit.status, "fulfilled", "duplicate evidenceUrl: status still applied")
assert.equal(dupHit.lastUpdated, DAY, "duplicate evidenceUrl: lastUpdated still applied")
for (const s of [{ ...ev, promiseId: "tvk-001" }, dup]) {
  const once = applyApproval(list, s, NOW)
  const twice = applyApproval(once, s, NOW)
  assert.deepEqual(twice, once, `apply twice equals apply once (${s.evidenceUrl})`)
  const listedTwice = twice.some((p) => p.sources.filter((x) => x.url === s.evidenceUrl).length > 1)
  assert.ok(!listedTwice, `no promise lists ${s.evidenceUrl} twice`)
}

// Property 4: a deep-frozen input makes any write throw (ES modules are strict).
function deepFreeze(o: unknown): void {
  if (o && typeof o === "object") {
    for (const v of Object.values(Object.freeze(o))) deepFreeze(v)
  }
}
const frozen = structuredClone(list)
deepFreeze(frozen)
const snapshot = structuredClone(frozen)
for (const s of [{ ...ev, promiseId: "tvk-001" }, { ...ev, promiseId: "women-safety-force" }, dup, { ...ev, promiseId: null }]) {
  const label = `frozen input (${s.promiseId})`
  let out: PromiseType[] = []
  assert.doesNotThrow(() => { out = applyApproval(frozen, s, NOW) }, `${label}: applyApproval must not write to its input`)
  assert.notEqual(out, frozen, `${label}: output is a new array`)
  assert.deepEqual(frozen, snapshot, `${label}: input is unchanged`)
}

console.log("approval check: all passed")
