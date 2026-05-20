"use client";
import { useState } from "react";
import { Shield, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function GdprCard({ userEmail }: { userEmail: string }) {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/gdpr/data-request", { method: "POST" });
      const json = await res.json() as { success: boolean; data: unknown };
      if (!json.success) throw new Error("Request failed");
      const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "fitprolaunch-my-data.json"; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Data downloaded", description: "Your data export has been saved." });
    } catch {
      toast({ title: "Download failed", description: "Please try again.", variant: "destructive" });
    }
    setDownloading(false);
  }

  const deletionSubject = encodeURIComponent("Account Deletion Request");
  const deletionBody    = encodeURIComponent(`Please delete my account and all associated data.\n\nEmail: ${userEmail}`);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-base">Privacy & Your Data</CardTitle>
        </div>
        <CardDescription>GDPR rights — access, download, or delete your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          You have the right to access, correct, export, or delete your personal data at any time.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Preparing…" : "Download my data"}
          </button>
          <a
            href={`mailto:hello@fitprolaunch.com?subject=${deletionSubject}&body=${deletionBody}`}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Request account deletion
          </a>
        </div>
        <p className="text-xs text-gray-400">
          We respond to data requests within 30 days. For questions: hello@fitprolaunch.com
        </p>
      </CardContent>
    </Card>
  );
}
