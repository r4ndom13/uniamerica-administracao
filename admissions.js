// Show official guidance for the chosen route and personalize the contact link.
(() => {
  const section = document.querySelector('#ingresso');
  if (!section) return;
  const options = section.querySelector('.entry-options');
  const inputs = [...options.querySelectorAll('input[name="admission-route"]')];
  const panels = [...section.querySelectorAll('.entry-panel')];
  const status = section.querySelector('#entry-status');
  const chosen = document.querySelector('#chosen-route');
  const contact = document.querySelector('#chosen-contact');
  const names = { enem: 'ENEM', vestibular: 'Vestibular', transferencia: 'Transferência' };
  const storageKey = 'ua-admission-route';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let saved;
  try { saved = sessionStorage.getItem(storageKey); } catch {}
  if (!Object.hasOwn(names, saved)) saved = null;
  function select(value, { persist = false, animate = false, personalize = false } = {}) {
    if (!Object.hasOwn(names, value)) return;
    for (const input of inputs) {
      input.checked = input.value === value;
      input.closest('.entry-option').classList.toggle('is-selected', input.checked);
    }
    for (const panel of panels) panel.hidden = panel.dataset.route !== value;
    const active = panels.find(panel => panel.dataset.route === value);
    if (animate && !reduced.matches && active.animate) {
      active.getAnimations().forEach(animation => animation.cancel());
      active.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    if (persist) {
      try { sessionStorage.setItem(storageKey, value); } catch {}
      status.textContent = `${names[value]} selecionado. Orientações e contato atualizados.`;
    }
    if (personalize) {
      if (chosen) chosen.textContent = `SEU CAMINHO: ${names[value].toLocaleUpperCase('pt-BR')}`;
      if (contact) {
        contact.href = active.querySelector('.entry-cta').href;
        contact.textContent = `Tire dúvidas sobre ${names[value]} ↗`;
      }
    }
  }
  let lastIntent = null;
  function choose(event) {
    const input = event.target;
    if (!input.matches('input[name="admission-route"]') || input.value === lastIntent) return;
    lastIntent = input.value;
    select(input.value, { persist: true, animate: true, personalize: true });
  }
  // A click on the initially checked option is still an explicit choice.
  options.addEventListener('click', choose);
  options.addEventListener('change', choose);
  select(saved || 'enem', { personalize: !!saved });
  options.hidden = false;
})();
