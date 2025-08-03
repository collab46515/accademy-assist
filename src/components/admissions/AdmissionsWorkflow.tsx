import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  FileCheck, 
  Eye, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  Edit3,
  Send
} from 'lucide-react';

interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  source: 'online' | 'referral' | 'call_centre' | 'walk_in';
  currentStage: 'submission' | 'enrollment' | 'review' | 'assessment' | 'decision' | 'deposit' | 'confirmed' | 'class_allocation';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  yearGroup: string;
  submittedAt: string;
  progress: number;
}

const WORKFLOW_STAGES = [
  { 
    key: 'submission', 
    label: 'Application Submission', 
    description: 'Initial application received from various sources',
    icon: UserPlus,
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    key: 'enrollment', 
    label: 'Enrollment Processing', 
    description: 'Basic enrollment requirements processing',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-800'
  },
  { 
    key: 'review', 
    label: 'Detailed Review', 
    description: 'Comprehensive review of all application details',
    icon: Eye,
    color: 'bg-amber-100 text-amber-800'
  },
  { 
    key: 'assessment', 
    label: 'Assessment/Interview', 
    description: 'Online assessment or personal interview conducted',
    icon: Calendar,
    color: 'bg-indigo-100 text-indigo-800'
  },
  { 
    key: 'decision', 
    label: 'Admission Decision', 
    description: 'Final decision: Approved, Rejected, or On Hold',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800'
  },
  { 
    key: 'deposit', 
    label: 'Deposit Payment', 
    description: 'Deposit payment processing (if approved)',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-800'
  },
  { 
    key: 'confirmed', 
    label: 'Admission Confirmed', 
    description: 'Final admission confirmation',
    icon: CheckCircle,
    color: 'bg-green-200 text-green-900'
  },
  { 
    key: 'class_allocation', 
    label: 'Class Allocation', 
    description: 'Class assignment and final setup',
    icon: GraduationCap,
    color: 'bg-blue-200 text-blue-900'
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    applicationNumber: 'APP2024001',
    studentName: 'Emma Thompson',
    source: 'online',
    currentStage: 'review',
    status: 'in_progress',
    yearGroup: 'Year 7',
    submittedAt: '2024-01-15',
    progress: 35
  },
  {
    id: '2',
    applicationNumber: 'APP2024002',
    studentName: 'James Wilson',
    source: 'referral',
    currentStage: 'assessment',
    status: 'in_progress',
    yearGroup: 'Year 9',
    submittedAt: '2024-01-18',
    progress: 60
  },
  {
    id: '3',
    applicationNumber: 'APP2024003',
    studentName: 'Sophie Chen',
    source: 'call_centre',
    currentStage: 'decision',
    status: 'pending',
    yearGroup: 'Year 8',
    submittedAt: '2024-01-20',
    progress: 75
  }
];

export function AdmissionsWorkflow() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [editMode, setEditMode] = useState(false);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'online': return '🌐';
      case 'referral': return '👥';
      case 'call_centre': return '📞';
      case 'walk_in': return '🚶';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (application: Application) => {
    setSelectedApplication(application);
    setEditMode(true);
  };

  const handleAdvanceStage = (applicationId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const currentIndex = WORKFLOW_STAGES.findIndex(stage => stage.key === app.currentStage);
        const nextStage = WORKFLOW_STAGES[currentIndex + 1];
        
        if (nextStage) {
          return {
            ...app,
            currentStage: nextStage.key as any,
            progress: Math.min(100, app.progress + 12.5)
          };
        }
      }
      return app;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admissions Workflow</h2>
          <p className="text-muted-foreground">
            Track applications through the complete admissions process
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Workflow Stages Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {WORKFLOW_STAGES.map((stage, index) => (
              <div key={stage.key} className="relative">
                <div className={`p-4 rounded-lg text-center ${stage.color}`}>
                  <stage.icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{stage.label}</p>
                </div>
                {index < WORKFLOW_STAGES.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground absolute -right-2 top-1/2 transform -translate-y-1/2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {applications.map((application) => {
          const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.key === application.currentStage);
          const currentStageInfo = WORKFLOW_STAGES[currentStageIndex];
          
          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{application.studentName}</h3>
                      <Badge variant="outline">{application.applicationNumber}</Badge>
                      <span className="text-2xl">{getSourceIcon(application.source)}</span>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {application.yearGroup} • Submitted {application.submittedAt}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(application)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleAdvanceStage(application.id)}
                      disabled={currentStageIndex >= WORKFLOW_STAGES.length - 1}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Advance
                    </Button>
                  </div>
                </div>

                {/* Current Stage */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <currentStageInfo.icon className="h-4 w-4" />
                    <span className="font-medium">Current Stage: {currentStageInfo.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentStageInfo.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workflow Progress</span>
                    <span className="font-medium">{application.progress}%</span>
                  </div>
                  <Progress value={application.progress} className="h-2" />
                </div>

                {/* Stage Timeline */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {WORKFLOW_STAGES.map((stage, index) => (
                    <div
                      key={stage.key}
                      className={`flex-shrink-0 w-3 h-3 rounded-full ${
                        index <= currentStageIndex 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/20'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog would go here */}
      {editMode && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Application - {selectedApplication.studentName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Edit functionality will be implemented here.</p>
              <div className="flex gap-2">
                <Button onClick={() => setEditMode(false)}>Cancel</Button>
                <Button variant="outline">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}