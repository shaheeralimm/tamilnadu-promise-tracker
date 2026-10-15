# Requirements Document

## Introduction

This feature makes two changes that the site owner asked for, and moves the affected pages to live data so that both changes work at runtime.

First, the `/updates` feed stops repeating itself. Cards that cite the same link on the same date become one card that lists every related promise, and the per-promise notes stay visible. The feed currently holds 252 cards (188 DMK and 64 TVK). Grouping by link and date reduces them to 13 cards (TVK 64 to 8, DMK 188 to 5). The largest groups are the TVK manifesto (47 entries with 47 different titles) and the DMK English manifesto (129 entries).

Second, DMK content is hidden by default, and an Admin can show or hide it for the whole public site with a switch on `/admin/settings`. The switch is one boolean saved in Upstash Redis. While DMK is hidden, DMK content disappears from the updates feed, the promises list and its party filter, the DMK promise detail and archive pages, the sectors page, the home page statistics, the benefit calculator, and the governments page. The Admin export and the Admin submissions review stay unfiltered.

The `/updates` page currently builds its feed once from static JSON, so it never shows Redis data, and approved citizen evidence never reaches it. A runtime switch also needs per-request rendering. The pages that the switch touches therefore read promises through one shared loader that combines the setting with the live TVK promises. This amends Requirement 7 ("Other pages stay static") of the `upstash-promises-integration` spec, page by page, in Requirement 14 below. DMK promises remain in static JSON and are never written to Redis.

The home page also gets a consistency fix. Today the hero card counts 56 TVK promises, while the statistics and the "See all" link count 198 promises with DMK mixed in. After this change every count on the home page is derived from the same list of visible promises, and all counts agree while DMK is hidden.

The figures above were measured on the repository data at the time of writing. Reviewing upstream changes was report-only and produces no requirement here.

## Glossary

- **Upstash_Redis**: The Upstash Redis database reached through `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
- **KV_Client**: The shared server-side module `lib/kv.ts` that reads and writes Redis keys with caching disabled.
- **Promise**: A record with the shape defined in `types/index.ts`, including `id`, `slug`, `partyId`, `title`, `sector`, `status`, and `sources`.
- **Source**: An element of the `sources` array of a Promise, with the fields `title`, `url`, `publication`, `date`, `tier`, and `summary`.
- **TVK_Promise**: A Promise whose `partyId` is `tvk`.
- **DMK_Promise**: A Promise whose `partyId` is `dmk`. The `partyId` is the only field that identifies a DMK_Promise. A slug that ends in a number does not.
- **Seed_File**: The file `data/promises.json`, containing only TVK_Promises.
- **Static_Loader**: The existing `lib/getAllPromises` module that imports the static JSON files, including the Seed_File and `data/dmk-promises.json`.
- **Promise_Store**: The existing `lib/promiseStore.ts` module that reads and writes the TVK_Promises in Upstash_Redis under the key `promises` and returns Seed_File records when a Redis read fails.
- **Admin**: An authenticated user whose email is accepted by `isAdminEmail()` in `lib/config.ts`.
- **Submission**: A citizen evidence record stored in Upstash_Redis under the key `submissions`.
- **Citizen_Evidence_Source**: The Source with the title "Citizen-submitted evidence" and tier 3 that the existing approval logic appends to a TVK_Promise when an Admin approves a Submission.
- **Export_API**: The admin-only route `app/api/admin/promises/export/route.ts`.
- **Admin_Submissions_Page**: The admin review page at `/admin/submissions`.
- **DMK_Visibility_Setting**: The boolean that decides whether DMK content is shown on the public site. It is stored in Upstash_Redis under the key `settings` as `{ "showDmk": boolean }`.
- **DMK_Shown**: The state in which the Settings_Store reports the DMK_Visibility_Setting as true.
- **DMK_Hidden**: The state in which the Settings_Store reports the DMK_Visibility_Setting as false. This is the default state.
- **Settings_Store**: The server-side module that reads and writes the DMK_Visibility_Setting through the KV_Client.
- **Settings_API**: The new admin-only route `app/api/admin/settings/route.ts`.
- **Settings_Page**: The page at `/admin/settings`, a server component that is limited to Admins.
- **Visibility_Toggle**: The new client component on the Settings_Page that shows and changes the DMK_Visibility_Setting.
- **Visible_Promises**: The list of TVK_Promises from the Promise_Store, followed, while DMK_Shown, by the DMK_Promises from the Static_Loader. While DMK_Hidden, the list contains no DMK_Promise.
- **Visible_Parties**: The parties in `data/parties.json`, without the party whose `id` is `dmk` while DMK_Hidden.
- **Visible_Promises_Loader**: The single server-side function that applies the DMK_Visibility_Setting and returns the Visible_Promises. No page or component repeats this filtering.
- **Updates_Page**: The page at `/updates`.
- **Promises_Page**: The page at `/promises`, a server wrapper that passes promises to a client component as props.
- **Promise_Detail_Page**: The page at `/promises/[slug]`.
- **Sectors_Page**: The page at `/sectors`.
- **Parties_Page**: The page at `/parties`, titled "Governments Tracked".
- **Archive_Page**: The page at `/archive/[slug]`.
- **Home_Page**: The page at `/`.
- **Impact_Page**: The page at `/impact`.
- **Hero_Section**: The client component `components/home/HeroSection.tsx` on the Home_Page.
- **Bento_Stats**: The client component `components/home/BentoStats.tsx` on the Home_Page.
- **Spotlight_Row**: The client component `components/home/SpotlightRow.tsx` on the Home_Page.
- **Benefit_Calculator**: The client component `components/home/BenefitCalculator.tsx` on the Impact_Page.
- **Promise_Widgets**: The group made of the Hero_Section, the Bento_Stats, the Spotlight_Row, and the Benefit_Calculator.
- **Feed_Entry**: One Source of one Promise, together with the `id`, `slug`, `title`, and `sector` of that Promise.
- **Source_Title**: The `title` of a Source. The Source_Title is distinct from the title of the Promise.
- **Note**: The `summary` text of a Source.
- **Input_Order**: The order of the Promises in the list given to the Feed_Grouper and, within each Promise, the order of the `sources` array.
- **Unlinkable_URL**: A Source `url` that is absent, empty, made only of whitespace, or equal to `#`.
- **Group_Key**: The Source `url`, the character `|`, and the Source `date`, compared as exact text.
- **Feed_Card**: One card on the Updates_Page, built from one or more Feed_Entries.
- **Related_Entry**: One Promise listed in a Feed_Card. A Related_Entry carries the Promise `slug`, `title`, and sector color. A Related_Entry also carries the Source_Title or the Note of that Promise when the value differs from the title or the summary of the Feed_Card.
- **Feed_Grouper**: The pure function that turns a list of Promises into an ordered list of Feed_Cards. The Feed_Grouper performs no I/O.
- **Check_Script**: The `check` script in `package.json`, run as `npm run check`.
- **Grouping_Check**: The new assert-based check file for the Feed_Grouper, run by the Check_Script without a test framework.

## Requirements

### Requirement 1: DMK visibility setting

**User Story:** As an Admin, I want one saved setting that says whether DMK content is shown, so that my choice applies to every visitor and survives restarts.

#### Acceptance Criteria

1. THE Settings_Store SHALL save the DMK_Visibility_Setting in Upstash_Redis under the key `settings` as a JSON object with one boolean property `showDmk`.
2. WHEN the Settings_Store reads the key `settings` and the property `showDmk` is the boolean `true`, THE Settings_Store SHALL report DMK_Shown.
3. WHEN the Settings_Store reads the key `settings` and the key is absent or the property `showDmk` holds any value other than the boolean `true`, THE Settings_Store SHALL report DMK_Hidden.
4. IF Upstash_Redis is not configured or a Redis read of the key `settings` fails, THEN THE Settings_Store SHALL log the error and report DMK_Hidden.
5. THE Settings_Store SHALL use the KV_Client for every read and write of the key `settings`.
6. THE Settings_Store SHALL read the key `settings` from Upstash_Redis on every call of the read function of the Settings_Store, so that a saved change is visible on the next request.

### Requirement 2: Admin-only route that saves the setting

**User Story:** As an Admin, I want a protected route that saves the setting, so that only Admins can change what visitors see.

#### Acceptance Criteria

1. WHEN an Admin sends a PATCH request to the Settings_API with a JSON body whose property `showDmk` is a boolean, THE Settings_API SHALL save the received boolean as the DMK_Visibility_Setting and respond with HTTP 200 and a JSON body that contains `success` set to `true` and the saved value of `showDmk`.
2. IF the requester is not authenticated or is not an Admin, THEN THE Settings_API SHALL respond with HTTP 403 and leave the DMK_Visibility_Setting unchanged.
3. THE Settings_API SHALL check the session and the Admin status before reading the request body.
4. IF the request body is not valid JSON, or the property `showDmk` is missing or is not a boolean, THEN THE Settings_API SHALL respond with HTTP 400 and leave the DMK_Visibility_Setting unchanged.
5. IF Upstash_Redis is not configured or the Redis write fails, THEN THE Settings_API SHALL respond with HTTP 500 and a JSON body that contains an error message.
6. THE Settings_API SHALL implement the PATCH method only.

### Requirement 3: Admin switch on the Site Settings page

**User Story:** As an Admin, I want a switch on the Site Settings page, so that I can show or hide DMK content without a redeploy.

#### Acceptance Criteria

1. IF the viewer of the Settings_Page is not an Admin, THEN THE Settings_Page SHALL redirect the viewer to `/` and render no Visibility_Toggle.
2. WHEN an Admin loads the Settings_Page, THE Settings_Page SHALL give the Visibility_Toggle, as initial state, the state that the Settings_Store reports on that request.
3. THE Visibility_Toggle SHALL show the label "Show DMK promises and details" and the current state as the text "Shown" or "Hidden".
4. THE Visibility_Toggle SHALL expose an accessible name and the on or off state to assistive technology, and SHALL be operable with the keyboard alone.
5. WHEN an Admin activates the Visibility_Toggle, THE Visibility_Toggle SHALL send a PATCH request to the Settings_API with `showDmk` set to the opposite of the current state.
6. WHILE a request to the Settings_API is in progress, THE Visibility_Toggle SHALL stay disabled.
7. WHEN the Settings_API responds with HTTP 200, THE Visibility_Toggle SHALL show the saved state and announce "DMK content is now shown." or "DMK content is now hidden." in a status region (`role="status"`).
8. IF the Settings_API responds with an error status or the request fails, THEN THE Visibility_Toggle SHALL keep the previous state and show an error message in an alert region (`role="alert"`).
9. THE Settings_Page SHALL show the header description "Admin-only view. The DMK visibility switch is saved immediately; all other values are read from environment variables at build/runtime."

### Requirement 4: One place applies the setting

**User Story:** As a maintainer, I want one shared loader to apply the setting, so that no page can forget to hide DMK content.

#### Acceptance Criteria

1. THE Visible_Promises_Loader SHALL return the TVK_Promises from the Promise_Store, followed, while DMK_Shown, by the DMK_Promises from the Static_Loader.
2. WHILE DMK_Hidden, THE Visible_Promises_Loader SHALL return no Promise whose `partyId` is `dmk`.
3. THE Visible_Promises_Loader SHALL identify a DMK_Promise by the `partyId` value of the Promise.
4. THE Visible_Promises_Loader SHALL start the read of the DMK_Visibility_Setting and the read of the TVK_Promises at the same time.
5. THE application SHALL derive the Visible_Promises and the Visible_Parties of one request from one read of the DMK_Visibility_Setting.
6. WHEN an Admin approves a Submission that changes a TVK_Promise, THE Visible_Promises_Loader SHALL return the changed TVK_Promise on the next request.

### Requirement 5: Promises list and promise detail pages

**User Story:** As a visitor, I want the promises list and the promise pages to follow the DMK setting, so that I do not see DMK content while it is hidden.

#### Acceptance Criteria

1. WHEN a visitor requests `/promises`, THE Promises_Page SHALL pass the Visible_Promises and the Visible_Parties to the client component as props.
2. WHILE DMK_Hidden, THE Promises_Page SHALL render no filter control for the DMK party.
3. WHILE DMK_Hidden, WHEN a request for `/promises` carries the query parameter `party=dmk`, THE Promises_Page SHALL apply no party filter and list every Visible_Promise that matches the other filters.
4. WHILE DMK_Hidden, WHEN a visitor requests `/promises/[slug]` and the slug belongs to a DMK_Promise, THE Promise_Detail_Page SHALL return the Next.js not-found response.
5. THE Promise_Detail_Page SHALL choose the related promises from the Visible_Promises only.
6. WHILE DMK_Shown, THE Promises_Page SHALL list the DMK_Promises and render the filter control for the DMK party.
7. WHILE DMK_Shown, THE Promise_Detail_Page SHALL render the page of a DMK_Promise.
8. THE Promises_Page and THE Promise_Detail_Page SHALL render per request so that no cached response is served.

### Requirement 6: Home page and Impact page

**User Story:** As a visitor, I want the home page statistics and the benefit calculator to follow the DMK setting, so that the numbers describe only the promises I can see.

#### Acceptance Criteria

1. THE Home_Page SHALL render per request and obtain the Visible_Promises once for that request.
2. THE Home_Page SHALL pass the Visible_Promises to the Hero_Section, the Bento_Stats, and the Spotlight_Row as props.
3. THE Impact_Page SHALL render per request and pass the Visible_Promises to the Benefit_Calculator as props.
4. THE Promise_Widgets SHALL read promise data from props only.
5. WHILE DMK_Hidden, THE Promise_Widgets SHALL show no DMK_Promise.

### Requirement 7: Sectors, Governments, and Archive pages

**User Story:** As a visitor, I want the sector, government, and archive pages to follow the DMK setting, so that no page shows DMK content while it is hidden.

#### Acceptance Criteria

1. THE Sectors_Page SHALL render per request, obtain the Visible_Promises in a server component, and pass the Visible_Promises to the existing client component as props.
2. THE Sectors_Page SHALL compute the sector totals, status counts, and completion percentages from the Visible_Promises only.
3. THE Sectors_Page SHALL list a sector only when the sector has at least one Visible_Promise.
4. THE Parties_Page SHALL render per request and list the Visible_Parties only.
5. THE Parties_Page SHALL compute the promise counts and status counts of each listed party from the Visible_Promises only.
6. THE Parties_Page SHALL show the introduction text "An independent record of election promises made by Tamil Nadu governments. Select a government to browse its manifesto promises and implementation status." in both DMK_Shown and DMK_Hidden.
7. THE Archive_Page SHALL render per request and resolve the requested Promise from the Visible_Promises.
8. WHILE DMK_Hidden, WHEN a visitor requests an archive URL that belongs to a DMK_Promise, THE Archive_Page SHALL return the Next.js not-found response.

### Requirement 8: Live updates feed

**User Story:** As a visitor, I want the Updates feed to show current data, so that approved evidence and the DMK setting take effect without a redeploy.

#### Acceptance Criteria

1. WHEN a visitor requests `/updates`, THE Updates_Page SHALL obtain the Visible_Promises on that request and build the feed from the Sources of the Visible_Promises.
2. THE Updates_Page SHALL render per request so that no cached response is served.
3. WHEN an Admin approves a Submission that adds a Citizen_Evidence_Source to a TVK_Promise, THE Updates_Page SHALL include that Source in the feed on the next request without a redeploy.
4. WHILE DMK_Hidden, THE Updates_Page SHALL show no Feed_Card that contains a DMK_Promise.
5. WHILE DMK_Shown, THE Updates_Page SHALL show Feed_Cards for the Sources of TVK_Promises and of DMK_Promises.
6. IF the Promise_Store returns Seed_File records because of a Redis failure, THEN THE Updates_Page SHALL build the feed from the Seed_File records instead of rendering an error page.
7. IF the feed contains no Feed_Card, THEN THE Updates_Page SHALL show the "No updates yet" message.

### Requirement 9: Group repeated entries

**User Story:** As a visitor, I want entries that cite the same link on the same date merged into one card, so that I do not meet the same news item many times.

#### Acceptance Criteria

1. THE Feed_Grouper SHALL create one Feed_Entry for every Source of every Promise in the list given to the Feed_Grouper.
2. THE Feed_Grouper SHALL place every Feed_Entry that has the same Group_Key into one Feed_Card, regardless of the Source_Titles, Notes, tiers, and Promises of the Feed_Entries.
3. THE Feed_Grouper SHALL place Feed_Entries that have different Group_Keys into different Feed_Cards, including entries that have the same URL and different dates.
4. THE Feed_Grouper SHALL build the Group_Key from the URL and the date only, so that the party of a Promise has no effect on grouping.
5. IF the URL of a Feed_Entry is an Unlinkable_URL, THEN THE Feed_Grouper SHALL place that Feed_Entry alone in a Feed_Card, even when another Feed_Entry has the same URL and date.
6. IF one Promise contributes more than one Feed_Entry with the same Group_Key, THEN THE Feed_Grouper SHALL keep the first of these Feed_Entries in Input_Order and discard the remaining Feed_Entries of that Promise before choosing the tier, title, and summary of the Feed_Card.
7. THE Feed_Grouper SHALL produce the same Feed_Cards for the same input list, using no data other than that list.
8. THE Feed_Grouper SHALL leave the input list and the objects inside the input list unchanged.

### Requirement 10: Content of a merged card

**User Story:** As a visitor, I want each merged card to show one clear title, the most credible tier, and the notes that differ between promises, so that I read one card instead of many.

#### Acceptance Criteria

1. THE Feed_Grouper SHALL set the tier of a Feed_Card to the lowest tier number among the Feed_Entries of the Feed_Card.
2. WHEN a Feed_Card has exactly one Feed_Entry, THE Feed_Grouper SHALL set the title of the Feed_Card to the Source_Title of that Feed_Entry and the summary of the Feed_Card to the Note of that Feed_Entry.
3. WHEN a Feed_Card has two or more Feed_Entries and at least one Source_Title occurs in two or more of the Feed_Entries, THE Feed_Grouper SHALL set the title of the Feed_Card to the Source_Title that occurs in the most Feed_Entries.
4. WHEN a Feed_Card has two or more Feed_Entries and no Source_Title occurs in two or more of the Feed_Entries, THE Feed_Grouper SHALL set the title of the Feed_Card to the `publication` of the first Feed_Entry in Input_Order, or to the Source_Title of the first Feed_Entry when that `publication` is empty.
5. WHEN a Feed_Card has two or more Feed_Entries and at least one Note occurs in two or more of the Feed_Entries, THE Feed_Grouper SHALL set the summary of the Feed_Card to the Note that occurs in the most Feed_Entries.
6. WHEN a Feed_Card has two or more Feed_Entries and no Note occurs in two or more of the Feed_Entries, THE Feed_Grouper SHALL leave the summary of the Feed_Card empty.
7. WHEN several Source_Titles tie for the highest number of Feed_Entries, THE Feed_Grouper SHALL choose the Source_Title whose first occurrence is earliest in Input_Order.
8. WHEN several Notes tie for the highest number of Feed_Entries, THE Feed_Grouper SHALL choose the Note whose first occurrence is earliest in Input_Order.
9. THE Feed_Grouper SHALL list the Related_Entries of a Feed_Card in Input_Order, with one Related_Entry per Promise.
10. THE Feed_Grouper SHALL give a Related_Entry a Source_Title only when that Source_Title differs from the title of the Feed_Card.
11. THE Feed_Grouper SHALL give a Related_Entry a Note only when that Note is not empty and differs from the summary of the Feed_Card.

### Requirement 11: Order and keys of cards

**User Story:** As a visitor, I want the newest cards first in a steady order, so that the feed does not reshuffle between visits.

#### Acceptance Criteria

1. THE Feed_Grouper SHALL order the Feed_Cards by date, newest first.
2. WHEN two Feed_Cards have the same date, THE Feed_Grouper SHALL order the two Feed_Cards by the Input_Order position of the first Feed_Entry of each Feed_Card.
3. THE Feed_Grouper SHALL give each Feed_Card a key that is unique within the feed and does not depend on the position of the Feed_Card in the feed.
4. THE Feed_Grouper SHALL set the key of a Feed_Card that has a linkable URL to the Group_Key of that Feed_Card.
5. THE Feed_Grouper SHALL derive the key of a Feed_Card that has an Unlinkable_URL from the Promise `id` and the position of the Source in the `sources` array of that Promise.

### Requirement 12: Card presentation on the Updates page

**User Story:** As a visitor, I want long lists of related promises collapsed, so that a merged card stays short enough to read.

#### Acceptance Criteria

1. THE Updates_Page SHALL show, for each Feed_Card, the date (day, abbreviated month, and year in the `en-IN` locale), the tier badge for the tier of the Feed_Card, the title of the Feed_Card as a heading, and the summary of the Feed_Card when the summary is not empty.
2. THE Updates_Page SHALL show, for each Feed_Card that has a linkable URL, a "Read Source" link that opens the URL in a new tab with `rel="noopener noreferrer"`.
3. IF the URL of a Feed_Card is an Unlinkable_URL, THEN THE Updates_Page SHALL show the Feed_Card without a "Read Source" link.
4. THE Updates_Page SHALL show each Related_Entry with the Promise title as a link to `/promises/<slug>` and a dot in the sector color of the Promise.
5. WHEN a Related_Entry carries a Source_Title or a Note, THE Updates_Page SHALL show the Source_Title and the Note below the Promise link of that Related_Entry.
6. WHEN a Feed_Card has exactly one Related_Entry, THE Updates_Page SHALL label the list "Related Promise".
7. WHEN a Feed_Card has more than one Related_Entry, THE Updates_Page SHALL label the list "Related Promises (N)", where N is the number of Related_Entries.
8. WHEN a Feed_Card has more than 5 Related_Entries, THE Updates_Page SHALL place the list inside a native HTML `details` element that is closed by default and has a `summary` text of the form "Show all N related promises", so that no client-side JavaScript is needed to expand the list.
9. WHEN a Feed_Card has 5 or fewer Related_Entries, THE Updates_Page SHALL show the whole list without a `details` element.
10. THE Updates_Page SHALL use the key of each Feed_Card as the list key of the card and the Promise `id` as the list key of each Related_Entry.

### Requirement 13: Consistent promise counts

**User Story:** As a visitor, I want every promise count on the site to match, so that I can trust the numbers.

#### Acceptance Criteria

1. THE Home_Page SHALL derive every promise count shown by the Hero_Section, the Bento_Stats, and the Spotlight_Row from the one list of Visible_Promises obtained for the request.
2. THE Hero_Section SHALL count TVK_Promises only, in both DMK_Shown and DMK_Hidden.
3. WHILE DMK_Hidden, THE Home_Page SHALL show the number of Visible_Promises in the Hero_Section figure "Total Tracked", in the Bento_Stats text "Tracking N core promises", and in the Spotlight_Row link "See all N promises".
4. WHILE DMK_Shown, THE Home_Page SHALL show the number of Visible_Promises in the Bento_Stats text "Tracking N core promises" and in the Spotlight_Row link "See all N promises".
5. WHEN a visitor opens the Promises_Page with no filter applied, THE Promises_Page SHALL show the number of Visible_Promises in the header text and in the result count.
6. THE Sectors_Page SHALL show sector totals that add up to the number of Visible_Promises.

### Requirement 14: Amendment of "Other pages stay static"

**User Story:** As a maintainer, I want this feature to state which rule of the earlier Redis spec it changes, so that the two specs do not contradict each other.

#### Acceptance Criteria

1. THE application SHALL treat criterion 2 of Requirement 7 of the `upstash-promises-integration` spec, and the matching sentence in the Introduction of that spec, as replaced by criteria 2 and 3 of this Requirement.
2. THE application SHALL read promises on the Updates_Page, the Sectors_Page, the Parties_Page, the Archive_Page, the Home_Page, and the Impact_Page through the Visible_Promises_Loader instead of through the Static_Loader.
3. THE application SHALL keep every page other than the pages named in criterion 2, the Promises_Page, and the Promise_Detail_Page reading promises through the Static_Loader.
4. THE Static_Loader SHALL continue to read from the static JSON files, including the Seed_File and `data/dmk-promises.json`.
5. THE application SHALL continue to exclude every DMK_Promise from writes to Upstash_Redis, and the key `settings` SHALL hold the DMK_Visibility_Setting only.

### Requirement 15: Admin surfaces stay unfiltered

**User Story:** As an Admin, I want the export and the review pages to show every promise, so that hiding DMK content from visitors never hides data from me.

#### Acceptance Criteria

1. THE Export_API SHALL return all TVK_Promises from Upstash_Redis and all DMK_Promises from the Static_Loader in both DMK_Shown and DMK_Hidden.
2. THE Export_API SHALL ignore the DMK_Visibility_Setting.
3. THE Admin_Submissions_Page SHALL resolve the Promise named by a Submission through the Static_Loader, among all TVK_Promises and all DMK_Promises, in both DMK_Shown and DMK_Hidden.
4. THE Settings_Page SHALL list every party in `data/parties.json` in the Party Registry section in both DMK_Shown and DMK_Hidden.

### Requirement 16: Runnable grouping check

**User Story:** As a maintainer, I want a runnable check for the grouping logic, so that a regression that brings back duplicate cards or drops a promise from a card is caught.

#### Acceptance Criteria

1. THE repository SHALL contain one assert-based Grouping_Check file, next to the Feed_Grouper, that runs the Feed_Grouper without a test framework.
2. WHEN the Check_Script runs, THE Check_Script SHALL run the existing approval check and the Grouping_Check, and SHALL exit with a non-zero status if any assertion fails.
3. THE Feed_Grouper SHALL use only erasable TypeScript syntax and `import type` imports for project types, so that Node type stripping can run the Grouping_Check without a build step.
4. THE Grouping_Check SHALL build every fixture inside the check file, so that edits to the data files cannot break the check.
5. THE Grouping_Check SHALL verify grouping: entries with the same URL and date but different Source_Titles form one Feed_Card that lists every Promise; entries with the same URL and different dates form separate Feed_Cards; entries with an absent, empty, whitespace-only, or `#` URL never merge, including two such entries that share a date; and a Promise that repeats inside a group is listed once.
6. THE Grouping_Check SHALL verify card content: the lowest tier wins; the title rules for a single entry, a shared Source_Title, a tie, and the `publication` fallback; the summary rules for a shared Note and for no shared Note; and a Related_Entry carries a Source_Title and a Note only when they differ from the title and the summary of the Feed_Card.
7. THE Grouping_Check SHALL verify order and keys: newest first, the Input_Order rule for equal dates, unique keys, keys equal to the Group_Key for linkable URLs, and unique keys for entries with an Unlinkable_URL.
8. THE Grouping_Check SHALL run the Feed_Grouper on a deeply frozen input list and verify that the call does not throw.

## Assumptions

- **Storage and route.** The Redis key is `settings`, the body is `{ "showDmk": boolean }`, and the method is PATCH, which matches the existing admin submissions route. The route uses the same session and Admin check as that route and adds no public endpoint.
- **Interface copy.** The toggle label, the words "Shown" and "Hidden", the status messages, the header description of the Settings_Page, and the introduction text of the Parties_Page are proposals and can change in review. The Parties_Page text drops "across multiple parties and election cycles" so that it stays true with one party listed and needs no condition.
- **Hero card.** The Hero_Section keeps counting TVK_Promises only because its card is titled "TVK 2026 · Live Tracker". While DMK_Shown, the hero figure (TVK only) and the Bento_Stats figure (all visible promises) therefore differ by design.
- **Collapse threshold.** The list collapses above 5 Related_Entries. The value 5 keeps the five-promise NDTV card open and collapses the groups of 13, 44, 47, and 129 entries.
- **Evaluation order.** Repeats of one Promise are dropped first. The tier, title, and summary are then computed from the kept entries. The `publication` fallback uses the first kept entry.
- **Exact matching.** The Group_Key compares the URL and the date as exact text, so a trailing slash, `http` against `https`, or letter case makes two links different. This is a known limit; normalizing the URL in the Group_Key is the upgrade path. Dates are ISO calendar dates (`YYYY-MM-DD`), as all 252 current entries are, so newest first is descending date order. An unparseable date is not handled.
- **Facts about the current code that shape the scope.**
  - `GovTimeline` renders hard-coded TVK milestones and imports no promise data, so it is not changed.
  - The four promises mapped in the Benefit_Calculator are all TVK_Promises, so hiding DMK changes nothing visible there. The component still receives the Visible_Promises as props so that the rule holds if the mapping changes.
  - DMK promise ids look like `dmk-001`, but the archive slug pattern accepts only ids like `p12`. DMK archive URLs therefore return not-found in both states today. The pattern is not changed here, and Requirement 7 ties the outcome to the setting in case the pattern is widened.
  - `FilterSidebar` renders the Government section only when more than one party is passed, so with one Visible_Party the whole section disappears and `FilterSidebar` needs no change.
  - The Navbar profile menu already links to `/admin/settings`, so navigation is not changed.
- **Redis unavailable.** The setting falls back to hidden, so a Redis outage hides DMK content even after an Admin showed it. Without Upstash configured (local development), DMK stays hidden and the toggle cannot save.
- **Per-request rendering.** The six pages named in Requirement 14 render per request, and each request reads two Redis keys (the setting and the promises) at the same time. This is the accepted cost of a runtime switch. If traffic grows, a short revalidation window is the upgrade path.
- **Concurrent saves.** When two Admins save at the same moment, the last write wins.
- **Earlier spec.** The text of `upstash-promises-integration` is not edited by this feature. Requirement 14 is the record of the amendment.
- **Out of scope.** Adopting changes from the upstream repository, which was reported separately. URL-scheme validation of citizen evidence: the submit route accepts any absolute URL, approved evidence already renders as a link on promise pages, the live feed will render it too, and React blocks `javascript:` links. Changes to the DMK data. New dependencies.
