// All Redis promise I/O in one place. Only TVK promises live in Redis (key `promises`);
// DMK promises stay in the static JSON. Import from server components and route handlers only.
// `Promise` is imported as PromiseType so the built-in Promise in return types stays unshadowed.
import allPromises from "@/lib/getAllPromises"
import { kvGet, kvSet } from "@/lib/kv"
import type { Promise as PromiseType } from "@/types"

const all = allPromises as PromiseType[]
const seed = all.filter((p) => p.partyId === "tvk")
const dmk = all.filter((p) => p.partyId === "dmk")

// Strict: throws on any Redis failure. Seeds the key when it is absent or empty.
// Admin approval and the export use this, so a read error never falls back to the seed
// and gets saved over earlier approvals.
// ponytail: seeding is a plain SET, so a seed that lands after a concurrent approval would
// overwrite it. The window is the first-ever read only; upgrade path is SET ... NX.
export async function loadTvkPromises(): Promise<PromiseType[]> {
  const stored = await kvGet<PromiseType[]>("promises")
  if (stored && stored.length > 0) return stored
  await kvSet("promises", seed)
  return seed
}

// Tolerant: for pages. Falls back to the seed and logs.
export async function getTvkPromises(): Promise<PromiseType[]> {
  try {
    return await loadTvkPromises()
  } catch (err) {
    console.error("Promise store unavailable, using seed:", err)
    return seed
  }
}

// The filter guarantees a DMK record can never reach Redis.
export async function saveTvkPromises(list: PromiseType[]): Promise<void> {
  await kvSet("promises", list.filter((p) => p.partyId === "tvk"))
}

export const getDmkPromises = () => dmk

// TVK from Redis, DMK from static. Used by both pages.
export async function getLivePromises(): Promise<PromiseType[]> {
  return [...(await getTvkPromises()), ...getDmkPromises()]
}
