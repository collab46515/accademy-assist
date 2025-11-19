import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, CheckCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STAGES = [
  { 
    id: 0,
    title: 'Application Submitted', 
    status: 'submitted',
    description: 'Initial review',
    icon: '📝',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    id: 1,
    title: 'Application Review & Verify', 
    status: 'under_review',
    description: 'Document verification + scoring',
    icon: '📋',
    color: 'bg-purple-100 text-purple-800'
  },
  { 
    id: 2,
    title: 'Assessment/Interview', 
    status: 'assessment_scheduled',
    description: 'Schedule & conduct',
    icon: '📅',
    color: 'bg-indigo-100 text-indigo-800'
  },
  { 
    id: 3,
    title: 'Admission Decision', 
    status: 'approved',
    description: 'Accept/reject/waitlist',
    icon: '✅',
    color: 'bg-green-100 text-green-800'
  },
  { 
    id: 4,
    title: 'Fee Payment', 
    status: 'fee_pending',
    description: 'Process fees',
    icon: '💳',
    color: 'bg-emerald-100 text-emerald-800'
  },
  { 
    id: 5,
    title: 'Enrollment Confirmation', 
    status: 'enrollment_confirmed',
    description: 'Finalize enrollment',
    icon: '🎯',
    color: 'bg-green-200 text-green-900'
  },
  { 
    id: 6,
    title: 'Welcome & Onboarding', 
    status: 'enrolled',
    description: 'Student orientation',
    icon: '🏫',
    color: 'bg-blue-200 text-blue-900'
  }
];

export function StageNavigator() {
  const navigate = useNavigate();

  const handleStageClick = (stageId: number) => {
    navigate(`/admissions?stage=${stageId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admissions Workflow Stages</CardTitle>
        <p className="text-muted-foreground">
          Click on any stage to view applications in that stage
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {STAGES.map((stage, index) => (
            <div key={stage.id} className="relative">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStageClick(stage.id)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">{stage.icon}</div>
                    <div className="text-sm font-medium">{stage.title}</div>
                    <div className="text-xs text-muted-foreground">{stage.description}</div>
                    <Badge variant="outline" className="text-xs">
                      Stage {stage.id + 1}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector */}
              {index < STAGES.length - 1 && index % 3 !== 2 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground absolute -right-2 top-1/2 transform -translate-y-1/2 hidden lg:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How the workflow works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Applications automatically progress through each stage</li>
            <li>• Staff can advance applications using the "Advance" button</li>
            <li>• Final stage automatically creates student records</li>
            <li>• Use stage navigation to manage applications in specific stages</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}