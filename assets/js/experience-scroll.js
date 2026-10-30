/**
 * Experience section: pinned, scroll-driven timeline (desktop only).
 *
 * While the section is on screen its title stays put and the timeline (.tl-wrap) slides up inside
 * .tl-viewport as the page scrolls. Once the last entry is visible the pin releases and the page
 * continues scrolling normally. Below 992px, with reduced motion, or if the timeline already fits,
 * the .tl-pinned class is never applied and the section is a plain static layout.
 */
(function () {
  'use strict';

  var section = document.getElementById('resume');
  if (!section) return;

  var track = section.querySelector('.tl-track');
  var sticky = section.querySelector('.tl-sticky');
  var viewport = section.querySelector('.tl-viewport');
  var wrap = section.querySelector('.tl-wrap');
  if (!track || !sticky || !viewport || !wrap) return;

  var desktop = window.matchMedia('(min-width: 992px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var travel = 0;   // px the timeline has to move for the last entry to become fully visible
  var ticking = false;

  function reset() {
    section.classList.remove('tl-pinned');
    track.style.height = '';
    wrap.style.transform = '';
  }

  function measure() {
    reset();
    if (!desktop.matches || reduced.matches) return;

    // Pin first so .tl-viewport gets its pinned height, then see whether the timeline overflows it
    section.classList.add('tl-pinned');
    travel = wrap.offsetHeight - viewport.clientHeight;
    if (travel <= 0) { reset(); return; }

    track.style.height = (sticky.offsetHeight + travel) + 'px';
    update();
  }

  function update() {
    ticking = false;
    if (!section.classList.contains('tl-pinned')) return;
    var scrolled = -track.getBoundingClientRect().top;
    var progress = Math.min(Math.max(scrolled / travel, 0), 1);
    wrap.style.transform = 'translate3d(0,' + (-progress * travel).toFixed(1) + 'px,0)';
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  desktop.addEventListener('change', measure);
  reduced.addEventListener('change', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
})();
