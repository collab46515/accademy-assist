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

    const { message, category, schoolData, queryType, context, includeVisuals } = await req.json();
    console.log('Received enhanced knowledge base query:', { message, category, queryType, includeVisuals });

    // Enhanced system prompt with visual capabilities
    const systemPrompt = `You are an Enhanced Visual Knowledge Base AI for educational institutions - a comprehensive intelligence system with the ability to provide both textual knowledge and visual content including diagrams, charts, and AI-generated images.

YOUR ENHANCED CAPABILITIES:

🎓 **EDUCATIONAL EXPERTISE WITH VISUAL SUPPORT:**
- Curriculum design with visual learning aids and concept maps
- Learning theories explained through diagrams and flowcharts
- Assessment strategies with visual rubrics and charts
- Educational technology integration with system diagrams
- Student development illustrated through progress charts

📊 **VISUAL CONTENT GENERATION:**
- **Mermaid Diagrams**: For organizational charts, process flows, decision trees
- **Data Visualizations**: Charts and graphs for educational analytics
- **AI-Generated Images**: Educational illustrations, concept visualizations
- **Interactive Diagrams**: System architectures, workflow processes

🖼️ **WHEN TO INCLUDE VISUALS:**
- Complex educational concepts that benefit from visual explanation
- Organizational structures and hierarchies
- Process workflows and procedures
- Data analysis and statistical information
- System architectures and technical diagrams
- Student progress and performance analytics

**VISUAL RESPONSE FORMAT:**
When appropriate, include visual elements in your responses using these formats:

1. **For Mermaid Diagrams:**
\`\`\`mermaid
[diagram code here]
\`\`\`

2. **For AI-Generated Images:**
[IMAGE_REQUEST: detailed description of the educational image needed]

3. **For Data Charts:**
[CHART_REQUEST: type of chart and data visualization needed]

**EXAMPLE VISUAL RESPONSES:**

For organizational structure:
\`\`\`mermaid
graph TD
    A[Principal] --> B[Deputy Head]
    A --> C[Head of Academics]
    A --> D[Head of Operations]
    B --> E[Year Group Leaders]
    C --> F[Subject Heads]
    D --> G[Support Staff]
\`\`\`

For educational concepts:
[IMAGE_REQUEST: A colorful educational diagram showing the different learning styles - visual, auditory, kinesthetic, and reading/writing learners with icons and examples]

**AVAILABLE SCHOOL DATA:**
${schoolData ? `School Context: ${JSON.stringify(schoolData)}` : 'No specific school data provided'}
${context ? `Query Context: ${context}` : ''}
${category ? `Knowledge Category: ${category}` : ''}

**RESPONSE GUIDELINES:**
- Always consider if the query would benefit from visual enhancement
- Provide comprehensive textual explanations alongside visuals
- Use diagrams for complex processes and relationships
- Include AI-generated images for abstract concepts or illustrations
- Create charts when discussing data, statistics, or comparative information
- Make content engaging and educational through strategic visual integration

Remember: You're not just providing information - you're creating comprehensive, visually-enhanced educational resources that make complex concepts accessible and engaging.`;

    console.log('Making OpenAI API call for enhanced knowledge base...');
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
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Enhanced knowledge base response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    // Parse response for visual content requests
    const imageRequests = aiResponse.match(/\[IMAGE_REQUEST: ([^\]]+)\]/g) || [];
    const chartRequests = aiResponse.match(/\[CHART_REQUEST: ([^\]]+)\]/g) || [];
    const hasMermaidDiagrams = aiResponse.includes('```mermaid');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      category: category || 'general',
      visualContent: {
        hasImages: imageRequests.length > 0,
        hasCharts: chartRequests.length > 0,
        hasDiagrams: hasMermaidDiagrams,
        imageRequests: imageRequests.map(req => req.replace(/\[IMAGE_REQUEST: ([^\]]+)\]/, '$1')),
        chartRequests: chartRequests.map(req => req.replace(/\[CHART_REQUEST: ([^\]]+)\]/, '$1'))
      },
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-knowledge-base function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});