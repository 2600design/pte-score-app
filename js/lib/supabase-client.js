const SupabaseService = {
  client: null,
  config: window.SUPABASE_CONFIG || {},
  speakingBucket: 'speaking-recordings',
  recordingsBucket: 'recordings',

  hasConfig() {
    return !!(this.config.url && this.config.anonKey);
  },

  getMissingMessage() {
    return 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in js/config/supabase-config.js.';
  },

  getLibraryMessage() {
    return 'Supabase client library did not load. Check the @supabase/supabase-js script in index.html.';
  },

  init() {
    if (this.client) return this.client;
    if (!window.supabase) return null;
    if (!this.hasConfig()) return null;
    this.client = window.supabase.createClient(this.config.url, this.config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return this.client;
  },

  getClient() {
    return this.client || this.init();
  },

  normalizeStoragePath(filePath) {
    return String(filePath || '').replace(/^\/+/, '').trim();
  },

  getPublicStorageUrl(bucketName, filePath) {
    const normalizedPath = this.normalizeStoragePath(filePath);
    if (!normalizedPath) {
      console.error('[SupabaseStorage] Missing storage path for public URL generation.', { bucketName, filePath });
      return '';
    }

    const client = this.getClient();
    if (!client) {
      console.error('[SupabaseStorage] Supabase client unavailable while generating public URL.', { bucketName, filePath: normalizedPath });
      return '';
    }

    const { data } = client.storage.from(bucketName).getPublicUrl(normalizedPath);
    const publicUrl = data?.publicUrl || '';
    if (!publicUrl) {
      console.error('[SupabaseStorage] Failed to generate public URL from storage path.', { bucketName, filePath: normalizedPath });
      return '';
    }

    console.log('[SupabaseStorage] Generated public audio URL:', publicUrl);
    return publicUrl;
  },

  async createSignedStorageUrl(bucketName, filePath, expiresIn = 3600) {
    const normalizedPath = this.normalizeStoragePath(filePath);
    if (!normalizedPath) return '';

    const client = this.getClient();
    if (!client) {
      console.error('[SupabaseStorage] Supabase client unavailable while generating signed URL.', { bucketName, filePath: normalizedPath });
      return '';
    }

    const { data, error } = await client.storage.from(bucketName).createSignedUrl(normalizedPath, expiresIn);
    if (error) {
      console.error('[SupabaseStorage] Failed to generate signed URL from storage path.', { bucketName, filePath: normalizedPath, error });
      return '';
    }

    return data?.signedUrl || '';
  },
};

window.SupabaseService = SupabaseService;
