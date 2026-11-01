/* =========================================================
   Shashank Kumar — Portfolio v2 · landing behaviour
   Minimal, dependency-free, prefers-reduced-motion aware.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Theme toggle (nav + mobile share one source of truth) ---- */
  var toggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleM')].filter(Boolean);

  function activeTheme() {
    return root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
  }
  function syncToggles() {
    var next = activeTheme() === 'dark' ? 'Light' : 'Dark';
    toggles.forEach(function (btn) {
      btn.textContent = next;
      btn.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
    });
  }
  function flip() {
    root.setAttribute('data-theme', activeTheme() === 'dark' ? 'light' : 'dark');
    syncToggles();
  }
  toggles.forEach(function (btn) { btn.addEventListener('click', flip); });
  // keep labels correct if the OS theme changes while no manual choice is set
  prefersDark.addEventListener('change', function () { if (!root.getAttribute('data-theme')) syncToggles(); });
  syncToggles();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---- Smooth-scroll for in-page anchors (respects reduced motion) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id === '#top') { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---- Number counters ---- */
  function animateNumber(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var decimals = (target % 1 !== 0) ? 1 : 0;

    if (reduce.matches) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    var duration = 1600, startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Reveal-on-scroll + trigger counters / ensō ---- */
  var reveals = document.querySelectorAll('.reveal');
  var numbers = document.querySelectorAll('.stats__num[data-count]');
  var enso = document.querySelector('.enso-draw');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    numbers.forEach(animateNumber);
    if (enso) enso.classList.add('in');
    return;
  }

  var revObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(function (el) { revObserver.observe(el); });

  var numObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateNumber(e.target); numObserver.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  numbers.forEach(function (el) { numObserver.observe(el); });

  if (enso) {
    var ensoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ensoObserver.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    ensoObserver.observe(enso);
  }
})();
