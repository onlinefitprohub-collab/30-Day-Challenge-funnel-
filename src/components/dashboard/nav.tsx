"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Zap, LayoutDashboard, Settings, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account", label: "Settings", icon: Settings },
];

export function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Coach";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f172a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="hidden font-bold text-white sm:block tracking-tight">
            FitPro Launch
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-3",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
              title={item.label}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/projects/new">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm border-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:block">New funnel</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-300 border border-orange-500/30">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-slate-300 md:block">
              {displayName}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
