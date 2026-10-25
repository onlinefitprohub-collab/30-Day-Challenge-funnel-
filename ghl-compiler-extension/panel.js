// ===== COMPILER =====
function uid(p) {
  const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += c[Math.floor(Math.random() * c.length)];
  return `${p}-${s}`;
}
function wv(value, unit) { return unit ? { value, unit } : { value }; }

function parseCss(str) {
  const o = {};
  if (!str) return o;
  str.split(';').forEach(r => {
    const i = r.indexOf(':');
    if (i < 0) return;
    const k = r.slice(0, i).trim(), v = r.slice(i + 1).trim();
    if (k && v) o[k] = v;
  });
  return o;
}
function parsePx(v) { if (!v) return null; const n = parseFloat(v); return isNaN(n) ? null : n; }

function detectType(el) {
  const t = el.getAttribute('data-ghl-type');
  if (t) return t;
  const tag = el.tagName.toLowerCase();
  const cls = el.className || '';
  if (tag === 'h1' || tag === 'h2') return 'heading';
  if (/^h[3-6]$/.test(tag)) return 'sub-heading';
  if (tag === 'p') return 'paragraph';
  if (tag === 'button') return 'button';
  if (tag === 'a' && (cls.includes('btn') || cls.includes('button') || el.getAttribute('data-ghl-action'))) return 'button';
  if (tag === 'img') return 'image';
  if (tag === 'ul' || tag === 'ol') return 'bullet-list';
  if (tag === 'hr') return 'divider';
  if (tag === 'video') return 'video';
  if (tag === 'iframe') { const s = el.getAttribute('src') || ''; if (s.includes('youtube') || s.includes('vimeo')) return 'video'; }
  if (tag === 'form') return 'form';
  if (tag === 'progress' || cls.includes('progress-bar')) return 'progress-bar';
  if ((tag === 'div' || tag === 'span') && el.children.length === 0 && el.textContent.trim()) return 'paragraph';
  return null;
}

function isLayout(el) {
  const t = el.getAttribute('data-ghl-type');
  if (t === 'section' || t === 'row' || t === 'col') return t;
  const tag = el.tagName.toLowerCase();
  const cls = el.className || '';
  if (tag === 'section' || cls.includes('section')) return 'section';
  if (cls.match(/\brow\b/)) return 'row';
  if (cls.match(/\bcol(umn)?\b/) || cls.match(/\bcol-\d/)) return 'col';
  return null;
}

function compileLeaf(el, pool) {
  const type = detectType(el);
  if (!type) return null;
  const id = uid('el');
  const css = parseCss(el.getAttribute('style'));
  const g = k => el.getAttribute(`data-ghl-${k}`);
  const node = { id, type: 'element', tagName: `c-${type}`, meta: type, child: [], styles: {}, extra: {}, class: {}, mobileStyles: {}, mobileWrapper: {}, customCss: [] };
  node.extra.visibility = { value: { hideDesktop: false, hideMobile: false } };
  node.extra.nodeId = { value: 'c' + id };

  function common() {
    const color = g('color') || css['color']; if (color) node.styles.color = wv(color);
    const bg = g('bg') || css['background-color'] || css['background'];
    if (bg && !bg.includes('gradient') && !bg.includes('url')) node.styles.backgroundColor = wv(bg);
    const fw = g('font-weight') || css['font-weight']; if (fw) node.styles.fontWeight = wv(fw);
    const ta = g('align') || css['text-align']; if (ta) { node.styles.textAlign = wv(ta); node.class.textAlign = wv(ta); }
    const lh = css['line-height']; if (lh) node.styles.lineHeight = wv(lh);
    const fs = g('font-size') ? +g('font-size') : parsePx(css['font-size']); if (fs) node.extra.desktopFontSize = wv(fs, 'px');
    const mfs = g('mobile-font-size') ? +g('mobile-font-size') : null; if (mfs) node.extra.mobileFontSize = wv(mfs, 'px');
  }

  switch (type) {
    case 'heading': case 'sub-heading':
      node.meta = type === 'heading' ? 'headline' : 'subHeadline';
      node.extra.text = { value: el.innerHTML.trim() };
      node.extra.tag = { value: g('tag') || el.tagName.toLowerCase() };
      common(); break;
    case 'paragraph':
      node.meta = 'paragraph'; node.extra.text = { value: el.innerHTML.trim() }; common(); break;
    case 'button': {
      node.meta = 'button'; node.extra.text = { value: el.textContent.trim() };
      node.extra.action = { value: g('action') || (el.getAttribute('href') ? 'url' : 'next-step') };
      const href = g('url') || el.getAttribute('href'); if (href && href !== '#') node.extra.url = { value: href };
      const bg = g('bg') || css['background-color'] || css['background'];
      if (bg && !bg.includes('gradient')) { node.styles.backgroundColor = wv(bg); node.class.buttonBgStyle = { value: 'custom' }; }
      const color = g('color') || css['color']; if (color) node.styles.color = wv(color);
      const br = g('border-radius') || css['border-radius']; if (br) { node.styles.borderRadius = wv(br); node.class.borderRadius = { value: 'radius5' }; }
      const fw = g('font-weight') || css['font-weight']; if (fw) node.styles.fontWeight = { value: '', desktop: fw };
      const fs = g('font-size') ? +g('font-size') : parsePx(css['font-size']); if (fs) node.extra.desktopFontSize = wv(fs, 'px');
      node.class.borders = { value: 'borderFull' }; node.mobileStyles.width = wv(100, '%'); break;
    }
    case 'image':
      node.meta = 'image'; node.extra.src = { value: g('src') || el.getAttribute('src') || '' };
      node.extra.alt = { value: g('alt') || el.getAttribute('alt') || '' };
      { const lnk = g('link-url'); if (lnk) node.extra.linkUrl = { value: lnk };
        const iw = parsePx(css['width']); if (iw) node.styles.width = wv(iw, 'px');
        const ibr = css['border-radius']; if (ibr) node.styles.borderRadius = wv(ibr); } break;
    case 'video':
      node.meta = 'video'; node.extra.src = { value: g('src') || el.getAttribute('src') || '' };
      node.extra.autoplay = { value: g('autoplay') === 'true' || el.hasAttribute('autoplay') };
      node.extra.muted = { value: g('muted') !== 'false' }; node.extra.loop = { value: g('loop') === 'true' }; break;
    case 'divider':
      node.meta = 'divider';
      { const dbc = g('color') || css['border-color'] || css['background-color']; if (dbc) node.styles.borderColor = wv(dbc);
        const mt = css['margin-top']; if (mt) node.styles.marginTop = wv(mt);
        const mb = css['margin-bottom']; if (mb) node.styles.marginBottom = wv(mb); } break;
    case 'bullet-list': {
      node.meta = 'bulletList';
      const lis = Array.from(el.querySelectorAll('li'));
      const items = lis.length ? lis.map(li => ({ text: li.textContent.trim(), icon: li.getAttribute('data-ghl-icon') || 'check' })) : [{ text: el.textContent.trim(), icon: 'check' }];
      node.extra.items = { value: items }; common();
      const ic = g('icon-color'); if (ic) node.styles.iconColor = wv(ic); break;
    }
    case 'progress-bar':
      node.meta = 'progressBar';
      node.extra.label = { value: g('label') || el.getAttribute('aria-label') || el.textContent.trim() || '' };
      node.extra.percentage = { value: +(g('percent') || el.getAttribute('value') || 50) };
      { const pbg = g('bg') || css['background-color']; if (pbg) node.styles.backgroundColor = wv(pbg);
        const fc = g('fill-color'); if (fc) node.styles.fillColor = wv(fc);
        const pbr = g('border-radius') || css['border-radius']; if (pbr) node.styles.borderRadius = wv(pbr); } break;
    case 'form':
      node.meta = 'form';
      node.extra.formId = { value: g('form-id') || '' };
      node.extra.redirectUrl = { value: g('redirect-url') || el.getAttribute('action') || '' };
      node.extra.buttonText = { value: g('button-text') || 'Submit' }; break;
    default: return null;
  }
  pool.push(node);
  return id;
}

function compileCol(el, pool) {
  const id = uid('col'); const childIds = []; const css = parseCss(el.getAttribute('style')); const g = k => el.getAttribute(`data-ghl-${k}`);
  for (const c of el.children) { const lid = compileLeaf(c, pool); if (lid) childIds.push(lid); }
  const node = { id, type: 'col', tagName: 'c-column', child: childIds, styles: {}, extra: {}, class: {}, mobileStyles: {}, mobileWrapper: {}, customCss: [] };
  const w = g('width'); if (w) node.styles.width = wv(+w, '%');
  const bg = g('bg') || css['background-color']; if (bg) node.styles.backgroundColor = wv(bg);
  pool.push(node); return id;
}

function compileRow(el, pool) {
  const id = uid('row'); const childIds = []; const css = parseCss(el.getAttribute('style')); const g = k => el.getAttribute(`data-ghl-${k}`);
  const cols = Array.from(el.children).filter(c => isLayout(c) === 'col' || c.getAttribute('data-ghl-type') === 'col');
  if (cols.length > 0) { cols.forEach(c => childIds.push(compileCol(c, pool))); }
  else {
    const fc = document.createElement('div'); fc.setAttribute('data-ghl-type', 'col'); fc.setAttribute('data-ghl-width', '100');
    Array.from(el.children).forEach(c => fc.appendChild(c.cloneNode(true))); childIds.push(compileCol(fc, pool));
  }
  const node = { id, type: 'row', tagName: 'c-row', child: childIds, styles: {}, extra: {}, class: {}, mobileStyles: {}, mobileWrapper: {}, customCss: [] };
  const mw = g('max-width') || parsePx(css['max-width']); if (mw) node.styles.maxWidth = wv(+mw, 'px');
  pool.push(node); return id;
}

function compileSection(el) {
  const sId = uid('section'); const pool = []; const childIds = []; const css = parseCss(el.getAttribute('style')); const g = k => el.getAttribute(`data-ghl-${k}`);
  const rows = Array.from(el.children).filter(c => isLayout(c) === 'row' || c.getAttribute('data-ghl-type') === 'row');
  if (rows.length > 0) { rows.forEach(c => childIds.push(compileRow(c, pool))); }
  else {
    const fr = document.createElement('div'); fr.setAttribute('data-ghl-type', 'row');
    Array.from(el.children).forEach(c => fr.appendChild(c.cloneNode(true))); childIds.push(compileRow(fr, pool));
  }
  const section = { id: sId, type: 'section', tagName: 'c-section', child: childIds, styles: {}, extra: {}, class: {}, elements: pool };
  const bg = g('bg') || css['background-color'] || css['background']; if (bg && !bg.includes('gradient')) section.styles.backgroundColor = wv(bg);
  const pad = g('padding') || css['padding']; if (pad) section.styles.padding = wv(pad);
  return section;
}

let autoWrapped = false;
function compile(html) {
  autoWrapped = false;
  const tmp = document.createElement('div'); tmp.innerHTML = html;
  const sections = [];
  function walk(node) {
    for (const c of node.children) {
      const lt = isLayout(c), gt = c.getAttribute('data-ghl-type');
      if (lt === 'section' || gt === 'section' || c.tagName.toLowerCase() === 'section') sections.push(compileSection(c));
      else walk(c);
    }
  }
  walk(tmp);
  if (!sections.length && tmp.children.length) {
    autoWrapped = true;
    const fs = document.createElement('div'); fs.setAttribute('data-ghl-type', 'section');
    Array.from(tmp.children).forEach(c => fs.appendChild(c.cloneNode(true))); sections.push(compileSection(fs));
  }
  return { sections, settings: {}, general: {}, pageStyles: {}, trackingCode: '', fontsForPreview: [], popups: [], popupsList: [] };
}

// ===== STATE =====
let lastResult = null;

function doCompile() {
  const html = document.getElementById('editor').value.trim();
  document.getElementById('errMsg').textContent = '';
  lastResult = null;
  setButtons(false);
  if (!html) { setOutput('empty', 'Compiled GHL JSON appears here'); resetStats(); return; }
  try {
    const r = compile(html);
    const elCount = r.sections.reduce((a, s) => a + s.elements.filter(e => e.type === 'element').length, 0);
    if (!r.sections.length || !elCount) throw new Error('No recognisable elements found.');
    lastResult = r;
    setOutput('code', JSON.stringify(r, null, 2));
    const rowCount = r.sections.reduce((a, s) => a + s.elements.filter(e => e.type === 'row').length, 0);
    document.getElementById('sSections').textContent = r.sections.length;
    document.getElementById('sElements').textContent = elCount;
    document.getElementById('sRows').textContent = rowCount;
    const badge = document.getElementById('outputBadge');
    badge.textContent = r.sections.length + 's · ' + elCount + 'el';
    badge.className = 'pane-badge ok';
    document.getElementById('autowrapNote').style.display = autoWrapped ? 'inline' : 'none';
    setButtons(true);
  } catch(e) {
    document.getElementById('errMsg').textContent = '⚠ ' + e.message;
    setOutput('empty', 'Fix errors above, then compile again.');
    resetStats();
  }
}

function setOutput(mode, text) {
  const el = document.getElementById('output');
  if (mode === 'empty') { el.className = 'output empty'; el.textContent = text; }
  else { el.className = 'output'; el.textContent = text; }
}
function resetStats() {
  ['sSections','sElements','sRows'].forEach(id => document.getElementById(id).textContent = '0');
  document.getElementById('outputBadge').textContent = '—';
  document.getElementById('outputBadge').className = 'pane-badge';
  document.getElementById('autowrapNote').style.display = 'none';
}
function setButtons(on) {
  document.getElementById('injectBtn').disabled = !on;
  document.getElementById('copyBtn').disabled = !on;
}

// ===== INJECT =====
async function doInject() {
  if (!lastResult) return;
  const btn = document.getElementById('injectBtn');
  btn.textContent = '⏳ Injecting…';
  try {
    const resp = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'GHL_INJECT', payload: lastResult }, (r) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(r);
      });
    });
    if (resp && resp.ok) {
      btn.textContent = '✓ Injected! Now press Ctrl+V in the GHL builder';
      btn.className = 'inject-btn success';
      setTimeout(() => { btn.textContent = '⚡ Inject into GHL Builder → then press Ctrl+V'; btn.className = 'inject-btn'; }, 4000);
    } else {
      throw new Error(resp ? resp.error : 'Injection failed');
    }
  } catch (e) {
    btn.textContent = '✗ ' + e.message;
    btn.className = 'inject-btn error';
    setTimeout(() => { btn.textContent = '⚡ Inject into GHL Builder → then press Ctrl+V'; btn.className = 'inject-btn'; }, 5000);
  }
}

function copyJson() {
  if (!lastResult) return;
  const btn = document.getElementById('copyBtn');
  navigator.clipboard.writeText(JSON.stringify(lastResult, null, 2)).then(() => {
    btn.textContent = '✓ Copied!'; btn.className = 'copy-json-btn success';
    setTimeout(() => { btn.textContent = 'Copy JSON'; btn.className = 'copy-json-btn'; }, 2000);
  });
}

function onInput() {
  const v = document.getElementById('editor').value;
  document.getElementById('inputBadge').textContent = v.trim() ? v.split('\n').length + ' lines' : '—';
}

// ===== TEMPLATES =====
const TEMPLATES = {
  plain: `<h1 style="color:#ffffff; font-size:52px; font-weight:700; text-align:center;">Start Your 30-Day Transformation</h1>
<p style="color:#aaaaaa; font-size:18px; text-align:center;">Join 12,000+ people who've already changed their lives.</p>
<button style="background:#e91e8c; color:#fff; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Claim My Free Spot →</button>`,

  hero: `<section style="background:#0a0a0a; padding:80px 0;">
  <h1 style="color:#fff; font-size:54px; font-weight:700; text-align:center;">The 30-Day Challenge That Changes Everything</h1>
  <p style="color:#bbb; font-size:18px; text-align:center;">Lose weight, build muscle, and transform your mindset in 30 days.</p>
  <button style="background:#e91e8c; color:#fff; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Start For Free Today</button>
</section>`,

  cta: `<section style="background:#e91e8c; padding:60px 0;">
  <h2 style="color:#fff; font-size:40px; font-weight:700; text-align:center;">Ready to Transform Your Life?</h2>
  <p style="color:rgba(255,255,255,0.85); font-size:16px; text-align:center;">Limited spots available. Join now before we close.</p>
  <button style="background:#fff; color:#e91e8c; font-size:16px; font-weight:700; border-radius:8px;" data-ghl-action="next-step">Yes, I'm In — Sign Me Up</button>
</section>`,

  bullets: `<section style="background:#ffffff; padding:60px 0;">
  <h2 style="color:#111; font-size:36px; font-weight:700; text-align:center;">What You'll Get</h2>
  <ul style="color:#333; font-size:16px;" data-ghl-icon-color="#e91e8c">
    <li>Daily video coaching from top fitness experts</li>
    <li>Personalised meal plan tailored to your goals</li>
    <li>Private community of 3,000+ members</li>
    <li>Weekly live Q&A calls with the coaching team</li>
    <li>30-day money-back guarantee</li>
  </ul>
  <div data-ghl-type="progress-bar" data-ghl-label="Spots Remaining" data-ghl-percent="23" data-ghl-bg="#eee" data-ghl-fill-color="#e91e8c"></div>
</section>`,

  video: `<section style="background:#111; padding:60px 0;">
  <h2 style="color:#fff; font-size:36px; text-align:center;">Watch the Overview</h2>
  <iframe data-ghl-type="video" data-ghl-src="https://www.youtube.com/watch?v=EXAMPLE" data-ghl-autoplay="false" data-ghl-muted="true"></iframe>
  <button style="background:#e91e8c; color:#fff; font-size:16px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Get Instant Access Now</button>
</section>`,

  full: `<section style="background:#0a0a0a; padding:80px 0;">
  <h1 style="color:#fff; font-size:54px; font-weight:700; text-align:center;">The 30-Day Challenge</h1>
  <p style="color:#bbb; font-size:18px; text-align:center;">Transform your life in 30 days.</p>
  <button style="background:#e91e8c; color:#fff; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Start For Free</button>
</section>
<section style="background:#fff; padding:60px 0;">
  <h2 style="color:#111; font-size:36px; font-weight:700; text-align:center;">What You'll Get</h2>
  <ul style="color:#333; font-size:16px;" data-ghl-icon-color="#e91e8c">
    <li>Daily video coaching</li><li>Personalised nutrition blueprint</li>
    <li>Private community of 12,000+ members</li><li>30-day money-back guarantee</li>
  </ul>
  <hr style="border-color:#eee;" />
  <div data-ghl-type="progress-bar" data-ghl-label="47 spots remaining" data-ghl-percent="76" data-ghl-bg="#f0f0f0" data-ghl-fill-color="#e91e8c"></div>
</section>
<section style="background:#e91e8c; padding:60px 0;">
  <h2 style="color:#fff; font-size:40px; font-weight:700; text-align:center;">Join 12,000+ People</h2>
  <button style="background:#fff; color:#e91e8c; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Claim My Spot →</button>
</section>`
};

function loadTemplate(name) {
  if (!TEMPLATES[name]) return;
  document.getElementById('editor').value = TEMPLATES[name];
  onInput();
  doCompile();
}

// ===== EVENT LISTENERS =====
document.getElementById('compileBtn').addEventListener('click', doCompile);
document.getElementById('injectBtn').addEventListener('click', doInject);
document.getElementById('copyBtn').addEventListener('click', copyJson);
document.getElementById('editor').addEventListener('input', onInput);
document.getElementById('editor').addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doCompile(); }
});
document.getElementById('tplSelect').addEventListener('change', function() {
  if (this.value) { loadTemplate(this.value); this.value = ''; }
});
