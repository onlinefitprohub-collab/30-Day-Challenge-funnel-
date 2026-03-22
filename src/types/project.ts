// Typed row interfaces to avoid Supabase generic issues in MVP
export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  status: "draft" | "generating" | "complete" | "error";
  created_at: string;
  updated_at: string;
}

export interface ProjectInputRow {
  id: string;
  project_id: string;
  inputs: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectOutputRow {
  id: string;
  project_id: string;
  generation_run_id: string;
  outputs: Record<string, unknown>;
  created_at: string;
}

export interface GenerationRunRow {
  id: string;
  project_id: string;
  status: "pending" | "running" | "complete" | "error";
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface UserSettingsRow {
  user_id: string;
  hl_api_key: string | null;
  hl_location_id: string | null;
  created_at: string;
  updated_at: string;
}
