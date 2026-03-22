import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Bell } from "lucide-react";

export const metadata = {
  title: "Account Settings | Challenge Funnel in a Box",
};

export default function AccountPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-500">Manage your subscription and preferences</p>
      </div>

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
              <p className="text-sm text-gray-500">Generate unlimited funnel projects</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="mt-4 rounded-lg bg-brand-50 p-4">
            <p className="text-sm font-medium text-brand-900">Pro plan coming soon</p>
            <p className="mt-1 text-sm text-brand-700">
              Priority generation and team access will be available in the next release.
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
