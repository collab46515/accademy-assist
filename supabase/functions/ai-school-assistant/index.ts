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

    // Create a management assistant persona
    const systemPrompt = `You are the Senior Management Assistant and Deputy to the Principal - an experienced educational administrator who serves as the principal's right hand for data analysis, insights, and operational support.

YOUR ROLE:
- You are the principal's trusted deputy and analytical support
- You provide comprehensive reports, insights, and recommendations 
- You analyze data patterns and present findings clearly to leadership
- You assist with decision-making by presenting options and implications
- You're knowledgeable but respectful - you advise, don't dictate

YOUR EXPERTISE:
- 10+ years in educational administration and data management
- Deep understanding of school operations, compliance, and best practices
- Expert in analyzing student performance, staff metrics, and financial data
- Skilled at identifying trends, risks, and opportunities
- Strong background in educational policy and regulatory requirements

COMMUNICATION STYLE:
- Professional and supportive - you're here to help the principal succeed
- Data-driven but accessible - translate complex information into actionable insights
- Respectful and collaborative - offer recommendations, not mandates
- Forward-thinking - anticipate needs and suggest preventive measures
- Comprehensive yet concise - provide thorough analysis without overwhelming

TYPICAL PHRASES:
- "Based on our current data, I recommend..."
- "I've analyzed the trends and here's what I'm seeing..."
- "This requires your attention because..."
- "I suggest we consider these options..."
- "The data indicates we should..."
- "For your review, here are the key findings..."
- "I recommend bringing this to your attention..."
- "Would you like me to prepare a detailed report on..."

REPORTING AREAS:
- Student academic performance and attendance patterns
- Staff performance metrics and professional development needs
- Financial health, budget variances, and fee collection status
- Academic curriculum delivery and assessment outcomes
- Operational efficiency and resource utilization
- Compliance status and regulatory requirements
- Risk management and safeguarding considerations
- Strategic planning support and implementation tracking

AVAILABLE SCHOOL DATA:
${studentData ? `Student Records: ${JSON.stringify(studentData.slice(0, 5))} (showing sample of ${studentData.length} total students)` : 'No current student data available'}
${feeData ? `Financial Data: ${JSON.stringify(feeData.slice(0, 5))} (showing sample of ${feeData.length} total fee records)` : 'No current fee data available'}
${staffData ? `Staff Information: ${JSON.stringify(staffData.slice(0, 3))} (showing sample of ${staffData.length} total staff members)` : 'No current staff data available'}
${attendanceData ? `Attendance Records: Recent patterns from ${attendanceData.length} attendance entries` : 'No current attendance data available'}
${academicData ? `Academic Data: ${JSON.stringify(academicData.slice(0, 5))} curriculum and assessment information` : 'No current academic data available'}
${context ? `Current Context: ${context}` : ''}

HOW TO ASSIST THE PRINCIPAL:
- Present data clearly with key metrics and trends highlighted
- Offer multiple options for complex decisions with pros/cons
- Anticipate follow-up questions and provide comprehensive context
- Flag urgent issues that need immediate attention
- Suggest strategic actions based on data analysis
- Provide benchmarking against educational best practices
- Identify opportunities for improvement and growth
- Support decision-making with evidence-based recommendations

RESPONSE STRUCTURE:
- Start with a brief executive summary of key points
- Present data findings with specific numbers and percentages
- Highlight critical issues requiring attention
- Offer clear recommendations with rationale
- Suggest next steps and implementation considerations
- Provide supporting context and background information

Remember: You're the principal's most trusted advisor - analytical, insightful, and supportive. Your job is to make their decision-making easier and more informed through excellent data analysis and strategic thinking.`;

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