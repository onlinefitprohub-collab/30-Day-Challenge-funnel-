"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, CalendarDays, Loader2, MessageCircle, Video } from "lucide-react";
import { CopyableItem } from "@/components/results/result-section";
import { toast } from "@/hooks/use-toast";
import type { MonthlyContentPlan, MonthlyContentPost } from "@/types/monthly-content";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FORMAT_COLOURS: Record<string, string> = {
  reel:     "bg-pink-50 text-pink-700",
  carousel: "bg-blue-50 text-blue-700",
  talking:  "bg-violet-50 text-violet-700",
  text:     "bg-emerald-50 text-emerald-700",
  before:   "bg-amber-50 text-amber-700",
  value:    "bg-orange-50 text-orange-700",
  day:      "bg-cyan-50 text-cyan-700",
};

function formatBadge(format: string): string {
  const key = format.toLowerCase().split(" ")[0];
  return FORMAT_COLOURS[key] ?? "bg-gray-100 text-gray-700";
}

function getWeekPosts(posts: MonthlyContentPost[], week: number): MonthlyContentPost[] {
  const start = (week - 1) * 7 + 1;
  const end   = week * 7;
  return posts.filter((p) => p.day >= start && p.day <= end);
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface MonthlyPlanPlaceholderProps {
  month: string;        // "2025-06"
  monthLabel: string;   // "June 2025"
  projectId: string;
  onGenerated: (plan: MonthlyContentPlan) => void;
}

export function MonthlyPlanPlaceholder({ month, monthLabel, projectId, onGenerated }: MonthlyPlanPlaceholderProps) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-monthly-content", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ month, projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { plan } = await res.json() as { plan: MonthlyContentPlan };
      onGenerated(plan);
      toast({ title: `${monthLabel} content ready!`, description: "30 posts, story ideas, and DM starters generated." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
        {loading ? (
          <Loader2 className="h-7 w-7 text-brand-600 animate-spin" />
        ) : (
          <CalendarDays className="h-7 w-7 text-brand-600" />
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {loading ? `Generating ${monthLabel} content…` : `Generate ${monthLabel} Content`}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        {loading
          ? "This takes about 30 seconds — your month-specific posts are being written."
          : `Create 30 posts, 7 story ideas, and 5 DM starters tailored to ${monthLabel} — seasonally themed and personalised to your niche.`}
      </p>
      {!loading && (
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          <CalendarDays className="h-4 w-4" /> Generate {monthLabel} Content
        </button>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface MonthlyPlanSectionProps {
  plan: MonthlyContentPlan;
  month: string;
  projectId: string;
  onRegenerate: (plan: MonthlyContentPlan) => void;
}

export function MonthlyPlanSection({ plan, month, projectId, onRegenerate }: MonthlyPlanSectionProps) {
  const [regenerating, setRegenerating]   = useState(false);
  const [copiedAll, setCopiedAll]         = useState(false);
  const [openWeeks, setOpenWeeks]         = useState<Set<number>>(new Set([1]));
  const [copiedWeek, setCopiedWeek]       = useState<number | null>(null);

  function toggleWeek(week: number) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate-monthly-content", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ month, projectId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { plan: updated } = await res.json() as { plan: MonthlyContentPlan };
      onRegenerate(updated);
      toast({ title: "Content regenerated!", description: "Your updated plan is ready." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  }

  async function handleCopyAll() {
    const lines: string[] = [
      `=== ${plan.month.toUpperCase()} CONTENT PLAN ===`,
      "",
      plan.monthlyTheme,
      "",
      "=== WEEKLY FOCUSES ===",
      ...plan.weeklyFocuses.map((f, i) => `Week ${i + 1}: ${f}`),
      "",
    ];
    plan.posts.forEach((p) => {
      lines.push(`--- Day ${p.day} — ${p.theme} (${p.format}) ---`);
      lines.push(`Hook: ${p.hook}`);
      lines.push("");
      lines.push(p.caption);
      lines.push(`CTA: ${p.cta}`);
      lines.push("");
    });
    lines.push("=== STORY IDEAS ===");
    plan.storyIdeas.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push("");
    lines.push("=== DM STARTERS ===");
    plan.dmStarters.forEach((d, i) => lines.push(`${i + 1}. ${d}`));
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast({ title: `${plan.month} content copied!`, description: "All 30 posts, story ideas, and DM starters." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleCopyWeek(week: number) {
    const posts = getWeekPosts(plan.posts, week);
    const text = posts
      .map((p) => `Day ${p.day} — ${p.theme}\nFormat: ${p.format}\nHook: ${p.hook}\n\n${p.caption}\n\nCTA: ${p.cta}`)
      .join("\n\n---\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedWeek(week);
    toast({ title: `Week ${week} copied!` });
    setTimeout(() => setCopiedWeek(null), 2000);
  }

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-500">
          30 posts · 7 story ideas · 5 DM starters — all themed to {plan.month}.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy all 30 posts</>
            }
          </button>
        </div>
      </div>

      {/* Monthly theme banner */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
            <CalendarDays className="h-4 w-4 text-brand-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mb-1">{plan.month} Theme</p>
            <p className="text-sm leading-relaxed text-brand-900 font-medium">{plan.monthlyTheme}</p>
          </div>
        </div>
      </div>

      {/* Weekly focuses */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {plan.weeklyFocuses.map((focus, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Week {i + 1}</p>
            <p className="text-xs leading-snug text-gray-700">{focus}</p>
          </div>
        ))}
      </div>

      {/* Week accordions */}
      {[1, 2, 3, 4].map((week) => {
        const posts  = getWeekPosts(plan.posts, week);
        const isOpen = openWeeks.has(week);
        const start  = (week - 1) * 7 + 1;
        const end    = Math.min(week * 7, 30);

        return (
          <div key={week} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => toggleWeek(week)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                {isOpen
                  ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                }
                <div>
                  <p className="font-semibold text-gray-900">Week {week}</p>
                  <p className="text-xs text-gray-400">Days {start}–{end} · {posts.length} posts</p>
                </div>
              </button>
              <button
                onClick={() => handleCopyWeek(week)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copiedWeek === week
                  ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
                  : <><Copy className="h-3.5 w-3.5" /> Copy Week {week}</>
                }
              </button>
            </div>

            {isOpen && (
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {posts.map((post) => (
                  <div key={post.day} className="px-5 py-4 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-2.5 py-0.5 text-xs font-semibold">
                        Day {post.day}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${formatBadge(post.format)}`}>
                        {post.format}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{post.theme}</span>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Hook</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{post.hook}</p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Caption</p>
                      <CopyableItem value={post.caption} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">CTA:</span>
                      <span className="text-xs text-gray-700">{post.cta}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Story ideas */}
      <div>
        <div className="flex items-center gap-2 pt-1 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-pink-50 text-pink-700">
            <Video className="h-3 w-3" /> Story &amp; Reel Ideas
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-xs text-gray-400">{plan.storyIdeas.length} ideas</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <ul className="space-y-3">
            {plan.storyIdeas.map((idea, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{idea}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* DM starters */}
      <div>
        <div className="flex items-center gap-2 pt-1 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700">
            <MessageCircle className="h-3 w-3" /> DM Starters for {plan.month}
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-2">
          {plan.dmStarters.map((dm, i) => (
            <CopyableItem key={i} value={dm} />
          ))}
        </div>
      </div>

    </div>
  );
}
