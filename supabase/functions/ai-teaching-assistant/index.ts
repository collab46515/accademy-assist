import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, studentData, lessonTopic } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Enhanced system prompt for AI teaching assistant
    const systemPrompt = `You are an advanced AI Teaching Assistant with the following capabilities:

CORE ROLE:
- Provide adaptive explanations based on student comprehension levels
- Monitor student engagement and adjust difficulty in real-time
- Offer proactive interventions when students show confusion
- Generate alternative examples and multi-modal explanations

CURRENT CONTEXT:
- Lesson Topic: ${lessonTopic || 'General Education'}
- Student Context: ${JSON.stringify(studentData)}
- Class Context: ${JSON.stringify(context)}

RESPONSE GUIDELINES:
1. ADAPTIVE EXPLANATIONS: Adjust complexity based on student performance data
2. MULTI-MODAL: Suggest text, visual, or interactive explanations
3. PROACTIVE: Identify potential confusion and offer help
4. PERSONALIZED: Use student learning style preferences
5. ENCOURAGING: Maintain positive, supportive tone

STUDENT DATA ANALYSIS:
- If comprehension < 70%: Provide simpler explanations with more examples
- If engagement < 75%: Suggest interactive activities or different learning modalities
- If struggling with specific topics: Focus on foundational concepts first

Respond as a helpful, knowledgeable teaching assistant who adapts to each student's needs.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Analyze response for intervention suggestions
    const needsIntervention = studentData?.comprehensionLevel < 70 || studentData?.engagementScore < 75;
    
    return new Response(JSON.stringify({
      response: aiResponse,
      metadata: {
        needsIntervention,
        suggestedActions: needsIntervention ? [
          'Provide visual aids',
          'Slow down explanation pace',
          'Check for understanding',
          'Offer one-on-one help'
        ] : [],
        adaptationLevel: studentData?.comprehensionLevel < 70 ? 'simplified' : 'standard',
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Teaching Assistant error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm having trouble processing that request right now. Let me try to help you in a different way."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});