// Preserva a origem da campanha no encaminhamento para o site oficial.
const incoming = new URLSearchParams(location.search);
for (const link of document.querySelectorAll('a[href="https://uniamerica.br/graduacao/administracao"]')) {
  const target = new URL(link.href);
  for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    if (incoming.has(name)) target.searchParams.set(name, incoming.get(name));
  }
  link.href = target.href;
}

// Motion Anything: progressive enhancement and one-shot scroll entrances.
const root = document.documentElement;
const preference = matchMedia('(prefers-reduced-motion: reduce)');
// Expand the Motion Anything entrances across each part of the page.
// Reveal children independently instead of moving a whole section as one block.
document.querySelectorAll('.section-heading, .practice-grid > [data-reveal], .practice-copy, .coordinator-copy, .next-grid > [data-reveal]:not(.conversion)').forEach(el => {
  el.removeAttribute('data-reveal');
  el.removeAttribute('data-reveal-delay');
});
const revealGroups = [
  ['.benefits .eyebrow, .benefits h2, .benefits-heading > p, .recognition > .eyebrow, .recognition h2, .recognition .section-lead, .video-heading .eyebrow, .video-heading h2, .video-heading > p', 'up'],
  ['.intro > .eyebrow, .intro > h2, .intro > .section-lead', 'up'],
  ['.practice-grid > div:not(.practice-watermark) > .eyebrow, .practice h2', 'left'],
  ['.practice-copy > .big-copy, .practice-copy > p:not(.big-copy), .practice-item, .practice .text-link', 'up'],
  ['.section-heading .eyebrow, .section-heading h2, .section-heading .section-lead', 'up'],
  ['.subjects details, .learn > .text-link', 'left'],
  ['.course-title, .course-strip dl > div', 'up'],
  ['.coordinator-copy > .eyebrow, .coordinator h2, .name-block, .coordinator-copy > p, .credentials li, .coordinator-contact', 'up'],
  ['.next-grid > div:first-child > .eyebrow, .next h2, .next-grid > div:first-child > p', 'left'],
  ['.faq > .eyebrow, .faq > h2, .faq > details', 'up']
];
revealGroups.forEach(([selector, direction]) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.setAttribute('data-reveal', direction);
    el.setAttribute('data-reveal-delay', String((i % 3) * 60));
  });
});
document.querySelectorAll('.path-card').forEach((el, i) => el.setAttribute('data-reveal', ['left', 'up', 'right'][i]));
document.querySelector('.coordinator-portrait').setAttribute('data-reveal', 'zoom');
document.querySelector('.conversion').setAttribute('data-reveal', 'zoom');
const reveals = document.querySelectorAll('[data-reveal]');
// The imported recipe observes on DOMContentLoaded; plain content stays visible without JS.
root.classList.add('motion-ready');

function applyMotionPreference() {
  const paused = preference.matches;
  root.classList.toggle('motion-paused', paused);
  if (paused) {
    reveals.forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.magnetic').forEach(el => { el.style.transform = ''; });
  }
  updateScrollEffects();
}
preference.addEventListener('change', applyMotionPreference);
applyMotionPreference();

// Keep the seamless strip running continuously.
const ticker = document.querySelector('.ticker');
const tickerTrack = ticker.querySelector('.ticker-track');
const tickerGroups = [...ticker.querySelectorAll('.ticker-set')];
const tickerUnit = tickerGroups[0].querySelector('.ticker-unit').cloneNode(true);
let lastTickerSize = '';
function fillTicker() {
  const unitWidth = tickerGroups[0].querySelector('.ticker-unit').getBoundingClientRect().width;
  if (!unitWidth) return;
  // Each identical half must cover the entire viewport before it is duplicated.
  const repetitions = Math.ceil(ticker.clientWidth / unitWidth) + 1;
  const size = `${unitWidth}:${repetitions}`;
  if (size === lastTickerSize) return;
  lastTickerSize = size;
  tickerGroups.forEach(group => group.replaceChildren(...Array.from({ length: repetitions }, () => tickerUnit.cloneNode(true))));
  // Keep the travel speed stable as the number of repeats changes.
  tickerTrack.style.setProperty('--ticker-duration', `${unitWidth * repetitions / 38}s`);
}
fillTicker();
document.fonts.ready.then(fillTicker);
if ('ResizeObserver' in window) new ResizeObserver(fillTicker).observe(ticker);
else addEventListener('resize', fillTicker);

// Mobile CTA clears the screen when the visitor reaches the conversion panel.
const sticky = document.querySelector('.mobile-sticky');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => sticky.classList.toggle('is-hidden', entries[0].isIntersecting), { threshold: .25 }).observe(document.querySelector('.conversion'));
}

function updateScrollEffects() {
  const paused = preference.matches || root.classList.contains('timeline-capture');
  // One reversible revolution as each ornament crosses the viewport.
  // No time-based spin: stopping the scroll also stops the rotation.
  document.querySelectorAll('.hero-art, .ticker, .learning-seal, .coordinator-portrait, .award').forEach(el => {
    if (paused) { el.style.removeProperty('--scroll-turn'); return; }
    const box = el.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
    el.style.setProperty('--scroll-turn', `${(fraction * 360).toFixed(3)}deg`);
  });
  const photo = document.querySelector('.portrait-frame');
  const seal = document.querySelector('.learning-seal');
  for (const el of [photo, seal]) {
    if (!el) continue;
    if (paused) { el.style.removeProperty('--scroll-shift'); continue; }
    const box = el.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) continue;
    const position = Math.max(-1, Math.min(1, (innerHeight / 2 - box.top - box.height / 2) / (innerHeight / 2 + box.height / 2)));
    el.style.setProperty('--scroll-shift', position.toFixed(4));
  }
}

const progress = document.querySelector('.reading-progress');
let queued = false;
function updateProgress() {
  const max = root.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  updateScrollEffects();
  queued = false;
}
addEventListener('scroll', () => {
  if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

// Freezable animation timeline used by Motion Anything's HTML workflow.
let frozenAnimations = [];
window.__maTimeline = {
  seek(seconds) {
    root.classList.add('timeline-capture');
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
    frozenAnimations = document.getAnimations();
    frozenAnimations.forEach(animation => { animation.pause(); animation.currentTime = Math.max(0, seconds * 1000); });
  },
  play() {
    root.classList.remove('timeline-capture');
    frozenAnimations.forEach(animation => animation.play());
    frozenAnimations = [];
  }
};

// The official course video is loaded only after the visitor requests playback.
document.querySelector('.video-launch')?.addEventListener('click', () => {
  const player = document.createElement('iframe');
  player.src = 'https://www.youtube-nocookie.com/embed/pGQXSYIe_7U?autoplay=1';
  player.title = 'Administração | Descomplica UniAmérica';
  player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.allowFullscreen = true;
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  document.querySelector('.video-frame').replaceChildren(player);
});
