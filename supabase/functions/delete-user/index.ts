import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '*';
  const requestHeaders =
    req.headers.get('Access-Control-Request-Headers')
    || 'authorization, x-client-info, apikey, content-type';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': requestHeaders,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin, Access-Control-Request-Headers',
  };
}

Deno.serve(async (req: Request) => {
  const CORS_HEADERS = getCorsHeaders(req);
  console.log('[delete-user] request received', { method: req.method });

  if (req.method === 'OPTIONS') {
    console.log('[delete-user] OPTIONS preflight');
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    console.error('[delete-user] invalid method', req.method);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    console.error('[delete-user] missing or invalid auth header');
    return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[delete-user] missing env', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceRoleKey: !!serviceRoleKey,
    });
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Admin client — service role key never leaves this function
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify the caller's JWT and extract their user ID
  const userToken = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await admin.auth.getUser(userToken);
  if (authError || !user) {
    console.error('[delete-user] invalid session', authError?.message || 'no user');
    return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const userId = user.id;
  console.log('[delete-user] authenticated user', { userId });

  // Delete user data from application tables (best effort).
  const dataTables = [
    'recordings',
    'practice_attempts',
    'speaking_attempts',
    'scores',
    'user_progress',
  ];
  for (const table of dataTables) {
    const { error } = await admin.from(table).delete().eq('user_id', userId);
    if (error) {
      console.warn('[delete-user] Failed to delete rows from table:', table, error.message);
    } else {
      console.log('[delete-user] deleted rows from table:', table);
    }
  }

  // Delete files from storage buckets
  const buckets = ['speaking-recordings', 'recordings'];
  for (const bucket of buckets) {
    const { data: files, error } = await admin.storage.from(bucket).list(userId);
    if (error) {
      console.warn('[delete-user] Failed to list files in bucket:', bucket, error.message);
      continue;
    }
    if (files && files.length > 0) {
      const paths = files.map((f: { name: string }) => `${userId}/${f.name}`);
      const { error: removeError } = await admin.storage.from(bucket).remove(paths);
      if (removeError) {
        console.warn('[delete-user] Failed to remove files from bucket:', bucket, removeError.message);
      } else {
        console.log('[delete-user] removed files from bucket:', bucket, { count: paths.length });
      }
    } else {
      console.log('[delete-user] no files found in bucket:', bucket);
    }
  }

  // Hard-delete the auth user — this is the irreversible step
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error('[delete-user] deleteUser failed:', deleteError);
    return new Response(JSON.stringify({ error: deleteError.message || 'Failed to delete account' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  console.log('[delete-user] account deletion completed', { userId });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
