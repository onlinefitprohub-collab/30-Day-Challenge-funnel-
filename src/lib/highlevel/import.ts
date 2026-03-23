import { hlFetch } from "./client";
import type { GeneratedFunnelAssets } from "@/types/generation";
import {
  generateLandingPageHtml,
  generateOptInPageHtml,
  generateThankYouPageHtml,
  generateBookingPageHtml,
} from "./page-html";
import {
  buildLandingPageData,
  buildOptInPageData,
  buildThankYouPageData,
  buildBookingPageData,
  type GhlPageData,
} from "./ghl-pagedata";

export interface HLFunnelStep {
  id: string;
  name: string;
  pageId?: string;
  nativePage?: boolean;
}

export interface HLImportResult {
  funnelId?: string;
  funnelUrl?: string;
  funnelSteps?: HLFunnelStep[];
  nativePages?: { stepName: string; written: boolean }[];
  errors: string[];
}

function extractId(data: Record<string, unknown>, ...nestedKeys: string[]): string | undefined {
  for (const key of nestedKeys) {
    const nested = data[key] as Record<string, unknown> | undefined;
    if (nested?.id) return nested.id as string;
  }
  return data.id as string | undefined;
}

function extractPageId(data: Record<string, unknown>): string | undefined {
  if (data.pageId) return data.pageId as string;
  const page = data.page as Record<string, unknown> | undefined;
  if (page?.id) return page.id as string;
  const step = data.step as Record<string, unknown> | undefined;
  if (step?.pageId) return step.pageId as string;
  if (step?.page) {
    const sp = step.page as Record<string, unknown>;
    if (sp?.id) return sp.id as string;
  }
  return undefined;
}

async function tryCreateFunnelStep(
  funnelId: string,
  locationId: string,
  apiKey: string,
  name: string,
  pageType: string,
  htmlBody?: string,
): Promise<HLFunnelStep | null> {
  const payload: Record<string, unknown> = {
    locationId,
    funnelId,
    name,
    type: pageType,
    ...(htmlBody ? { body: htmlBody, html: htmlBody } : {}),
  };

  const paths = [
    `/funnels/${funnelId}/steps`,
    `/funnels/${funnelId}/pages`,
    `/funnel-pages`,
  ];

  for (const path of paths) {
    try {
      const res = await hlFetch(path, apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        const id     = extractId(data, "page", "funnelPage", "step") ?? `${name}-id`;
        const pageId = extractPageId(data);
        return { id, name, ...(pageId ? { pageId } : {}) };
      }
    } catch {
      // Try next path
    }
  }
  return null;
}

async function tryPostPageData(
  pageId: string,
  funnelId: string,
  locationId: string,
  apiKey: string,
  pageData: GhlPageData,
): Promise<boolean> {
  const payload = { pageData, locationId, pageId, isPublished: false, write: false };

  // PUT is the primary method per GHL pageData API spec
  const putPaths = [
    `/funnels/funnel/page/${pageId}`,
    `/funnels/${funnelId}/pages/${pageId}`,
  ];
  for (const path of putPaths) {
    try {
      const res = await hlFetch(path, apiKey, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
      if (res.status === 404) continue;
    } catch {
      // Try next path
    }
  }

  // POST fallback for accounts using a different endpoint shape
  const postPaths = [
    `/funnels/funnel/page/${pageId}`,
    `/funnels/${funnelId}/pages/${pageId}`,
    `/funnels/${funnelId}/steps/${pageId}/pageData`,
    `/funnel-pages/${pageId}`,
  ];
  for (const path of postPaths) {
    try {
      const res = await hlFetch(path, apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
      if (res.status === 404) continue;
    } catch {
      // Try next path
    }
  }

  return false;
}

export async function importToHighLevel(
  locationId: string,
  apiKey: string,
  assets: GeneratedFunnelAssets,
): Promise<HLImportResult> {
  const result: HLImportResult = {
    errors: [],
  };

  // ── Step 1: Funnel creation ───────────────────────────────────────────────
  let funnelId: string | undefined;
  try {
    const funnelName = assets.offerSummary?.challengeConcept ?? "30-Day Challenge Funnel";
    const funnelEndpoints = ["/funnels", "/funnels/"];
    let funnelRes: Response | null = null;
    for (const endpoint of funnelEndpoints) {
      const r = await hlFetch(endpoint, apiKey, {
        method: "POST",
        body: JSON.stringify({ locationId, name: funnelName, type: "funnel" }),
      });
      if (r.ok || (r.status !== 404 && r.status !== 405)) {
        funnelRes = r;
        break;
      }
    }
    const res = funnelRes!;

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      funnelId = extractId(data, "funnel");
      if (funnelId) {
        result.funnelId  = funnelId;
        result.funnelUrl = `https://app.gohighlevel.com/v2/location/${locationId}/funnels/${funnelId}`;
      }
    } else {
      let errText = "";
      try { errText = await res.text(); } catch { errText = "Unknown"; }
      if (res.status === 401 && errText.includes("IAM Service")) {
        result.errors.push(
          `Funnel creation failed: your API key doesn't have Funnels scope. In HighLevel go to Settings → Integrations → Private Integration → Edit Scopes and enable "Funnels".`
        );
      } else if (res.status !== 404) {
        result.errors.push(`Funnel creation skipped: ${res.status} ${errText.slice(0, 120)}`);
      }
    }
  } catch (err) {
    result.errors.push(
      `Funnel creation skipped: ${err instanceof Error ? err.message : "Network error"}`,
    );
  }

  // ── Step 2: Funnel steps + native pageData ────────────────────────────────
  if (funnelId) {
    const steps: HLFunnelStep[] = [];
    const nativePages: { stepName: string; written: boolean }[] = [];

    const stepDefs: {
      name: string;
      type: string;
      htmlFn: (a: GeneratedFunnelAssets) => string;
      pageDataFn: (a: GeneratedFunnelAssets) => GhlPageData;
    }[] = [
      {
        name:        "Landing Page",
        type:        "landing",
        htmlFn:      generateLandingPageHtml,
        pageDataFn:  buildLandingPageData,
      },
      {
        name:        "Opt-In Page",
        type:        "optin",
        htmlFn:      generateOptInPageHtml,
        pageDataFn:  buildOptInPageData,
      },
      {
        name:        "Thank You Page",
        type:        "thank-you",
        htmlFn:      generateThankYouPageHtml,
        pageDataFn:  buildThankYouPageData,
      },
      {
        name:        "Booking Page",
        type:        "booking",
        htmlFn:      generateBookingPageHtml,
        pageDataFn:  buildBookingPageData,
      },
    ];

    for (const def of stepDefs) {
      const step = await tryCreateFunnelStep(
        funnelId!, locationId, apiKey,
        def.name, def.type,
        def.htmlFn(assets),
      );

      if (!step) continue;

      steps.push(step);

      // Attempt native pageData write if we got a pageId back
      if (step.pageId) {
        const pageData = def.pageDataFn(assets);
        const written  = await tryPostPageData(step.pageId, funnelId!, locationId, apiKey, pageData);
        nativePages.push({ stepName: def.name, written });
        if (written) step.nativePage = true;
      } else {
        // No pageId in response — still record it (native write skipped)
        nativePages.push({ stepName: def.name, written: false });
      }
    }

    if (steps.length > 0) result.funnelSteps = steps;
    if (nativePages.length > 0) result.nativePages = nativePages;
  }

  return result;
}
