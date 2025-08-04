import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { AssignmentDashboard } from '@/components/assignments/AssignmentDashboard';
import { AssignmentDetailPage } from '@/components/assignments/AssignmentDetailPage';

export default function AssignmentsPage() {
  const { id } = useParams<{ id: string }>();

  // If we have an ID, show the detail page
  if (id) {
    return <AssignmentDetailPage />;
  }

  // Otherwise show the main dashboard
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