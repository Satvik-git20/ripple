'use strict';

/* ripple — a small social space. Vanilla JS, no build step. */

const app = document.getElementById('app');
const dialog = document.getElementById('dialog');
const toastRegion = document.getElementById('toast-region');

const BRAND_MARK = `
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="3.5" fill="currentColor"/>
    <circle cx="16" cy="16" r="7.6" stroke="currentColor" stroke-width="1.6" opacity=".95"/>
    <circle cx="16" cy="16" r="12.3" stroke="currentColor" stroke-width="1.2" opacity=".48"/>
  </svg>
`;

const ICONS = {
  home: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></svg>`,
  compass: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m16.4 7.6-2.6 6.2-6.2 2.6 2.6-6.2 6.2-2.6Z"/></svg>`,
  user: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.1 3.6-6.2 8-6.2s8 2.1 8 6.2"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-1.8c0-2.4-2-4.2-4.5-4.2h-4C5 15 3 16.8 3 19.2V21"/><circle cx="9.5" cy="7.5" r="3.5"/><path d="M17 11a3.5 3.5 0 1 0 0-7"/><path d="M21 21v-1.8c0-2.2-1.5-3.9-3.6-4.2"/></svg>`,
  plus: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  heart: `<svg class="icon heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>`,
  comment: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.9 8.9 0 0 1-3.6-.8L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3a8.5 8.5 0 0 1 8.5 8.5Z"/></svg>`,
  trash: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m6 7 1 13h10l1-13"/><path d="M10 11v5M14 11v5"/></svg>`,
  logout: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  pin: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>`,
  link: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>`,
  calendar: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
  arrow: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  x: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  spark: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8c.8 5.5 3.7 8.4 9.2 9.2-5.5.8-8.4 3.7-9.2 9.2-.8-5.5-3.7-8.4-9.2-9.2 5.5-.8 8.4-3.7 9.2-9.2Z"/></svg>`,
  edit: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
};

const AVATAR_PALETTE = [
  { hex: '#FF6A4A', name: 'Coral' },
  { hex: '#2A8A73', name: 'Pine' },
  { hex: '#BBA9F2', name: 'Lilac' },
  { hex: '#F0BE4C', name: 'Marigold' },
  { hex: '#E58DA8', name: 'Rose' },
  { hex: '#82C8B4', name: 'Seafoam' },
  { hex: '#8FA7E8', name: 'Periwinkle' },
  { hex: '#D9A06B', name: 'Clay' },
  { hex: '#C77DA8', name: 'Plum' },
  { hex: '#67B7D1', name: 'Sky' },
  { hex: '#E76F51', name: 'Ember' },
  { hex: '#7A9E7E', name: 'Sage' },
];

const state = {
  me: null,
  view: 'auth',
  activeNav: '',
  authMode: 'login',
  feedFilter: 'all',
  feedPosts: [],
  feedRequest: 0,
  navToken: 0,
  profile: null,
  profileTab: 'posts',
  suggestions: [],
  suggestionSeq: 0,
  exploreCreators: [],
  explorePosts: [],
  exploreQuery: '',
  pendingQuery: '',
  exploreRequest: 0,
  searchResults: null,
  searchSeq: 0,
  searchTimer: null,
  comments: {},
  pendingConfirm: null,
  focusComposer: false,
};

// Small utilities -----------------------------------------------------------

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function safeColor(value) {
  return /^#[0-9A-Fa-f]{6}$/.test(String(value || '')) ? value : '#FF6A4A';
}

function initials(name) {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function avatar(user, size = 'md', extraClass = '') {
  const color = safeColor(user?.avatarColor);
  const label = initials(user?.displayName || user?.username);
  return `<span class="avatar avatar-${size} ${extraClass}" style="--avatar:${color}" aria-hidden="true"><span>${esc(label)}</span></span>`;
}

function followerText(count) {
  const number = Number(count) || 0;
  return `${number.toLocaleString()} ${number === 1 ? 'follower' : 'followers'}`;
}

function formatCount(count) {
  return (Number(count) || 0).toLocaleString();
}

function timeAgo(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 45) return 'now';
  if (seconds < 60 * 60) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 60 * 60 * 24) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 60 * 60 * 24 * 7) return `${Math.floor(seconds / 86400)}d`;

  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

function fullDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function joinedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

function pageDate() {
  return new Date().toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

function firstName(displayName) {
  return String(displayName || '').trim().split(/\s+/)[0] || 'friend';
}

function websafeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

function websiteLabel(url) {
  const path = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
  return `${url.hostname.replace(/^www\./, '')}${path}`;
}

function formatContent(value) {
  let safe = esc(value);
  safe = safe.replace(
    /(^|[\s(])#([a-zA-Z0-9_]{1,30})/g,
    (match, lead, tag) =>
      `${lead}<button type="button" class="inline-link" data-action="tag" data-tag="${tag}">#${tag}</button>`,
  );
  safe = safe.replace(
    /(^|[\s(])@([a-zA-Z0-9_]{3,20})/g,
    (match, lead, username) =>
      `${lead}<button type="button" class="inline-link" data-action="mention" data-username="${username}">@${username}</button>`,
  );
  return safe.replace(/\n/g, '<br>');
}

function brandMarkup(link = true) {
  const inner = `<span class="brand-mark">${BRAND_MARK}</span><span class="brand-word">ripple.</span>`;
  if (!link) return `<div class="brand">${inner}</div>`;
  return `<a class="brand" href="#/home" aria-label="ripple home">${inner}</a>`;
}

function emptyState({ title, body, action = '', orbitIcon = ICONS.spark }) {
  return `
    <div class="empty-state">
      <div class="empty-orbit">${orbitIcon}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(body)}</p>
      ${action}
    </div>
  `;
}

function postSkeleton(count = 3) {
  return Array.from(
    { length: count },
    () => `
      <div class="post-skeleton">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
        </div>
      </div>
    `,
  ).join('');
}

// Network -------------------------------------------------------------------

async function api(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Can’t reach ripple right now. Check your connection.');
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 && state.me) {
      handleSessionExpired();
    }
    const error = new Error(data.error || 'That didn’t work. Try again.');
    error.status = response.status;
    throw error;
  }

  return data;
}

function showToast(message, kind = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${kind === 'error' ? 'is-error' : ''}`.trim();
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  toastRegion.append(toast);

  window.setTimeout(() => {
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 220);
  }, 3400);
}

function handleSessionExpired() {
  if (!state.me) return;
  state.me = null;
  closeDialog();
  renderAuth('login', 'Your session ended. Sign in to keep going.');
  showToast('Your session ended. Sign in again.', 'error');
}

// Dialog --------------------------------------------------------------------

function openDialog(html, className = '') {
  dialog.className = `dialog ${className}`.trim();
  dialog.innerHTML = html;
  if (!dialog.open) {
    dialog.showModal();
  }
}

function closeDialog() {
  state.pendingConfirm = null;
  if (dialog.open) {
    dialog.close();
  } else {
    dialog.innerHTML = '';
  }
}

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

dialog.addEventListener('close', () => {
  dialog.innerHTML = '';
  state.pendingConfirm = null;
});

dialog.addEventListener('cancel', () => {
  state.pendingConfirm = null;
});

// Auth ----------------------------------------------------------------------

function renderAuth(mode = 'login', error = '') {
  state.view = 'auth';
  state.activeNav = '';
  state.me = null;
  state.authMode = mode;
  closeDialog();
  document.title = 'ripple — a small social space';

  const isLogin = mode === 'login';
  const errorMarkup = error
    ? `<div class="form-error" id="auth-error">${esc(error)}</div>`
    : '<div class="form-error" id="auth-error" hidden></div>';

  app.innerHTML = `
    <div class="auth-shell">
      <section class="auth-art">
        <div class="auth-brand-row">
          ${brandMarkup(false)}
          <span class="auth-brand-note">A small social space</span>
        </div>

        <div class="auth-copy">
          <h1><span>A quieter place</span><span>to be loud.</span></h1>
          <p>Share what you’re making, thinking, or noticing. Follow people who make the internet feel a little more human.</p>
          <div class="auth-signal" style="margin-top:26px">
            <span class="auth-signal-dot"></span>
            No algorithm. Just people you chose.
          </div>
        </div>

        <div class="auth-note" aria-hidden="true">
          <div class="auth-note-head">
            ${avatar({ displayName: 'June Park', avatarColor: '#BBA9F2' }, 'sm')}
            <span>June Park</span>
            <span>@june</span>
          </div>
          <p>“The honest version is usually the better one.”</p>
          <span class="auth-note-tag">#writing</span>
        </div>
      </section>

      <section class="auth-panel">
        <div class="auth-form-wrap">
          <div class="auth-mobile-brand">${brandMarkup(false)}</div>
          <div class="auth-kicker">${isLogin ? 'Welcome back' : 'A fresh start'}</div>
          <h2>${isLogin ? 'Good to see you.' : 'Make a little room.'}</h2>
          <p class="auth-subtitle">${
            isLogin
              ? 'Your circle is waiting where you left it.'
              : 'Make a corner of the internet that feels like yours.'
          }</p>

          <form class="auth-form" id="auth-form" data-mode="${mode}" novalidate>
            ${
              isLogin
                ? ''
                : `<div class="field">
                    <label for="auth-name">Your name</label>
                    <input class="input" id="auth-name" name="displayName" type="text" autocomplete="name" placeholder="Maya Chen" maxlength="40" required />
                  </div>`
            }
            <div class="field">
              <label for="auth-username">Username</label>
              <input class="input" id="auth-username" name="username" type="text" autocomplete="username" placeholder="${isLogin ? 'maya' : 'yourname'}" maxlength="20" autocapitalize="none" spellcheck="false" required />
              ${isLogin ? '' : '<span class="field-hint"><span>Letters, numbers, underscores</span><span>3–20 characters</span></span>'}
            </div>
            <div class="field">
              <label for="auth-password">Password</label>
              <input class="input" id="auth-password" name="password" type="password" autocomplete="${isLogin ? 'current-password' : 'new-password'}" placeholder="${isLogin ? 'Your password' : 'At least 8 characters'}" minlength="8" required />
            </div>
            ${errorMarkup}
            <button class="btn btn-primary" type="submit">${isLogin ? 'Sign in' : 'Create account'}</button>
          </form>

          <div class="auth-divider">or take a look around</div>
          <button class="demo-btn" type="button" data-action="demo-login">
            <span class="demo-btn-mark">${ICONS.spark}</span>
            <span class="demo-btn-text">
              <strong>Step into Maya’s feed</strong>
              <span>maya / demo1234 — one click, no signup</span>
            </span>
            <span class="demo-btn-arrow">${ICONS.arrow}</span>
          </button>

          <p class="auth-switch">
            ${
              isLogin
                ? 'New here? <button type="button" data-action="auth-mode" data-mode="signup">Create an account</button>'
                : 'Already have an account? <button type="button" data-action="auth-mode" data-mode="login">Sign in</button>'
            }
          </p>
          <p class="auth-legal">ripple is a demo social space. Your account and posts live in a local SQLite database.</p>
        </div>
      </section>
    </div>
  `;
}

function enterApp(user, message = '') {
  state.me = user;
  state.view = 'home';
  state.activeNav = 'home';
  state.profile = null;
  state.feedPosts = [];
  state.comments = {};
  state.exploreQuery = '';
  state.searchResults = null;

  const validHash = /^#\/(home|explore|u\/)/.test(location.hash);
  if (!validHash) {
    history.replaceState(null, '', '#/home');
  }

  renderShell();
  route();

  if (message) {
    window.setTimeout(() => showToast(message), 350);
  }
}

async function handleAuthSubmit(form) {
  const mode = form.dataset.mode;
  const formData = new FormData(form);
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const displayName = String(formData.get('displayName') || '').trim();
  const errorBox = document.getElementById('auth-error');
  const submit = form.querySelector('button[type="submit"]');
  const label = submit?.textContent || '';

  if (errorBox) {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }
  if (submit) {
    submit.disabled = true;
    submit.textContent = mode === 'login' ? 'Signing in…' : 'Creating account…';
  }

  try {
    const payload =
      mode === 'login'
        ? { username, password }
        : { username, password, displayName };
    const data = await api(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
      method: 'POST',
      body: payload,
    });
    enterApp(
      data.user,
      mode === 'login'
        ? `Welcome back, ${firstName(data.user.displayName)}.`
        : `Welcome to ripple, ${firstName(data.user.displayName)}.`,
    );
  } catch (error) {
    if (errorBox && form.isConnected) {
      errorBox.textContent = error.message;
      errorBox.hidden = false;
    } else {
      showToast(error.message, 'error');
    }
    if (submit) {
      submit.disabled = false;
      submit.textContent = label;
    }
  }
}

async function demoLogin(button) {
  button.disabled = true;
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { username: 'maya', password: 'demo1234' },
    });
    enterApp(data.user, 'You’re in. Look around.');
  } catch (error) {
    showToast(error.message, 'error');
    button.disabled = false;
  }
}

async function logout() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch {
    // Signing out locally still makes sense if the request fails.
  }
  state.me = null;
  state.view = 'auth';
  state.feedPosts = [];
  state.profile = null;
  state.searchResults = null;
  history.replaceState(null, '', '#/');
  renderAuth('login');
  showToast('Signed out. See you soon.');
}

// App shell ----------------------------------------------------------------

function navLink({ href, view, icon, label }) {
  return `
    <a class="nav-link" href="${href}" data-view="${view}">
      ${icon}
      <span>${label}</span>
    </a>
  `;
}

function mobileNavLink({ href, view, icon, label }) {
  return `
    <a class="mobile-nav-link" href="${href}" data-view="${view}">
      ${icon}
      <span>${label}</span>
    </a>
  `;
}

function renderShell() {
  const me = state.me;
  if (!me) return;

  const profileHref = `#/u/${encodeURIComponent(me.username)}`;
  const myAvatar = avatar(me, 'xs');

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        ${brandMarkup()}
        <nav class="side-nav" aria-label="Main navigation">
          ${navLink({ href: '#/home', view: 'home', icon: ICONS.home, label: 'Home' })}
          ${navLink({ href: '#/explore', view: 'explore', icon: ICONS.compass, label: 'Explore' })}
          ${navLink({ href: profileHref, view: 'profile', icon: ICONS.user, label: 'Profile' })}
        </nav>
        <button class="btn btn-coral new-post-btn" type="button" data-action="focus-composer">
          <span>New post</span>
          <span class="plus-orb">${ICONS.plus}</span>
        </button>
        <p class="sidebar-note">A quiet corner for things worth sharing. No algorithm, just your circle.</p>
        <div class="sidebar-spacer"></div>
        <div class="sidebar-user">
          ${avatar(me, 'sm')}
          <a class="sidebar-user-text" href="${profileHref}">
            <strong>${esc(me.displayName)}</strong>
            <span>@${esc(me.username)}</span>
          </a>
          <button class="icon-btn" type="button" data-action="logout" aria-label="Sign out" title="Sign out">
            ${ICONS.logout}
          </button>
        </div>
      </aside>

      <div class="main-column">
        <header class="mobile-header">
          ${brandMarkup()}
          <div class="mobile-header-actions">
            <a class="icon-btn" href="${profileHref}" aria-label="Your profile" title="Your profile">${myAvatar}</a>
            <button class="icon-btn" type="button" data-action="logout" aria-label="Sign out" title="Sign out">${ICONS.logout}</button>
          </div>
        </header>
        <main class="view" id="view"></main>
      </div>

      <aside class="right-rail" aria-label="Discover">
        <section class="rail-card">
          <div class="rail-head">
            <h2>People to follow</h2>
            <a href="#/explore">See all</a>
          </div>
          <div class="suggestion-list" id="suggestion-list">
            ${railSkeleton()}
          </div>
        </section>

        <section class="prompt-card">
          <div class="prompt-label">Today’s prompt</div>
          <h2>What’s one small thing you’re proud of this week?</h2>
          <p>No grand reveal needed. A sentence is enough.</p>
          <button class="btn btn-lime" type="button" data-action="focus-composer">
            Write about it ${ICONS.arrow}
          </button>
        </section>

        <div class="rail-foot">
          <span>ripple is a small social space.</span>
          <span>Be kind. Post slowly.</span>
        </div>
      </aside>
    </div>

    <nav class="mobile-nav" aria-label="Mobile navigation">
      ${mobileNavLink({ href: '#/home', view: 'home', icon: ICONS.home, label: 'Home' })}
      ${mobileNavLink({ href: '#/explore', view: 'explore', icon: ICONS.compass, label: 'Explore' })}
      <button class="mobile-nav-new" type="button" data-action="focus-composer" aria-label="New post">${ICONS.plus}</button>
      ${mobileNavLink({ href: profileHref, view: 'profile', icon: ICONS.user, label: 'Profile' })}
    </nav>
  `;

  setActiveNav();
  loadSuggestions();
}

function setActiveNav() {
  document.querySelectorAll('[data-view]').forEach((link) => {
    const active = link.dataset.view === state.activeNav;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function railSkeleton() {
  return Array.from(
    { length: 3 },
    () => `
      <div class="suggestion-row">
        <div class="skeleton skeleton-avatar" style="width:36px;height:36px"></div>
        <div class="suggestion-text">
          <div class="skeleton skeleton-line" style="width:74%"></div>
          <div class="skeleton skeleton-line" style="width:45%;margin-top:5px"></div>
        </div>
      </div>
    `,
  ).join('');
}

async function loadSuggestions() {
  const container = document.getElementById('suggestion-list');
  if (!container || !state.me) return;

  const sequence = ++state.suggestionSeq;
  try {
    const data = await api('/api/users/suggestions?limit=4');
    if (sequence !== state.suggestionSeq || !state.me) return;
    state.suggestions = data.users;
    renderSuggestions();
  } catch {
    if (sequence === state.suggestionSeq && container.isConnected) {
      container.innerHTML = '<p class="rail-empty">Couldn’t load suggestions right now.</p>';
    }
  }
}

function renderSuggestions() {
  const container = document.getElementById('suggestion-list');
  if (!container) return;

  if (!state.suggestions.length) {
    container.innerHTML = `
      <p class="rail-empty">You’re following everyone we know. Explore to find more voices.</p>
    `;
    return;
  }

  container.innerHTML = state.suggestions
    .map(
      (user) => `
        <div class="suggestion-row">
          ${avatar(user, 'sm')}
          <button class="suggestion-text" type="button" data-action="go-profile" data-username="${esc(user.username)}">
            <strong>${esc(user.displayName)}</strong>
            <span>@${esc(user.username)}</span>
          </button>
          ${followButtonHTML(user, 'icon')}
        </div>
      `,
    )
    .join('');
}

function followButtonHTML(user, variant = 'soft') {
  if (!user || user.isMe) return '';

  const following = Boolean(user.isFollowing);
  const icon = following ? ICONS.check : ICONS.plus;
  const username = esc(user.username);
  const action = following ? 'Unfollow' : 'Follow';
  const label = `${action} @${user.username}`.replace(/"/g, '&quot;');

  if (variant === 'icon') {
    return `
      <button class="follow-icon ${following ? 'is-following' : ''}" type="button"
        data-action="follow" data-username="${username}" aria-pressed="${following}" aria-label="${label}" title="${label}">
        ${icon}
      </button>
    `;
  }

  const classes = `${variant === 'primary' ? 'btn btn-primary' : 'btn btn-ghost'} ${following ? 'is-following btn-following' : ''}`;
  return `
    <button class="${classes}" type="button" data-action="follow" data-username="${username}"
      aria-pressed="${following}" aria-label="${label}">
      ${icon}<span>${following ? 'Following' : 'Follow'}</span>
    </button>
  `;
}

// Home ----------------------------------------------------------------------

function composerHTML() {
  return `
    <div class="composer">
      <form class="composer-row" id="composer-form">
        ${avatar(state.me, 'md')}
        <div class="composer-main">
          <label class="sr-only" for="composer-input">Write a new post</label>
          <textarea id="composer-input" name="content" rows="2" maxlength="280"
            placeholder="What’s rippling, ${esc(firstName(state.me.displayName))}?"></textarea>
          <div class="composer-foot">
            <span class="composer-hint">A thought, a question, a small win.</span>
            <span class="composer-count" id="composer-count">0/280</span>
            <button class="btn btn-primary composer-submit" id="composer-submit" type="submit" disabled>
              Post ${ICONS.arrow}
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
}

function showHome() {
  state.view = 'home';
  state.activeNav = 'home';
  state.navToken += 1;
  document.title = 'ripple — a small social space';

  const view = document.getElementById('view');
  if (!view) return;

  const me = state.me;
  const following = state.feedFilter === 'following';

  view.innerHTML = `
    <div class="page-head">
      <div>
        <p class="page-date">${esc(pageDate())}</p>
        <h1>${greeting()}, ${esc(firstName(me.displayName))}.</h1>
        <p class="page-subtitle">Here’s what’s rippling in your circle.</p>
      </div>
      <span class="page-mark" aria-hidden="true">${ICONS.spark}</span>
    </div>

    <div class="stream-toolbar">
      <div class="feed-switch" role="group" aria-label="Feed">
        <button type="button" class="${following ? '' : 'is-active'}" data-action="feed-filter" data-scope="all" aria-pressed="${!following}">For you</button>
        <button type="button" class="${following ? 'is-active' : ''}" data-action="feed-filter" data-scope="following" aria-pressed="${following}">Following</button>
      </div>
    </div>

    <div class="stream">
      ${composerHTML()}
      <div class="post-list" id="feed-list">
        ${postSkeleton(3)}
      </div>
    </div>
  `;

  setActiveNav();
  loadFeed();

  if (state.focusComposer) {
    state.focusComposer = false;
    window.requestAnimationFrame(() => {
      const input = document.getElementById('composer-input');
      if (!input) return;
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => input.focus({ preventScroll: true }), 220);
    });
  }
}

async function loadFeed() {
  if (state.view !== 'home') return;

  const list = document.getElementById('feed-list');
  if (!list) return;

  const request = ++state.feedRequest;
  const filter = state.feedFilter;
  list.innerHTML = postSkeleton(3);

  try {
    const data = await api(`/api/posts?scope=${filter === 'following' ? 'following' : 'all'}`);
    if (request !== state.feedRequest || state.view !== 'home' || state.feedFilter !== filter) return;
    state.feedPosts = data.posts;
    renderHomePosts();
  } catch (error) {
    if (request !== state.feedRequest || state.view !== 'home') return;
    const current = document.getElementById('feed-list');
    if (!current) return;
    current.innerHTML = emptyState({
      title: 'That feed didn’t load.',
      body: 'Give it another go. Your circle will still be here.',
      action: '<button class="btn btn-primary" type="button" data-action="retry-feed">Try again</button>',
    });
    if (error.status !== 401) showToast(error.message, 'error');
  }
}

function renderHomePosts() {
  const list = document.getElementById('feed-list');
  if (!list) return;

  if (!state.feedPosts.length) {
    if (state.feedFilter === 'following') {
      list.innerHTML = emptyState({
        title: 'Your circle is quiet.',
        body: 'Follow a few people and their posts will gather here.',
        action: '<a class="btn btn-primary" href="#/explore">Find people</a>',
        orbitIcon: ICONS.users,
      });
    } else {
      list.innerHTML = emptyState({
        title: 'It’s quiet here.',
        body: 'Share the first ripple. A thought, a question, a small thing you noticed.',
        action: '<button class="btn btn-primary" type="button" data-action="focus-composer">Write the first post</button>',
      });
    }
    return;
  }

  list.innerHTML = state.feedPosts.map(postHTML).join('');
}

// Posts ---------------------------------------------------------------------

function postHTML(post) {
  const liked = Boolean(post.liked);
  const username = esc(post.author.username);
  const authorName = esc(post.author.displayName);

  return `
    <article class="post" data-post-id="${post.id}">
      <header class="post-head">
        <button class="avatar-button" type="button" data-action="go-profile" data-username="${username}" aria-label="View ${authorName}’s profile">
          ${avatar(post.author, 'md')}
        </button>
        <button class="post-author" type="button" data-action="go-profile" data-username="${username}">
          <span class="post-author-line">
            <span class="post-author-name">${authorName}</span>
            <span class="post-author-handle">@${username}</span>
          </span>
          <span class="post-time">
            <time datetime="${esc(post.createdAt)}" title="${esc(fullDate(post.createdAt))}">${timeAgo(post.createdAt)}</time>
          </span>
        </button>
        ${
          post.canDelete
            ? `<button class="icon-btn post-more" type="button" data-action="delete-post" data-id="${post.id}" aria-label="Delete post" title="Delete post">${ICONS.trash}</button>`
            : ''
        }
      </header>

      <div class="post-content">${formatContent(post.content)}</div>

      <footer class="post-actions">
        <button class="action-btn ${liked ? 'is-liked' : ''}" type="button" data-action="like" data-id="${post.id}"
          aria-pressed="${liked}" aria-label="${liked ? 'Unlike' : 'Like'} ${authorName}’s post">
          ${ICONS.heart}
          <span data-like-count>${formatCount(post.likeCount)}</span>
        </button>
        <button class="action-btn" type="button" data-action="comments" data-id="${post.id}" aria-expanded="false">
          ${ICONS.comment}
          <span data-comment-count>${formatCount(post.commentCount)}</span>
          <span class="sr-only">comments</span>
        </button>
      </footer>

      <div class="comments-panel hidden" data-comments-for="${post.id}"></div>
    </article>
  `;
}

function findPost(postId) {
  const id = Number(postId);
  const lists = [
    state.feedPosts,
    state.profile?.posts,
    state.profile?.likedPosts,
    state.explorePosts,
    state.searchResults?.posts,
  ];

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    const post = list.find((item) => item.id === id);
    if (post) return post;
  }
  return null;
}

function updatePostState(postId, updater) {
  const id = Number(postId);
  const lists = [
    state.feedPosts,
    state.profile?.posts,
    state.profile?.likedPosts,
    state.explorePosts,
    state.searchResults?.posts,
  ];

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    const post = list.find((item) => item.id === id);
    if (post) updater(post);
  }
}

function removePostState(postId) {
  const id = Number(postId);
  const lists = [
    state.feedPosts,
    state.profile?.posts,
    state.profile?.likedPosts,
    state.explorePosts,
    state.searchResults?.posts,
  ];

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) list.splice(index, 1);
  }

  delete state.comments[id];
}

function syncPostDom(postId) {
  const post = findPost(postId);
  if (!post) return;

  document.querySelectorAll(`.post[data-post-id="${Number(postId)}"]`).forEach((article) => {
    const likeButton = article.querySelector('[data-action="like"]');
    if (likeButton) {
      likeButton.classList.toggle('is-liked', Boolean(post.liked));
      likeButton.setAttribute('aria-pressed', String(Boolean(post.liked)));
      likeButton.setAttribute(
        'aria-label',
        `${post.liked ? 'Unlike' : 'Like'} ${post.author.displayName}’s post`,
      );
      const count = likeButton.querySelector('[data-like-count]');
      if (count) count.textContent = formatCount(post.likeCount);
    }

    const commentButton = article.querySelector('[data-action="comments"]');
    if (commentButton) {
      const count = commentButton.querySelector('[data-comment-count]');
      if (count) count.textContent = formatCount(post.commentCount);
    }
  });
}

function commentHTML(comment) {
  return `
    <div class="comment" data-comment-id="${comment.id}">
      ${avatar(comment.author, 'xs')}
      <div class="comment-body">
        <div class="comment-meta">
          <strong>${esc(comment.author.displayName)}</strong>
          <span>@${esc(comment.author.username)}</span>
          <span>${timeAgo(comment.createdAt)}</span>
        </div>
        <p class="comment-text">${formatContent(comment.content)}</p>
      </div>
      ${
        comment.canDelete
          ? `<button class="icon-btn comment-delete" type="button" data-action="delete-comment" data-id="${comment.id}" aria-label="Delete comment" title="Delete comment">${ICONS.trash}</button>`
          : ''
      }
    </div>
  `;
}

function commentFormHTML(postId) {
  return `
    <form class="comment-form" data-post-id="${postId}">
      ${avatar(state.me, 'xs')}
      <label class="sr-only" for="comment-input-${postId}">Write a comment</label>
      <input class="comment-input" id="comment-input-${postId}" name="content" type="text" maxlength="500"
        placeholder="Add a comment…" autocomplete="off" />
      <button class="btn btn-primary comment-submit" type="submit">Reply</button>
    </form>
  `;
}

function commentsMarkup(comments) {
  return `
    <div class="comments-list">
      ${
        comments.length
          ? comments.map(commentHTML).join('')
          : '<p class="comments-empty">No comments yet. Start the conversation.</p>'
      }
    </div>
  `;
}

async function loadComments(postId, panel) {
  panel.classList.remove('hidden');
  panel.innerHTML = `
    <div class="comments-loading">
      ${Array.from(
        { length: 2 },
        () => `
          <div class="comment-skeleton">
            <div class="skeleton skeleton-avatar" style="width:28px;height:28px"></div>
            <div class="skeleton skeleton-line" style="width:62%"></div>
          </div>
        `,
      ).join('')}
    </div>
  `;

  try {
    const data = await api(`/api/posts/${postId}/comments`);
    if (!panel.isConnected) return;
    state.comments[postId] = data.comments;
    panel.dataset.loaded = 'true';
    panel.innerHTML = `${commentsMarkup(data.comments)}${commentFormHTML(postId)}`;

    updatePostState(postId, (post) => {
      post.commentCount = data.commentCount;
    });
    syncPostDom(postId);
  } catch (error) {
    if (!panel.isConnected) return;
    panel.innerHTML = `
      <p class="comments-empty">${esc(error.message)}</p>
      <button class="btn btn-ghost comment-submit" style="margin:12px auto 0;display:flex" type="button"
        data-action="retry-comments" data-id="${postId}">Try again</button>
    `;
  }
}

async function toggleComments(postId, button) {
  const article = button.closest('.post');
  if (!article) return;
  const panel = article.querySelector(`[data-comments-for="${postId}"]`);
  if (!panel) return;

  const opening = panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !opening);
  button.classList.toggle('is-open', opening);
  button.setAttribute('aria-expanded', String(opening));

  if (!opening) return;

  if (panel.dataset.loaded !== 'true') {
    await loadComments(Number(postId), panel);
  }

  if (!panel.classList.contains('hidden')) {
    const input = panel.querySelector('.comment-input');
    if (input) input.focus({ preventScroll: true });
  }
}

async function toggleLike(postId, button) {
  if (button.dataset.busy === '1') return;
  const post = findPost(postId);
  if (!post) return;

  const previousLiked = Boolean(post.liked);
  const previousCount = post.likeCount;

  button.dataset.busy = '1';
  updatePostState(postId, (item) => {
    item.liked = !previousLiked;
    item.likeCount = Math.max(0, previousCount + (previousLiked ? -1 : 1));
  });
  syncPostDom(postId);

  if (!previousLiked) {
    button.classList.remove('pop');
    void button.offsetWidth;
    button.classList.add('pop');
    window.setTimeout(() => button.classList.remove('pop'), 460);
  }

  try {
    const data = await api(`/api/posts/${postId}/like`, { method: 'POST' });
    updatePostState(postId, (item) => {
      item.liked = data.liked;
      item.likeCount = data.likeCount;
    });
    syncPostDom(postId);
  } catch (error) {
    updatePostState(postId, (item) => {
      item.liked = previousLiked;
      item.likeCount = previousCount;
    });
    syncPostDom(postId);
    showToast(error.message, 'error');
  } finally {
    delete button.dataset.busy;
  }
}

function paintFollowButton(button, following) {
  if (!button) return;

  const username = button.dataset.username || '';
  button.classList.toggle('is-following', following);
  button.disabled = false;
  button.setAttribute('aria-pressed', String(following));
  button.setAttribute('aria-label', `${following ? 'Unfollow' : 'Follow'} @${username}`);

  if (button.classList.contains('follow-icon')) {
    button.innerHTML = following ? ICONS.check : ICONS.plus;
    button.classList.toggle('btn-following', false);
    return;
  }

  button.classList.toggle('btn-following', following);
  button.innerHTML = `${following ? ICONS.check : ICONS.plus}<span>${following ? 'Following' : 'Follow'}</span>`;
}

async function toggleFollow(username) {
  if (!username) return;

  const buttons = [...document.querySelectorAll('[data-action="follow"]')].filter(
    (button) => button.dataset.username === username,
  );
  buttons.forEach((button) => {
    button.disabled = true;
  });

  try {
    const data = await api(`/api/users/${encodeURIComponent(username)}/follow`, {
      method: 'POST',
    });

    if (state.profile?.user?.username.toLowerCase() === username.toLowerCase()) {
      state.profile.user.isFollowing = data.following;
      state.profile.user.followerCount = data.followerCount;
      const count = document.querySelector('[data-profile-followers]');
      if (count) count.textContent = formatCount(data.followerCount);
    }

    state.suggestions.forEach((user) => {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        user.isFollowing = data.following;
      }
    });
    state.exploreCreators.forEach((user) => {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        user.isFollowing = data.following;
      }
    });
    if (state.searchResults) {
      state.searchResults.users.forEach((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
          user.isFollowing = data.following;
        }
      });
    }

    if (state.me) {
      state.me.followingCount = Math.max(
        0,
        Number(state.me.followingCount || 0) + (data.following ? 1 : -1),
      );
    }

    document
      .querySelectorAll('[data-action="follow"]')
      .forEach((button) => {
        if (button.dataset.username === username) {
          paintFollowButton(button, data.following);
        }
      });

    showToast(`${data.following ? 'Following' : 'Unfollowed'} @${username}.`);
    loadSuggestions();
  } catch (error) {
    buttons.forEach((button) => {
      button.disabled = false;
    });
    showToast(error.message, 'error');
  }
}

// Delete + confirm ----------------------------------------------------------

function confirmAction({ title, message, confirmLabel = 'Delete', onConfirm }) {
  state.pendingConfirm = onConfirm;
  openDialog(
    `
      <div class="modal-head">
        <div>
          <h2 id="modal-title">${esc(title)}</h2>
        </div>
        <button class="icon-btn modal-close" type="button" data-action="dialog-close" aria-label="Close">${ICONS.x}</button>
      </div>
      <div class="modal-body">
        <p>${esc(message)}</p>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="dialog-close">Keep it</button>
        <button class="btn btn-danger" type="button" data-action="confirm-action">${esc(confirmLabel)}</button>
      </div>
    `,
    'dialog-confirm',
  );
}

async function runConfirm() {
  const action = state.pendingConfirm;
  state.pendingConfirm = null;
  closeDialog();
  if (!action) return;

  try {
    await action();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function deletePostFlow(postId) {
  confirmAction({
    title: 'Delete this post?',
    message: `This removes your post and its comments for everyone. This can’t be undone.`,
    confirmLabel: 'Delete post',
    onConfirm: async () => {
      await api(`/api/posts/${postId}`, { method: 'DELETE' });

      removePostState(postId);
      if (state.me) {
        state.me.postCount = Math.max(0, Number(state.me.postCount || 0) - 1);
      }
      if (state.profile?.user?.isMe) {
        state.profile.user.postCount = Math.max(0, state.profile.user.postCount - 1);
        const count = document.querySelector('[data-profile-posts]');
        if (count) count.textContent = formatCount(state.profile.user.postCount);
      }

      const article = document.querySelector(`.post[data-post-id="${Number(postId)}"]`);
      if (article) {
        const list = article.closest('.post-list');
        article.classList.add('last-removing');
        window.setTimeout(() => {
          article.remove();
          if (list && !list.querySelector('.post')) route();
        }, 260);
      }

      showToast('Post deleted.');
    },
  });
}

function deleteCommentFlow(commentId, postId) {
  confirmAction({
    title: 'Delete this comment?',
    message: 'This removes the comment for everyone. This can’t be undone.',
    confirmLabel: 'Delete comment',
    onConfirm: async () => {
      const data = await api(`/api/comments/${commentId}`, { method: 'DELETE' });

      if (Array.isArray(state.comments[postId])) {
        state.comments[postId] = state.comments[postId].filter(
          (comment) => comment.id !== Number(commentId),
        );
      }

      const node = document.querySelector(`.comment[data-comment-id="${Number(commentId)}"]`);
      const list = node?.closest('.comments-list');
      node?.remove();

      updatePostState(postId, (post) => {
        post.commentCount = data.commentCount;
      });
      syncPostDom(postId);

      if (list && !list.querySelector('.comment')) {
        list.innerHTML = '<p class="comments-empty">No comments yet. Start the conversation.</p>';
      }
      showToast('Comment deleted.');
    },
  });
}

// Edit profile --------------------------------------------------------------

function openEditProfile() {
  const me = state.me;
  if (!me) return;

  const swatches = AVATAR_PALETTE.map(({ hex, name }) => {
    const selected = safeColor(me.avatarColor).toUpperCase() === hex.toUpperCase();
    return `
      <button class="swatch ${selected ? 'is-selected' : ''}" type="button"
        style="--swatch:${hex}" data-action="pick-color" data-color="${hex}"
        aria-label="${name} avatar" aria-pressed="${selected}" title="${name}"></button>
    `;
  }).join('');

  openDialog(`
    <form id="profile-form">
      <div class="modal-head">
        <div>
          <h2 id="modal-title">Edit profile</h2>
          <p>@${esc(me.username)} · your corner of ripple</p>
        </div>
        <button class="icon-btn modal-close" type="button" data-action="dialog-close" aria-label="Close">${ICONS.x}</button>
      </div>

      <div class="modal-body">
        <div class="profile-form">
          <div class="edit-avatar-row">
            <div id="avatar-preview">${avatar(me, 'lg')}</div>
            <div>
              <strong>Your face here</strong>
              <span>Pick a color that feels like you.</span>
            </div>
          </div>

          <div class="avatar-picker" role="group" aria-label="Avatar color">
            ${swatches}
          </div>
          <input type="hidden" name="avatarColor" id="avatar-color" value="${safeColor(me.avatarColor)}" />

          <div class="field">
            <label for="profile-name">Display name</label>
            <input class="input" id="profile-name" name="displayName" type="text" maxlength="40" required value="${esc(me.displayName)}" />
          </div>

          <div class="field">
            <label for="profile-bio">Bio</label>
            <textarea class="textarea" id="profile-bio" name="bio" maxlength="160" rows="3">${esc(me.bio)}</textarea>
            <span class="field-hint"><span>A sentence or two about you.</span><span id="bio-count">${me.bio.length}/160</span></span>
          </div>

          <div class="field">
            <label for="profile-location">Location</label>
            <input class="input" id="profile-location" name="location" type="text" maxlength="60" value="${esc(me.location)}" placeholder="Where are you?" />
          </div>

          <div class="field">
            <label for="profile-website">Website</label>
            <input class="input" id="profile-website" name="website" type="text" maxlength="120" value="${esc(me.website)}" placeholder="your.site" spellcheck="false" />
            <span class="field-hint"><span>No need to add https://</span></span>
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="dialog-close">Cancel</button>
        <button class="btn btn-primary" type="submit">Save changes</button>
      </div>
    </form>
  `);
}

function pickColor(button) {
  const color = button.dataset.color;
  if (!color) return;

  const input = document.getElementById('avatar-color');
  if (input) input.value = color;

  document.querySelectorAll('.avatar-picker .swatch').forEach((swatch) => {
    const selected = swatch === button;
    swatch.classList.toggle('is-selected', selected);
    swatch.setAttribute('aria-pressed', String(selected));
  });

  const preview = document.querySelector('#avatar-preview .avatar');
  if (preview) preview.style.setProperty('--avatar', color);
}

async function handleProfileSubmit(form) {
  const formData = new FormData(form);
  const submit = form.querySelector('button[type="submit"]');
  const label = submit?.textContent || 'Save changes';

  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Saving…';
  }

  try {
    const data = await api('/api/me', {
      method: 'PATCH',
      body: {
        displayName: formData.get('displayName'),
        bio: formData.get('bio'),
        location: formData.get('location'),
        website: formData.get('website'),
        avatarColor: formData.get('avatarColor'),
      },
    });

    state.me = data.user;
    closeDialog();
    showToast('Profile updated.');
    renderShell();
    route();
  } catch (error) {
    showToast(error.message, 'error');
    if (submit) {
      submit.disabled = false;
      submit.textContent = label;
    }
  }
}

// Follow lists --------------------------------------------------------------

function followPersonHTML(user) {
  return `
    <div class="follow-person">
      ${avatar(user, 'sm')}
      <button class="follow-person-text" type="button" data-action="go-profile" data-username="${esc(user.username)}">
        <strong>${esc(user.displayName)}</strong>
        <span>@${esc(user.username)}</span>
      </button>
      ${followButtonHTML(user, 'soft')}
    </div>
  `;
}

async function openFollowList(username, kind) {
  const title = kind === 'followers' ? 'Followers' : 'Following';

  openDialog(`
    <div class="modal-head">
      <div>
        <h2 id="modal-title">${title}</h2>
        <p>@${esc(username)}</p>
      </div>
      <button class="icon-btn modal-close" type="button" data-action="dialog-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div class="dialog-loading">
        ${Array.from(
          { length: 4 },
          () => `
            <div class="follow-person">
              <div class="skeleton skeleton-avatar" style="width:36px;height:36px"></div>
              <div class="follow-person-text">
                <div class="skeleton skeleton-line" style="width:58%"></div>
                <div class="skeleton skeleton-line" style="width:34%;margin-top:5px"></div>
              </div>
            </div>
          `,
        ).join('')}
      </div>
    </div>
  `);

  try {
    const data = await api(
      `/api/users/${encodeURIComponent(username)}/${kind === 'followers' ? 'followers' : 'following'}`,
    );
    if (!dialog.open) return;

    openDialog(`
      <div class="modal-head">
        <div>
          <h2 id="modal-title">${title}</h2>
          <p>${data.users.length} ${data.users.length === 1 ? 'person' : 'people'} · @${esc(username)}</p>
        </div>
        <button class="icon-btn modal-close" type="button" data-action="dialog-close" aria-label="Close">${ICONS.x}</button>
      </div>
      <div class="modal-body">
        ${
          data.users.length
            ? `<div class="follow-list">${data.users.map(followPersonHTML).join('')}</div>`
            : `<p class="rail-empty" style="text-align:center;padding:20px 0">No one here yet.</p>`
        }
      </div>
    `);
  } catch (error) {
    if (!dialog.open) return;
    openDialog(`
      <div class="modal-head">
        <div><h2 id="modal-title">${title}</h2></div>
        <button class="icon-btn modal-close" type="button" data-action="dialog-close" aria-label="Close">${ICONS.x}</button>
      </div>
      <div class="modal-body"><p class="rail-empty">${esc(error.message)}</p></div>
    `);
  }
}

// Explore + search ----------------------------------------------------------

function creatorCardHTML(user) {
  return `
    <article class="creator-card" style="--avatar:${safeColor(user.avatarColor)}">
      <div class="creator-top">
        ${avatar(user, 'md')}
        <span class="creator-count">${followerText(user.followerCount)}</span>
      </div>
      <button class="creator-name" type="button" data-action="go-profile" data-username="${esc(user.username)}">${esc(user.displayName)}</button>
      <div class="creator-handle">@${esc(user.username)}</div>
      <p class="creator-bio">${esc(user.bio || 'Making quiet ripples.')}</p>
      ${followButtonHTML(user, 'soft')}
    </article>
  `;
}

function showExplore() {
  state.view = 'explore';
  state.activeNav = 'explore';
  state.navToken += 1;
  document.title = 'Explore · ripple';

  const initialQuery = state.pendingQuery;
  state.pendingQuery = '';
  state.exploreQuery = '';
  state.searchResults = null;
  state.searchSeq += 1;
  state.exploreCreators = [];
  state.explorePosts = [];

  const view = document.getElementById('view');
  if (!view) return;

  view.innerHTML = `
    <section class="explore-hero">
      <h1>Find your next spark.</h1>
      <p>Search people and posts, or wander until something catches your eye.</p>
      <form class="search-box" id="explore-search-form" role="search">
        ${ICONS.search}
        <label class="sr-only" for="explore-search">Search people and posts</label>
        <input id="explore-search" type="search" placeholder="Search people, words, #tags…" autocomplete="off" value="${esc(initialQuery)}" />
        <button class="${initialQuery ? '' : 'hidden'}" id="clear-search-btn" type="button" data-action="clear-search">Clear</button>
      </form>
    </section>

    <div id="explore-defaults">
      <div class="section-head">
        <div>
          <h2>People worth knowing</h2>
          <p>A few voices you might not have met yet.</p>
        </div>
      </div>
      <div class="creator-grid" id="explore-creators">
        ${Array.from(
          { length: 4 },
          () => `
            <div class="creator-card">
              <div class="skeleton skeleton-avatar" style="width:44px;height:44px"></div>
              <div class="skeleton skeleton-line" style="width:52%;margin-top:18px"></div>
              <div class="skeleton skeleton-line" style="width:34%;margin-top:7px"></div>
              <div class="skeleton skeleton-line" style="width:88%;margin-top:13px"></div>
              <div class="skeleton skeleton-line" style="width:70%;margin-top:7px"></div>
            </div>
          `,
        ).join('')}
      </div>

      <div class="section-head">
        <div>
          <h2>Fresh ripples</h2>
          <p>What the community is sharing right now.</p>
        </div>
      </div>
      <div class="stream">
        <div class="post-list" id="explore-posts">${postSkeleton(3)}</div>
      </div>
    </div>

    <div id="search-results" class="hidden"></div>
  `;

  setActiveNav();
  loadExploreDefaults();

  if (initialQuery) {
    runSearch(initialQuery);
  }
}

async function loadExploreDefaults() {
  if (state.view !== 'explore') return;
  const request = ++state.exploreRequest;

  try {
    const [people, feed] = await Promise.all([
      api('/api/users/suggestions?limit=4'),
      api('/api/posts?scope=all'),
    ]);

    if (request !== state.exploreRequest || state.view !== 'explore') return;

    state.exploreCreators = people.users;
    state.explorePosts = feed.posts.slice(0, 8);
    renderExploreDefaults();
  } catch (error) {
    if (request !== state.exploreRequest || state.view !== 'explore') return;
    const creators = document.getElementById('explore-creators');
    const posts = document.getElementById('explore-posts');
    if (creators) {
      creators.innerHTML = `<div class="search-empty" style="grid-column:1/-1;padding:26px"><p>${esc(error.message)}</p></div>`;
    }
    if (posts) {
      posts.innerHTML = emptyState({
        title: 'Fresh ripples didn’t load.',
        body: 'Give it another go in a moment.',
        action: '<button class="btn btn-primary" type="button" data-action="retry-explore">Try again</button>',
      });
    }
  }
}

function renderExploreDefaults() {
  const creators = document.getElementById('explore-creators');
  if (creators) {
    creators.innerHTML = state.exploreCreators.length
      ? state.exploreCreators.map(creatorCardHTML).join('')
      : '<div class="search-empty" style="grid-column:1/-1;padding:28px"><h3>You know everyone.</h3><p>For now. Check back after the next ripple.</p></div>';
  }

  const posts = document.getElementById('explore-posts');
  if (posts) {
    posts.innerHTML = state.explorePosts.length
      ? state.explorePosts.map(postHTML).join('')
      : emptyState({
          title: 'The stream is still.',
          body: 'No one has posted yet. You could be first.',
          action: '<button class="btn btn-primary" type="button" data-action="focus-composer">Write something</button>',
        });
  }
}

function updateClearSearchButton() {
  const button = document.getElementById('clear-search-btn');
  if (button) button.classList.toggle('hidden', !state.exploreQuery);
}

async function runSearch(rawQuery) {
  if (state.view !== 'explore') return;

  const query = String(rawQuery || '').trim().slice(0, 60);
  if (!query) {
    clearSearch();
    return;
  }

  const input = document.getElementById('explore-search');
  if (input && input.value !== query && document.activeElement !== input) {
    input.value = query;
  }

  const defaults = document.getElementById('explore-defaults');
  const results = document.getElementById('search-results');
  if (!results) return;

  state.exploreQuery = query;
  state.searchResults = null;
  const sequence = ++state.searchSeq;

  updateClearSearchButton();
  defaults?.classList.add('hidden');
  results.classList.remove('hidden');
  results.innerHTML = `
    <p class="search-summary">Looking for “<strong>${esc(query)}</strong>”…</p>
    <div class="stream">${postSkeleton(3)}</div>
  `;

  try {
    const data = await api(`/api/search?q=${encodeURIComponent(query)}`);
    if (
      sequence !== state.searchSeq ||
      state.view !== 'explore' ||
      state.exploreQuery !== query
    ) {
      return;
    }

    state.searchResults = data;
    renderSearchResults(data);
  } catch (error) {
    if (sequence !== state.searchSeq || state.view !== 'explore') return;
    results.innerHTML = emptyState({
      title: 'Search didn’t load.',
      body: error.message,
      action: '<button class="btn btn-primary" type="button" data-action="retry-search">Try again</button>',
    });
  }
}

function compactPersonHTML(user) {
  return `
    <div class="compact-person">
      ${avatar(user, 'sm')}
      <button class="compact-person-text" type="button" data-action="go-profile" data-username="${esc(user.username)}">
        <strong>${esc(user.displayName)}</strong>
        <span>@${esc(user.username)}</span>
      </button>
      ${followButtonHTML(user, 'soft')}
    </div>
  `;
}

function renderSearchResults(data) {
  const results = document.getElementById('search-results');
  if (!results) return;

  const total = data.users.length + data.posts.length;
  const summary = `
    <p class="search-summary">
      ${total} ${total === 1 ? 'result' : 'results'} for “<strong>${esc(data.query)}</strong>”
    </p>
  `;

  if (!total) {
    results.innerHTML = `
      ${summary}
      <div class="search-empty">
        <h3>No ripples for that.</h3>
        <p>Try a different name, word, or #tag.</p>
      </div>
    `;
    return;
  }

  const people = data.users.length
    ? `
      <section class="search-section">
        <div class="section-head">
          <div><h2>People</h2></div>
          <span class="muted" style="font-size:11px">${data.users.length} found</span>
        </div>
        <div class="compact-people">${data.users.map(compactPersonHTML).join('')}</div>
      </section>
    `
    : '';

  const posts = data.posts.length
    ? `
      <section class="search-section">
        <div class="section-head">
          <div><h2>Posts</h2></div>
          <span class="muted" style="font-size:11px">${data.posts.length} found</span>
        </div>
        <div class="stream">
          <div class="post-list">${data.posts.map(postHTML).join('')}</div>
        </div>
      </section>
    `
    : '';

  results.innerHTML = `${summary}${people}${posts}`;
}

function clearSearch({ focus = false } = {}) {
  state.searchSeq += 1;
  state.exploreQuery = '';
  state.searchResults = null;

  const input = document.getElementById('explore-search');
  if (input) {
    input.value = '';
    if (focus) input.focus({ preventScroll: true });
  }

  const results = document.getElementById('search-results');
  if (results) {
    results.classList.add('hidden');
    results.innerHTML = '';
  }

  const defaults = document.getElementById('explore-defaults');
  if (defaults) defaults.classList.remove('hidden');

  updateClearSearchButton();
}

function goSearch(query) {
  const value = String(query || '').trim();
  if (!value) return;
  closeDialog();

  if (state.view === 'explore') {
    const input = document.getElementById('explore-search');
    if (input) input.value = value;
    runSearch(value);
    return;
  }

  state.pendingQuery = value;
  if (location.hash === '#/explore') {
    showExplore();
  } else {
    location.hash = '#/explore';
  }
}

// Profiles ------------------------------------------------------------------

function profileSkeleton() {
  return `
    <div class="profile-card">
      <div class="profile-cover skeleton"></div>
      <div class="profile-body" style="padding-top:28px;padding-bottom:28px">
        <div class="skeleton skeleton-line" style="width:32%;height:26px"></div>
        <div class="skeleton skeleton-line" style="width:20%;margin-top:9px"></div>
        <div class="skeleton skeleton-line" style="width:78%;margin-top:19px"></div>
        <div class="skeleton skeleton-line" style="width:58%;margin-top:8px"></div>
        <div class="skeleton skeleton-line" style="width:46%;margin-top:22px"></div>
      </div>
    </div>
    <div class="profile-feed">
      <div class="stream"><div class="post-list">${postSkeleton(2)}</div></div>
    </div>
  `;
}

function profileNotFound(username) {
  return `
    <div class="profile-not-found">
      <div class="empty-orbit">${ICONS.spark}</div>
      <h1>No one here.</h1>
      <p>@${esc(username)} hasn’t made a ripple yet.</p>
      <a class="btn btn-primary" href="#/explore">Find someone else</a>
    </div>
  `;
}

async function showProfile(username, tab = 'posts') {
  if (!username) {
    location.hash = '#/home';
    return;
  }

  state.view = 'profile';
  state.navToken += 1;
  state.profileTab = tab === 'likes' ? 'likes' : 'posts';
  state.profile = null;
  state.activeNav =
    username.toLowerCase() === state.me.username.toLowerCase() ? 'profile' : '';
  document.title = `@${username} · ripple`;

  const view = document.getElementById('view');
  if (!view) return;

  view.innerHTML = profileSkeleton();
  setActiveNav();

  const request = state.navToken;
  try {
    const data = await api(`/api/users/${encodeURIComponent(username)}`);
    if (request !== state.navToken || state.view !== 'profile') return;
    state.profile = data;
    renderProfile();
  } catch (error) {
    if (request !== state.navToken || state.view !== 'profile') return;
    if (error.status === 404) {
      view.innerHTML = profileNotFound(username);
      return;
    }
    view.innerHTML = emptyState({
      title: 'That profile didn’t load.',
      body: error.message,
      action: `<button class="btn btn-primary" type="button" data-action="retry-profile" data-username="${esc(username)}">Try again</button>`,
    });
  }
}

function profilePostsMarkup(posts, tab, user) {
  if (posts.length) return posts.map(postHTML).join('');

  if (tab === 'likes') {
    return emptyState({
      title: 'No liked posts yet.',
      body: user.isMe
        ? 'When you like someone’s post, it will gather here.'
        : 'When they like a post, it will gather here.',
      orbitIcon: ICONS.heart,
    });
  }

  if (user.isMe) {
    return emptyState({
      title: 'Your first ripple is waiting.',
      body: 'Share a thought, a question, or something small you noticed today.',
      action: '<button class="btn btn-primary" type="button" data-action="focus-composer">Write something</button>',
    });
  }

  return emptyState({
    title: 'No ripples yet.',
    body: `${user.displayName} hasn’t posted anything yet.`,
  });
}

function renderProfile() {
  const data = state.profile;
  if (!data) return;
  const view = document.getElementById('view');
  if (!view) return;

  const user = data.user;
  const tab = state.profileTab;
  const posts = tab === 'likes' ? data.likedPosts : data.posts;
  const website = websafeUrl(user.website);
  const memberYear = new Date(user.createdAt).getFullYear();
  const bio = user.bio || (user.isMe ? 'Add a short bio so people know what you’re into.' : 'No bio yet.');

  state.activeNav = user.isMe ? 'profile' : '';
  document.title = `${user.displayName} (@${user.username}) · ripple`;

  view.innerHTML = `
    <article class="profile-card">
      <div class="profile-cover" style="--avatar:${safeColor(user.avatarColor)}">
        <span class="cover-spark" aria-hidden="true"></span>
        <span class="cover-word">${memberYear ? `member since ${memberYear}` : 'on ripple'}</span>
      </div>

      <div class="profile-body">
        <div class="profile-top">
          ${avatar(user, 'xl')}
          <div class="profile-actions">
            ${
              user.isMe
                ? `<button class="btn btn-ghost" type="button" data-action="edit-profile">${ICONS.edit}<span>Edit profile</span></button>`
                : followButtonHTML(user, 'primary')
            }
          </div>
        </div>

        <div class="profile-identity">
          <h1>${esc(user.displayName)}</h1>
          <p class="profile-handle">@${esc(user.username)}</p>
        </div>

        <p class="profile-bio ${user.bio ? '' : 'muted'}">${esc(bio)}</p>

        <div class="profile-meta">
          ${user.location ? `<span>${ICONS.pin}${esc(user.location)}</span>` : ''}
          ${
            website
              ? `<a href="${esc(website.href)}" target="_blank" rel="noopener noreferrer nofollow">${ICONS.link}${esc(websiteLabel(website))}${ICONS.arrow}</a>`
              : ''
          }
          <span>${ICONS.calendar}Joined ${joinedDate(user.createdAt)}</span>
        </div>

        <div class="profile-stats">
          <span class="profile-stat"><strong data-profile-posts>${formatCount(user.postCount)}</strong> posts</span>
          <button class="profile-stat" type="button" data-action="follow-list" data-kind="followers" data-username="${esc(user.username)}">
            <strong data-profile-followers>${formatCount(user.followerCount)}</strong> followers
          </button>
          <button class="profile-stat" type="button" data-action="follow-list" data-kind="following" data-username="${esc(user.username)}">
            <strong>${formatCount(user.followingCount)}</strong> following
          </button>
        </div>

        <div class="profile-tabs" role="tablist" aria-label="Profile posts">
          <button class="profile-tab ${tab === 'posts' ? 'is-active' : ''}" type="button" role="tab"
            aria-selected="${tab === 'posts'}" aria-controls="profile-post-list" data-action="profile-tab" data-tab="posts">
            Posts
          </button>
          <button class="profile-tab ${tab === 'likes' ? 'is-active' : ''}" type="button" role="tab"
            aria-selected="${tab === 'likes'}" aria-controls="profile-post-list" data-action="profile-tab" data-tab="likes">
            Liked
          </button>
        </div>
      </div>
    </article>

    <div class="profile-feed">
      <div class="stream">
        <div class="post-list" id="profile-post-list" role="tabpanel">
          ${profilePostsMarkup(posts, tab, user)}
        </div>
      </div>
    </div>
  `;

  setActiveNav();
}

function renderProfilePosts() {
  if (!state.profile) return;
  const user = state.profile.user;
  const tab = state.profileTab;
  const posts = tab === 'likes' ? state.profile.likedPosts : state.profile.posts;
  const list = document.getElementById('profile-post-list');
  if (!list) return;

  list.innerHTML = profilePostsMarkup(posts, tab, user);

  document.querySelectorAll('.profile-tab').forEach((button) => {
    const active = button.dataset.tab === tab;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });

  const target = `#/u/${encodeURIComponent(user.username)}${tab === 'likes' ? '?tab=likes' : ''}`;
  history.replaceState(null, '', target);
}

function switchProfileTab(tab) {
  if (!state.profile || !['posts', 'likes'].includes(tab)) return;
  if (state.profileTab === tab) return;
  state.profileTab = tab;
  renderProfilePosts();
}

function goProfile(username) {
  if (!username) return;
  closeDialog();
  const target = `#/u/${encodeURIComponent(username)}`;
  if (location.hash === target) {
    route();
  } else {
    location.hash = target;
  }
}

// Compose + comment actions -------------------------------------------------

function focusComposer() {
  closeDialog();
  const input = document.getElementById('composer-input');
  if (state.view === 'home' && input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => input.focus({ preventScroll: true }), 180);
    return;
  }

  state.focusComposer = true;
  if (location.hash === '#/home') {
    showHome();
  } else {
    location.hash = '#/home';
  }
}

async function handleComposerSubmit(form) {
  const textarea = form.querySelector('#composer-input');
  const submit = form.querySelector('#composer-submit');
  const content = String(textarea?.value || '').trim();
  if (!content) return;

  if (content.length > 280) {
    showToast('Posts can be up to 280 characters.', 'error');
    return;
  }

  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Posting…';
  }

  try {
    const data = await api('/api/posts', {
      method: 'POST',
      body: { content },
    });

    if (state.view === 'home') {
      state.feedPosts.unshift(data.post);
      renderHomePosts();
    }

    if (state.me) {
      state.me.postCount = Number(state.me.postCount || 0) + 1;
    }

    if (textarea) {
      textarea.value = '';
      textarea.style.height = '';
      textarea.style.overflowY = 'hidden';
    }
    const count = document.getElementById('composer-count');
    if (count) count.textContent = '0/280';
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Post';
    }
    showToast('Your ripple is out there.');
  } catch (error) {
    showToast(error.message, 'error');
    if (submit) {
      submit.disabled = false;
      submit.textContent = 'Post';
    }
  }
}

async function handleCommentSubmit(form) {
  const postId = Number(form.dataset.postId);
  const input = form.querySelector('.comment-input');
  const submit = form.querySelector('button[type="submit"]');
  const content = String(input?.value || '').trim();
  if (!content || !postId) return;

  if (input) input.disabled = true;
  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Sending…';
  }

  try {
    const data = await api(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: { content },
    });

    const panel = form.closest('.comments-panel');
    const list = panel?.querySelector('.comments-list');
    if (list) {
      list.querySelector('.comments-empty')?.remove();
      list.insertAdjacentHTML('beforeend', commentHTML(data.comment));
    }

    if (!Array.isArray(state.comments[postId])) state.comments[postId] = [];
    state.comments[postId].push(data.comment);

    updatePostState(postId, (post) => {
      post.commentCount = data.commentCount;
    });
    syncPostDom(postId);

    if (input) {
      input.value = '';
      input.disabled = false;
      input.focus({ preventScroll: true });
    }
    if (submit) {
      submit.disabled = false;
      submit.textContent = 'Reply';
    }
  } catch (error) {
    showToast(error.message, 'error');
    if (input) input.disabled = false;
    if (submit) {
      submit.disabled = false;
      submit.textContent = 'Reply';
    }
  }
}

// Routing + events ----------------------------------------------------------

function route() {
  if (!state.me) return;
  closeDialog();
  window.scrollTo(0, 0);

  const raw = (location.hash || '#/home').replace(/^#\/?/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);

  if (parts[0] === 'u' && parts[1]) {
    let username = parts[1];
    try {
      username = decodeURIComponent(parts[1]);
    } catch {
      username = parts[1];
    }
    const query = new URLSearchParams(queryPart);
    showProfile(username, query.get('tab') === 'likes' ? 'likes' : 'posts');
    return;
  }

  if (parts[0] === 'explore') {
    showExplore();
    return;
  }

  showHome();
}

document.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  const id = Number(target.dataset.id || 0);

  switch (action) {
    case 'auth-mode':
      renderAuth(target.dataset.mode === 'signup' ? 'signup' : 'login');
      break;
    case 'demo-login':
      await demoLogin(target);
      break;
    case 'logout':
      await logout();
      break;
    case 'focus-composer':
      focusComposer();
      break;
    case 'feed-filter':
      if (!['all', 'following'].includes(target.dataset.scope)) break;
      state.feedFilter = target.dataset.scope;
      document.querySelectorAll('[data-action="feed-filter"]').forEach((button) => {
        const active = button.dataset.scope === state.feedFilter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      loadFeed();
      break;
    case 'like':
      await toggleLike(id, target);
      break;
    case 'comments':
      await toggleComments(id, target);
      break;
    case 'retry-comments': {
      const panel = target.closest('.comments-panel');
      if (panel) {
        panel.dataset.loaded = '';
        await loadComments(id, panel);
        panel.querySelector('.comment-input')?.focus({ preventScroll: true });
      }
      break;
    }
    case 'delete-post':
      deletePostFlow(id);
      break;
    case 'delete-comment': {
      const panel = target.closest('.comments-panel');
      const postId = Number(panel?.dataset.commentsFor || 0);
      if (postId) deleteCommentFlow(id, postId);
      break;
    }
    case 'follow':
      await toggleFollow(target.dataset.username);
      break;
    case 'follow-list':
      await openFollowList(target.dataset.username, target.dataset.kind);
      break;
    case 'go-profile':
      goProfile(target.dataset.username);
      break;
    case 'mention':
      goProfile(target.dataset.username);
      break;
    case 'tag':
      goSearch(`#${target.dataset.tag}`);
      break;
    case 'clear-search':
      clearSearch({ focus: true });
      break;
    case 'retry-feed':
      loadFeed();
      break;
    case 'retry-explore':
      loadExploreDefaults();
      break;
    case 'retry-profile':
      showProfile(target.dataset.username, state.profileTab);
      break;
    case 'retry-search':
      runSearch(state.exploreQuery);
      break;
    case 'profile-tab':
      switchProfileTab(target.dataset.tab);
      break;
    case 'edit-profile':
      openEditProfile();
      break;
    case 'pick-color':
      pickColor(target);
      break;
    case 'dialog-close':
      closeDialog();
      break;
    case 'confirm-action':
      await runConfirm();
      break;
    default:
      break;
  }
});

document.addEventListener('submit', async (event) => {
  const form = event.target;

  if (form.id === 'auth-form') {
    event.preventDefault();
    await handleAuthSubmit(form);
    return;
  }

  if (form.id === 'composer-form') {
    event.preventDefault();
    await handleComposerSubmit(form);
    return;
  }

  if (form.classList.contains('comment-form')) {
    event.preventDefault();
    await handleCommentSubmit(form);
    return;
  }

  if (form.id === 'profile-form') {
    event.preventDefault();
    await handleProfileSubmit(form);
    return;
  }

  if (form.id === 'explore-search-form') {
    event.preventDefault();
    const input = form.querySelector('#explore-search');
    runSearch(input?.value || '');
  }
});

document.addEventListener('input', (event) => {
  const target = event.target;

  if (target.id === 'composer-input') {
    const length = target.value.length;
    const count = document.getElementById('composer-count');
    const submit = document.getElementById('composer-submit');
    if (count) {
      count.textContent = `${length}/280`;
      count.classList.toggle('is-over', length > 280);
    }
    if (submit) {
      submit.disabled = !target.value.trim() || length > 280;
    }

    target.style.height = 'auto';
    const nextHeight = Math.min(target.scrollHeight, 210);
    target.style.height = `${nextHeight}px`;
    target.style.overflowY = target.scrollHeight > 210 ? 'auto' : 'hidden';
    return;
  }

  if (target.id === 'explore-search') {
    const value = target.value;
    state.exploreQuery = value;
    updateClearSearchButton();
    window.clearTimeout(state.searchTimer);

    if (!value.trim()) {
      clearSearch();
      return;
    }

    state.searchTimer = window.setTimeout(() => runSearch(value), 320);
    return;
  }

  if (target.id === 'profile-bio') {
    const counter = document.getElementById('bio-count');
    if (counter) counter.textContent = `${target.value.length}/160`;
  }
});

window.addEventListener('hashchange', () => {
  if (state.me) route();
});

async function boot() {
  try {
    const data = await api('/api/me');
    state.me = data.user;
    if (!/^#\/(home|explore|u\/)/.test(location.hash)) {
      history.replaceState(null, '', '#/home');
    }
    renderShell();
    route();
  } catch {
    renderAuth('login');
  }
}

boot();
