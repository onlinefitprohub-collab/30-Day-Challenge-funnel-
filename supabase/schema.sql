-- 30-Day Challenge Funnel in a Box - Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'generating', 'complete', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project inputs (wizard answers)
create table if not exists public.project_inputs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade unique,
  inputs jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Generation runs (track each AI generation attempt)
create table if not exists public.generation_runs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'running', 'complete', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Project outputs (the AI-generated content)
create table if not exists public.project_outputs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  generation_run_id uuid not null references public.generation_runs(id) on delete cascade,
  outputs jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists project_inputs_project_id_idx on public.project_inputs(project_id);
create index if not exists generation_runs_project_id_idx on public.generation_runs(project_id);
create index if not exists project_outputs_project_id_idx on public.project_outputs(project_id);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger project_inputs_updated_at
  before update on public.project_inputs
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.projects enable row level security;
alter table public.project_inputs enable row level security;
alter table public.generation_runs enable row level security;
alter table public.project_outputs enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create policy "Users can view own project inputs"
  on public.project_inputs for select
  using (exists (
    select 1 from public.projects
    where projects.id = project_inputs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can insert own project inputs"
  on public.project_inputs for insert
  with check (exists (
    select 1 from public.projects
    where projects.id = project_inputs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update own project inputs"
  on public.project_inputs for update
  using (exists (
    select 1 from public.projects
    where projects.id = project_inputs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can view own generation runs"
  on public.generation_runs for select
  using (exists (
    select 1 from public.projects
    where projects.id = generation_runs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can insert own generation runs"
  on public.generation_runs for insert
  with check (exists (
    select 1 from public.projects
    where projects.id = generation_runs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update own generation runs"
  on public.generation_runs for update
  using (exists (
    select 1 from public.projects
    where projects.id = generation_runs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can view own project outputs"
  on public.project_outputs for select
  using (exists (
    select 1 from public.projects
    where projects.id = project_outputs.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can insert own project outputs"
  on public.project_outputs for insert
  with check (exists (
    select 1 from public.projects
    where projects.id = project_outputs.project_id
    and projects.user_id = auth.uid()
  ));

-- Project folders (admin-created organisational folders per user)
create table if not exists public.project_folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists project_folders_user_id_idx on public.project_folders(user_id);

alter table public.project_folders enable row level security;

create policy "Users can view own folders"
  on public.project_folders for select
  using (auth.uid() = user_id);

-- User settings (one row per user — stores integration credentials)
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  hl_api_key text,
  hl_location_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.handle_updated_at();

alter table public.user_settings enable row level security;

create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

create policy "Users can delete own settings"
  on public.user_settings for delete
  using (auth.uid() = user_id);
