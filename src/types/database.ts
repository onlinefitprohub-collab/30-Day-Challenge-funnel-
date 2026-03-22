export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          status: "draft" | "generating" | "complete" | "error";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          status?: "draft" | "generating" | "complete" | "error";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          status?: "draft" | "generating" | "complete" | "error";
          updated_at?: string;
        };
      };
      project_inputs: {
        Row: {
          id: string;
          project_id: string;
          inputs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          inputs: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          inputs?: Json;
          updated_at?: string;
        };
      };
      project_outputs: {
        Row: {
          id: string;
          project_id: string;
          generation_run_id: string;
          outputs: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          generation_run_id: string;
          outputs: Json;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      generation_runs: {
        Row: {
          id: string;
          project_id: string;
          status: "pending" | "running" | "complete" | "error";
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          status?: "pending" | "running" | "complete" | "error";
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          status?: "pending" | "running" | "complete" | "error";
          error_message?: string | null;
          completed_at?: string | null;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          hl_api_key: string | null;
          hl_location_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          hl_api_key?: string | null;
          hl_location_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          hl_api_key?: string | null;
          hl_location_id?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
