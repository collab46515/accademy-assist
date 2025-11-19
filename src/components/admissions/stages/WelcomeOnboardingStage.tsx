import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, ShoppingBag, Users } from 'lucide-react';

interface WelcomeOnboardingStageProps {
  applicationId: string;
  applicationData?: any;
  onMoveToNext: () => void;
}

export function WelcomeOnboardingStage({ applicationId, onMoveToNext }: WelcomeOnboardingStageProps) {
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
          <Button onClick={onMoveToNext} className="mt-4 w-full">
            Complete Enrollment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}