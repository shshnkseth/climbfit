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

    /* ── Active nav link & dropdown highlights ─────────────────── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      const isMatch = href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (href === 'training-board.html' && currentPage === 'wall.html') ||
        (href === 'wall.html' && currentPage === 'training-board.html') ||
        (href === 'services.html' && currentPage === 'offerings.html') ||
        (href === 'offerings.html' && currentPage === 'services.html');
      if (isMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Highlight parent dropdown trigger when child page is active
    const servicesPages = ['services.html', 'training-board.html', 'wall.html', 'offerings.html'];
    const companyPages = ['about.html', 'blog.html', 'support.html'];
    if (servicesPages.includes(currentPage)) {
      const sBtn = document.getElementById('services-menu-btn');
      if (sBtn) sBtn.classList.add('is-active');
    }
    if (companyPages.includes(currentPage)) {
      const cBtn = document.getElementById('company-menu-btn');
      if (cBtn) cBtn.classList.add('is-active');
    }

    /* ── Dropdown interactions (click/tap toggle & outside click) ─ */
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('is-open');
        dropdowns.forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('is-open');
            const otherBtn = d.querySelector('.nav-dropdown-trigger');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        dropdown.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        dropdowns.forEach(d => {
          d.classList.remove('is-open');
          const btn = d.querySelector('.nav-dropdown-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close dropdown on item click and smooth-scroll to page anchors
    document.querySelectorAll('.nav-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        dropdowns.forEach(d => {
          d.classList.remove('is-open');
          const btn = d.querySelector('.nav-dropdown-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        const href = item.getAttribute('href');
        if (href && href.includes('#')) {
          const [path, hash] = href.split('#');
          const isCurrentPage = !path || path === currentPage || (currentPage === 'training-board.html' && path === 'training-board.html');
          if (isCurrentPage && hash) {
            const target = document.getElementById(hash);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              history.pushState(null, '', '#' + hash);
            }
          }
        }
      });
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

        // 1. Anti-spam Honeypot Check
        const honeypot = contactForm.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value.trim() !== '') {
          // Silently discard bot submission
          contactForm.style.display = 'none';
          const successPanel = document.getElementById('form-success');
          if (successPanel) successPanel.style.display = 'block';
          return;
        }

        // 2. Client-side Rate Limiting (prevent duplicate spam submits within 45s)
        const lastSubmit = parseInt(sessionStorage.getItem('cf_last_submit') || '0', 10);
        const now = Date.now();
        if (now - lastSubmit < 45000) {
          alert('You recently sent an inquiry. Please wait a moment before submitting again, or call us directly.');
          return;
        }

        let hasError = false;

        // Validate required fields
        [['contact-name','name-error'], ['contact-email','email-error'], ['contact-message','message-hint']].forEach(([id, errId]) => {
          const input = document.getElementById(id);
          if (!input) return;
          clearError(id, errId);
          if (!input.value.trim()) {
            setError(id, errId, `${input.labels[0]?.textContent?.replace(' *','') || 'This field'} is required.`);
            hasError = true;
          } else if (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim())) {
            setError(id, errId, 'Please enter a valid email address.');
            hasError = true;
          }
        });

        if (hasError) {
          const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        sessionStorage.setItem('cf_last_submit', String(now));

        // Submit simulation
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
        }, 800);
      });
    }

    /* ── Products & Services Interactive Accordion ──────────────── */
    const accordionItems = document.querySelectorAll('.service-accordion-item');
    const mediaImages = document.querySelectorAll('.services-media-img');
    const mediaBadge = document.getElementById('services-active-badge');

    if (accordionItems.length && mediaImages.length) {
      function activateAccordion(index) {
        accordionItems.forEach((item, i) => {
          const isActive = (i === index);
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-expanded', String(isActive));
        });
        mediaImages.forEach((img, i) => {
          img.classList.toggle('is-active', i === index);
        });
        if (mediaBadge && accordionItems[index]) {
          const tagText = accordionItems[index].getAttribute('data-tag') || '';
          mediaBadge.textContent = tagText;
        }
      }

      accordionItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => activateAccordion(index));
        item.addEventListener('focusin', () => activateAccordion(index));
        item.addEventListener('click', (e) => {
          // Allow internal link clicks to navigate naturally
          if (e.target.closest('a')) return;
          activateAccordion(index);
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a')) return;
            e.preventDefault();
            activateAccordion(index);
          }
        });
      });
    }

    /* ── Editorial Services Carousel Controls & Drag-to-Scroll (Fallback) ── */
    const servPrev = document.getElementById('services-prev');
    const servNext = document.getElementById('services-next');
    const servTrack = document.getElementById('services-track');
    if (servTrack) {
      if (servPrev && servNext) {
        servPrev.addEventListener('click', () => {
          const cardWidth = servTrack.querySelector('.sec-card')?.offsetWidth || 400;
          servTrack.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        });
        servNext.addEventListener('click', () => {
          const cardWidth = servTrack.querySelector('.sec-card')?.offsetWidth || 400;
          servTrack.scrollBy({ left: (cardWidth + 24), behavior: 'smooth' });
        });
      }

      // Drag to scroll functionality
      let isDown = false;
      let startX = 0;
      let scrollLeftPos = 0;
      let dragDistance = 0;

      servTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        servTrack.classList.add('is-dragging');
        startX = e.pageX - servTrack.offsetLeft;
        scrollLeftPos = servTrack.scrollLeft;
        dragDistance = 0;
      });

      window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        servTrack.classList.remove('is-dragging');
      });

      servTrack.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        servTrack.classList.remove('is-dragging');
      });

      servTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - servTrack.offsetLeft;
        const walk = (x - startX) * 1.5;
        dragDistance = Math.abs(x - startX);
        servTrack.scrollLeft = scrollLeftPos - walk;
      });

      // Prevent accidental link clicks during drag
      servTrack.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          if (dragDistance > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
    }

    /* ── Blog & Stories Interactive Logic ──────────────────────── */
    const blogPills = document.querySelectorAll('.blog-pill-btn');
    const blogCards = document.querySelectorAll('.story-card');
    const blogSearch = document.getElementById('blog-search');
    const articleModal = document.getElementById('article-modal');
    const articleModalClose = document.getElementById('article-modal-close');
    const articleModalBody = document.getElementById('article-modal-body');

    if (blogCards.length) {
      let activeCategory = 'all';
      let searchQuery = '';

      const filterStories = () => {
        blogCards.forEach(card => {
          const category = card.dataset.category || '';
          const text = (card.innerText || '').toLowerCase();
          const matchesCategory = activeCategory === 'all' || category.includes(activeCategory);
          const matchesSearch = !searchQuery || text.includes(searchQuery);

          if (matchesCategory && matchesSearch) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      };

      blogPills.forEach(pill => {
        pill.addEventListener('click', () => {
          blogPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.dataset.filter || 'all';
          filterStories();
        });
      });

      if (blogSearch) {
        blogSearch.addEventListener('input', (e) => {
          searchQuery = e.target.value.toLowerCase().trim();
          filterStories();
        });
      }
    }

    // Article Reader Modal
    document.querySelectorAll('[data-read-article]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = btn.getAttribute('data-read-article');
        const template = document.getElementById(articleId);
        if (template && articleModal && articleModalBody) {
          articleModalBody.innerHTML = template.innerHTML;
          articleModal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeModal = () => {
      if (articleModal) {
        articleModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    };

    if (articleModalClose) {
      articleModalClose.addEventListener('click', closeModal);
    }
    if (articleModal) {
      articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) closeModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && articleModal && articleModal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Newsletter submit feedback
    const blogNewsletterForm = document.getElementById('blog-newsletter-form');
    if (blogNewsletterForm) {
      blogNewsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = blogNewsletterForm.querySelector('input[type="email"]');
        const btn = blogNewsletterForm.querySelector('button[type="submit"]');
        if (input && input.value) {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'Subscribed ✓';
          btn.style.background = '#00e5ff';
          btn.style.color = '#0b0f19';
          input.value = '';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 3500);
        }
      });
    }

    // Training Board Size Switcher (Homepage)
    const boardSwitchBtns = document.querySelectorAll('.board-switch-btn');
    const boardPanels = document.querySelectorAll('.board-panel');
    if (boardSwitchBtns.length && boardPanels.length) {
      boardSwitchBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          const targetSize = btn.getAttribute('data-size');
          boardSwitchBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          boardPanels.forEach(panel => {
            if (panel.getAttribute('data-size') === targetSize) {
              panel.classList.add('active');
              panel.removeAttribute('hidden');
            } else {
              panel.classList.remove('active');
              panel.setAttribute('hidden', '');
            }
          });
        });

        // Accessible keyboard arrow navigation
        btn.addEventListener('keydown', (e) => {
          let newIdx = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            newIdx = (idx + 1) % boardSwitchBtns.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            newIdx = (idx - 1 + boardSwitchBtns.length) % boardSwitchBtns.length;
          } else if (e.key === 'Home') {
            newIdx = 0;
          } else if (e.key === 'End') {
            newIdx = boardSwitchBtns.length - 1;
          }
          if (newIdx !== null) {
            e.preventDefault();
            boardSwitchBtns[newIdx].focus();
            boardSwitchBtns[newIdx].click();
          }
        });
      });
    }

    // E-Commerce Product Detail Size Switcher (services.html)
    const ecomSizeChips = document.querySelectorAll('.ecom-size-chip');
    const ecomThumbBtns = document.querySelectorAll('.ecom-thumb-btn');
    const ecomVisuals = document.querySelectorAll('.ecom-visual-item');
    const ecomSpecBlocks = document.querySelectorAll('.ecom-spec-block');
    const ecomSizeLabel = document.getElementById('ecom-size-label');

    const ecomLabels = {
      s: 'Size S (8 × 12 ft)',
      m: 'Size M (12 × 12 ft)',
      l: 'Size L (15 × 12 ft)'
    };

    function selectEcomSize(size) {
      if (!size) return;
      ecomSizeChips.forEach(chip => {
        const isMatch = chip.getAttribute('data-size') === size;
        chip.classList.toggle('active', isMatch);
        chip.setAttribute('aria-checked', String(isMatch));
      });
      ecomThumbBtns.forEach(thumb => {
        const isMatch = thumb.getAttribute('data-size') === size;
        thumb.classList.toggle('active', isMatch);
        thumb.setAttribute('aria-selected', String(isMatch));
      });
      ecomVisuals.forEach(vis => {
        vis.classList.toggle('active', vis.getAttribute('data-size') === size);
      });
      ecomSpecBlocks.forEach(spec => {
        spec.classList.toggle('active', spec.getAttribute('data-size') === size);
      });
      if (ecomSizeLabel && ecomLabels[size]) {
        ecomSizeLabel.textContent = ecomLabels[size];
      }
    }

    if (ecomSizeChips.length || ecomThumbBtns.length) {
      ecomSizeChips.forEach((chip, idx) => {
        chip.addEventListener('click', () => {
          selectEcomSize(chip.getAttribute('data-size'));
        });
        chip.addEventListener('keydown', (e) => {
          let targetIdx = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            targetIdx = (idx + 1) % ecomSizeChips.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            targetIdx = (idx - 1 + ecomSizeChips.length) % ecomSizeChips.length;
          }
          if (targetIdx !== null) {
            e.preventDefault();
            ecomSizeChips[targetIdx].focus();
            ecomSizeChips[targetIdx].click();
          }
        });
      });

      ecomThumbBtns.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          selectEcomSize(thumb.getAttribute('data-size'));
        });
        thumb.addEventListener('keydown', (e) => {
          let targetIdx = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            targetIdx = (idx + 1) % ecomThumbBtns.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            targetIdx = (idx - 1 + ecomThumbBtns.length) % ecomThumbBtns.length;
          }
          if (targetIdx !== null) {
            e.preventDefault();
            ecomThumbBtns[targetIdx].focus();
            ecomThumbBtns[targetIdx].click();
          }
        });
      });
    }

  }); // end DOMContentLoaded
})();
