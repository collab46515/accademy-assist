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
    const { action, text, audioData, voice = 'Brian', model = 'eleven_turbo_v2' } = await req.json();
    
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    if (action === 'text-to-speech') {
      // Text to Speech using ElevenLabs
      const voiceIds = {
        'Brian': 'nPczCjzI2devNBz1zQrb',
        'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
        'Sarah': 'EXAVITQu4vr4xnSDxMaL',
        'Daniel': 'onwK4e9ZLuTAKqWW03F9',
        'Lily': 'pFZP5JQG7iQjIQuC4Bku'
      };

      const voiceId = voiceIds[voice as keyof typeof voiceIds] || voiceIds['Brian'];

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      return new Response(JSON.stringify({
        success: true,
        audioData: base64Audio,
        format: 'mp3',
        voice,
        model
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'speech-to-text') {
      // Speech to Text using OpenAI Whisper
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured for speech-to-text');
      }

      // Convert base64 audio to blob
      const binaryAudio = atob(audioData);
      const audioBytes = new Uint8Array(binaryAudio.length);
      for (let i = 0; i < binaryAudio.length; i++) {
        audioBytes[i] = binaryAudio.charCodeAt(i);
      }

      const formData = new FormData();
      const blob = new Blob([audioBytes], { type: 'audio/webm' });
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OpenAI Whisper error: ${response.statusText}`);
      }

      const result = await response.json();

      return new Response(JSON.stringify({
        success: true,
        transcription: result.text,
        confidence: 0.95 // Whisper doesn't return confidence, but it's generally high
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action. Use "text-to-speech" or "speech-to-text"');

  } catch (error) {
    console.error('AI Voice Service error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});