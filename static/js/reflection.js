/* The 5-Minute Experiment - reflection form and site feedback form. DARINGMATES */
(function () {
  'use strict';
  const FM = window.FM;

  /* ---------- reflection ---------- */
  const rf = document.getElementById('rf');
  if (rf) {
    const exp = FM.byId(rf.dataset.id);
    if (!exp) {
      FM.$('#rfMissing').hidden = false;
    } else {
      FM.$('#rfMain').hidden = false;
      document.title = 'Reflection: ' + exp.title + ' · The 5-Minute Experiment';
      FM.$('#rfSub').textContent = 'You finished “' + exp.title + '”. ' + exp.reflection;
      const t = parseInt(new URLSearchParams(location.search).get('t'), 10);
      const seconds = Number.isFinite(t) ? Math.max(0, Math.min(t, exp.duration * 60)) : 0;
      const form = FM.$('#rfForm'), err = FM.$('#rfError'), btn = FM.$('#rfSubmit');
      let submitted = false;

      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        if (submitted) return;
        const val = (n) => form.elements[n].value.trim();
        const rating = form.querySelector('input[name="rating"]:checked');
        const again = form.querySelector('input[name="again"]:checked');
        if (val('experience').length < 3) { fail('Tell us what you experienced, even in a few words.', form.elements.experience); return; }
        if (!rating) { fail('Choose a star rating from 1 to 5.', FM.$('#r5')); return; }
        err.hidden = true;
        const entry = {
          uid: FM.uid(),
          experiment_id: exp.id,
          experiment_title: exp.title,
          category: exp.category,
          completed_date: FM.dateKey(),
          duration_seconds: seconds,
          experience: val('experience'),
          surprise: val('surprise'),
          learned: val('learned'),
          feeling: val('feeling'),
          rating: parseInt(rating.value, 10),
          tags: Array.from(form.querySelectorAll('input[name="tags"]:checked')).map((i) => i.value),
          again: again ? again.value : '',
          suggestion: val('suggestion'),
          created_at: new Date().toISOString(),
        };
        submitted = true;
        btn.disabled = true;
        btn.textContent = 'Saving…';
        const savedLocal = FM.Store.saveEntry(entry);
        form.hidden = true;
        FM.$('#rfSaveNote').textContent = savedLocal
          ? 'Saved privately in this browser. Your reflection is not uploaded to the server.'
          : 'We could not save this entry. Check that your browser allows local storage.'
        FM.$('#rfThanks').hidden = false;
        FM.$('#rfThanks h2').setAttribute('tabindex', '-1');
        FM.$('#rfThanks h2').focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      function fail(msg, field) {
        err.textContent = msg;
        err.hidden = false;
        if (field) field.focus();
      }
    }
  }

  /* ---------- site feedback ---------- */
  const fb = document.getElementById('fbForm');
  if (fb) {
    const err = FM.$('#fbError'), btn = FM.$('#fbSubmit');
    fb.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const message = fb.elements.message.value.trim();
      if (message.length < 3) { err.textContent = 'Please write a short message.'; err.hidden = false; fb.elements.message.focus(); return; }
      err.hidden = true;
      const rating = fb.querySelector('input[name="rating"]:checked');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      try {
        const r = await fetch('/api/feedback', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fb.elements.name.value.trim(), rating: rating ? parseInt(rating.value, 10) : null, message }),
        });
        if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || 'Server error'); }
        fb.hidden = true;
        FM.$('#fbThanks').hidden = false;
        FM.$('#fbThanks h2').setAttribute('tabindex', '-1');
        FM.$('#fbThanks h2').focus();
      } catch (e) {
        err.textContent = 'We could not send your feedback: ' + (e.message === 'Failed to fetch' ? 'the server is not running.' : e.message) + ' Your text is still here.';
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Send feedback';
      }
    });
  }
})();
