import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, Users } from 'lucide-react';
import { useCommunicationTemplates } from '@/hooks/useCommunicationTemplates';

interface WelcomeOnboardingStageProps {
  applicationId: string;
  applicationData?: any;
  onMoveToNext: () => void;
}

export function WelcomeOnboardingStage({ applicationId, applicationData, onMoveToNext }: WelcomeOnboardingStageProps) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    reopeningDate: '',
    reportingTime: '',
    uniformBooksDetails: '',
    teacherContact: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
  });
  const { sendWelcomeEmail } = useCommunicationTemplates();

  const handleSendWelcomeEmail = async () => {
    try {
      await sendWelcomeEmail({
        applicationId,
        studentName: applicationData?.student_name || 'Student',
        yearGroup: applicationData?.year_group || '',
        parentEmail: applicationData?.parent_email || applicationData?.email || '',
        schoolData: emailData,
      });
      setShowEmailDialog(false);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Welcome & Onboarding Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Welcome pack sent</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Orientation scheduled</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Uniform ordered</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Portal access granted</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Calendar shared</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowEmailDialog(true)}
              className="flex-1 gap-2"
            >
              <Mail className="h-4 w-4" />
              Send Welcome Email
            </Button>
            <Button onClick={onMoveToNext} className="flex-1">
              Complete Enrollment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Welcome & Onboarding Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>School Reopening Date</Label>
              <Input
                type="date"
                value={emailData.reopeningDate}
                onChange={(e) => setEmailData({ ...emailData, reopeningDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Reporting Time</Label>
              <Input
                placeholder="e.g., 8:00 AM"
                value={emailData.reportingTime}
                onChange={(e) => setEmailData({ ...emailData, reportingTime: e.target.value })}
              />
            </div>
            <div>
              <Label>Uniform & Books Details</Label>
              <Input
                placeholder="Contact details or dates"
                value={emailData.uniformBooksDetails}
                onChange={(e) => setEmailData({ ...emailData, uniformBooksDetails: e.target.value })}
              />
            </div>
            <div>
              <Label>Class Teacher Contact</Label>
              <Input
                placeholder="Name & contact"
                value={emailData.teacherContact}
                onChange={(e) => setEmailData({ ...emailData, teacherContact: e.target.value })}
              />
            </div>
            <div>
              <Label>Academic Year</Label>
              <Input
                placeholder="e.g., 2024-2025"
                value={emailData.academicYear}
                onChange={(e) => setEmailData({ ...emailData, academicYear: e.target.value })}
              />
            </div>
            <Button onClick={handleSendWelcomeEmail} className="w-full">
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}