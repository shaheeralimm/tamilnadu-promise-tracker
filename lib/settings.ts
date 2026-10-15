// The DMK switch: one boolean in Redis under `settings`. Server only.
// The two pure rules live here so `npm run check` can run them under Node type stripping: erasable TS,
// `import type` for project types, and a relative `.ts` import for kv (Node cannot resolve the `@/` alias).
import { kvGet, kvSet } from "./kv.ts"
import type { Party, Promise as PromiseType } from "@/types"

export interface Visible {
  promises: PromiseType[]
  parties: Party[]
}

// Strict: only an object whose showDmk is the boolean true shows DMK. Missing key, "true", 1, null: hidden.
export const parseShowDmk = (raw: unknown): boolean =>
  typeof raw === "object" && raw !== null && (raw as { showDmk?: unknown }).showDmk === true

// Tolerant and uncached: every call reads Redis (kvGet sends cache: "no-store"). Any failure hides DMK.
export async function getShowDmk(): Promise<boolean> {
  try {
    return parseShowDmk(await kvGet<unknown>("settings"))
  } catch (err) {
    console.error("Settings store unavailable, hiding DMK:", err)
    return false
  }
}

// Strict: throws on any Redis failure so the route can answer 500.
// ponytail: last write wins when two Admins save at once; compare-and-set is the upgrade if more settings join the key.
export async function setShowDmk(showDmk: boolean): Promise<void> {
  await kvSet("settings", { showDmk })
}

// The one place the switch is applied. Filters by partyId only, never by slug or id shape. While hidden it
// also drops a stray dmk record from the TVK list (D3).
export function applyVisibility(
  showDmk: boolean,
  tvk: PromiseType[],
  dmk: PromiseType[],
  parties: Party[],
): Visible {
  return {
    promises: showDmk ? [...tvk, ...dmk] : tvk.filter((p) => p.partyId !== "dmk"),
    parties: showDmk ? parties : parties.filter((p) => p.id !== "dmk"),
  }
}
