/* ===================================================================
   ClimbFit — main.js v2
   Theme toggle · Scroll effects · Scroll-reveal · Counter animation
   Accessible form validation · Skip link · Reduced motion
   =================================================================== */

/* Inject sr-only utility if not already present via CSS */
(function injectSrOnly() {
  if (!document.getElementById('cf-sr-only-style')) {
    const s = document.createElement('style');
    s.id = 'cf-sr-only-style';
    s.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
    document.head.appendChild(s);
  }
})();

(function () {
  'use strict';

  /* ── Theme Toggle ─────────────────────────────────────────────── */
  const THEME_KEY = 'cf-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', label);
      const icon = btn.querySelector('.icon-sun, .icon-moon');
      if (icon) {
        icon.className = theme === 'dark' ? 'icon-moon' : 'icon-sun';
        icon.innerHTML = theme === 'dark' ? moonSVG() : sunSVG();
        icon.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function sunSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;
  }

  function moonSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;
  }

  // Apply on load
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {

    /* ── Bind theme toggle buttons ──────────────────────────────── */
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });

    /* ── Navbar scroll effect ───────────────────────────────────── */
    const nav = document.querySelector('.site-nav');
    if (nav) {
      const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ── Active nav link ────────────────────────────────────────── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    /* ── Mobile menu toggle ─────────────────────────────────────── */
    const menuBtn = document.querySelector('.nav-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
        if (open) {
          navLinks.style.cssText = `
            display: flex; flex-direction: column;
            position: fixed; top: var(--nav-h); left: 0; right: 0;
            background: var(--surface); border-bottom: 1px solid var(--border);
            padding: 1.5rem; gap: 1.25rem; z-index: 99;
          `;
        } else {
          navLinks.style.cssText = '';
        }
      });
    }

    /* ── Scroll-reveal ──────────────────────────────────────────── */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(el => revealObserver.observe(el));
    }

    /* ── Counter animation ──────────────────────────────────────── */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(el => countObserver.observe(el));
    }

    function animateCounter(el) {
      const target   = parseFloat(el.getAttribute('data-count'));
      const suffix   = el.getAttribute('data-suffix') || '';
      const prefix   = el.getAttribute('data-prefix') || '';
      const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
      const duration = 1800;
      const start    = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value  = target * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    /* ── Parallax hero ──────────────────────────────────────────── */
    const heroImg = document.querySelector('.hero-parallax');
    if (heroImg) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroImg.style.transform = `translateY(${y * 0.25}px) scale(1.04)`;
      }, { passive: true });
    }

    /* ── Glowing hold dots interactive ─────────────────────────── */
    // small decorative glowing dots that respond to mouse
    const glowDots = document.querySelectorAll('.hold-dot');
    if (glowDots.length) {
      document.addEventListener('mousemove', (e) => {
        glowDots.forEach(dot => {
          const rect = dot.getBoundingClientRect();
          const cx   = rect.left + rect.width / 2;
          const cy   = rect.top  + rect.height / 2;
          const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
          const proximity = Math.max(0, 1 - dist / 300);
          dot.style.setProperty('--prox', proximity);
        });
      });
    }

    /* ── Smooth anchor links ────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* ── Accessible form validation + submission ───────────────── */
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {

      function setError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (!input || !error) return;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorId);
        error.textContent = message;
        error.style.display = 'block';
      }

      function clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (!input || !error) return;
        input.removeAttribute('aria-invalid');
        error.textContent = '';
        error.style.display = 'none';
      }

      // Live validation on blur
      contactForm.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('blur', () => {
          const errorId = field.id.replace('contact-', '') + '-error';
          if (!field.value.trim()) {
            setError(field.id, errorId, `${field.labels[0]?.textContent?.replace(' *', '') || 'This field'} is required.`);
          } else if (field.type === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(field.value)) {
            setError(field.id, errorId, 'Please enter a valid email address.');
          } else {
            clearError(field.id, errorId);
          }
        });
      });

      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        let hasError = false;

        // Validate required fields
        [['contact-name','name-error'], ['contact-email','email-error'], ['contact-message','message-hint']].forEach(([id, errId]) => {
          const input = document.getElementById(id);
          if (!input) return;
          clearError(id, errId);
          if (!input.value.trim()) {
            setError(id, errId, `${input.labels[0]?.textContent?.replace(' *','') || 'This field'} is required.`);
            hasError = true;
          } else if (input.type === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(input.value)) {
            setError(id, errId, 'Please enter a valid email address.');
            hasError = true;
          }
        });

        if (hasError) {
          // Move focus to first error
          const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Simulate send
        const btn = document.getElementById('contact-submit');
        const successPanel = document.getElementById('form-success');
        btn.disabled = true;
        btn.textContent = 'Sending…';

        setTimeout(() => {
          contactForm.style.display = 'none';
          if (successPanel) {
            successPanel.style.display = 'block';
            successPanel.focus();
          }
        }, 900);
      });
    }

  }); // end DOMContentLoaded
})();
