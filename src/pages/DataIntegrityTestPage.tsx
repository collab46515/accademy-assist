import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataIntegrityTest } from '@/components/test/DataIntegrityTest';
import { AuditRunner } from '@/components/test/AuditRunner';

export default function DataIntegrityTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <PageHeader
        title="Data Integrity Testing"
        description="Test and validate student & teacher creation workflows"
        showBackButton={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Administration', href: '/administration' },
          { label: 'Data Testing' }
        ]}
      />
      <div className="p-6 space-y-8">
        <AuditRunner />
        <DataIntegrityTest />
      </div>
    </div>
  );
}