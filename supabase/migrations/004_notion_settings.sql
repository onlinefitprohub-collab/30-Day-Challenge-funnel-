-- Notion export integration — API key and parent page ID per user
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS notion_api_key  TEXT,
  ADD COLUMN IF NOT EXISTS notion_page_id  TEXT;
