import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface ApplicationWorkflowProps {
  applicationId: string;
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function ApplicationWorkflow({ applicationId, currentStatus, onStatusChange }: ApplicationWorkflowProps) {
  const steps = [
    { id: 'submitted', label: 'Submitted', icon: CheckCircle },
    { id: 'reviewing', label: 'Review', icon: Clock },
    { id: 'assessment', label: 'Assessment', icon: Clock },
    { id: 'decision', label: 'Decision', icon: Clock },
    { id: 'approved', label: 'Approved', icon: CheckCircle }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`p-2 rounded-full ${currentStatus === step.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <step.icon className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm">{step.label}</span>
              {index < steps.length - 1 && <ArrowRight className="h-4 w-4 mx-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}