// SiteGrab — Popup Script

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const DEV_MODE = false;

// ── Elements ──

const licenseScreen = document.getElementById('license-screen');
const mainScreen = document.getElementById('main-screen');
const licenseInput = document.getElementById('license-input');
const activateBtn = document.getElementById('activate-btn');
const licenseError = document.getElementById('license-error');
const statusPill = document.getElementById('status-pill');
const notGhlState = document.getElementById('not-ghl-state');
const ghlState = document.getElementById('ghl-state');
const grabBtn = document.getElementById('grab-btn');
const dropBtn = document.getElementById('drop-btn');
const dropStatus = document.getElementById('drop-status');
const grabbedLine = document.getElementById('grabbed-line');
const grabbedName = document.getElementById('grabbed-name');
const clearBtn = document.getElementById('clear-btn');
const changeLicenseBtn = document.getElementById('change-license-btn');

let currentPageInfo = null;

// ── Init ──

async function init() {
  if (DEV_MODE) {
    showMainScreen();
    return;
  }

  const { licenseKey, licenseValidatedAt } = await chrome.storage.sync.get(['licenseKey', 'licenseValidatedAt', 'instanceId']);

  if (!licenseKey) {
    showLicenseScreen();
    return;
  }

  const needsRevalidation = !licenseValidatedAt || (Date.now() - licenseValidatedAt > CACHE_DURATION);

  if (needsRevalidation) {
    const valid = await validateLicense(licenseKey);
    if (!valid) {
      showLicenseScreen();
      licenseError.textContent = 'License key is no longer valid. Please re-enter.';
      licenseError.classList.remove('hidden');
      return;
    }
  }

  showMainScreen();
}

// ── License ──

function showLicenseScreen() {
  licenseScreen.classList.remove('hidden');
  mainScreen.classList.add('hidden');
}

function showMainScreen() {
  licenseScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
  detectPage();
  loadGrabbedPage();
}

async function validateLicense(key) {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ license_key: key })
    });
    const data = await response.json();

    if (data.valid) {
      await chrome.storage.sync.set({ licenseKey: key, licenseValidatedAt: Date.now() });
      return true;
    }

    return false;
  } catch (e) {
    // Network error — allow if previously validated within cache window
    const { licenseValidatedAt } = await chrome.storage.sync.get('licenseValidatedAt');
    return !!licenseValidatedAt;
  }
}

async function activateLicense(key) {
  try {
    const instanceName = 'SiteGrab-' + Math.random().toString(36).substring(2, 10);
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ license_key: key, instance_name: instanceName })
    });
    const data = await response.json();

    if (data.activated) {
      const instanceId = data.instance && data.instance.id;
      await chrome.storage.sync.set({ licenseKey: key, licenseValidatedAt: Date.now(), instanceId });
      return true;
    }

    if (data.error && data.error.toLowerCase().includes('activation limit')) {
      return 'already_used';
    }

    return false;
  } catch (e) {
    return false;
  }
}

async function deactivateLicense(key, instanceId) {
  try {
    await fetch('https://api.lemonsqueezy.com/v1/licenses/deactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ license_key: key, instance_id: instanceId })
    });
  } catch (e) {
    // Best-effort deactivation
  }
}

activateBtn.addEventListener('click', async () => {
  const key = licenseInput.value.trim();
  if (!key) {
    licenseError.textContent = 'Please enter a license key.';
    licenseError.classList.remove('hidden');
    return;
  }

  activateBtn.disabled = true;
  activateBtn.textContent = 'Validating...';
  licenseError.classList.add('hidden');

  const result = await activateLicense(key);

  if (result === true) {
    showMainScreen();
  } else if (result === 'already_used') {
    licenseError.textContent = 'This license key has already been activated on another device.';
    licenseError.classList.remove('hidden');
  } else {
    licenseError.textContent = 'Invalid license key. Please check and try again.';
    licenseError.classList.remove('hidden');
  }

  activateBtn.disabled = false;
  activateBtn.textContent = 'Activate';
});

licenseInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') activateBtn.click();
});

let changePending = false;
changeLicenseBtn.addEventListener('click', async () => {
  if (!changePending) {
    changePending = true;
    changeLicenseBtn.textContent = 'This will deactivate your key. Click again to confirm.';
    changeLicenseBtn.style.color = '#EF4444';
    setTimeout(() => {
      changePending = false;
      changeLicenseBtn.textContent = 'Change license key';
      changeLicenseBtn.style.color = '';
    }, 5000);
    return;
  }
  const { licenseKey: currentKey, instanceId } = await chrome.storage.sync.get(['licenseKey', 'instanceId']);
  if (currentKey && instanceId) {
    await deactivateLicense(currentKey, instanceId);
  }
  await chrome.storage.sync.remove(['licenseKey', 'licenseValidatedAt', 'instanceId']);
  changePending = false;
  showLicenseScreen();
});

// ── Page Interaction ──

function sendToBackground(action, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { target: 'background', action, data },
      (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: false, error: 'No response' });
        }
      }
    );
  });
}

async function detectPage() {
  const result = await sendToBackground('detectPage');

  if (result.success && result.data) {
    currentPageInfo = result.data;
    statusPill.textContent = 'GHL Site';
    statusPill.className = 'pill pill-ghl';
    notGhlState.classList.add('hidden');
    ghlState.classList.remove('hidden');
  } else {
    currentPageInfo = null;
    statusPill.textContent = 'Not GHL';
    statusPill.className = 'pill pill-not-ghl';
    notGhlState.classList.remove('hidden');
    ghlState.classList.add('hidden');
  }
}

// ── Grab ──

grabBtn.addEventListener('click', async () => {
  grabBtn.disabled = true;

  if (!DEV_MODE) {
    const { licenseKey } = await chrome.storage.sync.get('licenseKey');
    const valid = await validateLicense(licenseKey);
    if (!valid) {
      grabBtn.disabled = false;
      showLicenseScreen();
      return;
    }
  }

  const result = await sendToBackground('grabPage');

  if (result.success) {
    await chrome.storage.local.set({ grabbedPage: result.data });
    loadGrabbedPage();
  }

  grabBtn.disabled = false;
});

// ── Drop ──

dropBtn.addEventListener('click', async () => {
  const { grabbedPage } = await chrome.storage.local.get('grabbedPage');
  if (!grabbedPage) return;

  dropBtn.disabled = true;
  dropStatus.classList.add('hidden');

  if (!DEV_MODE) {
    const { licenseKey } = await chrome.storage.sync.get('licenseKey');
    const valid = await validateLicense(licenseKey);
    if (!valid) {
      dropBtn.disabled = false;
      showLicenseScreen();
      return;
    }
  }

  const result = await sendToBackground('dropPage', grabbedPage);

  if (!result.success) {
    dropStatus.textContent = result.error || 'Failed to drop page.';
    dropStatus.classList.remove('hidden');
    dropBtn.disabled = false;
  }
});

// ── Grabbed State ──

async function loadGrabbedPage() {
  const { grabbedPage } = await chrome.storage.local.get('grabbedPage');

  if (grabbedPage) {
    grabbedLine.classList.remove('hidden');
    grabbedName.textContent = grabbedPage.pageName || 'Untitled';
    dropBtn.disabled = false;
  } else {
    grabbedLine.classList.add('hidden');
    dropBtn.disabled = true;
  }
}

clearBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove('grabbedPage');
  grabbedLine.classList.add('hidden');
  dropBtn.disabled = true;
  dropStatus.classList.add('hidden');
});

// ── Start ──

init();
