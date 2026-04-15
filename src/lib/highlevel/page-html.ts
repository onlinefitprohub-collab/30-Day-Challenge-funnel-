import type { GeneratedFunnelAssets } from "@/types/generation";

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;color:#111}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
</style>
</head>
<body>${body}</body>
</html>`;
}

export function generateLandingPageHtml(data: GeneratedFunnelAssets): string {
  const lp = data.landingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const bullets = lp.bulletPoints
    .map(
      (b) => `<li style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:10px">
  <span style="width:20px;height:20px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </span>
  <span style="font-size:14px;line-height:1.5;color:#374151">${b}</span>
</li>`
    )
    .join("");

  const faqs = lp.faqItems
    .map(
      (f) => `<div style="border:1px solid #e5e7eb;border-radius:14px;padding:20px;background:#fff;margin-bottom:10px">
  <p style="font-weight:700;color:#111;margin-bottom:8px;font-size:15px">${f.question}</p>
  <p style="color:#6b7280;font-size:14px;line-height:1.6">${f.answer}</p>
</div>`
    )
    .join("");

  const body = `
<!-- NAV -->
<nav style="background:#0f172a;padding:16px 32px;display:flex;align-items:center;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:10px">
    <div style="width:32px;height:32px;background:#f97316;border-radius:8px;display:flex;align-items:center;justify-content:center">
      <span style="color:#fff;font-weight:900;font-size:11px">CF</span>
    </div>
    <span style="color:#fff;font-weight:700;font-size:14px">${concept}</span>
  </div>
  <a href="#signup" style="background:#f97316;color:#fff;padding:8px 20px;border-radius:999px;font-weight:700;font-size:13px">${lp.ctaText}</a>
</nav>

<!-- HERO -->
<section style="background:linear-gradient(160deg,#0f172a 0%,#1e1b4b 55%,#0f172a 100%);padding:80px 32px;text-align:center">
  <span style="display:inline-block;border:1px solid rgba(249,115,22,0.4);background:rgba(249,115,22,0.1);padding:6px 18px;border-radius:999px;color:#fb923c;font-size:13px;font-weight:600;margin-bottom:24px">🔥 Limited Spots Available</span>
  <h1 style="font-size:clamp(28px,4vw,52px);font-weight:900;color:#fff;line-height:1.1;margin-bottom:20px;max-width:700px;margin-left:auto;margin-right:auto">${lp.headlineOptions[0]}</h1>
  <p style="font-size:18px;color:#94a3b8;max-width:560px;margin:0 auto 36px;line-height:1.6">${lp.subheadline}</p>
  <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:16px;margin-bottom:24px">
    <a id="signup" href="#optin" style="display:inline-flex;align-items:center;gap:8px;background:#f97316;color:#fff;padding:16px 36px;border-radius:999px;font-weight:900;font-size:17px;box-shadow:0 10px 30px rgba(249,115,22,0.35)">${lp.ctaText} →</a>
    <span style="font-size:13px;color:#64748b">No credit card required</span>
  </div>
  ${lp.urgencyIdeas[0] ? `<p style="font-size:13px;color:#f87171;font-weight:600">${lp.urgencyIdeas[0]}</p>` : ""}
</section>

<!-- SOCIAL PROOF BAR -->
<div style="background:#1e293b;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);padding:14px 32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:24px">
  <span style="display:flex;align-items:center;gap:8px;color:#94a3b8;font-size:13px">
    <span style="color:#facc15">★★★★★</span> 500+ coaches launched
  </span>
  <span style="color:#334155;font-size:13px">|</span>
  <span style="color:#94a3b8;font-size:13px">✓ ${data.offerSummary.corePromise}</span>
</div>

<!-- BENEFITS -->
<section style="background:#fff;padding:72px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#f97316;margin-bottom:6px;text-align:center">What You'll Get</p>
    <h2 style="font-size:32px;font-weight:900;text-align:center;margin-bottom:36px;color:#111">Everything you need to succeed</h2>
    <ul style="list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${bullets}</ul>
  </div>
</section>

<!-- FAQ -->
${
  lp.faqItems.length > 0
    ? `<section style="background:#f8fafc;padding:72px 32px">
  <div style="max-width:640px;margin:0 auto">
    <h2 style="font-size:30px;font-weight:900;text-align:center;margin-bottom:32px;color:#111">Frequently Asked Questions</h2>
    ${faqs}
  </div>
</section>`
    : ""
}

<!-- FINAL CTA -->
<section style="background:linear-gradient(135deg,#f97316,#ea580c);padding:72px 32px;text-align:center">
  <h2 style="font-size:clamp(24px,3vw,38px);font-weight:900;color:#fff;margin-bottom:16px">Ready to transform your coaching?</h2>
  <p style="color:rgba(255,255,255,0.8);margin-bottom:32px;font-size:16px">${lp.urgencyIdeas[1] ?? "Spots are filling fast — claim yours now."}</p>
  <a href="#optin" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#f97316;padding:16px 36px;border-radius:999px;font-weight:900;font-size:17px;box-shadow:0 8px 24px rgba(0,0,0,0.15)">${lp.ctaText} →</a>
</section>

<!-- FOOTER -->
<footer style="background:#0f172a;padding:28px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.05)">
  <p style="color:#475569;font-size:12px">© ${new Date().getFullYear()} ${concept}. All rights reserved.</p>
  <p style="color:#334155;font-size:11px;margin-top:4px">Privacy Policy · Terms of Service</p>
</footer>`;

  return base(lp.headlineOptions[0] ?? concept, body);
}

export function generateOptInPageHtml(data: GeneratedFunnelAssets): string {
  const form = data.optInForm;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const fields = form.recommendedFields
    .map(
      (f) => `<div style="margin-bottom:14px">
  <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">${f}</label>
  <div style="width:100%;border:2px solid #e5e7eb;border-radius:10px;padding:12px 16px;font-size:14px;color:#9ca3af;background:#f9fafb">${f} *</div>
</div>`
    )
    .join("");

  const body = `
<div style="min-height:100vh;background:linear-gradient(160deg,#1e1b4b 0%,#312e81 100%);padding:48px 24px;display:flex;flex-direction:column;align-items:center">
  <div style="text-align:center;max-width:480px;margin-bottom:32px">
    <span style="display:inline-block;border:1px solid rgba(167,139,250,0.4);background:rgba(167,139,250,0.1);padding:6px 18px;border-radius:999px;color:#c4b5fd;font-size:13px;font-weight:600;margin-bottom:20px">Step 1 of 2 — Claim Your Free Spot</span>
    <h1 style="font-size:clamp(24px,4vw,38px);font-weight:900;color:#fff;margin-bottom:12px;line-height:1.2">Join the ${concept} for Free</h1>
    <p style="color:#c4b5fd;font-size:15px;line-height:1.6">${form.formIntroText}</p>
  </div>

  <div style="background:#fff;border-radius:24px;padding:36px;width:100%;max-width:420px;box-shadow:0 25px 60px rgba(0,0,0,0.3)">
    <p style="font-size:15px;font-weight:700;color:#111;text-align:center;margin-bottom:24px">Enter your details below to get instant access</p>
    ${fields}
    <a href="#" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#7c3aed;color:#fff;padding:16px;border-radius:12px;font-weight:900;font-size:16px;margin-top:8px;cursor:pointer">${form.ctaButtonText} →</a>
    <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:12px">🔒 100% secure — your info is never shared.</p>
  </div>

  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin-top:24px">
    ${["✓ 100% Free", "✓ Instant Access", "✓ Cancel Anytime"].map((t) => `<span style="color:#c4b5fd;font-size:13px;font-weight:600">${t}</span>`).join("")}
  </div>
</div>`;

  return base(`Join the ${concept}`, body);
}

export function generateThankYouPageHtml(data: GeneratedFunnelAssets): string {
  const ty = data.thankYouPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const steps = ty.nextSteps
    .map(
      (step, i) => `<div style="display:flex;align-items:flex-start;gap:20px;padding:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;margin-bottom:12px">
  <div style="width:36px;height:36px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-weight:900;font-size:16px">${i + 1}</div>
  <p style="font-size:14px;color:#374151;line-height:1.6;padding-top:6px">${step}</p>
</div>`
    )
    .join("");

  const body = `
<!-- HERO -->
<section style="background:linear-gradient(160deg,#052e16 0%,#14532d 100%);padding:80px 32px;text-align:center">
  <div style="display:flex;justify-content:center;margin-bottom:24px">
    <div style="position:relative;display:inline-block">
      <div style="width:88px;height:88px;border-radius:50%;border:4px solid #4ade80;background:rgba(74,222,128,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span style="position:absolute;top:-8px;right:-8px;font-size:28px">🎉</span>
    </div>
  </div>
  <span style="display:inline-block;border:1px solid rgba(74,222,128,0.4);background:rgba(74,222,128,0.1);padding:6px 18px;border-radius:999px;color:#4ade80;font-size:13px;font-weight:700;margin-bottom:20px">You're In! Welcome to the ${concept}</span>
  <h1 style="font-size:clamp(26px,4vw,44px);font-weight:900;color:#fff;margin-bottom:16px;line-height:1.15;max-width:640px;margin-left:auto;margin-right:auto">${ty.confirmationMessage}</h1>
  <p style="color:#86efac;font-size:16px;max-width:500px;margin:0 auto;line-height:1.6">${ty.bookingEncouragement}</p>
</section>

<!-- NEXT STEPS -->
<section style="background:#fff;padding:72px 32px">
  <div style="max-width:600px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#22c55e;margin-bottom:6px;text-align:center">What Happens Next</p>
    <h2 style="font-size:28px;font-weight:900;text-align:center;margin-bottom:32px;color:#111">Here's your next steps</h2>
    ${steps}
  </div>
</section>

<!-- BOOKING CTA -->
<section style="background:linear-gradient(135deg,#16a34a,#059669);padding:72px 32px;text-align:center">
  <div style="max-width:540px;margin:0 auto">
    <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <h2 style="font-size:28px;font-weight:900;color:#fff;margin-bottom:12px">One more step — book your kick-off call</h2>
    <p style="color:rgba(255,255,255,0.8);margin-bottom:32px;font-size:16px;line-height:1.6">${ty.bookingEncouragement}</p>
    <a href="#booking" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#16a34a;padding:16px 36px;border-radius:999px;font-weight:900;font-size:17px;box-shadow:0 8px 24px rgba(0,0,0,0.15)">Book My Free Call Now →</a>
    <p style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:14px">30 minutes · No obligation · No sales pressure</p>
  </div>
</section>

<footer style="background:#052e16;padding:24px 32px;text-align:center">
  <p style="color:#166534;font-size:12px">© ${new Date().getFullYear()} ${concept}. All rights reserved.</p>
</footer>`;

  return base(`You're In! — ${concept}`, body);
}

export function generateBookingPageHtml(data: GeneratedFunnelAssets): string {
  const bk = data.bookingPage;
  const concept = data.offerSummary.challengeConcept ?? "30-Day Challenge";

  const whyBook = bk.whyBook
    .map(
      (reason) => `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px">
  <div style="width:22px;height:22px;background:#d97706;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>
  <p style="font-size:14px;color:#374151;line-height:1.5">${reason}</p>
</div>`
    )
    .join("");

  const body = `
<!-- HEADER -->
<section style="background:linear-gradient(160deg,#1c0a00 0%,#431407 100%);padding:64px 32px;text-align:center">
  <span style="display:inline-block;border:1px solid rgba(251,146,60,0.4);background:rgba(251,146,60,0.1);padding:6px 18px;border-radius:999px;color:#fb923c;font-size:13px;font-weight:600;margin-bottom:20px">Almost there — pick a time that works for you</span>
  <h1 style="font-size:clamp(24px,3.5vw,40px);font-weight:900;color:#fff;margin-bottom:14px;line-height:1.2;max-width:600px;margin-left:auto;margin-right:auto">Book Your Free ${concept} Strategy Call</h1>
  <p style="color:#fcd34d;font-size:15px;max-width:500px;margin:0 auto;line-height:1.6;opacity:0.9">${bk.shortIntro}</p>
</section>

<!-- MAIN CONTENT -->
<section style="background:#f8fafc;padding:64px 32px">
  <div style="max-width:800px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px">

    <!-- WHY BOOK -->
    <div>
      <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#d97706;margin-bottom:20px">Why Book a Call</p>
      ${whyBook}
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-top:20px">
        <p style="font-size:13px;font-weight:600;color:#92400e;margin-bottom:6px">What to expect on the call</p>
        <p style="font-size:13px;color:#b45309;line-height:1.6">${bk.expectationSetting}</p>
      </div>
      <div style="margin-top:20px">
        ${["Free 30-minute call", "No sales pressure", "100% confidential"].map((t) => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="color:#22c55e;font-size:14px">✓</span><span style="font-size:13px;color:#6b7280">${t}</span></div>`).join("")}
      </div>
    </div>

    <!-- CALENDAR PLACEHOLDER -->
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.06)">
      <p style="font-weight:700;font-size:14px;color:#111;text-align:center;margin-bottom:4px">Select a Date &amp; Time</p>
      <p style="font-size:12px;color:#9ca3af;text-align:center;margin-bottom:20px">Connect your calendar to show live availability</p>
      
      <div style="background:#f8fafc;border:2px dashed #e5e7eb;border-radius:12px;padding:32px;text-align:center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" style="margin:0 auto 12px"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p style="font-size:13px;color:#9ca3af;margin-bottom:6px">Add your Calendly or HL Calendar widget here</p>
        <p style="font-size:11px;color:#d1d5db">In HighLevel: Elements → Calendar</p>
      </div>

      <a href="#" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#d97706;color:#fff;padding:14px;border-radius:12px;font-weight:900;font-size:14px;margin-top:20px">Confirm My Spot →</a>
      <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:10px">You'll receive a confirmation email immediately after booking</p>
    </div>
  </div>
</section>

<footer style="background:#0f172a;padding:24px 32px;text-align:center">
  <p style="color:#334155;font-size:12px">© ${new Date().getFullYear()} ${concept}. All rights reserved.</p>
</footer>`;

  return base(`Book Your Call — ${concept}`, body);
}

export function generateSalesLetterHtml(data: GeneratedFunnelAssets): string {
  const sl    = data.longFormAssets?.salesLetter;
  const concept = data.offerSummary?.challengeConcept ?? "30-Day Challenge";
  if (!sl) return base(concept, `<div style="padding:80px 32px;text-align:center;font-size:18px;color:#6b7280">Sales letter not yet generated.</div>`);

  const p  = data.design?.primaryColor       || "#f97316";
  const dk = data.design?.darkBackground     || "#0f172a";
  const md = data.design?.midBackground      || "#1e293b";
  const br = data.design?.buttonBorderRadius || "8px";

  const whatYouGetCards = sl.whatYouGet.map((item) =>
    `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
      <div style="width:36px;height:36px;background:${p};border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <p style="font-weight:800;font-size:15px;color:#111;margin-bottom:6px">${item.name}</p>
      <p style="font-size:13px;color:#6b7280;line-height:1.6">${item.description}</p>
    </div>`
  ).join("");

  const bonusCards = sl.bonusStack.map((b) =>
    `<div style="display:flex;align-items:flex-start;gap:16px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:20px">
      <div style="flex:1">
        <p style="font-weight:800;font-size:15px;color:#fff;margin-bottom:4px">🎁 ${b.name}</p>
        <p style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6">${b.description}</p>
      </div>
      <span style="white-space:nowrap;background:${p};color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;margin-top:2px">${b.valueLabel}</span>
    </div>`
  ).join("");

  const objectionQAs = sl.objectionHandling.map((o) =>
    `<details style="border:1px solid #e5e7eb;border-radius:14px;padding:20px;background:#fff;margin-bottom:10px">
      <summary style="font-weight:700;font-size:15px;color:#111;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between">
        ${o.objection}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <p style="font-size:14px;color:#4b5563;line-height:1.7;margin-top:12px">${o.response}</p>
    </details>`
  ).join("");

  const body = `
<!-- NAV -->
<nav style="background:${dk};padding:16px 32px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:99;border-bottom:1px solid rgba(255,255,255,0.06)">
  <span style="color:#fff;font-weight:800;font-size:14px">${concept}</span>
  <a href="#cta" style="background:${p};color:#fff;padding:10px 22px;border-radius:${br};font-weight:700;font-size:13px;text-decoration:none">Get Started →</a>
</nav>

<!-- HERO -->
<section style="background:${dk};padding:100px 32px 80px;text-align:center">
  <p style="display:inline-block;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);padding:6px 20px;border-radius:999px;color:${p};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px">Sales Letter</p>
  <h1 style="font-size:clamp(28px,4.5vw,58px);font-weight:900;color:#fff;line-height:1.08;margin:0 auto 24px;max-width:800px">${sl.headline}</h1>
  <p style="font-size:clamp(16px,2vw,22px);color:rgba(255,255,255,0.7);max-width:620px;margin:0 auto;line-height:1.6">${sl.subheadline}</p>
</section>

<!-- OPENING HOOK -->
<section style="background:#fff;padding:80px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:clamp(15px,1.5vw,18px);color:#374151;line-height:1.85;white-space:pre-line">${sl.openingHook}</p>
  </div>
</section>

<!-- PROBLEM AGITATION -->
<section style="background:#f8fafc;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:80px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:16px">The Problem</p>
    <p style="font-size:clamp(15px,1.5vw,18px);color:#374151;line-height:1.85;white-space:pre-line">${sl.problemAgitation}</p>
  </div>
</section>

<!-- BRIDGE TO POSSIBILITY -->
<section style="background:${md};padding:80px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:16px">There's a Better Way</p>
    <p style="font-size:clamp(16px,1.6vw,20px);color:rgba(255,255,255,0.85);line-height:1.85;font-weight:500;white-space:pre-line">${sl.bridgeToPossibility}</p>
  </div>
</section>

<!-- COACH CREDENTIALS -->
<section style="background:#fff;padding:80px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:16px">Why Trust Me</p>
    <p style="font-size:clamp(15px,1.5vw,18px);color:#374151;line-height:1.85;white-space:pre-line">${sl.coachCredentials}</p>
  </div>
</section>

<!-- OFFER REVEAL -->
<section style="background:${dk};padding:80px 32px;text-align:center">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:16px">Introducing</p>
    <p style="font-size:clamp(16px,1.8vw,22px);color:#fff;line-height:1.75;white-space:pre-line">${sl.offerReveal}</p>
  </div>
</section>

<!-- WHAT YOU GET -->
<section style="background:#f8fafc;padding:80px 32px">
  <div style="max-width:900px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};text-align:center;margin-bottom:8px">Everything Included</p>
    <h2 style="font-size:clamp(24px,3vw,38px);font-weight:900;text-align:center;color:#111;margin-bottom:40px">Here's what you get</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
      ${whatYouGetCards}
    </div>
  </div>
</section>

<!-- SOCIAL PROOF -->
<section style="background:${md};padding:80px 32px">
  <div style="max-width:720px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:16px">What Clients Say</p>
    <p style="font-size:clamp(15px,1.5vw,18px);color:rgba(255,255,255,0.85);line-height:1.85;white-space:pre-line">${sl.socialProofFramework}</p>
  </div>
</section>

<!-- BONUS STACK -->
<section style="background:${dk};padding:80px 32px">
  <div style="max-width:760px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};text-align:center;margin-bottom:8px">Free Bonuses</p>
    <h2 style="font-size:clamp(22px,2.5vw,32px);font-weight:900;text-align:center;color:#fff;margin-bottom:32px">Included at no extra cost</h2>
    <div style="display:flex;flex-direction:column;gap:14px">${bonusCards}</div>
  </div>
</section>

<!-- PRICE REVEAL -->
<section style="background:#fff;padding:80px 32px;text-align:center">
  <div style="max-width:640px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};margin-bottom:8px">Investment</p>
    <p style="font-size:clamp(16px,1.8vw,20px);color:#374151;line-height:1.8;white-space:pre-line">${sl.priceReveal}</p>
  </div>
</section>

<!-- GUARANTEE -->
<section style="background:#f0fdf4;border-top:1px solid #bbf7d0;border-bottom:1px solid #bbf7d0;padding:56px 32px">
  <div style="max-width:640px;margin:0 auto;display:flex;gap:24px;align-items:flex-start">
    <div style="width:56px;height:56px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div>
      <p style="font-weight:800;font-size:18px;color:#14532d;margin-bottom:8px">My Personal Guarantee</p>
      <p style="font-size:14px;color:#166534;line-height:1.75;white-space:pre-line">${sl.guarantee}</p>
    </div>
  </div>
</section>

<!-- OBJECTION HANDLING -->
<section style="background:#f8fafc;padding:80px 32px">
  <div style="max-width:700px;margin:0 auto">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${p};text-align:center;margin-bottom:8px">Your Questions Answered</p>
    <h2 style="font-size:clamp(22px,2.5vw,32px);font-weight:900;text-align:center;color:#111;margin-bottom:32px">Before you decide</h2>
    ${objectionQAs}
  </div>
</section>

<!-- URGENCY -->
<section style="background:${md};padding:56px 32px;text-align:center">
  <div style="max-width:640px;margin:0 auto">
    <p style="font-size:clamp(15px,1.5vw,18px);color:rgba(255,255,255,0.85);line-height:1.8;white-space:pre-line">${sl.urgencySection}</p>
  </div>
</section>

<!-- FINAL CTA -->
<section id="cta" style="background:${p};padding:100px 32px;text-align:center">
  <div style="max-width:640px;margin:0 auto">
    <p style="font-size:clamp(16px,2vw,22px);color:#fff;line-height:1.75;margin-bottom:40px;font-weight:500;white-space:pre-line">${sl.finalCta}</p>
    <a href="#signup" style="display:inline-flex;align-items:center;gap:10px;background:#fff;color:${p};padding:20px 48px;border-radius:${br};font-weight:900;font-size:18px;text-decoration:none;box-shadow:0 12px 40px rgba(0,0,0,0.2)">
      Yes — I'm Ready to Start →
    </a>
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:18px">No risk · ${sl.guarantee.split(".")[0]}.</p>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:${dk};padding:28px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.05)">
  <p style="color:#475569;font-size:12px">© ${new Date().getFullYear()} ${concept}. All rights reserved.</p>
  <p style="color:#334155;font-size:11px;margin-top:4px">Privacy Policy · Terms of Service</p>
</footer>`;

  return base(sl.headline ?? concept, body);
}

export interface FunnelPageHtml {
  landing: string;
  optin: string;
  thankYou: string;
  booking: string;
}

export function generateAllPageHtml(data: GeneratedFunnelAssets): FunnelPageHtml {
  return {
    landing: generateLandingPageHtml(data),
    optin: generateOptInPageHtml(data),
    thankYou: generateThankYouPageHtml(data),
    booking: generateBookingPageHtml(data),
  };
}
