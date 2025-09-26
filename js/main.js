// Mobile navigation toggle
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-navigation');
  const header = document.querySelector('.header');
  const overlay = document.querySelector('.site-overlay');
  if (!toggle || !nav || !header) return;

  let lastFocused = null;
  let trapHandler = null;

  function updateHeaderHeightVar() {
    const h = header.offsetHeight || 80;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  function setExpanded(expanded, opts = {}) {
    const manageFocus = opts.manageFocus !== false; // default true
    toggle.setAttribute('aria-expanded', String(expanded));
    nav.classList.toggle('open', expanded);
    nav.setAttribute('aria-hidden', String(!expanded));
    // toggle overlay and icon state
    if (overlay) {
      overlay.classList.toggle('open', expanded);
      overlay.setAttribute('aria-hidden', String(!expanded));
    }
    toggle.classList.toggle('open', expanded);

    // Lock background scroll when open
    document.body.classList.toggle('no-scroll', expanded);

    // Manage focus
    if (expanded) {
      if (!manageFocus) return; // skip focus handling if requested
      lastFocused = document.activeElement;
      const focusables = Array.from(nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled'));
      if (focusables.length) {
        focusables[0].focus();
      } else {
        nav.setAttribute('tabindex', '-1');
        nav.focus();
      }

      // Trap focus within nav + toggle
      trapHandler = function (e) {
        if (e.key !== 'Tab') return;
        const trapEls = [toggle, ...Array.from(nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
          .filter(el => !el.hasAttribute('disabled'))];
        if (!trapEls.length) return;
        const first = trapEls[0];
        const last = trapEls[trapEls.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', trapHandler);
    } else {
      if (!manageFocus) return; // skip focus handling if requested
      if (trapHandler) {
        document.removeEventListener('keydown', trapHandler);
        trapHandler = null;
      }
      if (nav.getAttribute('tabindex') === '-1') {
        nav.removeAttribute('tabindex');
      }
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        lastFocused = null;
      } else {
        toggle.focus();
      }
    }
  }

  // Init
  updateHeaderHeightVar();
  // Initialize in a closed state without moving focus to the toggle
  setExpanded(false, { manageFocus: false });

  // Language switching (AF/EN)
  (function setupLangSwitcher(){
    const root = document.documentElement;
    try {
      const stored = localStorage.getItem('sigmaLang');
      const initial = stored || root.getAttribute('lang') || 'af';
      root.setAttribute('lang', initial);
      const btns = document.querySelectorAll('.lang-btn');
      btns.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        btn.setAttribute('aria-pressed', String(lang === initial));
        btn.addEventListener('click', () => {
          if (root.getAttribute('lang') === lang) return;
          root.setAttribute('lang', lang);
          localStorage.setItem('sigmaLang', lang);
          btns.forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)));
        });
      });
    } catch (_) {
      /* ignore storage errors */
    }
  })();

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!expanded);
  });

  // Close menu when clicking a link (use event delegation)
  nav.addEventListener('click', (e) => {
    const link = e.target && (e.target.closest ? e.target.closest('a') : null);
    if (link) setExpanded(false);
  });

  // Close when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => setExpanded(false));
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setExpanded(false);
  });

  // Update header height on resize
  window.addEventListener('resize', () => {
    updateHeaderHeightVar();
  });
})();
