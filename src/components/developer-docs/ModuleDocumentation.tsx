import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileCode, Package, Database, Code } from 'lucide-react';

export function ModuleDocumentation() {
  const modules = [
    {
      name: 'Academic Operations',
      description: 'Core academic management functionality',
      components: [
        { 
          name: 'Admissions', 
          path: 'src/pages/UnifiedAdmissionsPage.tsx',
          purpose: 'Handles student admission workflow from application to enrollment',
          keyFeatures: ['Application management', 'Document verification', 'Enrollment process', 'Credential generation'],
          hooks: ['useAuth', 'useRBAC', 'supabase queries'],
          tables: ['enrollment_applications', 'students', 'student_parents', 'profiles', 'user_roles']
        },
        {
          name: 'Curriculum & Lessons',
          path: 'src/pages/CurriculumPage.tsx',
          purpose: 'Manage curriculum, lesson plans, and teaching schedules',
          keyFeatures: ['Curriculum builder', 'Lesson planning', 'Subject management', 'Approval workflow'],
          hooks: ['useAuth', 'usePermissions'],
          tables: ['lesson_plans', 'curriculum', 'subjects', 'lesson_plan_approvals']
        },
        {
          name: 'Assignments',
          path: 'src/pages/AssignmentsPage.tsx',
          purpose: 'Assignment creation, distribution, and submission tracking',
          keyFeatures: ['Create assignments', 'Student submissions', 'Grading interface', 'Feedback system'],
          hooks: ['useAssignmentData'],
          tables: ['assignments', 'assignment_submissions', 'gradebook_records']
        },
        {
          name: 'Timetable',
          path: 'src/pages/TimetablePage.tsx',
          purpose: 'School timetable management and scheduling',
          keyFeatures: ['Class scheduling', 'Teacher allocation', 'Room assignment', 'Conflict detection'],
          hooks: ['useAuth'],
          tables: ['timetable', 'classes', 'rooms', 'teachers']
        },
        {
          name: 'Gradebook',
          path: 'src/pages/GradebookPage.tsx',
          purpose: 'Student grade management and academic performance tracking',
          keyFeatures: ['Grade entry', 'Grade calculation', 'Performance analytics', 'Report generation'],
          hooks: ['useAuth', 'usePermissions'],
          tables: ['gradebook_records', 'students', 'subjects', 'assessment_types']
        },
        {
          name: 'Exams & Assessment',
          path: 'src/pages/ExamsPage.tsx',
          purpose: 'Examination scheduling and assessment management',
          keyFeatures: ['Exam scheduling', 'Grade recording', 'Result processing', 'Report cards'],
          hooks: ['useAuth'],
          tables: ['exams', 'exam_schedules', 'exam_results', 'grade_boundaries']
        }
      ]
    },
    {
      name: 'Student Services',
      description: 'Student-centric services and support',
      components: [
        {
          name: 'Student Directory',
          path: 'src/pages/StudentsPage.tsx',
          purpose: 'Centralized student information management',
          keyFeatures: ['Student profiles', 'Search and filter', 'Bulk operations', 'Student details view'],
          hooks: ['useAuth', 'useRBAC', 'usePermissions'],
          tables: ['students', 'profiles', 'user_roles', 'classes']
        },
        {
          name: 'Attendance Tracking',
          path: 'src/pages/AttendancePage.tsx',
          purpose: 'Daily attendance recording and reporting',
          keyFeatures: ['Mark attendance', 'Attendance reports', 'Absence tracking', 'Late arrivals'],
          hooks: ['useAuth'],
          tables: ['attendance_records', 'students', 'classes', 'attendance_sessions']
        },
        {
          name: 'Student Welfare',
          path: 'src/pages/StudentWelfarePage.tsx',
          purpose: 'Student wellbeing and support services',
          keyFeatures: ['Welfare tracking', 'Support records', 'Incident management', 'Intervention tracking'],
          hooks: ['useAuth', 'useRBAC'],
          tables: ['welfare_records', 'students', 'support_plans']
        },
        {
          name: 'Safeguarding',
          path: 'src/pages/SafeguardingPage.tsx',
          purpose: 'Child protection and safeguarding management',
          keyFeatures: ['Concern logging', 'Action tracking', 'Chronology', 'Confidential records'],
          hooks: ['useAuth', 'useRBAC'],
          tables: ['safeguarding_concerns', 'safeguarding_actions', 'chronology']
        },
        {
          name: 'Behavior Tracking',
          path: 'src/pages/BehaviorTrackingPage.tsx',
          purpose: 'Student behavior monitoring and intervention',
          keyFeatures: ['Behavior logging', 'Points system', 'Rewards and sanctions', 'Behavior analytics'],
          hooks: ['useAuth'],
          tables: ['behavior_records', 'behavior_points', 'sanctions', 'rewards']
        },
        {
          name: 'Library Services',
          path: 'src/pages/LibraryPage.tsx',
          purpose: 'Library resource management and circulation',
          keyFeatures: ['Book catalog', 'Checkout system', 'Return tracking', 'Fine management'],
          hooks: ['useAuth'],
          tables: ['library_books', 'library_checkouts', 'library_fines']
        },
        {
          name: 'Transport Management',
          path: 'src/pages/TransportPage.tsx',
          purpose: 'School transport operations and route management',
          keyFeatures: ['Route planning', 'Vehicle management', 'Student assignments', 'Driver tracking'],
          hooks: ['useAuth'],
          tables: ['transport_routes', 'transport_vehicles', 'transport_assignments']
        }
      ]
    },
    {
      name: 'Staff & HR',
      description: 'Human resources and staff management',
      components: [
        {
          name: 'Employee Management',
          path: 'src/pages/HRManagementPage.tsx',
          purpose: 'Comprehensive HR management system',
          keyFeatures: ['Employee records', 'Recruitment', 'Performance reviews', 'Payroll', 'Leave management'],
          hooks: ['useAuth', 'useRBAC'],
          tables: ['employees', 'departments', 'positions', 'payroll', 'leave_requests', 'performance_reviews']
        },
        {
          name: 'Staff Directory',
          path: 'src/pages/StaffPage.tsx',
          purpose: 'Staff member directory and profiles',
          keyFeatures: ['Staff profiles', 'Contact information', 'Department organization', 'Role assignments'],
          hooks: ['useAuth', 'useRBAC'],
          tables: ['employees', 'profiles', 'departments', 'user_roles']
        }
      ]
    },
    {
      name: 'Finance & Operations',
      description: 'Financial management and accounting',
      components: [
        {
          name: 'Fee Management',
          path: 'src/pages/FeeManagementPage.tsx',
          purpose: 'Student fee collection and tracking',
          keyFeatures: ['Fee structure', 'Payment tracking', 'Invoicing', 'Receipt generation', 'Defaulter reports'],
          hooks: ['useAuth'],
          tables: ['fee_structures', 'fee_payments', 'invoices', 'payment_receipts']
        },
        {
          name: 'Accounting',
          path: 'src/pages/AccountingPage.tsx',
          purpose: 'Complete accounting and financial management',
          keyFeatures: ['General ledger', 'Accounts payable/receivable', 'Budget tracking', 'Financial reports', 'Vendor management'],
          hooks: ['useAuth', 'useRBAC'],
          tables: ['accounts', 'transactions', 'invoices', 'bills', 'vendors', 'purchase_orders', 'budget']
        }
      ]
    },
    {
      name: 'Administration',
      description: 'System administration and configuration',
      components: [
        {
          name: 'User Management',
          path: 'src/pages/UserManagementPage.tsx',
          purpose: 'User account management and administration',
          keyFeatures: ['Create users', 'Assign roles', 'Manage permissions', 'Password resets', 'User search'],
          hooks: ['useAuth', 'useRBAC'],
          tables: ['profiles', 'user_roles', 'schools']
        },
        {
          name: 'Permission Management',
          path: 'src/pages/PermissionManagementPage.tsx',
          purpose: 'Fine-grained permission configuration',
          keyFeatures: ['Role permissions', 'Module access', 'Field-level security', 'Permission matrix'],
          hooks: ['usePermissions', 'useAuth'],
          tables: ['role_module_permissions', 'field_permissions', 'modules']
        },
        {
          name: 'School Settings',
          path: 'src/pages/SchoolSettingsPage.tsx',
          purpose: 'School-specific configuration and settings',
          keyFeatures: ['School profile', 'Academic calendar', 'Grading system', 'School modules'],
          hooks: ['useAuth', 'useRBAC', 'useSchoolModules'],
          tables: ['schools', 'school_modules', 'academic_terms']
        },
        {
          name: 'Master Data',
          path: 'src/pages/MasterDataPage.tsx',
          purpose: 'Core reference data management',
          keyFeatures: ['Subjects', 'Classes', 'Departments', 'Year groups', 'Data import/export'],
          hooks: ['useAuth'],
          tables: ['subjects', 'classes', 'departments', 'year_groups']
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Module Documentation
          </CardTitle>
          <CardDescription>
            Detailed documentation for all system modules, components, and their functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {modules.map((module, index) => (
              <AccordionItem key={index} value={`module-${index}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    {module.name}
                    <Badge variant="secondary">{module.components.length} components</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  
                  <div className="space-y-4">
                    {module.components.map((component, compIndex) => (
                      <Card key={compIndex} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileCode className="w-4 h-4" />
                            {component.name}
                          </CardTitle>
                          <CardDescription>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{component.path}</code>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Purpose</h4>
                            <p className="text-sm text-muted-foreground">{component.purpose}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Key Features
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {component.keyFeatures.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start gap-2">
                                  <span className="text-primary mt-0.5">•</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2">Hooks Used</h4>
                            <div className="flex flex-wrap gap-2">
                              {component.hooks.map((hook, hIndex) => (
                                <Badge key={hIndex} variant="outline" className="text-xs">
                                  {hook}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Database Tables
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {component.tables.map((table, tIndex) => (
                                <Badge key={tIndex} variant="secondary" className="text-xs font-mono">
                                  {table}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
