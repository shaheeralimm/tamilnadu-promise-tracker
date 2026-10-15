# Implementation Plan: Updates Feed Dedupe and DMK Visibility Toggle

## Overview

TypeScript on Next.js 16 (App Router), React 19 and Tailwind 4. No new dependency and no new test framework. The plan follows `design.md`: decisions D1 to D10, the file map, the page-by-page table, and the `check` script change.

Order of work: the pure logic first (`lib/settings.ts`, `lib/feedGrouper.ts`) with their runnable checks wired into `npm run check`; then `getVisible()` and the Settings API; then the Admin switch; then each page and client component moves to `getVisible()`; then the `/updates` feed; then final verification.

The build must stay green after every task. Two rules make that true. When a component gains a prop, its parent changes in the same task. `getLivePromises` stays in `lib/promiseStore.ts` until its last caller has moved, and task 6.3 deletes it only after a search shows no caller is left.

After each code task, run `npx tsc --noEmit` and fix errors in the files that task changed.

## Tasks

- [ ] 1. Settings rules and their check
  - [ ] 1.1 Create `lib/settings.ts`
    - Export `Visible`, `parseShowDmk`, `getShowDmk`, `setShowDmk` and `applyVisibility`, in the shape given in design section 1
    - `parseShowDmk` returns true only for an object whose `showDmk` is the boolean `true`. `getShowDmk` calls `kvGet("settings")` on every call (no module variable, no `cache()`), and on any failure logs and returns `false`. `setShowDmk` calls `kvSet("settings", { showDmk })` and lets errors propagate
    - `applyVisibility(showDmk, tvk, dmk, parties)` is pure and filters by `partyId` and party `id` only. While hidden it also drops a stray `dmk` record from the TVK list (D3)
    - Import kv as `./kv.ts` and project types with `import type`, using erasable TS only, so Node type stripping can load the file (D2). `tsconfig.json` already allows the `.ts` extension, so no config change
    - Add a `ponytail:` comment: last write wins when two Admins save at once; compare-and-set is the upgrade if more settings join the key
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 4.1, 4.2, 4.3, 14.5_

  - [ ] 1.2 Write `lib/settings.check.ts` (required)
    - Follow `lib/approval.check.ts`: `node:assert/strict`, erasable TS, `import type` for project types, import `./settings.ts`, end with a "settings check: all passed" line
    - `parseShowDmk` is `true` for `{ showDmk: true }` and `false` for the 13 values in the design: `undefined`, `null`, `true`, `1`, `"true"`, `[]`, `[true]`, `{}`, `{ showDmk: false }`, `{ showDmk: "true" }`, `{ showDmk: 1 }`, `{ showDmk: null }`, `{ showdmk: true }`
    - `applyVisibility` with hand-built lists, for both booleans, with and without a stray `dmk` record in the TVK list: hidden returns only non-`dmk` records in original order and no `dmk` party; shown returns TVK then DMK in order and every party; no record is altered
    - Run `node --experimental-strip-types lib/settings.check.ts` and see it pass. Then loosen `parseShowDmk` to a truthy test, and separately remove the stray-record filter; confirm each makes the check fail, and restore both
    - _Requirements: 1.2, 1.3, 4.1, 4.2, 4.3_
    - **Property 1: Only the boolean true shows DMK**
    - **Property 2: The setting alone decides which promises and parties are visible**
    - **Validates: Requirements 1.2, 1.3, 4.1, 4.2, 4.3, 8.4**

- [ ] 2. Feed grouper, its check, and the check script
  - [ ] 2.1 Create `lib/feedGrouper.ts`
    - Export `RelatedEntry`, `FeedCard` and `groupFeed(promises)`, following the algorithm and implementation in design section 3
    - Bucket by Group_Key (`url|date`, exact text). An Unlinkable_URL (absent, empty, whitespace only, or `#`) gets its own bucket keyed `${promise.id}#${sourceIndex}` and `url: null`. Keep only the first entry of each promise in a bucket. Tier is the lowest tier. Title and summary follow the shared-value rule with ties going to the value seen first, and a blank `publication` counts as empty for the title fallback (D6). A related entry carries `sourceTitle` and `note` only when they differ from the card. Sort newest first by comparing the date text; the sort is stable, so equal dates keep Input_Order
    - Pure: no I/O, no clock, no mutation of the input. Only `import type` and erasable TS (no enums, namespaces or parameter properties), so Node type stripping can run it
    - Add `ponytail:` comments for the exact-text URL and date compare (upgrade: normalise the URL when the Group_Key is built) and for ISO date text (upgrade: validate dates where Sources are written). Note the precondition that promise ids are unique and contain no `|`
    - Nothing in the app imports this file yet. Tasks 2.2 to 2.4 exercise it and task 9.1 wires it into `/updates`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 11.1, 11.2, 11.3, 11.4, 11.5, 16.3_

  - [ ] 2.2 Write `lib/feedGrouper.check.ts`: helpers, grouping and card content (required)
    - Create the file in the style of `lib/approval.check.ts`. Build every fixture inside the file with two helpers, `src(url, date, overrides)` and `mk(id, sources, partyId)`, so edits to the data files cannot break the check
    - Grouping cases: same URL and date with different titles, notes, tiers and parties give one card that lists every promise; the same URL on another date gives a second card; for each of `undefined`, `""`, `"   "` and `"#"`, two entries with the same date give two cards with `url` null; a promise that cites a link twice is listed once, and the dropped repeat carries the lowest tier and the shared title so that counting repeats makes the check fail
    - Card-content cases: lowest tier wins; a single entry keeps its own title and Note; a shared title wins and the odd entry gets `sourceTitle`; a title tie goes to the value seen first, tested in both orders; the `publication` fallback, and a blank `publication` falling back to the first Source_Title; a shared Note becomes the summary; with no shared Note the summary is empty and every non-empty Note is on its entry; an empty Note beside a shared Note is not carried
    - End with a "feedGrouper check: all passed" line. Run `node --experimental-strip-types lib/feedGrouper.check.ts`; the file must also pass `npx tsc --noEmit`
    - _Requirements: 16.1, 16.4, 16.5, 16.6_
    - **Property 3: Cards partition the entries by Group_Key** (hand-built cases)
    - **Property 6: The card tier is the lowest tier of its kept entries**
    - **Property 7: Title and summary follow the shared-value rule**
    - **Property 8: Related entries carry only what differs from the card**
    - **Validates: Requirements 9.2, 9.3, 9.5, 9.6, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11**

  - [ ] 2.3 Extend `lib/feedGrouper.check.ts`: order, keys and frozen input (required)
    - Newest first, with equal dates in Input_Order; keys are unique; keys for linkable URLs equal `url|date`; two unlinkable sources of one promise get different keys; prepending an unrelated promise leaves every existing key unchanged
    - A deep-frozen hand-built list: the call does not throw, the input is unchanged, and the result deep-equals the result for the unfrozen list
    - Tag each block with a comment in the form `// Feature: updates-feed-dedupe-dmk-toggle, Property 9: Newest first, then Input_Order`
    - _Requirements: 16.7, 16.8_
    - **Property 5: Grouping is deterministic and does not change its input**
    - **Property 9: Newest first, then Input_Order**
    - **Property 10: Keys are unique, stable, and derived from the source**
    - **Validates: Requirements 9.7, 9.8, 11.1, 11.2, 11.3, 11.4, 11.5, 16.8**

  - [ ] 2.4 Extend `lib/feedGrouper.check.ts`: generated lists against an oracle (required)
    - Add a 10-line seeded `mulberry32` and a generator for 200 small lists from tiny alphabets so collisions are common: URLs `https://u/1`, `https://u/2`, `""`, `"#"`, `"  "`, `undefined`; 3 dates; 3 titles; Notes `x`, `y`, `""`; 3 tiers; `publication` `P` or `""`; 1 to 5 promises of either party with 0 to 3 Sources each
    - A brute-force oracle computes the expected keys, the promises per key in Input_Order, and each key's first position. Assert: one card per Group_Key or per unlinkable entry; each promise once per card in Input_Order; keys unique and equal to the oracle's; every key still present after an extra promise is added; newest first with ties in Input_Order; no change when every `partyId` is replaced; the same result, with no throw, on a deep-frozen clone. A failure message names its seed
    - Do not re-implement the title and summary rules in the oracle; properties 6 to 8 stay hand-built (task 2.2)
    - Spot-check that the check can fail: temporarily apply a few of the design's mutations (keep repeats, treat `#` as linkable, put the party in the key, sort oldest first), confirm each makes the check exit non-zero, and restore `lib/feedGrouper.ts`
    - _Requirements: 16.5, 16.7, 16.8_
    - **Property 3: Cards partition the entries by Group_Key**
    - **Property 4: The party has no effect on grouping**
    - **Property 5: Grouping is deterministic and does not change its input**
    - **Property 9: Newest first, then Input_Order**
    - **Property 10: Keys are unique, stable, and derived from the source**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 10.9, 11.1, 11.2, 11.3, 11.4, 11.5**

  - [ ] 2.5 Wire the `check` script in `package.json`
    - Change `check` to run `lib/approval.check.ts`, `lib/feedGrouper.check.ts` and `lib/settings.check.ts` in that order, each with `node --experimental-strip-types`, joined with `&&`, as shown in the design. Requirement 16.2 names two files; the settings check is the additive third file described in D2. Change nothing else in `package.json`
    - Run `npm run check`: all three print their pass line and the command exits 0. Then break one assertion, confirm a non-zero exit, and restore it
    - _Requirements: 16.2_

- [ ] 3. Checkpoint - Ensure all tests pass
  - Run `npm run check` and `npx tsc --noEmit`. Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Visible loader and Settings API
  - [ ] 4.1 Add `getVisible()` to `lib/promiseStore.ts`
    - Add `getVisible()` as in design section 2: `Promise.all([getShowDmk(), getTvkPromises()])`, then `applyVisibility(showDmk, tvk, dmk, parties)`, returning `{ promises, parties }`. Import `applyVisibility` and `getShowDmk` from `@/lib/settings` and cast `@/data/parties.json` to `Party[]`
    - Keep `getLivePromises` in place for now. `/promises` and `/promises/[slug]` still call it, and task 6.3 deletes it after they move (D1). Keep `getDmkPromises`; the export route uses it
    - Add one line to the file header saying `getVisible` is the only place the switch is applied. Add `ponytail:` comments: per-request rendering costs two Redis reads per view (upgrade: tag-based revalidation), and the setting is passed down in the return value instead of a request cache (upgrade: wrap `getVisible` in `cache()`)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 14.2_

  - [ ] 4.2 Create `app/api/admin/settings/route.ts`
    - Export `PATCH` only, so every other method gets 405 (design section 1). In this order: session and `isAdminEmail(session?.user?.email)` check with 403 before the body is read; `req.json().catch(() => null)` and 400 unless `typeof body?.showDmk === "boolean"`; `setShowDmk(body.showDmk)` and 200 with `{ success: true, showDmk }`; the outer `catch` logs and returns 500 with the thrown message in `error` (D9)
    - Mirror the session and Admin pattern of `app/api/admin/submissions/route.ts`. No public endpoint and no new dependency
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 14.5_

- [ ] 5. Admin switch
  - [ ] 5.1 Create `components/admin/VisibilityToggle.tsx`
    - New folder `components/admin`. Client component `VisibilityToggle({ initialShowDmk })`, as in design section 5
    - A native `button` with `role="switch"`, `aria-checked`, and `aria-labelledby` pointing at the visible label "Show DMK promises and details". Show the text "Shown" or "Hidden". Visible focus ring, `motion-reduce:transition-none`, and `disabled` while a request is pending
    - On activation, PATCH `/api/admin/settings` with `{ showDmk: !shown }`. On 200, set the state from the response's `showDmk` and put "DMK content is now shown." or "DMK content is now hidden." in an always-present `role="status"` paragraph. On an error status or a network failure, keep the previous state and put the message in an always-present `role="alert"` paragraph. Clear both when a request starts
    - After a successful save call `router.refresh()`. When the request ends, enable the button with `flushSync` and then `focus()` it (D8)
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ] 5.2 Update `app/admin/settings/page.tsx`
    - After the existing non-Admin `redirect("/")`, call `getShowDmk()` so a non-Admin causes no Redis read. Add no `dynamic` export (D10)
    - Add a first section "Public Visibility" with the `Eye` icon from `lucide-react`, holding `<Card><CardContent className="p-5"><VisibilityToggle initialShowDmk={showDmk} /></CardContent></Card>`
    - Change the header paragraph to "Admin-only view. The DMK visibility switch is saved immediately; all other values are read from environment variables at build/runtime."
    - Leave the Party Registry section reading `data/parties.json` directly, so it lists both parties in both states
    - _Requirements: 3.1, 3.2, 3.9, 15.4_

- [ ] 6. Promises list and detail pages, then retire getLivePromises
  - [ ] 6.1 Move `/promises` to `getVisible()`
    - `app/promises/page.tsx`: keep `force-dynamic`, call `const { promises, parties } = await getVisible()`, and pass both to `PromisesClient`
    - `app/promises/PromisesClient.tsx`: add a `parties: Party[]` prop to the default export `PromisesClient` and pass it on to `PromisesPageContent`; delete the module-level `allParties` and the `@/data/parties.json` import. The URL-sync effect applies `?party=` only when `parties.some(...)` matches, otherwise sets `"all"` (so `party=dmk` while hidden is ignored), and depends on `[searchParams, parties]`. `parties` replaces `allParties` in the header text, `FilterSidebar` and `EmptyState`. Keep the existing `eslint-disable` comments in that effect
    - Both files change in this task so the props match. `FilterSidebar` is unchanged because it already hides the Government block for one party
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.8, 13.5_

  - [ ] 6.2 Move `/promises/[slug]` to `getVisible()`
    - In `app/promises/[slug]/page.tsx` replace `getLivePromises()` with `const { promises } = await getVisible()` for the slug lookup and for the related promises. Keep `notFound()` and `force-dynamic`, so a DMK slug returns 404 while hidden
    - _Requirements: 5.4, 5.5, 5.7, 5.8_

  - [ ] 6.3 Delete `getLivePromises` from `lib/promiseStore.ts`
    - Only after 6.1 and 6.2 are done: search `app`, `components` and `lib` for `getLivePromises` and confirm the only match is its own definition. Then delete the function and its comment. Keep `getDmkPromises`
    - Do not edit `.kiro/specs/upstash-promises-integration`; its text still mentions the old name and stays as it is
    - Run `npx tsc --noEmit` to confirm nothing still imports the deleted function
    - _Requirements: 4.1, 4.2, 14.2_

- [ ] 7. Sectors, Governments and Archive pages
  - [ ] 7.1 Sectors: server wrapper plus `SectorsClient`
    - Move `app/sectors/page.tsx` to `app/sectors/SectorsClient.tsx` (`git mv` keeps the history). Keep `"use client"`, export a default `SectorsClient({ promises })`, delete the `@/lib/getAllPromises` import, and make the `useMemo` that builds the sector stats read `promises` and depend on `[promises]` (D7)
    - Create a new server `app/sectors/page.tsx` with `export const dynamic = "force-dynamic"` that renders `<SectorsClient promises={(await getVisible()).promises} />`
    - Totals, status counts and completion percentages come from the prop only, and a sector appears only through a visible promise
    - _Requirements: 7.1, 7.2, 7.3, 13.6, 14.2_

  - [ ] 7.2 Governments: update `app/parties/page.tsx`
    - Make the page `async` with `export const dynamic = "force-dynamic"` and call `const { promises, parties } = await getVisible()`. List `parties` only. Change `getPartyStats` to take the visible `promises` as an argument. Delete the `partiesData` and `promisesData` imports and keep the `metadata` export
    - Replace the introduction with "An independent record of election promises made by Tamil Nadu governments. Select a government to browse its manifesto promises and implementation status." for both states
    - _Requirements: 7.4, 7.5, 7.6, 14.2_

  - [ ] 7.3 Archive: update `app/archive/[slug]/page.tsx`
    - Add `export const dynamic = "force-dynamic"`. Keep the `^(p\d+)-(\d+)$` slug check first, so a malformed slug costs no Redis read. Then call `const { promises } = await getVisible()` and find the promise by id in `promises`. Keep `notFound()` for a missing promise or source. Delete the `@/lib/getAllPromises` import
    - Leave the two existing unused-variable warnings (`Printer` and `_`) alone
    - _Requirements: 7.7, 7.8, 14.2_

- [ ] 8. Home page and Impact page
  - [ ] 8.1 Home widgets and `app/page.tsx`
    - `components/home/HeroSection.tsx`, `BentoStats.tsx` and `SpotlightRow.tsx` each take `{ promises }` and drop their `@/lib/getAllPromises` import. Hero still counts `partyId === "tvk"` only. Bento's `useMemo` depends on `promises` and `total` is `promises.length`. Spotlight's link reads `promises.length` and the spotlight order stays as it is
    - `app/page.tsx`: make it `async` with `export const dynamic = "force-dynamic"`, call `getVisible()` once, and pass `promises` to the three widgets. `ManifestoTicker`, `TrustFramework` and `GovTimeline` stay unchanged
    - All four files change in this task so the props match
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 13.1, 13.2, 13.3, 13.4, 14.2_

  - [ ] 8.2 Benefit calculator and `app/impact/page.tsx`
    - `components/home/BenefitCalculator.tsx` takes `{ promises }`, drops the `@/lib/getAllPromises` import, and matches the mapped slugs against `promises`. Add `promises` to the dependency list of the `useMemo` so no new `react-hooks/exhaustive-deps` warning appears
    - `app/impact/page.tsx`: make it `async` with `export const dynamic = "force-dynamic"`, call `getVisible()`, and render `<BenefitCalculator promises={promises} />`. Keep the `metadata` export
    - Both files change in this task so the props match
    - _Requirements: 6.3, 6.4, 6.5, 14.2_

- [ ] 9. Updates feed page
  - [ ] 9.1 Rewrite `app/updates/page.tsx` around `groupFeed`
    - Make the page `async` with `export const dynamic = "force-dynamic"`. Call `const { promises } = await getVisible()`, then `groupFeed(promises)`. Delete the module-level `updatesFeed` and the `@/lib/getAllPromises` import. Keep the header block and the "No updates yet" block, shown when there are no cards
    - Add a local server component `FeedCardView({ card })` in the same file, with no client component and no new file (D4). Do not export `FeedCardView` or `COLLAPSE_ABOVE`: a Next page file may export only the page and route options. Keep today's card classes. Show the date in `en-IN` as day, short month and year with `timeZone: "UTC"` (D5), the `TierBadge` for the card tier, the title as an `h2`, and the summary only when it is not empty
    - Show a "Read Source" link (`target="_blank"`, `rel="noopener noreferrer"`) only when `card.url` is set. Label the list "Related Promise" for one entry and "Related Promises (N)" for more
    - Each related entry shows a dot in the sector color (`aria-hidden`), the promise title as a link to `/promises/<slug>`, and its `sourceTitle` and `note` below when present. With more than `COLLAPSE_ABOVE = 5` entries, put the list in a native `<details>` that is closed by default with the `<summary>` text "Show all N related promises". With 5 or fewer, show the plain list. No client JavaScript
    - Use `card.key` as the key of each card and the promise `id` as the key of each related entry
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10, 14.2_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Run `npm run check` and `npx tsc --noEmit`. Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Final verification
  - [ ] 11.1 Run `npm run check`
    - Reads `package.json` and the three check files. Expect the approval, grouping and settings checks to print their pass lines and the command to exit 0. Node prints experimental-feature warnings; they are expected
    - _Requirements: 16.2, 16.3_

  - [ ] 11.2 Type-check, lint and scope checks
    - `npx tsc --noEmit` exits 0, as it did before this feature
    - `npm run lint`: before this feature it already reported 13 problems (6 errors, 7 warnings) and exited 1. Errors: `app/admin/submissions/page.tsx` (`react-hooks/set-state-in-effect`, `no-explicit-any`), `app/api/admin/submissions/route.ts` (two `no-explicit-any`), `app/api/submit/route.ts` (`no-explicit-any`), `app/submit/page.tsx` (`no-explicit-any`). Warnings: `app/admin/submissions/page.tsx` (two `no-img-element`), `app/api/submit/route.ts` (unused `_`), `app/archive/[slug]/page.tsx` (unused `Printer`, unused `_`), `components/home/BenefitCalculator.tsx` (unused `Calculator`, `exhaustive-deps` on `displayValue`). Pass means no problem beyond these 13, compared by file and rule because line numbers move in the two edited files, and none in any file this feature creates. Do not fix the existing ones
    - Use the search tool, not shell `grep`, to confirm: `getLivePromises` has no match under `app`, `components` and `lib`; `@/lib/getAllPromises` is imported only by `lib/promiseStore.ts` and `app/admin/submissions/page.tsx` and by nothing under `components/home`; `@/data/parties.json` is imported only by `lib/promiseStore.ts` and `app/admin/settings/page.tsx`; `app/api/admin/promises/export/route.ts` does not mention `settings`, `getShowDmk` or `getVisible`
    - `git status --short` and `git diff --stat` show only files from the design's file map, `package.json` and this spec folder. None of `lib/getAllPromises.ts`, `lib/kv.ts`, `lib/approval.ts`, `types/index.ts`, `app/api/admin/promises/export/route.ts`, `app/admin/submissions/page.tsx`, `components/promises/FilterSidebar.tsx`, `components/layout/Navbar.tsx`, the other three `components/home` files, or anything under `.kiro/specs/upstash-promises-integration` is modified. The only `package.json` change is the `check` line, with no dependency added
    - _Requirements: 6.4, 14.1, 14.3, 14.4, 15.1, 15.2, 15.3_

  - [ ] 11.3 Production build and route table
    - Run `npm run build` and see it pass. It type-checks too, and takes a while, so allow a long timeout
    - In the route table, `ƒ` appears for `/`, `/updates`, `/sectors`, `/parties`, `/impact`, `/archive/[slug]`, `/promises`, `/promises/[slug]` and `/admin/settings`, and `○` for `/about`, `/submit` and `/admin/submissions`
    - `.next/prerender-manifest.json` no longer lists `/`, `/updates`, `/sectors`, `/parties` or `/impact`
    - _Requirements: 5.8, 6.1, 6.3, 7.1, 7.4, 7.7, 8.2, 14.2_

  - [ ] 11.4 Manual browser verification (MANUAL, run by the user)
    - No browser or screen-reader test has been done on this feature yet (design, "Verification Done During Design"). A coding agent cannot run this task: it hands the list to the user and leaves the task for the user to confirm
    - Setup: in your own terminal run `npm run dev` (or `npm run build` then `npm run start`), sign in as an Admin and open `/admin/settings`. After each save, reload the pages below in full. The figures assume the repository data (56 TVK and 142 DMK promises) and a Redis list with no newly approved evidence
    - Switch: with the keyboard only (Tab, then Space or Enter), turn DMK off and on. The text changes between "Shown" and "Hidden", the status line reads "DMK content is now shown." or "DMK content is now hidden.", the switch is disabled while saving, and focus stays on it. Repeat once with a screen reader and listen for the name, the on or off state and the status text. In both states the Party Registry below the switch lists both parties
    - DMK hidden: `/updates` has 8 cards and none from DMK. `/promises` shows 56 in the header text and the result count, has no Government filter, and `/promises?party=dmk` lists all 56. A DMK promise page, for example `/promises/<a DMK slug>`, returns 404. `/sectors` totals add up to 56. `/parties` lists only TVK under the new introduction text. Home shows 56 in "Total Tracked", "Tracking 56 core promises" and "See all 56 promises". `/impact` still works. The Admin export (`/api/admin/promises/export`) still downloads 198 promises
    - DMK shown: `/updates` has 13 cards, the long groups sit under a closed "Show all N related promises", and the 5-promise card stays open. `/promises` shows 198, the Government filter appears, and `/promises?party=dmk` filters to DMK. The DMK promise page renders. `/sectors` totals add up to 198. `/parties` lists both governments. Home shows 56 in "Total Tracked" and 198 in the Bento and Spotlight text. `/impact` is unchanged. The export still downloads 198 promises
    - Optional extras from the design: a PATCH to `/api/admin/settings` with no session cookie returns 403 and a GET returns 405; with the Upstash variables unset every page still renders from the seed with DMK hidden; approving a submission puts its new Source on `/updates` on the next load
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 5.2, 5.3, 5.4, 5.6, 5.7, 6.5, 7.2, 7.3, 7.4, 7.6, 8.4, 8.5, 12.8, 12.9, 13.3, 13.4, 13.5, 13.6, 15.1, 15.2, 15.4_

## Notes

- No task is optional. The grouping check (Requirement 16) and the settings check (D2) are required, so no sub-task carries the `*` marker.
- The repository has no test framework and the requirements add none, so there are no automated page or route tests. Redis, session and browser behaviour is covered by task 11.4. That task is manual by request and is the one exception to the usual "coding tasks only" rule. It is the only task a coding agent cannot complete.
- `getLivePromises` is kept through task 6.2 and deleted in task 6.3, after a search shows no caller is left. Until then both loaders exist, so the build stays green.
- When a task changes a component's props, it changes the parent that passes them in the same task (6.1, 7.1, 8.1, 8.2).
- Tasks in the same wave touch different files. If `npx tsc --noEmit` reports an error in a file that belongs to another task of the same wave, wait for that task to finish before acting on it.
- The text of the `upstash-promises-integration` spec is not edited. Requirement 14 of this spec records the amendment to its Requirement 7. Reviewing upstream changes was report-only, so no task adopts them.
- Out of scope, as in the requirements: URL-scheme validation of citizen evidence, changes to the DMK data, and new dependencies.
- Lint was already red before this feature (task 11.2 lists the 13 problems). This feature must add none and does not fix them.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "2.2"] },
    { "id": 2, "tasks": ["2.3"] },
    { "id": 3, "tasks": ["2.4"] },
    { "id": 4, "tasks": ["2.5"] },
    { "id": 5, "tasks": ["4.1", "4.2"] },
    { "id": 6, "tasks": ["5.1"] },
    { "id": 7, "tasks": ["5.2", "6.1"] },
    { "id": 8, "tasks": ["6.2", "7.2", "7.3"] },
    { "id": 9, "tasks": ["6.3", "7.1"] },
    { "id": 10, "tasks": ["8.1", "8.2"] },
    { "id": 11, "tasks": ["9.1"] },
    { "id": 12, "tasks": ["11.1", "11.2"] },
    { "id": 13, "tasks": ["11.3"] },
    { "id": 14, "tasks": ["11.4"] }
  ]
}
```
