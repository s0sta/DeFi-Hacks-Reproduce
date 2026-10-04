const D = window.INCIDENTS || [];
const CHECKLISTS = window.CHECKLISTS || [];
const PATTERNS10 = window.PATTERNS10 || [];

// ---------- class normalization ----------
const CLASS_MAP = {
  'access-control':'Access Control','access':'Access Control','access control':'Access Control','permission':'Access Control','auth':'Access Control',
  'reentrancy':'Reentrancy','reentrancy (':'Reentrancy','re-entrancy':'Reentrancy',
  'oracle':'Oracle Manipulation','oracle manipulation':'Oracle Manipulation','price manipulation':'Oracle Manipulation','price':'Oracle Manipulation','pricing':'Oracle Manipulation',
  'flashloan':'Flash Loan','flash-loan':'Flash Loan','flash loan':'Flash Loan',
  'governance':'Governance','voting':'Governance',
  'bridge':'Bridge','cross-chain':'Bridge','signature':'Signature Validation',
  'rounding':'Rounding / Precision','precision':'Rounding / Precision','integer-overflow':'Arithmetic','overflow':'Arithmetic','underflow':'Arithmetic','arithmetic':'Arithmetic','math':'Arithmetic',
  'infinite-mint':'Infinite Mint','mint':'Infinite Mint','rug':'Rug / Backdoor','backdoor':'Rug / Backdoor','drain':'Rug / Backdoor',
  'logic':'Business Logic','business logic':'Business Logic','business-logic':'Business Logic','misconfig':'Misconfiguration','token':'Token Logic','token-logic':'Token Logic',
  'dos':'DoS','griefing':'Griefing','slippage':'Slippage','hack':'Exploit','exploit':'Exploit','misc':'Misc','':'Misc'
};
function normClass(raw){
  const c = (raw || '').toLowerCase().trim();
  if (CLASS_MAP[c]) return CLASS_MAP[c];
  for (const k in CLASS_MAP) { if (c.includes(k)) return CLASS_MAP[k]; }
  return 'Misc';
}
D.forEach(i => { i.normClass = normClass(i.class); });

// ---------- i18n ----------
const I18N = {
  en: {},
  ar: {
    nav_database:'قاعدة البيانات', nav_intel:'الاستخبارات', nav_checklist:'قوائم التدقيق', nav_patterns:'أنماط الثغرات',
    nav_analytics:'التحليلات', nav_method:'المنهجية', nav_about:'حول',
    hero_sub:'ثماني سنوات من أحداث الخسارة، مُختزلة إلى مبادئ أولى — السبب الجذري لكل حادثة، وآليتها، والدرس الذي يمنع التالية.',
    st_incidents:'حادثة', st_analyses:'تحليلات معمّقة', st_years:'سنوات التغطية', st_classes:'أصناف الأسباب الجذرية',
    db_title:'قاعدة بيانات الحوادث', all_years:'كل السنوات', all_types:'كل الأنواع', t_incidents:'حوادث', t_analyses:'تحليلات معمّقة',
    intel_title:'استخبارات أصناف الهجمات', intel_sub:'الخسائر والتكرار لكل صنف — أين ذهب المال فعلاً.',
    intel_hint:'مُطبَّع من أصناف الأرشيف؛ تُحتسب الخسائر حيث تذكر الحادثة مبلغاً بالدولار.',
    chk_title:'مولّد قوائم التدقيق المسبق', chk_sub:'اختر فئة البروتوكول — واحصل على الأسباب الجذرية التي قتلت بروتوكولات مشابهة، مع الفحوصات التي تكشفها.',
    pat_title:'الأنماط العشرة الأساسية للثغرات', pat_sub:'الأشكال المتكررة خلف معظم الأرشيف — مع أمر grep الذي يكشف كل واحد.',
    ana_title:'تحليلات الخسائر', ana_sub:'الخسائر المبلَّغة لكل صنف ولكل شبكة، والحوادث لكل سنة.',
    ana_class:'الخسائر حسب الصنف ($M)', ana_chain:'الخسائر حسب الشبكة ($M)', ana_year:'الحوادث لكل سنة',
    meth_title:'المنهجية', meth_sub:'كيف يُنجز هذا البحث — وكيف يدقّق s0sta.',
    about_title:'حول هذا الأرشيف', about_p1:'جُمِع ويُدار بواسطة <strong>s0sta</strong>. توثّق كلُّ قيدٍ حدثَ خسارةٍ حقيقي: خلل العقد المُصاب، وتدفق المهاجم بالأرقام الفعلية، والدرس القابل للنقل للمدققين وصائدي الثغرات.',
    about_p2:'استخدمه لتعلّم أصناف الهجمات، ولمعايرة الخطورة، وكقائمة تدقيق مسبق: اعثر على أقرب حادثة سابقة وطبّق درسها قبل قراءة الكود.',
    search_ph:'ابحث عن بروتوكول، صنف، شبكة…'
  }
};
let LANG = 'en';
function t(key){ return (I18N[LANG] && I18N[LANG][key]) || key; }
function applyLang(){
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = LANG === 'en' ? 'عربي' : 'EN';
  document.querySelector('#database h2').textContent = t('db_title');
  const rc = document.getElementById('result-count');
  if (rc && rc.dataset.count) rc.textContent = rc.dataset.count + ' ' + (LANG === 'ar' ? 'حادثة' : 'incidents');
  renderCharts(); renderIntel();
}
document.getElementById('lang-toggle').addEventListener('click', () => { LANG = LANG === 'en' ? 'ar' : 'en'; applyLang(); });

// ---------- stats ----------
const years = new Set();
D.forEach(i => { const y = (i.date || '').slice(0, 4); if (y) years.add(y); });
document.getElementById('stat-incidents').textContent = D.length;
document.getElementById('stat-analyses').textContent = D.filter(i => i.type === 'analysis').length;
document.getElementById('stat-years').textContent = years.size;
document.getElementById('stat-classes').textContent = new Set(D.map(i => i.normClass)).size;

// ---------- helpers ----------
function esc(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function lossValue(i){
  const m = String(i.loss || '').match(/\$?\s?([\d,.]+)\s?([BMK]?)/i);
  if (!m) return 0;
  let v = parseFloat(m[1].replace(/,/g, ''));
  const u = (m[2] || '').toUpperCase();
  if (u === 'B') v *= 1e9; else if (u === 'M') v *= 1e6; else if (u === 'K') v *= 1e3;
  return v;
}
function badge(i){
  let b = '';
  if (i.normClass) b += `<span class="badge class">${esc(i.normClass)}</span>`;
  if (i.chain) b += `<span class="badge chain">${esc(i.chain.split(',')[0])}</span>`;
  if (i.date) b += `<span class="badge year">${esc(i.date)}</span>`;
  if (i.loss) b += `<span class="badge loss">${esc(i.loss)}</span>`;
  if (i.type === 'analysis') b += `<span class="badge analysis">deep-dive</span>`;
  return b;
}
function card(i){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h3>${esc(i.protocol)}</h3><div class="badges">${badge(i)}</div><p class="excerpt">${esc((i.mechanics||'').slice(0, 200))}…</p>`;
  el.onclick = () => open(i);
  return el;
}
function open(i){
  const m = document.getElementById('modal');
  m.hidden = false;
  document.getElementById('modal-title').textContent = i.protocol;
  document.getElementById('modal-badges').innerHTML = badge(i);
  document.getElementById('modal-body').innerHTML =
    (i.mechanics ? `<h4>Mechanics</h4><p class="mech">${esc(i.mechanics)}</p>` : '') +
    (i.lesson ? `<h4>Lesson</h4><p>${esc(i.lesson)}</p>` : '') +
    (i.aftermath ? `<h4>Aftermath</h4><p>${esc(i.aftermath)}</p>` : '');
  document.body.style.overflow = 'hidden';
}
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('modal').onclick = e => { if (e.target === e.currentTarget) closeModal(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal(){ document.getElementById('modal').hidden = true; document.body.style.overflow = ''; }

// ---------- database ----------
const classCounts = {};
D.forEach(i => { classCounts[i.normClass] = (classCounts[i.normClass] || 0) + 1; });
const topClasses = Object.entries(classCounts).sort((a,b) => b[1]-a[1]).slice(0, 12).map(e => e[0]);
const chipsEl = document.getElementById('class-chips');
topClasses.forEach(c => {
  const el = document.createElement('span');
  el.className = 'chip'; el.textContent = c + ' (' + classCounts[c] + ')';
  el.dataset.cls = c;
  el.onclick = () => { el.classList.toggle('active'); render(); };
  chipsEl.appendChild(el);
});
const yearSel = document.getElementById('year-filter');
[...years].sort().reverse().forEach(y => {
  const o = document.createElement('option'); o.value = y; o.textContent = y; yearSel.appendChild(o);
});
function filtered(){
  const q = document.getElementById('search').value.toLowerCase();
  const y = yearSel.value;
  const t = document.getElementById('type-filter').value;
  const cls = [...document.querySelectorAll('.chip.active')].map(c => c.dataset.cls);
  return D.filter(i => {
    if (q && !(i.protocol + ' ' + i.normClass + ' ' + i.chain + ' ' + i.mechanics).toLowerCase().includes(q)) return false;
    if (y && (i.date || '').slice(0,4) !== y) return false;
    if (t && i.type !== t) return false;
    if (cls.length && !cls.includes(i.normClass)) return false;
    return true;
  });
}
function render(){
  const list = filtered();
  const rc = document.getElementById('result-count');
  rc.dataset.count = list.length;
  rc.textContent = list.length + ' ' + (LANG === 'ar' ? 'حادثة' : 'incidents');
  const grid = document.getElementById('cards');
  grid.innerHTML = '';
  list.slice(0, 300).forEach(i => grid.appendChild(card(i)));
}
document.getElementById('search').oninput = render;
yearSel.onchange = render;
document.getElementById('type-filter').onchange = render;

// ---------- intelligence ----------
function renderIntel(){
  const rows = Object.entries(classCounts).sort((a,b) => b[1]-a[1]);
  const losses = {};
  D.forEach(i => { losses[i.normClass] = (losses[i.normClass] || 0) + lossValue(i); });
  const el = document.getElementById('intel-cards');
  el.innerHTML = '';
  rows.forEach(([c, n]) => {
    const lm = losses[c] || 0;
    el.innerHTML += `<div class="intel-card"><div class="intel-head"><span class="intel-name">${esc(c)}</span><span class="intel-count">${n}</span></div>
      <div class="intel-loss">${lm >= 1e6 ? '$' + (lm/1e6).toFixed(0) + 'M' : lm ? '$' + Math.round(lm/1e3) + 'K' : '—'} <span>reported</span></div>
      <div class="meter"><div class="meter-fill" style="width:${Math.min(100, n / rows[0][1] * 100)}%"></div></div></div>`;
  });
}

// ---------- checklist generator ----------
const catTabs = document.getElementById('cat-tabs');
CHECKLISTS.forEach((c, idx) => {
  const b = document.createElement('button');
  b.className = 'cat-tab' + (idx === 0 ? ' active' : '');
  b.textContent = c.name;
  b.onclick = () => { [...catTabs.children].forEach(x => x.classList.remove('active')); b.classList.add('active'); renderCat(c); };
  catTabs.appendChild(b);
});
function renderCat(cat){
  const el = document.getElementById('cat-content');
  el.innerHTML = cat.patterns.map((p, i) => `
    <div class="pattern-card">
      <div class="pat-num">${String(i+1).padStart(2,'0')}</div>
      <div class="pat-body">
        <h3>${esc(p.t)}</h3>
        <p class="pat-why">${esc(p.e)}</p>
        <div class="pat-ex"><strong>Killed:</strong> ${esc(p.ex.join(' · '))}</div>
        <ul class="pat-checks">${p.ch.map(c => `<li><code>${esc(c)}</code></li>`).join('')}</ul>
      </div>
    </div>`).join('');
}
renderCat(CHECKLISTS[0]);

// ---------- 10 patterns ----------
document.getElementById('pattern-list').innerHTML = PATTERNS10.map((p, i) => `
  <div class="pattern-card">
    <div class="pat-num">${String(i+1).padStart(2,'0')}</div>
    <div class="pat-body">
      <h3>${esc(p.t)}</h3>
      <p class="pat-why">${esc(p.why)}</p>
      <ul class="pat-checks"><li><code>${esc(p.sig)}</code></li><li>✅ ${esc(p.d)}</li></ul>
    </div>
  </div>`).join('');

// ---------- analytics charts ----------
function bars(container, entries, fmt){
  const max = Math.max(...entries.map(e => e.v), 1);
  container.innerHTML = entries.map(e => `
    <div class="bar-row"><span class="bar-label">${esc(e.k)}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${(e.v / max * 100).toFixed(1)}%"></div></div>
    <span class="bar-val">${fmt(e.v)}</span></div>`).join('');
}
function renderCharts(){
  const classLoss = {}; const chainLoss = {}; const yearCount = {};
  D.forEach(i => {
    const lv = lossValue(i);
    classLoss[i.normClass] = (classLoss[i.normClass] || 0) + lv;
    const ch = (i.chain || 'Unknown').split(',')[0].trim();
    chainLoss[ch] = (chainLoss[ch] || 0) + lv;
    const y = (i.date || '').slice(0, 4);
    if (y) yearCount[y] = (yearCount[y] || 0) + 1;
  });
  bars(document.getElementById('chart-class'), Object.entries(classLoss).filter(e => e[1] > 0).sort((a,b) => b[1]-a[1]).slice(0, 10).map(e => ({k: e[0], v: e[1]})), v => (v/1e6).toFixed(0) + 'M');
  bars(document.getElementById('chart-chain'), Object.entries(chainLoss).filter(e => e[1] > 0).sort((a,b) => b[1]-a[1]).slice(0, 10).map(e => ({k: e[0], v: e[1]})), v => (v/1e6).toFixed(0) + 'M');
  bars(document.getElementById('chart-year'), Object.entries(yearCount).sort((a,b) => a[0]-b[0]).map(e => ({k: e[0], v: e[1]})), v => v);
}

// ---------- methodology ----------
const METH = [
  { t: 'The 5-Gate No-False-Positives Rule', b: 'Every finding must pass five gates before it is reported: (1) exploit economics derived by hand, twice, with a named victim and gainer; (2) storage/offset claims verified against the compiler\u2019s conventions; (3) live reachability on the deployed, in-scope asset; (4) prior-art honesty — including unpublished prior submissions; (5) honest severity against the program\u2019s own impact list.' },
  { t: 'Fork-PoCs with a Falsification Gate', b: 'A proof must assert HARM (victim balance before/after), not mechanism. Then the falsification test: mutate the defective line to its correct form — if the exploit still passes, the PoC is theater and the finding is demoted. Green tests are hypotheses; pinned tests are evidence.' },
  { t: 'The Money Map (accounting-first)', b: 'Before reading for bugs: enumerate every tracked total, every function that writes it, and the asymmetry table (value moved without a matching write; tracked in one branch only; never tracked). Then write 5-15 invariants and run the lifecycles, not the functions. The Last-User-Out test closes every audit: everyone withdraws in the worst order — is the last one paid?' },
  { t: 'Deployed-vs-Repo Delta', b: 'The highest-yield class on live programs: what the audits reviewed is not always what shipped. Reproduce one known match byte-for-byte first (control), then diff audit-era code against the deployed bytecode. Post-audit removals of guards are how real money is found.' }
];
document.getElementById('meth-cards').innerHTML = METH.map(m => `
  <div class="meth-card"><h3>${esc(m.t)}</h3><p>${esc(m.b)}</p></div>`).join('');

// ---------- leaderboard (analyses by loss) ----------
const lb = D.filter(i => i.type === 'analysis').sort((a, b) => lossValue(b) - lossValue(a)).slice(0, 60);
const lbGrid = document.createElement('div');
lbGrid.className = 'grid';
lbGrid.id = 'leaderboard-cards';
const lbSection = document.createElement('section');
lbSection.className = 'section';
lbSection.innerHTML = `<div class="section-head"><h2 data-i18n="lb_title">Largest Hacks</h2><p>The landmark events, with full mechanics.</p></div>`;
lb.forEach((i, idx) => {
  const el = card(i);
  el.querySelector('h3').innerHTML = `#${idx + 1} · ${esc(i.protocol)}`;
  lbGrid.appendChild(el);
});
lbSection.appendChild(lbGrid);
document.getElementById('database').after(lbSection);


// ---------- incident of the week ----------
(function(){
  const analyses = D.filter(i => i.type === 'analysis' && lossValue(i) > 0);
  if (!analyses.length) return;
  const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const pick = analyses[week % analyses.length];
  const el = document.createElement('div');
  el.className = 'week-card';
  el.innerHTML = `<div class="week-tag">Incident of the Week</div><h3>${esc(pick.protocol)}</h3>
    <p>${esc((pick.mechanics || '').slice(0, 260))}…</p>
    <button class="week-btn">Read the analysis</button>`;
  el.querySelector('.week-btn').onclick = () => open(pick);
  document.querySelector('.hero-inner').appendChild(el);
})();

render(); renderIntel(); renderCharts();
