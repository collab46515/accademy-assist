import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Send,
  FileText,
  Eye,
  ClipboardCheck,
  CheckCircle,
  CreditCard,
  UserCheck,
  Users,
  ChevronRight
} from 'lucide-react';

const admissionStages = [
  { 
    id: 0, 
    title: "Application Submitted", 
    icon: Send,
    shortTitle: "Submitted"
  },
  { 
    id: 1, 
    title: "Document Verification", 
    icon: FileText,
    shortTitle: "Documents"
  },
  { 
    id: 2, 
    title: "Application Review", 
    icon: Eye,
    shortTitle: "Review"
  },
  { 
    id: 3, 
    title: "Assessment/Interview", 
    icon: ClipboardCheck,
    shortTitle: "Assessment"
  },
  { 
    id: 4, 
    title: "Admission Decision", 
    icon: CheckCircle,
    shortTitle: "Decision"
  },
  { 
    id: 5, 
    title: "Fee Payment", 
    icon: CreditCard,
    shortTitle: "Payment"
  },
  { 
    id: 6, 
    title: "Enrollment Confirmation", 
    icon: UserCheck,
    shortTitle: "Confirmation"
  },
  { 
    id: 7, 
    title: "Welcome & Onboarding", 
    icon: Users,
    shortTitle: "Onboarding"
  },
];

export function AdmissionStagesBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current stage from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentStageId = searchParams.get('stage');
  const activeStageId = currentStageId !== null ? parseInt(currentStageId) : null;

  const handleStageClick = (stageId: number) => {
    console.log(`Stage ${stageId} clicked - navigating to /admissions?stage=${stageId}`);
    navigate(`/admissions?stage=${stageId}`);
  };

  const handleBackToDashboard = () => {
    console.log('Dashboard View button clicked - navigating to /admissions');
    navigate('/admissions');
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Admission Stages</h3>
        {activeStageId !== null && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackToDashboard}
          >
            Back to Overview
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {admissionStages.map((stage, index) => {
          const isActive = activeStageId === stage.id;
          const isCompleted = activeStageId !== null && stage.id < activeStageId;
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="flex items-center">
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleStageClick(stage.id)}
                className={cn(
                  "flex items-center gap-2 min-w-fit px-3 py-2 transition-all",
                  isActive && "bg-primary text-primary-foreground shadow-md",
                  isCompleted && "bg-green-100 text-green-800 hover:bg-green-200",
                  !isActive && !isCompleted && "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{stage.title}</span>
                <span className="sm:hidden">{stage.shortTitle}</span>
                {isActive && (
                  <div className="ml-2 h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </Button>
              
              {index < admissionStages.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mx-1" />
              )}
            </div>
          );
        })}
      </div>
      
      {activeStageId !== null && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium">
              Currently viewing: {admissionStages.find(s => s.id === activeStageId)?.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage applications in this specific stage of the admission process
          </p>
        </div>
      )}
    </div>
  );
}