# Implementation Plan: Upstash Promises Integration

## Overview

TypeScript, no new dependencies. Build the shared pieces first (types, `kv.ts`, `applyApproval` and its check), then `promiseStore.ts`, then wire the routes and pages onto them. Final task runs check, build, and lint. All work is in the main workspace.

## Tasks

- [x] 1. Shared foundations
  - [x] 1.1 Add `Submission` types
    - In `types/index.ts` add `SubmissionStatus` and the `Submission` interface exactly as in the design
    - _Requirements: 2.2, 2.3, 4.3_

  - [x] 1.2 Extract `lib/kv.ts`
    - Create `kvGet<T>(key)` and `kvSet(key, value)` with `cache: "no-store"` on every fetch
    - Throw errors that name `KV_REST_API_URL` or `KV_REST_API_TOKEN` when missing
    - Keep the same REST calls and JSON-string storage format the routes use today
    - _Requirements: 1.5, 2.1, 2.5_

  - [x] 1.3 Enable the check script
    - Add `"allowImportingTsExtensions": true` to `tsconfig.json`
    - Add `"check": "node --experimental-strip-types lib/approval.check.ts"` to `package.json` scripts
    - _Requirements: 9.1_

  - [x] 1.4 Implement `lib/approval.ts`
    - Pure `applyApproval(promises, sub, now)`, `import type` only, no enums
    - Match `promiseId` to `id` or `slug` (exact); empty, null, or unmatched returns a copy of the list with the same promise objects
    - On match: `status` `fulfilled`, `lastUpdated` = `now.slice(0, 10)`, append a tier 3 source built from the submission unless `evidenceUrl` is already in `sources`
    - Never mutate the input list or its objects
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8_

  - [x] 1.5 Write `lib/approval.check.ts`
    - Assert-based, no framework, imports `./approval.ts`
    - Cases: match by `id`, match by `slug`, miss (unknown, empty string, `null`) deep-equals input, duplicate `evidenceUrl` leaves `sources` unchanged and apply-twice equals apply-once, deep-frozen input does not throw and the output is a new array
    - Run `npm run check` and make it pass
    - **Properties 1, 2, 3, 4: approval applies to the match, is idempotent, misses change nothing, input is not mutated**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 9.1, 9.2**

- [x] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Promise store
  - [x] 3.1 Implement `lib/promiseStore.ts`
    - Derive `seed` (`partyId === "tvk"`) and `dmk` (`partyId === "dmk"`) from `lib/getAllPromises`
    - `loadTvkPromises` (strict, lazily seeds the `promises` key when absent or empty), `getTvkPromises` (tolerant, logs and returns seed), `saveTvkPromises` (filters to TVK before `kvSet`), `getLivePromises` (TVK then DMK), and `getDmkPromises`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4, 5.2, 5.5, 8.2_

- [x] 4. Route changes
  - [x] 4.1 Update `app/api/submit/route.ts`
    - Replace the local KV helpers with `kvGet`/`kvSet` on `submissions`; use the `Submission` type
    - Do not import the promise store or approval; keep status `pending` and the existing field set
    - _Requirements: 2.2, 4.1, 4.2, 4.3_

  - [x] 4.2 Update `app/api/admin/submissions/route.ts`
    - Replace local KV helpers with `kvGet`/`kvSet`; delete the private `isAdmin()` and use `isAdminEmail()` in `GET` and `PATCH`
    - In `PATCH` on `approved`: `loadTvkPromises`, `applyApproval`, `saveTvkPromises` only if something changed, and only then update and save the submission
    - Add the `ponytail:` comment on the read-modify-write naming the lost-update ceiling and the `HSET` upgrade path
    - Leave promises untouched for `pending` and `rejected`; keep the existing `catch` returning 500
    - _Requirements: 2.3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7_

  - [x] 4.3 Add `app/api/admin/promises/export/route.ts`
    - `GET` with `dynamic = "force-dynamic"`; 403 unless `isAdminEmail(session?.user?.email)`
    - Return `[...(await loadTvkPromises()), ...getDmkPromises()]` as pretty-printed JSON with `Content-Disposition: attachment; filename="promises.json"` and `Cache-Control: no-store`
    - Log and return 500 on failure; no file writes or git calls
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 5. Page changes
  - [x] 5.1 Split the `/promises` page
    - `git mv app/promises/page.tsx app/promises/PromisesClient.tsx`; keep `"use client"` and the `Suspense` wrapper; replace the `getAllPromises` import with a `promises` prop
    - New server `app/promises/page.tsx` with `dynamic = "force-dynamic"` that renders `<PromisesClient promises={await getLivePromises()} />`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 5.2 Update `app/promises/[slug]/page.tsx`
    - Remove `generateStaticParams`, add `dynamic = "force-dynamic"`, and use `await getLivePromises()` for the lookup and related promises
    - Keep `notFound()` for unknown slugs
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6. Final verification
  - [x] 6.1 Run check, build, and lint
    - `npm run check`, `npm run build`, `npm run lint` all pass
    - Build output lists `/promises` and `/promises/[slug]` as dynamic
    - Confirm other pages still import `lib/getAllPromises` (grep) and are unchanged
    - _Requirements: 5.4, 6.4, 7.1, 7.2, 9.1_

## Notes

- No optional tasks: the check (task 1.5) is required by requirement 9.
- Property 5 (live list and TVK-only writes) depends on Redis I/O, so it has no automated check, matching the design's testing strategy. It is covered by code reading in 3.1 and the manual run listed in the design.
- Properties 1 to 4 share one check file, so they are one task rather than four.
- Tasks that edit the same file are never in the same wave.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "3.1"] },
    { "id": 2, "tasks": ["1.5", "4.1", "4.2", "4.3", "5.1", "5.2"] },
    { "id": 3, "tasks": ["6.1"] }
  ]
}
```
