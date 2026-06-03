"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function EmailChangeCard({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving]     = useState(false);
  const { toast }               = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim() || newEmail.trim() === currentEmail) {
      toast({ title: "Enter a different email address", variant: "destructive" });
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) {
      toast({ title: "Failed to update email", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Confirmation emails sent",
        description: `Check both ${currentEmail} and ${newEmail.trim()} to confirm the change.`,
      });
      setNewEmail("");
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-base">Change Email</CardTitle>
        </div>
        <CardDescription>A confirmation link will be sent to both your current and new email address</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Current email</label>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">{currentEmail}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">New email</label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="new@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !newEmail.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Sending confirmation…" : "Change email"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
