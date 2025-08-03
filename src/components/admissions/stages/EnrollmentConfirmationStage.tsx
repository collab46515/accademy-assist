import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Calendar, BookOpen, Home } from 'lucide-react';

interface EnrollmentConfirmationStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function EnrollmentConfirmationStage({ applicationId, onMoveToNext }: EnrollmentConfirmationStageProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Enrollment Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="font-medium">STU-2024-001</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">September 1, 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Form Class</p>
              <p className="font-medium">7A</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">House</p>
              <p className="font-medium">Churchill House</p>
            </div>
          </div>
          <Button onClick={onMoveToNext} className="mt-4">
            Move to Welcome & Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}