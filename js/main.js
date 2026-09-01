/* ===================================================================
   ClimbFit — main.js
   Theme toggle, scroll effects, scroll-reveal, counter animation
   =================================================================== */

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
    // Update toggle icon
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const icon = btn.querySelector('.icon-sun, .icon-moon');
      if (icon) {
        icon.className = theme === 'dark' ? 'icon-moon' : 'icon-sun';
        icon.innerHTML = theme === 'dark' ? moonSVG() : sunSVG();
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

    /* ── Form submission ────────────────────────────────────────── */
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Sent ✓';
        btn.disabled = true;
        btn.style.background = '#1a6b3a';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      });
    }

  }); // end DOMContentLoaded
})();
