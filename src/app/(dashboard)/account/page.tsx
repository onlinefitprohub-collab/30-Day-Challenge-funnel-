import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Puzzle, Download } from "lucide-react";
import { HighLevelSettingsCard } from "@/components/account/highlevel-settings-card";
import { SubscriptionCard } from "@/components/account/subscription-card";
import { NotionSettingsCard } from "@/components/account/notion-settings-card";
import { PasswordChangeCard } from "@/components/account/password-change-card";
import { EmailChangeCard } from "@/components/account/email-change-card";
import { GdprCard } from "@/components/account/gdpr-card";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { decrypt } from "@/lib/crypto";

export const metadata = {
  title: "Account Settings | FitPro Launch",
};

interface PageProps {
  searchParams: Promise<{ upgraded?: string }>;
}

export default async function AccountPage({ searchParams }: PageProps) {
  const { upgraded } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Coach";

  type HLSettings = {
    hl_api_key: string | null;
    hl_location_id: string | null;
    subscription_period_end?: string | null;
    notion_api_key?: string | null;
    notion_page_id?: string | null;
  } | null;

  let hlSettings: HLSettings = null;
  let hlTableReady = true;

  if (user) {
    const { data, error } = await supabase
      .from("user_settings")
      .select("hl_api_key, hl_location_id, subscription_period_end, notion_api_key, notion_page_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      const errCode = (error as { code?: string }).code ?? "";
      if (errCode === "PGRST205" || error.message?.includes("user_settings")) {
        hlTableReady = false;
      }
    } else {
      hlSettings = data as HLSettings;
    }
  }

  const isHLConnected = Boolean(hlSettings?.hl_api_key && hlSettings?.hl_location_id);
  const rawKey = hlSettings?.hl_api_key ? decrypt(hlSettings.hl_api_key) : null;
  const maskedKey = rawKey ? `••••••••${rawKey.slice(-4)}` : null;

  const subscriptionStatus = user
    ? await getUserSubscriptionStatus(supabase, user.id)
    : "none";

  const periodEnd = hlSettings?.subscription_period_end ?? null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-500">Manage your account and subscription</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <PasswordChangeCard />

      {/* Email Change */}
      <EmailChangeCard currentEmail={user?.email ?? ""} />

      {/* Subscription */}
      <SubscriptionCard
        status={subscriptionStatus}
        periodEnd={periodEnd}
        upgraded={upgraded === "1"}
      />

      {/* Chrome Extension */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Puzzle className="h-4 w-4 text-[#1a56db]" />
            <CardTitle className="text-base">Chrome Extension</CardTitle>
          </div>
          <CardDescription>
            Inject your funnel pages into the GHL page builder as native editable elements — no API key required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-1.5 text-sm text-gray-600">
            <li className="flex gap-2"><span className="font-semibold text-gray-400">1.</span> Download and unzip the extension below</li>
            <li className="flex gap-2"><span className="font-semibold text-gray-400">2.</span> In Chrome go to <span className="font-mono text-xs bg-gray-100 px-1 rounded">chrome://extensions</span> and enable Developer mode</li>
            <li className="flex gap-2"><span className="font-semibold text-gray-400">3.</span> Click <strong>Load unpacked</strong> and select the unzipped folder</li>
            <li className="flex gap-2"><span className="font-semibold text-gray-400">4.</span> Click the extension icon on any results page to load a funnel page, then open the GHL builder and click <strong>Paste into Page Builder</strong></li>
          </ol>
          <a
            href="/api/highlevel/extension-download"
            download="challenge-funnel-extension.zip"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1a56db] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1245b5] transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Chrome Extension
          </a>
        </CardContent>
      </Card>

      {/* HighLevel Integration */}
      <HighLevelSettingsCard
        isConnected={isHLConnected}
        maskedKey={maskedKey}
        locationId={hlSettings?.hl_location_id ?? null}
        tableReady={hlTableReady}
      />

      {/* Notion Export */}
      <NotionSettingsCard
        notionApiKey={hlSettings?.notion_api_key ?? null}
        notionPageId={hlSettings?.notion_page_id ?? null}
      />

      {/* GDPR / Privacy */}
      <GdprCard userEmail={user?.email ?? ""} />
    </div>
  );
}
