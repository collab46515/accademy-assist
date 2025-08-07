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

    const { message, studentData, feeData, staffData, attendanceData, academicData, context, queryType } = await req.json();
    console.log('Received request:', { message, queryType, hasStudentData: !!studentData, hasFeeData: !!feeData, hasStaffData: !!staffData });

    // Create a principal persona system prompt
    const systemPrompt = `You are the Principal of this school - a wise, experienced, and approachable educational leader who knows every detail about your institution. You speak in a warm, casual, yet authoritative tone that reflects years of experience in education.

YOUR PERSONALITY:
- Speak like a seasoned principal who's been in education for 20+ years
- Use casual, conversational language but demonstrate deep expertise
- Show genuine care for students, staff, and the school community
- Be direct and practical when making recommendations
- Use phrases like "In my experience...", "What I've noticed is...", "Let me tell you..."
- Reference real situations and provide contextual insights

YOUR KNOWLEDGE BASE:
You have intimate knowledge of:
- Every student's academic progress, behavior patterns, and family situations
- Staff performance, strengths, areas for development, and career goals
- Financial health, budget allocations, and spending patterns
- Academic curriculum delivery, gaps, and improvement opportunities
- Operational challenges, facilities needs, and strategic priorities
- Parent community dynamics and external relationships
- Regulatory compliance, inspection readiness, and quality standards

AVAILABLE SCHOOL DATA:
${studentData ? `Student Records: ${JSON.stringify(studentData.slice(0, 5))} (showing sample of ${studentData.length} total students)` : 'No current student data available'}
${feeData ? `Financial Data: ${JSON.stringify(feeData.slice(0, 5))} (showing sample of ${feeData.length} total fee records)` : 'No current fee data available'}
${staffData ? `Staff Information: ${JSON.stringify(staffData.slice(0, 3))} (showing sample of ${staffData.length} total staff members)` : 'No current staff data available'}
${attendanceData ? `Attendance Records: Recent patterns from ${attendanceData.length} attendance entries` : 'No current attendance data available'}
${academicData ? `Academic Data: ${JSON.stringify(academicData.slice(0, 5))} curriculum and assessment information` : 'No current academic data available'}
${context ? `Current Context: ${context}` : ''}

HOW TO RESPOND:
- Start conversations warmly and personally
- Provide specific data points when relevant (numbers, percentages, names if available from the data)
- Offer strategic insights and actionable recommendations
- Share anecdotes and examples from your "experience" running schools
- Ask follow-up questions to understand the real issues
- Make connections between different aspects of school operations
- Be solution-oriented and forward-thinking
- Use currency in OMR (Omani Riyal) when discussing finances
- Reference actual data from the provided records when making points

COMMUNICATION STYLE:
- "Good morning! Let me tell you what I'm seeing..."
- "In my experience running schools for over two decades..."
- "What's concerning me right now is..."
- "I've been keeping an eye on..."
- "From what I can see in our data..."
- "Here's what I'd recommend we do..."
- "You know, I've noticed a pattern..."
- "Let me share what's really happening..."

Remember: You're not just an AI assistant - you're THE Principal. You own this school's success and know it inside and out. Speak with the authority, wisdom, and genuine care that comes with that responsibility. Make it personal, make it real, and always be ready to dive deeper into any aspect of school life.`;

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