import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Grid3X3,
  Wand2,
  Sparkles,
  Target,
  Brain,
  Zap,
  Calendar,
  Clock,
  Users,
  MapPin,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Eye,
  Copy,
  Save
} from "lucide-react";
import { TimetableGenerationPanel } from "./TimetableGenerationPanel";
import { ConstraintsManager } from "./ConstraintsManager";
import { TimetablePreview } from "./TimetablePreview";
import { GenerationProgress } from "./GenerationProgress";
import { SubstitutionPlanner } from "./live-usage/SubstitutionPlanner";
import { ConflictDetector } from "./live-usage/ConflictDetector";
import { AutoRegeneration } from "./live-usage/AutoRegeneration";

interface AITimetableGeneratorProps {
  onClose?: () => void;
}

interface GenerationSettings {
  algorithm: 'genetic' | 'constraint_solver' | 'machine_learning';
  optimizationLevel: number[];
  maxIterations: number;
  conflictResolution: 'automatic' | 'manual' | 'hybrid';
  prioritizeTeacherPreferences: boolean;
  minimizeGaps: boolean;
  balanceWorkload: boolean;
  respectRoomCapacity: boolean;
}

const defaultSettings: GenerationSettings = {
  algorithm: 'genetic',
  optimizationLevel: [75],
  maxIterations: 1000,
  conflictResolution: 'hybrid',
  prioritizeTeacherPreferences: true,
  minimizeGaps: true,
  balanceWorkload: true,
  respectRoomCapacity: true
};

export function AITimetableGenerator({ onClose }: AITimetableGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<'setup' | 'constraints' | 'generation' | 'preview'>('setup');
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStats, setGenerationStats] = useState({
    iterations: 0,
    conflictsResolved: 0,
    optimizationScore: 0,
    timeElapsed: 0
  });

  const [schoolData, setSchoolData] = useState({
    classes: 12,
    teachers: 24,
    subjects: 18,
    rooms: 15,
    periods: 8
  });

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setCurrentStep('generation');
    setGenerationProgress(0);
    
    // Simulate AI generation process
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCurrentStep('preview');
          return 100;
        }
        
        // Update stats during generation
        setGenerationStats(prevStats => ({
          iterations: prevStats.iterations + Math.floor(Math.random() * 5) + 1,
          conflictsResolved: prevStats.conflictsResolved + Math.floor(Math.random() * 3),
          optimizationScore: Math.min(95, prevStats.optimizationScore + Math.random() * 2),
          timeElapsed: prevStats.timeElapsed + 0.5
        }));
        
        return prev + Math.random() * 3 + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  };

  const renderSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
          <Wand2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Timetable Generator</h2>
        <p className="text-muted-foreground">Configure your AI settings for optimal timetable generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>School Overview</span>
            </CardTitle>
            <CardDescription>Current school data for generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Classes</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{schoolData.classes}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Teachers</Label>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{schoolData.teachers}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{schoolData.subjects}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rooms</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{schoolData.rooms}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Algorithm Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Configuration</span>
            </CardTitle>
            <CardDescription>Select algorithm and optimization parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="algorithm">AI Algorithm</Label>
              <Select value={settings.algorithm} onValueChange={(value: any) => 
                setSettings(prev => ({ ...prev, algorithm: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genetic">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Genetic Algorithm</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="constraint_solver">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Constraint Solver</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="machine_learning">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4" />
                      <span>Machine Learning</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Optimization Level: {settings.optimizationLevel[0]}%</Label>
              <Slider
                value={settings.optimizationLevel}
                onValueChange={(value) => setSettings(prev => ({ ...prev, optimizationLevel: value }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxIterations">Max Iterations</Label>
              <Input
                id="maxIterations"
                type="number"
                value={settings.maxIterations}
                onChange={(e) => setSettings(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
                min={100}
                max={10000}
                step={100}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Optimization Preferences</span>
          </CardTitle>
          <CardDescription>Configure what the AI should prioritize during generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prioritize Teacher Preferences</Label>
                  <p className="text-sm text-muted-foreground">Consider teacher availability and preferences</p>
                </div>
                <Switch
                  checked={settings.prioritizeTeacherPreferences}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, prioritizeTeacherPreferences: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Minimize Free Periods</Label>
                  <p className="text-sm text-muted-foreground">Reduce gaps in teacher schedules</p>
                </div>
                <Switch
                  checked={settings.minimizeGaps}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, minimizeGaps: checked }))
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Balance Teacher Workload</Label>
                  <p className="text-sm text-muted-foreground">Distribute periods evenly across teachers</p>
                </div>
                <Switch
                  checked={settings.balanceWorkload}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, balanceWorkload: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Respect Room Capacity</Label>
                  <p className="text-sm text-muted-foreground">Ensure classes fit in assigned rooms</p>
                </div>
                <Switch
                  checked={settings.respectRoomCapacity}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, respectRoomCapacity: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          <span>Cancel</span>
        </Button>
        <Button onClick={() => setCurrentStep('constraints')} className="shadow-[var(--shadow-elegant)]">
          <span>Next: Configure Constraints</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
              <Grid3X3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <span>AI Timetable Generator</span>
                <Badge className="bg-primary text-primary-foreground">
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </h1>
              <p className="text-muted-foreground">Revolutionary automatic timetable generation with AI optimization</p>
            </div>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>Close</Button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-6">
          {[
            { key: 'setup', label: 'Setup', icon: Settings },
            { key: 'constraints', label: 'Constraints', icon: Target },
            { key: 'generation', label: 'Generation', icon: Wand2 },
            { key: 'preview', label: 'Preview', icon: Eye }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.key;
            const isCompleted = ['setup', 'constraints', 'generation', 'preview'].indexOf(currentStep) > index;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                    isCompleted ? 'border-success bg-success text-success-foreground' : 
                    'border-muted bg-background text-muted-foreground'}
                `}>
                  {isCompleted && !isActive ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
                {index < 3 && (
                  <div className={`w-8 h-px mx-4 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 'setup' && renderSetupStep()}
        {currentStep === 'constraints' && (
          <ConstraintsManager 
            onBack={() => setCurrentStep('setup')}
            onNext={() => setCurrentStep('generation')}
          />
        )}
        {currentStep === 'generation' && (
          <GenerationProgress
            isGenerating={isGenerating}
            progress={generationProgress}
            stats={generationStats}
            settings={settings}
            onStart={handleStartGeneration}
            onStop={() => setIsGenerating(false)}
            onBack={() => setCurrentStep('constraints')}
          />
        )}
        {currentStep === 'preview' && (
          <TimetablePreview
            onBack={() => setCurrentStep('generation')}
            onRegenerate={() => {
              setCurrentStep('generation');
              handleStartGeneration();
            }}
            onSave={() => {
              // Handle save logic
              console.log('Saving timetable...');
            }}
          />
        )}
      </div>
    </div>
  );
}