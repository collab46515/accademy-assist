import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AssignmentDashboard } from '@/components/assignments/AssignmentDashboard';

export default function AssignmentsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Assignments & Homework"
        description="Create, assign, and track student assignments and homework"
      />
      <AssignmentDashboard />
    </div>
  );
}