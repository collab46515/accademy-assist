import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SchoolSettingsManager } from '@/components/admin/SchoolSettingsManager';
import { SchoolModuleManager } from '@/components/admin/SchoolModuleManager';
import { UserGuide } from '@/components/shared/UserGuide';
import { useRBAC } from '@/hooks/useRBAC';

// Create a school management user guide
const schoolManagementUserGuide = {
  moduleName: "School Management",
  sections: [
    {
      title: "School Information Setup",
      description: "Configure basic school details and contact information",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Basic School Details",
          description: "Set up school name, code, and contact information",
          icon: "Building" as any,
          action: "Go to School Info tab → Basic Information",
          tips: [
            "Choose a unique school code for easy identification",
            "Ensure all contact details are accurate",
            "Include a complete postal address"
          ]
        },
        {
          title: "Leadership Information",
          description: "Add principal details and school identity",
          icon: "Users" as any,
          action: "Complete Leadership & Identity section",
          tips: [
            "Add current principal's full name",
            "Include school motto for identity",
            "Set accurate student and staff numbers"
          ]
        }
      ]
    },
    {
      title: "Branding & Visual Identity",
      description: "Set up school logo and brand colors",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Upload School Logo",
          description: "Add official school logo and branding assets",
          icon: "Upload" as any,
          action: "Go to Branding tab → School Logo",
          tips: [
            "Use PNG or SVG format for best quality",
            "Minimum 200x200px resolution recommended",
            "Logo appears across all school documents"
          ]
        },
        {
          title: "Configure Color Scheme",
          description: "Set primary, secondary, and accent colors",
          icon: "Palette" as any,
          action: "Define Color Scheme in Branding tab",
          tips: [
            "Choose colors that reflect school identity",
            "Ensure good contrast for accessibility",
            "Colors will be used throughout the system"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "School Information",
      description: "Update basic school details",
      icon: "Building" as any,
      action: "Edit School Info"
    },
    {
      title: "Upload Logo",
      description: "Add school branding",
      icon: "Upload" as any,
      action: "Upload Branding"
    },
    {
      title: "Academic Settings",
      description: "Configure academic year",
      icon: "GraduationCap" as any,
      action: "Academic Config"
    },
    {
      title: "System Settings",
      description: "Security and preferences",
      icon: "Settings" as any,
      action: "System Config"
    }
  ]
};

export default function SchoolSettingsPage() {
  const { isSuperAdmin } = useRBAC();
  
  // Reset scroll position when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader 
        title="School Settings" 
        description="Configure school information, branding, and system settings"
        actions={
          <UserGuide 
            moduleName={schoolManagementUserGuide.moduleName}
            sections={schoolManagementUserGuide.sections}
            quickActions={schoolManagementUserGuide.quickActions}
          />
        }
      />
      
      <div className="w-full max-w-full space-y-8">
        <SchoolSettingsManager />
        
        {/* School Module Configuration - Super Admin Only */}
        {isSuperAdmin() && (
          <SchoolModuleManager />
        )}
      </div>
    </div>
  );
}