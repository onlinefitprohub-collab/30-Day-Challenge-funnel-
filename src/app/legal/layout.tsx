import Link from "next/link";
import { Rocket } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300">
      {/* Minimal nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">FitPro Launch</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} FitPro Launch. All rights reserved.</p>
        <div className="mt-3 flex items-center justify-center gap-6">
          <Link href="/legal/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/legal/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/login" className="hover:text-gray-400 transition-colors">Log in</Link>
        </div>
      </footer>
    </div>
  );
}
