// popup.js v2.53.0 — Challenge Funnel Extension
// Handles: Copy any GHL page + Paste into GHL builder (clone-funnel-step)
// Also handles: AI project library (load → inject via revex, no API key)
// Also handles: Capture any GHL page schema via URL → CF_FETCH_URL_PAGE

const PAGES = ["landing", "optin", "thankyou", "booking"];
const PAGE_LABELS = {
  landing:  "Landing Page",
  optin:    "Opt-In Page",
  thankyou: "Thank You Page",
  booking:  "Booking Page",
};

document.addEventListener("DOMContentLoaded", async () => {
  initCopyPaste();
  initLibrary();
  initCapture();
});

/* ════════════════════════════════════════════════════════════════════════════
   COPY / PASTE — clone any GHL page into the builder
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Copy-debug helpers ────────────────────────────────────────────────────── */

function showCopyBtn(btnId) {
  const btn = document.getElementById(btnId);
  if (btn) btn.style.display = "inline-block";
}
function hideCopyBtn(btnId) {
  const btn = document.getElementById(btnId);
  if (btn) { btn.style.display = "none"; btn.textContent = "Copy"; }
}
function copyDebugResult(divId, btnId) {
  const text = document.getElementById(divId)?.textContent ?? "";
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = "Copy"; }, 1500);
    }
  }).catch(() => {});
}

/* ── Copy All Debug: run all collectors, concatenate, copy to clipboard ─── */
async function doCopyAllDebug() {
  const btn = document.getElementById("copy-all-debug-btn");
  if (btn) { btn.textContent = "Copying…"; btn.disabled = true; }
  try {
    /* Run each collector sequentially — order matches popup from top to bottom */
    await showInjectDebug();
    await doRoundtripTest();
    await doSchemaDiff();
    await doApiLog();
    await doCaptureCloneBaseline();
    await doNativeFirebasePayload();
    await doPageLoadErrors();
    await doPageMeta();

    /* Collect text from each result div */
    const sections = [
      ["=== DEBUG INFO ===",        "debug-inject-result"],
      ["=== ROUNDTRIP TEST ===",     "roundtrip-result"],
      ["=== SCHEMA DIFF ===",        "schema-diff-result"],
      ["=== GHL API LOG ===",        "api-log-result"],
      ["=== CLONE BASELINE ===",     "capture-clone-baseline-result"],
      ["=== NATIVE FIREBASE ===",    "native-firebase-result"],
      ["=== PAGE LOAD ERRORS ===",   "page-load-errors-result"],
      ["=== PAGE METADATA ===",      "page-meta-result"],
    ];
    const blob = sections
      .map(([header, divId]) => {
        const text = (document.getElementById(divId)?.textContent ?? "").trim();
        return header + "\n" + (text || "(empty)");
      })
      .join("\n\n");

    await navigator.clipboard.writeText(blob);
    if (btn) {
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = "Copy All Debug"; btn.disabled = false; }, 2000);
    }
  } catch (err) {
    if (btn) { btn.textContent = "Error"; btn.disabled = false; }
    setTimeout(() => { if (btn) btn.textContent = "Copy All Debug"; }, 2000);
  }
}

function initCopyPaste() {
  refreshCopiedCard();

  document.getElementById("copy-btn").addEventListener("click", doCopy);
  document.getElementById("paste-btn").addEventListener("click", doPaste);
  document.getElementById("clear-btn").addEventListener("click", doClear);
  document.getElementById("debug-inject-btn").addEventListener("click", showInjectDebug);
  document.getElementById("roundtrip-btn").addEventListener("click", doRoundtripTest);
  document.getElementById("schema-diff-btn").addEventListener("click", doSchemaDiff);
  document.getElementById("api-log-btn").addEventListener("click", doApiLog);
  document.getElementById("capture-clone-baseline-btn").addEventListener("click", doCaptureCloneBaseline);
  document.getElementById("native-firebase-btn").addEventListener("click", doNativeFirebasePayload);
  document.getElementById("page-load-errors-btn").addEventListener("click", doPageLoadErrors);
  document.getElementById("page-meta-btn").addEventListener("click", doPageMeta);
  document.getElementById("copy-all-debug-btn").addEventListener("click", doCopyAllDebug);

  /* Wire copy buttons */
  document.getElementById("debug-inject-copy").addEventListener("click", () => copyDebugResult("debug-inject-result", "debug-inject-copy"));
  document.getElementById("roundtrip-copy").addEventListener("click", () => copyDebugResult("roundtrip-result", "roundtrip-copy"));
  document.getElementById("schema-diff-copy").addEventListener("click", () => copyDebugResult("schema-diff-result", "schema-diff-copy"));
  document.getElementById("api-log-copy").addEventListener("click", () => copyDebugResult("api-log-result", "api-log-copy"));
  document.getElementById("capture-clone-baseline-copy").addEventListener("click", () => copyDebugResult("capture-clone-baseline-result", "capture-clone-baseline-copy"));
  document.getElementById("native-firebase-copy").addEventListener("click", () => copyDebugResult("native-firebase-result", "native-firebase-copy"));
  document.getElementById("page-load-errors-copy").addEventListener("click", () => copyDebugResult("page-load-errors-result", "page-load-errors-copy"));
  document.getElementById("page-meta-copy").addEventListener("click", () => copyDebugResult("page-meta-result", "page-meta-copy"));

  // Refresh when storage changes in another context (e.g. content.js cleared it)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "session" && changes.cf_copied_page) refreshCopiedCard();
    if (area === "local"   && changes.cfReady)        refreshCopiedCard();
  });
}

function refreshCopiedCard() {
  chrome.storage.session.get("cf_copied_page", (s) => {
    const copied    = s.cf_copied_page ?? null;
    const card      = document.getElementById("copied-card");
    const clearBtn  = document.getElementById("clear-btn");
    const pasteBtn  = document.getElementById("paste-btn");

    const PAGE_LABELS = {
      landing: "Landing Page", optin: "Opt-In Page",
      thankyou: "Thank You Page", booking: "Booking Page",
    };

    if (copied?.funnelId && copied?.stepId) {
      // Real GHL clone (clone-funnel-step path)
      const name = copied.pageName || "GHL Page";
      const ago  = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>Copied: ${esc(name)}</strong>GHL clone · copied ${ago} — ready to paste.`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;

    } else if (copied?.type === "ai-inject" && copied?.pageData) {
      // AI-generated page (revex inject path)
      const label = PAGE_LABELS[copied.page] || copied.pageName || "AI Page";
      const ago   = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>AI Page Ready: ${esc(label)}</strong>Saved ${ago} — click Paste to inject into the builder.`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;

    } else if (copied?.type === "url-clone" && copied?.pageData) {
      // URL-captured GHL page or AI test page (revex inject path)
      const name = copied.pageName || "Captured Page";
      const ago  = timeSince(copied.copiedAt);
      card.className = "copied-card has";
      card.innerHTML = `<strong>Captured: ${esc(name)}</strong>Queued ${ago} — click Paste to inject into the builder.`;
      clearBtn.style.display = "";
      pasteBtn.disabled      = false;

    } else {
      // cf_copied_page is empty — check cfReady (local storage) as fallback.
      // cfReady is written by "Clone to GHL" and persists across extension updates.
      chrome.storage.local.get("cfReady", (ls) => {
        const ready = ls.cfReady ?? null;
        if (ready?.pageData) {
          const label = PAGE_LABELS[ready.page] || "AI Page";
          const ago   = timeSince(ready.loadedAt);
          card.className = "copied-card has";
          card.innerHTML = `<strong>AI Page Ready: ${esc(label)}</strong>Loaded ${ago} — open a GHL builder tab and click the orange CF button to paste.`;
          clearBtn.style.display = "";
          pasteBtn.disabled      = false;
        } else {
          card.className = "copied-card none";
          card.innerHTML = `<strong>Nothing copied yet</strong>Go to your Challenge Funnel results page and click <strong>Clone to GHL</strong>, or navigate to a GHL page and click Copy below.`;
          clearBtn.style.display = "none";
          pasteBtn.disabled      = true;
        }
      });
    }
  });
}

async function doCopy() {
  const btn = document.getElementById("copy-btn");
  const res = document.getElementById("copy-result");

  btn.disabled    = true;
  btn.textContent = "Copying…";
  res.className   = "copy-result";
  res.textContent = "";

  try {
    const result = await sendMessage({ type: "CF_COPY_PAGE" });

    if (result?.ok) {
      const name = result.record?.pageName || "page";
      res.textContent = `Copied! "${esc(name)}" — now navigate to your GHL builder and click Paste.`;
      res.className   = "copy-result ok";
      refreshCopiedCard();
    } else {
      const err = result?.error ?? "Unknown error";
      res.textContent = `Copy failed: ${err}`;
      res.className   = "copy-result err";
    }
  } catch(e) {
    res.textContent = `Error: ${e.message}`;
    res.className   = "copy-result err";
  } finally {
    btn.textContent = "Copy Current GHL Page";
    btn.disabled    = false;
  }
}

async function doPaste() {
  const btn = document.getElementById("paste-btn");
  const res = document.getElementById("paste-result");

  btn.disabled    = true;
  btn.textContent = "Pasting…";
  btn.className   = "btn btn-paste";
  res.className   = "paste-result";
  res.textContent = "";

  try {
    const result = await sendMessage({ type: "CF_PASTE_PAGE" });

    if (result?.ok) {
      btn.textContent = "Pasted!";
      btn.className   = "btn btn-paste ok";
      const ir = result.injectResult ?? {};
      const methodNote = ir.method ? ` via ${ir.method}` : "";
      res.textContent = `Page pasted into the builder${methodNote}! The builder is reloading — switch to that tab to see your content.`;
      res.className   = "paste-result ok";
      // Show detailed debug info for successful inject
      if (ir.raw || ir.status) {
        res.textContent += `\n\nStatus: ${ir.status ?? "ok"} | Meta: ${ir.metaStatus ?? "-"}\n${(ir.raw ?? "").slice(0, 200)}`;
      }
    } else if ((result?.injectResult?.method ?? result?.method) === "clipboard-ready") {
      // Clipboard keys written — direct injection didn't land but GHL's Ctrl+V may work
      btn.textContent = "Ready — Ctrl+V";
      btn.className   = "btn btn-paste";
      res.textContent = "Content written to GHL's clipboard storage!\n\nSwitch to your GHL builder tab and press Ctrl+V. GHL's own paste handler should load your content.";
      res.className   = "paste-result ok";
    } else {
      const err = result?.error ?? "Unknown error";
      const ir  = result?.injectResult ?? {};
      btn.textContent = "Failed";
      btn.className   = "btn btn-paste err";
      // Show full error + raw GHL response for diagnosis
      let detail = err.slice(0, 400);
      if (ir.method || ir.status || ir.raw) {
        detail += `\n\n— method: ${ir.method ?? "?"} | status: ${ir.status ?? "?"} | meta: ${ir.metaStatus ?? "?"}`;
        if (ir.raw) detail += `\n— GHL raw: ${ir.raw.slice(0, 300)}`;
      }
      res.textContent = detail;
      res.className   = "paste-result err";
    }
  } catch(e) {
    btn.textContent = "Error";
    btn.className   = "btn btn-paste err";
    res.textContent = `Error: ${e.message}`;
    res.className   = "paste-result err";
  } finally {
    setTimeout(() => {
      btn.textContent = "Paste into GHL Builder";
      btn.className   = "btn btn-paste";
      refreshCopiedCard();
    }, 6000);
  }
}

function doClear() {
  chrome.storage.session.remove("cf_copied_page", refreshCopiedCard);
  document.getElementById("copy-result").className  = "copy-result";
  document.getElementById("paste-result").className = "paste-result";
}

async function showInjectDebug() {
  const div = document.getElementById("debug-inject-result");
  const btn = document.getElementById("debug-inject-btn");
  if (!div) return;
  if (div.className.includes("err") || div.className.includes("ok") || div.className.includes("info")) {
    div.className = "paste-result";
    div.textContent = "";
    btn.textContent = "Debug Info";
    hideCopyBtn("debug-inject-copy");
    return;
  }

  btn.textContent = "Hide";

  const [lsBase, ss, tabs] = await Promise.all([
    chrome.storage.local.get(["cf_last_inject", "cfReady"]),
    chrome.storage.session.get("cf_copied_page"),
    new Promise((r) => chrome.tabs.query({ active: true, currentWindow: true }, r)),
  ]);

  const tab    = tabs?.[0];
  const tabId  = tab?.id;

  /* Fetch tab-keyed diagnostic records using the active tab's ID */
  const diagKeys = tabId ? [`cf_ghl_err_${tabId}`, `cf_ooff_err_${tabId}`] : [];
  const lsDiag   = diagKeys.length ? await new Promise((r) => chrome.storage.local.get(diagKeys, r)) : {};

  const ls     = { ...lsBase, ...lsDiag };
  const inject = ls.cf_last_inject;
  const ready  = ls.cfReady;
  const copied = ss.cf_copied_page;

  let lines = [];

  /* ── Extension version ── */
  lines.push("=== CF Extension v2.57.0 ===");
  lines.push("REMINDER: If version above is NOT 2.57.0, reload the extension in chrome://extensions then hard-refresh GHL.");

  /* ── Active tab info ── */
  const tabUrl = tab?.url ?? "(unknown)";
  const isBuilder = /\/(page-builder|funnel-builder)\//.test(tabUrl);
  lines.push(`\nActive tab: ${tabUrl.slice(0, 100)}`);
  lines.push(`Builder tab: ${isBuilder ? "✓ YES" : "✗ NO — FAB will be disabled"}`);

  /* ── Storage: queued page ── */
  lines.push("\n--- Queued page (session storage) ---");
  if (!copied) {
    lines.push("Nothing queued. Click 'Clone to GHL' in the app first.");
  } else {
    lines.push(`type: ${copied.type ?? "?"}`);
    lines.push(`page: ${copied.pageName || copied.page || "?"}`);
    lines.push(`hasPageData: ${!!copied.pageData}`);
    lines.push(`copiedAt: ${copied.copiedAt ? new Date(copied.copiedAt).toLocaleTimeString() : "?"}`);
    if (copied.funnelId) lines.push(`funnelId: ${copied.funnelId}`);
  }

  /* ── Storage: cfReady ── */
  lines.push("\n--- cfReady (local storage) ---");
  if (!ready) {
    lines.push("Empty.");
  } else {
    lines.push(`page: ${ready.page || "?"}`);
    lines.push(`hasPageData: ${!!ready.pageData}`);
    lines.push(`loadedAt: ${ready.loadedAt ? new Date(ready.loadedAt).toLocaleTimeString() : "?"}`);
  }

  /* ── Last inject result ── */
  lines.push("\n--- Last inject result ---");
  if (!inject) {
    lines.push("No inject attempt yet.");
  } else {
    const ts = inject.ts ? new Date(inject.ts).toLocaleTimeString() : "?";
    lines.push(`[${ts}] ok=${inject.ok} | method=${inject.method ?? "?"}`);
    lines.push(`builderId: ${inject.builderId ?? "?"}`);
    if (inject.savedVia) lines.push(`savedVia: ${inject.savedVia}`);
    if (inject.error)   lines.push(`error: ${inject.error.slice(0, 300)}`);
    if (inject.diag) {
      try {
        const d = typeof inject.diag === "string" ? JSON.parse(inject.diag) : inject.diag;
        if (d.approach1) lines.push(`A1: ${JSON.stringify(d.approach1).slice(0, 120)}`);
        if (d.approach2) {
          const a2 = d.approach2;
          lines.push(`A2 bucket: ${a2.bucket ?? "?"} hasToken=${a2.hasToken}`);
          lines.push(`A2 httpStatus: ${a2.httpStatus ?? "?"} | result: ${a2.result ?? "?"}`);
          lines.push(`A2 storageFormat: ${a2.storageFormat ?? "?"} writeFormat: ${a2.writeFormat ?? "?"} existN=${a2.existElemCount ?? "?"} nodeCount=${a2.nodeCount ?? "?"} existingId=${a2.existingPayloadId ?? "?"}`);
          if (a2.firstRowKeys !== undefined) {
            lines.push(`A2 firstRowKeys: ${JSON.stringify(a2.firstRowKeys)} | existRowMeta: ${JSON.stringify(a2.firstExistRowMetaKeys ?? "?")}`);
            lines.push(`A2 existRowDictKey=${a2.firstExistRowDictKey ?? "?"} idMatch=${a2.firstExistRowIdMatch ?? "?"}`);
          }
          if (a2.firstSectionKeys !== undefined)     lines.push(`A2 firstSec topKeys: ${JSON.stringify(a2.firstSectionKeys)}`);
          if (a2.firstSectionMetaKeys !== undefined) lines.push(`A2 firstSec metaKeys: ${JSON.stringify(a2.firstSectionMetaKeys)} childN=${a2.firstSectionChildCount ?? "?"}`);
          if (a2.preWriteRowKeys !== undefined)   lines.push(`A2 preWriteRowKeys: ${JSON.stringify(a2.preWriteRowKeys)} preWriteRowHasMeta=${a2.preWriteRowHasMeta ?? "?"} (expect: false=flat ✓) secChildId=${a2.preWriteSectionChildId ?? "?"}`);
          if (a2.postWrite !== undefined) {
            const pw = a2.postWrite;
            lines.push(`A2 postWrite: ok=${pw.readOk ?? "?"} http=${pw.httpStatus ?? "?"} payloadId=${pw.payloadId ?? "?"}`);
            lines.push(`A2 postWrite counts: secs=${pw.sectionCount ?? "?"} rows=${pw.rowCount ?? "?"} cols=${pw.colCount ?? "?"} elems=${pw.elemCount ?? "?"}`);
            lines.push(`A2 postWrite ref: sec0ChildRow=${pw.sec0ChildRowId ?? "?"} rowRefOk=${pw.rowRefOk ?? "?"} colId=${pw.firstColId ?? "?"} colRefOk=${pw.colRefOk ?? "?"}`);
            /* v2.32.0: flat row diagnostics — hasMeta should be false */
            lines.push(`A2 postWrite firstRowHasMeta=${pw.firstRowHasMeta ?? "?"} (expect: false=flat ✓) firstRowKeys=${JSON.stringify(pw.firstRowKeys ?? "?")}`);
            lines.push(`A2 postWrite sec0El0HasMeta=${pw.sec0El0HasMeta ?? "?"} (expect: false=flat ✓) sec0El0Keys=${JSON.stringify(pw.sec0El0Keys ?? "?")}`);
          }
          /* v2.32.0 section elements diagnostic (flat format) */
          if (a2.firstSecElemCount !== undefined) lines.push(`A2 firstSecElemCount: ${a2.firstSecElemCount} format: ${a2.firstSecElemFormat ?? "unknown"} | sec0El0HasMeta=${a2.firstSecEl0HasMeta ?? "?"} (expect: false=flat ✓) sec0El0HasElement=${a2.firstSecEl0HasElement ?? "?"} (expect: true=v2.38+ ✓) sec0El0Keys=${JSON.stringify(a2.firstSecEl0Keys ?? "?")}`);
          /* v2.33.0 empty dicts diagnostic */
          if (a2.writeEmptyDicts !== undefined)   lines.push(`A2 writeEmptyDicts: ${a2.writeEmptyDicts} writeFormat: ${a2.writeFormat ?? "?"} ← true = native format (rows/cols/elems={})`);
          /* v2.35.0 restored child diagnostic */
          if (a2.sec0MetaChildLen !== undefined) lines.push(`A2 sec0MetaChildLen: ${a2.sec0MetaChildLen} ← child KEPT (non-empty=native format ✓ if >0)`);
          /* v2.26.0 token-patch diagnostics */
          if (a2.newFirebaseToken !== undefined) lines.push(`A2 newFirebaseToken: ${a2.newFirebaseToken} tokenChanged=${a2.tokenChanged}`);
          /* v2.39.0: locationId from tab URL (needed for metaUpdate) */
          if (a2.tabLocationId !== undefined)        lines.push(`A2 tabLocationId: ${a2.tabLocationId} ← from window.location.href`);
          /* v2.32.0: metaUpdate is PRIMARY — "ok-primary-*" means GHL will re-fetch new data */
          if (a2.metaUpdateStatus !== undefined)    lines.push(`A2 metaUpdateStatus (PRIMARY): ${a2.metaUpdateStatus}  ← ok-primary = GHL will re-fetch new data on reload`);
          if (a2.metaUpdateEndpoint !== undefined)  lines.push(`A2 metaUpdateEndpoint: ${a2.metaUpdateEndpoint}`);
          /* v2.34.0: multiple URL attempts logged */
          if (a2.metaUpdateAttempts !== undefined)  lines.push(`A2 metaUpdateAttempts: ${JSON.stringify(a2.metaUpdateAttempts)}`);
          if (a2.newPublicUrl !== undefined)         lines.push(`A2 newPublicUrl: ${a2.newPublicUrl}`);
          /* patchToken is now FALLBACK only */
          if (a2.patchToken !== undefined)       lines.push(`A2 patchToken (fallback): ${a2.patchToken} patchTokenOk=${a2.patchTokenOk ?? "?"} (s1=${a2.patchStatus1 ?? "?"} s2=${a2.patchStatus2 ?? "n/a"})`);
          if (a2.patchReturnedToken !== undefined) lines.push(`A2 patchReturnedToken: ${a2.patchReturnedToken} (mismatch!)`);
          /* legacy a2.metaUpdate field from old fallback path */
          if (a2.metaUpdate !== undefined)       lines.push(`A2 metaUpdate (legacy-fallback): ${a2.metaUpdate}`);
          /* v2.50.0: template-based inject diagnostics */
          if (a2.templateMode !== undefined)     lines.push(`A2 templateMode: ${a2.templateMode} nativeReadStatus=${a2.nativeReadStatus ?? "?"} nativeSecs=${a2.nativeSectionCount ?? "?"}`);
          /* v2.55.0: write-in-place diagnostics */
          if (a2.writeInPlace !== undefined)       lines.push(`A2 writeInPlace: ${a2.writeInPlace} wipUsedExisting=${a2.wipUsedExisting ?? "?"} wipNativeSecCount=${a2.wipNativeSecCount ?? "?"}`);
          if (a2.wipReadStatus !== undefined)      lines.push(`A2 wipReadStatus: ${a2.wipReadStatus}`);
          if (a2.wipReadErr !== undefined)         lines.push(`A2 wipReadErr: ${a2.wipReadErr}`);
          if (a2.writeInPlaceError !== undefined)  lines.push(`A2 writeInPlaceError: ${a2.writeInPlaceError}`);
          if (a2.aiTextCount !== undefined)          lines.push(`A2 aiTextCount: ${a2.aiTextCount}`);
          if (a2.strippedElementFields !== undefined) lines.push(`A2 strippedElementFields: ${a2.strippedElementFields}`);
          if (a2.replaceableCount !== undefined)   lines.push(`A2 replaceableCount: ${a2.replaceableCount} replacedCount: ${a2.replacedCount ?? "?"} clonedSec0ElemCount: ${a2.clonedSec0ElemCount ?? "?"}`);
          if (a2.wipWriteError !== undefined)      lines.push(`A2 wipWriteError: ${a2.wipWriteError}`);
          if (a2.cloneWriteStatus !== undefined)   lines.push(`A2 cloneWriteStatus: ${a2.cloneWriteStatus}`);
          if (a2.cloneOldToken !== undefined)      lines.push(`A2 cloneOldToken: ${a2.cloneOldToken}`);
          if (a2.clonePatchToken !== undefined)    lines.push(`A2 clonePatchToken: ${a2.clonePatchToken} s1=${a2.clonePatchStatus1 ?? "?"} s2=${a2.clonePatchStatus2 ?? "n/a"}`);
          lines.push(`A2 tokenDiag: ${JSON.stringify(a2.tokenDiag ?? [])}`);
          lines.push(`A2 objectPath: ${(a2.objectPath ?? "?").slice(0, 80)}`);
          if (a2.wipErr !== undefined)             lines.push(`A2 wipErr: ${a2.wipErr}`);
        }
        if (d.approach2b) {
          const a2b = d.approach2b;
          lines.push(`A2b result: ${a2b.result ?? "?"} httpStatus: ${a2b.httpStatus ?? "not-reached"}`);
          lines.push(`A2b funnelId: ${a2b.funnelId ?? "?"} metaFunnelId: ${a2b.metaFunnelId ?? "null"} bucket: ${a2b.bucket ?? "?"}`);
          lines.push(`A2b bucketDiag: ${JSON.stringify(a2b.bucketDiag ?? [])} tokDiag: ${JSON.stringify(a2b.tokDiag ?? [])}`);
          if (a2b.path !== undefined)           lines.push(`A2b path: ${a2b.path}`);
          /* v2.33.0 empty dicts diagnostic for 2B */
          if (a2b.writeEmptyDicts !== undefined) lines.push(`A2b writeEmptyDicts: ${a2b.writeEmptyDicts} writeFormat: ${a2b.writeFormat ?? "?"}`);
          if (a2b.newDownloadUrl !== undefined) lines.push(`A2b newDownloadUrl: ${a2b.newDownloadUrl}`);
          if (a2b.metaPatch !== undefined)      lines.push(`A2b metaPatch: ${a2b.metaPatch}`);
          if (a2b.metadataKeys !== undefined)   lines.push(`A2b metadataKeys: ${JSON.stringify(a2b.metadataKeys)}`);
        }
        if (d.approach3) {
          lines.push(`A3 iframeFrameId: ${d.approach3.iframeFrameId ?? "?"} piniaSource: ${d.approach3.piniaSource ?? "?"}`);
          lines.push(`A3 stores found: ${JSON.stringify(d.approach3.candidates ?? []).slice(0, 200)}`);
          lines.push(`A3 allStoreIds: ${JSON.stringify(d.approach3.allStoreIds ?? []).slice(0, 200)}`);
          if (d.approach3.candidateDiag) {
            d.approach3.candidateDiag.forEach(cd => {
              lines.push(`  A3 store=${cd.storeId} patched=${cd.patched} savedVia=${cd.savedVia ?? "none"} err=${(cd.errors ?? []).join("|").slice(0, 60)}`);
            });
          }
          lines.push(`A3 result: ${d.approach3.result ?? "?"}`);
          if (d.approach3.iframeA3Error) lines.push(`A3 iframeErr: ${d.approach3.iframeA3Error}`);
        }
        if (d.approach4) {
          const a4 = d.approach4;
          lines.push(`A4 storeFound=${a4.storeFound ?? "?"} moduleKey=${a4.moduleKey ?? "none"}`);
          if (a4.topStateKeys) lines.push(`A4 topStateKeys: ${JSON.stringify(a4.topStateKeys).slice(0, 120)}`);
          if (a4.moduleDataKeys) lines.push(`A4 moduleDataKeys: ${JSON.stringify(a4.moduleDataKeys).slice(0, 120)}`);
          if (a4.mutKeySample) lines.push(`A4 mutKeys: ${JSON.stringify(a4.mutKeySample).slice(0, 120)}`);
          if (a4.patched) lines.push(`A4 patched: ${JSON.stringify(a4.patched)}`);
          lines.push(`A4 result: ${a4.result ?? "ok"} forced=${a4.forced ?? "?"}`);
          if (a4.iframeA4Error) lines.push(`A4 iframeErr: ${a4.iframeA4Error}`);
        }
      } catch(_) { lines.push(`diag: ${JSON.stringify(inject.diag).slice(0, 300)}`); }
    }
  }

  /* ── GHL Diagnostic — always shown when inject result exists ────────────
   * ghlBackendError: captured by fetch interceptor (executeScript + sniffer)
   * oOffError: captured by bridge.js onerror (document_start, MAIN world)
   * Section hasElements: from roundtrip + inject anatomy (approach2)       */
  const ghlErr  = tabId ? lsDiag[`cf_ghl_err_${tabId}`]  : undefined;
  const ooffErr = tabId ? lsDiag[`cf_ooff_err_${tabId}`] : undefined;
  if (inject) {
    lines.push(`\n--- GHL Diagnostic ---`);
    /* firstSecHasElements from inject diag (approach2) */
    const approach2 = inject?.diag?.approach2;
    if (approach2) {
      const ex = approach2.existSecHasElements;
      const wr = approach2.postWrite?.writtenSecHasElements;
      if (ex !== undefined) lines.push(`ghlBackend sec hasElements (pre-write): ${ex}`);
      if (wr !== undefined) lines.push(`ghlBackend sec hasElements (post-write): ${wr}`);
    }
    /* GHL backend error body (fetch interceptor) */
    if (ghlErr) {
      const age   = ghlErr.ts ? `${Math.round((Date.now() - ghlErr.ts) / 1000)}s ago` : "?";
      const stale = ghlErr.ts && (Date.now() - ghlErr.ts > 60000) ? " [stale >60s]" : "";
      lines.push(`ghlBackendError (${age}${stale}): HTTP ${ghlErr.status ?? "?"} ${ghlErr.url ?? ""}`);
      lines.push(`  body: ${(ghlErr.body ?? "").slice(0, 400)}`);
    } else {
      lines.push(`ghlBackendError: none captured`);
    }
    /* o.off two-phase classification (bridge.js document_start baseline) */
    if (ooffErr) {
      const age2   = ooffErr.ts ? `${Math.round((Date.now() - ooffErr.ts) / 1000)}s ago` : "?";
      const stale2 = ooffErr.ts && (Date.now() - ooffErr.ts > 60000) ? " [stale >60s]" : "";
      const before = ooffErr.seenBeforeInject;
      const after  = ooffErr.seenAfterInject;
      let timing;
      if (before && !after) {
        timing = "pre-existing (seen before inject only — not our fault)";
      } else if (!before && after) {
        timing = "inject-triggered (seen after inject only — our write caused it)";
      } else if (before && after) {
        timing = "both phases (pre-existing AND triggered by inject)";
      } else {
        timing = ooffErr.preExisting ? "pre-existing" : "inject-triggered";
      }
      lines.push(`oOffError (${age2}${stale2}): ${timing}`);
      lines.push(`  seenBefore=${before ?? "?"} seenAfter=${after ?? "?"}`);
      lines.push(`  msg: "${(ooffErr.errMsg ?? "").slice(0, 100)}"`);
      lines.push(`  src: ${(ooffErr.src ?? "").slice(0, 120)} line ${ooffErr.line ?? "?"}`);
    } else {
      lines.push(`oOffError: none captured`);
    }
  }

  div.textContent = lines.join("\n");
  div.className = inject?.ok ? "paste-result ok" : "paste-result info";
  showCopyBtn("debug-inject-copy");
}

/* ════════════════════════════════════════════════════════════════════════════
   ROUNDTRIP TEST
   Read existing Firebase page data, deep-probe its structure, write back
   unchanged, and display the key schema fields. Tells us whether the
   TypeError: o1.elements is not iterable comes from our data or from the
   write/reload mechanism.
   ════════════════════════════════════════════════════════════════════════════ */

async function doRoundtripTest() {
  const div = document.getElementById("roundtrip-result");
  const btn = document.getElementById("roundtrip-btn");
  if (!div) return;

  // Toggle off if already showing
  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className = "paste-result";
    div.textContent = "";
    btn.textContent = "Roundtrip Test (diagnostic)";
    hideCopyBtn("roundtrip-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Running…";
  div.className   = "paste-result info";
  div.textContent = "Reading + writing Firebase data…";

  try {
    const res = await sendMessage({ type: "CF_ROUNDTRIP_TEST" });
    const d   = res?.diag ?? {};
    const lines = [];
    lines.push(`=== Roundtrip Test v2.32.0 ===`);
    lines.push(`ok: ${res?.ok} ${res?.error ? "| error: " + res.error : ""}`);
    if (d.tokenDiag)   lines.push(`tokenDiag: ${JSON.stringify(d.tokenDiag)}`);
    if (d.bucket)      lines.push(`bucket: ${d.bucket}`);
    lines.push(`metaOk=${d.metaOk} hasDownloadUrl=${d.hasDownloadUrl}`);
    lines.push(`readOk=${d.readOk} payloadId=${d.payloadId ?? "?"}`);
    lines.push(`topLevelKeys: ${JSON.stringify(d.topLevelKeys)}`);
    lines.push(`secs=${d.sectionCount} rows=${d.rowCount} cols=${d.colCount} elems=${d.elemCount}`);
    /* Schema probes */
    if (d.firstSecTopKeys !== undefined)  lines.push(`sec0 topKeys: ${JSON.stringify(d.firstSecTopKeys)}`);
    if (d.firstSecHasElements !== undefined) lines.push(`sec0 hasElements: ${d.firstSecHasElements} ← true=sections store elements (v2.31: shallow rows; v2.32: flat format)`);
    if (d.sec0ElementsLength !== undefined) lines.push(`sec0 elements length: ${d.sec0ElementsLength}`);
    /* v2.34.0: native sec0.metaData.child — is it empty or populated? */
    if (d.sec0MetaChildLen !== undefined)    lines.push(`sec0 metaData.child len: ${d.sec0MetaChildLen} sample: ${JSON.stringify(d.sec0MetaChildSample ?? [])} ← 0=native uses empty child ✓`);
    if (d.sec0Elements0Keys !== undefined) lines.push(`sec0.elements[0] keys: ${JSON.stringify(d.sec0Elements0Keys)} hasMeta=${d.sec0Elements0HasMeta} hasElements=${d.sec0Elements0HasElements} childType=${d.sec0Elements0ChildType}`);
    if (d.firstSecMetaKeys !== undefined) lines.push(`sec0 metaKeys: ${JSON.stringify(d.firstSecMetaKeys)}`);
    if (d.firstRowTopKeys !== undefined)  lines.push(`row0 topKeys: ${JSON.stringify(d.firstRowTopKeys)} hasElements=${d.firstRowHasElements}`);
    if (d.firstColTopKeys !== undefined)  lines.push(`col0 topKeys: ${JSON.stringify(d.firstColTopKeys)} hasElements=${d.firstColHasElements}`);
    if (d.firstColMetaKeys !== undefined) lines.push(`col0 metaKeys: ${JSON.stringify(d.firstColMetaKeys)}`);
    if (d.firstColElemCopyKeys !== undefined) lines.push(`col0 metaData.element keys: ${JSON.stringify(d.firstColElemCopyKeys)}`);
    if (d.firstElemTopKeys !== undefined) lines.push(`elem0 topKeys: ${JSON.stringify(d.firstElemTopKeys)} hasElements=${d.firstElemHasElements}`);
    if (d.firstElemMetaKeys !== undefined) lines.push(`elem0 metaKeys: ${JSON.stringify(d.firstElemMetaKeys)} metaHasElems=${d.firstElemMetaHasElements}`);
    if (d.firstElemElemCopyKeys !== undefined) lines.push(`elem0 metaData.element keys: ${JSON.stringify(d.firstElemElemCopyKeys)} hasElems=${d.firstElemElemCopyHasElems}`);
    lines.push(`anyRowHasElements=${d.anyRowHasElements} anyColHasElements=${d.anyColHasElements} anyElemHasElements=${d.anyElemHasElements}`);
    lines.push(`sectionsWithTopLevelElements=${d.sectionsWithTopLevelElements}`);
    /* Public URL test (no auth — simulates GHL read) */
    if (d.publicReadBefore !== undefined) lines.push(`publicRead BEFORE write (no auth): ${JSON.stringify(d.publicReadBefore)}`);
    /* Write */
    lines.push(`writeOk=${d.writeOk} writeStatus=${d.writeStatus ?? "?"}`);
    if (d.writeError) lines.push(`writeError: ${d.writeError}`);
    /* Token analysis */
    if (d.oldToken !== undefined) lines.push(`oldToken: ${d.oldToken}`);
    if (d.newToken !== undefined) lines.push(`newToken (from upload resp): ${d.newToken}`);
    if (d.tokenChanged !== undefined) lines.push(`tokenChanged: ${d.tokenChanged}`);
    /* v2.26.0 PATCH to restore original token */
    if (d.patchStatus1 !== undefined || d.patchToken !== undefined) {
      lines.push(`patchToken: ${d.patchToken ?? "?"} patchTokenOk=${d.patchTokenOk ?? "?"} (s1=${d.patchStatus1 ?? "?"} s2=${d.patchStatus2 ?? "n/a"}) ← "ok-format1/2" + patchTokenOk=true = token CONFIRMED restored!`);
    }
    if (d.patchReturnedToken !== undefined) lines.push(`patchReturnedToken: ${d.patchReturnedToken} ← MISMATCH — token not actually restored!`);
    /* After-PATCH public read (simulates GHL read — should be 200 if patch worked) */
    if (d.publicReadAfterPatch !== undefined) lines.push(`publicRead AFTER patch (old token, no auth): ${JSON.stringify(d.publicReadAfterPatch)} ← 200=GHL can now read!`);
    /* Fallback metadata update */
    if (d.metaUpdate !== undefined) lines.push(`GHL metaUpdate (fallback): ${d.metaUpdate}`);
    if (d.newPublicUrl !== undefined) lines.push(`newPublicUrl (fallback): ${d.newPublicUrl}`);
    /* Auth verify */
    if (d.verifyStatus !== undefined) lines.push(`verify (auth read): status=${d.verifyStatus} secs=${d.verifySecCount} elems=${d.verifyElemCount} id=${d.verifyId}`);
    lines.push(`\nNow RELOAD the GHL builder tab.`);
    lines.push(`patchToken=ok + publicReadAfterPatch=200 → TOKEN RESTORED. TypeError should be gone!`);
    lines.push(`patchToken=failed, metaUpdate=ok → URL updated in GHL backend. Check TypeError.`);
    lines.push(`Both failed → need new approach.`);

    div.textContent = lines.join("\n");
    div.className   = res?.ok ? "paste-result ok" : "paste-result err";
    showCopyBtn("roundtrip-copy");
  } catch (e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("roundtrip-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Roundtrip Test (diagnostic)";
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   SCHEMA DIFF
   Read-only comparison: GHL native Firebase structure vs our inject output.
   No write — safe to run at any time on a GHL builder tab.
   ════════════════════════════════════════════════════════════════════════════ */

async function doSchemaDiff() {
  const div = document.getElementById("schema-diff-result");
  const btn = document.getElementById("schema-diff-btn");
  if (!div) return;

  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className  = "paste-result";
    div.textContent = "";
    btn.textContent = "Schema Diff (native vs inject)";
    hideCopyBtn("schema-diff-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Reading Firebase schema…";
  div.className   = "paste-result info";
  div.textContent = "Comparing GHL native vs inject format…";

  try {
    const res = await sendMessage({ type: "CF_SCHEMA_DIFF" });
    const n   = res?.native  ?? {};
    const i   = res?.inject  ?? null;
    const lines = [];

    lines.push(`=== Schema Diff v2.32.0 (flat format) ===`);
    lines.push(`Firebase read: ${res?.ok ? "ok" : "FAILED — " + (res?.error ?? "?")}`);
    lines.push(`Has queued page data: ${res?.hasPageData ? "yes" : "no (load a page via AI library first)"}`);

    lines.push(`\n--- GHL Native (what Firebase actually stores) ---`);
    lines.push(`secs=${n.sectionCount ?? "?"} rows=${n.rowCount ?? "?"} cols=${n.colCount ?? "?"} elems=${n.elemCount ?? "?"}`);
    lines.push(`sec0 keys:          ${JSON.stringify(n.sec0Keys ?? "?")}`);
    lines.push(`sec0 hasElements:   ${n.sec0HasElements}  |  elementsLen: ${n.sec0ElementsLen ?? "?"}`);
    lines.push(`sec0.el[0] keys:    ${JSON.stringify(n.sec0El0Keys ?? "?")}`);
    lines.push(`sec0.el[0] hasMeta: ${n.sec0El0HasMeta}  |  hasElements: ${n.sec0El0HasElements}`);
    lines.push(`row0 keys:          ${JSON.stringify(n.row0Keys ?? "?")}  |  hasElements: ${n.row0HasElements}`);
    lines.push(`col0 keys:          ${JSON.stringify(n.col0Keys ?? "?")}  |  hasElements: ${n.col0HasElements}`);
    lines.push(`elem0 keys:         ${JSON.stringify(n.elem0Keys ?? "?")}  |  hasElements: ${n.elem0HasElements}`);
    lines.push(`anyRow/Col/ElemHasElements: ${n.anyRowHasElements}/${n.anyColHasElements}/${n.anyElemHasElements}`);

    if (i) {
      lines.push(`\n--- Our Inject (simulated, no write) [v2.32.0 flat format] ---`);
      lines.push(`secs=${i.sectionCount ?? "?"} rows=${i.rowCount ?? "?"} cols=${i.colCount ?? "?"} elems=${i.elemCount ?? "?"}`);
      lines.push(`sec0 keys:          ${JSON.stringify(i.sec0Keys ?? "?")}`);
      lines.push(`sec0 hasElements:   ${i.sec0HasElements}  |  elementsLen: ${i.sec0ElementsLen ?? "?"}`);
      lines.push(`sec0.el[0] keys:    ${JSON.stringify(i.sec0El0Keys ?? "?")}`);
      lines.push(`sec0.el[0] hasMeta: ${i.sec0El0HasMeta}  |  hasElements: ${i.sec0El0HasElements}`);
      lines.push(`row0 keys (flat):   ${JSON.stringify(i.row0Keys ?? "?")}  |  hasElements: ${i.row0HasElements}`);
      lines.push(`row0 hasMeta:       ${i.row0HasMeta ?? "?"}  (expect: false)`);
      lines.push(`col0 keys (flat):   ${JSON.stringify(i.col0Keys ?? "?")}  |  hasElements: ${i.col0HasElements}`);

      lines.push(`\n--- Diff (native vs inject pipeline output) ---`);
      const check = (label, a, b) => lines.push(`${label}: ${a === b ? "✓ MATCH" : "✗ MISMATCH  native=" + JSON.stringify(a) + "  inject=" + JSON.stringify(b)}`);
      check("sec0 hasElements",        n.sec0HasElements,    i.sec0HasElements);
      check("sec0.el[0] hasMeta",      n.sec0El0HasMeta,     i.sec0El0HasMeta);
      check("sec0.el[0] hasElements",  n.sec0El0HasElements, i.sec0El0HasElements);
      check("row0 hasElements",        n.row0HasElements,    i.row0HasElements);
      check("row0 hasMeta",            n.row0HasMeta,        i.row0HasMeta);
      check("col0 hasElements",        n.col0HasElements,    i.col0HasElements);
    } else {
      lines.push(`\n--- Our Inject: no page loaded ---`);
      lines.push(`Open the AI library, load a page, then re-run Schema Diff.`);
    }

    div.textContent = lines.join("\n");
    div.className   = res?.ok ? "paste-result ok" : "paste-result err";
    showCopyBtn("schema-diff-copy");
  } catch (e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("schema-diff-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Schema Diff (native vs inject)";
  }
}

/* ─── doApiLog ──────────────────────────────────────────────────────────────
 * Fetch window.__cfApiLog from the GHL tab (captured by bridge.js v2.10.0).
 * Shows GHL API calls with full request bodies for 201 responses.
 * v2.43.0: POST/PUT/PATCH captured from ANY domain (catches same-origin
 *   gohighlevel.com saves that v2.9.0 missed; GET still restricted).
 * 201 entries highlighted with ★, req body shown on own line.
 * Goal: expose full URL + request body of GHL's real page-save endpoint.
 * ─────────────────────────────────────────────────────────────────────────── */
async function doApiLog() {
  const div = document.getElementById("api-log-result");
  const btn = document.getElementById("api-log-btn");
  if (!div) return;

  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className  = "paste-result";
    div.textContent = "";
    btn.textContent = "Show GHL API Log";
    hideCopyBtn("api-log-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Fetching API log…";
  div.className   = "paste-result info";
  div.textContent = "Reading captured GHL API calls from page…";

  try {
    const res = await sendMessage({ type: "CF_GET_API_LOG" });
    const log = (res?.log ?? []).slice().reverse();
    const cnt201 = log.filter(e => e.is201 || e.status === 201).length;
    const lines = [];
    lines.push(`=== GHL API Log (${log.length} entries, ${cnt201} with 201, newest first) ===`);
    lines.push(`★ = 201 response — these are the save-endpoint candidates.`);
    lines.push(`For each ★ entry: COPY full URL + REQ BODY to find the real page-save call.`);
    lines.push(`─────────────────────────────────────────────────────────`);
    if (log.length === 0) {
      lines.push("No entries captured yet.");
      lines.push("Bridge.js v2.9.0 intercepts /funnels/ and /builder/ calls.");
      lines.push("Steps: open GHL builder → do a native Save → click this button.");
    } else {
      log.forEach((e, idx) => {
        const t    = new Date(e.ts).toISOString().slice(11, 23);
        const mark = (e.is201 || e.status === 201) ? "★ 201" : String(e.status);
        const url  = String(e.url ?? "").slice(0, 120);
        lines.push(`[${idx + 1}] ${mark} | ${e.method} ${url} | ${t}`);
        if (e.is201 || e.status === 201) {
          /* Show response body on its own line */
          const respBody = String(e.body ?? "").slice(0, 300);
          lines.push(`    RESP: ${respBody}`);
          /* Show full request body — this is what we need to capture */
          const reqBody = String(e.req ?? "").trim();
          if (reqBody) {
            lines.push(`    REQ (${reqBody.length} chars): ${reqBody.slice(0, 1200)}`);
            if (reqBody.length > 1200) lines.push(`    ... (${reqBody.length - 1200} more chars — copy raw log to see all)`);
          } else {
            lines.push(`    REQ: (none — GET or body not captured)`);
          }
          lines.push(`    ─────────────────────────────────────────────────────`);
        } else {
          /* Non-201: show response body inline, req body only if short */
          const respSnip = String(e.body ?? "").slice(0, 120);
          lines.push(`    ${respSnip}`);
        }
      });
    }
    div.textContent = lines.join("\n");
    div.className   = res?.ok ? "paste-result ok" : "paste-result err";
    showCopyBtn("api-log-copy");
  } catch (e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("api-log-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Show GHL API Log";
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   NATIVE FIREBASE PAYLOAD
   Shows the raw Firebase Storage data GHL reads when loading this page.
   Captured by bridge.js v2.11.0 fetch interceptor (alt=media URL pattern).
   Reveals the exact key/format structure GHL itself uses so we can match it.
   ════════════════════════════════════════════════════════════════════════════ */
async function doNativeFirebasePayload() {
  const div = document.getElementById("native-firebase-result");
  const btn = document.getElementById("native-firebase-btn");
  if (!div) return;

  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className   = "paste-result";
    div.textContent = "";
    btn.textContent = "Native Firebase Payload";
    hideCopyBtn("native-firebase-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Fetching…";
  div.className   = "paste-result info";
  div.textContent = "Reading captured Firebase Storage payload…";

  try {
    const res = await sendMessage({ type: "CF_GET_NATIVE_FIREBASE_PAYLOAD" });
    const lines = [];
    if (!res?.ok) {
      lines.push(`Error: ${res?.error ?? "unknown"}`);
      div.textContent = lines.join("\n");
      div.className   = "paste-result err";
    } else if (!res.payload) {
      lines.push("No Firebase payload captured yet.");
      lines.push("Steps: open a GHL page in the builder so GHL loads its page data,");
      lines.push("then click this button. Bridge.js intercepts the alt=media fetch.");
      div.textContent = lines.join("\n");
      div.className   = "paste-result info";
    } else {
      const p = res.payload;
      lines.push(`=== Native GHL Firebase Payload (captured ${new Date(p.capturedAt).toISOString().slice(11,23)}) ===`);
      lines.push(`sections: ${p.sectionCount}  rows: ${p.rowCount}  cols: ${p.colCount}  elems: ${p.elemCount}`);
      lines.push(`sec[0].elements exists: ${p.sec0HasElements}  len: ${p.sec0ElementsLen}`);
      lines.push(`sec[0].elements[0] keys: ${p.sec0ElemKeys}`);
      lines.push(`row dict sample: ${p.rowDictFormat}`);
      lines.push(`─────────────────────────────────────────────────────────`);
      lines.push(`RAW (first 5000 chars):`);
      lines.push(String(p.raw ?? ""));
      if (res.raw && res.raw.length > 5000) {
        lines.push(`… (${res.raw.length - 5000} more chars — use Copy to get all 8000)`);
      }
      div.textContent = lines.join("\n");
      div.className   = "paste-result ok";
    }
    showCopyBtn("native-firebase-copy");
  } catch(e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("native-firebase-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Native Firebase Payload";
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE LOAD ERRORS
   Shows JS errors captured by bridge.js v2.11.0 error trap after inject.
   Helps identify what breaks in GHL's Vue/FunnelBuilder after our write.
   ════════════════════════════════════════════════════════════════════════════ */
async function doPageLoadErrors() {
  const div = document.getElementById("page-load-errors-result");
  const btn = document.getElementById("page-load-errors-btn");
  if (!div) return;

  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className   = "paste-result";
    div.textContent = "";
    btn.textContent = "Page Load Errors";
    hideCopyBtn("page-load-errors-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Fetching…";
  div.className   = "paste-result info";
  div.textContent = "Reading captured page load errors…";

  try {
    const res = await sendMessage({ type: "CF_GET_PAGE_LOAD_ERRORS" });
    const errors = res?.errors ?? [];
    const lines = [];
    lines.push(`=== Page Load Errors (${errors.length} captured) ===`);
    if (!res?.ok) {
      lines.push(`Error: ${res?.error ?? "unknown"}`);
      div.textContent = lines.join("\n");
      div.className   = "paste-result err";
    } else if (errors.length === 0) {
      lines.push("No errors captured yet.");
      lines.push("Steps: run inject → wait for page reload → click this button.");
      lines.push("Bridge.js traps window.onerror + unhandledrejection from document_start.");
      div.textContent = lines.join("\n");
      div.className   = "paste-result info";
    } else {
      errors.forEach((e, i) => {
        lines.push(`[${i + 1}] ${e.msg}`);
        if (e.file) lines.push(`    at ${e.file}:${e.line}:${e.col}`);
        if (e.stack) lines.push(`    ${e.stack.split("\n").slice(0, 4).join("\n    ")}`);
      });
      div.textContent = lines.join("\n");
      div.className   = "paste-result err";
    }
    showCopyBtn("page-load-errors-copy");
  } catch(e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("page-load-errors-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Page Load Errors";
  }
}

async function doPageMeta() {
  const div = document.getElementById("page-meta-result");
  const btn = document.getElementById("page-meta-btn");
  if (!div) return;

  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className   = "paste-result";
    div.textContent = "";
    btn.textContent = "Show Page Metadata";
    hideCopyBtn("page-meta-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Fetching…";
  div.className   = "paste-result info";
  div.textContent = "Reading captured page metadata…";

  try {
    const res = await sendMessage({ type: "CF_GET_PAGE_META" });
    const lines = [];
    if (!res?.ok) {
      lines.push(`Error: ${res?.error ?? "unknown"}`);
      div.textContent = lines.join("\n");
      div.className   = "paste-result err";
    } else {
      const meta         = res.meta;
      const firestoreLog = res.firestoreLog ?? [];
      if (!meta || meta.error) {
        lines.push("No page metadata captured yet.");
        lines.push("Steps: open the GHL page builder → navigate to a page → click this button.");
        lines.push("bridge.js v2.12.0 captures GET /funnels/page/:id responses from GHL backend.");
        if (meta?.error) lines.push("Capture error: " + meta.error);
        if (firestoreLog.length > 0) {
          lines.push("");
          lines.push(`--- Firestore URLs captured (${firestoreLog.length}) ---`);
          firestoreLog.forEach((e, i) => lines.push(`[${i+1}] ${e.method} ${e.url}`));
        }
        div.textContent = lines.join("\n");
        div.className   = "paste-result info";
      } else {
        lines.push(`=== GHL Page Metadata (captured ${new Date(meta.capturedAt).toISOString()}) ===`);
        lines.push(`id:                  ${meta.id ?? "(none)"}`);
        lines.push(`funnelId:            ${meta.funnelId ?? "(none)"}`);
        lines.push(`locationId:          ${meta.locationId ?? "(none)"}`);
        lines.push(`pageDataDownloadUrl: ${meta.pageDataDownloadUrl ?? "(none)"}`);
        lines.push(`pageDataUrl:         ${meta.pageDataUrl ?? "(none)"}`);
        lines.push(`hasSections:         ${meta.hasSections ?? "(none)"}`);
        lines.push(`topKeys:             ${meta.topKeys ?? "(none)"}`);
        lines.push(`updatedAt:           ${meta.updatedAt ?? "(none)"}`);
        lines.push(`captureUrl:          ${meta.url ?? "(none)"}`);
        if (firestoreLog.length > 0) {
          lines.push("");
          lines.push(`--- Firestore URLs captured (${firestoreLog.length}) ---`);
          firestoreLog.forEach((e, i) => lines.push(`[${i+1}] ${e.method} ${e.url}`));
        } else {
          lines.push("");
          lines.push("--- Firestore URLs: none captured ---");
        }
        lines.push("");
        lines.push("--- raw response (first 6000 chars) ---");
        lines.push(typeof meta.raw === "string" ? meta.raw.slice(0, 6000) : JSON.stringify(meta.fullBody ?? "(no raw)").slice(0, 6000));
        div.textContent = lines.join("\n");
        div.className   = "paste-result ok";
      }
    }
    showCopyBtn("page-meta-copy");
  } catch(e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("page-meta-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Show Page Metadata";
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   CAPTURE CLONE BASELINE
   Reads the FULL Firebase data of the currently open cloned GHL page and
   stores it in chrome.storage.local for deep-diff in the GHL Inspector web UI.
   ════════════════════════════════════════════════════════════════════════════ */

async function doCaptureCloneBaseline() {
  const div = document.getElementById("capture-clone-baseline-result");
  const btn = document.getElementById("capture-clone-baseline-btn");
  if (!div) return;

  if (div.className.includes("ok") || div.className.includes("err") || div.className.includes("info")) {
    div.className   = "paste-result";
    div.textContent = "";
    btn.textContent = "Capture Clone Baseline (for deep diff)";
    hideCopyBtn("capture-clone-baseline-copy");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Capturing…";
  div.className   = "paste-result info";
  div.textContent = "Reading Firebase data from current builder page…";

  try {
    const res = await sendMessage({ type: "CF_CAPTURE_CLONE_BASELINE" });
    if (res?.ok) {
      const d = res.diag ?? {};
      const lines = [];
      lines.push(`✓ Clone baseline captured & stored!`);
      lines.push(`secs=${d.sectionCount}  rows=${d.rowCount}  cols=${d.colCount}  elems=${d.elemCount}`);
      lines.push(`topLevelKeys: ${JSON.stringify(d.topLevelKeys ?? [])}`);
      lines.push(`elemsPerSection: ${JSON.stringify(d.sectionElemCounts ?? [])}`);
      lines.push(`metaChildLen/sec: ${JSON.stringify(d.sectionMetaChildLengths ?? [])}`);
      lines.push(`sec0 keys: ${JSON.stringify(d.sec0Keys ?? [])}`);
      lines.push(`sec0 elem field keys: ${JSON.stringify(d.sec0ElemFieldKeys ?? [])}`);
      lines.push(`row0 keys: ${JSON.stringify(d.row0Keys ?? [])}  metaKeys: ${JSON.stringify(d.row0MetaKeys ?? [])}`);
      lines.push(`col0 keys: ${JSON.stringify(d.col0Keys ?? [])}  metaKeys: ${JSON.stringify(d.col0MetaKeys ?? [])}`);
      lines.push(`elem0 keys: ${JSON.stringify(d.elem0Keys ?? [])}  metaKeys: ${JSON.stringify(d.elem0MetaKeys ?? [])}`);
      lines.push(`\nNow open the GHL Inspector in the web app and click "Load Clone Baseline" to see the deep diff.`);
      div.textContent = lines.join("\n");
      div.className   = "paste-result ok";
      showCopyBtn("capture-clone-baseline-copy");
    } else {
      div.textContent = `Error: ${res?.error ?? "unknown"}\n${JSON.stringify(res?.diag ?? {}, null, 2)}`;
      div.className   = "paste-result err";
      showCopyBtn("capture-clone-baseline-copy");
    }
  } catch (e) {
    div.textContent = `Error: ${e.message}`;
    div.className   = "paste-result err";
    showCopyBtn("capture-clone-baseline-copy");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Capture Clone Baseline (for deep diff)";
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   AI PROJECT LIBRARY — load app-generated pages
   ════════════════════════════════════════════════════════════════════════════ */

async function initLibrary() {
  const cached = await getCached();

  if (cached) {
    const ready = await getReady();
    showLibrary(cached, false, ready);
    return;
  }

  const tab = await getActiveTab();
  if (!tab) { showEmpty(); return; }

  const match = parseResultsUrl(tab.url);
  if (!match) { showEmpty(); return; }

  showSaving();
  try {
    await autoSave(match.appUrl, match.projectId);
    const saved = await getCached();
    if (saved) {
      showLibrary(saved, true, null);
    } else {
      showSaveError();
    }
  } catch (e) {
    console.error("CF: autoSave failed", e);
    showSaveError();
  }
}

function parseResultsUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/projects\/([^/]+)/);
    if (!m) return null;
    return { appUrl: u.origin, projectId: m[1] };
  } catch {
    return null;
  }
}

async function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs[0] ? tabs[0] : null);
    });
  });
}

function getCached() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["cfProject"], (s) => resolve(s.cfProject || null));
  });
}

function getReady() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["cfReady"], (s) => resolve(s.cfReady || null));
  });
}

async function autoSave(appUrl, projectId) {
  const tokenUrl = `${appUrl}/api/highlevel/inject-token?projectId=${encodeURIComponent(projectId)}`;
  const tokenRes = await fetch(tokenUrl, { credentials: "include" });
  if (!tokenRes.ok) throw new Error("Could not fetch project info — are you logged in to the app?");
  const tokenData = await tokenRes.json();

  const project = {
    projectId,
    appUrl,
    challengeConcept: tokenData.projectName || "Challenge Funnel",
    savedAt: Date.now(),
  };

  await new Promise((resolve) => {
    chrome.storage.local.set({ cfProject: project }, resolve);
  });
}

/* ── UI states ──────────────────────────────────────────────────────────── */

function showEmpty() {
  document.getElementById("empty-state").style.display      = "";
  document.getElementById("saving-state").style.display     = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display    = "none";
}

function showSaving() {
  document.getElementById("empty-state").style.display      = "none";
  document.getElementById("saving-state").style.display     = "";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display    = "none";
}

function showSaveError() {
  document.getElementById("empty-state").style.display      = "none";
  document.getElementById("saving-state").style.display     = "none";
  document.getElementById("save-error-state").style.display = "";
  document.getElementById("library-state").style.display    = "none";
}

function showLibrary(cached, justSaved, ready) {
  document.getElementById("empty-state").style.display      = "none";
  document.getElementById("saving-state").style.display     = "none";
  document.getElementById("save-error-state").style.display = "none";
  document.getElementById("library-state").style.display    = "";

  document.getElementById("project-name").textContent = cached.challengeConcept || "Challenge Funnel";

  if (justSaved) {
    const banner = document.getElementById("saved-banner");
    banner.classList.add("show");
    setTimeout(() => banner.classList.remove("show"), 5000);
  }

  refreshLoadedBadge(ready);

  document.getElementById("change-btn").addEventListener("click", async () => {
    await new Promise((resolve) => chrome.storage.local.remove(["cfProject", "cfReady"], resolve));
    document.getElementById("library-state").style.display = "none";

    const tab   = await getActiveTab();
    const match = tab ? parseResultsUrl(tab.url) : null;
    if (match) {
      showSaving();
      try {
        await autoSave(match.appUrl, match.projectId);
        const saved = await getCached();
        if (saved) {
          showLibrary(saved, true, null);
        } else {
          showSaveError();
        }
      } catch {
        showSaveError();
      }
    } else {
      showEmpty();
    }
  });

  document.querySelectorAll(".load-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadPage(btn.dataset.page, btn, cached));
  });

  if (ready) highlightCard(ready.page);
}

function refreshLoadedBadge(ready) {
  const badge = document.getElementById("loaded-badge");
  if (ready && ready.page) {
    badge.classList.add("show");
    document.getElementById("loaded-page-name").textContent = PAGE_LABELS[ready.page] || ready.page;
  } else {
    badge.classList.remove("show");
  }
}

function highlightCard(page) {
  PAGES.forEach((p) => {
    const card = document.getElementById(`card-${p}`);
    const btn  = document.getElementById(`btn-${p}`);
    if (!card || !btn) return;
    if (p === page) {
      card.classList.add("loaded-page");
      btn.textContent = "Loaded";
      btn.classList.add("loaded");
    } else {
      card.classList.remove("loaded-page");
      btn.textContent = "Load";
      btn.classList.remove("loaded");
    }
  });
}

async function loadPage(page, btn, cached) {
  const origText = btn.textContent;
  btn.disabled   = true;
  btn.textContent = "Loading…";

  try {
    const pdUrl = `${cached.appUrl}/api/highlevel/page-data?projectId=${encodeURIComponent(cached.projectId)}&page=${encodeURIComponent(page)}`;
    const pdRes = await fetch(pdUrl, { credentials: "include" });
    if (!pdRes.ok) throw new Error(`HTTP ${pdRes.status} — are you logged in to the app?`);
    const pdJson = await pdRes.json();

    if (!pdJson.pageData) throw new Error("No page data returned from the app");

    const ready = {
      projectId:        cached.projectId,
      appUrl:           cached.appUrl,
      challengeConcept: cached.challengeConcept,
      page,
      pageData:         pdJson.pageData,
      loadedAt:         Date.now(),
    };

    await new Promise((resolve) => {
      chrome.storage.local.set({ cfReady: ready }, resolve);
    });

    const sessionCopy = {
      type:      "ai-inject",
      page,
      pageName:  PAGE_LABELS[page] || "AI Page",
      pageData:  pdJson.pageData,
      projectId: cached.projectId,
      appUrl:    cached.appUrl,
      copiedAt:  Date.now(),
    };
    await new Promise((resolve) => {
      chrome.storage.session.set({ cf_copied_page: sessionCopy }, resolve);
    });

    highlightCard(page);
    refreshLoadedBadge(ready);
    refreshCopiedCard();

    showNote("info",
      `${PAGE_LABELS[page]} loaded! Switch to your GHL builder tab and click the orange CF button to inject.`
    );
  } catch (e) {
    showNote("err", `Could not load page data: ${e.message}`);
    btn.textContent = origText;
  } finally {
    btn.disabled = false;
    const ready = await getReady();
    if (ready) highlightCard(ready.page);
  }
}

function showNote(type, msg) {
  const el = document.getElementById("note");
  el.textContent = msg;
  el.className   = `note show ${type}`;
}

/* ════════════════════════════════════════════════════════════════════════════
   SHARED UTILS
   ════════════════════════════════════════════════════════════════════════════ */

function sendMessage(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response ?? { ok: false, error: "no_response" });
    });
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function timeSince(ts) {
  if (!ts) return "";
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60)    return "just now";
  if (secs < 3600)  return `${Math.floor(secs/60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs/3600)}h ago`;
  return `${Math.floor(secs/86400)}d ago`;
}

/* ════════════════════════════════════════════════════════════════════════════
   CAPTURE — fetch any public GHL page URL → store schema for GHL Inspector
   ════════════════════════════════════════════════════════════════════════════ */

function initCapture() {
  const input  = document.getElementById("capture-url");
  const btn    = document.getElementById("capture-btn");
  const result = document.getElementById("capture-result");

  // Pre-fill with the active tab URL if available
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs?.[0]?.url ?? "";
    if (url && url.startsWith("http")) input.value = url;
  });

  btn.addEventListener("click", async () => {
    const url = input.value.trim();
    if (!url) {
      result.textContent = "Please enter a URL first.";
      result.className = "capture-result err";
      return;
    }

    btn.disabled    = true;
    btn.textContent = "Capturing…";
    result.className = "capture-result";
    result.textContent = "";

    try {
      const res = await sendMessage({ type: "CF_FETCH_URL_PAGE", url });

      if (res?.ok) {
        const name = res.pageName ? esc(res.pageName) : "the page";
        result.innerHTML = `Schema captured for <strong>${name}</strong> — open the GHL Inspector in the app to inspect its element tree.`;
        result.className = "capture-result ok";
      } else {
        result.textContent = res?.error ?? "Capture failed — unknown error.";
        result.className = "capture-result err";
      }
    } catch (e) {
      result.textContent = `Error: ${e.message}`;
      result.className = "capture-result err";
    } finally {
      btn.disabled    = false;
      btn.textContent = "Capture";
    }
  });
}
