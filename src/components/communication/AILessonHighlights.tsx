import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Lightbulb,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  MessageSquare,
  Users,
  Brain,
  Bookmark,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface KeyPoint {
  id: string;
  content: string;
  timestamp: Date;
  type: 'concept' | 'question' | 'example' | 'important';
  confidence: number;
  relatedTopics: string[];
}

interface LessonSummary {
  mainTopics: string[];
  keyPoints: KeyPoint[];
  questionsAsked: number;
  participationRate: number;
  averageEngagement: number;
  conceptsCovered: string[];
  timeSpent: number;
  nextSteps: string[];
}

interface AILessonHighlightsProps {
  roomId: string;
  lessonTitle: string;
  isVisible: boolean;
  onToggle: () => void;
}

export const AILessonHighlights: React.FC<AILessonHighlightsProps> = ({
  roomId,
  lessonTitle,
  isVisible,
  onToggle
}) => {
  const [lessonSummary, setLessonSummary] = useState<LessonSummary>({
    mainTopics: ['Quadratic Equations', 'Factoring', 'Graphing Parabolas'],
    keyPoints: [
      {
        id: '1',
        content: 'Students struggled with identifying the discriminant in quadratic equations',
        timestamp: new Date(Date.now() - 1200000),
        type: 'important',
        confidence: 0.92,
        relatedTopics: ['discriminant', 'quadratic formula']
      },
      {
        id: '2',
        content: 'Sarah asked an excellent question about vertex form vs standard form',
        timestamp: new Date(Date.now() - 900000),
        type: 'question',
        confidence: 0.88,
        relatedTopics: ['vertex form', 'parabola']
      },
      {
        id: '3',
        content: 'Class successfully solved the complex factoring problem together',
        timestamp: new Date(Date.now() - 600000),
        type: 'concept',
        confidence: 0.95,
        relatedTopics: ['factoring', 'collaboration']
      },
      {
        id: '4',
        content: 'Example: Converting y = x² + 4x + 3 to vertex form demonstrated clearly',
        timestamp: new Date(Date.now() - 300000),
        type: 'example',
        confidence: 0.91,
        relatedTopics: ['vertex form', 'completing the square']
      }
    ],
    questionsAsked: 12,
    participationRate: 78,
    averageEngagement: 85,
    conceptsCovered: ['Quadratic Formula', 'Discriminant', 'Vertex Form', 'Factoring', 'Graphing'],
    timeSpent: 32, // minutes
    nextSteps: [
      'Review discriminant calculation with more practice problems',
      'Assign homework on vertex form conversions', 
      'Plan next lesson on quadratic inequalities'
    ]
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate new insights being added
      if (Math.random() > 0.8) {
        const newPoint: KeyPoint = {
          id: Date.now().toString(),
          content: 'New insight detected from recent class interaction',
          timestamp: new Date(),
          type: 'concept',
          confidence: Math.random() * 0.3 + 0.7,
          relatedTopics: ['current topic']
        };
        
        setLessonSummary(prev => ({
          ...prev,
          keyPoints: [newPoint, ...prev.keyPoints].slice(0, 6) // Keep only latest 6
        }));
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: KeyPoint['type']) => {
    switch (type) {
      case 'concept': return <Brain className="h-4 w-4" />;
      case 'question': return <MessageSquare className="h-4 w-4" />;
      case 'example': return <Target className="h-4 w-4" />;
      case 'important': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: KeyPoint['type']) => {
    switch (type) {
      case 'concept': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'question': return 'text-green-600 bg-green-50 border-green-200';
      case 'example': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'important': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const refreshHighlights = async () => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsUpdating(false);
  };

  const exportHighlights = () => {
    const data = {
      lessonTitle,
      date: new Date().toISOString(),
      summary: lessonSummary
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson-highlights-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed top-20 right-4 z-30 transition-all duration-300 ${
      isVisible ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <Card className="w-80 max-h-[70vh] flex flex-col bg-white shadow-lg border border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">AI Lesson Insights</h3>
            </div>
            <Button onClick={onToggle} variant="ghost" size="sm">
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
            <Button
              onClick={refreshHighlights}
              variant="ghost"
              size="sm"
              disabled={isUpdating}
            >
              <RefreshCw className={`h-3 w-3 ${isUpdating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Lesson Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-600">{lessonSummary.timeSpent}m</div>
              <div className="text-xs text-blue-700">Time Elapsed</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-600">{lessonSummary.averageEngagement}%</div>
              <div className="text-xs text-green-700">Engagement</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-purple-600">{lessonSummary.questionsAsked}</div>
              <div className="text-xs text-purple-700">Questions</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-orange-600">{lessonSummary.participationRate}%</div>
              <div className="text-xs text-orange-700">Participation</div>
            </div>
          </div>

          {/* Main Topics Covered */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Topics Covered
            </h4>
            <div className="flex flex-wrap gap-1">
              {lessonSummary.mainTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Key Insights */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Key Insights
            </h4>
            <div className="space-y-3">
              {lessonSummary.keyPoints.map((point) => (
                <div
                  key={point.id}
                  className={`p-3 rounded-lg border ${getTypeColor(point.type)}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getTypeIcon(point.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium capitalize mb-1">
                        {point.type}
                      </div>
                      <p className="text-sm text-slate-700">{point.content}</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {point.confidence && (
                        <div className="bg-white px-2 py-1 rounded">
                          {Math.round(point.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {point.relatedTopics.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {point.relatedTopics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      {point.timestamp.toLocaleTimeString()}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Bookmark className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Next Steps */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Suggested Next Steps
            </h4>
            <div className="space-y-2">
              {lessonSummary.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Button onClick={exportHighlights} variant="outline" size="sm" className="flex-1">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Toggle button when hidden */}
      {!isVisible && (
        <Button
          onClick={onToggle}
          className="absolute -left-10 top-4 bg-blue-600 hover:bg-blue-700 text-white rounded-l-lg rounded-r-none px-2 py-2 shadow-md"
          size="sm"
        >
          <Brain className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};