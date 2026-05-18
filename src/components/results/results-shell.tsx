"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Copy, Check, Target, FileText, FormInput,
  ThumbsUp, Calendar, MessageSquare, Mail, Megaphone,
  ImageIcon, BarChart3, FlaskConical, Layers, LayoutTemplate, RefreshCw, Microscope,
  Dumbbell, MessageCircle, CalendarDays, Pen, Video,
  CalendarRange, Package, Star, BadgeDollarSign, Phone, Map, TrendingUp, Download, Rocket,
  ChevronDown, ChevronRight, X, Salad, Puzzle, Zap, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { ProjectRow } from "@/types/project";
import type { GeneratedFunnelAssets, WorkoutPlan, NurtureSequence, ContentCalendar, DeliveryPack, TestimonialHarvestSequence, PricingGuide, NutritionPlan } from "@/types/generation";
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
import { NutritionPlanSection, NutritionPlanPlaceholder } from "./sections/nutrition-plan";
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
import { ApplicationLandingPageSection } from "./sections/application-landing-page";
import { PerformanceTrackerSection } from "./sections/performance-tracker";
import { ExportSection } from "./sections/export-section";
import { StartHereSection } from "./sections/start-here";
import { ExtensionDownloadSection } from "./sections/extension-download";

// ── Tab definitions ───────────────────────────────────────────────────────────

type NavTab = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  groupLabel?: string;     // defined only on the first tab of each group
  highlight?: boolean;
  hidden?: boolean;        // excluded from sidebar nav (still accessible programmatically)
};

const CHALLENGE_TABS: NavTab[] = [
  // ── Launch ──────────────────────────────────────────────────────────────────
  { id: "startHere",          label: "Start Here",        icon: Rocket,         highlight: true, group: "start",     groupLabel: "Launch" },
  // ── Your Pages ──────────────────────────────────────────────────────────────
  { id: "highlevel",          label: "Clone to GHL",      icon: Layers,                          group: "pages",     groupLabel: "Your Pages" },
  { id: "ghlInspector",       label: "GHL Inspector",     icon: Microscope,     hidden: true,    group: "pages" },
  { id: "funnelPreview",      label: "Funnel Pages",      icon: LayoutTemplate,                  group: "pages" },
  { id: "offerSummary",       label: "",                  icon: Target,         hidden: true,    group: "pages" },
  { id: "exportCopy",         label: "Export Copy",       icon: Download,                        group: "pages" },
  // ── Getting Clients ─────────────────────────────────────────────────────────
  { id: "emailSequence",      label: "Email Sequence",    icon: Mail,                            group: "clients",   groupLabel: "Getting Clients" },
  { id: "smsSequence",        label: "SMS Sequence",      icon: MessageSquare,                   group: "clients" },
  { id: "dmScript",           label: "DM Scripts",        icon: MessageCircle,                   group: "clients" },
  { id: "discoveryCall",      label: "Sales Script",      icon: Phone,                           group: "clients" },
  { id: "salesLetter",        label: "Sales Letter",      icon: FileText,                        group: "clients" },
  { id: "pricingGuide",       label: "Pricing Guide",     icon: BadgeDollarSign,                 group: "clients" },
  // ── Nurturing Leads ─────────────────────────────────────────────────────────
  { id: "contentCalendar",    label: "Content Engine",    icon: CalendarRange,                   group: "nurture",   groupLabel: "Nurturing Leads" },
  { id: "nurtureSequence",    label: "52-Wk Nurture",     icon: CalendarDays,                    group: "nurture" },
  // ── Coaching Clients ────────────────────────────────────────────────────────
  { id: "launchRoadmap",      label: "Launch Roadmap",    icon: Map,                             group: "coaching",  groupLabel: "Coaching Clients" },
  { id: "workoutPlan",        label: "Workout Plan",      icon: Dumbbell,                        group: "coaching" },
  { id: "nutritionPlan",      label: "Nutrition Plan",    icon: Salad,                           group: "coaching" },
  { id: "deliveryPack",       label: "Delivery Pack",     icon: Package,                         group: "coaching" },
  // ── Getting Referrals ───────────────────────────────────────────────────────
  { id: "testimonialHarvest", label: "Testimonials",      icon: Star,                            group: "referrals", groupLabel: "Getting Referrals" },
  { id: "upsellSequence",     label: "Upsell Sequence",   icon: TrendingUp,                      group: "referrals" },
  // ── AD Engine ───────────────────────────────────────────────────────────────
  { id: "adCopy",             label: "Ad Copy",           icon: Megaphone,                       group: "ads",       groupLabel: "AD Engine" },
  { id: "creativePrompts",    label: "Ad Creatives",      icon: ImageIcon,                       group: "ads" },
  { id: "campaignNaming",     label: "Campaign Naming",   icon: BarChart3,                       group: "ads" },
  { id: "performance",        label: "Performance",       icon: TrendingUp,                      group: "ads" },
];

const APPLICATION_TABS: NavTab[] = [
  // ── Launch ──────────────────────────────────────────────────────────────────
  { id: "startHere",          label: "Start Here",        icon: Rocket,         highlight: true, group: "start",     groupLabel: "Launch" },
  // ── Your Pages ──────────────────────────────────────────────────────────────
  { id: "highlevel",          label: "Clone to GHL",      icon: Layers,                          group: "pages",     groupLabel: "Your Pages" },
  { id: "ghlInspector",       label: "GHL Inspector",     icon: Microscope,     hidden: true,    group: "pages" },
  { id: "funnelPreview",      label: "Funnel Pages",      icon: LayoutTemplate,                  group: "pages" },
  { id: "offerSummary",       label: "",                  icon: Target,         hidden: true,    group: "pages" },
  { id: "appLanding",         label: "",                  icon: FileText,       hidden: true,    group: "pages" },
  { id: "exportCopy",         label: "Export Copy",       icon: Download,                        group: "pages" },
  // ── Getting Clients ─────────────────────────────────────────────────────────
  { id: "emailSequence",      label: "Email Sequence",    icon: Mail,                            group: "clients",   groupLabel: "Getting Clients" },
  { id: "smsSequence",        label: "SMS Follow-Up",     icon: MessageSquare,                   group: "clients" },
  { id: "dmScript",           label: "DM Scripts",        icon: MessageCircle,                   group: "clients" },
  { id: "vslScript",          label: "VSL Script",        icon: Video,                           group: "clients" },
  { id: "discoveryCall",      label: "Sales Script",      icon: Phone,                           group: "clients" },
  { id: "pricingGuide",       label: "Pricing Guide",     icon: BadgeDollarSign,                 group: "clients" },
  // ── Nurturing Leads ─────────────────────────────────────────────────────────
  { id: "contentCalendar",    label: "Content Engine",    icon: CalendarRange,                   group: "nurture",   groupLabel: "Nurturing Leads" },
  { id: "nurtureSequence",    label: "52-Wk Nurture",     icon: CalendarDays,                    group: "nurture" },
  { id: "manyChatFlow",       label: "ManyChat Flow",     icon: MessageCircle,                   group: "nurture" },
  // ── Coaching Clients ────────────────────────────────────────────────────────
  { id: "launchRoadmap",      label: "Launch Roadmap",    icon: Map,                             group: "coaching",  groupLabel: "Coaching Clients" },
  { id: "workoutPlan",        label: "Workout Plan",      icon: Dumbbell,                        group: "coaching" },
  { id: "nutritionPlan",      label: "Nutrition Plan",    icon: Salad,                           group: "coaching" },
  // ── Getting Referrals ───────────────────────────────────────────────────────
  { id: "testimonialHarvest", label: "Testimonials",      icon: Star,                            group: "referrals", groupLabel: "Getting Referrals" },
  { id: "upsellSequence",     label: "Upsell Sequence",   icon: TrendingUp,                      group: "referrals" },
  // ── AD Engine ───────────────────────────────────────────────────────────────
  { id: "adCopy",             label: "Ad Copy",           icon: Megaphone,                       group: "ads",       groupLabel: "AD Engine" },
  { id: "creativePrompts",    label: "Ad Creatives",      icon: ImageIcon,                       group: "ads" },
  { id: "campaignNaming",     label: "Campaign Naming",   icon: BarChart3,                       group: "ads" },
  { id: "performance",        label: "Performance",       icon: TrendingUp,                      group: "ads" },
];

type TabId = string;

interface ResultsShellProps {
  project: ProjectRow;
  outputs: Record<string, unknown>;
  isMock: boolean;
  hlConnected: boolean;
  notionConnected: boolean;
}

type SectionGroup = "offer-pages" | "sequences" | "ads" | "content" | "coaching-tools";

const TAB_SECTION_GROUP: Partial<Record<TabId, SectionGroup>> = {
  offerSummary:               "offer-pages",
  landingPage:                "offer-pages",
  optInForm:                  "offer-pages",
  thankYouPage:               "offer-pages",
  bookingPage:                "offer-pages",
  smsSequence:                "sequences",
  emailSequence:              "sequences",
  adCopy:                     "ads",
  creativePrompts:            "ads",
  campaignNaming:             "ads",
  contentCalendar:            "content",
  deliveryPack:               "content",
  testimonialHarvest:         "coaching-tools",
  pricingGuide:               "coaching-tools",
};

const GROUP_LABEL: Record<SectionGroup, string> = {
  "offer-pages":    "Pages & Offer",
  "sequences":      "Sequences",
  "ads":            "Ads & Campaign",
  "content":        "Content & Delivery",
  "coaching-tools": "Coaching Tools",
};

const SIDEBAR_STORAGE_KEY = "fitpro_sidebar_collapsed_groups";
const RESULTS_SEEN_KEY    = "fitpro_results_seen";
const DEFAULT_COLLAPSED = new Set(["Your Pages", "Getting Clients", "Nurturing Leads", "Coaching Clients", "Getting Referrals", "AD Engine"]);

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

export function ResultsShell({ project, outputs, isMock, hlConnected, notionConnected }: ResultsShellProps) {
  const router = useRouter();

  const funnelType = (outputs.funnelType as "challenge" | "application" | undefined) ?? "challenge";
  const isApplication = funnelType === "application";
  const tabs = isApplication ? APPLICATION_TABS : CHALLENGE_TABS;

  const [activeTab, setActiveTab]     = useState<TabId>("startHere");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return DEFAULT_COLLAPSED;
    try {
      const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored) return new Set(JSON.parse(stored) as string[]);
    } catch {}
    return DEFAULT_COLLAPSED;
  });
  const [showNewBanner, setShowNewBanner] = useState(false);
  const [copiedAll, setCopiedAll]     = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenSection, setRegenSection] = useState<SectionGroup | null>(null);
  const [liveOutputs, setLiveOutputs]   = useState<Record<string, unknown>>(outputs);

  const [liveWorkoutPlan, setLiveWorkoutPlan]         = useState<WorkoutPlan | undefined>(outputs.workoutPlan as WorkoutPlan | undefined);
  const [liveNutritionPlan, setLiveNutritionPlan]     = useState<NutritionPlan | undefined>(outputs.nutritionPlan as NutritionPlan | undefined);
  const [liveLongFormAssets, setLiveLongFormAssets]   = useState<LongFormSalesAssets | undefined>(outputs.longFormAssets as LongFormSalesAssets | undefined);
  const [liveNurtureSequence, setLiveNurtureSequence] = useState<NurtureSequence | undefined>(outputs.nurtureSequence as NurtureSequence | undefined);
  const [liveDiscoveryCallScript, setLiveDiscoveryCallScript] = useState<DiscoveryCallScript | undefined>(outputs.discoveryCallScript as DiscoveryCallScript | undefined);
  const [liveDmScript, setLiveDmScript]               = useState<InstagramDmScript | undefined>(outputs.instagramDmScript as InstagramDmScript | undefined);
  const [liveUpsellSequence, setLiveUpsellSequence]   = useState<UpsellSequence | undefined>(outputs.upsellSequence as UpsellSequence | undefined);
  const [liveLaunchRoadmap, setLiveLaunchRoadmap]     = useState<LaunchRoadmap | undefined>(outputs.launchRoadmap as LaunchRoadmap | undefined);

  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress]     = useState<Record<string, "idle" | "loading" | "done" | "error">>({});

  // Mobile nav scroll refs — keep active pills in view
  const mobileGroupRowRef = useRef<HTMLDivElement>(null);
  const mobileTabRowRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(RESULTS_SEEN_KEY)) {
        setShowNewBanner(true);
        window.localStorage.setItem(RESULTS_SEEN_KEY, "1");
      }
    } catch {}
  }, []);

  // Auto-scroll active group pill and tab pill into view on mobile
  useEffect(() => {
    const groupEl = mobileGroupRowRef.current?.querySelector<HTMLElement>('[data-active-group="true"]');
    groupEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  useEffect(() => {
    const tabEl = mobileTabRowRef.current?.querySelector<HTMLElement>('[data-active-tab="true"]');
    tabEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      try { window.localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  function handleNavigate(tabId: TabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      const group = grouped.find(g => g.items.some(i => i.id === tabId));
      if (group && collapsedGroups.has(group.label)) {
        setCollapsedGroups((prev) => {
          const next = new Set(prev);
          next.delete(group.label);
          try { window.localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify([...next])); } catch {}
          return next;
        });
      }
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleWorkoutGenerated(plan: WorkoutPlan) {
    setLiveWorkoutPlan(plan);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, workoutPlan: plan }));
  }
  function handleNutritionGenerated(plan: NutritionPlan) {
    setLiveNutritionPlan(plan);
    setLiveOutputs((p: Record<string, unknown>) => ({ ...p, nutritionPlan: plan }));
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

  async function handleGenerateAll() {
    if (bulkGenerating) return;
    const toGenerate: Array<{ key: string; endpoint: string }> = [];
    if (!liveLongFormAssets)       toGenerate.push({ key: "longform",  endpoint: "/api/generate-longform" });
    if (!liveNurtureSequence)      toGenerate.push({ key: "nurture",   endpoint: "/api/generate-nurture" });
    if (!liveDiscoveryCallScript)  toGenerate.push({ key: "discovery", endpoint: "/api/generate-discovery-call" });
    if (!liveDmScript)             toGenerate.push({ key: "dm",        endpoint: "/api/generate-dm-script" });
    if (!liveUpsellSequence)       toGenerate.push({ key: "upsell",    endpoint: "/api/generate-upsell" });
    if (!liveLaunchRoadmap)        toGenerate.push({ key: "roadmap",   endpoint: "/api/generate-launch-roadmap" });
    if (toGenerate.length === 0) return;

    setBulkGenerating(true);
    const initial: Record<string, "loading"> = {};
    for (const t of toGenerate) initial[t.key] = "loading";
    setBulkProgress(initial);

    const fetchTool = async (key: string, endpoint: string) => {
      try {
        const res = await fetch(endpoint, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ projectId: project.id }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as Record<string, unknown>;
        if (key === "longform"  && data.longFormAssets)      handleLongFormGenerated(data.longFormAssets as LongFormSalesAssets);
        if (key === "nurture"   && data.nurtureSequence)     handleNurtureGenerated(data.nurtureSequence as NurtureSequence);
        if (key === "discovery" && data.discoveryCallScript) handleDiscoveryCallGenerated(data.discoveryCallScript as DiscoveryCallScript);
        if (key === "dm"        && data.instagramDmScript)   handleDmScriptGenerated(data.instagramDmScript as InstagramDmScript);
        if (key === "upsell"    && data.upsellSequence)      handleUpsellGenerated(data.upsellSequence as UpsellSequence);
        if (key === "roadmap"   && data.launchRoadmap)       handleLaunchRoadmapGenerated(data.launchRoadmap as LaunchRoadmap);
        setBulkProgress(p => ({ ...p, [key]: "done" }));
      } catch {
        setBulkProgress(p => ({ ...p, [key]: "error" }));
      }
    };

    await Promise.allSettled(toGenerate.map(({ key, endpoint }) => fetchTool(key, endpoint)));
    setBulkGenerating(false);
    toast({ title: "All tools generated!", description: "Your Phase 2 Scale tools are ready." });
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
    startHere:       <StartHereSection       funnelType={funnelType} onNavigate={handleNavigate} />,
    highlevel: (
      <>
        <HighLevelSection data={assets} projectId={project.id} hlConnected={hlConnected} />
        <ExtensionDownloadSection />
      </>
    ),
    funnelPreview: (
      <div className="space-y-6">
        <FunnelPreviewSection data={assets} projectId={project.id} funnelType={funnelType} copywriterStyle={assets.copywriterStyle} />
        <div className="border-t border-white/[0.07] pt-6">
          <OfferSummarySection data={assets.offerSummary} copywriterStyle={assets.copywriterStyle} funnelType={funnelType} />
        </div>
        {isApplication && assets.applicationLandingPage && (
          <div className="border-t border-white/[0.07] pt-6">
            <ApplicationLandingPageSection data={assets.applicationLandingPage} />
          </div>
        )}
      </div>
    ),
    ghlInspector:    <GhlInspectorSection    projectId={project.id} />,
    offerSummary:    <OfferSummarySection    data={assets.offerSummary} copywriterStyle={assets.copywriterStyle} funnelType={funnelType} />,
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
                    <p className="text-gray-800">{(assets.applicationLandingPage.benefitBlocks ?? []).length} benefit blocks</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">FAQ Items</p>
                    <p className="text-gray-800">{assets.applicationLandingPage.faqItems.length} questions answered</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Qualifications</p>
                    <p className="text-gray-800">{(assets.applicationLandingPage.shouldApply ?? []).length} qualifiers · {(assets.applicationLandingPage.shouldNotApply ?? []).length} disqualifiers</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Client Wins</p>
                    <p className="text-gray-800">{(assets.applicationLandingPage.clientWins ?? []).length} results showcased</p>
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
    nutritionPlan: liveNutritionPlan
      ? <NutritionPlanSection data={liveNutritionPlan} projectId={project.id} onRegenerate={handleNutritionGenerated} />
      : <NutritionPlanPlaceholder projectId={project.id} onGenerated={handleNutritionGenerated} />,
    workoutPlan: liveWorkoutPlan
      ? <WorkoutPlanSection data={liveWorkoutPlan} projectId={project.id} onRegenerate={handleWorkoutGenerated} />
      : <WorkoutPlanPlaceholder projectId={project.id} onGenerated={handleWorkoutGenerated} />,
    ...((!isApplication) && {
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
    performance: <PerformanceTrackerSection projectId={project.id} />,
    exportCopy:  <ExportSection data={assets} projectId={project.id} projectName={project.name} notionConnected={notionConnected} hlConnected={hlConnected} />,
    ...(isApplication && assets.applicationLandingPage && {
      appLanding: <ApplicationLandingPageSection data={assets.applicationLandingPage} />,
    }),
  };

  // Build grouped nav structure from tabs (skip hidden tabs)
  const grouped: Array<{ label: string; items: NavTab[] }> = [];
  for (const tab of tabs) {
    if (tab.hidden) continue;
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
            <Button variant="ghost" size="sm" className="gap-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-100 truncate max-w-[56vw] sm:max-w-none">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isApplication
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {isApplication ? "Application Funnel" : "Challenge Funnel"}
              </span>
              {typeof outputs.copywriterStyle === "string" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400 border border-orange-500/20">
                  <Pen className="h-3 w-3" />
                  {outputs.copywriterStyle.split(" — ")[0]}
                </span>
              )}
              {isMock && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                  <FlaskConical className="h-3 w-3" />
                  Demo content
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="border border-white/[0.10] bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{regenerating ? "Starting…" : "Regenerate"}</span>
          </Button>
          <Button size="sm" onClick={handleCopyAll} className="border border-white/[0.10] bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100">
            {copiedAll
              ? <><Check className="h-3.5 w-3.5 text-green-400" /><span className="hidden sm:inline">Copied!</span></>
              : <><Copy className="h-3.5 w-3.5" /><span className="hidden sm:inline">Export JSON</span></>
            }
          </Button>
        </div>
      </div>

      {/* ── First-time banner ──────────────────────────────────────────── */}
      {showNewBanner && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Rocket className="h-4 w-4 shrink-0 text-orange-400" />
            <p className="text-sm text-orange-200">
              <span className="font-semibold">New here?</span> Start with the{" "}
              <button
                onClick={() => { handleNavigate("startHere"); setShowNewBanner(false); }}
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                Start Here
              </button>{" "}
              tab — it walks you through launching your funnel step by step.
            </p>
          </div>
          <button
            onClick={() => setShowNewBanner(false)}
            className="shrink-0 rounded-lg p-1 text-orange-400 hover:bg-orange-500/20 hover:text-orange-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Generate All card ──────────────────────────────────────────── */}
      {(() => {
        const TOOLS = [
          { key: "longform",  label: isApplication ? "ManyChat Flow" : "Sales Letter", done: !!liveLongFormAssets },
          { key: "nurture",   label: "52-Wk Nurture",   done: !!liveNurtureSequence },
          { key: "discovery", label: "Sales Script",     done: !!liveDiscoveryCallScript },
          { key: "dm",        label: "DM Scripts",        done: !!liveDmScript },
          { key: "upsell",    label: "Upsell Sequence",  done: !!liveUpsellSequence },
          { key: "roadmap",   label: "Launch Roadmap",   done: !!liveLaunchRoadmap },
        ];
        const missingCount = TOOLS.filter(t => !t.done).length;
        if (missingCount === 0) return null;
        return (
          <div className="rounded-xl border border-white/[0.08] bg-[#0d0d10] px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-orange-400 shrink-0" />
                  <p className="text-sm font-semibold text-zinc-100">Generate All Tools</p>
                  <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-400">
                    {missingCount} remaining
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {TOOLS.map(({ key, label, done }, idx) => {
                    const status = done ? "done" : (bulkProgress[key] ?? "idle");
                    // If bulk is running, anything still idle after the current loading one is "queued"
                    const prevLoading = bulkGenerating && TOOLS.slice(0, idx).some(t => !t.done && (bulkProgress[t.key] ?? "idle") === "loading");
                    const isQueued = bulkGenerating && status === "idle" && !prevLoading;
                    return (
                      <span
                        key={key}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all ${
                          status === "done"    ? "bg-green-500/10  border-green-500/20  text-green-400" :
                          status === "loading" ? "bg-orange-500/15 border-orange-500/30 text-orange-300" :
                          status === "error"   ? "bg-red-500/10    border-red-500/20    text-red-400"   :
                          isQueued            ? "bg-white/[0.04]  border-white/[0.06]  text-zinc-600"  :
                                                "bg-white/[0.04]  border-white/[0.08]  text-zinc-500"
                        }`}
                      >
                        {status === "loading" && <Loader2 className="h-3 w-3 animate-spin text-orange-400" />}
                        {status === "done"    && <Check   className="h-3 w-3" />}
                        {label}
                      </span>
                    );
                  })}
                </div>
                {bulkGenerating && (() => {
                  const current = TOOLS.find(t => !t.done && (bulkProgress[t.key] ?? "idle") === "loading");
                  return current ? (
                    <p className="mt-2 text-xs text-zinc-500">
                      <span className="text-orange-400 font-medium">Generating {current.label}…</span>
                      {" "}This takes 30–90 seconds per tool.
                    </p>
                  ) : null;
                })()}
              </div>
              <button
                onClick={() => { void handleGenerateAll(); }}
                disabled={bulkGenerating}
                className="shrink-0 flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
              >
                {bulkGenerating
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                  : <><Zap className="h-4 w-4" /> Generate {missingCount} tool{missingCount !== 1 ? "s" : ""}</>
                }
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Mobile tab nav (hidden on sm+) ─────────────────────────────── */}
      <div className="sm:hidden space-y-2">
        {/* Group row */}
        <div ref={mobileGroupRowRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
          {grouped.map(({ label, items }) => {
            const isActiveGroup = items.some(t => t.id === activeTab);
            return (
              <button
                key={label}
                data-active-group={isActiveGroup}
                onClick={() => { if (!isActiveGroup) handleNavigate(items[0].id); }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isActiveGroup
                    ? "bg-white/[0.12] text-zinc-100"
                    : "bg-white/[0.04] text-zinc-500 active:text-zinc-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {/* Tab row within the active group */}
        <div ref={mobileTabRowRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {grouped.find(g => g.items.some(t => t.id === activeTab))?.items.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-active-tab={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive && tab.highlight
                    ? "bg-orange-500 text-white"
                    : isActive
                    ? "bg-white/[0.10] text-zinc-100"
                    : "bg-white/[0.04] text-zinc-500 active:text-zinc-300"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {/* Active section label — persists when scrolled into content */}
        {(() => {
          const activeTabDef = tabs.find(t => t.id === activeTab);
          const activeGroup  = grouped.find(g => g.items.some(t => t.id === activeTab));
          if (!activeTabDef) return null;
          return (
            <div className="flex items-center gap-2 pt-0.5">
              <activeTabDef.icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span className="text-sm font-semibold text-zinc-200 truncate">{activeTabDef.label}</span>
              {activeGroup && (
                <span className="text-xs text-zinc-600 truncate">· {activeGroup.label}</span>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Body: sidebar + content ─────────────────────────────────────── */}
      <div className="sm:flex sm:gap-5 sm:items-start">

        {/* Sidebar — desktop only */}
        <nav className="hidden sm:block w-56 shrink-0 rounded-2xl border border-white/[0.07] bg-[#0d0d10] py-4 overflow-y-auto max-h-[calc(100vh-8rem)] sticky top-4">
          {grouped.map(({ label, items }) => {
            const isCollapsed = collapsedGroups.has(label);
            const hasActive = items.some(t => t.id === activeTab);
            return (
              <div key={label} className="mb-4 last:mb-0">
                <button
                  onClick={() => toggleGroup(label)}
                  className="flex w-full items-center justify-between px-4 pb-1.5 text-left"
                >
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    hasActive ? "text-zinc-300" : "text-zinc-400"
                  }`}>
                    {label}
                  </span>
                  {isCollapsed
                    ? <ChevronRight className="h-3 w-3 text-zinc-400" />
                    : <ChevronDown  className="h-3 w-3 text-zinc-400" />
                  }
                </button>
                {!isCollapsed && (
                  <div className="space-y-0.5 px-2">
                    {items.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const isHL = !!tab.highlight;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: "instant" }); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                            isActive && isHL
                              ? "bg-orange-500 text-white shadow-sm"
                              : isActive
                              ? "bg-white/[0.08] text-zinc-100"
                              : isHL
                              ? "text-orange-400 hover:bg-orange-500/10"
                              : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"
                          }`}
                        >
                          <tab.icon className="h-4 w-4 shrink-0 opacity-80" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Content area */}
        <div className="min-w-0 sm:flex-1 space-y-4">

          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              {activeTabDef && (
                <div className="flex items-center gap-2">
                  <activeTabDef.icon className="h-5 w-5 text-zinc-500" />
                  <h2 className="text-lg font-semibold text-zinc-100">{activeTabDef.label}</h2>
                </div>
              )}
            </div>
            {sectionGroup && (
              <button
                onClick={() => handleRegenerateSection(sectionGroup)}
                disabled={!!regenSection}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${regenSection === sectionGroup ? "animate-spin" : ""}`} />
                {regenSection === sectionGroup ? "Regenerating…" : "Regenerate section"}
              </button>
            )}
          </div>

          {/* Section content */}
          <div key={activeTab} className="animate-fade-in">
            {sections[activeTab] ?? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#111113] py-16 text-sm text-zinc-600">
                No content available for this section yet.
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
