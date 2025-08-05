import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Pause,
  RefreshCw,
  Brain,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface TimetableGenerationPanelProps {
  isGenerating: boolean;
  progress: number;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export function TimetableGenerationPanel({
  isGenerating,
  progress,
  onStart,
  onStop,
  onRestart
}: TimetableGenerationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI Generation Control</span>
          {isGenerating && (
            <Badge className="bg-warning text-warning-foreground animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Generating
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Control the AI timetable generation process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
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
          
          <Button onClick={onRestart} variant="outline" disabled={isGenerating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Optimization</p>
            <p className="text-xs text-muted-foreground">87% Score</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <p className="text-sm font-medium">Conflicts</p>
            <p className="text-xs text-muted-foreground">3 Remaining</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium">Coverage</p>
            <p className="text-xs text-muted-foreground">94% Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}