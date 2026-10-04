/* s0sta archive — shared core (nav, helpers, modal, stats, incident of the week) */
const D = window.INCIDENTS || [];
const PAGE = document.body.dataset.page || 'home';

/* class normalization */
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

/* helpers */
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
  if (!m) return;
  m.hidden = false;
  document.getElementById('modal-title').textContent = i.protocol;
  document.getElementById('modal-badges').innerHTML = badge(i);
  document.getElementById('modal-body').innerHTML =
    (i.mechanics ? `<h4>Mechanics</h4><p class="mech">${esc(i.mechanics)}</p>` : '') +
    (i.lesson ? `<h4>Lesson</h4><p>${esc(i.lesson)}</p>` : '') +
    (i.aftermath ? `<h4>Aftermath</h4><p>${esc(i.aftermath)}</p>` : '');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ const m = document.getElementById('modal'); if (m) m.hidden = true; document.body.style.overflow = ''; }
function bindModal(){
  const m = document.getElementById('modal');
  if (!m) return;
  document.getElementById('modal-close').onclick = closeModal;
  m.onclick = e => { if (e.target === e.currentTarget) closeModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* stats (home) */
function fillStats(){
  const years = new Set(); D.forEach(i => { const y = (i.date||'').slice(0,4); if (y) years.add(y); });
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('stat-incidents', D.length);
  set('stat-analyses', D.filter(i => i.type === 'analysis').length);
  set('stat-years', years.size);
  set('stat-classes', new Set(D.map(i => i.normClass)).size);
  set('glance-analyses', D.filter(i => i.type === 'analysis').length);
  set('glance-cats', (window.CHECKLISTS || []).length);
  set('glance-patterns', (window.PATTERNS10 || []).length);
}

/* incident of the week (home) */
function incidentOfWeek(){
  const slot = document.getElementById('week-slot');
  if (!slot) return;
  const analyses = D.filter(i => i.type === 'analysis' && lossValue(i) > 0);
  if (!analyses.length) return;
  const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const pick = analyses[week % analyses.length];
  slot.innerHTML = `<div class="week-tag">Incident of the Week</div><h3>${esc(pick.protocol)}</h3>
    <p>${esc((pick.mechanics||'').slice(0, 300))}…</p>
    <a class="btn" href="database.html?q=${encodeURIComponent(pick.protocol)}">Read the analysis</a>`;
}

/* theme toggle */
(function(){
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('s0sta-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = saved || (prefersDark ? 'dark' : 'light');
  const apply = () => {
    document.documentElement.dataset.theme = theme;
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('s0sta-theme', theme);
  };
  apply();
  btn.addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; apply(); });
})();

/* hamburger */
const toggle = document.getElementById('nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  }));
}

/* footer year */
function fillYear(){ const el = document.getElementById('foot-year'); if (el) el.textContent = new Date().getFullYear(); }

/* nav active state */
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.dataset.page === PAGE) a.classList.add('active');
});

/* boot per page */
const BOOT = {
  home(){ fillStats(); incidentOfWeek(); },
  database(){ window.initDatabase && window.initDatabase(); },
  intelligence(){ window.initIntelligence && window.initIntelligence(); },
  checklists(){ window.initChecklists && window.initChecklists(); },
  patterns(){ window.initPatterns && window.initPatterns(); },
  analytics(){ window.initAnalytics && window.initAnalytics(); },
  methodology(){ window.initMethodology && window.initMethodology(); }
};
bindModal(); fillYear();
if (BOOT[PAGE]) BOOT[PAGE]();
