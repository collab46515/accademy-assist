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
    const { 
      featureType, 
      topic, 
      studentAge, 
      learningObjectives,
      creativityLevel = 'medium',
      preferences = {}
    } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    let result;

    switch (featureType) {
      case 'story-learning':
        result = await generateStoryBasedLearning(topic, studentAge, learningObjectives, OPENAI_API_KEY);
        break;
      case 'ai-avatar':
        result = await generateAIAvatarPersonality(topic, preferences, OPENAI_API_KEY);
        break;
      case 'gamification':
        result = await generateGamificationElements(topic, learningObjectives, OPENAI_API_KEY);
        break;
      case 'interactive-narrative':
        result = await generateInteractiveNarrative(topic, studentAge, OPENAI_API_KEY);
        break;
      default:
        throw new Error(`Unknown feature type: ${featureType}`);
    }

    return new Response(JSON.stringify({
      success: true,
      data: result,
      featureType,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Creative AI Features error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateStoryBasedLearning(topic: string, studentAge: number, objectives: string[], apiKey: string) {
  const prompt = `Create an engaging story-based learning experience for "${topic}" with these requirements:

Target Audience: Age ${studentAge}
Learning Objectives: ${objectives.join(', ')}

Create a complete narrative framework that includes:
1. Main story premise and setting
2. Character descriptions (protagonist, supporting characters)
3. Learning moments woven naturally into the story
4. Interactive decision points
5. Progressive skill building through story progression
6. Assessment opportunities disguised as story elements

The story should be engaging, age-appropriate, and naturally incorporate the learning objectives without feeling forced.

Return as structured JSON with story elements, characters, and learning integration points.`;

  const response = await callOpenAI(prompt, 'You are a master storyteller and educational designer who creates immersive learning narratives.', apiKey);
  
  return {
    type: 'story-learning',
    ...JSON.parse(response),
    metadata: {
      estimatedDuration: '30-45 minutes',
      interactivityLevel: 'high',
      learningIntegration: 'seamless'
    }
  };
}

async function generateAIAvatarPersonality(topic: string, preferences: any, apiKey: string) {
  const subjectPersonalities = {
    mathematics: 'A friendly, patient mathematician who uses visual examples and encourages problem-solving',
    science: 'An enthusiastic researcher who explains concepts through experiments and discoveries',
    history: 'A time-traveling historian who brings past events to life with vivid storytelling',
    literature: 'A passionate librarian who helps students explore themes and character development',
    art: 'A creative artist who inspires imagination and teaches through visual expression'
  };

  const basePersonality = subjectPersonalities[topic.toLowerCase()] || 'A supportive tutor who adapts to student needs';

  const prompt = `Design an AI tutor avatar personality for "${topic}" with these specifications:

Base Personality: ${basePersonality}
Preferences: ${JSON.stringify(preferences)}

Create a comprehensive avatar profile including:
1. Name and visual description
2. Personality traits and teaching style
3. Catchphrases and speech patterns
4. Interaction methods and engagement techniques
5. Adaptive responses for different student moods
6. Subject-specific knowledge presentation style
7. Encouragement and feedback approaches
8. Fun facts and personality quirks

The avatar should feel like a real person with consistent personality while being an effective tutor.`;

  const response = await callOpenAI(prompt, 'You are an AI character designer specializing in educational avatars with engaging personalities.', apiKey);

  return {
    type: 'ai-avatar',
    avatar: JSON.parse(response),
    voiceSettings: {
      preferredVoice: preferences.voice || 'Brian',
      speechRate: 'normal',
      tone: 'friendly'
    }
  };
}

async function generateGamificationElements(topic: string, objectives: string[], apiKey: string) {
  const prompt = `Design gamification elements for learning "${topic}" with objectives: ${objectives.join(', ')}

Create a comprehensive gamification system including:
1. Point system and scoring mechanics
2. Achievement badges and milestones
3. Progress levels and unlockable content
4. Challenge modes and competitions
5. Collaborative team activities
6. Reward systems and incentives
7. Leaderboards and social elements
8. Daily/weekly quests related to learning goals

Ensure all game elements directly support learning outcomes and maintain educational value.

Return as JSON with detailed game mechanics and implementation suggestions.`;

  const response = await callOpenAI(prompt, 'You are a gamification expert who designs engaging educational game systems.', apiKey);

  return {
    type: 'gamification',
    gameSystem: JSON.parse(response),
    implementation: {
      difficulty: 'progressive',
      socialFeatures: 'enabled',
      rewardFrequency: 'high'
    }
  };
}

async function generateInteractiveNarrative(topic: string, studentAge: number, apiKey: string) {
  const prompt = `Create an interactive narrative experience for "${topic}" suitable for age ${studentAge}:

Design a branching story where student choices affect the narrative and learning outcomes:
1. Main storyline with 3-5 decision points
2. Multiple paths based on student choices
3. Educational content integrated into each path
4. Consequences that teach cause-and-effect
5. Multiple endings that reinforce learning objectives
6. Character development opportunities
7. Problem-solving scenarios
8. Reflection moments for deeper understanding

The narrative should be engaging, educational, and give students agency in their learning journey.`;

  const response = await callOpenAI(prompt, 'You are an interactive narrative designer who creates choice-driven educational experiences.', apiKey);

  return {
    type: 'interactive-narrative',
    narrative: JSON.parse(response),
    features: {
      branchingPaths: true,
      studentChoice: 'high',
      replayValue: 'high'
    }
  };
}

async function callOpenAI(prompt: string, systemMessage: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}