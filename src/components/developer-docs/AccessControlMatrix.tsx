import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function AccessControlMatrix() {
  const roles = [
    { id: 'super_admin', label: 'Super Admin', color: 'destructive' },
    { id: 'school_admin', label: 'School Admin', color: 'default' },
    { id: 'teacher', label: 'Teacher', color: 'secondary' },
    { id: 'hod', label: 'Head of Department', color: 'outline' },
    { id: 'student', label: 'Student', color: 'secondary' },
    { id: 'parent', label: 'Parent', color: 'outline' },
    { id: 'dsl', label: 'DSL (Safeguarding)', color: 'destructive' },
  ];

  const modules = [
    {
      category: 'Academic Operations',
      items: [
        { name: 'Dashboard', view: ['all'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
        { name: 'Admissions Workflow', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Curriculum & Lessons', view: ['super_admin', 'school_admin', 'hod', 'teacher'], create: ['super_admin', 'school_admin', 'hod', 'teacher'], edit: ['super_admin', 'school_admin', 'hod', 'teacher'], delete: ['super_admin', 'school_admin', 'hod'] },
        { name: 'Timetable Management', view: ['super_admin', 'school_admin', 'hod', 'teacher', 'student'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Assignments', view: ['super_admin', 'school_admin', 'hod', 'teacher', 'student'], create: ['super_admin', 'school_admin', 'teacher'], edit: ['super_admin', 'school_admin', 'teacher'], delete: ['super_admin', 'school_admin', 'teacher'] },
        { name: 'Gradebook', view: ['super_admin', 'school_admin', 'hod', 'teacher', 'student', 'parent'], create: ['super_admin', 'school_admin', 'teacher'], edit: ['super_admin', 'school_admin', 'teacher'], delete: ['super_admin', 'school_admin'] },
        { name: 'Exams & Assessment', view: ['super_admin', 'school_admin', 'hod', 'teacher', 'student'], create: ['super_admin', 'school_admin', 'teacher'], edit: ['super_admin', 'school_admin', 'teacher'], delete: ['super_admin', 'school_admin'] },
        { name: 'Report Cards', view: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
      ]
    },
    {
      category: 'Student Services',
      items: [
        { name: 'Student Directory', view: ['super_admin', 'school_admin', 'hod', 'teacher'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Attendance Tracking', view: ['super_admin', 'school_admin', 'hod', 'teacher', 'parent'], create: ['super_admin', 'school_admin', 'teacher'], edit: ['super_admin', 'school_admin', 'teacher'], delete: ['super_admin', 'school_admin'] },
        { name: 'Student Welfare', view: ['super_admin', 'school_admin', 'dsl'], create: ['super_admin', 'school_admin', 'dsl'], edit: ['super_admin', 'school_admin', 'dsl'], delete: ['super_admin', 'school_admin'] },
        { name: 'Safeguarding', view: ['super_admin', 'dsl'], create: ['super_admin', 'dsl'], edit: ['super_admin', 'dsl'], delete: ['super_admin', 'dsl'] },
        { name: 'Behavior Tracking', view: ['super_admin', 'school_admin', 'hod', 'teacher', 'parent'], create: ['super_admin', 'school_admin', 'teacher'], edit: ['super_admin', 'school_admin', 'teacher'], delete: ['super_admin', 'school_admin'] },
        { name: 'Transport Management', view: ['super_admin', 'school_admin', 'parent', 'student'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Library Services', view: ['super_admin', 'school_admin', 'teacher', 'student'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Activities & Events', view: ['all'], create: ['super_admin', 'school_admin', 'teacher'], edit: ['super_admin', 'school_admin', 'teacher'], delete: ['super_admin', 'school_admin'] },
      ]
    },
    {
      category: 'Staff & HR',
      items: [
        { name: 'Staff Directory', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Employee Management', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Recruitment', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Performance & Training', view: ['super_admin', 'school_admin', 'hod'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Payroll & Benefits', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
      ]
    },
    {
      category: 'Finance & Operations',
      items: [
        { name: 'Fee Management', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
        { name: 'Accounting', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
        { name: 'Budget Planning', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
        { name: 'Vendor Management', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin', 'school_admin'] },
      ]
    },
    {
      category: 'Administration',
      items: [
        { name: 'User Management', view: ['super_admin'], create: ['super_admin'], edit: ['super_admin'], delete: ['super_admin'] },
        { name: 'Permission Management', view: ['super_admin'], create: ['super_admin'], edit: ['super_admin'], delete: ['super_admin'] },
        { name: 'School Settings', view: ['super_admin', 'school_admin'], create: ['super_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
        { name: 'Master Data', view: ['super_admin', 'school_admin'], create: ['super_admin', 'school_admin'], edit: ['super_admin', 'school_admin'], delete: ['super_admin'] },
        { name: 'Technical Docs', view: ['super_admin'], create: ['super_admin'], edit: ['super_admin'], delete: ['super_admin'] },
      ]
    }
  ];

  const hasPermission = (roleId: string, allowedRoles: string[]) => {
    return allowedRoles.includes('all') || allowedRoles.includes(roleId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Control Matrix
          </CardTitle>
          <CardDescription>
            Comprehensive role-based permissions for all modules and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Role Definitions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Badge variant={role.color as any}>{role.label}</Badge>
                  <span className="text-xs text-muted-foreground">({role.id})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 dark:text-amber-100">Security Implementation</p>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  Access control is enforced at multiple layers: Database RLS policies, Supabase Edge Functions, 
                  and Frontend route guards. Never rely solely on UI-level checks.
                </p>
              </div>
            </div>
          </div>

          <Accordion type="multiple" className="w-full">
            {modules.map((category, categoryIndex) => (
              <AccordionItem key={categoryIndex} value={`category-${categoryIndex}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  {category.category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Module</TableHead>
                          {roles.map((role) => (
                            <TableHead key={role.id} className="text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-normal">{role.label}</span>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.items.map((module, moduleIndex) => (
                          <React.Fragment key={moduleIndex}>
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={roles.length + 1} className="font-medium">
                                {module.name}
                              </TableCell>
                            </TableRow>
                            {['view', 'create', 'edit', 'delete'].map((action) => (
                              <TableRow key={`${moduleIndex}-${action}`}>
                                <TableCell className="text-xs pl-8">
                                  <Badge variant="outline" className="text-xs">
                                    {action.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                {roles.map((role) => (
                                  <TableCell key={role.id} className="text-center">
                                    {hasPermission(role.id, module[action as keyof typeof module] as string[]) ? (
                                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-500 mx-auto opacity-30" />
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Implementation Details</h3>
            
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">1. Database Level (RLS Policies)</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`-- Example RLS Policy for students table
CREATE POLICY "Teachers can view students in their school"
ON students FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.school_id = students.school_id
    AND user_roles.role IN ('teacher', 'school_admin', 'hod')
    AND user_roles.is_active = true
  ) OR is_super_admin(auth.uid())
);`}
              </pre>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">2. Hook Level (usePermissions)</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`// Check module permission in component
const { hasModulePermission } = usePermissions();

const canEdit = hasModulePermission('Students', 'edit');
const canDelete = hasModulePermission('Students', 'delete');

if (!canEdit) {
  return <div>No permission</div>;
}`}
              </pre>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">3. Route Level (ProtectedRoute)</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`// Protect routes in App.tsx
<Route path="/user-management" element={
  <ProtectedRoute requiredRole="super_admin">
    <UserManagementPage />
  </ProtectedRoute>
} />`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
