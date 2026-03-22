# Challenge Funnel in a Box

A Next.js SaaS app that generates complete 30-day fitness challenge funnels (landing page copy, email sequences, SMS, Facebook ads, UTMs) using AI, targeted at fitness coaches.

## Architecture

- **Framework**: Next.js 15.2.9 (App Router)
- **Auth + Database**: Supabase (SSR client via `@supabase/ssr`)
- **AI**: OpenAI API (with mock fallback if key is absent)
- **Styling**: Tailwind CSS + Radix UI components
- **Forms**: React Hook Form + Zod

## Project Structure

```
src/
  app/
    (auth)/         # Login, signup pages
    (dashboard)/    # Protected dashboard/project pages
    api/generate/   # POST endpoint for AI funnel generation
    page.tsx        # Public landing page
    layout.tsx      # Root layout
  components/ui/    # Radix-based UI primitives
  lib/
    supabase/       # Browser, server, middleware clients
    ai/             # OpenAI generation logic + mock
  hooks/            # React hooks
  types/            # TypeScript types (wizard inputs, project rows)
  middleware.ts     # Supabase session refresh + route protection
supabase/           # DB migrations/schema
scripts/            # Test/generation scripts
```

## Environment Variables Required

All set as Replit secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Replit Migration Notes

- Upgraded from Next.js 14.2.5 → 15.2.9 (14.x had a SIGBUS crash in Replit's process environment due to mmap issues in the dev server worker)
- Dev/start scripts use `-p 5000 -H 0.0.0.0` for Replit's preview pane
- `allowedDevOrigins` and `serverActions.allowedOrigins` set to `*.replit.dev` for proxied iframes

## Running

The app starts automatically via the "Start application" workflow (`npm run dev`).
