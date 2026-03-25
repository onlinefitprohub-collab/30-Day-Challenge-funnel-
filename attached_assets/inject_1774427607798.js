// SiteGrab — Inject Script
// Runs in the PAGE context to access GHL's internal objects

(function() {
  'use strict';

  if (window.__sitegrab_injected) return;
  window.__sitegrab_injected = true;

  const FUNNELS_BASE = 'https://backend.leadconnectorhq.com';

  // ── GHL Detection ──

  function getNuxtPageData() {
    try {
      if (typeof useNuxtApp === 'function') {
        const app = useNuxtApp();
        if (app && app.payload && app.payload.data && app.payload.data.pageData) {
          return app.payload.data.pageData;
        }
      }
    } catch (e) {}

    try {
      const nuxt = window.__nuxt;
      if (nuxt && nuxt.__vue_app__) {
        const gp = nuxt.__vue_app__.config.globalProperties;
        if (gp.$nuxt && gp.$nuxt.payload && gp.$nuxt.payload.data && gp.$nuxt.payload.data.pageData) {
          return gp.$nuxt.payload.data.pageData;
        }
      }
    } catch (e) {}

    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const text = script.textContent;
        if (text && text.includes('funnelId') && text.includes('stepId')) {
          const funnelMatch = text.match(/"funnelId"\s*:\s*"([^"]+)"/);
          const stepMatch = text.match(/"stepId"\s*:\s*"([^"]+)"/);
          const pageIdMatch = text.match(/"pageId"\s*:\s*"([^"]+)"/);
          const nameMatch = text.match(/"pageName"\s*:\s*"([^"]+)"/);
          if (funnelMatch && stepMatch) {
            return {
              funnelId: funnelMatch[1],
              stepId: stepMatch[1],
              pageId: pageIdMatch ? pageIdMatch[1] : null,
              pageName: nameMatch ? nameMatch[1] : null
            };
          }
        }
      }
    } catch (e) {}

    return null;
  }

  function getVueApp() {
    try {
      const el = document.querySelector('#app');
      if (el && el.__vue_app__) return el.__vue_app__;
    } catch (e) {}
    return null;
  }

  function getService() {
    const app = getVueApp();
    if (app) return app.config.globalProperties.revexBackendService || null;
    return null;
  }

  async function getUserId() {
    try {
      // Method 1: AppUtils (returns a Promise)
      if (window.AppUtils && window.AppUtils.Utilities && window.AppUtils.Utilities.getCurrentUser) {
        const user = await window.AppUtils.Utilities.getCurrentUser();
        if (user && (user.id || user._id || user.userId)) {
          return user.id || user._id || user.userId;
        }
      }
    } catch (e) {}

    try {
      // Method 2: Vuex store
      const app = getVueApp();
      if (app) {
        const store = app.config.globalProperties.$store;
        if (store && store.state.user && store.state.user.user) {
          const u = store.state.user.user;
          return u._id || u.id || u.userId;
        }
      }
    } catch (e) {}

    return null;
  }

  function detectPublishedPage() {
    try {
      if (window.attribution && window.attribution.locationId) {
        const pageData = getNuxtPageData();
        return {
          type: 'published',
          locationId: window.attribution.locationId,
          funnelId: pageData ? pageData.funnelId : null,
          stepId: pageData ? pageData.stepId : null,
          pageName: (pageData && (pageData.pageName || pageData.name)) || document.title,
          pageId: pageData ? (pageData._id || pageData.pageId) : null
        };
      }
    } catch (e) {}
    return null;
  }

  function detectPageBuilder() {
    try {
      const match = window.location.pathname.match(
        /\/location\/([^/]+)\/.*(?:page-builder|builder)\/([^/?#]+)/
      );
      if (!match) return null;

      return {
        type: 'builder',
        locationId: match[1],
        pageBuilderId: match[2],
        hasService: !!getService(),
        pageName: document.title.replace(/ - .*$/, '').trim() || 'Page Builder'
      };
    } catch (e) {}
    return null;
  }

  function detectGHLPage() {
    return detectPageBuilder() || detectPublishedPage();
  }

  // ── Fetch page funnel data via API ──

  async function fetchPageData(pageId) {
    const service = getService();
    if (!service) throw new Error('Not logged in to GHL.');
    const response = await service.get(FUNNELS_BASE + '/funnels/page/' + pageId);
    return response.data || response;
  }

  // ── Page Grab ──

  async function grabPage() {
    const pageInfo = detectGHLPage();
    if (!pageInfo) {
      return { success: false, error: 'Not a GHL page' };
    }

    // Published page with data already available
    if (pageInfo.type === 'published' && pageInfo.funnelId && pageInfo.stepId) {
      return {
        success: true,
        data: {
          funnelId: pageInfo.funnelId,
          stepId: pageInfo.stepId,
          pageName: pageInfo.pageName,
          pageId: pageInfo.pageId,
          locationId: pageInfo.locationId,
          grabbedAt: Date.now(),
          sourceUrl: window.location.href
        }
      };
    }

    // Builder page — fetch data via API
    if (pageInfo.type === 'builder' && pageInfo.pageBuilderId) {
      try {
        const page = await fetchPageData(pageInfo.pageBuilderId);
        return {
          success: true,
          data: {
            funnelId: page.funnelId,
            stepId: page.stepId || page._id,
            pageName: page.name || pageInfo.pageName,
            pageId: page._id || pageInfo.pageBuilderId,
            locationId: pageInfo.locationId,
            grabbedAt: Date.now(),
            sourceUrl: window.location.href
          }
        };
      } catch (e) {
        return { success: false, error: 'Could not fetch page data: ' + e.message };
      }
    }

    return { success: false, error: 'Could not extract page data. Try refreshing.' };
  }

  // ── Page Drop ──

  async function dropPage(grabbedData) {
    const pageInfo = detectGHLPage();
    if (!pageInfo) {
      return { success: false, error: 'Open a GHL page builder to drop.' };
    }

    // We need: the service, the user ID, and the destination page's funnelId/stepId
    const service = getService();
    if (!service) {
      return { success: false, error: 'Not logged in to GHL. Open a page builder and try again.' };
    }

    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Could not identify current user. Make sure you are logged in.' };
    }

    // Get destination page info
    // For builder pages, use the pageBuilderId from the URL
    // For published pages, use the pageId if available
    let destPageId = null;
    if (pageInfo.type === 'builder') {
      destPageId = pageInfo.pageBuilderId;
    } else if (pageInfo.pageId) {
      destPageId = pageInfo.pageId;
    }

    if (!destPageId) {
      return { success: false, error: 'Could not identify destination page. Open a page builder and try again.' };
    }

    let destFunnelId, destStepId;
    try {
      const page = await fetchPageData(destPageId);
      destFunnelId = page.funnelId;
      destStepId = page.stepId || page._id;
    } catch (e) {
      return { success: false, error: 'Could not fetch destination page info: ' + e.message };
    }

    try {
      const payload = {
        funnelId: destFunnelId,
        funnelIdToImport: grabbedData.funnelId,
        funnels: [destFunnelId],
        locationId: pageInfo.locationId,
        pageIndexToImport: '0',
        pageIndexToImportInto: '0',
        stepId: grabbedData.stepId,
        stepIdToImportInto: destStepId,
        userId: userId
      };

      await service.post(FUNNELS_BASE + '/funnels/funnel/clone-funnel-step/', payload);

      // Auto-refresh so the user sees the cloned page instantly
      // Use setTimeout so the success response gets sent before the page unloads
      setTimeout(() => window.location.reload(), 100);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Drop failed: ' + e.message };
    }
  }

  // ── Message Handler ──

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data?.source !== 'sitegrab-content') return;

    const { requestId, action, data } = event.data;

    (async () => {
      let payload;

      switch (action) {
        case 'detectPage': {
          const info = detectGHLPage();
          if (info) {
            window.postMessage({
              source: 'sitegrab-inject',
              action: 'setBadge',
              data: { text: 'GHL', color: '#10B981' }
            }, '*');
          }
          payload = { success: true, data: info };
          break;
        }

        case 'grabPage':
          payload = await grabPage();
          break;

        case 'dropPage':
          payload = await dropPage(data);
          break;

        default:
          payload = { success: false, error: 'Unknown action' };
      }

      window.postMessage({
        source: 'sitegrab-inject',
        requestId,
        payload
      }, '*');
    })();
  });
})();
