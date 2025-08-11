import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get request body
    const { amount, currency = "gbp", description, metadata } = await req.json();

    // Validate required fields
    if (!amount || amount <= 0) {
      throw new Error("Valid amount is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: description || "School Fee Payment",
              description: `Application: ${metadata?.application_number || 'N/A'}`
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/admissions?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/admissions?payment=cancelled`,
      metadata: metadata || {},
      customer_email: metadata?.parent_email,
    });

    // Log the payment session creation
    console.log(`Payment session created: ${session.id} for application: ${metadata?.application_id}`);

    // Optionally, store payment session info in Supabase
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update application with payment session info
    if (metadata?.application_id) {
      const { data: application } = await supabaseService
        .from("enrollment_applications")
        .select("additional_data")
        .eq("id", metadata.application_id)
        .single();

      if (application) {
        const existingData = application.additional_data || {};
        await supabaseService
          .from("enrollment_applications")
          .update({
            additional_data: {
              ...existingData,
              stripe_sessions: [
                ...(existingData.stripe_sessions || []),
                {
                  session_id: session.id,
                  amount: amount,
                  currency: currency,
                  status: "pending",
                  created_at: new Date().toISOString(),
                  description: description,
                  payment_stage: metadata.payment_stage
                }
              ]
            }
          })
          .eq("id", metadata.application_id);
      }
    }

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});