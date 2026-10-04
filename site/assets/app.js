const D = window.INCIDENTS || [];

// ---- stats ----
const years = new Set(); const classes = new Set();
D.forEach(i => {
  const y = (i.date || '').slice(0, 4); if (y) years.add(y);
  const c = (i.class || '').toLowerCase(); if (c && c !== 'logic') classes.add(c);
});
const analyses = D.filter(i => i.type === 'analysis').length;
document.getElementById('stat-incidents').textContent = D.length;
document.getElementById('stat-analyses').textContent = analyses;
document.getElementById('stat-years').textContent = years.size;
document.getElementById('stat-classes').textContent = classes.size;

// ---- class chips ----
const classOrder = ['access-control','reentrancy','oracle','flashloan','price manipulation','governance','bridge','signature','rounding','overflow','misc'];
const chipCounts = {};
D.forEach(i => { const c = i.class || 'misc'; chipCounts[c] = (chipCounts[c] || 0) + 1; });
const topClasses = Object.entries(chipCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
const chipsEl = document.getElementById('class-chips');
topClasses.forEach(c => {
  const el = document.createElement('span');
  el.className = 'chip'; el.textContent = c + ' (' + chipCounts[c] + ')';
  el.dataset.cls = c;
  el.onclick = () => { el.classList.toggle('active'); render(); };
  chipsEl.appendChild(el);
});

// ---- year filter ----
const yearSel = document.getElementById('year-filter');
[...years].sort().reverse().forEach(y => {
  const o = document.createElement('option'); o.value = y; o.textContent = y; yearSel.appendChild(o);
});

// ---- helpers ----
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function lossValue(i) {
  const m = String(i.loss || '').match(/\$?\s?([\d,.]+)\s?([BMK]?)/i);
  if (!m) return 0;
  let v = parseFloat(m[1].replace(/,/g, ''));
  const u = (m[2] || '').toUpperCase();
  if (u === 'B') v *= 1e9; else if (u === 'M') v *= 1e6; else if (u === 'K') v *= 1e3;
  return v;
}
function badge(i) {
  let b = '';
  if (i.class) b += `<span class="badge class">${esc(i.class)}</span>`;
  if (i.chain) b += `<span class="badge chain">${esc(i.chain.split(',')[0])}</span>`;
  if (i.date) b += `<span class="badge year">${esc(i.date)}</span>`;
  if (i.loss) b += `<span class="badge loss">${esc(i.loss)}</span>`;
  if (i.type === 'analysis') b += `<span class="badge analysis">deep-dive</span>`;
  return b;
}
function card(i) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h3>${esc(i.protocol)}</h3><div class="badges">${badge(i)}</div><p class="excerpt">${esc(i.mechanics.slice(0, 220))}…</p>`;
  el.onclick = () => open(i);
  return el;
}
function open(i) {
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
document.getElementById('modal-close').onclick = () => { document.getElementById('modal').hidden = true; document.body.style.overflow = ''; };
document.getElementById('modal').onclick = e => { if (e.target === e.currentTarget) { e.currentTarget.hidden = true; document.body.style.overflow = ''; } };
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.getElementById('modal').hidden = true; document.body.style.overflow = ''; } });

// ---- filtering ----
function filtered() {
  const q = document.getElementById('search').value.toLowerCase();
  const y = yearSel.value;
  const t = document.getElementById('type-filter').value;
  const cls = [...document.querySelectorAll('.chip.active')].map(c => c.dataset.cls);
  return D.filter(i => {
    if (q && !(i.protocol + ' ' + i.class + ' ' + i.chain + ' ' + i.mechanics).toLowerCase().includes(q)) return false;
    if (y && (i.date || '').slice(0, 4) !== y) return false;
    if (t && i.type !== t) return false;
    if (cls.length && !cls.includes(i.class || 'misc')) return false;
    return true;
  });
}
function render() {
  const list = filtered();
  document.getElementById('result-count').textContent = list.length + ' incidents';
  const grid = document.getElementById('cards');
  grid.innerHTML = '';
  list.slice(0, 300).forEach(i => grid.appendChild(card(i)));
}
document.getElementById('search').oninput = render;
yearSel.onchange = render;
document.getElementById('type-filter').onchange = render;

// ---- leaderboard: analyses sorted by loss ----
const lb = D.filter(i => i.type === 'analysis').sort((a, b) => lossValue(b) - lossValue(a)).slice(0, 60);
const lbGrid = document.getElementById('leaderboard-cards');
lb.forEach((i, idx) => {
  const el = card(i);
  el.querySelector('h3').innerHTML = `#${idx + 1} · ${esc(i.protocol)}`;
  lbGrid.appendChild(el);
});

render();
