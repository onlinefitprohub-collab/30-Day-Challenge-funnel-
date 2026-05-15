"use client";

import { useState } from "react";
import { Loader2, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  notionApiKey: string | null;
  notionPageId: string | null;
}

export function NotionSettingsCard({ notionApiKey, notionPageId }: Props) {
  const [apiKey, setApiKey]   = useState(notionApiKey ?? "");
  const [pageId, setPageId]   = useState(notionPageId ?? "");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/account/notion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notion_api_key: apiKey.trim() || null, notion_page_id: pageId.trim() || null }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast({ title: "Notion settings saved" });
    } else {
      const d = await res.json().catch(() => ({})) as { error?: string };
      toast({ title: "Save failed", description: d.error, variant: "destructive" });
    }
  }

  const isConnected = Boolean(notionApiKey && notionPageId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {/* Notion logo */}
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
          Export all funnel copy directly to a Notion page. Create an internal integration at{" "}
          <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-[#1a56db] hover:underline inline-flex items-center gap-0.5">
            notion.so/my-integrations <ExternalLink className="h-3 w-3" />
          </a>{" "}
          then share a parent page with it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-1 text-xs text-gray-500 leading-relaxed list-decimal pl-4">
          <li>Go to <strong>notion.so/my-integrations</strong> and create a new integration</li>
          <li>Copy the <strong>Internal Integration Token</strong> (starts with <code className="bg-gray-100 px-1 rounded">secret_</code>)</li>
          <li>Open the Notion page where you want exports saved, click <strong>⋯ → Add connections</strong> and select your integration</li>
          <li>Copy the page URL — the Page ID is the 32-character string after the last <code className="bg-gray-100 px-1 rounded">/</code></li>
        </ol>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="notion-key">Integration Token</Label>
            <Input
              id="notion-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notion-page">Parent Page ID</Label>
            <Input
              id="notion-page"
              type="text"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
        </div>

        <Button onClick={save} disabled={saving} variant="default" size="sm">
          {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> :
           saved  ? <><Check   className="h-3.5 w-3.5" /> Saved</> :
           "Save Notion settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
