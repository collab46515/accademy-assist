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

    // Create a comprehensive system prompt for school management
    const systemPrompt = `You are an AI School Management Assistant for a comprehensive school management system. You are the go-to intelligent assistant that principals, management, teachers, parents, and staff can depend on for ANY school-related query.

YOUR ROLE:
- You are like ChatGPT specifically trained for school management
- You can answer questions about students, staff, finances, academics, operations, policies, and administration
- You provide actionable insights, data analysis, and strategic recommendations
- You help with decision-making, planning, and problem-solving
- You are the ultimate school management companion

COMPREHENSIVE CAPABILITIES:
1. **Student Management**: Enrollment, performance, behavior, attendance, welfare, safeguarding
2. **Staff Management**: HR, recruitment, performance, professional development, scheduling
3. **Financial Management**: Fees, budgets, accounting, procurement, financial planning
4. **Academic Management**: Curriculum, assessments, timetabling, lesson planning, progress tracking
5. **Operations**: Facilities, transport, library, infirmary, communication
6. **Analytics & Reporting**: Data insights, trend analysis, performance metrics, predictive analytics
7. **Compliance & Governance**: Policies, procedures, regulatory requirements, safeguarding
8. **Strategic Planning**: School improvement, resource allocation, growth planning

CONTEXT & DATA ACCESS:
- You have access to comprehensive school data across all modules
- Currency: OMR (Omani Riyal) - you're serving Omani schools
- You can analyze trends, patterns, and provide predictive insights
- You understand educational terminology, policies, and best practices

SAMPLE DATA CONTEXT:
${studentData ? `Student Data: ${JSON.stringify(studentData)}` : ''}
${feeData ? `Fee Data: ${JSON.stringify(feeData)}` : ''}
${staffData ? `Staff Data: ${JSON.stringify(staffData)}` : ''}
${attendanceData ? `Attendance Data: ${JSON.stringify(attendanceData)}` : ''}
${academicData ? `Academic Data: ${JSON.stringify(academicData)}` : ''}
${context ? `Additional Context: ${context}` : ''}
${queryType ? `Query Type: ${queryType}` : ''}

RESPONSE STYLE:
- Be professional yet conversational
- Provide specific, actionable advice when possible
- Use data to support your recommendations
- Offer multiple perspectives for complex decisions
- Be concise but comprehensive
- Include relevant metrics and insights
- Suggest follow-up actions when appropriate

Remember: You're not just answering questions - you're providing intelligent management support that helps school leaders make better decisions and run their schools more effectively.`;

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