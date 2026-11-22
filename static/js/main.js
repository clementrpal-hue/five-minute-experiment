/* The 5-Minute Experiment - shared helpers, storage, sync, home dashboard. DARINGMATES */
(function () {
  'use strict';
  const FM = (window.FM = {});

  FM.$ = (s, r = document) => r.querySelector(s);
  FM.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  FM.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  FM.dateKey = (d = new Date()) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  FM.fmtDate = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  FM.fmtTime = (sec) => {
    sec = Math.round(sec || 0);
    if (sec < 60) return sec + ' sec';
    const m = Math.floor(sec / 60);
    return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  };
  FM.uid = () => (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

  let toastTimer;
  FM.toast = (msg) => {
    const t = FM.$('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
  };

  /* ---------- local storage ---------- */
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  FM.Store = {
    entries() { return ls.get('fm_entries', []); },
    saveEntry(e) {
      const all = this.entries().filter((x) => x.uid !== e.uid);
      all.push(e);
      return ls.set('fm_entries', all);
    },
    deleteEntry(uid) {
      ls.set('fm_entries', this.entries().filter((x) => x.uid !== uid));
      const del = ls.get('fm_deleted', []);
      if (!del.includes(uid)) { del.push(uid); ls.set('fm_deleted', del); }
    },
    favs() { return ls.get('fm_favs', []); },
    isFav(id) { return this.favs().includes(id); },
    toggleFav(id) {
      let f = this.favs();
      f = f.includes(id) ? f.filter((x) => x !== id) : f.concat(id);
      ls.set('fm_favs', f);
      return f.includes(id);
    },
    goal() { return ls.get('fm_goal', null); },
    setGoal(g) { ls.set('fm_goal', g); },
  };

  /* ---------- server sync (SQLite) ---------- */
  FM.online = false;
  FM.push = async (entry) => {
    try {
      const r = await fetch('/api/reflections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry),
      });
      return r.ok;
    } catch (e) { return false; }
  };
  FM.remoteDelete = async (uid) => {
    try {
      const r = await fetch('/api/reflections/' + encodeURIComponent(uid), { method: 'DELETE' });
      return r.ok || r.status === 404;
    } catch (e) { return false; }
  };
  FM.sync = async () => {
    try {
      for (const uid of ls.get('fm_deleted', []).slice()) {
        if (await FM.remoteDelete(uid)) ls.set('fm_deleted', ls.get('fm_deleted', []).filter((x) => x !== uid));
      }
      const r = await fetch('/api/reflections');
      if (!r.ok) throw new Error('bad status');
      const remote = (await r.json()).reflections || [];
      const deleted = new Set(ls.get('fm_deleted', []));
      const merged = new Map(FM.Store.entries().map((e) => [e.uid, e]));
      remote.forEach((e) => { if (!merged.has(e.uid) && !deleted.has(e.uid)) merged.set(e.uid, e); });
      ls.set('fm_entries', Array.from(merged.values()));
      const known = new Set(remote.map((e) => e.uid));
      for (const e of merged.values()) if (!known.has(e.uid)) await FM.push(e);
      FM.online = true;
    } catch (e) { FM.online = false; }
  };
  FM.ready = new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      FM.sync().then(finish, finish);
      setTimeout(finish, 2500);
    });
  });

  /* ---------- stats ---------- */
  FM.stats = (entries) => {
    const days = new Set(entries.map((e) => e.completed_date));
    let streak = 0;
    const c = new Date();
    if (!days.has(FM.dateKey(c))) c.setDate(c.getDate() - 1);
    while (days.has(FM.dateKey(c))) { streak++; c.setDate(c.getDate() - 1); }
    const per = {};
    entries.forEach((e) => { per[e.category] = (per[e.category] || 0) + 1; });
    let fav = null;
    Object.keys(per).forEach((k) => { if (!fav || per[k] > per[fav]) fav = k; });
    const rated = entries.filter((e) => e.rating);
    return {
      total: entries.length,
      secs: entries.reduce((a, e) => a + (e.duration_seconds || 0), 0),
      streak, per, fav, days,
      avg: rated.length ? rated.reduce((a, e) => a + e.rating, 0) / rated.length : 0,
    };
  };
  FM.stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  FM.byNewest = (a, b) => (b.created_at || b.completed_date).localeCompare(a.created_at || a.completed_date);

  /* ---------- shared UI behaviour ---------- */
  document.addEventListener('click', (ev) => {
    const fav = ev.target.closest('[data-fav]');
    if (fav) {
      const id = fav.dataset.fav;
      const on = FM.Store.toggleFav(id);
      FM.$$('[data-fav="' + id + '"]').forEach((b) => {
        b.setAttribute('aria-pressed', on);
        b.textContent = b.dataset.long ? (on ? '★ Saved' : '☆ Save for later') : (on ? '★' : '☆');
      });
      document.dispatchEvent(new CustomEvent('fm:favs'));
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const tg = FM.$('#navToggle'), links = FM.$('#navLinks');
    if (tg && links) {
      tg.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        tg.setAttribute('aria-expanded', open);
        tg.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      links.addEventListener('click', (e) => { if (e.target.closest('a')) links.classList.remove('open'); });
    }
    initHome();
  });

  /* ---------- home page ---------- */
  function weekStartKey() {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return FM.dateKey(d);
  }
  FM.catProgressHTML = (per, total) => window.CATS.map((c) => {
    const n = per[c.id] || 0;
    const have = window.EXPERIMENTS.filter((e) => e.category === c.id).length;
    const pct = have ? Math.round((n / have) * 100) : 0;
    return `<div class="prog" style="--accent:${c.color}"><div class="prog-top"><span>${c.icon} ${FM.esc(c.name)}</span><span class="muted">${n} done</span></div><div class="prog-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, pct)}" aria-label="${FM.esc(c.name)} progress"><i style="width:${Math.min(100, pct)}%"></i></div></div>`;
  }).join('');

  function initHome() {
    if (!FM.$('#dashboard')) return;
    FM.$('#stAvail').textContent = window.EXPERIMENTS.length;
    renderFloaters();
    renderDaily();
    renderCatGrid();
    const draw = () => {
      const entries = FM.Store.entries();
      const s = FM.stats(entries);
      FM.$('#stDone').textContent = s.total;
      FM.$('#stTime').textContent = FM.fmtTime(s.secs);
      FM.$('#stStreak').textContent = s.streak + (s.streak === 1 ? ' day' : ' days');
      FM.$('#stFav').textContent = s.fav ? FM.cat(s.fav).name : 'Not yet';
      FM.$('#catProgress').innerHTML = FM.catProgressHTML(s.per, s.total);
      renderWeek(entries);
      renderRecent(entries);
      renderGoal(entries);
    };
    draw();
    FM.ready.then(draw);
  }
  function renderFloaters() {
    const box = FM.$('#floaters');
    if (!box) return;
    const picks = window.EXPERIMENTS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    box.innerHTML = picks.map((e, i) => {
      const c = FM.cat(e.category);
      return `<a class="floater f${i + 1}" href="/experiment/${e.id}" style="--accent:${c.color}"><span>${c.icon} ${FM.esc(c.name)}</span><strong>${FM.esc(e.title)}</strong><em>${e.duration} min · ${e.difficulty}</em></a>`;
    }).join('');
  }
  function renderDaily() {
    const box = FM.$('#daily');
    if (!box) return;
    const e = FM.daily(), c = FM.cat(e.category);
    box.style.setProperty('--accent', c.color);
    box.innerHTML = `<div class="daily-copy"><span class="chip cat">${c.icon} ${FM.esc(c.name)}</span><h3>${FM.esc(e.title)}</h3><p>${FM.esc(e.short)}</p><div class="meta"><span class="chip">${e.duration} min</span><span class="chip">${e.difficulty}</span></div></div><div class="daily-act"><a class="btn btn-primary btn-lg" href="/experiment/${e.id}">Start today's experiment</a><button type="button" class="btn btn-ghost" data-fav="${e.id}" data-long="1" aria-pressed="${FM.Store.isFav(e.id)}">${FM.Store.isFav(e.id) ? '★ Saved' : '☆ Save for later'}</button></div>`;
  }
  FM.renderCatGrid = renderCatGrid;
  function renderCatGrid() {
    const box = FM.$('#catGrid');
    if (!box) return;
    box.innerHTML = window.CATS.map((c) => {
      const n = window.EXPERIMENTS.filter((e) => e.category === c.id).length;
      return `<article class="cat-card" style="--accent:${c.color}"><div class="cat-icon" aria-hidden="true">${c.icon}</div><h3>${FM.esc(c.name)}</h3><p>${FM.esc(c.blurb)}</p><p class="muted small">${n} experiments</p><a class="btn btn-ghost btn-small" href="/discover?cat=${c.id}#generator" aria-label="Explore ${FM.esc(c.name)}">Explore</a></article>`;
    }).join('');
  }
  function renderWeek(entries) {
    const box = FM.$('#weekChart');
    const counts = [], now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const k = FM.dateKey(d);
      counts.push({ n: entries.filter((e) => e.completed_date === k).length, label: d.toLocaleDateString(undefined, { weekday: 'short' }) });
    }
    const max = Math.max(1, ...counts.map((c) => c.n));
    box.innerHTML = counts.map((c) => `<div class="bar"><span class="bar-n">${c.n}</span><i style="height:${(c.n / max) * 100}%"></i><span class="bar-l">${c.label}</span></div>`).join('');
    box.setAttribute('aria-label', 'Experiments per day, last 7 days: ' + counts.map((c) => c.label + ' ' + c.n).join(', '));
  }
  function renderRecent(entries) {
    const ul = FM.$('#recent');
    const list = entries.slice().sort(FM.byNewest).slice(0, 5);
    ul.innerHTML = list.length
      ? list.map((e) => `<li><span>${FM.cat(e.category).icon} ${FM.esc(e.experiment_title)}</span><span class="muted small">${FM.fmtDate(e.completed_date)} · ${FM.stars(e.rating)}</span></li>`).join('')
      : '<li class="empty">Nothing yet. <a href="/discover?surprise=1">Run your first experiment</a>.</li>';
  }
  function renderGoal(entries) {
    const box = FM.$('#goalBody');
    const goal = FM.Store.goal();
    const done = entries.filter((e) => e.completed_date >= weekStartKey()).length;
    let html = '';
    if (goal) {
      const pct = Math.min(100, Math.round((done / goal.target) * 100));
      html += `<p class="goal-line"><strong>${done}</strong> of ${goal.target} experiments this week</p><div class="prog-bar big" role="progressbar" aria-valuemin="0" aria-valuemax="${goal.target}" aria-valuenow="${Math.min(done, goal.target)}" aria-label="Weekly goal progress"><i style="width:${pct}%"></i></div><p class="muted small">${done >= goal.target ? 'Goal reached. Nice work.' : 'The week starts on Monday.'}</p>`;
    } else {
      html += '<p class="muted">Set a weekly goal, like three experiments, and watch it fill up.</p>';
    }
    html += `<form id="goalForm" class="inline-form"><label for="goalN" class="sr">Experiments per week</label><input id="goalN" type="number" min="1" max="50" value="${goal ? goal.target : 3}"><button class="btn btn-primary btn-small" type="submit">${goal ? 'Update goal' : 'Set goal'}</button></form>`;
    box.innerHTML = html;
    FM.$('#goalForm').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const n = parseInt(FM.$('#goalN').value, 10);
      if (!(n >= 1 && n <= 50)) { FM.toast('Choose a goal between 1 and 50.'); return; }
      FM.Store.setGoal({ target: n });
      renderGoal(FM.Store.entries());
      FM.toast('Goal saved: ' + n + ' per week.');
    });
  }
})();
