import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  DollarSign, 
  FileCheck, 
  Eye, 
  Calendar, 
  CheckCircle, 
  CreditCard,
  GraduationCap,
  Award,
  ArrowRight
} from 'lucide-react';

const WORKFLOW_STAGES = [
  { key: 'submission', label: 'Application Submission', icon: UserPlus, color: 'bg-blue-100 text-blue-800', stageId: 0 },
  { key: 'application_fee', label: 'Application Fee', icon: DollarSign, color: 'bg-yellow-100 text-yellow-800', stageId: 1 },
  { key: 'enrollment', label: 'Enrollment Processing', icon: FileCheck, color: 'bg-purple-100 text-purple-800', stageId: 1 },
  { key: 'review', label: 'Detailed Review', icon: Eye, color: 'bg-amber-100 text-amber-800', stageId: 2 },
  { key: 'assessment', label: 'Assessment/Interview', icon: Calendar, color: 'bg-indigo-100 text-indigo-800', stageId: 3 },
  { key: 'decision', label: 'Admission Decision', icon: CheckCircle, color: 'bg-green-100 text-green-800', stageId: 4 },
  { key: 'deposit', label: 'Deposit Payment', icon: CreditCard, color: 'bg-emerald-100 text-emerald-800', stageId: 5 },
  { key: 'confirmed', label: 'Admission Confirmed', icon: Award, color: 'bg-green-200 text-green-900', stageId: 6 },
  { key: 'class_allocation', label: 'Class Allocation', icon: GraduationCap, color: 'bg-blue-200 text-blue-900', stageId: 7 }
];

export function AdmissionsFlowVisualization() {
  const navigate = useNavigate();

  const handleStageClick = (stageId: number, stageName: string) => {
    console.log(`Clicking stage ${stageName} (ID: ${stageId}) - navigating to /admissions?stage=${stageId}`);
    navigate(`/admissions?stage=${stageId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">End-to-End Admissions Process Flow</CardTitle>
        <p className="text-muted-foreground text-center">
          Complete workflow from initial application to class allocation - Click any stage to manage applications
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Top Row */}
          <div className="flex justify-center items-center gap-4 overflow-x-auto pb-4">
            {WORKFLOW_STAGES.slice(0, 5).map((stage, index) => (
              <React.Fragment key={stage.key}>
                <div className="flex flex-col items-center min-w-[140px]">
                  <Button
                    onClick={() => handleStageClick(stage.stageId, stage.label)}
                    variant="ghost"
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <div className={`p-4 rounded-xl ${stage.color} mb-2 hover:shadow-md transition-shadow cursor-pointer`}>
                      <stage.icon className="h-8 w-8" />
                    </div>
                  </Button>
                  <Badge 
                    variant="outline" 
                    className="text-xs text-center whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => handleStageClick(stage.stageId, stage.label)}
                  >
                    {stage.label}
                  </Badge>
                </div>
                {index < 4 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Flow Direction */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 mb-2" />
              <Badge variant="secondary" className="text-xs">
                Decision Point
              </Badge>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-center items-center gap-4 overflow-x-auto">
            {WORKFLOW_STAGES.slice(5).map((stage, index) => (
              <React.Fragment key={stage.key}>
                <div className="flex flex-col items-center min-w-[140px]">
                  <Button
                    onClick={() => handleStageClick(stage.stageId, stage.label)}
                    variant="ghost"
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <div className={`p-4 rounded-xl ${stage.color} mb-2 hover:shadow-md transition-shadow cursor-pointer`}>
                      <stage.icon className="h-8 w-8" />
                    </div>
                  </Button>
                  <Badge 
                    variant="outline" 
                    className="text-xs text-center whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => handleStageClick(stage.stageId, stage.label)}
                  >
                    {stage.label}
                  </Badge>
                </div>
                {index < 3 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Status Legend */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Process Status Legend:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Rejected</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}