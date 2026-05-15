-- Funnel performance tracker — per-project stats log
CREATE TABLE IF NOT EXISTS project_stats (
  project_id   UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL,
  opt_in_rate  NUMERIC,          -- percentage, e.g. 32.5
  applications INTEGER,
  bookings     INTEGER,
  revenue      NUMERIC,          -- £/$ amount
  notes        TEXT,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE project_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own project stats"
  ON project_stats
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
