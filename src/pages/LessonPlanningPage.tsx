import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { LessonPlanningClean } from '@/components/curriculum/LessonPlanningClean';
import { useRBAC } from '@/hooks/useRBAC';

const LessonPlanningPage = () => {
  const { currentSchool, isSchoolAdmin, hasRole } = useRBAC();
  
  // Check user permissions
  const canManageLessons = isSchoolAdmin() || hasRole('super_admin') || hasRole('hod') || hasRole('teacher');

  if (!currentSchool) {
    return (
      <div className="w-full">
        <PageHeader
          title="Lesson Planning"
          description="Create and manage detailed lesson plans with curriculum alignment"
          breadcrumbItems={[
            { label: 'Dashboard', href: '/' },
            { label: 'Academics', href: '/academics' },
            { label: 'Lesson Planning' }
          ]}
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No School Selected</h3>
              <p className="text-muted-foreground">Please select a school to access lesson planning</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!canManageLessons) {
    return (
      <div className="w-full">
        <PageHeader
          title="Lesson Planning"
          description="Create and manage detailed lesson plans with curriculum alignment"
          breadcrumbItems={[
            { label: 'Dashboard', href: '/' },
            { label: 'Academics', href: '/academics' },
            { label: 'Lesson Planning' }
          ]}
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
              <p className="text-muted-foreground">You don't have permission to access lesson planning</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full">
      <PageHeader
        title="Lesson Planning"
        description="Create and manage detailed lesson plans with curriculum alignment and auto-filled objectives"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Academics', href: '/academics' },
          { label: 'Lesson Planning' }
        ]}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl pb-16">
        <LessonPlanningClean 
          schoolId={currentSchool.id}
          canEdit={canManageLessons}
        />
      </div>
    </div>
  );
};

export default LessonPlanningPage;