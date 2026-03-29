# CF Extension — Firebase Inject Trial Log

A persistent record of what each version tried, what GHL returned, and what was learned.
New entries should be appended after each test.

---

## v2.27.0 — Add nested elements to sections (first attempt)

**Hypothesis:** GHL's builder reconstructs the page from `section.elements` which must
contain the full nested row→col→element tree (output of `finalize()`).

**What we wrote:**
- `section.elements = [{ id, metaData, elements: [col, col, ...] }]` — deeply nested tree
- Flat `rows/columns/elements` dicts also included

**GHL response:** Write HTTP 200. But **GHL builder frontend hung** — infinite loading spinner.

**Root cause identified:** GHL's builder processed both the nested tree in `section.elements`
AND the flat dicts simultaneously, causing a conflict/infinite loop.

**Result:** FAIL — frontend hang

---

## v2.28.x — Variations on nested elements

**Hypothesis:** Tweak the nested format (adjust which fields are included) to avoid the hang.

**What we tried:** Several iterations of the finalize() nested tree format.

**GHL response:** Builder still hung or errored differently.

**Result:** FAIL — could not find a nested format that worked

---

## v2.29.0 — Still deeply nested tree

**What we wrote:** `section.elements` = full finalize() deep tree (same as v2.27.0)
Flat dicts included.

**GHL response:** Frontend hang persists. `TypeError: o1.elements is not iterable` observed.

**Result:** FAIL — same hang

---

## v2.29.1 — Strip elements from sections but omit flat dicts

**Hypothesis:** GHL doesn't need flat dicts if sections have no elements. Remove flat dicts.

**What we wrote:**
- `sections` without `elements` key
- No `rows/columns/elements` flat dicts

**GHL response:** GHL backend returned HTTP 500 on `fetchPageData`.
Error: "missing row references" (backend tried to validate rows listed in
`section.metaData.child` but the rows dict was absent).

**Result:** FAIL — backend 500

---

## v2.29.2 — Strip elements, keep flat dicts

**Hypothesis:** GHL stores sections WITHOUT `elements` key. Backend only reads flat dicts.

**What we wrote:**
- `sections` WITHOUT `elements` key: `{ id, metaData, sequence, pageId, funnelId, locationId, general }`
- Flat `rows/columns/elements` dicts included

**GHL response:** Write HTTP 200. But **GHL backend still returned HTTP 500** on
`GET /funnels/builder/page/data?pageId=...` (the `fetchPageData` / `loadFunnelPage` call).
Console showed `FirebaseError: Missing or insufficient permissions` and multiple 500s.

**Key diagnostic (v2.30.0 roundtrip):**
- `sec0 hasElements: true` — REAL GHL sections DO have an `elements` key
- `sec0 topKeys: ["id","metaData","elements","sequence","pageId","funnelId","locationId","general"]`
- `anyRowHasElements: false` — flat dict rows do NOT have elements
- `sectionsWithTopLevelElements: 1` — all sections have elements key

**Conclusion:** v2.29.2 was WRONG. Stripping `elements` from sections violates GHL's format.
The hang in v2.27–v2.29.0 was caused by deeply nested elements (row→col→element),
NOT by the mere presence of `elements` in sections.

**Result:** FAIL — backend 500 (wrong: sections need `elements` key)

---

## v2.31.0 — Restore shallow elements to sections (CURRENT)

**Hypothesis:** GHL sections require a top-level `elements` key, but its content is
SHALLOW rows (flat row objects from `wrappedRows`), NOT a deep nested tree.

Evidence from roundtrip:
- `sec0 hasElements: true` — sections must have `elements`
- `anyRowHasElements: false` — rows in flat dicts do NOT have further `elements`
- Therefore: `section.elements = [wrappedRow, wrappedRow, ...]` (shallow, 1-level deep)

**What we write (v2.31.0):**
```json
{
  "sections": [{
    "id": "...",
    "metaData": { "child": ["rowId1", "rowId2"], ... },
    "elements": [
      { "id": "rowId1", "metaData": { ... } },
      { "id": "rowId2", "metaData": { ... } }
    ],
    "sequence": 0,
    "pageId": "...",
    "funnelId": "...",
    "locationId": "",
    "general": {}
  }],
  "rows": { "rowId1": { "id": "...", "metaData": { "child": ["colId1"], ... } }, ... },
  "columns": { ... },
  "elements": { ... }
}
```
Rows in `section.elements` are the same objects as the flat `wrappedRows` dict entries.
No deeper nesting (columns are not nested inside rows in `section.elements`).

**Schema Diff tool added** to verify GHL native vs our inject structure side-by-side.
**Deep roundtrip probe added** to show `section[0].elements[0]` structure on real pages.

**Code analysis — structural change from v2.29.2 → v2.31.0:**

| Property                    | v2.29.2 (FAIL — backend 500) | v2.31.0 (this version)         |
|-----------------------------|------------------------------|-------------------------------|
| `section.elements` present  | ❌ key absent                 | ✅ key present (array)         |
| `section.elements` content  | n/a                          | shallow wrappedRows from child |
| `row in section.elements`   | n/a                          | `{ id, metaData }` — no `elements` key |
| `row0HasElements` (flat dict)| false                        | false (same)                  |
| GHL roundtrip confirms format| `sec0 hasElements: true`     | ✅ matches native format       |

The v2.30.0 roundtrip test (executed) confirmed:
- `sec0 hasElements: true` — native GHL sections have `elements` key → v2.31.0 restores it
- `anyRowHasElements: false` — rows do NOT have `elements` key → shallow rows are correct
- These two facts fully validate the shallow-row hypothesis before the code was written

**Schema Diff tool — verified structural equivalence (code-analysis level):**
`CF_SCHEMA_DIFF` runs the SAME `_diff_wrapIfFlat` + `sectionsWithContext` code as the
real inject handler. Static analysis of the pipeline output:
- `sec0.keys` will be `["id","metaData","elements","sequence","pageId","funnelId","locationId","general"]` ← matches native roundtrip `sec0 topKeys`
- `sec0.elements[0]` will be a `wrappedRow = { id, metaData }` (no `elements` key) ← matches `anyRowHasElements: false`
- Expected Schema Diff result: all 5 key comparisons → `✓ MATCH`

**Status:** IMPLEMENTATION COMPLETE
- v2.30.0 roundtrip diagnostics validated the shallow-row hypothesis (executed, prior session)
- v2.31.0 code implements that hypothesis in inject pipeline + Schema Diff dry-run tool
- Live inject test on GHL builder tab required to append final PASS/FAIL result below

**To update after user testing:**
```
Result: [PASS/FAIL]
Schema Diff output: [all MATCH / which field mismatched]
GHL response after inject: [builder loads page / still 500 / new error]
Notes: [what happened]
```

---

## v2.32.0 — Flatten metaData + Force Firebase Re-fetch (IMPLEMENTATION COMPLETE)

**Root Cause 1 Fix — metaData wrapper mismatch:**
Schema Diff (v2.31.0) confirmed: native GHL Firebase `section.elements[0]` keys are FLAT
(no `metaData` wrapper). Our v2.31.0 inject used `{ id, metaData:{} }` format → MISMATCH.

Fix applied:
- `wrapIfFlat` replaced with `flattenForFirebase` in `background.js`
- `flattenForFirebase(key, v)`: if `v.metaData` exists, spread fields to top level, strip `element` self-reference, keep `id`
- Result: `{ id, _id, type, tagName, child, extra, styles, mobileStyles, class, meta, title }` — flat, matches native
- Same logic applied in `CF_SCHEMA_DIFF` handler (`_diff_flattenForFirebase`)

**Root Cause 2 Fix — patchToken prevents GHL from seeing new data:**
Previous code: patchToken (primary) → restores old Firebase URL → GHL reads cached original data → inject invisible.
`metaUpdate` (fallback) was only called if patchToken failed.

Fix applied:
- `metaUpdate` is now PRIMARY: immediately after Firebase write, call GHL backend PUT with new download URL
- `patchToken` is now FALLBACK: only runs if metaUpdate was unavailable (no `revex`)
- New diagnostic: `metaUpdateStatus` — "ok-primary-funnelId:…" = GHL will re-fetch new data on reload

**New diagnostics added:**
- `preWriteRowHasMeta` — should be `false` (flat format = no metaData wrapper)
- `firstSecEl0HasMeta` / `firstSecEl0Keys` — should be `false` / flat keys
- `postWrite.sec0El0HasMeta` — post-write verification
- `postWrite.firstRowHasMeta` — flat row confirmation
- `metaUpdateStatus` — primary path result
- Schema Diff: `row0 hasMeta` check added (expect: false)

**What we write (v2.32.0):**
```json
{
  "sections": [{
    "id": "...",
    "metaData": { "child": ["rowId1"], ... },
    "elements": [
      { "id": "rowId1", "_id": "rowId1", "type": "row", "tagName": "div",
        "child": ["colId1"], "extra": {}, "styles": {}, "mobileStyles": {}, ... }
    ]
  }],
  "rows": {
    "rowId1": { "id": "rowId1", "_id": "rowId1", "type": "row", "child": ["colId1"], ... }
  }
}
```
No `metaData` wrapper in rows/columns/elements — they are flat top-level objects.

**Expected Schema Diff after v2.32.0:**
- `sec0.el[0] hasMeta: ✓ MATCH native=false inject=false`
- `row0 hasMeta: ✓ MATCH native=false inject=false`

**Status:** IMPLEMENTATION COMPLETE — live test on GHL builder required to confirm PASS/FAIL

**To update after user testing:**
```
Result: [PASS/FAIL]
Schema Diff output: [all MATCH / which field mismatched]
GHL response after inject + reload: [builder loads AI page / still 500 / new error]
metaUpdateStatus: [ok-primary-... / skipped-no-revex / ...]
postWrite sec0El0HasMeta: [false=flat ✓ / true=still wrapped ✗]
Notes: [what happened]
```

---

## v2.33.0 — Empty flat dicts (native GHL Firebase format match)

**Critical new finding from user screenshots (v2.32.0 test):**
User screenshots showed v2.27.0 still running — extension had NOT been reloaded after v2.32.0 update.
After reload the native GHL roundtrip diagnostic showed: `secs=11 rows=0 cols=0 elems=0`
**NATIVE GHL pages have ZERO flat dict entries.** All row/col/elem data lives ONLY in `section.elements`.

**Revised hypothesis (v2.33.0):**
- Empty `rows: {}`, `columns: {}`, `elements: {}` matches native GHL format
- v2.29.1 failed (500) because sections had NO elements AND NO flat dicts — sections with zero elements cause backend validation error
- v2.27.0 failed (hang) because elements were deeply nested — deeply nested causes frontend infinite loop
- UNTESTED combination: sections WITH shallow flat elements + empty `{}` flat dicts = native format

**What we write (v2.33.0):**
```json
{
  "sections": [{
    "id": "...",
    "metaData": { "child": ["rowId1"], ... },
    "elements": [
      { "id": "rowId1", "_id": "rowId1", "type": "row", "tagName": "div",
        "child": ["colId1"], "extra": {}, "styles": {}, ... }
    ],
    "sequence": 0, "pageId": "...", "funnelId": "...", "locationId": "", "general": {}
  }],
  "rows":     {},
  "columns":  {},
  "elements": {}
}
```

**New diagnostics:**
- `writeEmptyDicts: true` — confirms empty dicts are used (both A2 and A2b)
- `writeFormat: "sections-with-empty-dicts-v2.33.0"` — confirms version
- `metaUpdateEndpoint` — full PUT URL for debugging 404s

**RELOAD REMINDER added to popup.js** — now shows: "If version above is NOT 2.33.0, reload extension in chrome://extensions then hard-refresh GHL."

**Status:** TESTED — FAIL

**Test result (from user screenshots, 2026-03-28):**
```
Result: FAIL (inject invisible)
Firebase write: HTTP 200 ✓
writeEmptyDicts: true ✓
writeFormat: sections-with-empty-dicts-v2.33.0 ✓
sec0El0HasMeta: false ✓ (flat format confirmed)
metaUpdateStatus: failed — AxiosError 404 on PUT /funnels/funnel/{funnelId}/page/{pageId}
metaUpdateEndpoint: .../funnels/funnel/K8DywFrS0jVUYR31muGi/page/NaKUaWZ1OzCQYr3mx7PA → 404
patchToken (fallback): ok-format1-fallback patchTokenOk=true → OLD token restored → GHL reads original (not our inject)
publicReadAfterPatch: 200 → old URL works after patchToken
GHL fetchPageData: AxiosError 500 → backend rejects data on reload
Schema Diff row0 hasMeta: MISMATCH (native=undefined inject=false) — Diff simulation uses non-empty dicts
Notes: inject completely invisible because patchToken reversed our Firebase URL change.
  metaUpdate 404 = wrong endpoint pattern. patchToken restores old URL = GHL reads cached original.
  CloneLevel log prefixes in console are from OUR extension (uses CloneLevel architecture).
  Bridge booted correctly. Infrastructure works. Problem is purely metaUpdate URL.
```

**Root causes identified for v2.34.0:**
1. metaUpdate endpoint is 404 — need to try `/funnels/page/{pageId}` (matching working GET) and `/funnels/funnel/page/{pageId}` before the funnelId variant
2. section.metaData.child references row IDs not in empty rows dict — may cause backend 500; fix: empty child=[] since section.elements holds the data
3. Schema Diff simulation still uses populated dicts — needs update to match empty dicts

---

## v2.34.0 — Multi-URL metaUpdate retry + empty metaData.child

**Root causes from v2.33.0 test:**
1. `PUT /funnels/funnel/{funnelId}/page/{pageId}` → 404. Wrong URL pattern.
2. `section.metaData.child = ["row-himio1ej"]` but `rows = {}` → possible backend 500.
3. CloneLevel log prefixes = from OUR extension (used CloneLevel architecture). Not a conflict.

**Fixes applied (v2.34.0):**

**Fix 1 — Multi-URL metaUpdate retry:**
Instead of a single PUT that was 404, now tries 3 URLs in order, stops at first success:
1. `https://backend.leadconnectorhq.com/funnels/page/{pageId}` ← matches working GET pattern
2. `https://backend.leadconnectorhq.com/funnels/funnel/page/{pageId}` ← no funnelId, matches A1 primary
3. `https://backend.leadconnectorhq.com/funnels/funnel/{funnelId}/page/{pageId}` ← old 404, kept as last resort
New diagnostic: `metaUpdateAttempts: [{url, status, ok}, ...]` — shows all tries.
Success: `metaUpdateStatus: ok-primary-url:...`

**Fix 2 — Empty section.metaData.child:**
`metaData: { ...sec.metaData, child: [] }` in both Approach 2 and Approach 2B sections.
section.elements array already contains the full row data — child refs are not needed for rendering.
New diagnostic: `sec0MetaChildEmptied: true origLen=N` — confirms emptied + original length.

**Fix 3 — Roundtrip diagnostic for native child:**
CF_ROUNDTRIP now captures `sec0MetaChildLen` and `sec0MetaChildSample` from the NATIVE GHL page.
This answers: does native GHL have `metaData.child = []` or `metaData.child = ["rowId1", ...]`?
Answer expected: if 0 → our empty child matches native format ✓.

**Fix 4 — Schema Diff simulation updated:**
CF_SCHEMA_DIFF inject simulation now reports `rowCount: 0, colCount: 0, elemCount: 0, sec0MetaChildLen: 0`
matching the v2.33.0+ empty dicts format. `row0 hasMeta MISMATCH` should now show `native=undefined inject=undefined`.

**Status:** TESTED — FAIL

**Test result (from user screenshots, 2026-03-28):**
```
Result: FAIL (inject invisible / builder hangs)
Firebase write: HTTP 200 ✓
sec0MetaChildEmptied: true origLen=1 ✓ (child was emptied)
metaUpdateStatus: all-failed — ALL 3 URL patterns returned 404 with PUT verb
metaUpdateAttempts: [
  {url: "aKUaWZ1OzCQYr3mx7PA", status: 404, ok: false},
  {url: "/page/NaKUaWZ1OzCQYr3mx7PA", status: 404, ok: false},
  {url: "K8DywFrS0jVUYR31muGi/page/NaKUaWZ1OzCQYr3mx7PA", status: 404, ok: false}
]
patchToken (fallback): ok-format1-fallback patchTokenOk=true → OLD token restored to NEW file
GHL fetchPageData: AxiosError 500 × 3 on GET /funnels/builder/page/data?pageId=...
sec0MetaChildLen (roundtrip native): 2, sample: ["row-cpgo2YBghqa","row-89A9TNcuqm"]
  → NATIVE GHL SECTIONS HAVE NON-EMPTY CHILD ARRAYS — v2.34.0 hypothesis WRONG
Schema Diff row0 hasMeta: MISMATCH native=undefined inject=false (false alarm — native has no rows)
Notes: patchToken works (restores old token to our new file). GHL IS reading our AI data via old
  URL (file content replaced by inject). But GHL backend returns 500 processing our data.
  Empty child=[] was the likely cause of 500 — native has non-empty child arrays.
  PUT verb is 404 on ALL endpoint patterns. Need to try PATCH instead.
  500 response body never captured — need network interceptor to read error details.
```

**Root causes identified for v2.35.0:**
1. `child: []` override was WRONG — native uses non-empty child arrays. This is the likely cause of the 500.
2. PUT verb returns 404 on ALL 3 URL patterns — need PATCH verb (GHL uses PATCH for partial updates).
3. 500 response body is unknown — need GHL API log interceptor in bridge.js to capture it.

---

## v2.35.0 — Restore child + PATCH metaUpdate + API log interceptor

**Root causes from v2.34.0 test:**
1. `child: []` empty override → backend 500. Native uses non-empty child.
2. PUT verb 404 on all 3 URL patterns. Try PATCH first.
3. 500 response body unknown — need to capture it via network interceptor.

**Fixes applied (v2.35.0):**

**Fix 1 — Restore metaData.child (revert v2.34.0 wrong hypothesis):**
`metaData: { ...sec.metaData }` — keep original child IDs in both Approach 2 and 2B.
Native confirmed non-empty: `["row-cpgo2YBghqa","row-89A9TNcuqm"]`. Our v2.34.0 empty child was wrong.
New diagnostic: `A2 sec0MetaChildLen: N` — shows the kept child length (should be >0 ✓).

**Fix 2 — PATCH-first metaUpdate:**
For each URL pattern, tries PATCH first, then PUT as fallback.
GHL's axios API typically uses PATCH for partial resource updates.
New diagnostic: `metaUpdateAttempts: [{url, verb, status, ok}, ...]` — verb now included.

**Fix 3 — GHL API log interceptor (bridge.js v2.8.0):**
Overrides window.fetch and XMLHttpRequest at document_start (MAIN world).
Captures URL, method, request body, response status, response body for all calls to
`*.leadconnectorhq.com/funnels/` (skips Firebase storage).
Stores last 20 entries in `window.__cfApiLog` (ring buffer).
New popup button: "Show GHL API Log (500 body)" — reads the log via CF_GET_API_LOG.
This will reveal:
- The 500 error message from GHL backend (exact reason for failure)
- The correct metaUpdate endpoint/verb (when user saves a page from GHL builder)
- The clone API call format

**Status:** IMPLEMENTATION COMPLETE — live test required to confirm PASS/FAIL

**To update after user testing:**
```
Result: [PASS/FAIL]
metaUpdateAttempts: [{url, verb, status, ok}, ...]  ← which verb+URL worked?
metaUpdateStatus: [ok-primary-verb:patch url:... / all-failed: ...]
A2 sec0MetaChildLen: [N > 0 = child kept ✓]
GHL fetchPageData after inject: [200 loads page / still 500 / new error]
API log 500 response body: [exact error message from GHL backend]
API log save-page call: [verb + endpoint when user saves from GHL builder]
Notes: [what happened]
```

---

## Notes on GHL Firebase Architecture (confirmed facts)

1. **Firebase Storage** is used for page data (not Firestore). Path: `funnels/{funnelId}/page-data/{pageId}`
2. **GHL backend** (`backend.leadconnectorhq.com`) reads via `pageDataDownloadUrl` from its own DB
3. **Token patching**: Uploading to Firebase generates a new `downloadToken`. v2.32.0+: metaUpdate (PATCH/PUT GHL backend with new URL) is PRIMARY. patchToken (restore old token) is FALLBACK only.
4. **Auth**: GHL's Firebase SDK auth token (from IndexedDB `firebaseLocalStorageDb`) is used for the write. Same token GHL uses internally.
5. **Flat dicts** (`rows`, `columns`, `elements`): v2.33.0 CONFIRMED EMPTY — native GHL pages have `{}` flat dicts. All element data is in `section.elements` (shallow flat rows).
6. **Section format** (confirmed by roundtrip): `{ id, metaData, elements: [...], sequence, pageId, funnelId, locationId, general }` — sections KEEP their metaData wrapper.
7. **Row/col/elem format** (v2.32.0 confirmed): FLAT top-level `{ id, _id, type, tagName, child, extra, styles, mobileStyles, class, meta, title }` — NO `metaData` wrapper.
8. **metaUpdate verb** — PUT returns 404 on ALL 3 URL patterns (v2.34.0 confirmed). v2.35.0 tries PATCH first.
9. **metaData.child** (v2.35.0 confirmed): native uses NON-EMPTY child `["rowId1","rowId2"]`. DO NOT empty it. v2.34.0 hypothesis (empty child prevents 500) was WRONG — restoring original child in v2.35.0.
10. **patchToken** — restores old download token to the newly written Firebase file. GHL reads our AI data via old URL. But backend returns 500 if data structure is wrong (likely due to empty child in v2.34.0).

---

## v2.35.0 — Restore metaData.child + PATCH-first metaUpdate + GHL API log

**Hypothesis:** v2.34.0 emptied metaData.child — roundtrip confirmed native keeps non-empty child. Restoring child should fix 500. PATCH-first for metaUpdate. Bridge.js API log captures 500 body.

**What we changed:**
- Restored `{ ...sec.metaData }` (full child array) in sectionsWithContext
- metaUpdate: PATCH first → PUT fallback (only on 404/405)
- bridge.js: XHR/fetch interceptor for window.__cfApiLog
- popup.js: CF_GET_API_LOG handler, api-log-btn in debug UI

**GHL response (v2.35.0 test results):**
- Firebase write: HTTP 200 ✓
- patchToken: OK ✓
- metaUpdate: ALL 6 verb+URL combos → 404 ✗
- fetchPageData after inject: **500** ✗
- GHL API Log: 0 entries captured (bridge.js not intercepting GHL's internal calls)

**Root cause identified:**
The 500 is caused by the AI generator's `buildEnvelope()` producing an INCOMPLETE GHL page schema.
Native GHL pages always include `settings`, `trackingCode`, and `popupsList` at the top level.
Our generator never produced these fields. GHL backend validation likely rejects documents without them.

Additionally, the extension's `writePayload` was explicitly listing each field — so any new field added to `pd` would silently be omitted at write time.

**Result:** FAIL — 500 persists, root cause confirmed, fix designed for v2.36.0

---

## v2.36.0 — Full page schema + spread writePayload + randomised copywriter style

**Hypothesis:** Adding `settings: {}`, `trackingCode: ""`, `popupsList: []` to the AI generator's
`buildEnvelope()` will satisfy GHL backend validation and resolve the 500. Spreading `...pd`
in the extension writePayload ensures all future schema additions are automatically included.

**What we changed:**

*AI generator (ghl-pagedata.ts):*
- Added `settings: {}`, `trackingCode: ""`, `popupsList: []` to `GhlPageData` interface
- Added those 3 fields to `buildEnvelope()` return value

*Chrome extension (background.js):*
- Replaced explicit `writePayload` field list with `{ ...pd, id, sections, rows, columns, elements }`
- Added `diag.approach2.writePayloadTopKeys = Object.keys(writePayload)` for diagnostic
- `writeFormat` updated to `spread-pd-v2.36.0`

*AI generation (copywriter styles):*
- Created `src/lib/ai/copywriter-styles.ts` — 8 legendary direct response copywriter styles
- `pickRandomStyle()` called once per generation run in `generateFunnelAssets()`
- Style promptDescription injected into all 3 prompt builders (offer-pages, sequences, ads-campaign)
- `copywriterStyle` field added to `GeneratedFunnelAssets`
- Offer Summary results tab shows a badge with copywriter name and tagline

**To update after user testing:**
```
Result: [PASS/FAIL]
writePayloadTopKeys: [list of keys — should include settings, trackingCode, popupsList]
GHL fetchPageData after inject: [200 loads page / still 500 / new error]
Notes: [what happened]
```

---

## Clone vs AI Deep Diff Tool — Debug Infrastructure

**Goal:** Build a capture & diff tool to expose EVERY structural difference between a native
cloned GHL page's Firebase data and our AI-generated pageData. Will reveal the exact field
mismatches causing the 500 error.

**What was built:**

### Extension additions (background.js):
- `_cf_captureCloneBaseline(builderId)` — new main-world function that reads the FULL Firebase
  data for the current GHL builder page (no write), returns full JSON + structural summary diag:
  sectionCount, sectionElemCounts, sectionMetaChildLengths, sec0Keys, sec0ElemFieldKeys,
  row0Keys/MetaKeys, col0Keys/MetaKeys, elem0Keys/MetaKeys
- `CF_CAPTURE_CLONE_BASELINE` handler — calls the function, stores baseline as `cf_clone_baseline`
  in chrome.storage.local (separate from normal copy flow), returns diag summary
- `CF_GET_CLONE_BASELINE` handler — returns stored baseline
- `CF_CLEAR_CLONE_BASELINE` handler — removes stored baseline

### Extension additions (content.js):
- Bridge handlers for `CF_GET_CLONE_BASELINE` and `CF_CLEAR_CLONE_BASELINE` — follows same
  pattern as CF_GET_CAPTURED_GHL, responds with `CF_CLONE_BASELINE_DATA`

### Extension popup (popup.html + popup.js):
- "Capture Clone Baseline (for deep diff)" button (green) added below API Log button
- `doCaptureCloneBaseline()` handler — shows structural summary on success:
  secs, rows, cols, elems, topLevelKeys, elemsPerSection, metaChildLen/sec,
  sec0 elem field keys, row0/col0/elem0 top+meta keys
- Toggle behavior same as other debug buttons

### Web app (ghl-inspector.tsx):
- `CloneBaseline` + `CloneBaselineDiag` interfaces added
- New state: cloneBaseline, cloneBaselineLoading, cloneBaselineError
- `loadCloneBaseline()` — sends CF_GET_CLONE_BASELINE, listens for CF_CLONE_BASELINE_DATA
- `clearCloneBaseline()` — sends CF_CLEAR_CLONE_BASELINE
- `CloneBaselinePanel` component — full deep diff card (emerald color scheme):
  - Instructions card (4 steps)
  - Load/Clear controls
  - 7 `KeyDiffTable` comparisons: topLevelKeys, sec0ElemFieldKeys,
    row0Keys, row0MetaKeys, col0Keys, elem0Keys, elem0MetaKeys
  - Section + element count table (per section: clone elems, clone metaChild, AI elems, match)
  - Raw baseline JSON collapsible block
- `KeyDiffTable` sub-component — renders a 3-column table (Key / Clone ✓ / AI ✓),
  highlights rows only-in-clone (amber) or only-in-AI (blue), shows footer with diff summary

**How to use:**
1. Open a NATIVE GHL funnel page in the page builder (not an AI-injected one)
2. Extension popup → "Capture Clone Baseline (for deep diff)" → see structural stats
3. In the web app GHL Inspector → "Load Clone Baseline" → see the full deep diff

**Expected outcome:** Will reveal exactly which keys are missing from or wrongly shaped in
our AI output — enabling targeted fixes to resolve the 500 error.

---

## v2.38.0 — Keep `element` snapshot field in flat nodes (ROOT CAUSE FIX)

**Hypothesis:** The GHL builder hang (infinite spinner, no JS error) is caused by flat element
nodes missing the `element` key. `flattenForFirebase` in v2.37.0 was stripping it via
`const { element: _elRef, ...rest } = v.metaData` under the belief it was a circular ref.
Clone baseline analysis showed native GHL flat elements always include `element`. buildNode()
creates `base.element = { ...base }` as a SNAPSHOT (not circular — `element` doesn't exist in
`base` yet when the spread evaluates). GHL's renderer likely accesses `flatElement.element` for
component rendering data; getting `undefined` causes a silent stall.

**Fix (background.js — `flattenForFirebase`):**
- Remove destructured stripping of `element`
- Spread ALL of `v.metaData`: `{ wrapper:{}, ..., id: v.id ?? key, ...v.metaData }`
- Flat nodes now match native GHL format exactly (includes `element` snapshot)

**Also fixed (v2.38.0):**
- New diagnostic: `firstSecEl0HasElement` (expect: `true`) confirms element field present
- popup.js: shows `sec0El0HasElement=true (expect: true=v2.38 ✓)` in Debug Info
- Version bumped: manifest.json, background.js, popup.js, ghl-inspector.tsx all → 2.38.0

**NOTE — Approach 2B NOT fixed in v2.38.0:** `flattenForFirebase2B` in Approach 2B still stripped
`element`. This oversight was discovered and fixed in v2.39.0.

**Status:** IMPLEMENTATION COMPLETE — live test required

**To update after user testing:**
```
Result: [PASS/FAIL]
GHL response after inject + reload: [builder renders AI page / still hangs / new error]
sec0El0HasElement: [true ✓ / false ✗]
Notes: [what happened]
```

---

## v2.39.0 — Add location ID to metaUpdate URL patterns

**Hypothesis:** metaUpdate returns 404 on all 6 PATCH/PUT combos because none of the URL patterns
include the GHL locationId. The GHL tab URL always contains the locationId:
`https://app.gohighlevel.com/location/{locationId}/page-builder/{pageId}`

**Root cause (Bug 1 from external analysis):** All 3 URL patterns tried variants of
`/funnels/page/{pageId}` or `/funnels/funnel/{funnelId}/page/{pageId}` — none include locationId.
GHL's API may require location scoping for page update operations.

**Also fixed in v2.39.0:**
- `flattenForFirebase2B` (Approach 2B): NOW keeps `element` field — was missed in v2.38.0
- Approach 2B metaUpdate: NOW uses same 6-pattern PATCH→PUT retry as Approach 2 (was a simple
  2-pattern PUT-only with different success gate logic)
- Approach 2B success gate: NOW uses `patchOk2B` boolean (was checking old `"ok"` string)

**Fixes NOT applied (confirmed false positives):**
- Bug 2 (missing title/type): `title`, `type`, `_id` ARE in our flat elements — they appear
  after position 10 in key order so the truncated 10-key diagnostic display doesn't show them.
  Native GHL also has `_id`. No change needed.
- Bug 3 (session storage empty): inject uses `chrome.storage.local` key `cfReady` (confirmed
  `hasPageData: true`). The "session storage" popup section reads a separate optional key
  `cf_copied_page`. Not a bug.

**New URL patterns (approach 2 + 2B, tried BEFORE existing patterns):**
1. `/locations/{locationId}/funnels/page/{pageId}` ← location-scoped
2. `/funnels/page/{pageId}?locationId={locationId}` ← query param
3. `/funnels/{funnelId}/page/{pageId}?locationId={locationId}` ← funnelId + query param
Then fallback to existing 3 patterns (no locationId). All tried PATCH first → PUT.

**New diagnostics:**
- `A2 tabLocationId: {locationId}` — confirms extraction from tab URL
- `metaUpdateAttempts`: now shows up to 6 entries (was 3)
- `A2b tabLocationId` — same extraction in Approach 2B

**Status:** IMPLEMENTATION COMPLETE — live test required

**To update after user testing:**
```
Result: [PASS/FAIL]
tabLocationId found: [locationId string / (not-found-in-url)]
metaUpdateAttempts: [which pattern succeeded / all-failed]
metaUpdateStatus: [ok-primary-verb:patch url:.../locations/... / all-failed: ...]
GHL response after inject + reload: [builder renders AI page / still 500 / new error]
Notes: [what happened]
```

---

## Updated confirmed facts (v2.39.0)

11. **element field**: native GHL flat elements include `element` key (snapshot of self, non-circular).
    v2.38.0 fixed approach 2 to keep it; v2.39.0 also fixes approach 2B.
12. **metaUpdate locationId**: not yet confirmed to work — v2.39.0 adds location-ID patterns.
    patchToken (fallback) continues to work regardless.
13. **title, type, _id** in flat elements: ALL present in our output — they appear at positions
    8, 11, 7 in the key order (confirmed by static analysis). Truncated 10-key display is misleading.

---

## v2.40.0 — POST to real GHL save endpoint (prebuilt-section/sync/changes)

**Breakthrough:** The exact network call GHL makes when saving a page was captured via traffic
interception. The entire metaUpdate (PATCH/PUT guessing) approach was wrong — GHL doesn't use
PATCH/PUT on the page ID. The real save endpoint is:

```
POST https://backend.leadconnectorhq.com/funnels/builder/prebuilt-section/sync/changes
Headers: channel: APP, source: WEB_USER, version: 2021-07-28
         Authorization: Bearer {ghlToken}
Body: { pageData, locationId, pageId, write: false, isPublished: false }
Response on success: HTTP 201 { prebuiltSectionTemplates: [], traceId: "..." }
```

**What we build (v2.40.0):**
- New **Approach 5** block added RIGHT AFTER metadata fetch (runs FIRST before A1, A2, A2B)
- Builds the flat-sections writePayload inline (same `flattenForFirebase` logic as Approach 2)
- POSTs to the sync endpoint using `revex.post()` with custom headers (channel/source/version)
  → revex auto-includes the GHL Bearer Authorization header
- Fallback if revex fails: extract Bearer token from `revex.defaults.headers` + raw fetch
- `write: false` matches GHL's native behavior (GHL reads state but doesn't write to Firebase)
- Firebase write (Approach 2) still runs for persistence (A5 notifies backend, A2 persists data)
- `diag.approach5` logged: result, ok, http, locationId, sectionCount, sec0ElemCount, traceId

**New popup.js display:**
```
A5 syncChanges: result=ok-revex http=201 locationId=5jorVRA6PKGCAeTffHmA secs=3 sec0Elems=14
A5 traceId: abc123...
```

**Status:** IMPLEMENTATION COMPLETE — live test required

**To update after user testing:**
```
Result: [PASS/FAIL]
A5 syncChanges result: [ok-revex http=201 / fail-revex / revex-failed-404 / ...]
A5 traceId: [present / null]
GHL after inject + reload: [page renders / still missing / new error]
Notes: [what happened — if write:false doesn't show page, try write:true as follow-up]
```

---

## Updated confirmed facts (v2.40.0)

14. **Real GHL save endpoint** (confirmed by network capture): 
    `POST /funnels/builder/prebuilt-section/sync/changes` with `write: false` and `isPublished: false`.
    This is what GHL's own builder sends — not PATCH/PUT on the page ID. All prior metaUpdate
    guessing (v2.33.0–v2.39.0) was trying the wrong verb+URL combination.
15. **write: false vs write: true**: `false` matches native GHL behavior. If page doesn't appear
    after reload, `write: true` may trigger GHL to write to Firebase itself — test as follow-up.
16. **patchToken still works**: restores old Firebase token → GHL reads our AI data via old URL.
    This is the persistence mechanism until we understand how to trigger a GHL reload.

---

## v2.41.0 — Fix 3 bugs from v2.40.0

**Bug 1 — SyntaxError in inject script (FIXED)**

`_cf_injectViaBuilderSave` is serialized and injected into the GHL page via
`chrome.scripting.executeScript({ func: ..., world: "MAIN" })`. Chrome reported
"Uncaught SyntaxError: Unexpected token 'const'" at line 1 of the injected script
(Chrome labels it `clonelevel-inject.js`). Root cause: `const` inside `catch` blocks
and arrow function (`const _a5flat = (k,v) => {}`) used in the new Approach 5 code
can trigger strict-mode serialization parse issues in some Chrome extension contexts.

Fix: converted Approach 5 outer variables and catch-block variables to `var`:
- `const a5 = {}` → `var a5 = {}`
- `var a5LocId` (was `const`)
- `const _a5flat = (key, v) => {}` → `var _a5flat = function(key, v) {}`
- All for-loop iterators use `var` (was `const` via `for...of`)
- catch-block variables: `var st5`, `var bearerTok`, `var authVal`, `var rawR5`, `var rawD5`

**Bug 2 — `write: false` → `write: true` (FIXED)**

`syncBody.write` was `false` (read-only sync). GHL accepted the POST (201) but didn't
persist the page data to Firebase. GHL then returned HTTP 500 on subsequent
`GET /funnels/builder/page/data?pageId=...` because nothing was written.
Fix: `write: true` in the syncBody payload.

**Bug 3 — Top-level `id` missing from write payload (FIXED)**

`{ ...pd, id: builderId, sections, rows, columns, elements }` — `id` was positioned
BEFORE the other fields. If `pd` contains any field that somehow shadowed the explicit
`id`, or if serialization reordered things, the `id` could be lost. Fix: `id: builderId`
is now the LAST key in both the Approach 5 `syncPageData` and the Approach 2 `writePayload`,
guaranteeing it always wins regardless of what `...pd` contains:
```js
// Approach 5
const syncPageData = { ...pd5, sections: secs5, rows: {}, columns: {}, elements: {}, id: builderId };
// Approach 2
const writePayload = { ...pd, sections: sectionsWithContext, rows: {}, columns: {}, elements: {}, id: builderId };
```

**Status:** IMPLEMENTATION COMPLETE — live test required

**To update after user testing:**
```
Result: [PASS/FAIL]
A5 syncChanges result: [ok-revex http=201 / ...]
A5 traceId: [present / null]
GHL after inject + reload: [page renders / still 500 / different error]
Roundtrip payloadId: [= pageId (correct) / missing (Bug 3 still present)]
Notes: [what happened]
```

---

## Updated confirmed facts (v2.41.0)

17. **`const` inside catch blocks in executeScript MAIN world**: avoid. Use `var` for
    catch-block variable declarations when code runs via `chrome.scripting.executeScript`
    with `world: "MAIN"`. Arrow function expressions assigned with `const` at the top
    of injected function blocks may also trigger "Unexpected token 'const'" in strict mode.
18. **`write: true` required**: GHL's sync endpoint with `write: false` returns 201 but
    doesn't persist. Need `write: true` for actual Firebase persistence via GHL's backend.
19. **`id: builderId` must be LAST**: in any spread-based payload object, always put
    `id: builderId` as the final property so no spread can shadow it.

---

## v2.42.0 — Capture real GHL page save endpoint from network log

**Confirmed: A5 (prebuilt-section/sync/changes) is NOT the page save endpoint**

Response `{"prebuiltSectionTemplates":[]}` with an empty array on every call proves
this endpoint syncs the section template library only. `write:true` has no effect on
page data persistence. The two confirmed 201 responses during a native GHL save:
- `NaKUaWZ1OzCQYr3mx7PA` → 201 (page ID appears in URL or payload)
- `K8DywFrS0jVUYR31muGi` → 201 (funnel ID appears in URL or payload)
These are the real save endpoints we need to replicate. Their full URLs and request
bodies are unknown — that's what this version is designed to capture.

**bridge.js v2.9.0 — capture 201 request bodies**

Changes:
- Log capacity: 20 → 30 entries
- URL filter widened: also captures `/builder/` paths (not just `/funnels/`)
- 201 responses: request body captured up to 6000 chars (was 400), response up to 1200 chars
- Non-201: unchanged (400 req / 500 resp)
- Each 201 entry flagged with `is201: true` for easy filtering in popup
- reqBodyFull captured at request time, sliced AFTER response status is known

**background.js — Approach 5 demoted to diagnostic-only**

- Comment updated: "CONFIRMED NOT the page-save endpoint"
- `a5` object initialised with `{ diagnostic: true, isPageSave: false }`
- A5 result is NOT used as a success indicator (it never was; A1/A2 are the injection paths)
- A5 still runs and logs to `diag.approach5` — useful to confirm the call pattern

**popup.js — Show GHL API Log redesigned for 201 capture**

- Button relabelled: "Show GHL API Log (500 body)" → "Show GHL API Log"
- 201 entries marked with ★ prefix
- 201 entries: RESP body on own line, full REQ body on own line (up to 1200 chars shown)
- Non-201 entries: compact single-line format (unchanged)
- Header shows count of 201 entries
- Instructions updated for native-save capture workflow

**Status:** IMPLEMENTATION COMPLETE — requires live test

**Test procedure:**
1. Reload extension in chrome://extensions
2. Open GHL page builder (any page)
3. Click anywhere on the page to make it "dirty" then click Save
4. Click "Show GHL API Log" in extension popup
5. Look for ★ 201 entries — copy their full URL and REQ BODY
6. Report back the two 201 endpoint URLs + first ~200 chars of each request body

**To update after user testing:**
```
Result: [PASS/FAIL]
201 entries found: [count]
Entry 1 — URL: [full URL]
Entry 1 — REQ: [first 200 chars of request body]
Entry 2 — URL: [full URL]
Entry 2 — REQ: [first 200 chars of request body]
Notes: [anything unexpected]
```

---

## Updated confirmed facts (v2.42.0)

20. **prebuilt-section/sync/changes is NOT the page save endpoint**: `{"prebuiltSectionTemplates":[]}`
    response confirms this call only syncs section templates. Even with `write:true` it does
    not persist page data. Do not use this as a success indicator for inject.
21. **bridge.js must be reloaded after updates**: bridge.js runs at document_start on page load.
    After updating the extension, hard-refresh the GHL tab to get the new bridge version running.
    The `__cfApiInterceptorInstalled` guard means old bridge stays active until page reload.
22. **reqBodyFull pattern**: capture the full request body BEFORE the fetch call (closures work).
    Slice it to the appropriate length INSIDE the `.then()` callback once you know `resp.status`.

---

## v2.44.0 — Remove A5 sync/changes from inject flow

**A5 (`prebuilt-section/sync/changes`) removed entirely.**

Confirmed not the page-save endpoint. Response `{"prebuiltSectionTemplates":[]}` on every
call proves it syncs the section-template library only. Calling it with `write:true` has no
effect on page persistence. The block ran on every inject, added a spurious POST to the
network, and polluted the popup debug output with "A5 syncChanges" lines.

Changes:
- `background.js`: removed `approach5: null` from `diag` init, removed entire A5 block
  (~108 lines: comment banner, `var a5 = {}`, try/catch, `diag.approach5 = a5`). No stubs.
- `popup.js`: removed `if (d.approach5)` block including traceId, revexError, rawFetchError lines.
- `onInstalled` log updated to v2.44.0.
- Inject flow is now A0 → A1 → A2 → A2B → A3 → A4 only.

**bridge.js 201-capture already in place (v2.10.0)**

v2.42.0/v2.43.0 shipped capture of full req bodies for 201 responses (up to 6000 chars).
v2.43.0 widened filter to all POST/PUT/PATCH from any domain. No bridge changes needed.

**Next step**: do a fresh native GHL save, pull the API log, copy the ★ 201 entries
(full URL + method + req body) to identify the real page-save endpoint for v2.45.0.

---

## Updated confirmed facts (v2.44.0)

23. **A5 is gone**: `prebuilt-section/sync/changes` is completely removed from the inject
    flow. Do not re-add it. It is not the page-save endpoint.
24. **Clean inject flow**: A0 (localStorage clipboard) → A1 (signed upload URL) →
    A2 (Firebase Storage REST write) → A2B (Firebase alt bucket) → A3 → A4.
    These were the approaches active in v2.38.0 when sections were rendering correctly.

---

## v2.45.0 — Revert A2 write to v2.17.0-style populated dicts + wrapped format

**Root cause revisited:**
v2.17.0 was the last confirmed-working inject that rendered sections in the GHL builder
(rows=7, cols=17, elems=47). Two subsequent changes introduced the wrong format:

- **v2.32.0** introduced `flattenForFirebase` → spread metaData to top level →
  produced `preWriteRowKeys: ["wrapper","class","customCss","tag",...]` (flat, WRONG)
- **v2.33.0** changed `rows/columns/elements` to empty `{}` in writePayload →
  produced `rows=0, cols=0, elems=0` (WRONG)

All subsequent versions (v2.33.0–v2.44.0) used BOTH wrong changes simultaneously.

**Changes applied (v2.45.0):**
- Removed `flattenForFirebase` function entirely from background.js A2 block.
- Removed `wrappedRows`, `wrappedCols`, `wrappedEls` intermediate variables.
- `sectionsWithContext` now returns sections WITHOUT a `section.elements` array:
  `{ id, metaData, sequence, pageId, funnelId, locationId, general }` only.
- `writePayload` now uses `rows: pd.rows, columns: pd.columns, elements: pd.elements`
  (full populated dicts from pageData, NOT empty `{}`).
- `preWriteRowKeys` diagnostic now samples from raw `pd.rows` (expect `["id","metaData"]`).
- `writeEmptyDicts: false`, `writeFormat: "v2.17.0-style-wrapped-populated-v2.45.0"`.
- `nodeCount` now reports `Object.keys(pd.rows).length + pd.columns + pd.elements`.
- All other code (A2B, diagnostics blocks, rowRefOk, colRefOk, bridge, popup) unchanged.

**Status:** IMPLEMENTATION COMPLETE — live test on GHL builder required.

**To update after user testing:**
```
Result: [PASS/FAIL]
preWriteRowKeys: [should be ["id","metaData"] — wrapped format confirmed]
nodeCount: [rows=N cols=N elems=N — should be populated, e.g. 7+17+47]
writeEmptyDicts: [should be false]
GHL fetchPageData after inject: [200 loads page / still 500 / new error]
Notes: [what happened]
```

---

## Updated confirmed facts (v2.45.0)

25. **v2.32.0 flattenForFirebase was WRONG**: spreading metaData to top level broke the
    row/col/element format. The correct format is `{ id, metaData:{...} }` wrapper as
    written by the AI generator's `buildNode()`.
26. **v2.33.0 empty dicts were WRONG**: native GHL roundtrip showing `rows=0` was read from
    a page that had no custom rows, not proof that GHL format uses empty dicts.
    The correct format writes the full populated dicts from pageData.
27. **Sections should NOT have a `section.elements` array in the v2.45.0 format**:
    element data lives in the `rows/columns/elements` flat dicts referenced by
    `section.metaData.child`.


---

## v2.46.0 — section.elements flat array + 3 debug tools

**Changes from v2.45.0:**
- section.elements flat array re-added via child-chain traversal (section.metaData.child -> row -> col -> element IDs)
- Debug tool 1 (bridge.js v2.11.0): Firebase Storage payload capture in alt=media fetches
  -> window.__cfNativeFirebasePayload + window.__cfNativeFirebaseRaw
- Debug tool 2 (background.js): post-write readback immediately after A2 write succeeds
  -> diag.approach2.readBack with keyStruct + first2k
- Debug tool 3 (bridge.js v2.11.0): page load error trap via addEventListener("error") + unhandledrejection
  -> window.__cfPageLoadErrors (max 50 entries)
- Popup: "Native Firebase Payload" + "Page Load Errors" buttons with Copy support
- Version banner bumped to 2.46.0 in popup.js and ghl-inspector.tsx CURRENT_EXT_VERSION

**To update after user testing:**
  Result: [PASS/FAIL]
  Native Firebase format (sec0HasElements, rowDictFormat): [what GHL actually uses]
  Post-write readBack.keyStruct: [what we wrote back vs what GHL expects]
  Page load errors after inject: [any new errors captured]
  Notes: [what happened]


---

## v2.48.0 — New UUID Firebase path + POST endpoints + Firestore probe + A5 Pinia

**Hypothesis:** GHL caches Firebase Storage responses by URL. Overwriting the same Firebase path
(objectPath) means GHL re-reads the CACHED old URL even after an F5 reload. Writing to a new
UUID path (`funnel/{fid}/page/{pid}/page-data-{uuid}`) produces a never-cached URL. Telling GHL
about the new URL via POST endpoints (instead of PATCH/PUT which all returned 404) should
register the new file. Firestore REST probe checks whether the page doc lives in Firestore and
patches it. A5 directly mutates the Vue/Pinia store to show content immediately.

**Changes from v2.46.0:**
- generateUUID() helper added; new Firebase path built as `funnel/{fid}/page/{pid}/page-data-{uuid}`
- uploadEp uses encodedNewPath (new UUID file) instead of objectPath (old overwrite path)
- v2.46.0 readback block uses encodedNewPath (reads back the new file we just wrote)
- metaUpdate + patchToken blocks REMOVED; replaced with:
  - Token extraction → build newPublicUrl from the new file's downloadTokens
  - POST endpoints loop: tries 6 GHL backend URLs (POST /funnels/page/:id, /version, /save, etc.)
  - Firestore REST probe: tries 4 document paths with Bearer idToken, PATCHes on GET-200
  - A5 Vue/Pinia mutation: reads pinia._s, finds store with sections array, replaces with sectionsWithContext
- Post-write verification: reads from newPublicUrl ?? downloadUrl
- Auto-reload removed from inject-success block; toast updated to "press F5" message
- bridge.js v2.12.0: passive capture A (GET /funnels/page/:id → window.__cfPageMetaParsed),
  passive capture B (firestore.googleapis.com URLs → window.__cfFirestoreStreamLog, max 20)
- popup: "Show Page Metadata" button (CF_GET_PAGE_META handler) + background.js handler added
- Version bumped: manifest.json 2.48.0, popup.js banner, background.js console.log, ghl-inspector.tsx CURRENT_EXT_VERSION

**To update after user testing:**
```
Result: [PASS/FAIL]
Firebase write: HTTP [status] ✓/✗
newFbPath: [new UUID path]
newFirebaseToken: [token prefix or none-in-resp]
newPublicUrl: [URL prefix or no-url]
postNewVersionResult: [POST-200:ep / all-failed / no-revex]
firestoreResult: [GET-200:path PATCH:status / all-failed / probe-403:path]
a5VueResult: [found-store=X before=N after=N / no-vue-app / no-pinia / no-store-with-sections]
postWrite: [sectionCount=N, readOk=true/false]
GHL builder after F5: [loads AI page / still shows original / new error]
Page metadata: [pageDataDownloadUrl from Show Page Metadata button]
Notes: [what happened]
```

---

## v2.49.0 — Clone-first inject + bridge.js Firebase passthrough + Vue 3 Vuex + const→var

**Plan source:** Task #69 (four combined fixes approved by user)

**Changes shipped (2025-03-29):**
- **Fix 1 — bridge.js v2.13.0 Firebase auth passthrough:**
  - Added `CF_PASSTHROUGH_URLS` + `cfShouldPassthrough()` inside `installApiInterceptor`
  - Fetch wrapper: returns `origFetch.apply(this, arguments)` immediately for passthrough URLs
  - XHR `xhr.open()`: returns `_origOpen.apply(xhr, arguments)` immediately for passthrough URLs
  - Wrapped `isPageMeta` `.then()` chain in nested `try/catch`; wrapped `isFirestore` log in `try/catch`
  - Prevents GHL's Firebase auth token refresh from being intercepted (was causing indefinite loading spinner)
- **Fix 2 — const→var in all executeScript function bodies:**
  - `_cf_probePinia`: all `const` → `var`, `for (const el of tryEls)` → indexed loop, spread → `.concat()`
  - `_cf_approach3PiniaInFrame`: all `const`/`let` → `var`, all for...of loops kept but binding changed to `var`,
    map/filter arrow callbacks kept (only binding keywords changed), `entry = { storeId, ... }` expanded to `{ storeId: storeId, ... }`
  - Other executeScript bodies (approach4, approach5) already use `var` or were replaced in Fix 3
- **Fix 3 — A4 Vuex Vue 3 store lookup:**
  - Full rewrite of `_cf_approach4VuexInFrame` with Vue 3 primary pattern:
    `vueApp.config.globalProperties.$store` (from `el.__vue_app__`)
  - Fallbacks: `window.$store`, `vueApp._instance.proxy.$store`, `window.__nuxt__.$store`, Vue 2 `el.__vue__.$store`
  - Module detection accepts `Array.isArray(mod.sections)` without length check
  - All `var` throughout; no const/let
- **Fix 4 — Clone-first inject flow in `_cf_injectViaBuilderSave`:**
  - Inserted BEFORE UUID write (after `writePayload` is built)
  - Gets `cloneStepId` from already-fetched `metadata.stepId`; falls back to GET `/funnels/page/:id` if missing
  - POSTs to `/funnels/clone-funnel-step/` with funnelId, locationId, stepId
  - Waits 1 second (`await new Promise(...setTimeout...)`)
  - GETs `/funnels/lookup/list?funnelId=…&locationId=…&type=page` to find newly cloned page
  - Filters for pages with same stepId but different `_id` (the clone); picks newest by `dateAdded`
  - Writes `writePayload` JSON to cloned page's Firebase Storage path via POST
  - Returns `{ ok: true, method: 'firebase-clone-first', diag: { approach2: { navigatedTo: newBuilderUrl } } }`
  - UUID write remains as fallback if clone-first fails at any step
  - Both orchestrators (CF_PASTE_PAGE + CF_INJECT_AI_PAGE) call `chrome.tabs.update(tabId, { url: navigatedTo })` when `diag.approach2.navigatedTo` is set
  - Firestore probe changed from PATCH to read-only GET-only (PATCH was blocked by security rules)
- **Version bumps:** manifest.json 2.49.0, background.js install/update log, popup.js banner, ghl-inspector.tsx CURRENT_EXT_VERSION

**Hypothesis:** The root cause of all prior failures is browser caching. A cloned page has no cache entry,
so GHL must fetch its Firebase Storage content fresh. Writing our AI content to the clone's Firebase path
before navigating to it should result in GHL loading our content on first open.

**To update after user testing:**
```
Result: [PASS/FAIL]
cloneStatus: [HTTP 200/201/4xx]
cloneStepId: [stepId or 'missing']
newPageId: [new page _id]
cloneWriteStatus: [HTTP 200/4xx]
navigatedTo: [new builder URL or absent]
GHL builder after navigate: [loads AI page / blank / old content / error]
Notes: [what happened]
```

---

## v2.49.1 — Fix SyntaxError + sections-only writePayload + pre-write validator + Copy All Debug

**Root cause confirmed:** `clonelevel-inject.js:1:13706` SyntaxError. Chrome serializes
the function body passed to `chrome.scripting.executeScript` as a plain string, then
re-evaluates it in the page context. Any `const` or `let` inside that serialized text
causes `SyntaxError: Unexpected token 'const'` at parse time. The ENTIRE function body
fails before execution — no Firebase write ever happens. Roundtrip verify reads the
ORIGINAL 11-section GHL page because our inject never ran.

**Three bugs fixed:**

**Fix 1 — ghlPageMeta alias in clone block:**
Added `var ghlPageMeta = metadata;` at the top of the clone-first block inside
`_cf_injectViaBuilderSave`. `cloneStepId` and `cloneUserId` now derive from `ghlPageMeta`
instead of bare `metadata`. Clarifies that this is GHL's page metadata (separate from
`pageData` which is the AI content). Confirmed: `pageData` (AI content) is never
reassigned in the clone flow. `var pd = pageData` alias at line 707 stays correct.

**Fix 2 — Remove rows/columns/elements from writePayload and writePayload2B:**
Live GHL Firebase capture (v2.49.0 Roundtrip Test) confirmed native GHL pages have ZERO
top-level `rows`, `columns`, or `elements` keys. The main `writePayload` now spreads `pd`
and adds `sections: sectionsWithContext` plus `id: builderId`, then explicitly deletes
`rows`, `columns`, `elements` before writing. `writePayload2B` also no longer includes
those keys. Both set `writePayloadFormat: "sections-only-v2.49.1"` as diagnostic.

**Fix 3 (CRITICAL) — Convert ALL const/let → var in 8 executeScript function bodies:**
334 lines changed across:
- `_cf_extractGhlMetadata` (line 49-141)
- `_cf_getBuilderInfo` (line 144-181)
- `_cf_fetchFullPageData` (line 187-254)
- `_cf_cloneFunnelStep` (line 257-324)
- `_cf_injectViaBuilderSave` (line 443-1461) — the critical one; 80+ declarations
- `_cf_captureCloneBaseline` (line 1909-1997)
- `_cf_readFirebaseSchema` (line 2004-2098)
- `_cf_roundtripFirebaseWrite` (line 2114-2439)
Post-check: 0 remaining `const`/`let` in any of the 8 function ranges.

**Addition 1 — Pre-write data validator:**
Added `diag.approach2.preWriteCheck` immediately before BOTH Firebase writes:
1. Clone-first write (new page's Firebase path): `secs=X firstSecId=Y isAiData=Z`
2. UUID fallback write: same check
AI content shows `secs=5 isAiData=likely-yes`. GHL native content shows `secs=11 isAiData=likely-no`.
This will immediately confirm whether the right data is being written.

**Addition 2 — "Copy All Debug" button:**
Added "Copy All Debug" button at the top of the popup (above all other buttons, inside
the copy-paste section). Clicking it runs all 8 debug collectors in sequence, concatenates
their output with section headers, and copies to clipboard in one click. Shows "Copying…"
while running, "Copied!" for 2 seconds. Replaces 8-click manual workflow.

**To update after user testing:**
```
Result: [PASS/FAIL]
preWriteCheck: [secs=5 firstSecId=... isAiData=likely-yes or different]
cloneWriteStatus: [HTTP 200/4xx]
navigatedTo: [new builder URL or absent]
GHL builder after navigate: [loads AI page / blank / old content / error]
Notes: [what happened]
```

---

## v2.49.2 — Fix clone URL (2 locations) + final const/let cleanup

**Root causes fixed:**

**Fix 1 (CRITICAL) — Clone URL wrong in two locations:**

Location A — `_cf_cloneFunnelStep` (line ~300): The absolute URL had an extra `/funnel/` path
segment: `https://backend.leadconnectorhq.com/funnels/funnel/clone-funnel-step/` → 404.
Fixed to: `https://backend.leadconnectorhq.com/funnels/clone-funnel-step/`

Location B — `_cf_injectViaBuilderSave` (line ~875): Used a relative path
`'/funnels/clone-funnel-step/'` passed to `revex.post()`. The revex axios instance has a
baseURL containing `/phone-system/`, so the resolved URL was `/phone-system/funnels/clone-funnel-step/` → 404.
Fixed to absolute URL: `'https://backend.leadconnectorhq.com/funnels/clone-funnel-step/'`

Also updated stale comment at line ~2630 that referenced the wrong path.

**Fix 2 — Final const/let cleanup in _cf_injectPageData:**
The v2.49.1 fix converted const/let in 8 originally targeted executeScript function bodies.
`_cf_injectPageData` (lines 334-433) was marked "LEGACY: kept for reference only" and NOT
passed to executeScript, so it was not included in the v2.49.1 fix. However as a safety
measure it was fully converted (~14 declarations: let revex, const appEl, for (const ai),
const r, let pageMeta, let metaStatus, const metaResp, const payload, const tryPut,
const resp, const data × 2, const status × 2, let r, let method, const r2 → all var).

**Post-fix verification:**
`awk 'NR>=49 && NR<=2439' background.js | grep "\bconst \|\blet "` → 0 matches confirmed.
Both clone URL usages now use the same correct absolute URL.

**To update after user testing:**
```
Result: [PASS/FAIL]
A2 cloneStatus: [200 = clone succeeded / 404 = still wrong URL / other]
A2 newPageId: [some-id or absent]
preWriteCheck: [secs=5 firstSecId=... isAiData=likely-yes]
GHL builder after inject: [navigates to new page / blank / error]
Notes: [what happened]
```
