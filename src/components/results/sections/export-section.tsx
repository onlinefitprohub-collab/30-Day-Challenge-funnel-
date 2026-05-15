"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle, ExternalLink, Settings } from "lucide-react";
import Link from "next/link";
import { generateMarkdown } from "@/lib/export/generate-markdown";
import type { GeneratedFunnelAssets } from "@/types/generation";

interface Props {
  data: GeneratedFunnelAssets;
  projectId: string;
  projectName: string;
  notionConnected: boolean;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportSection({ data, projectId, projectName, notionConnected }: Props) {
  const [notionState, setNotionState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notionUrl, setNotionUrl]     = useState<string>("");
  const [notionError, setNotionError] = useState<string>("");

  function downloadMarkdown() {
    const md = generateMarkdown(data, projectName);
    const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    downloadFile(md, `${slug}-funnel-copy.md`, "text/markdown");
  }

  async function exportToNotion() {
    setNotionState("loading");
    setNotionError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/export/notion`, { method: "POST" });
      const d   = await res.json() as { url?: string; error?: string };
      if (!res.ok) { setNotionError(d.error ?? "Export failed"); setNotionState("error"); return; }
      setNotionUrl(d.url ?? "");
      setNotionState("success");
    } catch (e) {
      setNotionError(e instanceof Error ? e.message : "Network error");
      setNotionState("error");
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Markdown download ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
            <Download className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Download all copy as Markdown</p>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              One file containing every piece of copy — landing page, emails, SMS, ads, VSL script, and more.
              Opens natively in Notion (File → Import) and pastes cleanly into Google Docs.
            </p>
            <button
              onClick={downloadMarkdown}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              Download .md file
            </button>
          </div>
        </div>
      </div>

      {/* ── Notion direct export ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Export directly to Notion</p>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              Creates a new page in your connected Notion workspace with all copy formatted and ready to edit.
            </p>

            {!notionConnected ? (
              <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
                <p className="text-xs text-orange-800 font-medium mb-2">Connect Notion first to enable direct export</p>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a56db] hover:underline"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Add Notion API key in Account Settings
                </Link>
              </div>
            ) : notionState === "idle" ? (
              <button
                onClick={exportToNotion}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z"/>
                </svg>
                Export to Notion
              </button>
            ) : notionState === "loading" ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Notion page…
              </div>
            ) : notionState === "success" ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Exported successfully!
                </div>
                {notionUrl && (
                  <a
                    href={notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db] hover:underline"
                  >
                    Open in Notion <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setNotionState("idle")}
                  className="block text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Export again
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{notionError}</span>
                </div>
                <button
                  onClick={() => setNotionState("idle")}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Google Docs tip ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Google Docs</p>
        <p className="text-xs text-blue-800 leading-relaxed">
          Download the .md file above, then in Google Docs go to <strong>File → Open → Upload</strong> and select the file.
          Google Docs automatically converts Markdown headings and formatting.
          Alternatively paste the content directly — headings, bullets, and bold text all render correctly.
        </p>
      </div>

    </div>
  );
}
