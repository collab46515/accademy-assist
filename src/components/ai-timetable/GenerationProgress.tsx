import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play,
  Pause,
  Brain,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity
} from "lucide-react";

interface GenerationProgressProps {
  isGenerating: boolean;
  progress: number;
  stats: {
    iterations: number;
    conflictsResolved: number;
    optimizationScore: number;
    timeElapsed: number;
  };
  settings: any;
  onStart: () => void;
  onStop: () => void;
  onBack: () => void;
}

export function GenerationProgress({
  isGenerating,
  progress,
  stats,
  settings,
  onStart,
  onStop,
  onBack
}: GenerationProgressProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'genetic': return <Zap className="h-4 w-4" />;
      case 'constraint_solver': return <Target className="h-4 w-4" />;
      case 'machine_learning': return <Brain className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getAlgorithmName = (algorithm: string) => {
    switch (algorithm) {
      case 'genetic': return 'Genetic Algorithm';
      case 'constraint_solver': return 'Constraint Solver';
      case 'machine_learning': return 'Machine Learning';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
          <Brain className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Generation in Progress</h2>
        <p className="text-muted-foreground">
          {isGenerating 
            ? "AI is analyzing constraints and optimizing your timetable..." 
            : "Ready to start AI-powered timetable generation"
          }
        </p>
      </div>

      {/* Generation Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Generation Control</span>
            {isGenerating && (
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Generating
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Monitor and control the AI generation process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getAlgorithmIcon(settings.algorithm)}
                <span className="font-medium">{getAlgorithmName(settings.algorithm)}</span>
              </div>
              <Badge variant="outline">
                Optimization: {settings.optimizationLevel[0]}%
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isGenerating ? (
                <Button onClick={onStart} className="shadow-[var(--shadow-elegant)]">
                  <Play className="h-4 w-4 mr-2" />
                  Start Generation
                </Button>
              ) : (
                <Button onClick={onStop} variant="destructive">
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Generation
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Statistics */}
      {isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Iterations</p>
                  <p className="text-2xl font-bold text-primary">{stats.iterations.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Algorithm cycles completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conflicts Resolved</p>
                  <p className="text-2xl font-bold text-success">{stats.conflictsResolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scheduling conflicts fixed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Optimization Score</p>
                  <p className="text-2xl font-bold text-primary">{stats.optimizationScore.toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Current solution quality</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Time Elapsed</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(stats.timeElapsed)}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Generation time</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generation Log */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Generation Log</span>
            </CardTitle>
            <CardDescription>Real-time updates from the AI generation process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{formatTime(stats.timeElapsed)}</span>
                <span>Iteration {stats.iterations}: Resolved teacher conflict in Period 3</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{formatTime(Math.max(0, stats.timeElapsed - 0.5))}</span>
                <span>Optimizing room assignments for laboratory subjects</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{formatTime(Math.max(0, stats.timeElapsed - 1))}</span>
                <span>Balancing teacher workload across periods</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{formatTime(Math.max(0, stats.timeElapsed - 1.5))}</span>
                <span>Applying soft constraints for schedule optimization</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isGenerating}>
          <span>Back: Constraints</span>
        </Button>
        {progress >= 100 && (
          <Button className="shadow-[var(--shadow-elegant)]">
            <span>View Results</span>
          </Button>
        )}
      </div>
    </div>
  );
}