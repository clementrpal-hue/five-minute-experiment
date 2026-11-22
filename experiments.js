/* The 5-Minute Experiment - experiment data, generator, wheel. DARINGMATES */
window.CATS = [
  { id: 'observation', name: 'Observation Lab', icon: '🔍', color: '#2DD4BF', blurb: 'Notice what you normally walk straight past.' },
  { id: 'creativity', name: 'Creativity Studio', icon: '🎨', color: '#F472B6', blurb: 'Make something with whatever is within reach.' },
  { id: 'memory', name: 'Memory Arena', icon: '🧠', color: '#FBBF24', blurb: 'Stretch how much your mind can hold and recall.' },
  { id: 'social', name: 'Social Sparks', icon: '💬', color: '#FB7185', blurb: 'Small, kind moves that connect you to people.' },
  { id: 'productivity', name: 'Productivity Reset', icon: '⚡', color: '#60A5FA', blurb: 'Clear the clutter and get one thing moving.' },
  { id: 'mindful', name: 'Mindful Moments', icon: '🌿', color: '#34D399', blurb: 'Slow down and feel what is happening right now.' },
  { id: 'logic', name: 'Logic Challenges', icon: '🧩', color: '#A78BFA', blurb: 'Puzzles and reasoning that sharpen your thinking.' },
  { id: 'imagination', name: 'Imagination Zone', icon: '🚀', color: '#F97316', blurb: 'Invent worlds, stories and strange possibilities.' },
];

(function () {
  // x(id, category, title, minutes, difficulty, short, "step|step|step", "material|material", outcome, reflection, safety)
  const x = (n, category, title, duration, difficulty, short, steps, mats, outcome, reflection, safety) => ({
    id: 'EXP-' + String(n).padStart(3, '0'), category, title, duration, difficulty, short,
    steps: steps.split('|'), materials: mats ? mats.split('|') : [], outcome, reflection, safety: safety || '',
  });
  window.EXPERIMENTS = [
    // Observation Lab
    x(1, 'observation', 'The Colour Hunt', 5, 'Easy', 'Pick one colour and find 15 things that carry it.', 'Choose a colour at random.|Set a timer and find 15 objects in that colour without leaving the room.|Write each one down. Include the smallest you can spot.', 'Pen|Paper', 'You will notice details that were invisible a minute ago.', 'Which object surprised you most, and why had you never noticed it?'),
    x(2, 'observation', 'Sound Map', 5, 'Easy', 'Close your eyes and sort every sound into near, middle and far.', 'Sit still and close your eyes for two minutes.|Mentally place each sound you hear: near, middle or far.|Open your eyes and sketch a map of where each sound came from.', 'Pen|Paper', 'A layered picture of your surroundings that you normally filter out.', 'Which sound had been there all along without you hearing it?'),
    x(3, 'observation', 'Ten Things Changed', 5, 'Medium', 'Study a spot you see daily and find ten details you never registered.', 'Pick a spot you pass every day, like a doorway or desk.|Look closely for five minutes.|List ten details you cannot remember seeing before.', 'Pen|Paper', 'Proof that familiarity hides things in plain sight.', 'What else in your day might you be looking at without seeing?'),
    x(4, 'observation', 'Shape Safari', 2, 'Easy', 'Hunt for six circles, five triangles and four rectangles.', 'Look around you for six circles.|Then find five triangles and four rectangles.|Count only shapes that are not obvious, like the circle inside a screw head.', '', 'A quick shift from looking at things to looking at their structure.', 'Which shape was hardest to find?'),
    x(5, 'observation', 'Facts Only People-Watch', 10, 'Medium', 'Write only what you can see, with no guesses about anyone.', 'Sit somewhere public, like a bench, canteen or station.|Write down only observable facts: what is carried, worn or done.|Each time you catch yourself guessing a story, cross it out.', 'Pen|Paper', 'You will see how fast your mind adds stories to simple facts.', 'How many guesses did you catch yourself making?', 'Be discreet. Do not stare, photograph or follow anyone.'),
    x(6, 'observation', 'Shadow Clock', 10, 'Challenging', 'Measure how a shadow moves in ten minutes.', 'Stand a small object in direct sunlight and mark the tip of its shadow.|Mark the tip again at five and ten minutes.|Measure the distance between marks and note the direction.', 'Small object|Chalk or tape|Ruler|Sunny day', 'Visible evidence of the Earth turning, from your own measurements.', 'How far did the shadow move, and did you expect more or less?', 'Never look directly at the sun.'),
    // Creativity Studio
    x(7, 'creativity', 'One-Line Portrait', 5, 'Easy', 'Draw an object without lifting your pen.', 'Choose an object near you.|Draw it in one continuous line without lifting the pen.|Do it three times, getting looser each time.', 'Pen|Paper', 'Three wobbly but lively drawings and less fear of imperfect art.', 'Which attempt looked most alive, and was it the most accurate?'),
    x(8, 'creativity', 'Rewrite the Ending', 5, 'Medium', 'Give a film or book you know a completely different ending.', 'Pick a story whose ending you remember well.|Decide what single change would alter everything.|Write the new ending in six sentences.', 'Pen|Paper', 'A short alternate ending and a feel for how stories pivot.', 'What did the original ending protect that yours gave up?'),
    x(9, 'creativity', 'Object Mashup', 5, 'Medium', 'Combine two random objects into an invention.', 'Pick two unrelated objects near you.|Invent a product that merges their features.|Name it and write a one-line slogan.', 'Pen|Paper', 'An absurd, possibly brilliant invention.', 'Would anyone actually buy it? What problem does it solve?'),
    x(10, 'creativity', 'Six-Word Day', 2, 'Easy', 'Sum up today in exactly six words, three ways.', 'Think of today so far.|Write a six-word story of it.|Rewrite it twice more with a different mood each time.', 'Pen|Paper', 'Three tiny stories showing how framing changes a day.', 'Which version felt most true?'),
    x(11, 'creativity', 'Draw the Music', 10, 'Medium', 'Turn an instrumental track into abstract drawing.', 'Play an instrumental piece you have not heard much.|Draw how it sounds using only lines, shapes and colour, nothing realistic.|Change your marks whenever the music changes.', 'Paper|Pens or pencils|Music|Headphones', 'A drawing that records a piece of music as movement.', 'What did a loud moment look like compared with a quiet one?'),
    x(12, 'creativity', 'Blackout Poem', 10, 'Challenging', 'Find a poem hidden inside a printed page.', 'Take a page you are happy to mark, like old newspaper or a flyer.|Circle words that make a poem when read in order.|Black out everything else with a marker.', 'Printed page|Marker|Pencil', 'A found poem and a new way to read ordinary text.', 'What tone did the leftover words give the poem?', 'Use paper you own. Do not mark library or borrowed books.'),
    // Memory Arena
    x(13, 'memory', 'Tray Recall', 5, 'Easy', 'Study ten objects for a minute, then list them from memory.', 'Place ten different objects on a table.|Study them for 60 seconds, then cover them.|Write down as many as you remember, then check.', '10 small objects|Cloth|Pen|Paper', 'A baseline score for your short-term recall.', 'Did you remember by position, category or story?'),
    x(14, 'memory', 'Mini Memory Palace', 10, 'Challenging', 'Memorise ten words by placing them along a route at home.', 'Choose a route with ten stops, like door, shoe rack, sofa.|Place a vivid, odd image of each word at each stop.|Walk the route in your head and recall the words in order.', 'Pen|Paper', 'Ten words recalled in order using a technique used by memory athletes.', 'Which images stuck best, and what made them memorable?'),
    x(15, 'memory', 'Yesterday Rewind', 5, 'Medium', 'Replay yesterday backwards, hour by hour.', 'Start from last night and move back to the morning.|Write one concrete detail per hour: a sound, a face, a taste.|Mark where your memory goes blank.', 'Pen|Paper', 'A detailed timeline and a look at how memory fades.', 'Where did your day turn into a blur, and why?'),
    x(16, 'memory', 'Number Stories', 5, 'Medium', 'Memorise a 12-digit number by turning chunks into stories.', 'Write a random 12-digit number.|Split it into four groups of three.|Give each group a tiny image or story, then recite the number after two minutes.', 'Pen|Paper', 'A long number held in mind through meaning instead of repetition.', 'Was it easier to remember the stories or the digits?'),
    x(17, 'memory', 'Route From Memory', 10, 'Medium', 'Draw the route from home to a place you visit often.', 'Pick a familiar place.|Draw the route with every landmark you can recall.|Check a real map or photo and mark what you got wrong.', 'Pen|Paper|Map', 'A personal map with an honest score of your spatial memory.', 'Which landmark did you forget that you pass every time?'),
    x(18, 'memory', 'Classmate Roll Call', 5, 'Easy', 'List fifteen classmates from a class you took years ago.', 'Pick a class from at least three years ago.|Write every name you can recall.|Add one memory beside each name.', 'Pen|Paper', 'A surprising stream of linked memories.', 'Which memory came back that you had not thought about in years?'),
    // Social Sparks
    x(19, 'social', 'The Specific Compliment', 2, 'Easy', 'Give a compliment that names exactly what you noticed.', 'Think of someone around you today.|Notice one specific thing they did well or chose well.|Tell them exactly what it was and why it mattered.', '', 'A warm moment for them and a habit of noticing good things.', 'How did they react, and how did you feel afterwards?'),
    x(20, 'social', 'The Better Question', 5, 'Medium', 'Ask someone what they have changed their mind about.', 'Pick a friend or family member.|Ask: What is something you changed your mind about recently?|Listen without interrupting or correcting.', '', 'A deeper conversation than the usual how-are-you.', 'What did you learn about them that you did not know?'),
    x(21, 'social', 'Stranger Small Talk', 5, 'Challenging', 'Start one friendly exchange with someone you do not know.', 'Choose a public, comfortable setting like a shop or queue.|Greet someone and ask a light question, such as a recommendation.|If they are not interested, thank them and move on kindly.', '', 'A tiny stretch of your social comfort zone.', 'What did you fear would happen, and what really happened?', 'Stay in public places and respect it if someone does not want to talk.'),
    x(22, 'social', 'Thank-You Note', 10, 'Easy', 'Write a real thank-you to someone who helped you.', 'Think of someone who helped you in the past year.|Write what they did and what difference it made.|Send it by message or in person.', 'Phone or paper', 'A message that may make someone’s week.', 'Why had you not said it before?'),
    x(23, 'social', 'Listening Only', 5, 'Medium', 'Talk to someone and only ask follow-up questions.', 'Start a conversation with a friend or relative.|For five minutes, speak only to ask follow-up questions.|Do not bring up your own stories.', '', 'The other person feels heard and you learn more than usual.', 'How hard was it to hold back your own stories?'),
    x(24, 'social', 'Teach in Five', 5, 'Medium', 'Teach someone one skill you already have.', 'Choose something small you can do well, like a knot or a shortcut.|Explain it in plain words and let them try.|Ask them to explain it back.', '', 'A skill passed on and a check of how well you know it.', 'Where did your explanation fall short?'),
    // Productivity Reset
    x(25, 'productivity', 'Desk Reset', 5, 'Easy', 'Clear your workspace down to three items.', 'Remove everything from your desk surface.|Put back only the three things you need most.|Wipe the surface and sort the rest into keep, bin and elsewhere.', 'Cloth', 'A clear surface and a calmer start to work.', 'What did you put back that you did not actually need?'),
    x(26, 'productivity', 'Brain Dump Sort', 10, 'Medium', 'Empty your head onto paper and choose the one task that matters.', 'Write every task and worry in your head, without sorting.|Group them: do now, schedule, delegate, drop.|Circle the one task that makes the others easier.', 'Pen|Paper', 'A clear list and one next action.', 'How many items did you drop once you saw them written down?'),
    x(27, 'productivity', 'Two-Minute Sweep', 2, 'Easy', 'Do every task that takes under two minutes.', 'List small jobs waiting for you.|Pick those that take under two minutes.|Do as many as you can before the time ends.', '', 'A handful of nagging jobs gone.', 'Why had these tiny jobs been waiting so long?'),
    x(28, 'productivity', 'Digital Declutter', 5, 'Easy', 'Delete 20 files or unsubscribe from 5 senders.', 'Open your photos, downloads or inbox.|Delete 20 useless items or unsubscribe from five senders.|Count the total at the end.', 'Phone or computer', 'A lighter digital space.', 'What did you keep only out of habit?'),
    x(29, 'productivity', 'Friction Audit', 10, 'Challenging', 'Find five small annoyances in your routine and fix one.', 'Walk through your usual morning or study routine in your head.|Write five small points of friction.|Choose one and remove it now, for example by moving a charger.', 'Pen|Paper', 'One permanent improvement to your day.', 'Which friction had you simply accepted?'),
    x(30, 'productivity', 'Phone-Away Sprint', 5, 'Medium', 'Work on one task with your phone in another room.', 'Pick one task and put your phone out of sight.|Work on it for five minutes.|Tally every time you feel the urge to check the phone.', 'Pen|Paper', 'A count of your distraction urges and a bit of focused progress.', 'How many urges did you count, and what triggered them?'),
    // Mindful Moments
    x(31, 'mindful', 'Five Senses Check-In', 5, 'Easy', 'Name what you see, feel, hear, smell and taste.', 'Name five things you can see.|Name four you can touch, three you can hear, two you can smell.|Name one you can taste.', '', 'A calmer, more present feeling.', 'Which sense did you use least in a normal day?'),
    x(32, 'mindful', 'Slow Sip', 5, 'Easy', 'Drink a glass of water or tea with total attention.', 'Hold the cup and notice its weight and temperature.|Take small sips and follow each one down.|Notice taste, warmth and sounds until the cup is empty.', 'A drink', 'A small moment of calm attention.', 'What did you notice about the drink that you usually miss?', 'Let hot drinks cool first.'),
    x(33, 'mindful', 'Indoor Slow Walk', 10, 'Medium', 'Walk very slowly and feel each step.', 'Choose a clear path of about ten steps.|Walk it at a quarter of normal speed, feeling each foot lift and land.|Turn at the end and repeat.', 'Clear floor space', 'A steadier body and a quieter mind.', 'What did you notice about your balance?', 'Clear the path of obstacles and stop if you feel dizzy.'),
    x(34, 'mindful', 'Body Scan Lite', 5, 'Medium', 'Move your attention from toes to head.', 'Sit or lie comfortably and close your eyes.|Move attention slowly from toes to the top of your head.|Note tension without trying to change it.', 'Quiet spot', 'Awareness of where you carry tension.', 'Where did you find the most tension?', 'Stop if anything feels uncomfortable.'),
    x(35, 'mindful', 'Specific Gratitude', 2, 'Easy', 'Name three specific good things from the past day.', 'Think back over the past 24 hours.|Write three specific good things, not general ones.|Add one sentence on why each mattered.', 'Pen|Paper', 'A short list that shifts your focus.', 'Which one would you have forgotten if you had not stopped?'),
    x(36, 'mindful', 'Count Ten Breaths', 5, 'Challenging', 'Count breaths to ten and restart whenever your mind wanders.', 'Sit comfortably and breathe naturally.|Count each out-breath from one to ten.|When your mind wanders, start again at one.', 'Quiet spot', 'A clear view of how often your attention drifts.', 'How far did you usually get before drifting?', 'Breathe normally. Do not force or hold your breath.'),
    // Logic Challenges
    x(37, 'logic', 'Pattern Builder', 5, 'Medium', 'Invent a number puzzle for someone else to solve.', 'Choose a hidden rule, like double then subtract one.|Write the first six numbers in the sequence.|Ask a friend to find the rule and the next number.', 'Pen|Paper', 'A puzzle someone else can solve and a feel for designing rules.', 'Was your rule too easy or too obscure?'),
    x(38, 'logic', 'Guess Then Check', 5, 'Easy', 'Estimate something countable, then measure it.', 'Pick something like steps to the door or pages in a book.|Write your estimate.|Count it and work out how far off you were, as a percentage.', 'Pen|Paper', 'A calibration of your intuition.', 'Did you over or underestimate, and by how much?'),
    x(39, 'logic', 'Spot the Flaw', 5, 'Medium', 'Find three ways an advert’s claim could mislead.', 'Pick an advert or slogan with a bold claim.|Ask what is missing: compared to what, measured how, for whom?|Write three possible ways the claim misleads.', 'An advert|Pen|Paper', 'Sharper critical thinking.', 'Was the claim false, or just incomplete?'),
    x(40, 'logic', 'Measure Exactly Four', 10, 'Challenging', 'Measure 4 units using only a 3-unit and a 5-unit container.', 'Imagine a 3-unit jug and a 5-unit jug, with unlimited water.|Work out the pours that leave exactly 4 units.|Write the steps, then check them by drawing each state.', 'Pen|Paper', 'A solved puzzle where each move depends on the last.', 'How did you decide which pour to try first?'),
    x(41, 'logic', 'Why Chain', 10, 'Medium', 'Ask why five times about one small problem.', 'Pick a small recurring problem, like always being late.|Ask why it happens and answer. Ask why again of that answer.|Repeat five times and circle the root cause.', 'Pen|Paper', 'A root cause that is rarely the first excuse.', 'Was the root cause something you can change?'),
    x(42, 'logic', 'Odd One Out, Six Ways', 5, 'Easy', 'Find six different reasons why each item could be the odd one out.', 'Pick four objects from around you.|Find a reason that makes each one the odd one out.|Find at least six different reasons in total.', 'Four objects|Pen|Paper', 'Flexible thinking from seeing one set in many ways.', 'Which reason was the most creative?'),
    // Imagination Zone
    x(43, 'imagination', 'Letter From 2076', 10, 'Medium', 'Write a letter from someone living fifty years from now.', 'Imagine one ordinary person in the year 2076.|Write them writing to you about their normal day.|Include one thing they find old-fashioned about today.', 'Pen|Paper', 'A short piece of speculative fiction.', 'What did you assume would stay the same?'),
    x(44, 'imagination', 'Invent a Holiday', 5, 'Easy', 'Create a holiday and its traditions.', 'Name the holiday and what it celebrates.|Invent three traditions, one food and one greeting.|Pick a date and explain why.', 'Pen|Paper', 'A whole tiny culture on one page.', 'Would you actually celebrate it?'),
    x(45, 'imagination', 'Life of a Pen', 5, 'Easy', 'Write a day in the life of an ordinary object.', 'Pick an object near you.|Imagine its day from its point of view.|Write it in ten sentences.', 'Pen|Paper', 'A fresh view on the stuff you use every day.', 'What did the object think of you?'),
    x(46, 'imagination', 'Explain It to an Alien', 5, 'Medium', 'Describe an everyday thing to someone who has never seen it.', 'Choose an item like an umbrella or a staircase.|Explain what it is and why humans need it, without using its name.|Give it to a friend to guess.', 'Pen|Paper', 'A clear description from first principles.', 'What assumptions did you have to drop?'),
    x(47, 'imagination', 'Build a World', 10, 'Challenging', 'Invent a world with three rules and a problem.', 'Choose three rules that make your world different from ours.|Name one city and draw a quick map.|Invent one problem the people of that city face.', 'Pen|Paper', 'A seed for a story or game.', 'Which rule created the most interesting problems?'),
    x(48, 'imagination', 'What the Room Thinks', 2, 'Easy', 'Imagine what your room would say about you.', 'Look around the room as if you were the room.|Write three sentences about the person who lives here.|Add one thing the room would like to change.', 'Pen|Paper', 'A funny and honest look at your habits.', 'Was anything it said true?'),
  ];

  const byId = {};
  window.EXPERIMENTS.forEach((e) => { byId[e.id] = e; });
  const FM = window.FM;
  FM.byId = (id) => byId[id] || null;
  FM.cat = (id) => window.CATS.find((c) => c.id === id) || window.CATS[0];

  FM.daily = () => {
    let h = 0;
    FM.dateKey().split('').forEach((ch) => { h = (h * 31 + ch.charCodeAt(0)) >>> 0; });
    return window.EXPERIMENTS[h % window.EXPERIMENTS.length];
  };
  FM.filter = (f = {}) => {
    const q = (f.q || '').toLowerCase();
    return window.EXPERIMENTS.filter((e) => {
      if (f.cat && e.category !== f.cat) return false;
      if (f.diff && e.difficulty !== f.diff) return false;
      if (f.dur && e.duration !== +f.dur) return false;
      if (q && !(e.title + ' ' + e.short + ' ' + e.steps.join(' ') + ' ' + FM.cat(e.category).name).toLowerCase().includes(q)) return false;
      return true;
    });
  };
  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
  FM.pick = (f, excludeId) => {
    let pool = FM.filter(f);
    if (pool.length > 1) pool = pool.filter((e) => e.id !== excludeId);
    return pool.length ? rnd(pool) : null;
  };
  FM.breaker = (f, excludeId) => {
    const last = FM.Store.entries().slice().sort(FM.byNewest)[0];
    const avoid = last ? last.category : null;
    let pool = FM.filter({ diff: f.diff, dur: f.dur }).filter((e) => e.category !== avoid && e.id !== excludeId);
    if (!pool.length) pool = window.EXPERIMENTS.filter((e) => e.category !== avoid && e.id !== excludeId);
    return { exp: rnd(pool), avoided: avoid };
  };
  FM.card = (e) => {
    const c = FM.cat(e.category), on = FM.Store.isFav(e.id);
    return `<article class="xcard" style="--accent:${c.color}"><div class="xc-top"><span class="chip cat">${c.icon} ${FM.esc(c.name)}</span><button type="button" class="fav" data-fav="${e.id}" aria-pressed="${on}" aria-label="Save ${FM.esc(e.title)} to favourites">${on ? '★' : '☆'}</button></div><h3>${FM.esc(e.title)}</h3><p>${FM.esc(e.short)}</p><div class="meta"><span class="chip">${e.duration} min</span><span class="chip">${e.difficulty}</span></div><a class="btn btn-primary btn-small" href="/experiment/${e.id}">Start</a></article>`;
  };
  FM.renderFavs = () => {
    const box = FM.$('#favList');
    if (!box) return;
    const list = FM.Store.favs().map(FM.byId).filter(Boolean);
    box.innerHTML = list.length ? list.map(FM.card).join('') : '<p class="empty">No saved experiments yet. Tap ☆ on any experiment to keep it here.</p>';
  };

  /* ---------- discover page ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (!FM.$('#generator')) return;
    const sel = FM.$('#fCat');
    sel.innerHTML = '<option value="">Any category</option>' + window.CATS.map((c) => `<option value="${c.id}">${c.icon} ${FM.esc(c.name)}</option>`).join('');
    const params = new URLSearchParams(location.search);
    if (window.CATS.some((c) => c.id === params.get('cat'))) sel.value = params.get('cat');

    let current = null, revealed = true;
    const filters = () => ({ cat: sel.value, diff: FM.$('#fDiff').value, dur: FM.$('#fDur').value, q: FM.$('#fQ').value.trim() });

    function renderResult() {
      const box = FM.$('#result');
      if (!current) { box.innerHTML = ''; return; }
      if (!revealed) {
        box.innerHTML = `<article class="result mystery" style="--accent:#8257F5"><div class="orb" aria-hidden="true">?</div><h2>Ready to leave your comfort zone?</h2><p>Your experiment takes ${current.duration} minutes and is rated ${current.difficulty}. Its title and category stay hidden until you reveal it.</p><div class="cta-row"><button type="button" class="btn btn-primary btn-lg" id="reveal">REVEAL MY EXPERIMENT</button><button type="button" class="btn btn-ghost" id="skip">Skip</button></div></article>`;
        FM.$('#reveal').addEventListener('click', () => { revealed = true; renderResult(); });
      } else {
        const c = FM.cat(current.category), on = FM.Store.isFav(current.id);
        box.innerHTML = `<article class="result" style="--accent:${c.color}"><span class="chip cat">${c.icon} ${FM.esc(c.name)}</span><h2>${FM.esc(current.title)}</h2><p class="lead">${FM.esc(current.short)}</p><div class="meta"><span class="chip">${current.duration} min</span><span class="chip">${current.difficulty}</span>${current.materials.length ? `<span class="chip">You need: ${FM.esc(current.materials.join(', '))}</span>` : '<span class="chip">No materials</span>'}</div><p><strong>Expected outcome:</strong> ${FM.esc(current.outcome)}</p><div class="cta-row"><a class="btn btn-primary btn-lg" href="/experiment/${current.id}">Start this experiment</a><button type="button" class="btn btn-ghost" data-fav="${current.id}" data-long="1" aria-pressed="${on}">${on ? '★ Saved' : '☆ Save for later'}</button><button type="button" class="btn btn-ghost" id="skip">Skip and show another</button></div></article>`;
      }
      FM.$('#skip').addEventListener('click', () => generate(false));
    }
    function show(exp) {
      current = exp;
      revealed = !FM.$('#mystery').checked;
      renderResult();
      FM.$('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function generate(breaker) {
      const f = filters();
      if (breaker) {
        const r = FM.breaker(f, current && current.id);
        if (r.avoided) FM.toast('Skipping ' + FM.cat(r.avoided).name + ', your most recent category.');
        show(r.exp);
        return;
      }
      let exp = FM.pick(f, current && current.id);
      if (!exp) {
        exp = FM.pick({}, current && current.id);
        FM.toast('Nothing matched every filter, so here is a surprise from the full collection.');
      }
      show(exp);
    }
    FM.$('#surprise').addEventListener('click', () => generate(false));
    FM.$('#breaker').addEventListener('click', () => generate(true));
    FM.$('#mystery').addEventListener('change', () => { if (current) { revealed = !FM.$('#mystery').checked; renderResult(); } });

    function renderBrowse() {
      const list = FM.filter(filters());
      FM.$('#browse').innerHTML = list.length ? list.map(FM.card).join('') : '<p class="empty">No experiments match. Try a different keyword or clear a filter.</p>';
      FM.$('#browseCount').textContent = list.length + ' of ' + window.EXPERIMENTS.length + ' experiments';
    }
    ['fCat', 'fDiff', 'fDur'].forEach((id) => FM.$('#' + id).addEventListener('change', renderBrowse));
    FM.$('#fQ').addEventListener('input', renderBrowse);
    renderBrowse();
    FM.renderFavs();
    document.addEventListener('fm:favs', FM.renderFavs);
    FM.renderCatGrid();

    /* daily */
    const d = FM.daily(), dc = FM.cat(d.category), box = FM.$('#daily');
    box.style.setProperty('--accent', dc.color);
    box.innerHTML = `<div class="daily-copy"><span class="chip cat">${dc.icon} ${FM.esc(dc.name)}</span><h3>${FM.esc(d.title)}</h3><p>${FM.esc(d.short)}</p><div class="meta"><span class="chip">${d.duration} min</span><span class="chip">${d.difficulty}</span></div></div><div class="daily-act"><a class="btn btn-primary btn-lg" href="/experiment/${d.id}">Start today's experiment</a><button type="button" class="btn btn-ghost" data-fav="${d.id}" data-long="1" aria-pressed="${FM.Store.isFav(d.id)}">${FM.Store.isFav(d.id) ? '★ Saved' : '☆ Save for later'}</button></div>`;

    /* wheel */
    const cv = FM.$('#wheel'), ctx = cv.getContext('2d'), N = window.CATS.length, A = (Math.PI * 2) / N;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rot = 0, spinning = false;
    function drawWheel() {
      const w = cv.width, c = w / 2, r = c - 6;
      ctx.clearRect(0, 0, w, w);
      window.CATS.forEach((cat, i) => {
        const a0 = rot + i * A;
        ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, r, a0, a0 + A); ctx.closePath();
        ctx.fillStyle = cat.color; ctx.fill();
        ctx.strokeStyle = '#101426'; ctx.lineWidth = 4; ctx.stroke();
        ctx.save(); ctx.translate(c, c); ctx.rotate(a0 + A / 2);
        ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(cat.icon, r * 0.68, 0);
        ctx.restore();
      });
      ctx.beginPath(); ctx.arc(c, c, 36, 0, Math.PI * 2); ctx.fillStyle = '#101426'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = '#8257F5'; ctx.stroke();
    }
    drawWheel();
    FM.$('#spin').addEventListener('click', () => {
      if (spinning) return;
      spinning = true;
      FM.$('#spin').disabled = true;
      FM.$('#wheelMsg').textContent = 'Spinning…';
      const start = rot, total = (5 + Math.random() * 3) * Math.PI * 2 + Math.random() * Math.PI * 2;
      const dur = reduce ? 600 : 4200, t0 = performance.now();
      (function frame(now) {
        const t = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - t, 3);
        rot = start + total * ease;
        drawWheel();
        if (t < 1) { requestAnimationFrame(frame); return; }
        const angle = ((-Math.PI / 2 - rot) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const cat = window.CATS[Math.floor(angle / A) % N];
        spinning = false;
        FM.$('#spin').disabled = false;
        FM.$('#wheelMsg').textContent = 'The wheel chose ' + cat.name + '.';
        const exp = FM.pick({ cat: cat.id }, current && current.id);
        if (exp) show(exp);
      })(t0);
    });

    if (params.get('surprise') === '1') generate(false);
  });
})();
