import { PageHeader } from '@/components/layout/PageHeader';
import { ClassSubjectManager } from '@/components/academic/ClassSubjectManager';
import { GraduationCap } from 'lucide-react';

export default function AcademicManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="Academic Management" 
        description="Manage classes, subjects, and teacher assignments"
      />
      <div className="container mx-auto py-6 px-4">
        <ClassSubjectManager />
      </div>
    </div>
  );
}