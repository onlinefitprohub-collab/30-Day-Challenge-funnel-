// Mirror of chrome-extension/content.js — listen for the custom event
// dispatched by background.js executeScript and call GHL's builder API
window.addEventListener('ghl-funnel-inject', (e) => {
  const data = e.detail;
  if (!data) return;
  if (typeof window.__ghl_builder_import === 'function') {
    window.__ghl_builder_import(data);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // ── DEBUG — scan this frame for injectable hooks ─────────────────────────
  if (msg.type === 'GHL_DEBUG') {
    const report = {};
    report.frameUrl = location.href;
    report.isIframe = window.self !== window.top;

    function findVue2Root() {
      for (const sel of ['#app','#builder','body']) {
        const el = document.querySelector(sel);
        if (el?.__vue__) return el.__vue__.$root;
      }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node, depth = 0;
      while ((node = walker.nextNode()) && depth++ < 800) { if (node.__vue__) return node.__vue__.$root; }
      return null;
    }
    function findVue3App() {
      for (const sel of ['#app','#builder','body']) {
        const el = document.querySelector(sel);
        if (el?.__vue_app__) return el.__vue_app__;
      }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node, depth = 0;
      while ((node = walker.nextNode()) && depth++ < 800) { if (node.__vue_app__) return node.__vue_app__; }
      return null;
    }
    function findReactRoot() {
      for (const sel of ['#root','#app','body']) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const key = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
        if (key) return el[key];
      }
      return null;
    }

    report.vue2  = !!findVue2Root();
    report.vue3  = !!findVue3App();
    report.react = !!findReactRoot();
    report.hasBuilderAPI = typeof window.__ghl_builder_import === 'function';

    try {
      const root = findVue2Root();
      if (root?.$store) {
        report.vuex2_actions   = Object.keys(root.$store._actions   ||{}).filter(k => /page|import|load|funnel|section/i.test(k));
        report.vuex2_mutations = Object.keys(root.$store._mutations ||{}).filter(k => /PAGE|IMPORT|LOAD|FUNNEL|SECTION/i.test(k));
        report.vuex2_state     = Object.keys(root.$store.state      ||{});
      }
    } catch(e) { report.vue2_err = e.message; }

    try {
      const app = findVue3App();
      if (app) {
        const gp = app.config?.globalProperties;
        if (gp?.$store) {
          report.vuex3_actions = Object.keys(gp.$store._actions||{}).filter(k => /page|import|load|funnel/i.test(k));
        }
        if (gp?.$pinia) {
          const stores = {};
          gp.$pinia._s?.forEach((s, id) => { stores[id] = Object.keys(s).filter(k => !k.startsWith('_')); });
          report.pinia_stores = stores;
        }
      }
    } catch(e) { report.vue3_err = e.message; }

    report.window_globals = Object.keys(window).filter(k => /ghl|highlevel|funnel|builder|page.*editor/i.test(k));

    const lsKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (/hl|ghl|clipboard|builder|funnel|section|copy/i.test(k)) lsKeys.push(k);
    }
    report.localStorage_keys = lsKeys;

    report.import_buttons = Array.from(document.querySelectorAll('button,[role="button"]'))
      .map(el => el.textContent.trim().slice(0, 40))
      .filter(t => /import|settings|load page|upload/i.test(t));

    sendResponse({ ok: true, report });
    return true;
  }

  // ── SNIFF ────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_SNIFF') {
    const snap = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      snap[k] = localStorage.getItem(k);
    }
    sendResponse({ ok: true, snap });
    return true;
  }
});
