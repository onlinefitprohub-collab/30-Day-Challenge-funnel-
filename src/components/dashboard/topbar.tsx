"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Menu, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_LABELS: Record<string, string> = {
  "/dashboard":      "Dashboard",
  "/content-engine": "Content Engine",
  "/account":        "Settings",
};

function getPageLabel(pathname: string): string {
  if (pathname.startsWith("/projects/new"))      return "New Funnel";
  if (pathname.includes("/results"))             return "Results";
  if (pathname.includes("/generating"))          return "Generating…";
  if (pathname.startsWith("/projects/"))         return "Project";
  return PAGE_LABELS[pathname] ?? "Dashboard";
}

interface TopbarProps {
  user: User;
  onMenuToggle: () => void;
}

export function Topbar({ user: _user, onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#09090b] px-4 sm:px-6">
      {/* Left: hamburger (mobile) + logo (mobile only) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Logo visible only on mobile (sidebar hidden) */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-orange-600">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white">FitPro Launch</span>
        </Link>
        {/* Page label on desktop */}
        <span className="hidden lg:block text-sm font-semibold text-zinc-300">{pageLabel}</span>
      </div>

      {/* Right: new funnel */}
      <Link href="/projects/new">
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold border-0 shadow-sm h-8 px-3 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New funnel</span>
        </Button>
      </Link>
    </header>
  );
}
