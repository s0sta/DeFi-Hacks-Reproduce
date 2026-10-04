/* database page */
window.initDatabase = function(){
  const classCounts = {};
  D.forEach(i => { classCounts[i.normClass] = (classCounts[i.normClass] || 0) + 1; });
  const topClasses = Object.entries(classCounts).sort((a,b)=>b[1]-a[1]).slice(0,12).map(e=>e[0]);
  const chipsEl = document.getElementById('class-chips');
  topClasses.forEach(c => {
    const el = document.createElement('span');
    el.className='chip'; el.textContent = c + ' (' + classCounts[c] + ')';
    el.dataset.cls = c;
    el.onclick = () => { el.classList.toggle('active'); render(); };
    chipsEl.appendChild(el);
  });
  const years = new Set(); D.forEach(i => { const y=(i.date||'').slice(0,4); if (y) years.add(y); });
  const yearSel = document.getElementById('year-filter');
  [...years].sort().reverse().forEach(y => { const o=document.createElement('option'); o.value=y; o.textContent=y; yearSel.appendChild(o); });
  function filtered(){
    const q = document.getElementById('search').value.toLowerCase();
    const y = yearSel.value, t = document.getElementById('type-filter').value;
    const cls = [...document.querySelectorAll('.chip.active')].map(c=>c.dataset.cls);
    return D.filter(i => {
      if (q && !(i.protocol+' '+i.normClass+' '+i.chain+' '+i.mechanics).toLowerCase().includes(q)) return false;
      if (y && (i.date||'').slice(0,4) !== y) return false;
      if (t && i.type !== t) return false;
      if (cls.length && !cls.includes(i.normClass)) return false;
      return true;
    });
  }
  function render(){
    const list = filtered();
    document.getElementById('result-count').textContent = list.length + ' incidents';
    const grid = document.getElementById('cards'); grid.innerHTML='';
    list.slice(0, 300).forEach(i => grid.appendChild(card(i)));
  }
  document.getElementById('search').oninput = render;
  yearSel.onchange = render;
  document.getElementById('type-filter').onchange = render;
  const params = new URLSearchParams(location.search);
  const urlQ = params.get('q');
  if (urlQ){ document.getElementById('search').value = urlQ; }
  const urlT = params.get('type');
  if (urlT){ document.getElementById('type-filter').value = urlT; }
  render();
};
