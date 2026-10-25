const CLIPBOARD_KEYS = [
  'hl-copy-element','hl_copy_element','builder-clipboard','ghl-clipboard',
  'section-clipboard','hl-page-clipboard','highlevel_clipboard',
  'page-builder-clipboard','hl-section-copy','hl_section_copy','hl-builder-copy'
];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // ── INJECT ──────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_INJECT') {
    (async () => {
      const jsonStr = msg.jsonStr;
      let pageData;
      try { pageData = JSON.parse(jsonStr); } catch(e) { sendResponse({ok:false,error:'Invalid JSON'}); return; }

      // ── Step 1: Write to all known generic clipboard keys ──────────────
      CLIPBOARD_KEYS.forEach(k => { try { localStorage.setItem(k, jsonStr); } catch(_) {} });

      // ── Step 2: Find GHL session ID from existing ghl.*.v1.{id} keys ──
      // GHL uses the pattern ghl.{name}.v1.{sessionId} for all its localStorage
      // We extract the sessionId and write to every likely clipboard variant
      const ghlSessionIds = new Set();
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const m = k && k.match(/^ghl\.[^.]+\.v\d+\.(.+)$/);
        if (m) ghlSessionIds.add(m[1]);
      }

      const GHL_CLIPBOARD_NAMES = [
        'clipboard', 'builderClipboard', 'sectionClipboard', 'pageClipboard',
        'copySection', 'copyElement', 'copyRow', 'pasteData',
        'builderCopy', 'pageBuilderClipboard', 'sectionCopy',
        'importPage', 'importData', 'builderImport',
      ];

      ghlSessionIds.forEach(id => {
        GHL_CLIPBOARD_NAMES.forEach(name => {
          ['v1','v2'].forEach(v => {
            try { localStorage.setItem(`ghl.${name}.${v}.${id}`, jsonStr); } catch(_) {}
          });
        });
      });

      // ── Step 3: Try Vue/React in all frames (GHL builder may be in iframe) ──
      let method = null;
      try {
        // Main frame Vue2
        const root = findVue2Root(); if (root?.$store) method = tryVueStore(root.$store, pageData) ? 'vue2-store' : null;
      } catch(_) {}
      if (!method) { try { method = tryVue3(pageData) ? 'vue3-store' : null; } catch(_) {} }
      if (!method) { try { method = tryGHLGlobals(pageData, jsonStr) ? 'ghl-global' : null; } catch(_) {} }
      if (!method) { try { method = (await tryUIImport(jsonStr)) ? 'ui-import' : null; } catch(_) {} }

      // ── Step 4: System clipboard ─────────────────────────────────────
      try { await navigator.clipboard.writeText(jsonStr); } catch(_) {}

      const ghlKeysWritten = ghlSessionIds.size > 0;
      sendResponse({
        ok: true,
        method: method || (ghlKeysWritten ? 'ghl-localstorage' : 'clipboard'),
        ghlSessionIds: [...ghlSessionIds],
        needsCtrlV: !method,
      });
    })();
    return true;
  }

  // ── DEBUG — scan GHL page for injectable hooks ───────────────────────────────
  if (msg.type === 'GHL_DEBUG') {
    const report = {};

    // Framework detection
    report.vue2  = !!findVue2Root();
    report.vue3  = !!findVue3App();
    report.react = !!findReactRoot();

    // Vue2 store
    try {
      const root = findVue2Root();
      if (root && root.$store) {
        report.vuex2_actions   = Object.keys(root.$store._actions||{}).filter(k=>/page|import|load|funnel|section|builder|restore/i.test(k));
        report.vuex2_mutations = Object.keys(root.$store._mutations||{}).filter(k=>/PAGE|IMPORT|LOAD|FUNNEL|SECTION|BUILDER|RESTORE/i.test(k));
        report.vuex2_state     = Object.keys(root.$store.state||{});
      }
    } catch(e) { report.vue2_err = e.message; }

    // Vue3 / Pinia
    try {
      const app = findVue3App();
      if (app) {
        const gp = app.config?.globalProperties;
        if (gp?.$store) {
          report.vuex3_actions   = Object.keys(gp.$store._actions||{}).filter(k=>/page|import|load|funnel|section/i.test(k));
          report.vuex3_mutations = Object.keys(gp.$store._mutations||{}).filter(k=>/PAGE|IMPORT|LOAD|FUNNEL|SECTION/i.test(k));
        }
        if (gp?.$pinia) {
          const stores = {};
          gp.$pinia._s?.forEach((s, id) => { stores[id] = Object.keys(s).filter(k=>!k.startsWith('_')); });
          report.pinia_stores = stores;
        }
      }
    } catch(e) { report.vue3_err = e.message; }

    // Window globals that look GHL-related
    report.window_globals = Object.keys(window).filter(k =>
      /ghl|highlevel|funnel|builder|page.*editor|editor.*page/i.test(k)
    );

    // localStorage keys that look GHL-related
    const lsKeys = [];
    for (let i=0; i<localStorage.length; i++) {
      const k = localStorage.key(i);
      if (/hl|ghl|clipboard|builder|funnel|section|copy/i.test(k)) lsKeys.push(k);
    }
    report.localStorage_keys = lsKeys;

    // Buttons visible on the page that look import-related
    report.import_buttons = Array.from(document.querySelectorAll('button,[role="button"]'))
      .map(el => el.textContent.trim().slice(0,40))
      .filter(t => /import|settings|load page|upload/i.test(t));

    sendResponse({ ok: true, report });
    return true;
  }

  // ── SNIFF ────────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_SNIFF') {
    const snap = {};
    for (let i=0; i<localStorage.length; i++) { const k=localStorage.key(i); snap[k]=localStorage.getItem(k); }
    sendResponse({ ok:true, snap });
    return true;
  }
});

// ── Framework finders ────────────────────────────────────────────────────────
function findVue2Root() {
  for (const sel of ['#app','#builder','#funnel-builder','[id*="builder"]','body']) {
    const el = document.querySelector(sel);
    if (el?.__vue__) return el.__vue__.$root;
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let node, depth=0;
  while ((node=walker.nextNode()) && depth++<800) { if (node.__vue__) return node.__vue__.$root; }
  return null;
}

function findVue3App() {
  for (const sel of ['#app','#builder','[id*="app"]','body']) {
    const el = document.querySelector(sel);
    if (el?.__vue_app__) return el.__vue_app__;
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let node, depth=0;
  while ((node=walker.nextNode()) && depth++<800) { if (node.__vue_app__) return node.__vue_app__; }
  return null;
}

function findReactRoot() {
  for (const sel of ['#root','#app','[data-reactroot]','body']) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const key = Object.keys(el).find(k => k.startsWith('__reactFiber')||k.startsWith('__reactInternalInstance'));
    if (key) return el[key];
  }
  return null;
}

// ── Injection helpers ─────────────────────────────────────────────────────────
function tryVueStore(store, pageData) {
  const actions   = Object.keys(store._actions||{});
  const mutations = Object.keys(store._mutations||{});
  for (const a of actions) {
    if (/import|load.*page|set.*page|page.*load|funnel.*load|restore/i.test(a)) {
      try { store.dispatch(a, pageData); return true; } catch(_) {}
    }
  }
  for (const m of mutations) {
    if (/SET_PAGE|LOAD_PAGE|IMPORT_PAGE|SET_SECTIONS|RESTORE/i.test(m)) {
      try { store.commit(m, pageData); return true; } catch(_) {}
    }
  }
  return false;
}

function tryVue3(pageData) {
  const app = findVue3App();
  if (!app) return false;
  const gp = app.config?.globalProperties;

  // Vuex 4
  if (gp?.$store) return tryVueStore(gp.$store, pageData);

  // Pinia
  if (gp?.$pinia) {
    let found = false;
    gp.$pinia._s?.forEach((store) => {
      if (found) return;
      const keys = Object.keys(store);
      const pageKey = keys.find(k => /page|sections|funnel|builder/i.test(k));
      if (pageKey) { try { store[pageKey] = pageData; found = true; } catch(_) {} }
      // Try $patch
      if (!found && typeof store.$patch === 'function') {
        try { store.$patch({ page: pageData }); found = true; } catch(_) {}
        try { store.$patch({ pageData }); found = true; } catch(_) {}
      }
    });
    return found;
  }
  return false;
}

function tryGHLGlobals(pageData, jsonStr) {
  const candidates = [
    'GHL', 'ghl', 'HighLevel', 'highlevel',
    'pageBuilder', 'PageBuilder', 'builderInstance',
    'funnelBuilder', 'FunnelBuilder',
    'pageEditor', 'PageEditor',
    '__builder', '__pageBuilder', '__ghlBuilder',
  ];
  for (const k of candidates) {
    const g = window[k];
    if (!g) continue;
    for (const fn of ['importPage','loadPage','setPage','importJSON','loadJSON','setPageData']) {
      if (typeof g[fn] === 'function') { try { g[fn](pageData); return true; } catch(_) {} }
    }
  }
  return false;
}

async function tryUIImport(jsonStr) {
  function byText(sel, txt) {
    return Array.from(document.querySelectorAll(sel))
      .find(el => el.textContent.trim().toLowerCase().includes(txt.toLowerCase()));
  }
  function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

  const trigger =
    byText('button,[role="button"]','import page') ||
    byText('button,[role="button"]','import') ||
    document.querySelector('[data-testid="import-page"],[aria-label*="import" i],[title*="import" i]');
  if (!trigger) return false;

  trigger.click();
  await sleep(700);

  const importOpt = byText('button,[role="menuitem"],[role="option"],a','import page') ||
                    byText('button,[role="menuitem"],[role="option"],a','import');
  if (importOpt) { importOpt.click(); await sleep(700); }

  const dialog = document.querySelector('dialog,[role="dialog"],.modal,.import-dialog');
  const ta = dialog
    ? dialog.querySelector('textarea,input[type="text"]')
    : document.querySelector('dialog textarea,[role="dialog"] textarea');
  if (!ta) return false;

  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value')?.set;
  if (nativeSetter) nativeSetter.call(ta, jsonStr); else ta.value = jsonStr;
  ta.dispatchEvent(new Event('input',{bubbles:true}));
  ta.dispatchEvent(new Event('change',{bubbles:true}));
  await sleep(300);

  const confirm = byText('button,[role="button"]','import') ||
                  byText('button,[role="button"]','load')   ||
                  byText('button,[role="button"]','confirm')||
                  byText('button,[role="button"]','apply');
  if (confirm) { confirm.click(); return true; }
  const form = ta.closest('form');
  if (form) { form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); return true; }
  return false;
}
