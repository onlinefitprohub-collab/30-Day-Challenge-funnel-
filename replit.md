# Challenge Funnel in a Box

A Next.js SaaS app that generates complete 30-day fitness challenge funnels (landing page copy, email sequences, SMS, Facebook ads, UTMs) using AI, targeted at fitness coaches.

## Architecture

- **Framework**: Next.js 15.2.9 (App Router)
- **Auth + Database**: Supabase (SSR client via `@supabase/ssr`)
- **AI**: Claude 3.5 Sonnet (Anthropic) with OpenAI GPT-4o fallback; Google Imagen 3 for images
- **Styling**: Tailwind CSS + Radix UI components
- **Forms**: React Hook Form + Zod
- **HL Integration**: JSON funnel export, API push, Chrome Extension injector

## Project Structure

```
src/
  app/
    (auth)/               # Login, signup pages
    (dashboard)/          # Protected dashboard/project pages
    api/generate/         # POST: AI funnel generation
    api/auth/login/       # POST: Supabase login (cookie-based)
    api/highlevel/
      import/             # POST: Full HL API funnel import
      page-data/          # GET:  GhlPageData JSON for a project page
      inject/             # POST: Inject native HL elements via API
      extension-download/ # GET:  Download Chrome extension .zip
    page.tsx              # Public landing page
    layout.tsx            # Root layout
  components/ui/          # Radix-based UI primitives
  lib/
    supabase/             # Browser, server, middleware clients
    ai/                   # AI generation logic (Claude + OpenAI + mock)
    highlevel/
      client.ts           # hlFetch wrapper for HL API
      ghl-pagedata.ts     # Native GHL element tree builders (colour scheme aware)
      ghl-export.ts       # JSON funnel export for drag-drop import
      import.ts           # Full funnel create + native page injection
  hooks/                  # React hooks
  types/                  # TypeScript types
  middleware.ts           # Supabase session refresh + route protection
chrome-extension/         # Manifest V3 Chrome extension (HL page injector)
supabase/                 # DB migrations/schema
scripts/                  # Test/generation scripts
```

## Chrome Extension (v2.6.0)

`chrome-extension/` is a Manifest V3 extension that copies any GHL page and pastes it into the GHL page builder using GHL's own `clone-funnel-step` API — the same mechanism used by CloneLevel and SiteGrab.

### Copy/Paste Flow (v2.6.0)
1. User navigates to any GHL funnel page (public or private)
2. Opens extension popup → clicks **"Copy Current GHL Page"**
3. `background.js` runs `_cf_extractGhlMetadata()` in the page's MAIN world via `chrome.scripting.executeScript()` → extracts `funnelId + stepId` from Nuxt payload / window globals
4. Stores `{ funnelId, stepId, pageName }` in `chrome.storage.local` as `cf_copied_page`
5. User navigates to their GHL builder page (`/page-builder/...`)
6. Clicks **"Paste into GHL Builder"** (popup or floating panel)
7. `background.js` runs `_cf_getBuilderInfo(builderId)` → gets destination `funnelId + stepId` via revexBackendService
8. Runs `_cf_cloneFunnelStep(req)` → calls `POST /funnels/funnel/clone-funnel-step/` via revex with the full backend URL
9. Runs `_cf_refreshBuilderIframe()` → reloads builder iframe
10. GHL's own backend clones all page content into the destination step

### Why This Works
- Uses `revex.post()` with the **full URL** (`https://backend.leadconnectorhq.com/...`) — avoids the wrong-baseURL bug
- GHL's own server handles the page data copy — no schema to construct
- `activeTab` permission grants access to any active tab when user clicks the popup

### Files
- `manifest.json` — Manifest V3; host_permissions for app.gohighlevel.com + replit.dev/.app
- `popup.html/js` — Copy/Paste buttons + AI project library
- `content.js` — Floating panel on GHL builder; Paste button via chrome.runtime.sendMessage
- `bridge.js` — Minimal MAIN-world script; emits CONTEXT_DETECTED (URL detection only)
- `background.js` — Service worker with CF_COPY_PAGE + CF_PASTE_PAGE handlers + inline MAIN-world functions
- Load unpacked from `chrome-extension/` folder in Chrome developer mode

## Colour Schemes (5)

`navy-orange` (default), `rose-pink`, `teal-forest`, `purple-lilac`, `sky-blue`.
Each scheme applies to: hero section backgrounds, CTA gradients, button colours, badge text.
All 4 ghl-pagedata.ts builder functions read `data.colourScheme` automatically.

## Environment Variables Required

All set as Replit secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY` (for Google Imagen 3 image generation)

## Replit Migration Notes

- Upgraded from Next.js 14.2.5 → 15.2.9 (14.x had a SIGBUS crash in Replit's process environment due to mmap issues in the dev server worker)
- Dev/start scripts use `-p 5000 -H 0.0.0.0` for Replit's preview pane
- `allowedDevOrigins` and `serverActions.allowedOrigins` set to `*.replit.dev` for proxied iframes

## Running

The app starts automatically via the "Start application" workflow (`npm run dev`).
