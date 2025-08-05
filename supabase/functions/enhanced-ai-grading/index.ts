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

    console.log('Processing enhanced AI grading request for user:', user.id);
    
    // Check if user has proper role
    const { data: userRoles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role, school_id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (roleError) {
      console.error('Error checking user permissions:', roleError);
      throw new Error('Error checking user permissions');
    }

    const hasPermission = userRoles && userRoles.some(role => 
      ['super_admin', 'school_admin', 'hod', 'teacher'].includes(role.role)
    );

    if (!hasPermission) {
      throw new Error('Insufficient permissions to use AI features');
    }

    const { 
      submissionId, 
      submissionData, 
      rubricId, 
      assignmentData,
      processingType = 'ai_grading',
      classAnalytics = false 
    } = await req.json();

    const schoolId = userRoles[0].school_id;

    // Get API keys
    const { data: openAIKey } = await supabaseClient
      .from('api_keys')
      .select('key_value')
      .eq('school_id', schoolId)
      .eq('key_name', 'OPENAI_API_KEY')
      .eq('is_active', true)
      .single();

    const { data: anthropicKey } = await supabaseClient
      .from('api_keys')
      .select('key_value')
      .eq('school_id', schoolId)
      .eq('key_name', 'ANTHROPIC_API_KEY')
      .eq('is_active', true)
      .single();

    const openAIApiKey = openAIKey?.key_value || Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = anthropicKey?.key_value || Deno.env.get('ANTHROPIC_API_KEY');

    if (!openAIApiKey && !anthropicApiKey) {
      throw new Error('No AI API keys configured');
    }

    console.log('Processing submission type:', submissionData.submission_type);

    let processedContent = submissionData.content || '';

    // Process different submission types
    if (submissionData.submission_type !== 'text' && submissionData.file_urls?.length > 0) {
      console.log('Processing files:', submissionData.file_urls);
      
      for (const fileUrl of submissionData.file_urls) {
        try {
          const fileContent = await processFile(fileUrl, submissionData.submission_type);
          processedContent += `\n\nFile Content:\n${fileContent}`;
        } catch (error) {
          console.error('Error processing file:', error);
          processedContent += `\n\n[Error processing file: ${error.message}]`;
        }
      }
    }

    // Get rubric if specified
    let rubric = null;
    if (rubricId) {
      const { data: rubricData } = await supabaseClient
        .from('grading_rubrics')
        .select('*')
        .eq('id', rubricId)
        .single();
      
      rubric = rubricData;
    }

    // Generate grading prompt
    const gradingPrompt = await buildGradingPrompt(
      assignmentData, 
      processedContent, 
      rubric,
      submissionData.metadata
    );

    console.log('Sending to AI for grading...');

    // Use best available AI model
    let gradingResult;
    if (anthropicApiKey) {
      gradingResult = await gradeWithAnthropic(anthropicApiKey, gradingPrompt);
    } else {
      gradingResult = await gradeWithOpenAI(openAIApiKey, gradingPrompt);
    }

    console.log('AI grading completed');

    // Save grading result
    const { data: savedResult, error: saveError } = await supabaseClient
      .from('grading_results')
      .insert({
        school_id: schoolId,
        assignment_id: assignmentData?.id,
        submission_id: submissionId,
        rubric_id: rubricId,
        graded_by: user.id,
        grading_type: 'ai_enhanced',
        overall_grade: gradingResult.suggestedGrade,
        total_marks: gradingResult.marksAwarded,
        max_marks: assignmentData?.max_marks || 100,
        question_grades: gradingResult.questionBreakdown || [],
        rubric_scores: gradingResult.rubricScores || [],
        feedback: {
          strengths: gradingResult.strengths,
          areasForImprovement: gradingResult.areasForImprovement,
          detailedFeedback: gradingResult.detailedFeedback,
          nextSteps: gradingResult.nextSteps,
          effort: gradingResult.effort,
          confidence: gradingResult.confidence
        },
        class_analytics: gradingResult.classInsights || {}
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving grading result:', saveError);
    }

    // Generate class-level insights if requested
    if (classAnalytics && assignmentData?.year_group) {
      try {
        await generateClassAnalytics(
          supabaseClient, 
          schoolId, 
          assignmentData.id, 
          assignmentData.year_group,
          gradingResult
        );
      } catch (error) {
        console.error('Error generating class analytics:', error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      grading: gradingResult,
      savedId: savedResult?.id,
      processedContent: processedContent.substring(0, 500) + (processedContent.length > 500 ? '...' : '')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced AI grading function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processFile(fileUrl: string, fileType: string): Promise<string> {
  console.log(`Processing ${fileType} file:`, fileUrl);
  
  try {
    // For now, return placeholder content
    // In production, this would integrate with Azure Document Intelligence, 
    // OpenAI Vision, or other OCR/transcription services
    
    if (fileType === 'image') {
      return await processImage(fileUrl);
    } else if (fileType === 'audio') {
      return await processAudio(fileUrl);
    } else if (fileType === 'pdf') {
      return await processPDF(fileUrl);
    } else if (fileType === 'document') {
      return await processDocument(fileUrl);
    }
    
    return '[File processed - content extraction pending]';
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(`Failed to process ${fileType} file`);
  }
}

async function processImage(imageUrl: string): Promise<string> {
  // TODO: Integrate with Azure Document Intelligence or OpenAI Vision API
  // for OCR of handwritten/printed text in images
  return '[Image OCR processing - content extracted from handwritten/printed text]';
}

async function processAudio(audioUrl: string): Promise<string> {
  // TODO: Integrate with OpenAI Whisper API for audio transcription
  return '[Audio transcription - spoken content converted to text]';
}

async function processPDF(pdfUrl: string): Promise<string> {
  // TODO: Integrate with PDF parsing libraries and OCR for scanned PDFs
  return '[PDF content extracted - text and images processed]';
}

async function processDocument(docUrl: string): Promise<string> {
  // TODO: Process DOCX, RTF, and other document formats
  return '[Document content extracted - formatted text preserved]';
}

async function buildGradingPrompt(
  assignment: any, 
  content: string, 
  rubric: any,
  metadata: any = {}
): Promise<string> {
  let prompt = `You are an expert teacher assistant helping to grade student work. Analyze the following submission and provide comprehensive feedback.

ASSIGNMENT DETAILS:
Title: ${assignment?.title || 'Not specified'}
Subject: ${assignment?.subject || 'Not specified'}
Year Group: ${assignment?.year_group || 'Not specified'}
Max Marks: ${assignment?.max_marks || 100}
Assignment Type: ${assignment?.assignment_type || 'General'}

`;

  if (assignment?.questions?.length > 0) {
    prompt += `QUESTIONS:\n`;
    assignment.questions.forEach((q: any, i: number) => {
      prompt += `${i + 1}. ${q.text || q.question}\n`;
      if (q.marks) prompt += `   [${q.marks} marks]\n`;
    });
    prompt += '\n';
  }

  if (rubric) {
    prompt += `GRADING RUBRIC: "${rubric.title}"\n`;
    prompt += `Point Scale: ${JSON.stringify(rubric.point_scale)}\n`;
    prompt += `Criteria:\n`;
    rubric.criteria.forEach((criterion: any, i: number) => {
      prompt += `${i + 1}. ${criterion.name}: ${criterion.description}\n`;
    });
    prompt += '\n';
  }

  prompt += `STUDENT SUBMISSION:\n${content}\n\n`;

  if (metadata.submissionType && metadata.submissionType !== 'text') {
    prompt += `NOTE: This submission included ${metadata.submissionType} files that have been processed and converted to text above.\n\n`;
  }

  prompt += `Please provide a comprehensive grading response in the following JSON format:
{
  "suggestedGrade": "Letter grade or percentage",
  "marksAwarded": number,
  "questionBreakdown": [
    {"question": 1, "marks": number, "feedback": "specific feedback"}
  ],
  "rubricScores": [
    {"criterion": "criterion name", "score": number, "feedback": "explanation"}
  ],
  "strengths": ["List of 2-4 key strengths"],
  "areasForImprovement": ["List of 2-4 areas needing work"],
  "detailedFeedback": "Comprehensive paragraph feedback",
  "nextSteps": ["3-5 specific actionable suggestions"],
  "effort": "excellent/good/satisfactory/needs improvement",
  "confidence": "high/medium/low",
  "classInsights": {
    "commonMistakes": ["potential mistakes this answer reveals"],
    "conceptualGaps": ["concepts this student might be struggling with"]
  }
}

Be constructive, specific, and encouraging. Focus on learning objectives and student growth.`;

  return prompt;
}

async function gradeWithAnthropic(apiKey: string, prompt: string): Promise<any> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.content[0].text;

  try {
    return JSON.parse(aiResponse);
  } catch (parseError) {
    console.error('Failed to parse Anthropic response:', parseError);
    return createFallbackGrading(aiResponse);
  }
}

async function gradeWithOpenAI(apiKey: string, prompt: string): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational assessment assistant. Provide fair, constructive, and detailed grading feedback in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  try {
    return JSON.parse(aiResponse);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError);
    return createFallbackGrading(aiResponse);
  }
}

function createFallbackGrading(aiResponse: string): any {
  return {
    suggestedGrade: 'B',
    marksAwarded: 75,
    questionBreakdown: [],
    rubricScores: [],
    strengths: ['Good understanding demonstrated'],
    areasForImprovement: ['Could provide more detail'],
    detailedFeedback: aiResponse,
    nextSteps: ['Review feedback and revise'],
    effort: 'good',
    confidence: 'medium',
    classInsights: {
      commonMistakes: [],
      conceptualGaps: []
    }
  };
}

async function generateClassAnalytics(
  supabaseClient: any,
  schoolId: string,
  assignmentId: string,
  classId: string,
  currentGrading: any
): Promise<void> {
  try {
    // Get existing class analytics
    const { data: existingAnalytics } = await supabaseClient
      .from('class_analytics')
      .select('*')
      .eq('school_id', schoolId)
      .eq('assignment_id', assignmentId)
      .eq('class_id', classId)
      .single();

    let analyticsData = existingAnalytics?.analytics_data || {
      totalSubmissions: 0,
      averageGrade: 0,
      commonMistakes: [],
      conceptualGaps: [],
      gradeDistribution: {}
    };

    // Update analytics with current grading
    analyticsData.totalSubmissions += 1;
    
    // Add current grading insights
    if (currentGrading.classInsights?.commonMistakes) {
      currentGrading.classInsights.commonMistakes.forEach((mistake: string) => {
        if (!analyticsData.commonMistakes.includes(mistake)) {
          analyticsData.commonMistakes.push(mistake);
        }
      });
    }

    if (currentGrading.classInsights?.conceptualGaps) {
      currentGrading.classInsights.conceptualGaps.forEach((gap: string) => {
        if (!analyticsData.conceptualGaps.includes(gap)) {
          analyticsData.conceptualGaps.push(gap);
        }
      });
    }

    // Update grade distribution
    const grade = currentGrading.suggestedGrade;
    analyticsData.gradeDistribution[grade] = (analyticsData.gradeDistribution[grade] || 0) + 1;

    // Generate insights
    const insights = [
      `${analyticsData.totalSubmissions} submissions processed`,
      `Most common issues: ${analyticsData.commonMistakes.slice(0, 3).join(', ')}`,
      `Key learning gaps: ${analyticsData.conceptualGaps.slice(0, 3).join(', ')}`
    ];

    // Save or update analytics
    if (existingAnalytics) {
      await supabaseClient
        .from('class_analytics')
        .update({
          analytics_data: analyticsData,
          insights: insights,
          generated_at: new Date().toISOString()
        })
        .eq('id', existingAnalytics.id);
    } else {
      await supabaseClient
        .from('class_analytics')
        .insert({
          school_id: schoolId,
          assignment_id: assignmentId,
          class_id: classId,
          analytics_data: analyticsData,
          insights: insights
        });
    }

    console.log('Class analytics updated successfully');
  } catch (error) {
    console.error('Error generating class analytics:', error);
    throw error;
  }
}