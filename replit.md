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

## Chrome Extension

`chrome-extension/` is a Manifest V3 extension that injects AI-generated funnel pages into HighLevel's native page builder with one click.

- `manifest.json` — Manifest V3 with host_permissions for app.gohighlevel.com
- `popup.html/js` — Full settings + inject UI (project ID, HL API key, page selector)
- `content.js` — Injected into HL pages; reads locationId/pageId from URL; shows floating CF button
- `background.js` — Service worker
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
