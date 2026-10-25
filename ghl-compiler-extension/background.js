// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!['GHL_INJECT','GHL_SNIFF','GHL_DEBUG'].includes(msg.type)) return;

  // Helper: find best GHL builder tab
  function findTab(cb) {
    chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
      const candidates = (tabs || []).filter(t =>
        t.url && !t.url.startsWith('chrome') && !t.url.startsWith('about') && !t.url.startsWith('edge')
      );
      const builderTab =
        candidates.find(t => t.url.includes('builder')) ||
        candidates.find(t => t.url.includes('gohighlevel') || t.url.includes('leadconnector') || t.url.includes('highlevel')) ||
        candidates[0];
      cb(builderTab || null);
    });
  }

  // ── DEBUG ─────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_DEBUG') {
    findTab(tab => {
      if (!tab) { sendResponse({ ok: false, error: 'No tab found' }); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'GHL_DEBUG' }, resp => {
        if (chrome.runtime.lastError) {
          // Content script not running — inject the scan directly
          chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: () => {
              const report = {};
              report.frameUrl = location.href;
              report.isIframe = window.self !== window.top;
              // Framework detection
              function findVue2() { const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT); let n,d=0; while((n=walker.nextNode())&&d++<800){if(n.__vue__)return n.__vue__.$root;} return null; }
              function findVue3() { const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT); let n,d=0; while((n=walker.nextNode())&&d++<800){if(n.__vue_app__)return n.__vue_app__;} return null; }
              function findReact() { for(const sel of['#root','#app','body']){const el=document.querySelector(sel);if(!el)continue;const k=Object.keys(el).find(k=>k.startsWith('__reactFiber')||k.startsWith('__reactInternalInstance'));if(k)return el[k];} return null; }
              report.vue2 = !!findVue2(); report.vue3 = !!findVue3(); report.react = !!findReact();
              try { const r=findVue2(); if(r&&r.$store){ report.vuex2_actions=Object.keys(r.$store._actions||{}).filter(k=>/page|import|load|funnel|section/i.test(k)); report.vuex2_mutations=Object.keys(r.$store._mutations||{}).filter(k=>/PAGE|IMPORT|LOAD|FUNNEL|SECTION/i.test(k)); report.vuex2_state=Object.keys(r.$store.state||{}); }} catch(e){report.vue2_err=e.message;}
              try { const a=findVue3(); if(a){const gp=a.config?.globalProperties; if(gp?.$store){report.vuex3_actions=Object.keys(gp.$store._actions||{}).filter(k=>/page|import|load|funnel/i.test(k));} if(gp?.$pinia){const st={};gp.$pinia._s?.forEach((s,id)=>{st[id]=Object.keys(s).filter(k=>!k.startsWith('_'));});report.pinia_stores=st;}}} catch(e){report.vue3_err=e.message;}
              report.window_globals=Object.keys(window).filter(k=>/ghl|highlevel|funnel|builder|page.*editor|editor.*page/i.test(k));
              const ls=[]; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/hl|ghl|clipboard|builder|funnel|section|copy/i.test(k))ls.push(k);} report.localStorage_keys=ls;
              report.import_buttons=Array.from(document.querySelectorAll('button,[role="button"]')).map(el=>el.textContent.trim().slice(0,40)).filter(t=>/import|settings|load page/i.test(t));
              return report;
            }
          }, results => {
            if (!chrome.runtime.lastError && results && results.length > 1) {
              // Multiple frames — merge results, prefer the iframe that found a framework
              const merged = results.map(r => r.result).filter(Boolean);
              const frameworkFrame = merged.find(r => r.vue2 || r.vue3 || r.react) || merged[0];
              frameworkFrame._allFrames = merged.map(r => ({ url: r.frameUrl, isIframe: r.isIframe, vue2: r.vue2, vue3: r.vue3, react: r.react, ls_count: r.localStorage_keys?.length }));
              sendResponse({ ok: true, report: frameworkFrame });
              return;
            }
            if (chrome.runtime.lastError) sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            else sendResponse({ ok: true, report: results[0].result });
          });
        } else {
          sendResponse(resp || { ok: false, error: 'no response' });
        }
      });
    });
    return true;
  }

  // ── SNIFF ────────────────────────────────────────────────────────────────
  if (msg.type === 'GHL_SNIFF') {
    findTab(tab => {
      if (!tab) { sendResponse({ ok: false, error: 'No tab found' }); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'GHL_SNIFF' }, resp => {
        if (chrome.runtime.lastError) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const snap = {};
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                snap[k] = localStorage.getItem(k);
              }
              return snap;
            }
          }, (results) => {
            if (chrome.runtime.lastError) sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            else sendResponse({ ok: true, snap: results[0].result });
          });
        } else {
          sendResponse(resp || { ok: true, snap: {} });
        }
      });
    });
    return true;
  }

  if (msg.type !== 'GHL_INJECT') return;

  const pageData = msg.payload;

  // Use the active tab — same as the working chrome-extension/popup.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) {
      sendResponse({ ok: false, error: 'No active tab. Switch to the GHL builder tab first, then click Inject.' });
      return;
    }

    // Exact same approach as chrome-extension/popup.js injectPage()
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: (data) => {
        // Try GHL's internal builder API
        if (typeof window.__ghl_builder_import === 'function') {
          window.__ghl_builder_import(data);
          return { ok: true, method: 'api', frame: location.href };
        }
        // Dispatch custom event — content script listener picks it up
        window.dispatchEvent(new CustomEvent('ghl-funnel-inject', { detail: data }));
        return { ok: true, method: 'event', frame: location.href };
      },
      args: [pageData],
    }, (results) => {
      if (chrome.runtime.lastError) {
        sendResponse({ ok: false, error: chrome.runtime.lastError.message });
        return;
      }
      // Pick the result from whichever frame used the API (prefer that over event)
      const best = (results || []).map(r => r.result).find(r => r?.method === 'api')
                || (results || [])[0]?.result
                || { ok: true, method: 'event' };
      sendResponse({ ok: true, method: best.method, frame: best.frame });
    });
  });

  return true;
});
