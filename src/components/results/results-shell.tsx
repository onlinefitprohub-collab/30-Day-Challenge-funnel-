"use client";

import { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Copy, Check, Target, FileText, FormInput,
  ThumbsUp, Calendar, MessageSquare, Mail, Megaphone,
  ImageIcon, BarChart3, FlaskConical, Layers, LayoutTemplate, RefreshCw, Microscope,
  Dumbbell, MessageCircle, CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { ProjectRow } from "@/types/project";
import type { GeneratedFunnelAssets, WorkoutPlan, NurtureSequence } from "@/types/generation";
import type { LongFormSalesAssets } from "@/types/longform";
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
import { FunnelPreviewSection }   from "./sections/funnel-preview";
import { GhlInspectorSection }    from "./sections/ghl-inspector";
import { WorkoutPlanSection, WorkoutPlanPlaceholder } from "./sections/workout-plan";
import { SalesLetterSection, LongFormPlaceholder }    from "./sections/sales-letter";
import { ManyChatFlowSection }    from "./sections/manychat-flow";
import { NurtureSection, NurturePlaceholder }         from "./sections/nurture";

// ── Tab definitions ───────────────────────────────────────────────────────────

const CHALLENGE_TABS = [
  { id: "highlevel",       label: "HighLevel",              icon: Layers,          highlight: true, group: "export" },
  { id: "ghlInspector",    label: "GHL Inspector",          icon: Microscope,                       group: "export" },
  { id: "funnelPreview",   label: "Funnel Preview",         icon: LayoutTemplate,                   group: "preview" },
  { id: "offerSummary",    label: "Offer Summary",          icon: Target,                           group: "overview" },
  { id: "landingPage",     label: "Landing Page",           icon: FileText,                         group: "pages" },
  { id: "optInForm",       label: "Opt-in Form",            icon: FormInput,                        group: "pages" },
  { id: "thankYouPage",    label: "Thank You",              icon: ThumbsUp,                         group: "pages" },
  { id: "bookingPage",     label: "Booking Page",           icon: Calendar,                         group: "pages" },
  { id: "smsSequence",     label: "SMS Sequence",           icon: MessageSquare,                    group: "sequences" },
  { id: "emailSequence",   label: "Email Sequence",         icon: Mail,                             group: "sequences" },
  { id: "nurtureSequence", label: "52-Wk Nurture",          icon: CalendarDays,                     group: "sequences" },
  { id: "adCopy",          label: "Ad Copy",                icon: Megaphone,                        group: "ads" },
  { id: "creativePrompts", label: "Creatives",              icon: ImageIcon,                        group: "ads" },
  { id: "campaignNaming",  label: "Campaign",               icon: BarChart3,                        group: "ads" },
  { id: "workoutPlan",     label: "Workout Plan",           icon: Dumbbell,                         group: "programme" },
  { id: "salesLetter",     label: "Sales Letter",           icon: FileText,                         group: "longform" },
] as const;

const APPLICATION_TABS = [
  { id: "highlevel",       label: "HighLevel",              icon: Layers,          highlight: true, group: "export" },
  { id: "ghlInspector",    label: "GHL Inspector",          icon: Microscope,                       group: "export" },
  { id: "funnelPreview",   label: "Funnel Preview",         icon: LayoutTemplate,                   group: "preview" },
  { id: "offerSummary",    label: "Offer Summary",          icon: Target,                           group: "overview" },
  { id: "landingPage",     label: "Registration Page",       icon: FileText,                         group: "pages" },
  { id: "optInForm",       label: "Application Form",       icon: FormInput,                        group: "pages" },
  { id: "thankYouPage",    label: "App Received",           icon: ThumbsUp,                         group: "pages" },
  { id: "bookingPage",     label: "Strategy Call",          icon: Calendar,                         group: "pages" },
  { id: "smsSequence",     label: "SMS Sequence",           icon: MessageSquare,                    group: "sequences" },
  { id: "emailSequence",   label: "Email Sequence",         icon: Mail,                             group: "sequences" },
  { id: "nurtureSequence", label: "52-Wk Nurture",          icon: CalendarDays,                     group: "sequences" },
  { id: "adCopy",          label: "Ad Copy",                icon: Megaphone,                        group: "ads" },
  { id: "creativePrompts", label: "Creatives",              icon: ImageIcon,                        group: "ads" },
  { id: "campaignNaming",  label: "Campaign",               icon: BarChart3,                        group: "ads" },
  { id: "manyChatFlow",    label: "ManyChat Flow",          icon: MessageCircle,                    group: "longform" },
] as const;

// Union of all possible tab IDs across both funnel types
type TabId =
  | (typeof CHALLENGE_TABS)[number]["id"]
  | (typeof APPLICATION_TABS)[number]["id"];

interface ResultsShellProps {
  project: ProjectRow;
  outputs: Record<string, unknown>;
  isMock: boolean;
  hlConnected: boolean;
}

type SectionGroup = "offer-pages" | "sequences" | "ads";

// Maps each tab to its AI generation group (tabs without a group can't be section-regenerated)
const TAB_SECTION_GROUP: Partial<Record<TabId, SectionGroup>> = {
  offerSummary:    "offer-pages",
  landingPage:     "offer-pages",
  optInForm:       "offer-pages",
  thankYouPage:    "offer-pages",
  bookingPage:     "offer-pages",
  smsSequence:     "sequences",
  emailSequence:   "sequences",
  adCopy:          "ads",
  creativePrompts: "ads",
  campaignNaming:  "ads",
};

async function triggerLongFormGeneration(projectId: string): Promise<import("@/types/longform").LongFormSalesAssets | null> {
  try {
    const res = await fetch("/api/generate-longform", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ projectId }),
    });
    if (!res.ok) return null;
    const { longFormAssets } = await res.json() as { longFormAssets: import("@/types/longform").LongFormSalesAssets };
    return longFormAssets ?? null;
  } catch {
    return null;
  }
}

const GROUP_LABEL: Record<SectionGroup, string> = {
  "offer-pages": "Pages & Offer",
  "sequences":   "Sequences",
  "ads":         "Ads & Campaign",
};

export function ResultsShell({ project, outputs, isMock, hlConnected }: ResultsShellProps) {
  const router = useRouter();

  // Determine funnel type — default to "challenge" for backward compat
  const funnelType = (outputs.funnelType as "challenge" | "application" | undefined) ?? "challenge";
  const isApplication = funnelType === "application";
  const tabs = isApplication ? APPLICATION_TABS : CHALLENGE_TABS;

  const [activeTab, setActiveTab]           = useState<TabId>("highlevel");
  const [copiedAll, setCopiedAll]           = useState(false);
  const [regenerating, setRegenerating]     = useState(false);
  const [regenSection, setRegenSection]     = useState<SectionGroup | null>(null);
  // Live outputs — updated in-place after section regeneration so the UI refreshes immediately
  const [liveOutputs, setLiveOutputs]       = useState<Record<string, unknown>>(outputs);

  // On-demand extras — managed in local state and merged back into liveOutputs on generation
  const [liveWorkoutPlan, setLiveWorkoutPlan]         = useState<WorkoutPlan | undefined>(
    outputs.workoutPlan as WorkoutPlan | undefined,
  );
  const [liveLongFormAssets, setLiveLongFormAssets]   = useState<LongFormSalesAssets | undefined>(
    outputs.longFormAssets as LongFormSalesAssets | undefined,
  );
  const [liveNurtureSequence, setLiveNurtureSequence] = useState<NurtureSequence | undefined>(
    outputs.nurtureSequence as NurtureSequence | undefined,
  );

  // Auto-generate longform for challenge funnels on mount if ManyChat/sales letter not yet present.
  // For application funnels, the registration page is generated synchronously during main generation —
  // no separate longform auto-trigger needed.
  useEffect(() => {
    if (!isApplication && !liveLongFormAssets?.salesLetter) {
      // Challenge funnels only — pre-warm the long-form sales letter if not yet generated.
      // (ManyChat flow is application-only; handled separately via the manual trigger.)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleWorkoutGenerated(plan: WorkoutPlan) {
    setLiveWorkoutPlan(plan);
    setLiveOutputs((prev: Record<string, unknown>) => ({ ...prev, workoutPlan: plan }));
  }

  function handleLongFormGenerated(assets: LongFormSalesAssets) {
    setLiveLongFormAssets(assets);
    setLiveOutputs((prev: Record<string, unknown>) => ({ ...prev, longFormAssets: assets }));
  }

  function handleNurtureGenerated(sequence: NurtureSequence) {
    setLiveNurtureSequence(sequence);
    setLiveOutputs((prev: Record<string, unknown>) => ({ ...prev, nurtureSequence: sequence }));
  }

  // Strip internal _isMock flag from the copy-all output
  const { _isMock: _removed, ...cleanOutputs } = liveOutputs;
  const assets = cleanOutputs as unknown as GeneratedFunnelAssets;

  async function handleCopyAll() {
    await navigator.clipboard.writeText(JSON.stringify(assets, null, 2));
    setCopiedAll(true);
    toast({ title: "All content copied!", description: "Paste it wherever you need it." });
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      // Step 1: mark project as "generating" and get saved inputs back (awaited)
      const startRes = await fetch(`/api/regenerate/${project.id}`, { method: "POST" });
      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${startRes.status}`);
      }
      const { inputs } = await startRes.json() as { inputs: unknown; projectId: string };

      // Step 2: fire the heavy AI generation with keepalive so it survives navigation
      fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId: project.id, inputs }),
        keepalive: true,
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string };
          console.error("[regenerate] generation API failed:", err.error ?? `HTTP ${res.status}`);
        }
      }).catch((err) => {
        console.error("[regenerate] generation fetch error:", err);
      });

      // Step 3: navigate to the generating screen (status is now "generating")
      router.push(`/projects/${project.id}/generating`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Could not start regeneration", description: msg, variant: "destructive" });
      setRegenerating(false);
    }
  }

  async function handleRegenerateSection(group: SectionGroup) {
    if (regenSection) return;
    setRegenSection(group);
    try {
      const res = await fetch("/api/regenerate-section", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId: project.id, group }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const { outputs: updated } = await res.json() as { outputs: Record<string, unknown> };
      setLiveOutputs(updated);
      toast({ title: "Section regenerated!", description: `${GROUP_LABEL[group]} copy updated.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Section regeneration failed", description: msg, variant: "destructive" });
    } finally {
      setRegenSection(null);
    }
  }

  const sections: Partial<Record<TabId, React.ReactNode>> = {
    highlevel:       <HighLevelSection       data={assets} projectId={project.id} hlConnected={hlConnected} />,
    funnelPreview:   <FunnelPreviewSection   data={assets} projectId={project.id} funnelType={funnelType} />,
    ghlInspector:    <GhlInspectorSection    projectId={project.id} />,
    offerSummary:    <OfferSummarySection    data={assets.offerSummary} copywriterStyle={assets.copywriterStyle} />,
    // Landing page: challenge → short-form copy | application → registration page summary card
    landingPage: isApplication
      ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">22-Section Registration Page</p>
              <p className="text-sm text-blue-700 mt-1">
                Your registration page has been generated and is ready to preview and export to GHL.
                Use the <strong>Funnel Preview</strong> tab to see it in full, or click{" "}
                <strong>Clone to GHL</strong> to inject it directly into your funnel.
              </p>
            </div>
            {assets.applicationLandingPage && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
                <h3 className="font-semibold text-gray-900">Page Overview</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Headline</p>
                    <p className="text-gray-800 font-medium">{assets.applicationLandingPage.valuePropHeadline}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Primary CTA</p>
                    <p className="text-gray-800 font-medium">{assets.applicationLandingPage.heroCtaText}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Benefit Sections</p>
                    <p className="text-gray-800">{assets.applicationLandingPage.benefitBlocks.length} programme pillars</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">FAQ Items</p>
                    <p className="text-gray-800">{assets.applicationLandingPage.faqItems.length} questions answered</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Qualifications</p>
                    <p className="text-gray-800">{assets.applicationLandingPage.shouldApply.length} qualifiers · {assets.applicationLandingPage.shouldNotApply.length} disqualifiers</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Client Wins</p>
                    <p className="text-gray-800">{assets.applicationLandingPage.clientWins.length} results showcased</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      : <LandingPageSection data={assets.landingPage} />,
    optInForm:       <OptInFormSection       data={assets.optInForm} />,
    thankYouPage:    <ThankYouSection        data={assets.thankYouPage} />,
    bookingPage:     <BookingSection         data={assets.bookingPage} />,
    smsSequence:     <SmsSection             data={assets.smsSequence} funnelType={funnelType} />,
    emailSequence:   <EmailSection           data={assets.emailSequence} funnelType={funnelType} />,
    adCopy:          <AdCopySection          data={assets.adCopy} />,
    creativePrompts: <CreativePromptsSection data={assets.creativePrompts} generatedAdImages={assets.generatedAdImages} isMock={isMock} />,
    campaignNaming:  <CampaignNamingSection  data={assets.campaignNaming} />,
    // Nurture — both funnel types
    nurtureSequence: liveNurtureSequence
      ? <NurtureSection data={liveNurtureSequence} projectId={project.id} onRegenerate={handleNurtureGenerated} />
      : <NurturePlaceholder projectId={project.id} onGenerated={handleNurtureGenerated} />,
    // Challenge-only extras
    ...((!isApplication) && {
      workoutPlan: liveWorkoutPlan
        ? <WorkoutPlanSection data={liveWorkoutPlan} projectId={project.id} onRegenerate={handleWorkoutGenerated} />
        : <WorkoutPlanPlaceholder projectId={project.id} onGenerated={handleWorkoutGenerated} />,
      salesLetter: liveLongFormAssets
        ? <SalesLetterSection data={liveLongFormAssets.salesLetter} projectId={project.id} onRegenerate={handleLongFormGenerated} />
        : <LongFormPlaceholder projectId={project.id} onGenerated={handleLongFormGenerated} />,
    }),
    // Application-only extras
    ...(isApplication && {
      manyChatFlow: liveLongFormAssets
        ? <ManyChatFlowSection data={liveLongFormAssets.manyChatFlow} />
        : <LongFormPlaceholder projectId={project.id} onGenerated={handleLongFormGenerated} generating />,
    }),
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
              Add <code className="rounded bg-amber-100 px-1 font-mono text-xs">ANTHROPIC_API_KEY</code> to your
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">
            {isApplication ? "Your application funnel" : "Your complete challenge funnel"}
          </p>
              {!isApplication && outputs.templateVariant && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-200">
                  <LayoutTemplate className="h-3 w-3" />
                  {String(outputs.templateVariant).replace(/-/g, " ")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={regenerating}
            title="Re-run AI generation with your saved inputs"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "Starting…" : "Regenerate"}
          </Button>
          <Button variant="outline" onClick={handleCopyAll}>
            {copiedAll
              ? <><Check className="h-4 w-4 text-green-500" /> Copied!</>
              : <><Copy className="h-4 w-4" /> Copy all</>
            }
          </Button>
        </div>
      </div>

      {/* Tab bar — scrollable on mobile */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 w-max min-w-full sm:min-w-0">
          {(tabs as readonly { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; group: string; highlight?: boolean }[]).map((tab, i) => {
            const isHL = !!tab.highlight;
            const isActive = activeTab === tab.id;
            const showSeparator = i > 0 && tab.group !== tabs[i - 1].group;
            return (
              <Fragment key={tab.id}>
                {showSeparator && (
                  <div className="flex items-center px-0.5">
                    <div className="h-5 w-px rounded-full bg-gray-300" />
                  </div>
                )}
                <button
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
                  data-tab={tab.id}
                >
                  <tab.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Active section */}
      {(() => {
        const tab = activeTab as TabId;
        const sectionGroup = TAB_SECTION_GROUP[tab];
        return (
          <div className="animate-fade-in" key={tab}>
            {/* Per-section regenerate button */}
            {sectionGroup && (
              <div className="mb-4 flex items-center justify-end">
                <button
                  onClick={() => handleRegenerateSection(sectionGroup)}
                  disabled={!!regenSection}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 transition-colors"
                  title={`Re-run AI for ${GROUP_LABEL[sectionGroup]} without regenerating the whole funnel`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${regenSection === sectionGroup ? "animate-spin" : ""}`} />
                  {regenSection === sectionGroup ? "Regenerating…" : "Regenerate this section"}
                </button>
              </div>
            )}
            {sections[tab] ?? null}
          </div>
        );
      })()}
    </div>
  );
}
