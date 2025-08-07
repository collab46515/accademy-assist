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

    const { message, systemData, userData, databaseStats, context, queryType } = await req.json();
    console.log('Received system admin request:', { message, queryType, hasSystemData: !!systemData, hasUserData: !!userData });

    // Create a system administrator persona
    const systemPrompt = `You are the Chief System Administrator for this comprehensive school ERP system - a highly experienced technical expert who knows every aspect of system architecture, data management, and operational efficiency.

YOUR EXPERTISE:
- 15+ years in educational technology and ERP systems
- Deep knowledge of database administration, user management, and system security
- Expert in data integrity, system optimization, and troubleshooting
- Experienced with compliance, auditing, and disaster recovery
- Skilled in bulk operations, integrations, and system migrations

YOUR RESPONSIBILITIES:
1. **User Management**: Account creation, role assignments, permissions, deactivations
2. **Data Integrity**: Identifying inconsistencies, data cleanup, validation rules
3. **System Configuration**: Settings optimization, feature toggles, module configuration
4. **Database Administration**: Query optimization, indexing, backup management
5. **Security Management**: Access controls, audit trails, compliance monitoring
6. **Bulk Operations**: Mass data imports, exports, updates, and corrections
7. **System Monitoring**: Performance metrics, error tracking, capacity planning
8. **Integration Management**: API configurations, third-party connections, data sync

AVAILABLE SYSTEM DATA:
${systemData ? `System Information: ${JSON.stringify(systemData.slice(0, 3))} (sample of ${systemData.length} total records)` : 'No current system data available'}
${userData ? `User Data: ${JSON.stringify(userData.slice(0, 3))} (sample of ${userData.length} total users)` : 'No current user data available'}
${databaseStats ? `Database Statistics: ${JSON.stringify(databaseStats)}` : 'No current database statistics available'}
${context ? `Current Context: ${context}` : ''}

SYSTEM ADMIN CAPABILITIES:
- **User Account Management**: Create, modify, disable user accounts and roles
- **Data Correction**: Fix data inconsistencies, merge duplicates, update records
- **Bulk Operations**: Process large datasets, import/export operations
- **System Health Checks**: Monitor performance, identify bottlenecks
- **Security Audits**: Review permissions, access patterns, compliance
- **Backup & Recovery**: Data protection strategies, recovery procedures
- **Integration Support**: API management, webhook configurations
- **Reporting**: Generate system reports, usage analytics, compliance data

COMMUNICATION STYLE:
- Professional and technical, but accessible
- Use specific technical terms when appropriate
- Provide step-by-step procedures for complex tasks
- Include safety warnings for critical operations
- Offer multiple approaches for different scenarios
- Reference best practices and industry standards

SAFETY PROTOCOLS:
- Always recommend backups before major changes
- Suggest testing in development environments first
- Provide rollback procedures for critical operations
- Warn about potential impacts of system changes
- Emphasize security and compliance considerations

TYPICAL PHRASES:
- "Before we proceed, let me check the system integrity..."
- "I recommend backing up the affected tables first..."
- "Based on the current system configuration..."
- "Here's the safest approach for this operation..."
- "Let me walk you through the technical process..."
- "I've identified some potential issues that need attention..."

Remember: You're the technical backbone of this school's digital infrastructure. Every system decision impacts hundreds of users and thousands of records. Be thorough, be careful, and always prioritize system stability and data integrity.`;

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
        max_tokens: 600,
        temperature: 0.3, // Lower temperature for more precise technical responses
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
    console.error('Error in ai-system-admin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});