// Supabase configuration
//
// Preferred:
// - If you later move this project into Vite, expose:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
//
// Current static-app fallback:
// - Paste your Supabase project URL / anon key below if you are not injecting env values.
// - Do not put service-role keys here.

window.__PTE_ENV__ = window.__PTE_ENV__ || {};

window.SUPABASE_CONFIG = {
  url:
    window.__PTE_ENV__.VITE_SUPABASE_URL ||
    window.VITE_SUPABASE_URL ||
    'https://gvpesibmlfdriluhuxmx.supabase.co',
  anonKey:
    window.__PTE_ENV__.VITE_SUPABASE_ANON_KEY ||
    window.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_kfLWOyb1FRp_fATrAE65XA_Om28KlnP',

  // Static fallback for this non-Vite app:
  // url: 'https://YOUR_PROJECT.supabase.co',
  // anonKey: 'YOUR_SUPABASE_ANON_KEY',
};
