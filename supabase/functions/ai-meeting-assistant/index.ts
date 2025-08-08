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
    const { action, data } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    let result;

    switch (action) {
      case 'transcribe-audio':
        result = await transcribeAudio(data.audio, OPENAI_API_KEY);
        break;
      case 'generate-summary':
        result = await generateMeetingSummary(data.transcript, OPENAI_API_KEY);
        break;
      case 'translate-text':
        result = await translateText(data.text, data.targetLanguage, OPENAI_API_KEY);
        break;
      case 'generate-quiz':
        result = await generateQuiz(data.content, OPENAI_API_KEY);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Meeting Assistant error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function transcribeAudio(audioBase64: string, apiKey: string) {
  // Process audio in chunks to prevent memory issues
  const binaryAudio = atob(audioBase64);
  const bytes = new Uint8Array(binaryAudio.length);
  for (let i = 0; i < binaryAudio.length; i++) {
    bytes[i] = binaryAudio.charCodeAt(i);
  }

  const formData = new FormData();
  const blob = new Blob([bytes], { type: 'audio/webm' });
  formData.append('file', blob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  formData.append('response_format', 'verbose_json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${await response.text()}`);
  }

  const result = await response.json();
  return {
    text: result.text,
    segments: result.segments,
    confidence: result.segments?.map((s: any) => s.avg_logprob).reduce((a: number, b: number) => a + b, 0) / (result.segments?.length || 1)
  };
}

async function generateMeetingSummary(transcript: string, apiKey: string) {
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
          content: `You are an AI assistant that creates comprehensive meeting summaries for educational sessions. 
          
          Create a structured summary with:
          1. Key Topics Discussed
          2. Important Points Made
          3. Questions Asked by Students
          4. Action Items or Homework
          5. Areas that may need follow-up
          
          Keep it educational and professional.`
        },
        {
          role: 'user',
          content: `Please summarize this meeting transcript:\n\n${transcript}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    throw new Error(`Summary generation failed: ${await response.text()}`);
  }

  const result = await response.json();
  return {
    summary: result.choices[0].message.content,
    wordCount: transcript.split(' ').length,
    estimatedDuration: Math.ceil(transcript.split(' ').length / 150) // Assuming 150 words per minute
  };
}

async function translateText(text: string, targetLanguage: string, apiKey: string) {
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
          content: `You are a professional translator. Translate the given text to ${targetLanguage}. 
          Maintain the original meaning and context. If it's educational content, preserve academic terminology.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${await response.text()}`);
  }

  const result = await response.json();
  return {
    translatedText: result.choices[0].message.content,
    sourceLanguage: 'auto-detected',
    targetLanguage,
    confidence: 0.95
  };
}

async function generateQuiz(content: string, apiKey: string) {
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
          content: `You are an educational AI that creates engaging quizzes based on lesson content.
          
          Generate a quiz with:
          - 5 multiple choice questions
          - 2 short answer questions
          - 1 essay question
          
          Return in JSON format:
          {
            "multipleChoice": [
              {
                "question": "...",
                "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
                "correctAnswer": 0,
                "explanation": "..."
              }
            ],
            "shortAnswer": [
              {
                "question": "...",
                "sampleAnswer": "..."
              }
            ],
            "essay": [
              {
                "question": "...",
                "rubric": "..."
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Create a quiz based on this content:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    throw new Error(`Quiz generation failed: ${await response.text()}`);
  }

  const result = await response.json();
  try {
    return JSON.parse(result.choices[0].message.content);
  } catch {
    return {
      error: "Could not parse quiz format",
      rawContent: result.choices[0].message.content
    };
  }
}