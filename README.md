# Challenge Funnel in a Box

> Generate a complete, launch-ready 30-day fitness challenge funnel in minutes — not days.

Built for personal trainers and online fitness coaches who want to launch a high-converting challenge funnel without needing to know copywriting, funnel strategy, or automation setup.

---

## What it does

Coaches answer a short 6-step wizard about their business, offer, and audience. The app uses AI (OpenAI GPT-4o) to generate a complete funnel package:

- Landing page headlines, subheadline, bullets, and CTA copy
- Opt-in form suggestions (fields, intro text, button copy)
- Thank-you page copy
- Booking page copy
- 5-email nurture sequence (subject + body)
- 5-SMS follow-up sequence
- Facebook/Instagram ad copy (hooks, primary text, headlines, descriptions)
- Creative prompts for static images, video, and UGC ads
- Campaign naming and UTM structure
- HighLevel paste guide — all content mapped to exact HighLevel fields

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | Radix UI primitives |
| Auth + Database | Supabase |
| AI | OpenAI GPT-4o |
| Validation | Zod |
| Forms | React Hook Form |

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key with GPT-4o access

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd challenge-funnel-in-a-box
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Your Supabase service role key (server-only) |
| `OPENAI_API_KEY` | Yes* | OpenAI API key. If absent, mock data is used instead. |
| `NEXT_PUBLIC_APP_URL` | No | Base URL of your app (e.g. `https://yourapp.com`) |

### 3. Supabase database setup

In your Supabase project, open the SQL editor and run:

```sql
-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'generating', 'complete', 'error')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Wizard inputs (one row per project, upserted on each step)
create table public.project_inputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null unique,
  inputs jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- AI generation runs
create table public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'complete', 'error')),
  error_message text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- Generated outputs
create table public.project_outputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  generation_run_id uuid references public.generation_runs(id) on delete cascade not null,
  outputs jsonb not null,
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.projects enable row level security;
alter table public.project_inputs enable row level security;
alter table public.generation_runs enable row level security;
alter table public.project_outputs enable row level security;

-- Policies: users can only see their own data
create policy "Users see own projects" on public.projects
  for all using (auth.uid() = user_id);

create policy "Users see own inputs" on public.project_inputs
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "Users see own generation runs" on public.generation_runs
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

create policy "Users see own outputs" on public.project_outputs
  for all using (
    exists (select 1 from public.projects where id = project_id and user_id = auth.uid())
  );

-- Auto-update updated_at on projects
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on public.projects
  for each row execute function update_updated_at();

create trigger project_inputs_updated_at before update on public.project_inputs
  for each row execute function update_updated_at();
```

### 4. Supabase auth setup

In your Supabase dashboard:
- Go to **Authentication → Providers** and ensure **Email** is enabled
- Go to **Authentication → URL Configuration** and set your **Site URL** to your app's URL (e.g. `http://localhost:3000` for local dev)
- Add `http://localhost:3000/auth/callback` to the **Redirect URLs** list

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running in production

### Deploy to Vercel

1. Push your repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example` in the Vercel project settings
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
5. Update your Supabase **Site URL** and **Redirect URLs** to match your Vercel domain
6. Deploy

### Deploy to Replit

The app is already configured for Replit:
- Dev server runs on port 5000 via `npm run dev`
- Add environment variables as Replit Secrets
- The "Start application" workflow handles startup

---

## AI fallback / mock mode

If `OPENAI_API_KEY` is not set (or is over quota), the app automatically falls back to **mock mode**. Mock outputs are personalised using the wizard inputs — they follow the same structure as real AI output and are useful for demos or development.

A banner is shown on the results page when mock mode is active.

---

## Project structure

```
src/
  app/
    (auth)/           Login, signup pages
    (dashboard)/      Protected dashboard + project pages
    api/generate/     POST endpoint — AI funnel generation
    api/auth/login/   POST route handler for Supabase login
    page.tsx          Public landing page
    layout.tsx        Root layout + metadata
    error.tsx         Global error boundary
    not-found.tsx     404 page
    robots.ts         SEO robots file
  components/
    ui/               Radix-based UI primitives
    dashboard/        Nav, project cards, empty state
    wizard/           6-step wizard shell + step components
    projects/         Generating view (polling + states)
    results/          Results shell + 11 section components
  lib/
    supabase/         Browser, server, middleware Supabase clients
    ai/               OpenAI client, generation orchestrator, mock, prompts
  hooks/              use-toast
  types/              TypeScript types for DB, wizard, generation
  middleware.ts       Supabase session refresh + route protection
```

---

## What's next — v2 ideas

These are commercially relevant features that would make sense after the MVP:

1. **Project duplication** — Clone an existing project to quickly create a variant for a different audience or challenge type
2. **Section-level regeneration** — Regenerate just one section (e.g. ad copy) without re-running the full wizard
3. **Saved brand profiles** — Store tone of voice, target audience, and business details so repeat users don't re-enter them
4. **Challenge type presets** — Pre-filled wizard defaults for common challenge types (weight loss, strength, nutrition, mindset)
5. **PDF / Notion export** — Export the full funnel package as a formatted PDF or push it to a Notion workspace
6. **HighLevel one-click import** — Use the HighLevel API to create email templates and funnel structure directly in the user's HL account
7. **Billing (Stripe)** — Usage-based or subscription pricing; free tier (3 projects), pro tier (unlimited + priority generation)
8. **Team access** — Allow a small team (e.g. VA + coach) to share a project dashboard under one account
