# Requirements Document

## Introduction

This feature moves the TVK promises dataset into Upstash Redis so that an admin approving a citizen submission immediately marks the linked promise as fulfilled on the promises list page. Redis becomes the live source of truth for TVK promises. The file `data/promises.json` remains the seed and the fallback. DMK promises stay in the static JSON and are never stored in Redis. Only the `/promises` list page and the `/promises/[slug]` detail page read from Redis. All other pages continue to read static JSON through `lib/getAllPromises`. An admin-only export returns the latest Redis data in the `data/promises.json` format so a maintainer can update the JSON file manually. The application never commits to GitHub.

## Glossary

- **Promise_Store**: The server-side module that reads and writes the TVK promises list in Upstash Redis under the key `promises`.
- **KV_Client**: The shared server-side module (`lib/kv.ts`) that performs Redis reads and writes using `KV_REST_API_URL` and `KV_REST_API_TOKEN`, with no caching.
- **Upstash_Redis**: The Upstash Redis database reached through `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
- **Seed_File**: The file `data/promises.json`, containing only TVK promises. DMK promises are held separately in `data/dmk-promises.json` and reach the application through Static_Loader.
- **TVK_Promise**: A promise whose `partyId` is `tvk`.
- **DMK_Promise**: A promise whose `partyId` is `dmk`.
- **Promise**: A record with the shape defined in `types/index.ts`, including `id`, `slug`, `status`, `sources`, `lastUpdated`, and `partyId`.
- **Submission**: A citizen evidence record with `id`, `promiseId`, `evidenceUrl`, `details`, `status`, `submittedBy`, `createdAt`, `lastUpdatedBy`, and `lastUpdatedAt`, stored in Upstash_Redis under the key `submissions`.
- **Submission_Status**: One of `pending`, `approved`, or `rejected`.
- **Promise_Reference**: The free-text `promiseId` value on a Submission, which can equal a Promise `id` or a Promise `slug`.
- **Approval_Function**: The pure function that takes a list of promises, a Submission, and a timestamp, and returns the updated list of promises.
- **Submit_API**: The route `app/api/submit/route.ts`.
- **Admin_API**: The route `app/api/admin/submissions/route.ts`.
- **Export_API**: The admin-only route that returns the current TVK promises from Upstash_Redis in Seed_File format.
- **Admin**: An authenticated user whose email is accepted by `isAdminEmail()` in `lib/config.ts`.
- **Promises_Page**: The page at `/promises`, rendered by a server wrapper that passes promises to the client component as props.
- **Promise_Detail_Page**: The page at `/promises/[slug]`.
- **Static_Loader**: The existing `lib/getAllPromises` module that imports the static JSON files (Seed_File and the DMK data file).

## Requirements

### Requirement 1: Store TVK promises in Redis

**User Story:** As a maintainer, I want TVK promises stored in Upstash Redis, so that promise status can change at runtime without a redeploy.

#### Acceptance Criteria

1. THE Promise_Store SHALL store only TVK_Promise records in Upstash_Redis under the key `promises`.
2. THE Promise_Store SHALL exclude every DMK_Promise from writes to Upstash_Redis.
3. WHEN the Promise_Store reads the key `promises` and the key is absent or holds an empty list, THE Promise_Store SHALL write the TVK_Promise records from Seed_File to the key `promises` and return those records.
4. IF Upstash_Redis is not configured or a Redis read fails, THEN THE Promise_Store SHALL return the TVK_Promise records from Seed_File and log the error.
5. THE KV_Client SHALL perform every Redis read with caching disabled.

### Requirement 2: Shared Redis client

**User Story:** As a maintainer, I want one shared Redis helper, so that the submit and admin routes and the Promise_Store do not duplicate Redis code.

#### Acceptance Criteria

1. THE KV_Client SHALL provide a read function and a write function that take a Redis key.
2. THE Submit_API SHALL use the KV_Client for reading and writing the key `submissions`.
3. THE Admin_API SHALL use the KV_Client for reading and writing the key `submissions`.
4. THE Promise_Store SHALL use the KV_Client for reading and writing the key `promises`.
5. IF `KV_REST_API_URL` or `KV_REST_API_TOKEN` is missing, THEN THE KV_Client SHALL throw an error that names the missing variable.

### Requirement 3: Approval marks promise fulfilled

**User Story:** As an admin, I want approving a submission to mark the linked promise as fulfilled, so that visitors see verified progress.

#### Acceptance Criteria

1. WHEN an Admin sets a Submission to `approved` and the Promise_Reference matches a TVK_Promise by `id` or `slug`, THE Admin_API SHALL set the `status` of that TVK_Promise to `fulfilled` in Upstash_Redis.
2. WHEN an Admin sets a Submission to `approved` and the Promise_Reference matches a TVK_Promise, THE Admin_API SHALL append the Submission `evidenceUrl` to the `sources` of that TVK_Promise.
3. WHEN an Admin sets a Submission to `approved` and the Promise_Reference matches a TVK_Promise, THE Admin_API SHALL set the `lastUpdated` of that TVK_Promise to the approval date.
4. IF the `evidenceUrl` of the approved Submission already appears in the `sources` of the matched TVK_Promise, THEN THE Approval_Function SHALL leave the `sources` unchanged.
5. IF the Promise_Reference of the approved Submission is empty or matches no TVK_Promise, THEN THE Admin_API SHALL save the Submission status as `approved` and leave every TVK_Promise unchanged.
6. WHEN an Admin sets a Submission to `pending` or `rejected`, THE Admin_API SHALL leave every TVK_Promise unchanged.
7. IF the Redis write of the updated promises fails, THEN THE Admin_API SHALL return an HTTP 500 response and leave the Submission status unchanged.
8. THE Approval_Function SHALL return a new list of promises without modifying the input list.

### Requirement 4: Submit leaves promises unchanged

**User Story:** As a citizen, I want my submission to be recorded without changing any promise, so that only admin review affects promise status.

#### Acceptance Criteria

1. WHEN a citizen submits evidence, THE Submit_API SHALL save the Submission with status `pending`.
2. WHEN a citizen submits evidence, THE Submit_API SHALL leave the `status` of every TVK_Promise unchanged.
3. WHEN a citizen submits evidence, THE Submit_API SHALL continue to save the Submission under the key `submissions` with the existing field set.

### Requirement 5: Promises list reads live data

**User Story:** As a visitor, I want the promises list to show the latest status, so that an approved promise appears as fulfilled right away.

#### Acceptance Criteria

1. WHEN a visitor requests `/promises`, THE Promises_Page SHALL read TVK_Promise records from the Promise_Store on that request.
2. WHEN a visitor requests `/promises`, THE Promises_Page SHALL combine the TVK_Promise records from the Promise_Store with the DMK_Promise records from the Static_Loader and pass the result to the client component as props.
3. WHEN an Admin approves a Submission that matches a TVK_Promise, THE Promises_Page SHALL show that TVK_Promise as fulfilled on the next request without a redeploy.
4. THE Promises_Page SHALL render with dynamic rendering so that no cached response is served.
5. IF the Promise_Store returns Seed_File records because of a Redis failure, THEN THE Promises_Page SHALL render the Seed_File records instead of an error page.

### Requirement 6: Promise detail reads live data

**User Story:** As a visitor, I want the promise detail page to show the latest data, so that the status and sources match the list page.

#### Acceptance Criteria

1. WHEN a visitor requests `/promises/[slug]` for a TVK_Promise, THE Promise_Detail_Page SHALL read that promise from the Promise_Store on that request.
2. WHEN a visitor requests `/promises/[slug]` for a DMK_Promise, THE Promise_Detail_Page SHALL read that promise from the Static_Loader.
3. IF no promise matches the requested slug, THEN THE Promise_Detail_Page SHALL return the Next.js not-found response.
4. THE Promise_Detail_Page SHALL render with dynamic rendering so that no cached response is served.

### Requirement 7: Other pages stay static

**User Story:** As a maintainer, I want other pages to keep using static JSON, so that this change stays limited to the promises pages.

#### Acceptance Criteria

1. THE Static_Loader SHALL continue to read from the static JSON files, including Seed_File.
2. THE application SHALL keep every page other than Promises_Page and Promise_Detail_Page reading promises through the Static_Loader.

### Requirement 8: Admin export of Redis promises

**User Story:** As a maintainer, I want to export the latest Redis promises, so that I can update `data/promises.json` manually.

#### Acceptance Criteria

1. WHEN an Admin requests the Export_API, THE Export_API SHALL return the TVK_Promise records currently stored in Upstash_Redis as JSON.
2. WHEN an Admin requests the Export_API, THE Export_API SHALL merge the TVK_Promise records with the DMK_Promise records from the Static_Loader and return the merged list in Seed_File format.
3. IF the requester is not authenticated or is not an Admin, THEN THE Export_API SHALL return an HTTP 403 response.
4. THE application SHALL NOT commit, push, or write to the repository or the Seed_File at runtime.

### Requirement 9: Runnable approval check

**User Story:** As a maintainer, I want a runnable check for the approval logic, so that regressions in status updates are caught.

#### Acceptance Criteria

1. THE repository SHALL contain one assert-based check file that runs the Approval_Function without a test framework.
2. THE check file SHALL verify a match by `id`, a match by `slug`, a miss that leaves promises unchanged, a duplicate `evidenceUrl` that leaves `sources` unchanged, and an input list that remains unmodified.
