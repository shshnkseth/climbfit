(function () {
  'use strict';

  const AUTH_KEY = 'climbfit_authenticated';
  const VALID_USER = 'Monkey';
  const VALID_PASS = 'MonkeyBusiness';

  function isAuth() {
    return localStorage.getItem(AUTH_KEY) === 'true' || sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  // Inject locking CSS immediately to prevent FOUC
  const style = document.createElement('style');
  style.id = 'cf-auth-gate-styles';
  style.textContent = `
    html.cf-locked body > *:not(#cf-auth-gate) {
      display: none !important;
    }
    html.cf-locked {
      overflow: hidden !important;
      height: 100% !important;
    }
    #cf-auth-gate {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: #080810;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f0f0fa;
      opacity: 1;
      transition: opacity 0.35s ease-out;
      overflow: hidden;
    }
    #cf-auth-gate.cf-fade-out {
      opacity: 0;
      pointer-events: none;
    }
    .cf-gate-bg-glow {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      opacity: 0.18;
    }
    .cf-gate-glow-1 {
      background: #00e5ff;
      top: -100px;
      right: -100px;
    }
    .cf-gate-glow-2 {
      background: #ff007a;
      bottom: -100px;
      left: -100px;
    }
    .cf-gate-card {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 420px;
      background: rgba(16, 16, 28, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 229, 255, 0.08);
      text-align: center;
    }
    .cf-gate-logo {
      height: 36px;
      width: auto;
      margin-bottom: 1.25rem;
      display: inline-block;
    }
    .cf-gate-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(255, 179, 0, 0.12);
      border: 1px solid rgba(255, 179, 0, 0.3);
      color: #ffb300;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .cf-gate-badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ffb300;
      box-shadow: 0 0 8px #ffb300;
    }
    .cf-gate-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    .cf-gate-subtitle {
      font-size: 0.88rem;
      color: #8b8ba7;
      line-height: 1.55;
      margin-bottom: 1.75rem;
    }
    .cf-gate-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-align: left;
    }
    .cf-gate-field label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #a5a5c2;
      margin-bottom: 0.35rem;
      letter-spacing: 0.02em;
    }
    .cf-gate-input-wrap {
      position: relative;
    }
    .cf-gate-input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(8, 8, 16, 0.85);
      border: 1.5px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      color: #ffffff;
      font-family: inherit;
      font-size: 0.95rem;
      padding: 0.8rem 1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .cf-gate-input:focus {
      border-color: #00e5ff;
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.18);
    }
    .cf-gate-btn {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.9rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 100%);
      color: #080810;
      font-family: inherit;
      font-weight: 700;
      font-size: 0.98rem;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.15s, box-shadow 0.2s;
    }
    .cf-gate-btn:hover {
      box-shadow: 0 0 24px rgba(0, 229, 255, 0.45);
      transform: translateY(-1px);
    }
    .cf-gate-btn:active {
      transform: translateY(0);
    }
    .cf-gate-error {
      display: none;
      background: rgba(255, 0, 122, 0.12);
      border: 1px solid rgba(255, 0, 122, 0.3);
      color: #ff4d94;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 500;
      text-align: center;
      margin-bottom: 0.5rem;
      animation: cfShake 0.4s ease-in-out;
    }
    @keyframes cfShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);

  if (!isAuth()) {
    document.documentElement.classList.add('cf-locked');
  }

  function createGateModal() {
    if (document.getElementById('cf-auth-gate')) return;

    const gate = document.createElement('div');
    gate.id = 'cf-auth-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'cf-gate-heading');

    gate.innerHTML = `
      <div class="cf-gate-bg-glow cf-gate-glow-1"></div>
      <div class="cf-gate-bg-glow cf-gate-glow-2"></div>
      <div class="cf-gate-card">
        <img src="assets/brand/logo.png" alt="ClimbFit" class="cf-gate-logo">
        <div>
          <span class="cf-gate-badge">Private Preview</span>
        </div>
        <h2 class="cf-gate-title" id="cf-gate-heading">Restricted Access</h2>
        <p class="cf-gate-subtitle">This unreleased project is currently in private preview. Please authenticate to view the website.</p>
        
        <div id="cf-gate-err" class="cf-gate-error" role="alert">Invalid username or password.</div>

        <form id="cf-gate-form" class="cf-gate-form">
          <div class="cf-gate-field">
            <label for="cf-user-input">Username</label>
            <div class="cf-gate-input-wrap">
              <input type="text" id="cf-user-input" class="cf-gate-input" placeholder="Enter username" autocomplete="username" required>
            </div>
          </div>
          <div class="cf-gate-field">
            <label for="cf-pass-input">Password</label>
            <div class="cf-gate-input-wrap">
              <input type="password" id="cf-pass-input" class="cf-gate-input" placeholder="Enter password" autocomplete="current-password" required>
            </div>
          </div>
          <button type="submit" class="cf-gate-btn" id="cf-submit-btn">
            <span>Unlock Preview</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    const form = document.getElementById('cf-gate-form');
    const userInput = document.getElementById('cf-user-input');
    const passInput = document.getElementById('cf-pass-input');
    const errBox = document.getElementById('cf-gate-err');

    setTimeout(() => {
      if (userInput) userInput.focus();
    }, 100);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const userVal = userInput.value.trim();
      const passVal = passInput.value;

      if (userVal === VALID_USER && passVal === VALID_PASS) {
        localStorage.setItem(AUTH_KEY, 'true');
        sessionStorage.setItem(AUTH_KEY, 'true');
        gate.classList.add('cf-fade-out');
        setTimeout(() => {
          document.documentElement.classList.remove('cf-locked');
          if (gate.parentNode) gate.parentNode.removeChild(gate);
        }, 350);
      } else {
        errBox.style.display = 'block';
        errBox.textContent = 'Invalid username or password. Please try again.';
        // Retrigger shake animation
        errBox.style.animation = 'none';
        void errBox.offsetHeight; // Trigger reflow
        errBox.style.animation = 'cfShake 0.4s ease-in-out';
        passInput.value = '';
        passInput.focus();
      }
    });
  }

  function init() {
    if (!isAuth()) {
      document.documentElement.classList.add('cf-locked');
      if (document.body) {
        createGateModal();
      } else {
        document.addEventListener('DOMContentLoaded', createGateModal);
      }
    }
  }

  init();

  // Expose optional logout helper for testing in browser console: climbfitLogout()
  window.climbfitLogout = function () {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
  };
})();
