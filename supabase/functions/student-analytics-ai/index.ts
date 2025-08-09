import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StudentData {
  id: string;
  name: string;
  responseTime: number[];
  accuracy: number[];
  engagementMetrics: {
    clickRate: number;
    timeOnTask: number;
    questionsAsked: number;
    participationRate: number;
  };
  behaviorPatterns: {
    preferredMediaType: string;
    timeOfDayPerformance: Record<string, number>;
    difficultyAdaptation: number;
  };
  recentPerformance: {
    subject: string;
    score: number;
    timestamp: string;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { students, analysisType = 'comprehensive' } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const analytics = {
      learningStyles: analyzeLearningStyles(students),
      attentionPatterns: analyzeAttentionPatterns(students),
      riskPrediction: predictAtRiskStudents(students),
      recommendations: await generateAIRecommendations(students, OPENAI_API_KEY)
    };

    return new Response(JSON.stringify({
      success: true,
      analytics,
      timestamp: new Date().toISOString(),
      studentsAnalyzed: students.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Student Analytics AI error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeLearningStyles(students: StudentData[]) {
  return students.map(student => {
    const { behaviorPatterns, engagementMetrics } = student;
    
    // Analyze preferred learning modality
    let primaryStyle = 'mixed';
    let confidence = 0.5;
    
    if (behaviorPatterns.preferredMediaType === 'video' && engagementMetrics.timeOnTask > 0.8) {
      primaryStyle = 'visual';
      confidence = 0.85;
    } else if (engagementMetrics.questionsAsked > 5 && engagementMetrics.participationRate > 0.7) {
      primaryStyle = 'auditory';
      confidence = 0.8;
    } else if (behaviorPatterns.difficultyAdaptation > 0.6) {
      primaryStyle = 'kinesthetic';
      confidence = 0.75;
    }
    
    return {
      studentId: student.id,
      primaryLearningStyle: primaryStyle,
      confidence,
      recommendations: generateLearningStyleRecommendations(primaryStyle)
    };
  });
}

function analyzeAttentionPatterns(students: StudentData[]) {
  return students.map(student => {
    const avgResponseTime = student.responseTime.reduce((a, b) => a + b, 0) / student.responseTime.length;
    const responseConsistency = calculateVariance(student.responseTime);
    const engagementScore = calculateEngagementScore(student.engagementMetrics);
    
    let attentionStatus = 'focused';
    if (engagementScore < 0.5 || responseConsistency > 5000) {
      attentionStatus = 'distracted';
    } else if (engagementScore < 0.3 || avgResponseTime > 10000) {
      attentionStatus = 'away';
    }
    
    return {
      studentId: student.id,
      attentionStatus,
      engagementScore,
      focusMetrics: {
        averageResponseTime: avgResponseTime,
        consistency: responseConsistency,
        peakPerformanceTime: findPeakPerformanceTime(student.behaviorPatterns.timeOfDayPerformance)
      }
    };
  });
}

function predictAtRiskStudents(students: StudentData[]) {
  return students.map(student => {
    const recentAccuracy = student.accuracy.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, student.accuracy.length);
    const engagementScore = calculateEngagementScore(student.engagementMetrics);
    const performanceTrend = calculatePerformanceTrend(student.recentPerformance);
    
    // Risk calculation algorithm
    let riskScore = 0;
    
    if (recentAccuracy < 0.6) riskScore += 0.4;
    if (engagementScore < 0.5) riskScore += 0.3;
    if (performanceTrend < 0) riskScore += 0.3;
    
    let riskLevel = 'low';
    if (riskScore > 0.7) riskLevel = 'critical';
    else if (riskScore > 0.5) riskLevel = 'high';
    else if (riskScore > 0.3) riskLevel = 'medium';
    
    return {
      studentId: student.id,
      riskLevel,
      riskScore: Math.round(riskScore * 100),
      indicators: {
        academicPerformance: recentAccuracy,
        engagement: engagementScore,
        trend: performanceTrend
      },
      recommendations: generateRiskMitigationStrategies(riskLevel)
    };
  });
}

async function generateAIRecommendations(students: StudentData[], apiKey: string) {
  const studentSummary = students.map(s => ({
    id: s.id,
    accuracy: s.accuracy.slice(-3),
    engagement: s.engagementMetrics,
    recentPerformance: s.recentPerformance.slice(-2)
  }));

  const prompt = `As an AI Education Analyst, analyze this classroom data and provide actionable recommendations:

Student Data Summary: ${JSON.stringify(studentSummary, null, 2)}

Please provide:
1. Overall class performance insights
2. Individual intervention strategies for struggling students
3. Engagement optimization suggestions
4. Predictive recommendations to prevent future issues
5. Differentiated instruction approaches

Format as JSON with structured recommendations.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert AI Education Analyst specializing in student performance analysis and intervention strategies.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('AI Recommendations error:', error);
    return {
      error: 'Failed to generate AI recommendations',
      fallback: 'Manual review recommended for student performance data'
    };
  }
}

// Utility functions
function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  return variance;
}

function calculateEngagementScore(metrics: StudentData['engagementMetrics']): number {
  return (metrics.clickRate * 0.3 + 
          metrics.timeOnTask * 0.4 + 
          metrics.participationRate * 0.3);
}

function findPeakPerformanceTime(timePerformance: Record<string, number>): string {
  return Object.entries(timePerformance).reduce((a, b) => 
    timePerformance[a[0]] > timePerformance[b[0]] ? a : b
  )[0];
}

function calculatePerformanceTrend(recentPerformance: StudentData['recentPerformance']): number {
  if (recentPerformance.length < 2) return 0;
  
  const recent = recentPerformance.slice(-3);
  const older = recentPerformance.slice(-6, -3);
  
  const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b.score, 0) / older.length : recentAvg;
  
  return (recentAvg - olderAvg) / olderAvg;
}

function generateLearningStyleRecommendations(style: string): string[] {
  const recommendations = {
    visual: ['Use diagrams and charts', 'Provide written summaries', 'Color-coded materials', 'Mind maps'],
    auditory: ['Verbal explanations', 'Discussion opportunities', 'Audio recordings', 'Verbal repetition'],
    kinesthetic: ['Hands-on activities', 'Movement breaks', 'Interactive simulations', 'Real-world applications'],
    mixed: ['Varied instruction methods', 'Multi-modal content', 'Choice in learning activities', 'Flexible pacing']
  };
  
  return recommendations[style as keyof typeof recommendations] || recommendations.mixed;
}

function generateRiskMitigationStrategies(riskLevel: string): string[] {
  const strategies = {
    low: ['Continue current approach', 'Occasional check-ins', 'Enrichment opportunities'],
    medium: ['Increased monitoring', 'Peer tutoring', 'Additional practice materials', 'Parent communication'],
    high: ['One-on-one support', 'Modified assignments', 'Frequent assessments', 'Intervention planning'],
    critical: ['Immediate intervention', 'Specialist consultation', 'Individual education plan', 'Daily monitoring']
  };
  
  return strategies[riskLevel as keyof typeof strategies] || strategies.medium;
}