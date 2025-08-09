import { Brain, Sparkles, Clock, Users, AlertCircle, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClassroomHeaderProps {
  lessonTitle: string;
  aiSystemsActive: boolean;
  onAISystemsToggle: () => void;
  onQuickQuiz: () => void;
  onIntervention: () => void;
  onViewAllInsights: () => void;
  formatTime: (seconds: number) => string;
  getClassDuration: () => number;
  getOverallEngagement: () => number;
  getAverageComprehension: () => number;
  studentsCount: number;
  atRiskStudents: any[];
  priorityInsights: any[];
}

export function ClassroomHeader({
  lessonTitle,
  aiSystemsActive,
  onAISystemsToggle,
  onQuickQuiz,
  onIntervention,
  onViewAllInsights,
  formatTime,
  getClassDuration,
  getOverallEngagement,
  getAverageComprehension,
  studentsCount,
  atRiskStudents,
  priorityInsights
}: ClassroomHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Main Title Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 flex-wrap">
                  <span className="truncate">{lessonTitle}</span>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 flex-shrink-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI Systems: {aiSystemsActive ? '🟢 Active' : '🔴 Disabled'} • 
                  Engagement: {getOverallEngagement()}% • 
                  Comprehension: {getAverageComprehension()}%
                </p>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-background">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(getClassDuration())}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Users className="h-3 w-3 mr-1" />
                {studentsCount}
              </Badge>
              {atRiskStudents.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {atRiskStudents.length} at risk
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={aiSystemsActive ? "default" : "outline"}
              size="sm"
              onClick={onAISystemsToggle}
              className={`${aiSystemsActive ? 'bg-gradient-to-r from-purple-500 to-blue-500' : ''}`}
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Systems
            </Button>

            <Button variant="outline" size="sm" onClick={onQuickQuiz}>
              <Zap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Quick Quiz</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={onIntervention}>
              <Target className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Intervention</span>
            </Button>
          </div>
        </div>

        {/* Mobile Status Badges */}
        <div className="sm:hidden flex items-center gap-2 flex-wrap mt-3">
          <Badge variant="outline" className="bg-background">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(getClassDuration())}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Users className="h-3 w-3 mr-1" />
            {studentsCount}
          </Badge>
          {atRiskStudents.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertCircle className="h-3 w-3 mr-1" />
              {atRiskStudents.length} at risk
            </Badge>
          )}
        </div>

        {/* Priority Insights Banner */}
        {priorityInsights.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <span className="font-medium text-orange-800">Priority AI Insights</span>
              </div>
              <Button size="sm" variant="ghost" className="text-orange-700" onClick={onViewAllInsights}>
                View All
              </Button>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              {priorityInsights[0].message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}