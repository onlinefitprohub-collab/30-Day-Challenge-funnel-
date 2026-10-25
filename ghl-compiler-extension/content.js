const CLIPBOARD_KEYS = [
  'hl-copy-element','hl_copy_element','builder-clipboard','ghl-clipboard',
  'section-clipboard','hl-page-clipboard','highlevel_clipboard',
  'page-builder-clipboard','hl-section-copy','hl_section_copy','hl-builder-copy'
];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === 'GHL_INJECT') {
    (async () => {
      const jsonStr = msg.jsonStr;
      let pageData;
      try { pageData = JSON.parse(jsonStr); } catch(e) { sendResponse({ok:false,error:'Invalid JSON'}); return; }

      // ── 1. Try Vue2 store injection ──────────────────────────────────
      let vueOk = false;
      try {
        const root = findVue2Root();
        if (root && root.$store) {
          vueOk = tryVueStore(root.$store, pageData);
        }
      } catch(_) {}

      // ── 2. Try automating GHL's import UI ───────────────────────────
      let uiOk = false;
      if (!vueOk) {
        try { uiOk = await tryUIImport(jsonStr); } catch(_) {}
      }

      // ── 3. Write to localStorage clipboard keys as fallback ──────────
      CLIPBOARD_KEYS.forEach(k => { try { localStorage.setItem(k, jsonStr); } catch(_) {} });

      // ── 4. Write to system clipboard ────────────────────────────────
      try { await navigator.clipboard.writeText(jsonStr); } catch(_) {}

      if (vueOk) sendResponse({ok:true, method:'vue-store'});
      else if (uiOk) sendResponse({ok:true, method:'ui-import'});
      else sendResponse({ok:true, method:'clipboard', needsCtrlV: true});
    })();
    return true;
  }

  if (msg.type === 'GHL_SNIFF') {
    const snap = {};
    for (let i=0; i<localStorage.length; i++) {
      const k=localStorage.key(i);
      snap[k]=localStorage.getItem(k);
    }
    // Also try to find Vue store keys
    try {
      const root = findVue2Root();
      if (root && root.$store) {
        snap._vuex_actions = Object.keys(root.$store._actions||{}).join(',');
        snap._vuex_state   = Object.keys(root.$store.state||{}).join(',');
        snap._vuex_mutations = Object.keys(root.$store._mutations||{}).join(',');
      }
    } catch(_) {}
    sendResponse({ok:true, snap});
    return true;
  }
});

// ── Vue2 root finder ──────────────────────────────────────────────────
function findVue2Root() {
  // Try common GHL root elements first
  const candidates = ['#app','#builder','#funnel-builder','[id*="builder"]','[class*="builder"]','body'];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el && el.__vue__) return el.__vue__.$root;
  }
  // Shallow TreeWalker scan (stop early once found)
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node, depth = 0;
    while ((node = walker.nextNode()) && depth < 500) {
      if (node.__vue__) return node.__vue__.$root;
      depth++;
    }
  } catch(_) {}
  return null;
}

// ── Try Vuex store actions/mutations ──────────────────────────────────
function tryVueStore(store, pageData) {
  const actions    = Object.keys(store._actions || {});
  const mutations  = Object.keys(store._mutations || {});

  // Action patterns that GHL might use for page import
  const actionPat  = /import|load.*page|set.*page|page.*load|funnel.*load|restore/i;
  const mutPat     = /SET_PAGE|LOAD_PAGE|IMPORT_PAGE|SET_SECTIONS|RESTORE/i;

  for (const a of actions) {
    if (actionPat.test(a)) {
      try { store.dispatch(a, pageData); return true; } catch(_) {}
    }
  }
  for (const m of mutations) {
    if (mutPat.test(m)) {
      try { store.commit(m, pageData); return true; } catch(_) {}
    }
  }

  // Try to directly replace state if we can see a relevant key
  const stateKeys = Object.keys(store.state || {});
  const pageKey   = stateKeys.find(k => /page|funnel|builder|sections/i.test(k));
  if (pageKey) {
    try {
      store.state[pageKey] = pageData;
      // trigger reactivity
      if (store._vm) store._vm.$forceUpdate();
      return true;
    } catch(_) {}
  }

  return false;
}

// ── Try automating GHL's Import Page UI ──────────────────────────────
async function tryUIImport(jsonStr) {
  function byText(sel, txt) {
    return Array.from(document.querySelectorAll(sel))
      .find(el => el.textContent.trim().toLowerCase().includes(txt.toLowerCase()));
  }
  function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

  // Step 1: Find & click the settings / import trigger button
  const trigger =
    byText('button,[role="button"]','import page') ||
    byText('button,[role="button"]','import') ||
    document.querySelector('[data-testid="import-page"],[aria-label*="import" i],[title*="import" i]') ||
    byText('button,[role="button"]', 'settings') ||
    document.querySelector('.settings-btn,.builder-settings,[data-qa="settings"]');

  if (!trigger) return false;
  trigger.click();
  await sleep(600);

  // Step 2: If settings opened, find import option inside
  const importOpt =
    byText('button,[role="menuitem"],[role="option"],a', 'import page') ||
    byText('button,[role="menuitem"],[role="option"],a', 'import');
  if (importOpt) { importOpt.click(); await sleep(600); }

  // Step 3: Find textarea or input in a dialog/modal for JSON paste
  const dialog = document.querySelector('dialog,[role="dialog"],.modal,.import-dialog,.page-import');
  const ta = dialog
    ? dialog.querySelector('textarea,input[type="text"]')
    : document.querySelector('dialog textarea,[role="dialog"] textarea,.modal textarea');

  if (!ta) return false;

  // Fill the textarea
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
                    || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  if (nativeSetter) nativeSetter.call(ta, jsonStr);
  else ta.value = jsonStr;
  ta.dispatchEvent(new Event('input', {bubbles:true}));
  ta.dispatchEvent(new Event('change', {bubbles:true}));
  await sleep(300);

  // Step 4: Click the confirm / import / load button inside the dialog
  const confirmBtn =
    byText('button,[role="button"]', 'import') ||
    byText('button,[role="button"]', 'load')   ||
    byText('button,[role="button"]', 'apply')  ||
    byText('button,[role="button"]', 'confirm')||
    byText('button,[role="button"]', 'ok');

  if (confirmBtn) { confirmBtn.click(); return true; }

  // Try submitting the form
  const form = ta.closest('form');
  if (form) { form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); return true; }

  return false;
}
