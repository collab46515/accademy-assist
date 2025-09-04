// Supabase Edge Function: admin-create-user
// Creates users via service role. Only super admins can call it.
// Includes a safe bootstrap path to create the first super admin if none exists.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const isGet = req.method === 'GET';
    const isPost = req.method === 'POST';

    if (!isGet && !isPost) {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Read input
    let payload: any = {};
    if (isPost) {
      try {
        payload = await req.json();
      } catch (_) {
        payload = {};
      }
    } else {
      // GET bootstrap support
      payload = {
        email: url.searchParams.get('email') ?? undefined,
        first_name: url.searchParams.get('first_name') ?? undefined,
        last_name: url.searchParams.get('last_name') ?? undefined,
        password: url.searchParams.get('password') ?? undefined,
        bootstrap: url.searchParams.get('bootstrap') === '1'
      };
    }

    const email = (payload.email || '').toLowerCase().trim();
    const first_name = (payload.first_name || '').trim();
    const last_name = (payload.last_name || '').trim();
    const phone = (payload.phone || '').trim() || null;
    const password = payload.password || 'TempPass123!';

    if (!email || !first_name || !last_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, first_name, last_name' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authorization: only super_admin can create users, except bootstrap
    let allowed = false;
    let requesterId: string | null = null;

    const { data: auth } = await userClient.auth.getUser();
    if (auth?.user) {
      requesterId = auth.user.id;
      // Use RPC to verify super admin
      const { data: isSA, error: saErr } = await adminClient.rpc('is_super_admin', { user_uuid: auth.user.id });
      if (saErr) console.error('is_super_admin check error:', saErr);
      allowed = Boolean(isSA);
    }

    // Bootstrap path: if no super_admin exists yet and bootstrap=true, allow creating the first super admin
    const bootstrap = Boolean(payload.bootstrap) || url.searchParams.get('bootstrap') === '1';
    if (!allowed && bootstrap) {
      const { count, error: countErr } = await adminClient
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'super_admin')
        .eq('is_active', true);

      if (countErr) {
        console.error('Count super_admins error:', countErr);
      }

      if ((count ?? 0) === 0) {
        allowed = true; // Allow first super admin for any email
      }
    }

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: only super admins can create users' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create auth user via Admin API (handles existing user gracefully)
    let newUserId: string | null = null;
    const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name, phone },
    });

    if (createErr) {
      console.error('auth.admin.createUser error:', createErr);
      // If the user already exists, try to bootstrap using the current authenticated user or existing profile
      // This supports the case where the email was previously registered
      if ((createErr as any).status === 422 || (createErr as any).code === 'email_exists') {
        // If the requester is authenticated and matches the email, trust that identity
        if (auth?.user && auth.user.email?.toLowerCase() === email) {
          newUserId = auth.user.id;
        } else {
          // Fallback: try to find an existing profile with this email
          const { data: existingProfile, error: lookupErr } = await adminClient
            .from('profiles')
            .select('user_id')
            .eq('email', email)
            .maybeSingle();
          if (lookupErr) console.error('Lookup existing profile error:', lookupErr);
          newUserId = existingProfile?.user_id ?? null;
        }

        if (!newUserId) {
          return new Response(
            JSON.stringify({ error: 'User already exists. Please sign in with this email and try again.' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: createErr.message || 'Failed to create auth user' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      newUserId = created.user?.id ?? null;
    }

    if (!newUserId) {
      return new Response(
        JSON.stringify({ error: 'Auth user creation returned no user id' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert profile
    const { error: profileErr } = await adminClient
      .from('profiles')
      .insert({
        user_id: newUserId,
        email,
        first_name,
        last_name,
        phone,
        must_change_password: true,
      });

    if (profileErr) {
      console.error('Insert profile error:', profileErr);
      // Continue, but report
    }

    // If bootstrap mode, assign super_admin role immediately; otherwise assign on demand if requested and caller is SA
    let bootstrapped = false;
    if (bootstrap) {
      const { error: roleErr } = await adminClient
        .from('user_roles')
        .insert({ user_id: newUserId, role: 'super_admin', is_active: true });
      if (roleErr) {
        console.error('Assign super_admin role error:', roleErr);
      } else {
        bootstrapped = true;
      }
    }

    const result = {
      success: true,
      user_id: newUserId,
      email,
      temp_password: password,
      created_by: requesterId,
      bootstrapped,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error('Unexpected error in admin-create-user:', e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
