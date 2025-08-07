import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OpenAI API key is not configured');
    }

    const { message, studentData, feeData, context } = await req.json();
    console.log('Received request:', { message, studentData: !!studentData, feeData: !!feeData });

    // Create a comprehensive system prompt for fee management
    const systemPrompt = `You are an AI Fee Management Assistant for a school management system. You help parents, students, and school staff with fee-related queries.

CONTEXT:
- You have access to student fee data and can provide specific information
- You can explain fee structures, payment plans, and outstanding balances
- You should be helpful, professional, and accurate
- Always use OMR (Omani Riyal) as the currency
- If you don't have specific data, provide general helpful guidance

CAPABILITIES:
1. Answer questions about fee structures and payments
2. Explain outstanding balances and due dates
3. Provide information about payment methods and plans
4. Help with fee-related policies and procedures
5. Generate payment reminders and explanations

SAMPLE DATA CONTEXT:
${studentData ? `Student Data: ${JSON.stringify(studentData)}` : ''}
${feeData ? `Fee Data: ${JSON.stringify(feeData)}` : ''}
${context ? `Additional Context: ${context}` : ''}

Be conversational, helpful, and provide specific actionable advice when possible.`;

    console.log('Making OpenAI API call...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-fee-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});