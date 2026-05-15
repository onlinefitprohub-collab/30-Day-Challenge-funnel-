-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002: Align subscription_status values to new model
-- Run AFTER migration 001
-- Old values: 'free' → 'none', 'pro'/'annual' → 'active'
-- New values: 'none' | 'active' | 'manual'
-- ─────────────────────────────────────────────────────────────────────────────

-- Update existing rows to new status values
UPDATE user_settings SET subscription_status = 'none',   subscription_tier = 'none'   WHERE subscription_status IN ('free', '');
UPDATE user_settings SET subscription_status = 'active', subscription_tier = 'active' WHERE subscription_status IN ('pro', 'annual');

-- Change column default from 'free' to 'none'
ALTER TABLE user_settings
  ALTER COLUMN subscription_status SET DEFAULT 'none',
  ALTER COLUMN subscription_tier   SET DEFAULT 'none';
