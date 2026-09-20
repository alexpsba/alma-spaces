(() => {
  const planner = document.querySelector('#planner');
  const steps = [...document.querySelectorAll('.planner-step')];
  const progress = document.querySelector('#progressBar');
  const counter = document.querySelector('#stepCounter');
  const back = document.querySelector('#plannerBack');
  const goalInput = document.querySelector('#goalInput');
  const briefCard = document.querySelector('#briefCard');
  const state = { room: '', goal: '', stage: '', priorities: [] };
  let current = 0;

  function render() {
    steps.forEach((step, i) => step.classList.toggle('active', i === current));
    progress.style.width = ((current + 1) / steps.length * 100) + '%';
    counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0');
    back.style.visibility = current === 0 ? 'hidden' : 'visible';
    if (current === 4) renderBrief();
  }

  function openPlanner() {
    planner.classList.add('open');
    planner.setAttribute('aria-hidden', 'false');
    document.body.classList.add('planner-open');
    setTimeout(() => planner.querySelector('button,textarea,input')?.focus(), 50);
  }

  function closePlanner() {
    planner.classList.remove('open');
    planner.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('planner-open');
  }

  function next() {
    if (current === 1) state.goal = goalInput.value.trim();
    if (current < steps.length - 1) current++;
    render();
  }

  function renderBrief() {
    const priorities = state.priorities.length ? state.priorities.join(', ') : 'To be defined together';
    const goal = state.goal || 'Clarify how the space should work and feel before decisions are made.';
    briefCard.innerHTML = `
      <small>FIRST PROJECT DIRECTION</small>
      <strong>${state.room || 'Your space'} — organize the project around the way you want to live.</strong>
      <dl>
        <dt>Space</dt><dd>${state.room || 'Not specified'}</dd>
        <dt>Goal</dt><dd>${goal}</dd>
        <dt>Stage</dt><dd>${state.stage || 'Not specified'}</dd>
        <dt>Priorities</dt><dd>${priorities}</dd>
      </dl>
    `;
  }

  document.querySelectorAll('[data-open-planner]').forEach(el => el.addEventListener('click', openPlanner));
  document.querySelectorAll('[data-close-planner]').forEach(el => el.addEventListener('click', closePlanner));

  document.querySelectorAll('.planner-step[data-step="0"] [data-value]').forEach(btn => {
    btn.addEventListener('click', () => { state.room = btn.dataset.value; next(); });
  });

  document.querySelectorAll('.planner-step[data-step="2"] [data-value]').forEach(btn => {
    btn.addEventListener('click', () => { state.stage = btn.dataset.value; next(); });
  });

  document.querySelectorAll('[data-multi]').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.multi;
      btn.classList.toggle('selected');
      state.priorities = btn.classList.contains('selected')
        ? [...new Set([...state.priorities, value])]
        : state.priorities.filter(x => x !== value);
    });
  });

  document.querySelectorAll('.planner-next').forEach(btn => {
    if (btn.id !== 'saveBrief') btn.addEventListener('click', next);
  });

  back.addEventListener('click', () => { if (current > 0) current--; render(); });

  document.querySelector('#saveBrief').addEventListener('click', () => {
    const saved = {
      ...state,
      name: document.querySelector('#nameInput').value.trim(),
      contact: document.querySelector('#contactInput').value.trim(),
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('alma-project-brief', JSON.stringify(saved));
    document.querySelector('#saveBrief').textContent = 'Brief saved ✓';
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && planner.classList.contains('open')) closePlanner(); });

  render();
})();
