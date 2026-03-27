"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Microscope, Download, Copy, Check,
  ChevronDown, ChevronRight, RefreshCw, AlertTriangle, Trash2, Clipboard, FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── helpers ──────────────────────────────────────────────────────────────── */

function extractElementTypes(obj: unknown, counts: Record<string, number> = {}): Record<string, number> {
  if (!obj || typeof obj !== "object") return counts;
  if (Array.isArray(obj)) { obj.forEach(v => extractElementTypes(v, counts)); return counts; }
  const o = obj as Record<string, unknown>;
  const meta = o.metaData as Record<string, unknown> | undefined;
  if (meta) {
    const key = (meta.tagName ?? meta.type) as string | undefined;
    if (key) counts[key] = (counts[key] ?? 0) + 1;
  }
  Object.values(o).forEach(v => extractElementTypes(v, counts));
  return counts;
}

function countTopLevel(data: Record<string, unknown>, key: string): number | null {
  const v = data[key];
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.length;
  if (typeof v === "object") return Object.keys(v).length;
  return null;
}

/* ── JsonBlock ────────────────────────────────────────────────────────────── */

function JsonBlock({ data, title }: { data: unknown; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);
  const charCount = json.length;

  async function copyJson() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-3 py-2">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          {title}
          <span className="ml-1 text-xs text-gray-400">({charCount.toLocaleString()} chars)</span>
        </button>
        <button
          onClick={copyJson}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied!" : "Copy JSON"}
        </button>
      </div>
      {open && (
        <pre className="border-t border-gray-200 bg-gray-900 p-4 text-[11px] leading-relaxed text-green-400 overflow-auto max-h-96">
          {json}
        </pre>
      )}
    </div>
  );
}

/* ── TypeBadge ────────────────────────────────────────────────────────────── */

function TypeBadge({ label, count, variant }: { label: string; count?: number; variant: "purple" | "blue" | "green" | "red" | "amber" }) {
  const cls = {
    purple: "bg-purple-100 text-purple-800",
    blue:   "bg-blue-100 text-blue-800",
    green:  "bg-green-100 text-green-800",
    red:    "bg-red-100 text-red-700",
    amber:  "bg-amber-100 text-amber-700",
  }[variant];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${cls}`}>
      {label}{count !== undefined && ` (${count})`}
    </span>
  );
}

/* ── types ────────────────────────────────────────────────────────────────── */

interface CapturedGHLPage {
  builderId:  string;
  funnelId:   string;
  stepId:     string;
  locationId: string;
  pageName:   string;
  pageData:   Record<string, unknown>;
  dataSource: "firebase" | "metadata" | "url-parse" | "url-parse-nuxt3" | "ai" | "unknown";
  warning?:   string | null;
  capturedAt: number;
}

const AI_PAGES = [
  { id: "landing",  label: "Landing Page"   },
  { id: "optin",    label: "Opt-In Form"    },
  { id: "thankyou", label: "Thank You Page" },
  { id: "booking",  label: "Booking Page"   },
] as const;

type AiPageId = (typeof AI_PAGES)[number]["id"];

/* ── constants ────────────────────────────────────────────────────────────── */

const CURRENT_EXT_VERSION = "2.29.0";

function semverOlder(a: string, b: string): boolean {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return true;
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return false;
  }
  return false;
}

/* ── component ────────────────────────────────────────────────────────────── */

export function GhlInspectorSection({ projectId }: { projectId: string }) {
  const [captured,    setCaptured]    = useState<CapturedGHLPage | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [loadError,   setLoadError]   = useState<string | null>(null);
  const [extPresent,  setExtPresent]  = useState<boolean | null>(null);
  const [extVersion,  setExtVersion]  = useState<string | null>(null);

  const [aiPage,    setAiPage]    = useState<AiPageId>("landing");
  const [aiData,    setAiData]    = useState<Record<string, unknown> | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [urlInput,    setUrlInput]    = useState("");
  const [urlLoading,  setUrlLoading]  = useState(false);
  const [urlError,    setUrlError]    = useState<string | null>(null);

  const [urlCloneSending, setUrlCloneSending] = useState(false);
  const [urlCloneQueued,  setUrlCloneQueued]  = useState(false);
  const [urlCloneError,   setUrlCloneError]   = useState<string | null>(null);

  /* Detect extension on mount */
  useEffect(() => {
    const timeout = setTimeout(() => { if (extPresent === null) setExtPresent(false); }, 1500);
    function onMsg(evt: MessageEvent) {
      if (evt.source !== window) return;
      if (evt.data?.source === "cf-ext") {
        setExtPresent(true);
        clearTimeout(timeout);
        if (evt.data?.version) setExtVersion(evt.data.version as string);
      }
    }
    window.addEventListener("message", onMsg);
    window.postMessage({ source: "cf-app", type: "CF_PING" }, "*");
    return () => { window.removeEventListener("message", onMsg); clearTimeout(timeout); };
  }, [extPresent]);

  /* Load captured GHL pageData from extension */
  const loadCaptured = useCallback(() => {
    setLoading(true);
    setLoadError(null);

    const timeout = setTimeout(() => {
      window.removeEventListener("message", onMsg);
      setLoading(false);
      setLoadError(
        "Extension not responding. Make sure the latest Challenge Funnel extension is installed, then reload this page."
      );
      setExtPresent(false);
    }, 4000);

    function onMsg(evt: MessageEvent) {
      if (evt.source !== window) return;
      if (evt.data?.source !== "cf-ext" || evt.data?.type !== "CF_CAPTURED_GHL_DATA") return;
      clearTimeout(timeout);
      window.removeEventListener("message", onMsg);
      const payload = evt.data.payload as { ok: boolean; capturedGHLPage: CapturedGHLPage | null };
      setExtPresent(true); // any response proves the extension is installed and running
      if (payload?.capturedGHLPage) {
        setCaptured(payload.capturedGHLPage);
      } else {
        setLoadError(
          'No GHL page captured yet. Open any GHL funnel page in the Page Builder, click the extension icon, then click "Copy Current GHL Page". Then come back here and click Load again.'
        );
      }
      setLoading(false);
    }

    window.addEventListener("message", onMsg);
    window.postMessage({ source: "cf-app", type: "CF_GET_CAPTURED_GHL" }, "*");
  }, []);

  /* Clear captured data */
  function clearCaptured() {
    setCaptured(null);
    setLoadError(null);
    window.postMessage({ source: "cf-app", type: "CF_CLEAR_CAPTURED_GHL" }, "*");
  }

  /* Fetch element tree from a public GHL page URL (server-side, no extension needed) */
  const fetchFromUrl = useCallback(async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setUrlLoading(true);
    setUrlError(null);
    setUrlCloneQueued(false);
    setUrlCloneError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(
        `/api/highlevel/fetch-public-page?url=${encodeURIComponent(trimmed)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      const payload = await res.json() as {
        ok: boolean;
        elementTree?: Record<string, unknown>;
        pageName?: string;
        funnelId?: string;
        stepId?: string;
        locationId?: string;
        source?: string;
        error?: string;
      };

      if (payload?.ok && payload.elementTree) {
        const capturedPage: CapturedGHLPage = {
          builderId:  "",
          funnelId:   payload.funnelId   ?? "",
          stepId:     payload.stepId     ?? "",
          locationId: payload.locationId ?? "",
          pageName:   payload.pageName || new URL(trimmed).pathname,
          pageData:   payload.elementTree,
          dataSource: (payload.source ?? "url-parse") as CapturedGHLPage["dataSource"],
          warning:    null,
          capturedAt: Date.now(),
        };
        setCaptured(capturedPage);
        setLoadError(null);
        window.postMessage(
          { source: "cf-app", type: "CF_PERSIST_CAPTURED_GHL", payload: capturedPage },
          "*"
        );
      } else {
        setUrlError(payload?.error ?? "Could not extract page data from that URL.");
      }
    } catch (err) {
      clearTimeout(timeout);
      const msg = err instanceof Error && err.name === "AbortError"
        ? "Request timed out. The page took too long to respond."
        : `Unexpected error: ${String(err).slice(0, 100)}`;
      setUrlError(msg);
    } finally {
      setUrlLoading(false);
    }
  }, [urlInput]);

  /* Queue captured URL page for paste via extension FAB */
  const copyToGhl = useCallback(() => {
    if (!captured?.pageData) return;
    setUrlCloneSending(true);
    setUrlCloneQueued(false);
    setUrlCloneError(null);

    const requestId = Math.random().toString(36).slice(2);
    const timeout = setTimeout(() => {
      window.removeEventListener("message", onAck);
      setUrlCloneSending(false);
      setUrlCloneError("Extension did not respond. Make sure the CF extension is installed and this page is allowed.");
    }, 4000);

    function onAck(evt: MessageEvent) {
      if (evt.source !== window) return;
      if (evt.data?.source !== "cf-ext" || evt.data?.type !== "CF_URL_CLONE_ACK") return;
      if (evt.data?.payload?.requestId !== requestId) return;
      clearTimeout(timeout);
      window.removeEventListener("message", onAck);
      setUrlCloneSending(false);
      setUrlCloneQueued(true);
    }

    window.addEventListener("message", onAck);
    window.postMessage({
      source:  "cf-app",
      type:    "CF_SAVE_URL_PAGE",
      payload: {
        requestId,
        pageData:   captured.pageData,
        pageName:   captured.pageName,
        funnelId:   captured.funnelId,
        locationId: captured.locationId,
      },
    }, "*");
  }, [captured]);

  /* Load AI pageData for comparison */
  const loadAiData = useCallback(async (page: string) => {
    setAiLoading(true);
    try {
      const res = await fetch(
        `/api/highlevel/page-data?projectId=${encodeURIComponent(projectId)}&page=${encodeURIComponent(page)}`
      );
      if (res.ok) {
        const json = await res.json() as { pageData?: Record<string, unknown> };
        setAiData(json.pageData ?? null);
      } else {
        setAiData(null);
      }
    } catch {
      setAiData(null);
    } finally {
      setAiLoading(false);
    }
  }, [projectId]);

  useEffect(() => { loadAiData(aiPage); }, [aiPage, loadAiData]);

  /* Load the current AI page as the "captured" slot for injection testing */
  const loadAiAsCapture = useCallback(() => {
    if (!aiData) return;
    const label = AI_PAGES.find(p => p.id === aiPage)?.label ?? aiPage;
    setCaptured({
      builderId:  "",
      funnelId:   "",
      stepId:     "",
      locationId: "",
      pageName:   `AI: ${label}`,
      pageData:   aiData,
      dataSource: "url-parse",
      warning:    "This is AI-generated page data loaded for injection testing — not a real captured GHL page.",
      capturedAt: Date.now(),
    });
    setUrlCloneQueued(false);
    setUrlCloneError(null);
  }, [aiData, aiPage]);

  /* Derived stats */
  const ghlTypes  = captured?.pageData ? extractElementTypes(captured.pageData) : null;
  const aiTypes   = aiData             ? extractElementTypes(aiData)             : null;

  const ghlKeys = captured?.pageData ? Object.keys(captured.pageData) : null;
  const aiKeys  = aiData             ? Object.keys(aiData)            : null;

  const STRUCT_KEYS = ["sections", "rows", "columns", "elements"] as const;

  const allGhlTypes = ghlTypes ? Object.keys(ghlTypes) : [];
  const allAiTypes  = aiTypes  ? Object.keys(aiTypes)  : [];
  const onlyInGHL   = allGhlTypes.filter(t => !allAiTypes.includes(t));
  const onlyInAI    = allAiTypes.filter(t => !allGhlTypes.includes(t));
  const inBoth      = allGhlTypes.filter(t => allAiTypes.includes(t));
  const hasMismatch = onlyInGHL.length > 0 || onlyInAI.length > 0;

  return (
    <div className="space-y-5">

      {/* ── Header card ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white">
            <Microscope className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">GHL Schema Inspector</p>
            <p className="text-xs text-gray-400">
              Capture a real GHL page's element structure and compare it against our AI-generated pageData to find schema mismatches
            </p>
          </div>
          {extPresent === true  && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">Extension active</span>}
          {extPresent === false && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">Extension not detected — re-download &amp; install</span>}
          {extPresent === true && extVersion && semverOlder(extVersion, CURRENT_EXT_VERSION) && (
            <a
              href="/api/highlevel/extension-download"
              className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-700 hover:bg-amber-100 transition-colors"
            >
              Extension update available — re-download ↓
            </a>
          )}
          {extPresent === true && extVersion && !semverOlder(extVersion, CURRENT_EXT_VERSION) && (
            <span className="rounded-full bg-gray-50 border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              v{extVersion}
            </span>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* How to use */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
            <p className="font-semibold mb-1">How this works</p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
              <li>Open any GHL funnel page in the <strong>Page Builder</strong> (it must be an existing, published page)</li>
              <li>Click the extension icon → <strong>Copy Current GHL Page</strong></li>
              <li>Return here and click <strong>Load Captured GHL Page</strong> below</li>
              <li>The inspector shows you the real element schema — compare it with what our AI generates</li>
            </ol>
          </div>

          {/* Load / clear controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={loadCaptured} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading
                ? <><RefreshCw className="h-4 w-4 animate-spin mr-1.5" />Loading…</>
                : <><Download className="h-4 w-4 mr-1.5" />Load Captured GHL Page</>
              }
            </Button>
            {captured && (
              <button
                onClick={clearCaptured}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            {captured && (
              <span className="text-xs text-gray-500">
                Captured {new Date(captured.capturedAt).toLocaleTimeString()} ·{" "}
                {captured.pageName || captured.builderId?.slice(0, 14)}
              </span>
            )}
          </div>

          {loadError && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">{loadError}</p>
            </div>
          )}

          {/* ── URL fetch — works on any published GHL page (no builder required) ── */}
          <div className="border-t border-gray-100 pt-4">
            <p className="mb-1.5 text-xs font-semibold text-gray-700">
              Or fetch from any published GHL page URL
            </p>
            <p className="mb-2 text-[10px] text-gray-400">
              Works on custom domains, GHL-hosted pages, and any published funnel step — no builder tab required
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") fetchFromUrl(); }}
                placeholder="https://yourcustomdomain.com/your-funnel-page"
                disabled={urlLoading}
                className="flex-1 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-200 disabled:opacity-50"
              />
              <Button
                onClick={fetchFromUrl}
                disabled={urlLoading || !urlInput.trim()}
                className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 h-auto"
              >
                {urlLoading
                  ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />Fetching…</>
                  : "Fetch"
                }
              </Button>
            </div>
            {urlError && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">{urlError}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Capture metadata ─────────────────────────────────────────────── */}
      {captured && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-2.5 flex items-center gap-3">
            <p className="text-sm font-semibold text-gray-900 flex-1">Captured GHL Page</p>
            {captured.dataSource === "firebase" && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                ✓ Real element tree (Firebase)
              </span>
            )}
            {captured.dataSource === "metadata" && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                ⚠ Page metadata only
              </span>
            )}
            {(captured.dataSource === "url-parse" || captured.dataSource === "url-parse-nuxt3") && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                ✓ Real element tree (URL fetch)
              </span>
            )}
            {captured.dataSource === "ai" && (
              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                AI-generated page
              </span>
            )}
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([
                ["Page Name",   captured.pageName   || "(builder page)"],
                ["Funnel ID",   captured.funnelId],
                ["Step ID",     captured.stepId],
                ["Location ID", captured.locationId || captured.builderId],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
                  <p className="mt-0.5 break-all font-mono text-xs text-gray-800">{value || "—"}</p>
                </div>
              ))}
            </div>
            {captured.warning && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">{captured.warning}</p>
              </div>
            )}

            {/* Copy to GHL — available whenever we have a real element tree */}
            {(captured.dataSource === "url-parse" || captured.dataSource === "url-parse-nuxt3" || captured.dataSource === "firebase") && (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                <p className="mb-1 text-xs font-semibold text-indigo-900">Paste this page into GHL</p>
                <p className="mb-2.5 text-[10px] text-indigo-700">
                  Queue the captured element tree for injection. Then switch to your GHL page builder tab and click the orange CF button.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {urlCloneQueued ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                      <Check className="h-4 w-4" />
                      Queued! Go to GHL page builder and click the orange CF button.
                    </div>
                  ) : (
                    <Button
                      onClick={copyToGhl}
                      disabled={urlCloneSending || !extPresent}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 h-auto"
                    >
                      {urlCloneSending
                        ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />Sending…</>
                        : <><Clipboard className="h-3.5 w-3.5 mr-1.5" />Copy to GHL</>
                      }
                    </Button>
                  )}
                  {!extPresent && (
                    <span className="text-[10px] text-red-500">Extension not detected — install the CF extension first</span>
                  )}
                </div>
                {urlCloneError && (
                  <p className="mt-2 text-[10px] text-red-600">{urlCloneError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Schema comparison ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center border-b border-gray-100 bg-gray-50 px-5 py-2.5 gap-3">
            <p className="text-sm font-semibold text-gray-900 flex-1">Schema Comparison</p>
            <span className="text-xs text-gray-500">AI page:</span>
            <select
              value={aiPage}
              onChange={e => setAiPage(e.target.value as AiPageId)}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700"
            >
              {AI_PAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <Button
              onClick={loadAiAsCapture}
              disabled={!aiData || aiLoading}
              size="sm"
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
            >
              {aiLoading
                ? <><RefreshCw className="h-3 w-3 animate-spin mr-1" />Loading…</>
                : <><FlaskConical className="h-3 w-3 mr-1" />Test AI Injection</>
              }
            </Button>
          </div>

          <div className="p-5 space-y-5">
          {!captured ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Load a GHL page above or click <strong className="text-blue-600">Test AI Injection</strong> to populate the comparison.
            </p>
          ) : (<>

            {/* Top-level keys */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Top-level keys in pageData</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase text-purple-700">Real GHL</p>
                  <div className="flex flex-wrap gap-1">
                    {ghlKeys?.map(k => <TypeBadge key={k} label={k} variant="purple" />)}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase text-blue-700">Our AI ({aiPage})</p>
                  {aiLoading
                    ? <span className="text-xs text-gray-400">Loading…</span>
                    : <div className="flex flex-wrap gap-1">
                        {aiKeys?.map(k => <TypeBadge key={k} label={k} variant="blue" />)}
                      </div>
                  }
                </div>
              </div>
            </div>

            {/* Structure counts table */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Container counts</p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="px-3 py-2 font-semibold text-gray-700">Key</th>
                      <th className="px-3 py-2 text-right font-semibold text-purple-700">Real GHL</th>
                      <th className="px-3 py-2 text-right font-semibold text-blue-700">Our AI</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-500">Match?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {STRUCT_KEYS.map(k => {
                      const gn = captured.pageData ? countTopLevel(captured.pageData, k) : null;
                      const an = aiData             ? countTopLevel(aiData, k)            : null;
                      const both = gn !== null && an !== null;
                      return (
                        <tr key={k} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono text-gray-700">{k}</td>
                          <td className="px-3 py-2 text-right font-medium text-purple-700">{gn ?? <span className="text-gray-300">—</span>}</td>
                          <td className="px-3 py-2 text-right font-medium text-blue-700">
                            {aiLoading ? "…" : an ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {both && (gn === an
                              ? <span className="text-green-600 font-medium">✓</span>
                              : <span className="text-amber-500 font-medium">≠</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Element type comparison */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Element / node types (tagName or type field inside metaData)
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase text-purple-700">Real GHL types</p>
                  {ghlTypes && Object.keys(ghlTypes).length > 0
                    ? <div className="flex flex-wrap gap-1">
                        {Object.entries(ghlTypes)
                          .sort(([, a], [, b]) => b - a)
                          .map(([t, n]) => (
                            <TypeBadge
                              key={t} label={t} count={n}
                              variant={inBoth.includes(t) ? "green" : "red"}
                            />
                          ))
                        }
                      </div>
                    : <p className="text-xs text-gray-400">No tagName / type fields found — the captured data may be metadata only (not the element tree). Try copying from a builder page that has content.</p>
                  }
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase text-blue-700">Our AI types</p>
                  {aiLoading
                    ? <span className="text-xs text-gray-400">Loading…</span>
                    : aiTypes && Object.keys(aiTypes).length > 0
                    ? <div className="flex flex-wrap gap-1">
                        {Object.entries(aiTypes)
                          .sort(([, a], [, b]) => b - a)
                          .map(([t, n]) => (
                            <TypeBadge
                              key={t} label={t} count={n}
                              variant={inBoth.includes(t) ? "green" : "amber"}
                            />
                          ))
                        }
                      </div>
                    : <p className="text-xs text-gray-400">No type data available</p>
                  }
                </div>
              </div>

              {/* Diff panel */}
              {hasMismatch && ghlTypes && aiTypes && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Schema differences found — these mismatches may cause injection to fail or render incorrectly
                  </p>
                  {onlyInGHL.length > 0 && (
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase text-red-700">
                        In real GHL but NOT in our AI-generated pages:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {onlyInGHL.map(t => <TypeBadge key={t} label={t} variant="red" />)}
                      </div>
                      <p className="mt-1.5 text-[10px] text-gray-500">
                        These element types exist in a real GHL page but our AI never generates them. If required, injection may leave gaps.
                      </p>
                    </div>
                  )}
                  {onlyInAI.length > 0 && (
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase text-amber-700">
                        In our AI output but NOT in real GHL pages:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {onlyInAI.map(t => <TypeBadge key={t} label={t} variant="amber" />)}
                      </div>
                      <p className="mt-1.5 text-[10px] text-gray-500">
                        Our AI generates these types but GHL may not recognise them — likely causing silent drops or broken rendering.
                      </p>
                    </div>
                  )}
                  {inBoth.length > 0 && (
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase text-green-700">Matching types:</p>
                      <div className="flex flex-wrap gap-1">
                        {inBoth.map(t => <TypeBadge key={t} label={t} variant="green" />)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!hasMismatch && ghlTypes && aiTypes
                && Object.keys(ghlTypes).length > 0 && Object.keys(aiTypes).length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-xs font-semibold text-green-800">
                    ✓ All element types match — schema looks compatible with GHL
                  </p>
                </div>
              )}
            </div>
          </>)}
          </div>
        </div>

      {/* ── Raw JSON ─────────────────────────────────────────────────────── */}
      {captured && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-2.5">
            <p className="text-sm font-semibold text-gray-900">Raw JSON</p>
            <p className="text-xs text-gray-400">
              Full raw data from GHL and our AI generator — paste both into a JSON diff tool for a deep comparison
            </p>
          </div>
          <div className="p-5 space-y-3">
            <JsonBlock
              data={captured.pageData}
              title="Real GHL pageData (from builder via revex GET)"
            />
            {aiData && (
              <JsonBlock
                data={aiData}
                title={`Our AI-generated pageData (${aiPage})`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
