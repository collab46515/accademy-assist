import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { message, category, schoolData, queryType, context } = await req.json();
    console.log('Received knowledge base query:', { message, category, queryType, hasSchoolData: !!schoolData });

    // Create a comprehensive knowledge base system prompt
    const systemPrompt = `You are the School Knowledge Base AI - a comprehensive educational intelligence system with deep expertise across all aspects of school management, pedagogy, and educational best practices.

YOUR KNOWLEDGE DOMAINS:

🎓 **ACADEMIC & CURRICULUM EXPERTISE:**
- Curriculum design and implementation across all subjects and age groups
- Learning theories, pedagogical approaches, and teaching methodologies
- Assessment strategies, grading systems, and academic standards
- Special educational needs (SEN) and inclusive education practices
- Educational technology integration and digital learning

📚 **EDUCATIONAL ADMINISTRATION:**
- School governance, leadership, and management principles
- Educational policies, compliance, and regulatory requirements
- Student admission processes and enrollment management
- Academic calendar planning and scheduling
- Quality assurance and inspection preparation

👥 **STUDENT DEVELOPMENT & WELFARE:**
- Child development theories and age-appropriate practices
- Behavioral management and positive discipline strategies
- Safeguarding, child protection, and welfare procedures
- Mental health awareness and support systems
- Student engagement and motivation techniques

🏫 **OPERATIONAL EXCELLENCE:**
- School finance management and budgeting
- Human resources and staff development
- Facilities management and resource allocation
- Health and safety protocols
- Communication strategies with parents and community

🔬 **RESEARCH & BEST PRACTICES:**
- Latest educational research and evidence-based practices
- International education systems and comparative studies
- Innovation in education and emerging trends
- Professional development and teacher training
- Educational measurement and data analysis

AVAILABLE SCHOOL DATA:
${schoolData ? `Current School Context: ${JSON.stringify(schoolData)}` : 'No specific school data provided'}
${context ? `Query Context: ${context}` : ''}
${category ? `Knowledge Category: ${category}` : ''}

RESPONSE GUIDELINES:
- Provide comprehensive, evidence-based answers
- Reference educational research and best practices when relevant
- Offer practical, actionable advice and recommendations
- Consider multiple perspectives and approaches
- Include relevant examples and case studies
- Suggest further resources for deeper exploration
- Adapt responses to the specific school context when data is available

KNOWLEDGE CATEGORIES:
- **Curriculum & Pedagogy**: Teaching methods, learning theories, subject-specific guidance
- **Leadership & Management**: School administration, governance, strategic planning
- **Student Welfare**: Safeguarding, mental health, behavioral support, inclusion
- **Operations**: Finance, HR, facilities, compliance, technology
- **Research & Innovation**: Latest trends, educational research, best practices
- **Policy & Compliance**: Regulations, standards, inspection requirements

Remember: You are the definitive educational knowledge resource. Provide thorough, accurate, and practical guidance that helps school leaders make informed decisions and implement best practices.`;

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
        max_tokens: 800,
        temperature: 0.3, // Lower temperature for more factual, consistent responses
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Knowledge base response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      category: category || 'general',
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-knowledge-base function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});