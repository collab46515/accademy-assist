import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  FileText,
  Calendar,
  Download,
  Filter,
  Eye,
  Plus
} from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  icon: any;
  action?: string;
  tips?: string[];
}

interface GuideSection {
  title: string;
  description: string;
  steps: GuideStep[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface UserGuideProps {
  moduleName: string;
  sections: GuideSection[];
  quickActions?: {
    title: string;
    description: string;
    icon: any;
    action: string;
  }[];
}

export function UserGuide({ moduleName, sections, quickActions = [] }: UserGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState(0);
  const { toast } = useToast();

  const toggleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          User Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {moduleName} User Guide
          </DialogTitle>
          <DialogDescription>
            Step-by-step guides to help you master the {moduleName} module
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="guides" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guides">Step-by-Step Guides</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Section Navigation */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">GUIDE SECTIONS</h3>
                {sections.map((section, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-colors ${
                      activeSection === index ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveSection(index)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{section.title}</h4>
                          <Badge className={getDifficultyColor(section.difficulty)}>
                            {section.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{section.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Section Content */}
              <div className="lg:col-span-2 space-y-4">
                {sections[activeSection] && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{sections[activeSection].title}</h3>
                        <p className="text-sm text-muted-foreground">{sections[activeSection].description}</p>
                      </div>
                      <Badge className={getDifficultyColor(sections[activeSection].difficulty)}>
                        {sections[activeSection].difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {sections[activeSection].steps.map((step, stepIndex) => {
                        const stepId = `${activeSection}-${stepIndex}`;
                        const isCompleted = completedSteps.has(stepId);

                        return (
                          <Card key={stepIndex} className={`${isCompleted ? 'border-green-500 bg-green-50' : ''}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompleted ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <step.icon className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">{step.title}</h4>
                                      <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleStepComplete(stepId)}
                                      className={isCompleted ? 'text-green-600' : ''}
                                    >
                                      {isCompleted ? 'Completed' : 'Mark Complete'}
                                    </Button>
                                  </div>

                                  {step.action && (
                                    <div className="bg-blue-50 p-2 rounded text-sm">
                                      <span className="font-medium text-blue-800">Action: </span>
                                      <span className="text-blue-700">{step.action}</span>
                                    </div>
                                  )}

                                  {step.tips && step.tips.length > 0 && (
                                    <div className="space-y-1">
                                      <span className="text-xs font-medium text-muted-foreground">💡 Tips:</span>
                                      <ul className="text-xs text-muted-foreground space-y-1">
                                        {step.tips.map((tip, tipIndex) => (
                                          <li key={tipIndex} className="flex items-start gap-1">
                                            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            {tip}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quick-actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <action.icon className="h-5 w-5 text-primary" />
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: action.title,
                          description: `${action.action} feature will be available soon!`,
                        });
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {action.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}