// Pure approval logic: no I/O, no clock (the caller passes `now`).
// Keep this file to `import type` and erasable TS (no enums, namespaces, parameter
// properties or runtime path-alias imports) so `npm run check` can run it under
// Node's type stripping.
import type { Promise as PromiseType, Source, Submission } from "@/types"

function toSource(sub: Pick<Submission, "evidenceUrl" | "details">, date: string): Source {
  let publication = sub.evidenceUrl
  try {
    publication = new URL(sub.evidenceUrl).hostname || publication
  } catch {
    // Malformed URL: keep the raw string rather than failing the approval.
  }
  return {
    title: "Citizen-submitted evidence",
    url: sub.evidenceUrl,
    publication,
    date,
    tier: 3, // lowest tier: unreviewed citizen evidence
    summary: sub.details,
  }
}

// Returns a new list and never mutates its input. Only the matched promise is replaced
// (by a new object); every other promise is the same reference, so callers can detect a
// change with `next.some((p, i) => p !== promises[i])`.
export function applyApproval(
  promises: PromiseType[],
  sub: Pick<Submission, "promiseId" | "evidenceUrl" | "details">,
  now: string, // ISO timestamp
): PromiseType[] {
  const ref = sub.promiseId?.trim()
  if (!ref) return [...promises]
  const date = now.slice(0, 10)
  return promises.map((p) => {
    if (p.id !== ref && p.slug !== ref) return p
    // Duplicate evidence leaves `sources` alone but the promise is still marked fulfilled.
    // ponytail: exact URL match, so a near-duplicate (e.g. trailing slash) is added again.
    // Normalise both sides if that starts to matter.
    const hasEvidence = p.sources.some((s) => s.url === sub.evidenceUrl)
    return {
      ...p,
      status: "fulfilled",
      lastUpdated: date,
      sources: hasEvidence ? p.sources : [...p.sources, toSource(sub, date)],
    }
  })
}
