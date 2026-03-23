# Challenge Funnel in a Box — Chrome Extension

One-click injector that writes your AI-generated funnel pages into HighLevel's native page builder as real sections, rows, columns, headlines, and buttons — not custom code.

---

## Load the extension in Chrome (Developer mode)

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder from this project
5. The "CF Funnel" extension appears in your toolbar

> Pin it for easy access: click the puzzle piece icon → pin "Challenge Funnel in a Box".

---

## First-time setup

1. Click the extension icon → **Settings** tab
2. **App URL** — your Challenge Funnel app URL, e.g. `https://your-app.replit.dev`
3. **Project ID** — copy from your results page URL: `…/results/YOUR-PROJECT-ID`
4. **HighLevel API Key** — HighLevel → Settings → Integrations → API Key (sub-account key)
5. Click **Save Settings**

---

## Injecting a funnel page

1. In HighLevel, open your funnel and click **Edit** on a step to open the page builder
2. Copy the **Page ID** — find it in the step's settings or the URL bar
3. Click the **CF** button in the bottom-right of the HL page builder  
   *(or click the extension icon in Chrome's toolbar)*
4. Paste the Page ID into the "Enter the HL Page ID" field
5. Click **Inject** next to the page you want to build:
   - 🏠 Landing Page
   - 📋 Opt-In Page
   - 🎉 Thank You Page
   - 📅 Booking Page
6. Refresh the HL page builder to see your page built from native HL elements

---

## How it works

```
Extension popup
      │
      ▼
POST /api/highlevel/inject
  ├── Fetches project outputs from Supabase
  ├── Builds GhlPageData (sections, rows, columns, elements)
  └── PUTs to HighLevel /funnels/funnel/page/{pageId}
```

The injected page uses:
- **Colour scheme** you chose when generating (applied to gradients, buttons, accents)
- **Your actual copy** — headlines, bullet points, CTAs from the AI generation
- **Native HL elements** — drag-and-drop editable after injection

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Location ID not detected" | Make sure you're on `app.gohighlevel.com` |
| "Project not found" | Double-check the Project ID in Settings |
| HL API returns 401 | Your API key may be expired or wrong scope |
| HL API returns 404 | Check the Page ID — it must exist in HL |
| "Network error" | Check your App URL in Settings; ensure app is running |

---

## Icons

After loading the extension, generate proper PNG icons by running:

```bash
python3 -c "
import struct, zlib

def make_png(w, h, rgb):
    def chunk(t, d):
        c = zlib.crc32(t + d) & 0xffffffff
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', c)
    hdr = chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
    raw = b''.join(b'\x00' + bytes(rgb) * w for _ in range(h))
    return b'\x89PNG\r\n\x1a\n' + hdr + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')

for size in [16, 48, 128]:
    with open(f'chrome-extension/icons/icon{size}.png', 'wb') as f:
        f.write(make_png(size, size, [249, 115, 22]))
print('Icons created')
"
```
