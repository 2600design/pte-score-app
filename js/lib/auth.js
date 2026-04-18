const USER_PROFILE_STORAGE_KEY = 'pte_user_profiles';

function getProfileStorageMap() {
  try {
    return JSON.parse(localStorage.getItem(USER_PROFILE_STORAGE_KEY) || '{}') || {};
  } catch (_error) {
    return {};
  }
}

function saveProfileStorageMap(map) {
  localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(map));
}

function getUserProfileKey(user) {
  if (!user) return 'guest';
  return user.id || user.email || 'guest';
}

window.AppProfile = {
  get(user = AppAuth?.user) {
    const map = getProfileStorageMap();
    return map[getUserProfileKey(user)] || {};
  },

  save(nextProfile, user = AppAuth?.user) {
    const map = getProfileStorageMap();
    const key = getUserProfileKey(user);
    map[key] = { ...(map[key] || {}), ...(nextProfile || {}) };
    saveProfileStorageMap(map);
    if (typeof AuthUI !== 'undefined' && AuthUI.renderTriggers) AuthUI.renderTriggers();
    if (typeof refreshCurrentPage === 'function') refreshCurrentPage();
  },

  getDisplayName(user = AppAuth?.user, lang = (typeof getAppLang === 'function' ? getAppLang() : 'zh')) {
    const profile = this.get(user);
    if (profile.displayName) return profile.displayName;
    const email = user?.email || '';
    if (email) return String(email).split('@')[0];
    return lang === 'zh' ? '同学' : 'Guest';
  },

  getAvatarUrl(user = AppAuth?.user) {
    const profile = this.get(user);
    return profile.avatarUrl || '';
  },

  getInitial(user = AppAuth?.user, lang = (typeof getAppLang === 'function' ? getAppLang() : 'zh')) {
    const name = this.getDisplayName(user, lang);
    const firstChar = (String(name).match(/[A-Za-z0-9]/) || ['A'])[0];
    return /\d/.test(firstChar) ? firstChar : firstChar.toUpperCase();
  },
};

const AppAuth = {
  user: null,
  session: null,
  ready: false,
  listeners: [],
  authMessageKey: '',

  getAuthRedirectUrl() {
    const configured =
      window.__PTE_ENV__?.PTE_AUTH_CALLBACK_URL
      || window.APP_CONFIG?.AUTH_CALLBACK_URL
      || window.PTE_AUTH_CALLBACK_URL
      || '';
    if (configured) {
      return String(configured).replace(/\/+$/, '');
    }

    const baseUrl =
      window.__PTE_ENV__?.PTE_APP_BASE_URL
      || window.APP_CONFIG?.APP_BASE_URL
      || window.PTE_APP_BASE_URL
      || '';
    const fallback = window.location.origin;
    return `${String(baseUrl || fallback).replace(/\/+$/, '')}/auth/callback`;
  },

  consumePendingMessage() {
    const key = this.authMessageKey || sessionStorage.getItem('pte_auth_message') || '';
    this.authMessageKey = '';
    if (key) sessionStorage.removeItem('pte_auth_message');
    return key;
  },

  setPendingMessage(messageKey = '') {
    this.authMessageKey = messageKey || '';
    if (messageKey) {
      sessionStorage.setItem('pte_auth_message', messageKey);
    } else {
      sessionStorage.removeItem('pte_auth_message');
    }
  },

  clearAuthParamsFromUrl() {
    const url = new URL(window.location.href);
    ['code', 'token_hash', 'type', 'access_token', 'refresh_token', 'expires_at', 'expires_in', 'token_type'].forEach(key => {
      url.searchParams.delete(key);
    });
    if (url.hash && /(access_token|refresh_token|type|error)=/i.test(url.hash)) {
      url.hash = '';
    }
    const cleanUrl = url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : '');
    window.history.replaceState({}, document.title, cleanUrl);
  },

  async handleEmailConfirmation() {
    const client = SupabaseService.getClient();
    if (!client) return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const tokenHash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    const hasHashTokens = typeof window.location.hash === 'string' && /(access_token|refresh_token)=/i.test(window.location.hash);

    if (!code && !(tokenHash && type) && !hasHashTokens) return;

    try {
      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) throw error;
        this.setPendingMessage('auth_confirmed_success');
      } else if (tokenHash && type) {
        const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
        if (error) throw error;
        this.setPendingMessage('auth_confirmed_success');
      } else if (hasHashTokens) {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (data?.session) this.setPendingMessage('auth_confirmed_success');
      }
    } catch (error) {
      console.error('[Auth] Failed to confirm email sign-up.', error);
      this.setPendingMessage('auth_confirmed_error');
    } finally {
      this.clearAuthParamsFromUrl();
    }
  },

  async init() {
    const client = SupabaseService.getClient();
    if (!client) {
      this.ready = true;
      this.notify();
      return null;
    }

    await this.handleEmailConfirmation();

    const { data, error } = await client.auth.getSession();
    if (!error) {
      this.session = data.session || null;
      this.user = data.session?.user || null;
    }

    client.auth.onAuthStateChange((event, session) => {
      this.session = session || null;
      this.user = session?.user || null;
      if (event === 'PASSWORD_RECOVERY') {
        AuthUI.openResetPassword();
        return;
      }
      this.notify();
      AuthUI.renderTriggers();
      if (typeof refreshCurrentPage === 'function') refreshCurrentPage();
    });

    this.ready = true;
    this.notify();
    const messageKey = this.consumePendingMessage();
    if (messageKey && typeof showToast === 'function') {
      showToast(t(messageKey));
    }
    return this.user;
  },

  isLoggedIn() {
    return !!this.user;
  },

  async getAccessToken() {
    if (this.session?.access_token) return this.session.access_token;
    const client = SupabaseService.getClient();
    if (!client) return '';
    const { data, error } = await client.auth.getSession();
    if (error) return '';
    this.session = data.session || null;
    this.user = data.session?.user || null;
    return this.session?.access_token || '';
  },

  onChange(listener) {
    this.listeners.push(listener);
  },

  notify() {
    this.listeners.forEach(listener => {
      try { listener({ user: this.user, session: this.session, ready: this.ready }); } catch (e) {}
    });
  },

  async signUp(email, password) {
    if (!SupabaseService.hasConfig()) throw new Error(SupabaseService.getMissingMessage());
    const client = SupabaseService.getClient();
    if (!client) throw new Error(SupabaseService.getLibraryMessage());
    const emailRedirectTo = this.getAuthRedirectUrl();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    if (!SupabaseService.hasConfig()) throw new Error(SupabaseService.getMissingMessage());
    const client = SupabaseService.getClient();
    if (!client) throw new Error(SupabaseService.getLibraryMessage());
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const client = SupabaseService.getClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async signInWithGoogle() {
    if (!SupabaseService.hasConfig()) throw new Error(SupabaseService.getMissingMessage());
    const client = SupabaseService.getClient();
    if (!client) throw new Error(SupabaseService.getLibraryMessage());
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: this.getAuthRedirectUrl() },
    });
    if (error) throw error;
  },

  async resetPasswordForEmail(email) {
    if (!SupabaseService.hasConfig()) throw new Error(SupabaseService.getMissingMessage());
    const client = SupabaseService.getClient();
    if (!client) throw new Error(SupabaseService.getLibraryMessage());
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: this.getAuthRedirectUrl(),
    });
    if (error) throw error;
  },

  async updatePassword(newPassword) {
    const client = SupabaseService.getClient();
    if (!client) throw new Error(SupabaseService.getLibraryMessage());
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  async deleteAccount() {
    if (!SupabaseService.hasConfig()) throw new Error(SupabaseService.getMissingMessage());
    const token = await this.getAccessToken();
    if (!token) throw new Error('Not authenticated.');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 20000);

    try {
      const supabaseUrl = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
      const anonKey = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || '';
      const response = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({}),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (_error) {}

      if (response.status !== 200) {
        throw new Error(payload?.error || 'Failed to delete account.');
      }
      if (payload && payload.success !== true) {
        throw new Error(payload?.error || 'Failed to delete account.');
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error('Delete account request timed out. Please try again.');
      }
      console.error('[Auth] deleteAccount failed.', error);
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  },

  async signInWithApple() {
    if (!SupabaseService.hasConfig()) throw new Error(SupabaseService.getMissingMessage());
    const client = SupabaseService.getClient();
    if (!client) throw new Error(SupabaseService.getLibraryMessage());

    // Native Sign in with Apple via Capacitor plugin (if available)
    const cap = window.Capacitor;
    if (cap && cap.isNativePlatform && cap.isNativePlatform() && cap.isPluginAvailable && cap.isPluginAvailable('SignInWithApple')) {
      const plugin = cap.Plugins.SignInWithApple;
      const result = await plugin.authorize({ scopes: ['email', 'name'] });
      const credential = result.response;
      const { error } = await client.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      if (error) throw error;
      return;
    }

    // Web / desktop / iOS WKWebView fallback — Supabase OAuth redirect
    const { error } = await client.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: this.getAuthRedirectUrl() },
    });
    if (error) throw error;
  },
};

const AuthUI = {
  ensureModal() {
    if ($('#auth-modal-overlay')) { this.refreshModalText(); return; }
    const html = `
<div id="auth-modal-overlay" class="auth-modal-overlay hidden" onclick="AuthUI.handleOverlayClick(event)">
  <div id="auth-modal" class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
    <button class="auth-modal-close" type="button" onclick="AuthUI.close()" aria-label="Close">×</button>
    <div class="auth-modal-header">
      <div class="eyebrow" id="auth-eyebrow">${t('auth_modal_eyebrow')}</div>
      <h2 id="auth-modal-title">${t('auth_modal_title_login')}</h2>
      <p id="auth-modal-copy">${t('auth_modal_copy_login')}</p>
    </div>
    <button class="btn apple-login-btn" type="button" onclick="AuthUI.signInWithApple()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.18.73 2.98.75.96-.2 1.88-.79 3.06-.84 1.52-.07 2.82.57 3.67 1.77-3.25 2.01-2.5 6.01.87 7.27-.48 1.12-1.08 2.23-2.58 3.93zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
      <span id="auth-apple-text">${t('auth_apple_btn')}</span>
    </button>
    <button class="btn google-login-btn" type="button" onclick="AuthUI.signInWithGoogle()">
      <svg width="18" height="18" viewBox="0 0 48 48" style="flex-shrink:0">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </svg>
      <span id="auth-google-text">${t('auth_google_btn')}</span>
    </button>
    <div id="auth-main-view">
      <div class="auth-divider"><span id="auth-divider-text">${t('auth_divider')}</span></div>
      <div class="auth-tabs">
        <button id="auth-tab-login" class="auth-tab active" type="button" onclick="AuthUI.switchTab('login')">${t('auth_tab_login')}</button>
        <button id="auth-tab-signup" class="auth-tab" type="button" onclick="AuthUI.switchTab('signup')">${t('auth_tab_signup')}</button>
      </div>
      <form id="auth-form" class="auth-form" onsubmit="AuthUI.submit(event)">
        <label class="auth-label" for="auth-email" id="auth-email-label">${t('auth_email_label')}</label>
        <input id="auth-email" class="auth-input" type="email" autocomplete="email" required>
        <label class="auth-label" for="auth-password" id="auth-password-label">${t('auth_password_label')}</label>
        <input id="auth-password" class="auth-input" type="password" autocomplete="current-password" required minlength="6">
        <div id="auth-error" class="auth-message error hidden"></div>
        <div id="auth-success" class="auth-message success hidden"></div>
        <button id="auth-submit" class="btn btn-primary auth-submit" type="submit">${t('auth_btn_login')}</button>
        <button id="auth-forgot-link" class="auth-forgot-link" type="button" onclick="AuthUI.showForgotPassword()">${t('auth_forgot_link')}</button>
      </form>
    </div>
    <div id="auth-forgot-view" class="hidden">
      <div class="auth-modal-header" style="margin-top:4px">
        <h2 id="auth-forgot-title">${t('auth_forgot_title')}</h2>
        <p id="auth-forgot-copy">${t('auth_forgot_copy')}</p>
      </div>
      <form id="auth-forgot-form" class="auth-form" onsubmit="AuthUI.submitForgotPassword(event)">
        <label class="auth-label" for="auth-forgot-email" id="auth-forgot-email-label">${t('auth_email_label')}</label>
        <input id="auth-forgot-email" class="auth-input" type="email" autocomplete="email" required>
        <div id="auth-forgot-error" class="auth-message error hidden"></div>
        <div id="auth-forgot-success" class="auth-message success hidden"></div>
        <button id="auth-forgot-submit" class="btn btn-primary auth-submit" type="submit">${t('auth_forgot_send')}</button>
        <button class="auth-forgot-link" type="button" onclick="AuthUI.showMainView()">${t('auth_forgot_back')}</button>
      </form>
    </div>
  </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  refreshModalText() {
    const modal = $('#auth-modal-overlay');
    if (!modal) return;
    const eyebrow = $('#auth-eyebrow');
    if (eyebrow) eyebrow.textContent = t('auth_modal_eyebrow');
    const appleText = $('#auth-apple-text');
    if (appleText) appleText.textContent = t('auth_apple_btn');
    const googleText = $('#auth-google-text');
    if (googleText) googleText.textContent = t('auth_google_btn');
    const dividerText = $('#auth-divider-text');
    if (dividerText) dividerText.textContent = t('auth_divider');
    const tabLogin = $('#auth-tab-login');
    if (tabLogin) tabLogin.textContent = t('auth_tab_login');
    const tabSignup = $('#auth-tab-signup');
    if (tabSignup) tabSignup.textContent = t('auth_tab_signup');
    const emailLabel = $('#auth-email-label');
    if (emailLabel) emailLabel.textContent = t('auth_email_label');
    const pwLabel = $('#auth-password-label');
    if (pwLabel) pwLabel.textContent = t('auth_password_label');
    const forgotLink = $('#auth-forgot-link');
    if (forgotLink) forgotLink.textContent = t('auth_forgot_link');
    const forgotTitle = $('#auth-forgot-title');
    if (forgotTitle) forgotTitle.textContent = t('auth_forgot_title');
    const forgotCopy = $('#auth-forgot-copy');
    if (forgotCopy) forgotCopy.textContent = t('auth_forgot_copy');
    const forgotEmailLabel = $('#auth-forgot-email-label');
    if (forgotEmailLabel) forgotEmailLabel.textContent = t('auth_email_label');
    const forgotSubmit = $('#auth-forgot-submit');
    if (forgotSubmit) forgotSubmit.textContent = t('auth_forgot_send');
    this.switchTab(this.tab);
  },

  tab: 'login',

  open(tab = 'login') {
    this.ensureModal();
    this.showMainView();
    this.switchTab(tab);
    $('#auth-modal-overlay').classList.remove('hidden');
    document.body.classList.add('modal-open');
    const messageKey = AppAuth.consumePendingMessage();
    if (messageKey) this.setSuccess(t(messageKey));
    setTimeout(() => $('#auth-email')?.focus(), 30);
  },

  close() {
    const overlay = $('#auth-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    this.resetMessages();
  },

  handleOverlayClick(event) {
    if (event.target.id === 'auth-modal-overlay') this.close();
  },

  switchTab(tab) {
    this.tab = tab === 'signup' ? 'signup' : 'login';
    $('#auth-tab-login')?.classList.toggle('active', this.tab === 'login');
    $('#auth-tab-signup')?.classList.toggle('active', this.tab === 'signup');
    $('#auth-modal-title').textContent = this.tab === 'login' ? t('auth_modal_title_login') : t('auth_modal_title_signup');
    $('#auth-modal-copy').textContent = this.tab === 'login' ? t('auth_modal_copy_login') : t('auth_modal_copy_signup');
    $('#auth-submit').textContent = this.tab === 'login' ? t('auth_btn_login') : t('auth_btn_signup');
    $('#auth-password')?.setAttribute('autocomplete', this.tab === 'login' ? 'current-password' : 'new-password');
    const forgotLink = $('#auth-forgot-link');
    if (forgotLink) forgotLink.classList.toggle('hidden', this.tab !== 'login');
    this.resetMessages();
  },

  setLoading(isLoading) {
    const btn = $('#auth-submit');
    if (!btn) return;
    btn.disabled = isLoading;
    btn.textContent = isLoading
      ? (this.tab === 'login' ? t('auth_btn_logging_in') : t('auth_btn_creating'))
      : (this.tab === 'login' ? t('auth_btn_login') : t('auth_btn_signup'));
  },

  resetMessages() {
    ['auth-error', 'auth-success'].forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      el.textContent = '';
      el.classList.add('hidden');
    });
  },

  setError(message) {
    const el = $('#auth-error');
    if (!el) return;
    this.resetMessages();
    el.textContent = message;
    el.classList.remove('hidden');
  },

  setSuccess(message) {
    const el = $('#auth-success');
    if (!el) return;
    this.resetMessages();
    el.textContent = message;
    el.classList.remove('hidden');
  },

  showForgotPassword() {
    $('#auth-main-view')?.classList.add('hidden');
    $('#auth-forgot-view')?.classList.remove('hidden');
    $('#auth-modal-title').textContent = t('auth_forgot_title');
    $('#auth-modal-copy').textContent = t('auth_forgot_copy');
    this.resetForgotMessages();
    setTimeout(() => $('#auth-forgot-email')?.focus(), 30);
  },

  showMainView() {
    $('#auth-forgot-view')?.classList.add('hidden');
    $('#auth-main-view')?.classList.remove('hidden');
    this.switchTab(this.tab);
    this.resetMessages();
  },

  resetForgotMessages() {
    ['auth-forgot-error', 'auth-forgot-success'].forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      el.textContent = '';
      el.classList.add('hidden');
    });
  },

  async submitForgotPassword(event) {
    event.preventDefault();
    const email = ($('#auth-forgot-email')?.value || '').trim();
    if (!email) return;
    const btn = $('#auth-forgot-submit');
    if (btn) { btn.disabled = true; btn.textContent = t('auth_forgot_sending'); }
    this.resetForgotMessages();
    try {
      await AppAuth.resetPasswordForEmail(email);
      const s = $('#auth-forgot-success');
      if (s) { s.textContent = t('auth_forgot_sent'); s.classList.remove('hidden'); }
      if (btn) { btn.disabled = true; btn.textContent = t('auth_forgot_send'); }
    } catch (err) {
      const e = $('#auth-forgot-error');
      if (e) { e.textContent = err.message || t('auth_forgot_send'); e.classList.remove('hidden'); }
      if (btn) { btn.disabled = false; btn.textContent = t('auth_forgot_send'); }
    }
  },

  ensureResetPasswordModal() {
    if ($('#auth-reset-overlay')) return;
    document.body.insertAdjacentHTML('beforeend', `
<div id="auth-reset-overlay" class="auth-modal-overlay hidden">
  <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-reset-title">
    <div class="auth-modal-header">
      <div class="eyebrow">${t('auth_modal_eyebrow')}</div>
      <h2 id="auth-reset-title">${t('auth_reset_title')}</h2>
      <p id="auth-reset-copy">${t('auth_reset_copy')}</p>
    </div>
    <form class="auth-form" onsubmit="AuthUI.submitResetPassword(event)">
      <label class="auth-label" for="auth-new-password" id="auth-new-pw-label">${t('auth_new_password_label')}</label>
      <input id="auth-new-password" class="auth-input" type="password" autocomplete="new-password" required minlength="6">
      <label class="auth-label" for="auth-confirm-password" id="auth-confirm-pw-label">${t('auth_confirm_password_label')}</label>
      <input id="auth-confirm-password" class="auth-input" type="password" autocomplete="new-password" required minlength="6">
      <div id="auth-reset-error" class="auth-message error hidden"></div>
      <div id="auth-reset-success" class="auth-message success hidden"></div>
      <button id="auth-reset-submit" class="btn btn-primary auth-submit" type="submit">${t('auth_reset_save')}</button>
    </form>
  </div>
</div>`);
  },

  openResetPassword() {
    this.ensureResetPasswordModal();
    const overlay = $('#auth-reset-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setTimeout(() => $('#auth-new-password')?.focus(), 30);
  },

  async submitResetPassword(event) {
    event.preventDefault();
    const pw = ($('#auth-new-password')?.value || '').trim();
    const confirm = ($('#auth-confirm-password')?.value || '').trim();
    const errEl = $('#auth-reset-error');
    const sucEl = $('#auth-reset-success');
    const btn = $('#auth-reset-submit');

    const showErr = (msg) => {
      if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
      if (sucEl) sucEl.classList.add('hidden');
    };

    if (pw.length < 6) { showErr(t('auth_reset_short')); return; }
    if (pw !== confirm) { showErr(t('auth_reset_mismatch')); return; }

    if (btn) { btn.disabled = true; btn.textContent = t('auth_reset_saving'); }
    if (errEl) errEl.classList.add('hidden');

    try {
      await AppAuth.updatePassword(pw);
      if (sucEl) { sucEl.textContent = t('auth_reset_success'); sucEl.classList.remove('hidden'); }
      setTimeout(() => {
        $('#auth-reset-overlay')?.classList.add('hidden');
        document.body.classList.remove('modal-open');
        if (typeof showToast === 'function') showToast(t('auth_reset_success'));
        if (typeof navigate === 'function') navigate('home');
      }, 1200);
    } catch (err) {
      showErr(err.message || t('auth_reset_mismatch'));
      if (btn) { btn.disabled = false; btn.textContent = t('auth_reset_save'); }
    }
  },

  async signInWithApple() {
    try {
      await AppAuth.signInWithApple();
    } catch (error) {
      this.ensureModal();
      this.setError(error.message || 'Apple login failed. Please try again.');
    }
  },

  async signInWithGoogle() {
    try {
      await AppAuth.signInWithGoogle();
      // page will redirect to Google — no need to close modal
    } catch (error) {
      this.ensureModal();
      this.setError(error.message || 'Google login failed. Please try again.');
    }
  },

  async submit(event) {
    event.preventDefault();
    this.resetMessages();

    const email = ($('#auth-email')?.value || '').trim();
    const password = ($('#auth-password')?.value || '').trim();
    if (!email || !password) {
      this.setError('Please enter both email and password.');
      return;
    }

    this.setLoading(true);
    try {
      if (this.tab === 'login') {
        await AppAuth.signIn(email, password);
        this.close();
      } else {
        const result = await AppAuth.signUp(email, password);
        AppAuth.setPendingMessage('');
        if (result.user && !result.session) {
          this.setSuccess(t('auth_success_verify'));
        } else {
          this.setSuccess(t('auth_success_created'));
          this.close();
        }
      }
    } catch (error) {
      this.setError(error.message || t('auth_error_fields'));
    } finally {
      this.setLoading(false);
    }
  },

  renderTriggers() {
    const slots = ['auth-slot-desktop', 'auth-slot-mobile'];
    slots.forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      if (AppAuth.isLoggedIn()) {
        const email = AppAuth.user.email || 'Account';
        const safeEmail = typeof Scorer !== 'undefined' ? Scorer.escapeHtml(email) : email;
        const initial = AppProfile.getInitial(AppAuth.user);
        const avatarUrl = AppProfile.getAvatarUrl(AppAuth.user);
        const avatarInner = avatarUrl
          ? `<img src="${avatarUrl}" alt="" class="auth-avatar-image">`
          : initial;
        if (id === 'auth-slot-mobile') {
          el.innerHTML = `
<div class="auth-user-chip auth-user-chip-mobile">
  <button class="auth-avatar ${avatarUrl ? 'has-image' : ''}" type="button" onclick="AppAuth.toggleMobileMenu(event)" title="${safeEmail} — ${t('auth_avatar_title')}">${avatarInner}</button>
  <div class="auth-dropdown-menu" onclick="event.stopPropagation()">
    <button class="auth-dropdown-item" type="button" onclick="AppAuth.openProfile()">${t('nav_account_settings')}</button>
    <div class="auth-dropdown-lang">
      <button class="auth-dropdown-mini ${getAppLang() === 'en' ? 'active' : ''}" type="button" onclick="AppAuth.setMenuLang('en')">EN</button>
      <button class="auth-dropdown-mini ${getAppLang() === 'zh' ? 'active' : ''}" type="button" onclick="AppAuth.setMenuLang('zh')">中文</button>
    </div>
    <button class="auth-dropdown-item" type="button" onclick="AppAuth.requestLogout()">${t('btn_logout')}</button>
  </div>
</div>`;
        } else {
          el.innerHTML = `
<div class="auth-user-chip">
  <button class="auth-avatar ${avatarUrl ? 'has-image' : ''}" onclick="AppAuth.requestLogout()" title="${safeEmail} — ${t('auth_avatar_title')}">${avatarInner}</button>
</div>`;
        }
      } else {
        if (id === 'auth-slot-mobile') {
          el.innerHTML = `
<div class="auth-user-chip auth-user-chip-mobile">
  <button class="auth-avatar auth-avatar-guest" type="button" onclick="AppAuth.toggleMobileMenu(event)" title="${t('auth_login_btn')}" aria-label="${t('auth_login_btn')}">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"></circle>
      <path d="M5 20c1.8-3.4 4.1-5 7-5s5.2 1.6 7 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
    </svg>
  </button>
  <div class="auth-dropdown-menu" onclick="event.stopPropagation()">
    <button class="auth-dropdown-item" type="button" onclick="AuthUI.open('login'); AppAuth.closeMobileMenu()">${t('auth_login_btn')}</button>
    <div class="auth-dropdown-lang">
      <button class="auth-dropdown-mini ${getAppLang() === 'en' ? 'active' : ''}" type="button" onclick="AppAuth.setMenuLang('en')">EN</button>
      <button class="auth-dropdown-mini ${getAppLang() === 'zh' ? 'active' : ''}" type="button" onclick="AppAuth.setMenuLang('zh')">中文</button>
    </div>
  </div>
</div>`;
        } else {
          el.innerHTML = `<button class="btn btn-outline auth-login-btn" type="button" onclick="AuthUI.open('login')">${t('auth_login_btn')}</button>`;
        }
      }
    });
  },
};

const LogoutDialog = {
  ensureModal() {
    if ($('#logout-dialog-overlay')) return;
    const html = `
<div id="logout-dialog-overlay" class="logout-dialog-overlay hidden" onclick="LogoutDialog.handleOverlayClick(event)">
  <div id="logout-dialog" class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-dialog-title" aria-describedby="logout-dialog-copy" tabindex="-1">
    <button class="logout-dialog-close" type="button" onclick="LogoutDialog.close()" aria-label="Close">×</button>
    <div class="logout-dialog-body">
      <h2 id="logout-dialog-title" class="logout-dialog-title">${t('auth_logout_dialog_title')}</h2>
      <p id="logout-dialog-copy" class="logout-dialog-copy">${t('auth_logout_dialog_copy')}</p>
    </div>
    <div class="logout-dialog-actions">
      <button id="logout-dialog-cancel" class="btn btn-secondary" type="button" onclick="LogoutDialog.close()">${t('btn_cancel')}</button>
      <button id="logout-dialog-confirm" class="btn btn-primary" type="button" onclick="LogoutDialog.confirm()">${t('btn_logout')}</button>
    </div>
  </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  refreshText() {
    if (!$('#logout-dialog-overlay')) return;
    const title = $('#logout-dialog-title');
    const copy = $('#logout-dialog-copy');
    const cancel = $('#logout-dialog-cancel');
    const confirm = $('#logout-dialog-confirm');
    if (title) title.textContent = t('auth_logout_dialog_title');
    if (copy) copy.textContent = t('auth_logout_dialog_copy');
    if (cancel) cancel.textContent = t('btn_cancel');
    if (confirm) confirm.textContent = t('btn_logout');
  },

  open() {
    this.ensureModal();
    this.refreshText();
    $('#logout-dialog-overlay')?.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setTimeout(() => $('#logout-dialog')?.focus(), 20);
  },

  close() {
    $('#logout-dialog-overlay')?.classList.add('hidden');
    document.body.classList.remove('modal-open');
  },

  handleOverlayClick(event) {
    if (event.target?.id === 'logout-dialog-overlay') this.close();
  },

  async confirm() {
    this.close();
    await AppAuth.handleLogout();
  },

  handleKeydown(event) {
    const overlay = $('#logout-dialog-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  },
};

AppAuth.toggleMobileMenu = function(event) {
  event?.stopPropagation();
  const chip = document.querySelector('#auth-slot-mobile .auth-user-chip-mobile');
  if (!chip) return;
  chip.classList.toggle('is-open');
};

AppAuth.closeMobileMenu = function() {
  const chip = document.querySelector('#auth-slot-mobile .auth-user-chip-mobile');
  if (!chip) return;
  chip.classList.remove('is-open');
};

AppAuth.openProfile = function() {
  AppAuth.closeMobileMenu();
  if (typeof navigate === 'function') navigate('account-settings');
};

AppAuth.setMenuLang = function(lang) {
  AppAuth.closeMobileMenu();
  if (typeof setAppLang === 'function') setAppLang(lang);
};

AppAuth.requestLogout = async function() {
  AppAuth.closeMobileMenu();
  LogoutDialog.open();
};

AppAuth.handleLogout = async function() {
  try {
    await AppAuth.signOut();
    showToast(t('auth_logout_toast'));
  } catch (error) {
    showToast(error.message || t('auth_logout_toast'));
  }
};

window.AppAuth = AppAuth;
window.AuthUI = AuthUI;
window.LogoutDialog = LogoutDialog;

document.addEventListener('click', () => {
  if (window.AppAuth && typeof AppAuth.closeMobileMenu === 'function') AppAuth.closeMobileMenu();
});

document.addEventListener('keydown', event => {
  if (window.LogoutDialog && typeof LogoutDialog.handleKeydown === 'function') LogoutDialog.handleKeydown(event);
});
