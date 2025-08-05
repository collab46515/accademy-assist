import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { EnrollmentForm } from '@/components/enrollment/EnrollmentForm';
import { PathwayType } from '@/lib/enrollment-schemas';

export default function EnrollmentPage() {
  const [searchParams] = useSearchParams();
  const applicationType = searchParams.get('type') || 'standard';
  
  // Map application types to pathway types
  const getPathwayFromType = (type: string): PathwayType => {
    const typeMap: Record<string, PathwayType> = {
      'online_application': 'standard',
      'sibling_application': 'standard',
      'phone_enquiry': 'standard',
      'international_student': 'standard',
      'mid-year_entry': 'standard',
      'bulk_import': 'bulk_import',
      'emergency': 'emergency',
      'sen': 'sen',
      'staff_child': 'staff_child',
      'internal_progression': 'internal_progression',
    };
    
    return typeMap[type] || 'standard';
  };

  const pathway = getPathwayFromType(applicationType);

  return (
    <div className="container mx-auto px-4 py-8">
      <EnrollmentForm pathway={pathway} />
    </div>
  );
}