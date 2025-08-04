import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useRBAC } from '@/hooks/useRBAC';

interface ProgressDashboardProps {
  view?: 'hod' | 'teacher' | 'curriculum';
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ view = 'hod' }) => {
  const { currentSchool } = useRBAC();
  const { 
    topicProgress, 
    progressStats, 
    loading, 
    generateCoverageReport 
  } = useProgressTracking(currentSchool?.id);

  const handleExportReport = () => {
    const report = generateCoverageReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `curriculum-coverage-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (percentage > 0) return <Clock className="h-4 w-4 text-blue-600" />;
    return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage === 100) return 'Completed';
    if (percentage > 0) return 'In Progress';
    return 'Not Started';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Curriculum Coverage Dashboard</h2>
          <p className="text-muted-foreground">
            Track lesson delivery and curriculum completion progress
          </p>
        </div>
        <Button onClick={handleExportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressStats.total_topics}</div>
            <p className="text-xs text-muted-foreground">Curriculum topics tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{progressStats.completed_topics}</div>
            <p className="text-xs text-muted-foreground">100% coverage achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{progressStats.in_progress_topics}</div>
            <p className="text-xs text-muted-foreground">Partially delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overall Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressStats.overall_coverage}%</div>
            <Progress value={progressStats.overall_coverage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Topic Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Topic-by-Topic Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicProgress.map((topic) => (
              <div key={topic.topic_id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{topic.topic_name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {topic.subject} - {topic.year_group}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {topic.term}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {topic.completed_lessons} of {topic.total_lessons_planned} lessons completed
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Updated {new Date(topic.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(topic.coverage_percentage)}
                      <span className="text-sm font-medium">
                        {getStatusText(topic.coverage_percentage)}
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      {topic.coverage_percentage}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Coverage Progress</span>
                    <span className="font-medium">
                      {topic.completed_lessons}/{topic.total_lessons_planned} lessons
                    </span>
                  </div>
                  <Progress 
                    value={topic.coverage_percentage} 
                    className={`h-2 ${getStatusColor(topic.coverage_percentage)}`}
                  />
                </div>

                {/* Inspection Ready Indicator */}
                {topic.coverage_percentage >= 80 && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Inspection Ready</span>
                      <span>- Curriculum delivery documented and tracked</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proof of Delivery */}
      <Card>
        <CardHeader>
          <CardTitle>Proof of Curriculum Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Automatic Documentation</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Every completed lesson automatically updates curriculum coverage</li>
              <li>• Progress is tracked by curriculum topic and reference code</li>
              <li>• Coverage percentages prove curriculum delivery compliance</li>
              <li>• Data is inspection-ready with no manual reporting required</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};