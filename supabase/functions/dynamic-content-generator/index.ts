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
    const { 
      contentType, 
      topic, 
      difficulty, 
      studentPerformance, 
      learningStyles,
      timeLimit 
    } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    let prompt = '';
    
    switch (contentType) {
      case 'quiz':
        prompt = `Generate a ${difficulty} level quiz about "${topic}" with the following requirements:
        - Create 5-8 questions in under 10 seconds
        - Mix question types: multiple choice, true/false, short answer
        - Adapt to student performance data: ${JSON.stringify(studentPerformance)}
        - Consider learning styles: ${learningStyles.join(', ')}
        - Include explanations for answers
        - Format as JSON with questions array
        
        Return format:
        {
          "questions": [
            {
              "type": "multiple_choice",
              "question": "...",
              "options": ["A", "B", "C", "D"],
              "correct": "A",
              "explanation": "..."
            }
          ],
          "difficulty": "${difficulty}",
          "estimatedTime": "5 minutes"
        }`;
        break;
        
      case 'practice':
        prompt = `Create personalized practice problems for "${topic}" based on:
        - Student weaknesses: ${JSON.stringify(studentPerformance?.strugglingTopics || [])}
        - Learning preferences: ${learningStyles.join(', ')}
        - Difficulty: ${difficulty}
        - Generate 3-5 unique problems with step-by-step solutions
        
        Format as JSON with problems array containing question, solution, and hints.`;
        break;
        
      case 'explanation':
        prompt = `Create a multi-modal explanation for "${topic}" that includes:
        - Text explanation adapted to ${difficulty} level
        - Visual description (what diagram/image would help)
        - Interactive activity suggestion
        - Real-world example
        - Consider student learning styles: ${learningStyles.join(', ')}
        
        Format as structured JSON with sections for each modality.`;
        break;
        
      case 'example':
        prompt = `Generate a practical example for "${topic}" that:
        - Demonstrates the concept clearly
        - Relates to student interests/background
        - Includes step-by-step breakdown
        - Suggests follow-up questions
        - Adapts to ${difficulty} difficulty level`;
        break;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a Dynamic Content Generator for AI Classrooms. Your role is to create educational content in under 10 seconds that adapts to student performance and learning styles. Always respond with valid JSON when requested.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Try to parse JSON response for structured content
    let structuredContent;
    try {
      structuredContent = JSON.parse(content);
    } catch {
      // If not JSON, wrap in standard format
      structuredContent = {
        type: contentType,
        content: content,
        generatedAt: new Date().toISOString(),
        topic,
        difficulty
      };
    }

    return new Response(JSON.stringify({
      success: true,
      data: structuredContent,
      metadata: {
        generationTime: Date.now(),
        contentType,
        topic,
        difficulty,
        adaptedFor: learningStyles
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Dynamic Content Generator error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallback: "I'll help you with this topic using a different approach."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});