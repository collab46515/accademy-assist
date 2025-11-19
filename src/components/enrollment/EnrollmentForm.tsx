import React from 'react';
import { Form } from '@/components/ui/form';
import { EnrollmentFormWrapper, useEnrollmentContext } from './EnrollmentFormWrapper';
import { StudentDetailsSection } from './form-sections/StudentDetailsSection';
import { ParentDetailsSection } from './form-sections/ParentDetailsSection';
import { AddressSection } from './form-sections/AddressSection';
import { AcademicSection } from './form-sections/AcademicSection';
import { ReferencesSection } from './form-sections/ReferencesSection';
import { DocumentsSection } from './form-sections/DocumentsSection';
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
    if (pathway === 'standard') {
      switch (currentStep) {
        case 1:
          return <StudentDetailsSection />;
        case 2:
          return <ParentDetailsSection />;
        case 3:
          return <AddressSection />;
        case 4:
          return <AcademicSection />;
        case 5:
          return <ReferencesSection />;
        case 6:
          return <DocumentsSection />;
        default:
          return <ReviewSection />;
      }
    }
    
    // For other pathways, keep original behavior
    switch (currentStep) {
      case 1:
        return <StudentDetailsSection />;
      case 2:
        return <ParentDetailsSection />;
      case 3:
        return <DocumentsSection />;
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
