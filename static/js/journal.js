/* The 5-Minute Experiment - journal page. DARINGMATES */
(function () {
  'use strict';
  const root = document.getElementById('entries');
  if (!root) return;
  const FM = window.FM;
  const catSel = FM.$('#jcat');
  catSel.innerHTML = '<option value="">All categories</option>' + window.CATS.map((c) => `<option value="${c.id}">${c.icon} ${FM.esc(c.name)}</option>`).join('');
  const AGAIN = { yes: 'Would try again', maybe: 'Might try again', no: 'Would not try again' };
  const TAGS = { 'very-interesting': 'Very interesting', enjoyable: 'Enjoyable', challenging: 'Challenging', boring: 'Boring', difficult: 'Difficult to understand' };

  function renderSummary(entries) {
    const s = FM.stats(entries);
    FM.$('#jTotal').textContent = s.total;
    FM.$('#jAvg').textContent = s.total ? s.avg.toFixed(1) + ' / 5' : '–';
    FM.$('#jTime').textContent = FM.fmtTime(s.secs);
    FM.$('#jStreak').textContent = s.streak + (s.streak === 1 ? ' day' : ' days');
    FM.$('#jFavs').textContent = FM.Store.favs().length;
    FM.$('#jCat').innerHTML = FM.catProgressHTML(s.per, s.total);
    renderHeat(entries);
  }
  function renderHeat(entries) {
    const counts = {};
    entries.forEach((e) => { counts[e.completed_date] = (counts[e.completed_date] || 0) + 1; });
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - today.getDay() - 11 * 7); // Sunday 11 weeks ago
    let html = '';
    for (let i = 0; i < 12 * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      if (d > today) { html += '<i class="h-empty"></i>'; continue; }
      const k = FM.dateKey(d), n = counts[k] || 0;
      html += `<i class="h${Math.min(n, 3)}" title="${FM.fmtDate(k)}: ${n} experiment${n === 1 ? '' : 's'}"></i>`;
    }
    FM.$('#heat').innerHTML = html;
  }
  function renderEntries() {
    let list = FM.Store.entries();
    const q = FM.$('#jq').value.trim().toLowerCase(), cat = catSel.value, rate = parseInt(FM.$('#jrate').value, 10), sort = FM.$('#jsort').value;
    list = list.filter((e) => {
      if (cat && e.category !== cat) return false;
      if (rate > 0 && e.rating < rate) return false;
      if (rate < 0 && e.rating > -rate) return false;
      if (q && ![e.experiment_title, e.experience, e.surprise, e.learned, e.feeling].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
    list.sort(sort === 'old' ? (a, b) => FM.byNewest(b, a) : sort === 'rate' ? (a, b) => b.rating - a.rating || FM.byNewest(a, b) : FM.byNewest);
    const total = FM.Store.entries().length;
    FM.$('#jCount').textContent = total ? `Showing ${list.length} of ${total} entries` : '';
    if (!list.length) {
      root.innerHTML = total
        ? '<p class="empty">No entries match those filters.</p>'
        : '<div class="empty big">Your journal is empty. <a href="/discover?surprise=1">Run your first experiment</a> and write a reflection to fill it.</div>';
      return;
    }
    root.innerHTML = list.map((e) => {
      const c = FM.cat(e.category);
      const part = (label, v) => (v ? `<p><strong>${label}</strong> ${FM.esc(v)}</p>` : '');
      return `<article class="entry" style="--accent:${c.color}">
        <header><div><span class="chip cat">${c.icon} ${FM.esc(c.name)}</span><h3>${FM.esc(e.experiment_title)}</h3></div>
        <button type="button" class="btn btn-ghost btn-small danger" data-del="${FM.esc(e.uid)}" aria-label="Delete entry ${FM.esc(e.experiment_title)}">Delete</button></header>
        <p class="muted small">${FM.fmtDate(e.completed_date)} · ${FM.fmtTime(e.duration_seconds)} · <span class="stars-static" aria-label="${e.rating} out of 5 stars">${FM.stars(e.rating)}</span></p>
        ${part('What I experienced:', e.experience)}${part('What surprised me:', e.surprise)}${part('What I learned:', e.learned)}${part('How I felt:', e.feeling)}${part('Suggestion:', e.suggestion)}
        <div class="meta">${(e.tags || []).map((t) => `<span class="chip">${FM.esc(TAGS[t] || t)}</span>`).join('')}${e.again ? `<span class="chip">${AGAIN[e.again]}</span>` : ''}<a class="chip" href="/experiment/${FM.esc(e.experiment_id)}">Try again</a></div>
      </article>`;
    }).join('');
  }
  function renderAll() { renderSummary(FM.Store.entries()); renderEntries(); FM.renderFavs(); }

  root.addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-del]');
    if (!b) return;
    if (!confirm('Delete this journal entry? This cannot be undone.')) return;
    const uid = b.dataset.del;
    FM.Store.deleteEntry(uid);
    if (await FM.remoteDelete(uid)) {
      const left = JSON.parse(localStorage.getItem('fm_deleted') || '[]').filter((x) => x !== uid);
      localStorage.setItem('fm_deleted', JSON.stringify(left));
    }
    renderAll();
    FM.toast('Entry deleted.');
  });
  ['jq', 'jcat', 'jrate', 'jsort'].forEach((id) => {
    FM.$('#' + id).addEventListener(id === 'jq' ? 'input' : 'change', renderEntries);
  });
  document.addEventListener('fm:favs', () => { FM.$('#jFavs').textContent = FM.Store.favs().length; FM.renderFavs(); });

  renderAll();
  FM.ready.then(() => {
    renderAll();
    FM.$('#jSync').textContent = FM.online
      ? 'Saved in this browser and in the server database.'
      : 'The server database is not reachable, so entries are saved in this browser only.';
  });
})();
