import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, FileText, User, Calendar } from 'lucide-react';

interface ApplicationSubmittedStageProps {
  applicationId: string;
  applicationData: any;
  onMoveToNext: () => void;
}

export function ApplicationSubmittedStage({ applicationId, applicationData, onMoveToNext }: ApplicationSubmittedStageProps) {
  const validationChecks = [
    { id: 'personal_details', label: 'Personal Details Complete', status: 'completed' },
    { id: 'parent_details', label: 'Parent/Guardian Details', status: 'completed' },
    { id: 'academic_history', label: 'Academic History', status: 'completed' },
    { id: 'emergency_contact', label: 'Emergency Contact', status: 'pending' },
    { id: 'medical_info', label: 'Medical Information', status: 'pending' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Application Number</p>
              <p className="font-medium">{applicationData?.application_number || 'APP-2024-001'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student Name</p>
              <p className="font-medium">{applicationData?.student_name || 'John Smith'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year Group</p>
              <p className="font-medium">{applicationData?.year_group || 'Year 7'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>
              <p className="font-medium">{new Date(applicationData?.submitted_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Initial Validation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <span className="font-medium">{check.label}</span>
                </div>
                {getStatusBadge(check.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              View Student Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Download Application
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage Action */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to proceed to Document Verification?</p>
              <p className="text-sm text-muted-foreground">
                Ensure all validation checks are complete before moving to the next stage.
              </p>
            </div>
            <Button onClick={onMoveToNext} className="ml-4">
              Move to Document Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}