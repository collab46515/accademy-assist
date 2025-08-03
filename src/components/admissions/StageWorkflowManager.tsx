import React, { useState } from 'react';
import { ApplicationSubmittedStage } from './stages/ApplicationSubmittedStage';
import { DocumentVerificationStage } from './stages/DocumentVerificationStage';
import { ApplicationReviewStage } from './stages/ApplicationReviewStage';
import { AssessmentInterviewStage } from './stages/AssessmentInterviewStage';
import { AdmissionDecisionStage } from './stages/AdmissionDecisionStage';
import { FeePaymentStage } from './stages/FeePaymentStage';
import { EnrollmentConfirmationStage } from './stages/EnrollmentConfirmationStage';
import { WelcomeOnboardingStage } from './stages/WelcomeOnboardingStage';

interface StageWorkflowManagerProps {
  applicationId: string;
  currentStage?: number;
}

export function StageWorkflowManager({ applicationId, currentStage = 0 }: StageWorkflowManagerProps) {
  const [activeStage, setActiveStage] = useState(currentStage);

  // Mock application data for demonstration
  const mockApplicationData = {
    application_number: 'APP-2024-001',
    student_name: 'John Smith',
    year_group: 'Year 7',
    submitted_at: new Date().toISOString()
  };

  const stages = [
    { component: ApplicationSubmittedStage, title: 'Application Submitted' },
    { component: DocumentVerificationStage, title: 'Document Verification' },
    { component: ApplicationReviewStage, title: 'Application Review' },
    { component: AssessmentInterviewStage, title: 'Assessment/Interview' },
    { component: AdmissionDecisionStage, title: 'Admission Decision' },
    { component: FeePaymentStage, title: 'Fee Payment' },
    { component: EnrollmentConfirmationStage, title: 'Enrollment Confirmation' },
    { component: WelcomeOnboardingStage, title: 'Welcome & Onboarding' }
  ];

  const handleNextStage = () => {
    if (activeStage < stages.length - 1) {
      setActiveStage(activeStage + 1);
    }
  };

  const handleComplete = () => {
    console.log('Admission process completed');
  };

  const CurrentStageComponent = stages[activeStage].component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{stages[activeStage].title}</h2>
        <div className="text-sm text-muted-foreground">
          Stage {activeStage + 1} of {stages.length}
        </div>
      </div>
      
      <CurrentStageComponent
        applicationId={applicationId}
        applicationData={mockApplicationData}
        onMoveToNext={handleNextStage}
        onComplete={handleComplete}
      />
    </div>
  );
}