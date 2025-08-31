import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Confirm both test accounts
    const testEmails = ['test.student@doxa.academy', 'test.parent@doxa.academy'];
    const results = [];

    for (const email of testEmails) {
      try {
        // Get user by email
        const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (getUserError) {
          console.error(`Error getting users:`, getUserError);
          continue;
        }

        const user = users.users.find(u => u.email === email);
        
        if (user && !user.email_confirmed_at) {
          // Confirm the user's email
          const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
          );

          if (error) {
            console.error(`Error confirming ${email}:`, error);
            results.push({ email, status: 'error', error: error.message });
          } else {
            console.log(`✅ Confirmed ${email}`);
            results.push({ email, status: 'confirmed' });
          }
        } else if (user && user.email_confirmed_at) {
          console.log(`✅ ${email} already confirmed`);
          results.push({ email, status: 'already_confirmed' });
        } else {
          console.log(`❌ User ${email} not found`);
          results.push({ email, status: 'not_found' });
        }
      } catch (err) {
        console.error(`Error processing ${email}:`, err);
        results.push({ email, status: 'error', error: err.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test accounts confirmation process completed',
        results 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in confirm-test-accounts function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
};

serve(handler);