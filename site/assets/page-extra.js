/* intelligence, checklists, patterns, analytics, methodology pages */
window.initIntelligence = function(){
  const classCounts = {};
  D.forEach(i => { classCounts[i.normClass] = (classCounts[i.normClass]||0)+1; });
  const losses = {};
  D.forEach(i => { losses[i.normClass] = (losses[i.normClass]||0) + lossValue(i); });
  const rows = Object.entries(classCounts).sort((a,b)=>b[1]-a[1]);
  const el = document.getElementById('intel-cards');
  rows.forEach(([c,n]) => {
    const lm = losses[c]||0;
    el.innerHTML += `<a class="intel-card" href="database.html?q=${encodeURIComponent(c)}" title="Open the ${esc(c)} incidents">
      <div class="intel-head"><span class="intel-name">${esc(c)}</span><span class="intel-count">${n} →</span></div>
      <div class="intel-loss">${lm >= 1e6 ? '$'+(lm/1e6).toFixed(0)+'M' : lm ? '$'+Math.round(lm/1e3)+'K' : '—'} reported</div>
      <div class="meter"><div class="meter-fill" style="width:${Math.min(100, n/rows[0][1]*100)}%"></div></div></a>`;
  });
};

window.initChecklists = function(){
  const CHECKLISTS = window.CHECKLISTS || [];
  const catTabs = document.getElementById('cat-tabs');
  CHECKLISTS.forEach((c, idx) => {
    const b = document.createElement('button');
    b.className='cat-tab'+(idx===0?' active':'');
    b.textContent = c.name;
    b.onclick = () => { [...catTabs.children].forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderCat(c); };
    catTabs.appendChild(b);
  });
  function renderCat(cat){
    document.getElementById('cat-content').innerHTML = cat.patterns.map((p,i)=>`
      <div class="pattern-card"><div class="pat-num">${String(i+1).padStart(2,'0')}</div>
      <div class="pat-body"><h3>${esc(p.t)}</h3><p class="pat-why">${esc(p.e)}</p>
      <div class="pat-ex"><strong>Killed:</strong> ${esc(p.ex.join(' · '))}</div>
      <ul class="pat-checks">${p.ch.map(c=>`<li><code>${esc(c)}</code></li>`).join('')}</ul></div></div>`).join('');
  }
  renderCat(CHECKLISTS[0]);
};

window.initPatterns = function(){
  const P = window.PATTERNS10 || [];
  document.getElementById('pattern-list').innerHTML = P.map((p,i)=>`
    <div class="pattern-card"><div class="pat-num">${String(i+1).padStart(2,'0')}</div>
    <div class="pat-body"><h3>${esc(p.t)}</h3><p class="pat-why">${esc(p.why)}</p>
    <ul class="pat-checks"><li><code>${esc(p.sig)}</code></li><li>✅ ${esc(p.d)}</li></ul></div></div>`).join('');
};

window.initAnalytics = function(){
  const classLoss={}, chainLoss={}, yearCount={};
  let totalLoss = 0;
  D.forEach(i => {
    const lv = lossValue(i);
    totalLoss += lv;
    classLoss[i.normClass] = (classLoss[i.normClass]||0)+lv;
    const ch = (i.chain||'Unknown').split(',')[0].trim();
    chainLoss[ch] = (chainLoss[ch]||0)+lv;
    const y=(i.date||'').slice(0,4); if (y) yearCount[y]=(yearCount[y]||0)+1;
  });
  const topChain = Object.entries(chainLoss).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1])[0];
  const topYear = Object.entries(yearCount).sort((a,b)=>b[1]-a[1])[0];
  const s = document.getElementById('ana-summary');
  if (s) s.innerHTML = `<div class="sum-card"><div class="sum-num">$${(totalLoss/1e9).toFixed(1)}B</div><div class="sum-label">Total reported losses</div></div>
    <a class="sum-card" href="${topChain ? 'database.html?q=' + encodeURIComponent(topChain[0]) : '#'}"><div class="sum-num">${topChain ? esc(topChain[0]) : '—'}</div><div class="sum-label">Most-hit chain</div></a>
    <div class="sum-card"><div class="sum-num">${topYear ? topYear[0] : '—'}</div><div class="sum-label">Busiest year (${topYear ? topYear[1] : 0} incidents)</div></div>`;

  function bars(id, entries, fmt, hrefOf){
    const max = Math.max(...entries.map(e=>e.v),1);
    document.getElementById(id).innerHTML = entries.map(e=>`
      <a class="bar-link" href="${hrefOf(e)}">
        <div class="bar-top"><span class="bar-label">${esc(e.k)}</span><span class="bar-val">${fmt(e.v)}</span><span class="bar-arrow">→</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${(e.v/max*100).toFixed(1)}%"></div></div>
      </a>`).join('');
  }
  const q = (v) => 'database.html?q=' + encodeURIComponent(v);
  bars('chart-class', Object.entries(classLoss).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>({k:e[0],v:e[1]})), v=>'$'+(v/1e6).toFixed(0)+'M', e=>q(e.k));
  bars('chart-chain', Object.entries(chainLoss).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>({k:e[0],v:e[1]})), v=>'$'+(v/1e6).toFixed(0)+'M', e=>q(e.k));
  bars('chart-year', Object.entries(yearCount).sort((a,b)=>a[0]-b[0]).map(e=>({k:e[0],v:e[1]})), v=>v, e=>'database.html?year='+encodeURIComponent(e.k));
};

window.initMethodology = function(){
  const METH = [
    { t:'The 5-Gate No-False-Positives Rule', b:'Every finding must pass five gates before it is reported: (1) exploit economics derived by hand, twice, with a named victim and gainer; (2) storage/offset claims verified against the compiler\u2019s conventions; (3) live reachability on the deployed, in-scope asset; (4) prior-art honesty \u2014 including unpublished prior submissions; (5) honest severity against the program\u2019s own impact list.' },
    { t:'Fork-PoCs with a Falsification Gate', b:'A proof must assert HARM (victim balance before/after), not mechanism. Then the falsification test: mutate the defective line to its correct form \u2014 if the exploit still passes, the PoC is theater and the finding is demoted. Green tests are hypotheses; pinned tests are evidence.' },
    { t:'The Money Map (accounting-first)', b:'Before reading for bugs: enumerate every tracked total, every function that writes it, and the asymmetry table (value moved without a matching write; tracked in one branch only; never tracked). Then write 5-15 invariants and run the lifecycles, not the functions. The Last-User-Out test closes every audit: everyone withdraws in the worst order \u2014 is the last one paid?' },
    { t:'Deployed-vs-Repo Delta', b:'The highest-yield class on live programs: what the audits reviewed is not always what shipped. Reproduce one known match byte-for-byte first (control), then diff audit-era code against the deployed bytecode. Post-audit removals of guards are how real money is found.' }
  ];
  document.getElementById('meth-cards').innerHTML = METH.map((m,i)=>`
    <div class="meth-card"><div class="m-num">Principle ${i+1}</div><h3>${esc(m.t)}</h3><p>${esc(m.b)}</p></div>`).join('');
};
