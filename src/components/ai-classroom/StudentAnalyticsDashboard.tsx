import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Eye,
  Activity,
  TrendingUp,
  AlertTriangle,
  Target,
  User,
  BookOpen,
  Zap,
  Clock,
  Award,
  Lightbulb,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface StudentMetrics {
  id: string;
  name: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  attentionStatus: 'focused' | 'distracted' | 'away';
  comprehensionLevel: number;
  engagementScore: number;
  participationRate: number;
  strugglingTopics: string[];
  strengths: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  aiInteractions: number;
  responseTime: number[];
  accuracy: number[];
}

interface AnalyticsInsight {
  type: 'learning_style' | 'attention' | 'risk_prediction' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  studentId?: string;
  actionable: boolean;
  confidence: number;
}

interface Props {
  students: StudentMetrics[];
  insights: AnalyticsInsight[];
  metrics: {
    classAverage: number;
    engagementTrend: number;
    atRiskCount: number;
    topPerformers: number;
  };
  onStudentFocus: (studentId: string) => void;
  onInterventionTrigger: (type: string, studentId: string) => void;
}

export const StudentAnalyticsDashboard: React.FC<Props> = ({
  students,
  insights,
  metrics,
  onStudentFocus,
  onInterventionTrigger
}) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Get real-time analytics from AI
  const runAnalytics = async () => {
    if (!students.length) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('student-analytics-ai', {
        body: {
          students: students.map(s => ({
            id: s.id,
            name: s.name,
            responseTime: s.responseTime,
            accuracy: s.accuracy,
            engagementMetrics: {
              clickRate: s.participationRate / 100,
              timeOnTask: s.engagementScore / 100,
              questionsAsked: s.aiInteractions,
              participationRate: s.participationRate / 100
            },
            behaviorPatterns: {
              preferredMediaType: s.learningStyle === 'visual' ? 'video' : 'text',
              timeOfDayPerformance: { 'morning': 0.8, 'afternoon': 0.7 },
              difficultyAdaptation: s.comprehensionLevel / 100
            },
            recentPerformance: s.accuracy.map((score, i) => ({
              subject: 'current_topic',
              score: score,
              timestamp: new Date(Date.now() - i * 60000).toISOString()
            }))
          })),
          analysisType: 'comprehensive'
        }
      });

      if (error) throw error;

      setAnalyticsData(data.analytics);
      
      toast({
        title: "AI Analysis Complete",
        description: `Analyzed ${students.length} students with ${data.analytics.recommendations?.length || 0} insights generated.`,
      });

    } catch (error) {
      console.error('Analytics error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Disabled automatic analytics to prevent frequent AI calls
  // useEffect(() => {
  //   if (students.length > 0) {
  //     runAnalytics();
  //   }
  // }, [students]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'focused': return 'bg-green-500';
      case 'distracted': return 'bg-yellow-500';
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'auditory': return <BookOpen className="h-4 w-4" />;
      case 'kinesthetic': return <Activity className="h-4 w-4" />;
      case 'mixed': return <Brain className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const atRiskStudents = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical');
  const strugglingStudents = students.filter(s => s.comprehensionLevel < 70);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">AI Student Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Real-time intelligence • {students.length} students monitored
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={runAnalytics}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-indigo-500"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="p-4 grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Avg Comprehension</span>
          </div>
          <div className="text-xl font-bold text-blue-700">{metrics.classAverage}%</div>
          <Progress value={metrics.classAverage} className="h-1 mt-1" />
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <div className="text-xl font-bold text-green-700">
            {Math.round(students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {metrics.engagementTrend > 0 ? '↑' : '↓'} {Math.abs(metrics.engagementTrend)}% from last session
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">At Risk</span>
          </div>
          <div className="text-xl font-bold text-red-700">{atRiskStudents.length}</div>
          <div className="text-xs text-muted-foreground">Need immediate attention</div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Top Performers</span>
          </div>
          <div className="text-xl font-bold text-purple-700">{metrics.topPerformers}</div>
          <div className="text-xs text-muted-foreground">Above 85% comprehension</div>
        </Card>
      </div>

      {/* Student Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 gap-3 max-h-full">
          {students.map((student) => (
            <Card 
              key={student.id} 
              className={`p-4 hover:shadow-md transition-all cursor-pointer border-l-4 ${
                student.riskLevel === 'critical' ? 'border-l-red-500 bg-red-50' :
                student.riskLevel === 'high' ? 'border-l-orange-500 bg-orange-50' :
                student.riskLevel === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-green-500'
              } ${selectedStudent === student.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => {
                setSelectedStudent(student.id);
                onStudentFocus(student.id);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(student.attentionStatus)}`} />
                    <span className="font-medium text-sm">{student.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getLearningStyleIcon(student.learningStyle)}
                    <span className="ml-1 capitalize">{student.learningStyle}</span>
                  </Badge>
                </div>
                <Badge className={`text-xs ${getRiskColor(student.riskLevel)}`}>
                  {student.riskLevel.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{student.comprehensionLevel}%</div>
                  <div className="text-xs text-muted-foreground">Comprehension</div>
                  <Progress value={student.comprehensionLevel} className="h-1 mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{student.engagementScore}%</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                  <Progress value={student.engagementScore} className="h-1 mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{student.participationRate}%</div>
                  <div className="text-xs text-muted-foreground">Participation</div>
                  <Progress value={student.participationRate} className="h-1 mt-1" />
                </div>
              </div>

              {student.strugglingTopics.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground mb-1">Struggling with:</div>
                  <div className="flex flex-wrap gap-1">
                    {student.strugglingTopics.slice(0, 3).map((topic, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {student.strugglingTopics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.strugglingTopics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    {student.aiInteractions} AI helps
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.round(student.responseTime.reduce((a, b) => a + b, 0) / student.responseTime.length / 1000)}s avg
                  </span>
                </div>
                {(student.riskLevel === 'high' || student.riskLevel === 'critical') && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInterventionTrigger('support', student.id);
                    }}
                  >
                    <Target className="h-3 w-3 mr-1" />
                    Intervene
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      {analyticsData && (
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-sm">Latest AI Insights</span>
            {analyticsData.learningStyles && (
              <Badge variant="secondary" className="text-xs">
                {analyticsData.learningStyles.length} analyzed
              </Badge>
            )}
          </div>
          <div className="space-y-2 max-h-20 overflow-auto">
            {insights.slice(0, 2).map((insight, i) => (
              <div key={i} className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                <div className="flex items-center justify-between mb-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      insight.priority === 'critical' ? 'border-red-500 text-red-700' :
                      insight.priority === 'high' ? 'border-orange-500 text-orange-700' :
                      'border-blue-500 text-blue-700'
                    }`}
                  >
                    {insight.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-xs text-slate-700">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};