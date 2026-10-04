(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const msg = t => ($('#msg').textContent = t);

  /* clock */
  const tick = () => ($('#clock').textContent = new Date().toLocaleTimeString('en-GB') + ' IST');
  tick(); setInterval(tick, 1000);

  /* skills data */
  const skills = [
    ['SQL', [['PostgreSQL', 90], ['Joins / CTEs', 88], ['Query optimization', 80]]],
    ['PYTHON FOR ANALYTICS', [['Pandas / NumPy', 92], ['Data cleaning', 90], ['Scikit-learn', 82]]],
    ['BI & VISUALIZATION', [['Power BI (DAX, PQ)', 88], ['Tableau', 82], ['EDA / KPI tracking', 90]]],
    ['FINANCIAL ANALYTICS', [['Technical indicators', 93], ['Market data APIs', 88], ['Risk & volatility', 80]]],
    ['ML & STATISTICS', [['Classification / regression', 82], ['SHAP explainability', 80], ['PyTorch', 65]]],
    ['BACKEND & DEPLOY', [['Flask / FastAPI', 82], ['Docker / AWS', 65], ['Supabase / REST', 80]]]
  ];
  $('#skillBody').innerHTML = skills.map(([g, rows]) =>
    `<div class="sk"><h3>${g}</h3>${rows.map(([n, v]) =>
      `<div><i>${n}</i><span class="bar"><u data-w="${v}"></u></span><span>${v}</span></div>`).join('')}</div>`).join('') +
    `<div class="sk"><h3>TOOLS</h3><div class="tags"><span>Git/GitHub</span><span>Postman</span><span>Multi-agent AI</span><span>Plotly</span><span>Streamlit</span></div></div>`;
  setTimeout(() => $$('.bar u').forEach(u => (u.style.width = u.dataset.w + '%')), 300);

  /* stat counters */
  $$('[data-n]').forEach(el => {
    const end = +el.dataset.n; let n = 0;
    const id = setInterval(() => { n += Math.ceil(end / 25); if (n >= end) { n = end; clearInterval(id); } el.textContent = n; }, 40);
  });

  /* ticker tape (simulated indicators) */
  const names = ['RSI', 'MACD', 'STOCH', 'WILL%R', 'CCI', 'MFI', 'CMF', 'ADX', 'ATR', 'BB%B', 'SUPERTREND', 'PSAR'];
  const vals = names.map(() => 20 + Math.random() * 60);
  const renderTape = () => {
    const h = names.map((n, i) => {
      const d = (Math.random() - 0.5) * 2; vals[i] = Math.max(1, vals[i] + d);
      return `<span>${n} ${vals[i].toFixed(2)} <b class="${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? '\u25B2' : '\u25BC'}${Math.abs(d).toFixed(2)}</b></span>`;
    }).join('');
    $('#tape').innerHTML = h + h;
  };
  renderTape(); setInterval(renderTape, 4000);

  /* candlestick chart (simulated) */
  const cv = $('#chart'), ctx = cv.getContext('2d');
  const mk = o => { const c = o + (Math.random() - 0.48) * 3; return { o, c, h: Math.max(o, c) + Math.random() * 1.5, l: Math.min(o, c) - Math.random() * 1.5, v: 30 + Math.random() * 70 }; };
  let cs = [], pr = 100;
  for (let k = 0; k < 60; k++) { const c = mk(pr); cs.push(c); pr = c.c; }
  const draw = () => {
    const D = devicePixelRatio, w = cv.width = cv.clientWidth * D, h = cv.height = 260 * D, vh = 50 * D, ph = h - vh - 16 * D;
    const lo = Math.min(...cs.map(c => c.l)) - 1, hi = Math.max(...cs.map(c => c.h)) + 1, bw = (w - 70 * D) / cs.length;
    const Y = v => 8 * D + (hi - v) / (hi - lo) * (ph - 8 * D), X = k => 6 * D + k * bw;
    ctx.strokeStyle = '#141a20'; ctx.lineWidth = 1; ctx.fillStyle = '#6b7480'; ctx.font = 10 * D + 'px monospace';
    for (let g = 0; g <= 4; g++) { const y = 8 * D + g * (ph - 8 * D) / 4; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w - 60 * D, y); ctx.stroke(); ctx.fillText((hi - g * (hi - lo) / 4).toFixed(1), w - 54 * D, y + 3 * D); }
    cs.forEach((c, k) => {
      const col = c.c >= c.o ? '#2ee66b' : '#ff4d4d'; ctx.strokeStyle = ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(X(k) + bw / 2, Y(c.h)); ctx.lineTo(X(k) + bw / 2, Y(c.l)); ctx.stroke();
      ctx.fillRect(X(k) + 1, Math.min(Y(c.o), Y(c.c)), bw - 2, Math.max(1, Math.abs(Y(c.o) - Y(c.c))));
      ctx.globalAlpha = .35; ctx.fillRect(X(k) + 1, h - c.v / 100 * vh, bw - 2, c.v / 100 * vh); ctx.globalAlpha = 1;
    });
    ctx.strokeStyle = '#38e8ff'; ctx.lineWidth = 1.5 * D; ctx.beginPath();
    cs.forEach((_, k) => { if (k < 9) return; const m = cs.slice(k - 9, k + 1).reduce((a, c) => a + c.c, 0) / 10; k === 9 ? ctx.moveTo(X(k) + bw / 2, Y(m)) : ctx.lineTo(X(k) + bw / 2, Y(m)); }); ctx.stroke();
    const L = cs.at(-1), up = L.c >= L.o, y = Y(L.c);
    ctx.setLineDash([4 * D, 4 * D]); ctx.strokeStyle = up ? '#2ee66b' : '#ff4d4d'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w - 60 * D, y); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = up ? '#2ee66b' : '#ff4d4d'; ctx.fillRect(w - 60 * D, y - 8 * D, 58 * D, 16 * D); ctx.fillStyle = '#000'; ctx.fillText(L.c.toFixed(2), w - 54 * D, y + 4 * D);
    $('#px').textContent = L.c.toFixed(2) + (up ? ' \u25B2' : ' \u25BC'); $('#px').style.color = up ? 'var(--up)' : 'var(--dn)';
  };
  draw(); addEventListener('resize', draw);
  let tk = 0;
  setInterval(() => { const L = cs.at(-1); L.c += (Math.random() - 0.5) * 1.2; L.h = Math.max(L.h, L.c); L.l = Math.min(L.l, L.c); L.v = Math.min(100, L.v + Math.random() * 6);
    if (++tk % 6 === 0) { cs.push(mk(L.c)); cs.shift(); } draw(); }, 1000);

  /* market monitor (simulated) */
  const wl = [['NIFTY 50', 24850], ['SENSEX', 81400], ['BANKNIFTY', 53100], ['RELIANCE', 2960], ['TCS', 4120], ['INFY', 1840], ['HDFCBANK', 1710], ['USDINR', 83.4]]
    .map(([n, p]) => ({ n, p, o: p, h: Array.from({ length: 24 }, () => p) }));
  const tb = $('#watch tbody');
  tb.innerHTML = wl.map((r, k) => `<tr><td style="color:var(--amber);font-weight:700">${r.n}</td><td id="w${k}p"></td><td id="w${k}c"></td><td id="w${k}s"></td></tr>`).join('');
  const spark = a => { const lo = Math.min(...a), hi = Math.max(...a) || 1, rg = hi - lo || 1; return `<svg width="90" height="18" viewBox="0 0 90 18"><polyline fill="none" stroke="#38e8ff" stroke-width="1.3" points="${a.map((v, i) => (i * 90 / 23).toFixed(1) + ',' + (16 - (v - lo) / rg * 14).toFixed(1)).join(' ')}"/></svg>`; };
  const upd = () => wl.forEach((r, k) => {
    const prev = r.p; r.p *= 1 + (Math.random() - 0.5) * 0.0016; r.h.push(r.p); r.h.shift();
    const ch = (r.p / r.o - 1) * 100, c = $('#w' + k + 'c'), p = $('#w' + k + 'p');
    p.textContent = r.p.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    p.className = r.p >= prev ? 'up' : 'dn'; c.textContent = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; c.className = ch >= 0 ? 'up' : 'dn';
    $('#w' + k + 's').innerHTML = spark(r.h);
  });
  upd(); setInterval(upd, 1200);

  /* system log + uptime */
  const lines = ['[OK] upstox.feed synced, 15m candles cached', '[OK] yfinance.fetch NIFTY 50 returned 1 row', '[OK] indicators.compute RSI, MACD, ADX done', '[OK] agent.router -> technical_analysis', '[OK] supabase.session persisted', '[OK] etl.job daily_kpi refreshed', '[OK] shap.explain batch complete', '[INFO] cache hit ratio 94%', '[OK] dashboard.refresh powerbi dataset'];
  const lg = $('#log'); let li = 0;
  const addLog = () => { const d = document.createElement('div'); d.innerHTML = `<span>${new Date().toLocaleTimeString('en-GB')}</span> ${lines[li++ % lines.length]}`; lg.appendChild(d); while (lg.children.length > 9) lg.firstChild.remove(); };
  for (let k = 0; k < 5; k++) addLog(); setInterval(addLog, 2200);
  const t0 = Date.now(); setInterval(() => { const s = ((Date.now() - t0) / 1000) | 0; $('#up').textContent = 'UPTIME ' + String(s / 60 | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);

  /* boot sequence */
  const bt = ['SANJ TERMINAL v2.6', 'initializing market data modules ........ OK', 'loading SQL / Python / BI stack ........... OK', 'connecting feeds: UPSTOX YFINANCE NEWS .... OK', 'starting 8 agents ......................... OK', 'ACCESS GRANTED. WELCOME.'];
  let bi = 0; const bo = $('#boot');
  const endBoot = () => { bo.classList.add('off'); setTimeout(() => bo.remove(), 600); };
  const bn = () => { if (!bo.isConnected) return; $('#bootTxt').textContent += (bi ? '\n' : '') + '> ' + bt[bi++]; bi < bt.length ? setTimeout(bn, 260) : setTimeout(endBoot, 500); };
  bn(); bo.addEventListener('click', endBoot);

  /* projects */
  const projects = [
    { t: 'QuadraAI: AI-Powered Financial Research Assistant', l: 'Live demo', u: 'https://github.com/SAISANJAY-PARTH',
      b: ['8 specialized agents: Portfolio, Technical, Fundamental, Risk, Goal Planning, Personal CFO, News & Sentiment, Education.', 'Each query routes to a domain-specific agent instead of one generic model.', 'Upstox, Yahoo Finance and News APIs ground answers in live data and sentiment.', 'Groq, DeepSeek and Sarvam LLM backends with a Flask + Supabase layer for orchestration and session state.'] },
    { t: 'QuadraTerminal: Market Intelligence & Technical Analysis', l: 'GitHub', u: 'https://github.com/SAISANJAY-PARTH',
      b: ['12 indicators: RSI, MACD, Stochastic K/D, Williams %R, CCI, MFI, CMF, ADX, ATR, Bollinger %B, Supertrend, Parabolic SAR.', 'Timeframes from 15 minutes to Monthly with interactive Plotly charts.', 'Upstox and Yahoo Finance pipelines with local caching to cut redundant API calls.', 'Trend, momentum and volatility tools for watchlisted instruments.'] },
    { t: 'Customer Churn Prediction & Segmentation System', l: 'GitHub', u: 'https://github.com/SAISANJAY-PARTH',
      b: ['Random Forest churn model with ROC-AUC of 0.85.', 'Low / Medium / High risk segmentation by churn probability for targeted follow-up.', 'SHAP explains the key drivers behind each prediction.', 'Streamlit interface for non-technical stakeholders.'] }
  ];
  const show = i => {
    const p = projects[i];
    $$('.row').forEach((r, j) => r.classList.toggle('on', i === j));
    $('#detail').innerHTML = `<h3>${p.t}</h3><ul>${p.b.map(x => `<li>${x}</li>`).join('')}</ul><div class="links"><a href="${p.u}" target="_blank" rel="noopener">${p.l}</a></div>`;
    msg('LOADED ' + p.t.split(':')[0].toUpperCase());
  };
  $$('.row').forEach(r => r.addEventListener('click', () => show(+r.dataset.p)));
  show(0);

  /* navigation */
  const go = id => {
    const el = document.getElementById(id); if (!el) return;
    el.scrollIntoView({ block: 'start' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    msg('GO ' + id.toUpperCase());
  };
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  const map = { F1: 'profile', F2: 'skills', F3: 'exp', F4: 'proj', F5: 'edu', F6: 'cont' };
  const cmds = { PROFILE: 'profile', HOME: 'profile', ABOUT: 'profile', SKILL: 'skills', SKILLS: 'skills', EXP: 'exp', EXPERIENCE: 'exp', PROJ: 'proj', PROJECTS: 'proj', EDU: 'edu', EDUCATION: 'edu', CONT: 'cont', CONTACT: 'cont' };
  $('#cmdForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#cmd').value.trim().toUpperCase().replace(/<GO>/, '').trim(); $('#cmd').value = '';
    if (cmds[v]) go(cmds[v]);
    else if (v === 'HELP') msg('COMMANDS: ' + [...new Set(Object.keys(cmds))].slice(0, 13).join(' '));
    else if (v === 'GITHUB') open('https://github.com/SAISANJAY-PARTH', '_blank');
    else if (v === 'LINKEDIN') open('https://linkedin.com/in/sai-s-198a14276', '_blank');
    else msg('INVALID COMMAND: ' + v + '. TYPE HELP');
  });
  addEventListener('keydown', e => {
    if (map[e.key]) { e.preventDefault(); go(map[e.key]); }
    else if (e.key === '/' && document.activeElement !== $('#cmd')) { e.preventDefault(); $('#cmd').focus(); }
  });
})();
