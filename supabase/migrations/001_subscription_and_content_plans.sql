-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 001: Subscription columns + monthly_content_plans table
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add Stripe / subscription columns to user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS stripe_customer_id      TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status     TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_tier       TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;

-- 2. Create monthly_content_plans table
CREATE TABLE IF NOT EXISTS monthly_content_plans (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID        REFERENCES projects(id) ON DELETE SET NULL,
  month      TEXT        NOT NULL,
  plan       JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE monthly_content_plans ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own content plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'monthly_content_plans'
      AND policyname = 'Users own their content plans'
  ) THEN
    CREATE POLICY "Users own their content plans"
      ON monthly_content_plans
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS monthly_content_plans_user_id_idx
  ON monthly_content_plans(user_id);
