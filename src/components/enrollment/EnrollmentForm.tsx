import React from 'react';
import { Form } from '@/components/ui/form';
import { EnrollmentFormWrapper, useEnrollmentContext } from './EnrollmentFormWrapper';
import { StudentDetailsSection } from './form-sections/StudentDetailsSection';
import { ParentDetailsSection } from './form-sections/ParentDetailsSection';
import { MedicalSENSection } from './form-sections/MedicalSENSection';
import { ReviewSection } from './form-sections/ReviewSection';
import { PathwayType } from '@/lib/enrollment-schemas';

interface EnrollmentFormProps {
  pathway: PathwayType;
  applicationId?: string;
}

function EnrollmentFormContent() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form, currentStep } = formHook;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StudentDetailsSection />;
      case 2:
        return <ParentDetailsSection />;
      case 3:
        return <MedicalSENSection />;
      default:
        return <ReviewSection />;
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {renderCurrentStep()}
      </form>
    </Form>
  );
}

export function EnrollmentForm({ pathway, applicationId }: EnrollmentFormProps) {
  return (
    <EnrollmentFormWrapper pathway={pathway} applicationId={applicationId}>
      <EnrollmentFormContent />
    </EnrollmentFormWrapper>
  );
}