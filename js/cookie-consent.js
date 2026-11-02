/* ===================================================================
   ClimbFit — Cookie Consent & Storage Preferences
   Lightweight, privacy-focused, accessible banner
   =================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'cf_cookie_consent';

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    hideBanner();
  }

  function hideBanner() {
    const el = document.getElementById('cf-cookie-banner');
    if (el) {
      el.classList.add('cf-cookie-hidden');
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 350);
    }
  }

  function showBanner() {
    if (document.getElementById('cf-cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cf-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie preferences');

    banner.innerHTML = `
      <div class="cf-cookie-inner">
        <div class="cf-cookie-content">
          <div class="cf-cookie-badge" aria-hidden="true">🍪 Privacy &amp; Cookies</div>
          <p class="cf-cookie-text">
            We use essential local storage to remember your theme preference and keep the site secure. We do not track you across the web or sell your data.
          </p>
        </div>
        <div class="cf-cookie-actions">
          <button type="button" class="btn btn-outline cf-cookie-btn" id="cf-cookie-essential">Essential Only</button>
          <button type="button" class="btn btn-primary cf-cookie-btn" id="cf-cookie-accept">Accept All</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Trigger slide-up animation on next frame
    requestAnimationFrame(() => {
      banner.classList.add('cf-cookie-visible');
    });

    document.getElementById('cf-cookie-accept')?.addEventListener('click', () => {
      setConsent('all');
    });

    document.getElementById('cf-cookie-essential')?.addEventListener('click', () => {
      setConsent('essential');
    });
  }

  // Open settings manually when clicking footer trigger
  window.climbfitCookieSettings = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    localStorage.removeItem(STORAGE_KEY);
    showBanner();
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!getConsent()) {
      // Short delay so page loads smoothly before showing banner
      setTimeout(showBanner, 900);
    }

    // Attach to any cookie-settings buttons or links
    document.querySelectorAll('[data-cookie-settings]').forEach(el => {
      el.addEventListener('click', window.climbfitCookieSettings);
    });
  });
})();

