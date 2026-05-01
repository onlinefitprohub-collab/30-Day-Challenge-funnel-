"use client";

import { useState } from "react";
import { Copy, Check, Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { CopyableItem } from "../result-section";
import { toast } from "@/hooks/use-toast";

interface ContentPost {
  day: number;
  theme: string;
  format: string;
  hook: string;
  caption: string;
  cta: string;
}

interface ContentCalendar {
  strategy: string;
  posts: ContentPost[];
}

const FORMAT_COLORS: Record<string, string> = {
  reel:       "bg-pink-50 text-pink-700",
  carousel:   "bg-blue-50 text-blue-700",
  story:      "bg-amber-50 text-amber-700",
  static:     "bg-gray-100 text-gray-700",
  live:       "bg-red-50 text-red-700",
  video:      "bg-purple-50 text-purple-700",
};

function formatBadgeClass(format: string): string {
  const key = format.toLowerCase().split(" ")[0];
  return FORMAT_COLORS[key] ?? "bg-gray-100 text-gray-700";
}

export function ContentCalendarSection({ data }: { data: ContentCalendar }) {
  const weeks = [1, 2, 3, 4];
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]));
  const [copiedWeek, setCopiedWeek] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function toggleWeek(week: number) {
    setOpenWeeks((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  function getWeekPosts(week: number): ContentPost[] {
    const start = (week - 1) * 7 + 1;
    const end = week * 7;
    return data.posts.filter((p) => p.day >= start && p.day <= end);
  }

  async function handleCopyWeek(week: number) {
    const posts = getWeekPosts(week);
    const text = posts
      .map((p) => `Day ${p.day} — ${p.theme}\nFormat: ${p.format}\nHook: ${p.hook}\n\n${p.caption}\n\nCTA: ${p.cta}`)
      .join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedWeek(week);
    toast({ title: `Week ${week} copied!`, description: `${posts.length} posts copied as formatted text.` });
    setTimeout(() => setCopiedWeek(null), 2000);
  }

  async function handleCopyAll() {
    const text = data.posts
      .map((p) => `Day ${p.day} — ${p.theme}\nFormat: ${p.format}\nHook: ${p.hook}\n\n${p.caption}\n\nCTA: ${p.cta}`)
      .join("\n\n---\n\n");

    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast({ title: "Full calendar copied!", description: "All 30 posts copied as formatted text." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          30-day content calendar — strategy overview and daily post plans.
        </p>
        <button
          onClick={handleCopyAll}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {copiedAll
            ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
            : <><Copy className="h-3.5 w-3.5" /> Copy all 30 posts</>
          }
        </button>
      </div>

      {/* Strategy overview */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mb-1">
              Content Strategy
            </p>
            <p className="text-sm leading-relaxed text-gray-800">{data.strategy}</p>
          </div>
        </div>
      </div>

      {/* Week accordions */}
      {weeks.map((week) => {
        const posts = getWeekPosts(week);
        const isOpen = openWeeks.has(week);
        const isCopied = copiedWeek === week;
        const startDay = (week - 1) * 7 + 1;
        const endDay = Math.min(week * 7, 30);

        return (
          <div key={week} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Week header */}
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
                  <p className="text-xs text-gray-400">Days {startDay}–{endDay} · {posts.length} posts</p>
                </div>
              </button>
              <button
                onClick={() => handleCopyWeek(week)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {isCopied
                  ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
                  : <><Copy className="h-3.5 w-3.5" /> Copy Week {week}</>
                }
              </button>
            </div>

            {/* Post cards */}
            {isOpen && (
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {posts.map((post) => (
                  <div key={post.day} className="px-5 py-4 space-y-3">
                    {/* Post meta row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-2.5 py-0.5 text-xs font-semibold">
                        Day {post.day}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${formatBadgeClass(post.format)}`}>
                        {post.format}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{post.theme}</span>
                    </div>

                    {/* Hook */}
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Hook</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{post.hook}</p>
                    </div>

                    {/* Caption — copyable */}
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Caption</p>
                      <CopyableItem value={post.caption} />
                    </div>

                    {/* CTA */}
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
    </div>
  );
}
