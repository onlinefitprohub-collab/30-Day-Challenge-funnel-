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

## Chrome Extension (v2.7.0)

`chrome-extension/` is a Manifest V3 extension (v2.7.0) with two core features:
1. **AI Inject** — inject AI-generated native GHL pages directly via `revex.put()` (no API key needed)
2. **Clone/Paste** — copy any GHL page and paste it into another builder via `clone-funnel-step`

### AI Inject Flow (v2.7.0 — primary flow)
1. User opens their Challenge Funnel app results page
2. Opens extension popup → project auto-saved → clicks **"Load"** next to a page (Landing/Opt-In/etc.)
3. Popup fetches GHL-native JSON from `/api/highlevel/page-data` → stored in `chrome.storage.local.cfReady`
4. User navigates to the corresponding GHL builder page (`/page-builder/...`)
5. Floating panel shows **"✦ Inject AI Page"** button
6. `background.js` CF_INJECT_AI_PAGE handler: reads `cfReady.pageData`, runs `_cf_injectPageData(builderId, locationId, pageData)` in MAIN world
7. `_cf_injectPageData` calls `revex.put('https://backend.leadconnectorhq.com/funnels/funnel/page/{builderId}', { pageData, locationId, pageId, isPublished: false })`
8. Builder iframe reloads — AI-generated native GHL elements appear immediately

### Clone/Paste Flow (also available)
1. User navigates to any GHL funnel page → clicks **"Copy Current GHL Page"**
2. `background.js` extracts `funnelId + stepId` via MAIN-world script → stored in `chrome.storage.session` as `cf_copied_page`
3. On builder → **"Paste GHL Page"** → `CF_PASTE_PAGE` uses `clone-funnel-step` to clone source → destination

### Why Revex Inject Works Without API Key
- `revexBackendService` is GHL's own authenticated axios instance in the Nuxt app
- `_cf_injectPageData()` runs in MAIN world via `chrome.scripting.executeScript` → accesses revex directly
- Same PUT endpoint as any API-key-based inject, but uses the user's own GHL session

### Files
- `manifest.json` — v2.7.0; host_permissions for app.gohighlevel.com + replit.dev/.app
- `popup.html/js` — AI library (Load → cfReady) + Clone/Paste buttons
- `content.js` — Floating panel: "Inject AI Page" (green) + "Paste GHL Page" (orange)
- `bridge.js` — Minimal MAIN-world script; emits CONTEXT_DETECTED
- `background.js` — CF_INJECT_AI_PAGE + CF_COPY_PAGE + CF_PASTE_PAGE handlers
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
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY` (for Google Imagen 3 image generation)

## Replit Migration Notes

- Upgraded from Next.js 14.2.5 → 15.2.9 (14.x had a SIGBUS crash in Replit's process environment due to mmap issues in the dev server worker)
- Dev/start scripts use `-p 5000 -H 0.0.0.0` for Replit's preview pane
- `allowedDevOrigins` and `serverActions.allowedOrigins` set to `*.replit.dev` for proxied iframes

## Running

The app starts automatically via the "Start application" workflow (`npm run dev`).
