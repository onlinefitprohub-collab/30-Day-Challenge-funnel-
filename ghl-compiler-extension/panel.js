// ===== SHARED CONSTANTS (ported from src/lib/ghl/builder.ts) =====
const VISIBILITY = { value: { hideDesktop: false, hideMobile: false } };
const BG_IMAGE = { value: { mediaType:"image", url:"", opacity:"1", options:"bgCover", svgCode:"", videoUrl:"", videoThumbnail:"", videoLoop:true } };
const BORDER_CLASS = { borders:{ value:"noBorder" }, borderRadius:{ value:"radius0" }, radiusEdge:{ value:"none" } };
const ANIMATION_CLASS = { entranceAnimation:{ value:null }, animationScale:{ value:1 }, animationDuration:{ value:1 }, animationDelay:{ value:0 }, animationEasing:{ value:"linear" } };
const ICON_EMPTY = { value:{ name:"", unicode:"", fontFamily:"" } };
const ELEM_WRAPPER = { marginTop:{unit:"px",value:0}, marginBottom:{unit:"px",value:0}, marginLeft:{unit:"px",value:0}, marginRight:{unit:"px",value:0}, width:{value:"auto",unit:""}, height:{value:"auto",unit:""} };
const ZERO_MARGIN  = { marginTop:{unit:"px",value:0}, marginBottom:{unit:"px",value:0}, marginLeft:{unit:"px",value:0}, marginRight:{unit:"px",value:0} };

function ghlId(p) { return `${p}-${Math.random().toString(36).slice(2,10)}`; }

function buildEnvelope() {
  const pageStyles = `:root{\n --primary:#e91e8c;\n --secondary:#c2185b;\n --dark:#0a0a0a;\n --mid:#1a1a2e;\n --white:#ffffff;\n --black:#000000;\n --gray:#cbd5e0;\n --transparent:transparent;\n --text-color:#ffffff;\n --link-color:#e91e8c;\n --headlinefont:'Bebas Neue',sans-serif;\n --contentfont:'Poppins',sans-serif;\n}\nbody{background-color:#0a0a0a;color:#ffffff;}`;
  return {
    fontsForPreview: ["'Roboto'","'Montserrat'","'Bebas Neue'","'Poppins'"],
    general: { general: {
      colors: [
        { label:"Primary", value:"#e91e8c" }, { label:"Secondary", value:"#c2185b" },
        { label:"Dark", value:"#0a0a0a" }, { label:"Mid", value:"#1a1a2e" },
        { label:"White", value:"#ffffff" }, { label:"Gray", value:"#cbd5e0" },
        { label:"Black", value:"#000000" }, { label:"Transparent", value:"transparent" },
      ],
      customFonts: [],
      fontsToLoad: ["Arial","Lato","Roboto","Open Sans","Oxygen","Oswald","Montserrat","Manrope","Poppins","Bebas Neue"],
      fontsToLoadForPreview: ["Roboto","Montserrat","Bebas Neue","Poppins"],
      pageStyles: "body { font-family: var(--contentfont, 'Poppins', sans-serif); background-color: var(--dark, #0a0a0a); color: #ffffff; }",
    }},
    id: Math.random().toString(36).slice(2,14),
    pageStyles, popups:[], popupsList:[], settings:{}, trackingCode:"",
  };
}

// ===== ELEMENT MAKERS =====
function makeHeading(nodes, text, tag, gs) {
  const id = ghlId('el');
  const defD = tag==='h1'?48:tag==='h2'?36:24;
  const defM = tag==='h1'?36:tag==='h2'?26:20;
  nodes[id] = {
    extra:{ nodeId:`c${id}`, visibility:VISIBILITY, text:{value:`<${tag}>${text}</${tag}>`},
      mobileFontSize:{value:defM,unit:"px"}, desktopFontSize:{value:defD,unit:"px"},
      typography:{value:"var(--headlinefont)"}, inlineTypographies:{value:[]},
      icon:ICON_EMPTY, customClass:{value:[]}, elementVersion:{value:2} },
    class:{ ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:{
      backgroundColor:{value:"var(--transparent)"}, color:{value:"var(--text-color)"},
      inlineColors:{value:[]}, boldTextColor:{value:"var(--text-color)"},
      italicTextColor:{value:"var(--text-color)"}, underlineTextColor:{value:"var(--text-color)"},
      linkTextColor:{value:"var(--link-color)"}, iconColor:{value:"var(--text-color)"},
      fontFamily:{value:""}, fontWeight:{desktop:"700",value:"normal"}, boxShadow:{value:"none"},
      paddingLeft:{value:0,unit:"px"}, paddingRight:{value:0,unit:"px"},
      paddingTop:{value:0,unit:"px"}, paddingBottom:{value:0,unit:"px"},
      opacity:{value:"1"}, textShadow:{value:"none"},
      borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      lineHeight:{value:1.3,unit:"em"}, textTransform:{value:"none"},
      letterSpacing:{value:"0",unit:"px"}, textAlign:{value:"left"},
      ...gs,
    },
    wrapper:{...ELEM_WRAPPER}, customCss:[], id,
    mobileStyles:{}, mobileWrapper:{}, type:"element", child:[], meta:"heading", tagName:"c-heading", title:"Headline", tag,
  };
  return id;
}

function makeParagraph(nodes, text, gs) {
  const id = ghlId('el');
  nodes[id] = {
    extra:{ nodeId:`c${id}`, visibility:VISIBILITY, text:{value:`<p>${text}</p>`},
      mobileFontSize:{value:16,unit:"px"}, desktopFontSize:{value:16,unit:"px"},
      typography:{value:"var(--contentfont)"}, inlineTypographies:{value:[]},
      icon:ICON_EMPTY, customClass:{value:[]}, elementVersion:{value:2} },
    class:{ ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:{
      backgroundColor:{value:"var(--transparent)"}, color:{value:"var(--text-color)"},
      inlineColors:{value:[]}, boldTextColor:{value:"var(--text-color)"},
      italicTextColor:{value:"var(--text-color)"}, underlineTextColor:{value:"var(--text-color)"},
      linkTextColor:{value:"var(--link-color)"}, iconColor:{value:"var(--text-color)"},
      fontFamily:{value:""}, fontWeight:{desktop:"400",value:"normal"}, boxShadow:{value:"none"},
      paddingLeft:{value:0,unit:"px"}, paddingRight:{value:0,unit:"px"},
      paddingTop:{value:8,unit:"px"}, paddingBottom:{value:8,unit:"px"},
      opacity:{value:"1"}, textShadow:{value:"none"},
      borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      lineHeight:{value:1.6,unit:"em"}, textTransform:{value:"none"},
      letterSpacing:{value:"0",unit:"px"}, textAlign:{value:"left"},
      ...gs,
    },
    wrapper:{...ELEM_WRAPPER}, customCss:[], id,
    mobileStyles:{}, mobileWrapper:{}, type:"element", child:[], meta:"paragraph", tagName:"c-paragraph", title:"Paragraph", tag:"p",
  };
  return id;
}

function makeButton(nodes, label, action, url, gs) {
  const id = ghlId('el');
  nodes[id] = {
    extra:{ nodeId:`c${id}`, visibility:VISIBILITY,
      text:{value:label}, subText:{value:""},
      action:{value:action||"next-step"}, url:{value:url||""},
      icon:ICON_EMPTY, iconType:{value:"icon"}, iconPosition:{value:"right"},
      customClass:{value:[]}, elementVersion:{value:2} },
    class:{ ...BORDER_CLASS, ...ANIMATION_CLASS, buttonBgStyle:{value:"flat"}, buttonWidth:{value:"auto"}, borders:{value:"borderFull"} },
    styles:{
      backgroundColor:{value:"var(--primary)"}, color:{value:"var(--white)"},
      borderColor:{value:"var(--primary)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      borderRadius:{value:50,unit:"px"}, boxShadow:{value:"none"},
      paddingLeft:{value:24,unit:"px"}, paddingRight:{value:24,unit:"px"},
      paddingTop:{value:14,unit:"px"}, paddingBottom:{value:14,unit:"px"},
      opacity:{value:"1"}, fontWeight:{desktop:"700",value:"normal"},
      letterSpacing:{value:"0",unit:"px"}, textTransform:{value:"none"},
      ...gs,
    },
    wrapper:{...ELEM_WRAPPER}, customCss:[], id,
    mobileStyles:{width:{value:100,unit:"%"}}, mobileWrapper:{},
    type:"element", child:[], meta:"button", tagName:"c-button", title:"Button",
  };
  return id;
}

function makeImage(nodes, src, alt, gs) {
  const id = ghlId('el');
  nodes[id] = {
    extra:{ nodeId:`c${id}`, visibility:VISIBILITY, src:{value:src||""}, alt:{value:alt||""},
      loading:{value:"lazy"}, customClass:{value:[]}, elementVersion:{value:2} },
    class:{ ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:{
      maxWidth:{value:100,unit:"%"}, height:{value:"auto",unit:""},
      borderRadius:{value:0,unit:"px"}, boxShadow:{value:"none"},
      borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      opacity:{value:"1"},
      ...gs,
    },
    wrapper:{...ELEM_WRAPPER}, customCss:[], id,
    mobileStyles:{}, mobileWrapper:{}, type:"element", child:[], meta:"image", tagName:"c-image", title:"Image",
  };
  return id;
}

function makeBulletList(nodes, items, gs) {
  const id = ghlId('el');
  nodes[id] = {
    extra:{ nodeId:`c${id}`, visibility:VISIBILITY,
      items:{value:items.map(t=>({text:t,icon:"check"}))},
      typography:{value:"var(--contentfont)"}, inlineTypographies:{value:[]},
      customClass:{value:[]}, elementVersion:{value:2} },
    class:{ ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:{
      backgroundColor:{value:"var(--transparent)"}, color:{value:"var(--text-color)"},
      iconColor:{value:"var(--primary)"}, fontFamily:{value:""},
      fontWeight:{desktop:"400",value:"normal"}, boxShadow:{value:"none"},
      paddingLeft:{value:0,unit:"px"}, paddingRight:{value:0,unit:"px"},
      paddingTop:{value:8,unit:"px"}, paddingBottom:{value:8,unit:"px"},
      opacity:{value:"1"}, lineHeight:{value:1.6,unit:"em"},
      borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      textAlign:{value:"left"},
      ...gs,
    },
    wrapper:{...ELEM_WRAPPER}, customCss:[], id,
    mobileStyles:{}, mobileWrapper:{}, type:"element", child:[], meta:"bulletList", tagName:"c-bullet-list", title:"Bullet List",
  };
  return id;
}

function makeDivider(nodes, gs) {
  const id = ghlId('el');
  nodes[id] = {
    extra:{ nodeId:`c${id}`, visibility:VISIBILITY, customClass:{value:[]}, elementVersion:{value:2} },
    class:{ ...BORDER_CLASS, ...ANIMATION_CLASS },
    styles:{
      borderColor:{value:"var(--gray)"}, borderWidth:{value:"1",unit:"px"}, borderStyle:{value:"solid"},
      marginTop:{value:16,unit:"px"}, marginBottom:{value:16,unit:"px"}, opacity:{value:"1"},
      ...gs,
    },
    wrapper:{...ELEM_WRAPPER}, customCss:[], id,
    mobileStyles:{}, mobileWrapper:{}, type:"element", child:[], meta:"divider", tagName:"c-divider", title:"Divider",
  };
  return id;
}

function makeCol(nodes, childIds, widthPct, alignStyle) {
  const id = ghlId('col');
  const styles = {
    boxShadow:{value:"none"},
    paddingLeft:{value:16,unit:"px"}, paddingRight:{value:16,unit:"px"},
    paddingTop:{value:0,unit:"px"}, paddingBottom:{value:0,unit:"px"},
    backgroundColor:{value:"var(--transparent)"}, background:{value:"none"},
    backdropFilter:{value:"none"},
    borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
    width:{value:widthPct||100,unit:"%"},
  };
  if (alignStyle) styles.textAlign = { value:alignStyle };
  nodes[id] = {
    id, type:"col", child:childIds, class:{...BORDER_CLASS}, styles,
    extra:{ visibility:VISIBILITY, bgImage:BG_IMAGE, columnLayout:{value:"column"},
      justifyContentColumnLayout:{value:"center"}, alignContentColumnLayout:{value:"inherit"},
      forceColumnLayoutForMobile:{value:true}, customClass:{value:[]}, elementVersion:{value:2} },
    wrapper:{...ZERO_MARGIN},
    tagName:"c-column", meta:"col", mobileStyles:{}, mobileWrapper:{}, title:"1st Column", noOfColumns:1,
  };
  return id;
}

function makeRow(nodes, colIds) {
  const id = ghlId('row');
  nodes[id] = {
    id, type:"row", child:colIds,
    class:{ alignRow:{value:"row-align-center"}, ...BORDER_CLASS },
    styles:{
      boxShadow:{value:"none"},
      paddingLeft:{value:0,unit:"px"}, paddingRight:{value:0,unit:"px"},
      paddingTop:{value:0,unit:"px"}, paddingBottom:{value:0,unit:"px"},
      backgroundColor:{value:"var(--transparent)"}, background:{value:"none"},
      backdropFilter:{value:"none"},
      borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      maxWidth:{value:1200,unit:"px"},
    },
    extra:{ visibility:VISIBILITY, bgImage:BG_IMAGE, rowWidth:{value:100,unit:"%"}, customClass:{value:[]} },
    wrapper:{ marginTop:{unit:"px",value:0}, marginBottom:{unit:"px",value:0}, marginLeft:{unit:"",value:"auto"}, marginRight:{unit:"",value:"auto"} },
    tagName:"c-row", meta:"row", mobileStyles:{}, mobileWrapper:{},
    title: colIds.length===1?"1 Column Row":`${colIds.length} Column Row`,
  };
  return id;
}

function makeSection(rowIds, bgColor) {
  const id = ghlId('section');
  return {
    id,
    metaData:{
      id, type:"section", child:rowIds,
      class:{ width:{value:"fullSection"}, borders:{value:"noBorder"}, borderRadius:{value:"radius0"}, radiusEdge:{value:"none"} },
      styles:{
        boxShadow:{value:"none"},
        paddingLeft:{value:0,unit:"px"}, paddingRight:{value:0,unit:"px"},
        paddingTop:{value:80,unit:"px"}, paddingBottom:{value:80,unit:"px"},
        marginTop:{value:0,unit:"px"}, marginBottom:{value:0,unit:"px"},
        marginLeft:{value:0,unit:"px"}, marginRight:{value:0,unit:"px"},
        backgroundColor: bgColor?{value:bgColor}:{value:"var(--transparent)"},
        background:{value:"none"}, backdropFilter:{value:"none"},
        borderColor:{value:"var(--black)"}, borderWidth:{value:"2",unit:"px"}, borderStyle:{value:"solid"},
      },
      extra:{ sticky:{value:"noneSticky"}, visibility:VISIBILITY, bgImage:BG_IMAGE,
        allowRowMaxWidth:{value:false}, customClass:{value:[]}, elementScreenshot:{value:[]} },
      wrapper:{}, meta:"section", tagName:"c-section", title:"Section",
      mobileStyles:{ paddingTop:{value:48,unit:"px"}, paddingBottom:{value:48,unit:"px"} },
      mobileWrapper:{},
    },
    elements:[],
  };
}

// ===== HTML PARSER =====
function parseCss(str) {
  const o = {};
  if (!str) return o;
  str.split(';').forEach(r=>{
    const i=r.indexOf(':'); if(i<0)return;
    const k=r.slice(0,i).trim(), v=r.slice(i+1).trim();
    if(k&&v) o[k]=v;
  });
  return o;
}

function cssToGhl(cssObj) {
  const s = {};
  if (cssObj['color'])            s.color            = { value:cssObj['color'] };
  if (cssObj['background-color']) s.backgroundColor  = { value:cssObj['background-color'] };
  if (cssObj['font-size'])        s.desktopFontSize  = { value:parseFloat(cssObj['font-size']), unit:'px' };
  if (cssObj['font-weight'])      s.fontWeight       = { desktop:cssObj['font-weight'], value:'normal' };
  if (cssObj['text-align'])       s.textAlign        = { value:cssObj['text-align'] };
  if (cssObj['border-radius'])    s.borderRadius     = { value:cssObj['border-radius'] };
  if (cssObj['line-height'])      s.lineHeight       = { value:parseFloat(cssObj['line-height']), unit:'em' };
  return s;
}

function detectType(el) {
  const t = el.getAttribute('data-ghl-type');
  if (t) return t;
  const tag = el.tagName.toLowerCase();
  const cls = (el.className||'').toLowerCase();
  if (tag==='h1'||tag==='h2') return 'heading';
  if (/^h[3-6]$/.test(tag)) return 'sub-heading';
  if (tag==='p') return 'paragraph';
  if (tag==='button') return 'button';
  if (tag==='a'&&(cls.includes('btn')||cls.includes('button')||el.getAttribute('data-ghl-action'))) return 'button';
  if (tag==='img') return 'image';
  if (tag==='ul'||tag==='ol') return 'bullet-list';
  if (tag==='hr') return 'divider';
  if ((tag==='div'||tag==='span')&&el.children.length===0&&el.textContent.trim()) return 'paragraph';
  return null;
}

function isLayout(el) {
  const t = el.getAttribute('data-ghl-type');
  if (t==='section') return 'section';
  if (t==='row') return 'row';
  if (t==='col') return 'col';
  const tag = el.tagName.toLowerCase();
  const cls = (el.className||'').toLowerCase();
  if (tag==='section') return 'section';
  if (cls.match(/\brow\b/)) return 'row';
  if (cls.match(/\bcol(umn)?\b/)||cls.match(/\bcol-\d/)) return 'col';
  return null;
}

function buildLeaf(nodes, el) {
  const type = detectType(el);
  if (!type) return null;
  const gs = cssToGhl(parseCss(el.getAttribute('style')));
  const g = k=>el.getAttribute(`data-ghl-${k}`);
  if (type==='heading'||type==='sub-heading') return makeHeading(nodes, el.innerHTML.trim(), el.tagName.toLowerCase()||'h2', gs);
  if (type==='paragraph') return makeParagraph(nodes, el.innerHTML.trim(), gs);
  if (type==='button') { const url=g('url')||el.getAttribute('href')||''; return makeButton(nodes, el.textContent.trim(), g('action')||(url?'url':'next-step'), url, gs); }
  if (type==='image') return makeImage(nodes, g('src')||el.getAttribute('src')||'', g('alt')||el.getAttribute('alt')||'', gs);
  if (type==='bullet-list') { const lis=Array.from(el.querySelectorAll('li')); return makeBulletList(nodes, lis.length?lis.map(li=>li.textContent.trim()):[el.textContent.trim()], gs); }
  if (type==='divider') return makeDivider(nodes, gs);
  return null;
}

function buildCol(nodes, el) {
  const childIds = [];
  for (const c of el.children) { const id=buildLeaf(nodes,c); if(id) childIds.push(id); }
  const css = parseCss(el.getAttribute('style'));
  return makeCol(nodes, childIds, parseInt(el.getAttribute('data-ghl-width')||css['width']||'100')||100, el.getAttribute('data-ghl-align')||css['text-align']||null);
}

function buildRow(nodes, el) {
  const cols = Array.from(el.children).filter(c=>isLayout(c)==='col'||c.getAttribute('data-ghl-type')==='col');
  let colIds;
  if (cols.length) { colIds = cols.map(c=>buildCol(nodes,c)); }
  else {
    const fc=document.createElement('div'); fc.setAttribute('data-ghl-type','col');
    Array.from(el.children).forEach(c=>fc.appendChild(c.cloneNode(true)));
    colIds=[buildCol(nodes,fc)];
  }
  return makeRow(nodes, colIds);
}

function buildSection(nodes, el) {
  const css = parseCss(el.getAttribute('style'));
  const bg = el.getAttribute('data-ghl-bg')||css['background-color']||null;
  const rows = Array.from(el.children).filter(c=>isLayout(c)==='row'||c.getAttribute('data-ghl-type')==='row');
  let rowIds;
  if (rows.length) { rowIds=rows.map(r=>buildRow(nodes,r)); }
  else {
    const fr=document.createElement('div'); fr.setAttribute('data-ghl-type','row');
    Array.from(el.children).forEach(c=>fr.appendChild(c.cloneNode(true)));
    rowIds=[buildRow(nodes,fr)];
  }
  return makeSection(rowIds, bg);
}

// ===== COMPILE =====
let autoWrapped = false;

function compile(html) {
  autoWrapped = false;
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const nodes = {};
  const sections = [];

  function walk(node) {
    for (const c of node.children) {
      const lt = isLayout(c);
      if (lt==='section'||c.tagName.toLowerCase()==='section') sections.push(buildSection(nodes,c));
      else walk(c);
    }
  }
  walk(tmp);

  if (!sections.length && tmp.children.length) {
    autoWrapped = true;
    const fs=document.createElement('div'); fs.setAttribute('data-ghl-type','section');
    Array.from(tmp.children).forEach(c=>fs.appendChild(c.cloneNode(true)));
    sections.push(buildSection(nodes,fs));
  }

  // DFS flatten each section's nodes into its elements array
  for (const sec of sections) {
    const flat = [];
    const dfs = ids => { for (const id of ids) { const n=nodes[id]; if(!n)continue; flat.push(n); dfs(n.child||[]); } };
    dfs(sec.metaData.child||[]);
    sec.elements = flat;
  }

  return { ...buildEnvelope(), sections };
}

// ===== STATE =====
let lastResult = null;

function doCompile() {
  const html = document.getElementById('editor').value.trim();
  document.getElementById('errMsg').textContent = '';
  lastResult = null;
  setButtons(false);
  if (!html) { setOutput('empty','Compiled GHL JSON appears here'); resetStats(); return; }
  try {
    const r = compile(html);
    const elCount = r.sections.reduce((a,s)=>a+s.elements.filter(e=>e.type==='element').length,0);
    if (!r.sections.length||!elCount) throw new Error('No recognisable elements found.');
    lastResult = r;
    setOutput('code', JSON.stringify(r,null,2));
    const rowCount = r.sections.reduce((a,s)=>a+s.elements.filter(e=>e.type==='row').length,0);
    document.getElementById('sSections').textContent = r.sections.length;
    document.getElementById('sElements').textContent = elCount;
    document.getElementById('sRows').textContent = rowCount;
    const badge = document.getElementById('outputBadge');
    badge.textContent = r.sections.length+'s · '+elCount+'el';
    badge.className = 'pane-badge ok';
    document.getElementById('autowrapNote').style.display = autoWrapped?'inline':'none';
    setButtons(true);
  } catch(e) {
    document.getElementById('errMsg').textContent = '⚠ '+e.message;
    setOutput('empty','Fix errors above, then compile again.');
    resetStats();
  }
}

function setOutput(mode, text) {
  const el = document.getElementById('output');
  if (mode==='empty') { el.className='output empty'; el.textContent=text; }
  else { el.className='output'; el.textContent=text; }
}
function resetStats() {
  ['sSections','sElements','sRows'].forEach(id=>document.getElementById(id).textContent='0');
  document.getElementById('outputBadge').textContent='—';
  document.getElementById('outputBadge').className='pane-badge';
  document.getElementById('autowrapNote').style.display='none';
}
function setButtons(on) {
  document.getElementById('injectBtn').disabled=!on;
  document.getElementById('copyBtn').disabled=!on;
}

// ===== INJECT =====
async function doInject() {
  if (!lastResult) return;
  const btn = document.getElementById('injectBtn');
  btn.textContent = '⏳ Injecting…';
  btn.disabled = true;
  try {
    const resp = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type:'GHL_INJECT', payload:lastResult }, r => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(r);
      });
    });
    if (resp && resp.ok) {
      if (resp.method === 'api') {
        btn.textContent = '✓ Injected via GHL builder API!';
      } else {
        btn.textContent = '✓ Sent to GHL builder — check your page!';
      }
      btn.className = 'inject-btn success';
      btn.disabled = false;
      setTimeout(()=>{ btn.textContent='⚡ Inject into GHL Builder'; btn.className='inject-btn'; }, 5000);
    } else {
      throw new Error(resp ? resp.error : 'Injection failed');
    }
  } catch(e) {
    btn.textContent = '✗ ' + e.message;
    btn.className = 'inject-btn error';
    btn.disabled = false;
    setTimeout(()=>{ btn.textContent='⚡ Inject into GHL Builder'; btn.className='inject-btn'; }, 5000);
  }
}

function copyJson() {
  if (!lastResult) return;
  const btn = document.getElementById('copyBtn');
  navigator.clipboard.writeText(JSON.stringify(lastResult,null,2)).then(()=>{
    btn.textContent='✓ Copied!'; btn.className='copy-json-btn success';
    setTimeout(()=>{ btn.textContent='Copy JSON'; btn.className='copy-json-btn'; },2000);
  });
}

function onInput() {
  const v = document.getElementById('editor').value;
  document.getElementById('inputBadge').textContent = v.trim()?v.split('\n').length+' lines':'—';
}

// ===== TEMPLATES =====
const TEMPLATES = {
  plain:`<h1 style="color:#ffffff; font-size:52px; font-weight:700; text-align:center;">Start Your 30-Day Transformation</h1>
<p style="color:#aaaaaa; font-size:18px; text-align:center;">Join 12,000+ people who've already changed their lives.</p>
<button style="background:#e91e8c; color:#fff; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Claim My Free Spot →</button>`,

  hero:`<section style="background:#0a0a0a; padding:80px 0;">
  <h1 style="color:#fff; font-size:54px; font-weight:700; text-align:center;">The 30-Day Challenge That Changes Everything</h1>
  <p style="color:#bbb; font-size:18px; text-align:center;">Lose weight, build muscle, and transform your mindset in 30 days.</p>
  <button style="background:#e91e8c; color:#fff; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Start For Free Today</button>
</section>`,

  cta:`<section style="background:#e91e8c; padding:60px 0;">
  <h2 style="color:#fff; font-size:40px; font-weight:700; text-align:center;">Ready to Transform Your Life?</h2>
  <p style="color:rgba(255,255,255,0.85); font-size:16px; text-align:center;">Limited spots available. Join now before we close.</p>
  <button style="background:#fff; color:#e91e8c; font-size:16px; font-weight:700; border-radius:8px;" data-ghl-action="next-step">Yes, I'm In — Sign Me Up</button>
</section>`,

  bullets:`<section style="background:#ffffff; padding:60px 0;">
  <h2 style="color:#111; font-size:36px; font-weight:700; text-align:center;">What You'll Get</h2>
  <ul style="color:#333; font-size:16px;">
    <li>Daily video coaching from top fitness experts</li>
    <li>Personalised meal plan tailored to your goals</li>
    <li>Private community of 3,000+ members</li>
    <li>Weekly live Q&amp;A calls with the coaching team</li>
    <li>30-day money-back guarantee</li>
  </ul>
</section>`,

  full:`<section style="background:#0a0a0a; padding:80px 0;">
  <h1 style="color:#fff; font-size:54px; font-weight:700; text-align:center;">The 30-Day Challenge</h1>
  <p style="color:#bbb; font-size:18px; text-align:center;">Transform your life in 30 days.</p>
  <button style="background:#e91e8c; color:#fff; font-size:18px; font-weight:700; border-radius:50px;" data-ghl-action="next-step">Start For Free</button>
</section>
<section style="background:#fff; padding:60px 0;">
  <h2 style="color:#111; font-size:36px; font-weight:700; text-align:center;">What You'll Get</h2>
  <ul style="color:#333; font-size:16px;">
    <li>Daily video coaching</li><li>Personalised nutrition blueprint</li>
    <li>Private community of 12,000+ members</li><li>30-day money-back guarantee</li>
  </ul>
  <hr style="border-color:#eee;" />
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

// ===== DEBUG =====
async function doDebug() {
  const btn = document.getElementById('debugBtn');
  const out = document.getElementById('debugOutput');
  btn.textContent = '⏳ Scanning…';
  out.style.display = 'block';
  out.textContent = 'Scanning GHL builder tab…';
  try {
    const resp = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type:'GHL_DEBUG' }, r => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(r);
      });
    });
    if (resp && resp.report) {
      const r = resp.report;
      const lines = [
        r.frameUrl ? `Frame: ${r.frameUrl.slice(0,80)} (${r.isIframe ? 'IFRAME' : 'main'})` : '',
        `Framework: Vue2=${r.vue2} Vue3=${r.vue3} React=${r.react}`,
        r._allFrames ? `All frames:\n${r._allFrames.map(f=>`  [${f.isIframe?'iframe':'main '}] Vue2=${f.vue2} Vue3=${f.vue3} React=${f.react} ls=${f.ls_count} ${f.url?.slice(0,60)}`).join('\n')}` : '',
        r.vuex2_actions?.length   ? `Vuex2 actions: ${r.vuex2_actions.join(', ')}`   : '',
        r.vuex2_mutations?.length ? `Vuex2 mutations: ${r.vuex2_mutations.join(', ')}` : '',
        r.vuex2_state?.length     ? `Vuex2 state keys: ${r.vuex2_state.join(', ')}`    : '',
        r.vuex3_actions?.length   ? `Vuex3 actions: ${r.vuex3_actions.join(', ')}`   : '',
        r.pinia_stores            ? `Pinia stores: ${JSON.stringify(r.pinia_stores)}` : '',
        r.window_globals?.length  ? `GHL globals: ${r.window_globals.join(', ')}`    : 'No GHL globals found',
        r.localStorage_keys?.length ? `localStorage keys: ${r.localStorage_keys.join(', ')}` : 'No clipboard localStorage keys',
        r.import_buttons?.length  ? `Import buttons: ${r.import_buttons.join(' | ')}` : 'No import buttons found',
      ].filter(Boolean).join('\n');
      out.textContent = lines || 'Nothing injectable found — send this screenshot to Claude';
    } else {
      out.textContent = JSON.stringify(resp, null, 2);
    }
  } catch(e) {
    out.textContent = 'Error: ' + e.message;
  }
  btn.textContent = '🔍 Debug GHL';
}

// ===== EVENTS =====
document.getElementById('compileBtn').addEventListener('click', doCompile);
document.getElementById('injectBtn').addEventListener('click', doInject);
document.getElementById('copyBtn').addEventListener('click', copyJson);
document.getElementById('debugBtn').addEventListener('click', doDebug);
document.getElementById('editor').addEventListener('input', onInput);
document.getElementById('editor').addEventListener('keydown', e=>{
  if ((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();doCompile();}
});
document.getElementById('tplSelect').addEventListener('change', function(){
  if (this.value){loadTemplate(this.value);this.value='';}
});
