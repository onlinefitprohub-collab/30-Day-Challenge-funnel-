"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import {
  LayoutDashboard, Sparkles, Settings, Zap, LogOut, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard",        label: "My Funnels",     subtitle: "All your projects",       icon: LayoutDashboard },
  { href: "/content-engine",   label: "Content Engine", subtitle: "Monthly social content",  icon: Sparkles },
  { href: "/account",          label: "Settings",       subtitle: "Account & integrations",  icon: Settings },
];

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Coach";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={cn(
        // Base
        "fixed top-0 left-0 z-40 flex h-full w-60 flex-col border-r border-white/[0.06] bg-[#0d0d10]",
        "transition-transform duration-200 ease-in-out",
        // Desktop: always visible
        "lg:relative lg:translate-x-0",
        // Mobile: slide in/out
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Logo + close button (mobile) */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/[0.06]">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">FitPro Launch</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname.startsWith("/projects")
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              <span className="flex flex-col">
                <span className="text-sm font-medium leading-tight">{item.label}</span>
                <span className={cn("text-[10px] leading-tight", isActive ? "text-orange-400/50" : "text-zinc-700")}>{item.subtitle}</span>
              </span>
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-orange-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-400 border border-orange-500/20">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-300">{displayName}</p>
            <p className="truncate text-[10px] text-zinc-600">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md p-1 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
