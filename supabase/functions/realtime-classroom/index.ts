import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Creating ephemeral token for virtual classroom WebRTC connection...');

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: `You are an AI teaching assistant in a virtual classroom environment. Your role is to:

1. **Educational Support**: Help students understand lesson concepts through clear, age-appropriate explanations
2. **Question Assistance**: Answer student questions about the current topic being discussed in class
3. **Encouraging Feedback**: Provide positive, constructive feedback to boost student confidence
4. **Learning Resources**: Suggest appropriate practice problems, study materials, or learning strategies
5. **Group Facilitation**: Help facilitate breakout group discussions and collaborative activities
6. **Classroom Management**: Assist with basic classroom flow (like explaining assignment instructions)

**Communication Guidelines:**
- Keep responses concise and educational (1-2 sentences for quick questions)
- Use a friendly, supportive tone appropriate for students
- Speak at an appropriate pace for learning
- If students ask off-topic questions, gently guide them back to the lesson
- For complex topics requiring detailed explanation, suggest they ask their teacher for comprehensive help
- Encourage participation and celebrate learning achievements

**Current Classroom Context:**
- This is an active learning session with students and a teacher present
- Students may be working individually, in groups, or listening to instruction
- Your responses should complement, not replace, the teacher's instruction

Remember: You are a supportive learning companion, not the primary instructor.`
      }),
    });

    const data = await response.json();
    console.log("Virtual classroom session created:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating virtual classroom session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});