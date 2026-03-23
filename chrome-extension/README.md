# Challenge Funnel — HighLevel Page Library Extension

A Chrome extension that gives you a one-click page library for your HighLevel funnel builder.

## What it does

Adds a floating **Page Library** panel inside the HighLevel page builder. Click a page type to copy the full HTML to your clipboard, then paste it into an HTML Code element in your funnel — no API keys, no tokens, no page IDs required.

## Setup (2 steps)

1. **Load the extension** — Go to `chrome://extensions`, enable *Developer mode*, click *Load unpacked*, and select this folder.
2. **Configure settings** — Open the extension popup → **Settings** tab → enter:
   - **App URL** — your Challenge Funnel app URL (e.g. `https://your-app.replit.dev`)
   - **Project ID** — found in your results page URL: `.../results/YOUR-PROJECT-ID`

   Both values are shown on the results page with one-click copy buttons.

## Using it

**From the popup (any page):**
1. Open the extension → **Library** tab
2. Click **Copy** next to a page type (Landing, Opt-In, Thank You, Booking)
3. In HL builder: drag an **HTML Code** element onto the page, click it, paste with Ctrl+V / ⌘V

**From the floating panel (on app.gohighlevel.com):**
- A **CF Funnel Library** panel appears automatically in the bottom-right corner when you're in the HL page builder
- Click any page button to copy the HTML, then paste it into an HTML Code element

## Permissions used

| Permission | Why |
|---|---|
| `storage` | Saves App URL + Project ID settings |
| `activeTab` | Reads the current HL page URL for context |
| `clipboardWrite` | Copies page HTML to clipboard |
| `https://app.gohighlevel.com/*` | Shows the floating library panel in the builder |
| `https://*.replit.dev/*`, `https://*.replit.app/*` | Fetches page HTML from your app |
