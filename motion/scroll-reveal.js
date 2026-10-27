/* scroll-reveal.js — motion-anything recipe · category: scroll-reveal
 *
 * Reveals [data-reveal] elements as they scroll into view, once.
 * - Respects prefers-reduced-motion (reveals everything immediately).
 * - Optional per-element stagger via data-reveal-delay="80" (milliseconds).
 * - Cleans up: unobserves each element after it reveals.
 *
 * Usage:
 *   <section data-reveal>…</section>
 *   <li data-reveal data-reveal-delay="80">…</li>
 */
(function () {
  'use strict';

  function revealAll() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  function init() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    var reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    els.forEach(function (el) {
      var d = el.getAttribute('data-reveal-delay');
      if (d) el.style.setProperty('--reveal-delay', parseInt(d, 10) + 'ms');
    });

    var queue = [];
    var active = 0;
    function drain() {
      while (active < 3 && queue.length) {
        var el = queue.shift();
        if (el.classList.contains('is-in')) continue;
        var box = el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight || document.documentElement.classList.contains('motion-paused')) {
          el.classList.add('is-in');
          continue;
        }
        el.classList.add('is-in');
        active++;
        var delay = parseInt(el.getAttribute('data-reveal-delay'), 10) || 0;
        setTimeout(function () { active--; drain(); }, 380 + delay);
      }
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            queue.push(entry.target);
            io.unobserve(entry.target);
          }
        });
        queue.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
        drain();
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
