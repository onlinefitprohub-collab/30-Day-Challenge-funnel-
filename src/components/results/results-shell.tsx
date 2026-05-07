"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Copy, Check, Target, FileText, FormInput,
  ThumbsUp, Calendar, MessageSquare, Mail, Megaphone,
  ImageIcon, BarChart3, FlaskConical, Layers, LayoutTemplate, RefreshCw, Microscope,
  Dumbbell, MessageCircle, CalendarDays, Pen, Video,
  CalendarRange, Package, Star, BadgeDollarSign, Phone, Map, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { ProjectRow } from "@/types/project";
import type { GeneratedFunnelAssets, WorkoutPlan, NurtureSequence, ContentCalendar, DeliveryPack, TestimonialHarvestSequence, PricingGuide } from "@/types/generation";
import type { DiscoveryCallScript } from "@/types/discovery-call";
import type { InstagramDmScript } from "@/types/dm-script";
import type { UpsellSequence } from "@/types/upsell-sequence";
import type { LaunchRoadmap } from "@/types/launch-roadmap";
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
import { VslScriptSection, VslScriptPlaceholder }    from "./sections/vsl-script";
import { ContentCalendarSection }    from "./sections/content-calendar";
import { DeliveryPackSection }       from "./sections/delivery-pack";
import { TestimonialHarvestSection } from "./sections/testimonial-harvest";
import { PricingGuideSection }       from "./sections/pricing-guide";
import { DiscoveryCallSection, DiscoveryCallPlaceholder } from "./sections/discovery-call";
import { DmScriptSection, DmScriptPlaceholder } from "./sections/dm-script";
import { UpsellSection, UpsellPlaceholder } from "./sections/upsell-sequence";
import { LaunchRoadmapSection, LaunchRoadmapPlaceholder } from "./sections/launch-roadmap";

// ── Tab definitions ───────────────────────────────────────────────────────────

type NavTab = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  groupLabel?: string;     // defined only on the first tab of each group
  highlight?: boolean;
};

const CHALLENGE_TABS: NavTab[] = [
  { id: "highlevel",     label: "Clone to GHL",     icon: Layers,        highlight: true, group: "export",     groupLabel: "Export" },
  { id: "ghlInspector",  label: "GHL Inspector",    icon: Microscope,                     group: "export" },
  { id: "funnelPreview", label: "Funnel Preview",   icon: LayoutTemplate,                 group: "export" },
  { id: "offerSummary",  label: "Offer Summary",    icon: Target,                         group: "overview",   groupLabel: "Overview" },
  { id: "landingPage",   label: "Landing Page",     icon: FileText,                       group: "pages",      groupLabel: "Pages" },
  { id: "optInForm",     label: "Opt-in Form",      icon: FormInput,                      group: "pages" },
  { id: "thankYouPage",  label: "Thank You",        icon: ThumbsUp,                       group: "pages" },
  { id: "bookingPage",   label: "Booking Page",     icon: Calendar,                       group: "pages" },
  { id: "emailSequence", label: "Email Sequence",   icon: Mail,                           group: "sequences",  groupLabel: "Sequences" },
  { id: "smsSequence",   label: "SMS Sequence",     icon: MessageSquare,                  group: "sequences" },
  { id: "nurtureSequence",label:"52-Wk Nurture",    icon: CalendarDays,                   group: "sequences" },
  { id: "adCopy",        label: "Ad Copy",          icon: Megaphone,                      group: "ads",        groupLabel: "Ads" },
  { id: "creativePrompts",label:"Creatives",         icon: ImageIcon,                      group: "ads" },
  { id: "campaignNaming",label: "Campaign",         icon: BarChart3,                      group: "ads" },
  { id: "salesLetter",   label: "Sales Letter",     icon: FileText,                       group: "longform",   groupLabel: "Long-Form" },
  { id: "workoutPlan",   label: "Workout Plan",     icon: Dumbbell,                       group: "longform" },
  { id: "pricingGuide",  label: "Pricing Guide",    icon: BadgeDollarSign,                group: "coaching",   groupLabel: "Coaching" },
  { id: "discoveryCall", label: "Discovery Call",   icon: Phone,                          group: "coaching" },
  { id: "contentCalendar",label:"Content Calendar", icon: CalendarRange,                  group: "coaching" },
  { id: "deliveryPack",  label: "Delivery Pack",    icon: Package,                        group: "coaching" },
  { id: "testimonialHarvest",label:"Testimonials",  icon: Star,                           group: "coaching" },
  { id: "dmScript",      label: "DM Scripts",       icon: MessageCircle,                  group: "coaching" },
  { id: "upsellSequence",label: "Upsell Sequence",  icon: TrendingUp,                     group: "coaching" },
  { id: "launchRoadmap", label: "Launch Roadmap",   icon: Map,                            group: "coaching" },
];

const APPLICATION_TABS: NavTab[] = [
  { id: "highlevel",     label: "Clone to GHL",     icon: Layers,        highlight: true, group: "export",     groupLabel: "Export" },
  { id: "ghlInspector",  label: "GHL Inspector",    icon: Microscope,                     group: "export" },
  { id: "funnelPreview", label: "Page Preview",     icon: LayoutTemplate,                 group: "export" },
  { id: "offerSummary",  label: "Offer Summary",    icon: Target,                         group: "overview",   groupLabel: "Overview" },
  { id: "landingPage",   label: "Registration Page",icon: FileText,                       group: "pages",      groupLabel: "Pages" },
  { id: "optInForm",     label: "Application Form", icon: FormInput,                      group: "pages" },
  { id: "thankYouPage",  label: "App Received",     icon: ThumbsUp,                       group: "pages" },
  { id: "bookingPage",   label: "Strategy Call",    icon: Calendar,                       group: "pages" },
  { id: "vslScript",     label: "VSL Script",       icon: Video,                          group: "content",    groupLabel: "Content" },
  { id: "emailSequence", label: "Email Sequence",   icon: Mail,                           group: "content" },
  { id: "smsSequence",   label: "SMS Follow-Up",    icon: MessageSquare,                  group: "content" },
  { id: "nurtureSequence",label:"52-Wk Nurture",    icon: CalendarDays,                   group: "content" },
  { id: "adCopy",        label: "Ad Copy",          icon: Megaphone,                      group: "ads",        groupLabel: "Ads" },
  { id: "creativePrompts",label:"Creatives",         icon: ImageIcon,                      group: "ads" },
  { id: "campaignNaming",label: "Campaign",         icon: BarChart3,                      group: "ads" },
  { id: "pricingGuide",  label: "Pricing Guide",    icon: BadgeDollarSign,                group: "coaching",   groupLabel: "Coaching" },
  { id: "discoveryCall", label: "Discovery Call",   icon: Phone,                          group: "coaching" },
  { id: "contentCalendar",label:"Content Calendar", icon: CalendarRange,                  group: "coaching" },
  { id: "testimonialHarvest",label:"Testimonials",  icon: Star,                           group: "coaching" },
  { id: "dmScript",      label: "DM Scripts",       icon: MessageCircle,                  group: "coaching" },
  { id: "upsellSequence",label: "Upsell Sequence",  icon: TrendingUp,                     group: "coaching" },
  { id: "launchRoadmap", label: "Launch Roadmap",   icon: Map,                            group: "coaching" },
];

type TabId = string;

interface ResultsShellProps {
  project: ProjectRow;
  outputs: Record<string, unknown>;
  isMock: boolean;
  hlConnected: boolean;
}

type SectionGroup = "offer-pages" | "sequences" | "ads";

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

const GROUP_LABEL: Record<SectionGroup, string> = {
  "offer-pages": "Pages & Offer",
  "sequences":   "Sequences",
  "ads":         "Ads & Campaign",
};

async function triggerLongFormGeneration(projectId: string): Promise<LongFormSalesAssets | null> {
  try {
    const res = await fetch("/api/generate-longform", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ projectId }),
    });
    if (!res.ok) return null;
    const { longFormAssets } = await res.json() as { longFormAssets: LongFormSalesAssets };
    return longFormAssets ?? null;
  } catch {
    return null;
  }
}

export function ResultsShell({ project, outputs, isMock, hlConnected }: ResultsShellProps) {
  const router = useRouter();

  const funnelType = (outputs.funnelType as "challenge" | "application" | undefined) ?? "challenge";
  const isApplication = funnelType === "application";
  const tabs = isApplication ? APPLICATION_TABS : CHALLENGE_TABS;

  const [activeTab, setActiveTab]     = useState<TabId>("highlevel");
  const [copiedAll, setCopiedAll]     = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenSection, setRegenSection] = useState<SectionGroup | null>(null);
  const [liveOutputs, setLiveOutputs]   = useState<Record<string, unknown>>(outputs);

  const [liveWorkoutPlan, setLiveWorkoutPlan]         = useState<WorkoutPlan | undefined>(outputs.workoutPlan as WorkoutPlan | undefined);
  const [liveLongFormAssets, setLiveLongFormAssets]   = useState<LongFormSalesAssets | undefined>(outputs.longFormAssets as LongFormSalesAssets | undefined);
  const [liveNurtureSequence, setLiveNurtureSequence] = useState<NurtureSequence | undefined>(outputs.nurtureSequence as NurtureSequence | undefined);
  const [liveDiscoveryCallScript, setLiveDiscoveryCallScript] = useState<DiscoveryCallScript | undefined>(outputs.discoveryCallScript as DiscoveryCallScript | undefined);
  const [liveDmScript, setLiveDmScript]               = useState<InstagramDmScript | undefined>(outputs.instagramDmScript as InstagramDmScript | undefined);
  const [liveUpsellSequence, setLiveUpsellSequence]   = useState<UpsellSequence | undefined>(outputs.upsellSequence as UpsellSequence | undefined);
  const [liveLaunchRoadmap, setLiveLaunchRoadmap]     = useState<LaunchRoadmap | undefined>(outputs.launchRoadmap as LaunchRoadmap | undefined);

  useEffect(() => { void triggerLongFormGeneration; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleWorkoutGenerated(plan: WorkoutPlan) {
    setLiveWorkoutPlan(plan);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, workoutPlan: plan }));
  }
  function handleLongFormGenerated(assets: LongFormSalesAssets) {
    setLiveLongFormAssets(assets);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, longFormAssets: assets }));
  }
  function handleNurtureGenerated(sequence: NurtureSequence) {
    setLiveNurtureSequence(sequence);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, nurtureSequence: sequence }));
  }
  function handleDiscoveryCallGenerated(script: DiscoveryCallScript) {
    setLiveDiscoveryCallScript(script);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, discoveryCallScript: script }));
  }
  function handleDmScriptGenerated(script: InstagramDmScript) {
    setLiveDmScript(script);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, instagramDmScript: script }));
  }
  function handleUpsellGenerated(seq: UpsellSequence) {
    setLiveUpsellSequence(seq);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, upsellSequence: seq }));
  }
  function handleLaunchRoadmapGenerated(roadmap: LaunchRoadmap) {
    setLiveLaunchRoadmap(roadmap);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, launchRoadmap: roadmap }));
  }

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
      const startRes = await fetch(`/api/regenerate/${project.id}`, { method: "POST" });
      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${startRes.status}`);
      }
      const { inputs } = await startRes.json() as { inputs: unknown; projectId: string };
      fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projectId: project.id, inputs }),
        keepalive: true,
      }).catch((err) => { console.error("[regenerate] fetch error:", err); });
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
    funnelPreview:   <FunnelPreviewSection   data={assets} projectId={project.id} funnelType={funnelType} copywriterStyle={assets.copywriterStyle} />,
    ghlInspector:    <GhlInspectorSection    projectId={project.id} />,
    offerSummary:    <OfferSummarySection    data={assets.offerSummary} copywriterStyle={assets.copywriterStyle} />,
    landingPage: isApplication
      ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">22-Section Registration Page</p>
              <p className="text-sm text-blue-700 mt-1">
                Your registration page has been generated and is ready to preview and export to GHL.
                Use the <strong>Page Preview</strong> tab to see it in full, or click{" "}
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
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Programme Pillars</p>
                    <p className="text-gray-800">{assets.applicationLandingPage.benefitBlocks.length} benefit blocks</p>
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
    nurtureSequence: liveNurtureSequence
      ? <NurtureSection data={liveNurtureSequence} projectId={project.id} onRegenerate={handleNurtureGenerated} />
      : <NurturePlaceholder projectId={project.id} onGenerated={handleNurtureGenerated} />,
    ...((!isApplication) && {
      workoutPlan: liveWorkoutPlan
        ? <WorkoutPlanSection data={liveWorkoutPlan} projectId={project.id} onRegenerate={handleWorkoutGenerated} />
        : <WorkoutPlanPlaceholder projectId={project.id} onGenerated={handleWorkoutGenerated} />,
      salesLetter: liveLongFormAssets
        ? <SalesLetterSection data={liveLongFormAssets.salesLetter} projectId={project.id} onRegenerate={handleLongFormGenerated} />
        : <LongFormPlaceholder projectId={project.id} onGenerated={handleLongFormGenerated} />,
      deliveryPack: assets.deliveryPack
        ? <DeliveryPackSection data={assets.deliveryPack as DeliveryPack} />
        : null,
    }),
    ...(isApplication && {
      vslScript: assets.vslScript
        ? <VslScriptSection data={assets.vslScript} />
        : <VslScriptPlaceholder />,
      manyChatFlow: liveLongFormAssets
        ? <ManyChatFlowSection data={liveLongFormAssets.manyChatFlow} />
        : <LongFormPlaceholder projectId={project.id} onGenerated={handleLongFormGenerated} generating />,
    }),
    contentCalendar:    assets.contentCalendar
      ? <ContentCalendarSection data={assets.contentCalendar as ContentCalendar} />
      : null,
    testimonialHarvest: assets.testimonialHarvestSequence
      ? <TestimonialHarvestSection data={assets.testimonialHarvestSequence as TestimonialHarvestSequence} />
      : null,
    pricingGuide:       assets.pricingGuide
      ? <PricingGuideSection data={assets.pricingGuide as PricingGuide} />
      : null,
    discoveryCall: liveDiscoveryCallScript
      ? <DiscoveryCallSection data={liveDiscoveryCallScript} projectId={project.id} onRegenerate={handleDiscoveryCallGenerated} />
      : <DiscoveryCallPlaceholder projectId={project.id} onGenerated={handleDiscoveryCallGenerated} />,
    dmScript: liveDmScript
      ? <DmScriptSection data={liveDmScript} projectId={project.id} onRegenerate={handleDmScriptGenerated} />
      : <DmScriptPlaceholder projectId={project.id} onGenerated={handleDmScriptGenerated} />,
    upsellSequence: liveUpsellSequence
      ? <UpsellSection data={liveUpsellSequence} projectId={project.id} onRegenerate={handleUpsellGenerated} />
      : <UpsellPlaceholder projectId={project.id} onGenerated={handleUpsellGenerated} />,
    launchRoadmap: liveLaunchRoadmap
      ? <LaunchRoadmapSection data={liveLaunchRoadmap} projectId={project.id} onRegenerate={handleLaunchRoadmapGenerated} />
      : <LaunchRoadmapPlaceholder projectId={project.id} onGenerated={handleLaunchRoadmapGenerated} />,
  };

  // Build grouped nav structure from tabs
  const grouped: Array<{ label: string; items: NavTab[] }> = [];
  for (const tab of tabs) {
    if (tab.groupLabel !== undefined) {
      grouped.push({ label: tab.groupLabel, items: [tab] });
    } else {
      grouped[grouped.length - 1]?.items.push(tab);
    }
  }

  const activeTabDef = tabs.find(t => t.id === activeTab);
  const sectionGroup = TAB_SECTION_GROUP[activeTab];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isApplication
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {isApplication ? "Application Funnel" : "Challenge Funnel"}
              </span>
              {typeof outputs.copywriterStyle === "string" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 border border-orange-200">
                  <Pen className="h-3 w-3" />
                  {outputs.copywriterStyle.split(" — ")[0]}
                </span>
              )}
              {isMock && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                  <FlaskConical className="h-3 w-3" />
                  Demo content
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "Starting…" : "Regenerate"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Export JSON</>
            }
          </Button>
        </div>
      </div>

      {/* ── Body: sidebar + content ─────────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* Sidebar */}
        <nav className="w-52 shrink-0 rounded-2xl border border-gray-200 bg-white py-4 overflow-hidden sticky top-4">
          {grouped.map(({ label, items }) => (
            <div key={label} className="mb-5 last:mb-0">
              <p className="px-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {label}
              </p>
              <div className="space-y-0.5 px-2">
                {items.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isHL = !!tab.highlight;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                        isActive && isHL
                          ? "bg-[#1a56db] text-white shadow-sm"
                          : isActive
                          ? "bg-gray-100 text-gray-900"
                          : isHL
                          ? "text-[#1a56db] hover:bg-[#e8f0fe]"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              {activeTabDef && (
                <div className="flex items-center gap-2">
                  <activeTabDef.icon className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">{activeTabDef.label}</h2>
                </div>
              )}
            </div>
            {sectionGroup && (
              <button
                onClick={() => handleRegenerateSection(sectionGroup)}
                disabled={!!regenSection}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${regenSection === sectionGroup ? "animate-spin" : ""}`} />
                {regenSection === sectionGroup ? "Regenerating…" : "Regenerate section"}
              </button>
            )}
          </div>

          {/* Section content */}
          <div key={activeTab} className="animate-fade-in">
            {sections[activeTab] ?? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-sm text-gray-400">
                No content available for this section yet.
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
