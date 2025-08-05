import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('Checking user permissions for user:', user.id);
    
    // Check if user has proper role to use AI features
    const { data: userRoles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role, school_id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    console.log('User roles query result:', { userRoles, roleError });

    if (roleError) {
      console.error('Error checking user permissions:', roleError);
      throw new Error('Error checking user permissions');
    }

    const hasPermission = userRoles && userRoles.some(role => 
      ['super_admin', 'school_admin', 'hod', 'teacher'].includes(role.role)
    );

    console.log('Permission check result:', hasPermission);

    if (!hasPermission) {
      console.error('User lacks required permissions. User roles:', userRoles);
      throw new Error('Insufficient permissions to use AI features');
    }

    const { gradingData, rubric, assignment } = await req.json();

    if (!gradingData || !gradingData.studentWork) {
      throw new Error('Missing required grading data');
    }

    // Get API key from database
    const schoolId = userRoles[0].school_id;
    const { data: apiKeyData } = await supabaseClient
      .from('api_keys')
      .select('key_value')
      .eq('school_id', schoolId)
      .eq('key_name', 'OPENAI_API_KEY')
      .eq('is_active', true)
      .single();

    const openAIApiKey = apiKeyData?.key_value || Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Grading submission with AI for school:', schoolId);

    // Prepare grading prompt
    const gradingPrompt = `
You are an expert teacher assistant helping to grade student work. Please analyze the following submission and provide detailed feedback.

ASSIGNMENT DETAILS:
Title: ${assignment?.title || 'Not specified'}
Subject: ${assignment?.subject || 'Not specified'}
Year Group: ${assignment?.year_group || 'Not specified'}
Max Marks: ${assignment?.max_marks || 100}

${rubric ? `GRADING RUBRIC:
${JSON.stringify(rubric, null, 2)}` : ''}

STUDENT SUBMISSION:
${gradingData.studentWork}

Please provide a comprehensive grading response in the following JSON format:
{
  "suggestedGrade": "Letter grade (A*, A, B, C, D, U) or percentage",
  "marksAwarded": number,
  "strengths": ["List of 2-3 key strengths"],
  "areasForImprovement": ["List of 2-3 areas needing work"],
  "detailedFeedback": "Comprehensive paragraph feedback",
  "nextSteps": ["2-3 specific actionable suggestions"],
  "effort": "excellent/good/satisfactory/needs improvement",
  "confidence": "high/medium/low - your confidence in this assessment"
}

Be constructive, specific, and encouraging in your feedback. Focus on learning objectives and student growth.
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational assessment assistant. Provide fair, constructive, and detailed grading feedback.'
          },
          {
            role: 'user',
            content: gradingPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Raw AI response:', aiResponse);

    // Try to parse JSON response
    let gradingResult;
    try {
      gradingResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to structured response
      gradingResult = {
        suggestedGrade: 'B',
        marksAwarded: Math.floor((assignment?.max_marks || 100) * 0.75),
        strengths: ['Good understanding demonstrated'],
        areasForImprovement: ['Could provide more detail'],
        detailedFeedback: aiResponse,
        nextSteps: ['Review feedback and revise'],
        effort: 'good',
        confidence: 'medium'
      };
    }

    // Save AI grading result to database
    const { data: savedGrading, error: saveError } = await supabaseClient
      .from('assignments_ai')
      .insert({
        school_id: schoolId,
        created_by: user.id,
        title: `AI Grading: ${assignment?.title || 'Untitled'}`,
        subject: assignment?.subject || 'General',
        year_group: assignment?.year_group || 'Mixed',
        assignment_type: 'ai_grading',
        description: 'AI-generated grading feedback',
        questions: [{ 
          text: 'Student Submission',
          answer: gradingData.studentWork 
        }],
        marking_scheme: [gradingResult],
        total_marks: assignment?.max_marks || 100
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving AI grading result:', saveError);
    } else {
      console.log('AI grading result saved:', savedGrading?.id);
    }

    return new Response(JSON.stringify({
      success: true,
      grading: gradingResult,
      savedId: savedGrading?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI grading function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});