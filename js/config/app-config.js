window.__PTE_ENV__ = window.__PTE_ENV__ || {};
window.APP_CONFIG = window.APP_CONFIG || {};

const hostname = window.location.hostname || '';
const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
const fallbackApiBaseUrl = isLocalHost ? 'http://localhost:8000' : '';
const fallbackAppBaseUrl = isLocalHost ? '' : window.location.origin;
const configuredApiBaseUrl =
  window.__PTE_ENV__.PTE_API_BASE_URL ||
  window.APP_CONFIG.API_BASE_URL ||
  window.PTE_API_BASE_URL ||
  fallbackApiBaseUrl;
const configuredAppBaseUrl =
  window.__PTE_ENV__.PTE_APP_BASE_URL ||
  window.APP_CONFIG.APP_BASE_URL ||
  window.PTE_APP_BASE_URL ||
  fallbackAppBaseUrl;
const configuredAuthCallbackUrl =
  window.__PTE_ENV__.PTE_AUTH_CALLBACK_URL ||
  window.APP_CONFIG.AUTH_CALLBACK_URL ||
  window.PTE_AUTH_CALLBACK_URL ||
  (configuredAppBaseUrl ? `${String(configuredAppBaseUrl).replace(/\/+$/, '')}/auth/callback` : '');

window.APP_CONFIG.API_BASE_URL = configuredApiBaseUrl;
window.PTE_API_BASE_URL = configuredApiBaseUrl;
window.APP_CONFIG.APP_BASE_URL = configuredAppBaseUrl;
window.PTE_APP_BASE_URL = configuredAppBaseUrl;
window.APP_CONFIG.AUTH_CALLBACK_URL = configuredAuthCallbackUrl;
window.PTE_AUTH_CALLBACK_URL = configuredAuthCallbackUrl;
