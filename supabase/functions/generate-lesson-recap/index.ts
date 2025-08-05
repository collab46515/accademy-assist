import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check if user can use API keys
    const { data: canUse, error: permError } = await supabase
      .rpc('can_use_api_keys', { user_id: user.id });

    if (permError || !canUse) {
      throw new Error('Insufficient permissions to use AI features');
    }

    // Get OpenAI API key from management table
    const { data: apiKeyData, error: keyError } = await supabase
      .from('api_keys_management')
      .select('api_key')
      .eq('key_name', 'OPENAI_API_KEY')
      .eq('is_active', true)
      .single();

    if (keyError || !apiKeyData?.api_key) {
      throw new Error('OpenAI API key not configured');
    }

    const { 
      lesson_topic,
      subject,
      grade,
      learning_objectives,
      lesson_points,
      homework,
      lesson_date,
      language = 'English'
    } = await req.json();

    // Log API usage
    await supabase
      .from('api_key_usage_logs')
      .insert({
        key_name: 'OPENAI_API_KEY',
        used_by: user.id,
        usage_type: 'lesson_recap_generation',
        metadata: {
          lesson_topic,
          subject,
          grade
        }
      });

    const prompt = `You are an expert teacher who writes clear and engaging daily lesson recaps for students.

Generate a short and easy-to-read summary that a student can use for quick revision — even if they missed the class.

**Lesson Details:**
- Lesson Topic: ${lesson_topic}
- Subject: ${subject}
- Grade/Year Group: ${grade}
- Learning Objectives: ${learning_objectives}
- Key Points from Lesson Plan: ${lesson_points}
- Homework/Assignments: ${homework}
- Date of Lesson: ${lesson_date}
- Language: ${language}

**Instructions:**
1. Write a concise recap (150–200 words max) in a friendly and encouraging tone.
2. Include:
   - A short overview of the topic.
   - 3–5 key points explained simply.
   - 1–2 examples students can relate to.
   - Homework/tasks given.
3. Avoid jargon unless suitable for the grade.
4. Make sensible assumptions if data is incomplete.
5. Format as:

📘 Lesson Recap — ${lesson_date}
Subject: ${subject}
Topic: ${lesson_topic}

What We Learned:
- Point 1
- Point 2
- Point 3

Examples:
- Example 1
- Example 2

Homework:
- ${homework}

End of Recap.

Generate the recap in ${language} and make it appropriate for ${grade} students.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeyData.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are an expert teacher creating engaging lesson recaps for students.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedRecap = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      recap: generatedRecap,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-lesson-recap function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate lesson recap'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});