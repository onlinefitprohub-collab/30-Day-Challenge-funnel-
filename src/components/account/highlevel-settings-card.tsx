"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Layers, CheckCircle2, XCircle, Eye, EyeOff, Loader2,
  Trash2, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const SETUP_SQL = `-- Run once in your Supabase SQL Editor
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
create policy "Users can view own settings"   on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings" on public.user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings" on public.user_settings for update using (auth.uid() = user_id);
create policy "Users can delete own settings" on public.user_settings for delete using (auth.uid() = user_id);`;

interface Props {
  isConnected: boolean;
  maskedKey: string | null;
  locationId: string | null;
  tableReady: boolean;
}

export function HighLevelSettingsCard({ isConnected, maskedKey, locationId, tableReady }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [apiKey, setApiKey] = useState("");
  const [locId, setLocId] = useState(locationId ?? "");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!isConnected);
  const [error, setError] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!apiKey.trim() || !locId.trim()) {
      setError("Both fields are required.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/user-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hlApiKey: apiKey.trim(), hlLocationId: locId.trim() }),
      });

      if (res.ok) {
        toast({ title: "HighLevel connected!", description: "Your credentials have been saved." });
        setApiKey("");
        setIsEditing(false);
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        const msg = data.error ?? "Failed to save credentials.";
        if (msg.includes("user_settings") || msg.includes("relation") || msg.includes("schema cache")) {
          setError("Database table not found. Please run the setup SQL below, then try again.");
        } else {
          setError(msg);
        }
      }
    });
  }

  async function handleDisconnect() {
    startTransition(async () => {
      const res = await fetch("/api/user-settings", { method: "DELETE" });
      if (res.ok) {
        toast({ title: "HighLevel disconnected", description: "Your credentials have been removed." });
        setLocId("");
        setApiKey("");
        setIsEditing(true);
        router.refresh();
      } else {
        toast({ title: "Error", description: "Could not remove credentials.", variant: "destructive" });
      }
    });
  }

  async function copySql() {
    await navigator.clipboard.writeText(SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#1a56db]" />
            <CardTitle className="text-base">HighLevel Integration</CardTitle>
          </div>
          {!tableReady ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              Setup required
            </Badge>
          ) : isConnected ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Not connected
            </Badge>
          )}
        </div>
        <CardDescription>
          Connect your HighLevel account to import your funnel content in one click.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* One-time database setup notice */}
        {!tableReady && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">One-time database setup needed</p>
                <p className="mt-0.5 text-xs text-amber-700">
                  Run the SQL below in your{" "}
                  <a
                    href="https://supabase.com/dashboard/project/rzobxurvnwohkarybjel/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    Supabase SQL Editor
                  </a>
                  , then refresh this page.
                </p>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowSql((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900"
              >
                {showSql ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {showSql ? "Hide SQL" : "Show setup SQL"}
              </button>
              {showSql && (
                <div className="mt-2">
                  <pre className="overflow-x-auto rounded-lg bg-amber-900 p-3 text-[11px] leading-relaxed text-amber-50 whitespace-pre-wrap break-all">
                    {SETUP_SQL}
                  </pre>
                  <button
                    type="button"
                    onClick={copySql}
                    className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-50 transition-colors"
                  >
                    {sqlCopied ? "Copied!" : "Copy SQL"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connected state — show credentials summary */}
        {tableReady && isConnected && !isEditing && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">API Key</span>
              <span className="font-mono text-gray-700">{maskedKey}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Location ID</span>
              <span className="font-mono text-gray-700">{locationId}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
              >
                Update credentials
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDisconnect}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Disconnect
              </Button>
            </div>
          </div>
        )}

        {/* Connect / update form */}
        {tableReady && isEditing && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="hl-api-key">
                Private API Key
              </label>
              <div className="relative">
                <input
                  id="hl-api-key"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="hlp_xxxxxxxxxxxx"
                  autoComplete="off"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1a56db] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowKey((v) => !v)}
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Found in HighLevel → Settings → Business Profile → API Key
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="hl-location-id">
                Location ID
              </label>
              <input
                id="hl-location-id"
                type="text"
                value={locId}
                onChange={(e) => setLocId(e.target.value)}
                placeholder="xxxxxxxxxxxxxxxxxxx"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1a56db] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20"
              />
              <p className="text-xs text-gray-400">
                Found in HighLevel → Settings → Business Profile → Location ID
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="bg-[#1a56db] hover:bg-[#1245b5] text-white"
              >
                {isPending ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
                ) : isConnected ? (
                  "Update"
                ) : (
                  "Connect HighLevel"
                )}
              </Button>
              {isConnected && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsEditing(false); setError(null); }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
