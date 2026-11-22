/* The 5-Minute Experiment - experiment page and countdown timer. DARINGMATES */
(function () {
  'use strict';
  const root = document.getElementById('xp');
  if (!root) return;
  const FM = window.FM;
  const id = root.dataset.id;
  const exp = FM.byId(id);

  if (!exp) {
    root.innerHTML = '<div class="panel"><h1>Experiment not found</h1><p class="muted">That experiment does not exist.</p><a class="btn btn-primary" href="/discover">Find another experiment</a></div>';
    return;
  }

  /* ----- experiment details ----- */
  const cat = FM.cat(exp.category);
  document.title = exp.title + ' · The 5-Minute Experiment';
  root.style.setProperty('--accent', cat.color);
  FM.$('#xpInfo').innerHTML = `
    <span class="chip cat">${cat.icon} ${FM.esc(cat.name)}</span>
    <h1>${FM.esc(exp.title)}</h1>
    <div class="meta"><span class="chip">${exp.duration} min</span><span class="chip">${exp.difficulty}</span><span class="chip">${exp.id}</span></div>
    <p class="lead">${FM.esc(exp.short)}</p>
    <h2 class="h3">Instructions</h2>
    <ol class="steps">${exp.steps.map((s) => `<li>${FM.esc(s)}</li>`).join('')}</ol>
    <h2 class="h3">Materials</h2>
    <p>${exp.materials.length ? FM.esc(exp.materials.join(', ')) : 'Nothing. Just you.'}</p>
    <p><strong>Expected outcome:</strong> ${FM.esc(exp.outcome)}</p>
    ${exp.safety ? `<p class="safety"><strong>Safety:</strong> ${FM.esc(exp.safety)}</p>` : ''}
    <div class="cta-row"><button type="button" class="btn btn-ghost btn-small" data-fav="${exp.id}" data-long="1" aria-pressed="${FM.Store.isFav(exp.id)}">${FM.Store.isFav(exp.id) ? '★ Saved' : '☆ Save for later'}</button><a class="btn btn-ghost btn-small" href="/discover?surprise=1">Skip, show another</a></div>`;

  /* ----- timer ----- */
  const total = exp.duration * 60 * 1000;
  const C = 2 * Math.PI * 90;
  const key = 'fm_timer_' + id;
  const el = { clock: FM.$('#clock'), status: FM.$('#status'), ring: FM.$('#ringFg'), start: FM.$('#bStart'), pause: FM.$('#bPause'), resume: FM.$('#bResume'), reset: FM.$('#bReset'), finish: FM.$('#bFinish'), sound: FM.$('#sound') };
  el.ring.style.strokeDasharray = C;

  let state = 'idle', endAt = 0, remaining = total, tick = null, audio = null;

  function save() { try { sessionStorage.setItem(key, JSON.stringify({ state, endAt, remaining })); } catch (e) { /* ignore */ } }
  function restore() {
    try {
      const s = JSON.parse(sessionStorage.getItem(key));
      if (!s || !['running', 'paused'].includes(s.state)) return;
      state = s.state; endAt = s.endAt; remaining = s.remaining;
      if (state === 'running') remaining = Math.max(0, endAt - Date.now());
    } catch (e) { /* ignore */ }
  }
  function fmt(ms) {
    const s = Math.ceil(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }
  function render() {
    el.clock.textContent = fmt(remaining);
    el.ring.style.strokeDashoffset = C * (1 - remaining / total);
    el.start.hidden = state !== 'idle' && state !== 'done';
    el.pause.hidden = state !== 'running';
    el.resume.hidden = state !== 'paused';
    el.start.disabled = state === 'done';
    el.status.textContent = { idle: 'Ready when you are', running: 'Experiment in progress', paused: 'Paused', done: 'Time is up' }[state];
    document.title = (state === 'running' ? fmt(remaining) + ' · ' : '') + exp.title;
  }
  function loop() { clearInterval(tick); tick = setInterval(update, 250); update(); }
  function update() {
    if (state !== 'running') return;
    remaining = Math.max(0, endAt - Date.now());
    render();
    if (remaining <= 0) complete();
  }
  function ensureAudio() {
    if (!el.sound.checked || audio) return;
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; }
  }
  function beep() {
    if (!el.sound.checked) return;
    ensureAudio();
    if (!audio) return;
    [0, 0.35, 0.7].forEach((delay) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
      const t = audio.currentTime + delay;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.start(t); o.stop(t + 0.3);
    });
  }
  function go(seconds) {
    try { sessionStorage.removeItem(key); } catch (e) { /* ignore */ }
    location.href = '/reflection/' + id + '?t=' + seconds;
  }
  const elapsed = () => Math.round((total - remaining) / 1000);

  function start() { ensureAudio(); endAt = Date.now() + remaining; state = 'running'; save(); loop(); }
  function pause() { update(); if (state !== 'running') return; state = 'paused'; clearInterval(tick); save(); render(); }
  function reset() { clearInterval(tick); state = 'idle'; remaining = total; save(); render(); }
  function complete() {
    clearInterval(tick); state = 'done'; remaining = 0; save(); render(); beep();
    const burst = FM.$('#burst');
    const colors = ['#8257F5', '#25D0B1', '#F472B6', '#FBBF24', '#F7F8FC'];
    burst.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="--x:${(Math.random() * 100).toFixed(0)}%;--d:${(Math.random() * 0.8).toFixed(2)}s;--c:${colors[i % colors.length]}"></i>`).join('');
    const link = FM.$('#doneGo');
    link.href = '/reflection/' + id + '?t=' + Math.round(total / 1000);
    FM.$('#done').hidden = false;
    link.focus();
    setTimeout(() => go(Math.round(total / 1000)), 4000);
  }

  el.start.addEventListener('click', start);
  el.pause.addEventListener('click', pause);
  el.resume.addEventListener('click', start);
  el.reset.addEventListener('click', reset);
  el.finish.addEventListener('click', () => {
    if (state === 'running') update();
    if (state === 'done') return;
    if (state === 'idle' && !confirm('You have not started the timer. Go to your reflection anyway?')) return;
    clearInterval(tick);
    go(elapsed());
  });
  el.sound.addEventListener('change', ensureAudio);

  restore();
  render();
  if (state === 'running') loop();
})();
