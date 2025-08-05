import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  BarChart3, 
  Users, 
  MapPin, 
  Clock,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface LearningMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
  unit: string;
}

interface Suggestion {
  id: string;
  type: 'optimization' | 'constraint' | 'balance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  confidenceScore: number;
  autoApplicable: boolean;
}

export function AILearningOptimization() {
  const [learningProgress, setLearningProgress] = useState(0);
  const [isLearning, setIsLearning] = useState(false);

  // Mock learning metrics
  const learningMetrics: LearningMetric[] = [
    {
      id: 'generation-time',
      name: 'Generation Time',
      currentValue: 12,
      previousValue: 18,
      trend: 'up',
      target: 8,
      unit: 'seconds'
    },
    {
      id: 'conflict-rate',
      name: 'Conflict Rate',
      currentValue: 3,
      previousValue: 8,
      trend: 'up',
      target: 2,
      unit: '%'
    },
    {
      id: 'teacher-satisfaction',
      name: 'Teacher Satisfaction',
      currentValue: 87,
      previousValue: 82,
      trend: 'up',
      target: 90,
      unit: '%'
    },
    {
      id: 'room-utilization',
      name: 'Room Utilization',
      currentValue: 78,
      previousValue: 71,
      trend: 'up',
      target: 85,
      unit: '%'
    }
  ];

  // Mock AI suggestions
  const suggestions: Suggestion[] = [
    {
      id: 'sug-1',
      type: 'optimization',
      priority: 'high',
      title: 'Move English to Thursday mornings',
      description: 'Analysis shows English classes perform 15% better when scheduled on Thursday mornings vs current Tuesday afternoon slots.',
      impact: 'Improve student engagement and reduce teacher fatigue',
      confidenceScore: 92,
      autoApplicable: true
    },
    {
      id: 'sug-2',
      type: 'balance',
      priority: 'medium',
      title: 'Redistribute Mathematics periods',
      description: 'Ms. Johnson has 18 periods while Mr. Chen has only 12. Redistributing 3 periods would improve workload balance.',
      impact: 'Better teacher work-life balance, reduced burnout risk',
      confidenceScore: 85,
      autoApplicable: false
    },
    {
      id: 'sug-3',
      type: 'constraint',
      priority: 'medium',
      title: 'Avoid back-to-back PE classes',
      description: 'Students show 20% lower engagement in classes immediately following PE. Consider adding buffer periods.',
      impact: 'Improved student focus and academic performance',
      confidenceScore: 78,
      autoApplicable: true
    }
  ];

  const analyticsData = {
    teacherWorkload: [
      { teacher: 'Ms. Johnson', periods: 18, load: 'high', subjects: ['Math', 'Physics'] },
      { teacher: 'Mr. Smith', periods: 15, load: 'optimal', subjects: ['English', 'Literature'] },
      { teacher: 'Dr. Brown', periods: 12, load: 'low', subjects: ['Chemistry', 'Biology'] },
      { teacher: 'Ms. Davis', periods: 16, load: 'optimal', subjects: ['History', 'Geography'] }
    ],
    roomUtilization: [
      { room: 'M101', utilization: 85, type: 'Mathematics', conflicts: 0 },
      { room: 'S201', utilization: 92, type: 'Science Lab', conflicts: 2 },
      { room: 'E102', utilization: 67, type: 'English', conflicts: 0 },
      { room: 'Gym', utilization: 45, type: 'Sports Hall', conflicts: 1 }
    ]
  };

  const startLearning = () => {
    setIsLearning(true);
    setLearningProgress(0);
    
    const interval = setInterval(() => {
      setLearningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLearning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getLoadColor = (load: string) => {
    switch (load) {
      case 'high': return 'text-red-600';
      case 'optimal': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Learning & Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="learning" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="learning">Learning Progress</TabsTrigger>
              <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="learning" className="mt-6">
              <div className="space-y-6">
                {/* Learning Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Historical Data Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          Learning from {isLearning ? 'processing...' : '247 successful timetables'}
                        </p>
                      </div>
                      <Button onClick={startLearning} disabled={isLearning}>
                        <Zap className="h-4 w-4 mr-2" />
                        {isLearning ? 'Learning...' : 'Start Learning'}
                      </Button>
                    </div>
                    
                    {isLearning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Processing historical patterns</span>
                          <span>{learningProgress}%</span>
                        </div>
                        <Progress value={learningProgress} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Learning Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {learningMetrics.map((metric) => (
                    <Card key={metric.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{metric.name}</h4>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold">
                            {metric.currentValue}{metric.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Previous: {metric.previousValue}{metric.unit}
                          </div>
                          <div className="text-xs">
                            Target: {metric.target}{metric.unit}
                          </div>
                          <Progress 
                            value={(metric.currentValue / metric.target) * 100} 
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="suggestions" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">AI Optimization Suggestions</h3>
                  <Badge variant="secondary">3 new suggestions</Badge>
                </div>
                
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className={`border ${getPriorityColor(suggestion.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                              {suggestion.priority}
                            </Badge>
                            <Badge variant="outline">
                              {suggestion.confidenceScore}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.description}
                          </p>
                          <p className="text-sm">
                            <strong>Impact:</strong> {suggestion.impact}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {suggestion.autoApplicable && (
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Auto-Apply
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-6">
                {/* Teacher Workload Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Teacher Workload Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.teacherWorkload.map((teacher, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{teacher.teacher}</div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.subjects.join(', ')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{teacher.periods} periods</div>
                            <div className={`text-sm font-medium ${getLoadColor(teacher.load)}`}>
                              {teacher.load}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Room Utilization Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Room Utilization Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.roomUtilization.map((room, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{room.room}</div>
                            <div className="text-sm text-muted-foreground">{room.type}</div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-lg font-bold">{room.utilization}%</div>
                            <Progress value={room.utilization} className="w-24 h-2" />
                            {room.conflicts > 0 && (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                {room.conflicts} conflicts
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Efficiency Gains</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">33%</div>
                        <div className="text-sm text-muted-foreground">
                          Faster generation vs. manual scheduling
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Constraint Satisfaction</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">97%</div>
                        <div className="text-sm text-muted-foreground">
                          Rules and preferences met
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Time Saved</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">24hrs</div>
                        <div className="text-sm text-muted-foreground">
                          Per timetable generation cycle
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}