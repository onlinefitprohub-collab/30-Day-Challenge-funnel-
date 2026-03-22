import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell } from "lucide-react";

export const metadata = {
  title: "Account Settings | Challenge Funnel in a Box",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Coach";

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

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Subscription</CardTitle>
          </div>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Free Plan</p>
              <p className="text-sm text-gray-500">Generate up to 3 funnel projects</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="mt-4 rounded-lg bg-brand-50 p-4">
            <p className="text-sm font-medium text-brand-900">
              Pro plan coming soon
            </p>
            <p className="mt-1 text-sm text-brand-700">
              Unlimited projects, priority generation, and team access will be available in the next release.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Email notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Notification settings will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
