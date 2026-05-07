// State: map of filename → parsed JSON
const loadedPages = {};

const pageList   = document.getElementById("page-list");
const fileInput  = document.getElementById("file-input");
const loadBtn    = document.getElementById("load-btn");
const statusBar  = document.getElementById("status-bar");

function setStatus(msg, type = "") {
  statusBar.textContent = msg;
  statusBar.className = `status-bar ${type}`;
}

function friendlyLabel(filename) {
  return filename
    .replace(/\.json$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b(ghl|json)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderPageList() {
  const keys = Object.keys(loadedPages);
  if (keys.length === 0) {
    pageList.innerHTML = '<p class="no-pages">No pages loaded yet. Load JSON files below.</p>';
    return;
  }

  pageList.innerHTML = "";
  keys.forEach((filename) => {
    const item = document.createElement("div");
    item.className = "page-item";

    const label = document.createElement("span");
    label.className = "page-label";
    label.textContent = friendlyLabel(filename);

    const btn = document.createElement("button");
    btn.className = "inject-btn";
    btn.textContent = "Inject";
    btn.dataset.filename = filename;
    btn.addEventListener("click", () => injectPage(filename));

    item.appendChild(label);
    item.appendChild(btn);
    pageList.appendChild(item);
  });
}

loadBtn.addEventListener("click", () => {
  const files = fileInput.files;
  if (!files || files.length === 0) {
    setStatus("Please select at least one JSON file.", "error");
    return;
  }

  let remaining = files.length;
  let errors = 0;

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        loadedPages[file.name] = json;
      } catch {
        errors++;
        setStatus(`Failed to parse ${file.name} — not valid JSON.`, "error");
      }
      remaining--;
      if (remaining === 0) {
        renderPageList();
        if (errors === 0) {
          setStatus(`${files.length} file(s) loaded. Open GHL builder and click Inject.`, "success");
        }
      }
    };
    reader.readAsText(file);
  });
});

async function injectPage(filename) {
  const pageData = loadedPages[filename];
  if (!pageData) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    setStatus("No active tab found.", "error");
    return;
  }

  setStatus(`Injecting ${friendlyLabel(filename)}…`);

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (data) => {
        // Try GHL's internal builder API
        const w = window;
        if (w.__ghl_builder_import) {
          w.__ghl_builder_import(data);
          return { ok: true, method: "api" };
        }
        // Fallback: dispatch a custom event the content script can handle
        window.dispatchEvent(new CustomEvent("ghl-funnel-inject", { detail: data }));
        return { ok: true, method: "event" };
      },
      args: [pageData],
    });

    const result = results?.[0]?.result;
    if (result?.ok) {
      setStatus(`Injected via ${result.method}. Check your GHL builder.`, "success");
    } else {
      setStatus("Injection ran but no confirmation received.", "");
    }
  } catch (err) {
    setStatus(`Injection failed: ${err.message}`, "error");
  }
}
