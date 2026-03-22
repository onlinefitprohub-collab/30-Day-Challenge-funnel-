"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, Target, FileText, FormInput,
  ThumbsUp, Calendar, MessageSquare, Mail, Megaphone,
  ImageIcon, BarChart3, FlaskConical, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { ProjectRow } from "@/types/project";
import type { GeneratedFunnelAssets } from "@/types/generation";
import { OfferSummarySection }    from "./sections/offer-summary";
import { LandingPageSection }     from "./sections/landing-page";
import { OptInFormSection }       from "./sections/opt-in-form";
import { ThankYouSection }        from "./sections/thank-you";
import { BookingSection }         from "./sections/booking";
import { SmsSection }             from "./sections/sms";
import { EmailSection }           from "./sections/email";
import { AdCopySection }          from "./sections/ad-copy";
import { CreativePromptsSection } from "./sections/creative-prompts";
import { CampaignNamingSection }  from "./sections/campaign-naming";
import { HighLevelSection }       from "./sections/highlevel";

const tabs = [
  { id: "highlevel",       label: "HighLevel",      icon: Layers,        highlight: true },
  { id: "offerSummary",    label: "Offer Summary",  icon: Target },
  { id: "landingPage",     label: "Landing Page",   icon: FileText },
  { id: "optInForm",       label: "Opt-in Form",    icon: FormInput },
  { id: "thankYouPage",    label: "Thank You",      icon: ThumbsUp },
  { id: "bookingPage",     label: "Booking Page",   icon: Calendar },
  { id: "smsSequence",     label: "SMS Sequence",   icon: MessageSquare },
  { id: "emailSequence",   label: "Email Sequence", icon: Mail },
  { id: "adCopy",          label: "Ad Copy",        icon: Megaphone },
  { id: "creativePrompts", label: "Creatives",      icon: ImageIcon },
  { id: "campaignNaming",  label: "Campaign",       icon: BarChart3 },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface ResultsShellProps {
  project: ProjectRow;
  outputs: Record<string, unknown>;
  isMock: boolean;
  hlConnected: boolean;
}

export function ResultsShell({ project, outputs, isMock, hlConnected }: ResultsShellProps) {
  const [activeTab, setActiveTab] = useState<TabId>("highlevel");
  const [copiedAll, setCopiedAll]  = useState(false);

  // Strip internal _isMock flag from the copy-all output
  const { _isMock: _removed, ...cleanOutputs } = outputs;
  const assets = cleanOutputs as unknown as GeneratedFunnelAssets;

  async function handleCopyAll() {
    await navigator.clipboard.writeText(JSON.stringify(assets, null, 2));
    setCopiedAll(true);
    toast({ title: "All content copied!", description: "Paste it wherever you need it." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  const sections: Record<TabId, React.ReactNode> = {
    highlevel:       <HighLevelSection       data={assets} projectId={project.id} hlConnected={hlConnected} />,
    offerSummary:    <OfferSummarySection    data={assets.offerSummary} />,
    landingPage:     <LandingPageSection     data={assets.landingPage} />,
    optInForm:       <OptInFormSection       data={assets.optInForm} />,
    thankYouPage:    <ThankYouSection        data={assets.thankYouPage} />,
    bookingPage:     <BookingSection         data={assets.bookingPage} />,
    smsSequence:     <SmsSection             data={assets.smsSequence} />,
    emailSequence:   <EmailSection           data={assets.emailSequence} />,
    adCopy:          <AdCopySection          data={assets.adCopy} />,
    creativePrompts: <CreativePromptsSection data={assets.creativePrompts} />,
    campaignNaming:  <CampaignNamingSection  data={assets.campaignNaming} />,
  };

  return (
    <div className="space-y-5">

      {/* Demo mode banner */}
      {isMock && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-amber-900">Demo content — based on your inputs</p>
            <p className="text-sm text-amber-700">
              This funnel was generated without an AI key, so the copy is structured but not fully AI-written.
              Add <code className="rounded bg-amber-100 px-1 font-mono text-xs">OPENAI_API_KEY</code> to your
              environment and regenerate for fully tailored copy.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">Your complete challenge funnel</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleCopyAll}>
          {copiedAll
            ? <><Check className="h-4 w-4 text-green-500" /> Copied!</>
            : <><Copy className="h-4 w-4" /> Copy all</>
          }
        </Button>
      </div>

      {/* Tab bar — scrollable on mobile */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 w-max min-w-full sm:min-w-0">
          {tabs.map((tab) => {
            const isHL = "highlight" in tab && tab.highlight;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive && isHL
                    ? "bg-[#1a56db] text-white shadow-sm"
                    : isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : isHL
                    ? "bg-[#e8f0fe] text-[#1a56db] hover:bg-[#d0e2ff]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active section */}
      <div className="animate-fade-in" key={activeTab}>
        {sections[activeTab]}
      </div>
    </div>
  );
}
