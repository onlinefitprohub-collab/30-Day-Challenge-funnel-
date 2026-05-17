"use client";

import { useState } from "react";
import { Loader2, Check, ExternalLink, AlertCircle, Link2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  notionApiKey: string | null;
  notionPageId: string | null;
}

function extractPageId(input: string): string {
  // Accept full Notion URLs — extract the 32-char hex ID
  // e.g. https://www.notion.so/My-Page-abc123def456...  or just the ID itself
  const clean = input.trim();
  const match = clean.match(/([a-f0-9]{32})/i) ?? clean.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  return match ? match[1].replace(/-/g, "") : clean;
}

export function NotionSettingsCard({ notionApiKey, notionPageId }: Props) {
  const [apiKey, setApiKey]     = useState(notionApiKey ?? "");
  const [rawPage, setRawPage]   = useState(notionPageId ?? "");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(!!notionApiKey && !!notionPageId);
  const [pageUrl, setPageUrl]   = useState<string>("");

  const isConnected = saved;
  const tokenValid  = apiKey.startsWith("secret_") || apiKey === "";
  const pageInput   = rawPage.trim();

  async function save() {
    const pageId = extractPageId(pageInput);

    if (!apiKey.startsWith("secret_")) {
      toast({ title: "Invalid token", description: "Integration token must start with secret_", variant: "destructive" });
      return;
    }
    if (pageId.length < 32) {
      toast({ title: "Invalid page ID", description: "Paste the full Notion page URL or the 32-character page ID", variant: "destructive" });
      return;
    }

    setSaving(true);
    const res = await fetch("/api/account/notion", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ notion_api_key: apiKey.trim(), notion_page_id: pageId }),
    });
    setSaving(false);

    const d = await res.json().catch(() => ({})) as { ok?: boolean; error?: string; pageUrl?: string };

    if (!res.ok) {
      toast({ title: "Connection failed", description: d.error ?? "Could not verify Notion credentials", variant: "destructive" });
      return;
    }

    setSaved(true);
    if (d.pageUrl) setPageUrl(d.pageUrl);
    toast({ title: "Notion connected!", description: "Your workspace is ready to receive exports." });
  }

  function disconnect() {
    setSaved(false);
    setApiKey("");
    setRawPage("");
    setPageUrl("");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
          </svg>
          <CardTitle className="text-base">Notion Export</CardTitle>
          {isConnected && (
            <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              Connected
            </span>
          )}
        </div>
        <CardDescription>
          Export all funnel copy directly to a Notion page — formatted and ready to edit.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {isConnected ? (
          /* ── Connected state ──────────────────────────────────────── */
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              Notion workspace connected
            </div>
            {pageUrl && (
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:underline"
              >
                Open target page in Notion <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <button
              onClick={disconnect}
              className="text-xs text-green-600 underline hover:text-green-800"
            >
              Change credentials
            </button>
          </div>
        ) : (
          /* ── Setup form ───────────────────────────────────────────── */
          <>
            {/* Step-by-step instructions */}
            <ol className="space-y-2 text-xs text-gray-500 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="shrink-0 flex h-4 w-4 mt-0.5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">1</span>
                <span>
                  Go to{" "}
                  <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="font-medium text-[#1a56db] hover:underline inline-flex items-center gap-0.5">
                    notion.so/my-integrations <ExternalLink className="h-3 w-3" />
                  </a>
                  {" "}and create a new <strong>Internal integration</strong>
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="shrink-0 flex h-4 w-4 mt-0.5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">2</span>
                <span>Copy the <strong>Internal Integration Token</strong> (starts with <code className="bg-gray-100 px-1 rounded">secret_</code>)</span>
              </li>
              <li className="flex gap-2.5">
                <span className="shrink-0 flex h-4 w-4 mt-0.5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">3</span>
                <span>Open the Notion page to receive exports, click <strong>⋯ → Connections → Add connection</strong>, then select your integration</span>
              </li>
              <li className="flex gap-2.5">
                <span className="shrink-0 flex h-4 w-4 mt-0.5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">4</span>
                <span>Copy that page&apos;s URL and paste it below — we&apos;ll extract the ID automatically</span>
              </li>
            </ol>

            <div className="space-y-3">
              {/* Integration token */}
              <div className="space-y-1.5">
                <Label htmlFor="notion-key">Integration Token</Label>
                <Input
                  id="notion-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className={apiKey && !tokenValid ? "border-red-300 focus:ring-red-300" : ""}
                />
                {apiKey && !tokenValid && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    Token must start with <code className="bg-red-50 px-0.5 rounded">secret_</code>
                  </p>
                )}
              </div>

              {/* Page URL or ID */}
              <div className="space-y-1.5">
                <Label htmlFor="notion-page">
                  Parent Page
                  <span className="ml-1.5 text-[11px] font-normal text-gray-400">— paste the full URL or just the ID</span>
                </Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    id="notion-page"
                    type="text"
                    value={rawPage}
                    onChange={(e) => setRawPage(e.target.value)}
                    placeholder="https://notion.so/My-Page-abc123…  or  abc123def456…"
                    className="pl-8"
                  />
                </div>
                {rawPage.includes("notion.so") && (
                  <p className="flex items-center gap-1 text-xs text-emerald-600">
                    <Check className="h-3 w-3" />
                    ID extracted: <code className="bg-emerald-50 px-1 rounded font-mono">{extractPageId(rawPage)}</code>
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={save}
              disabled={saving || !apiKey || !rawPage}
              variant="default"
              size="sm"
              className="w-full"
            >
              {saving ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying &amp; saving…</>
              ) : (
                "Connect Notion"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
