import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Zap } from 'lucide-react';

export function APIDocumentation() {
  const functions = [
    {
      name: 'create_complete_student_enrollment',
      description: 'Creates complete student enrollment with user accounts and role assignments',
      type: 'Edge Function',
      parameters: [
        { name: 'student_data', type: 'jsonb', required: true, description: 'Student information including name, DOB, year group' },
        { name: 'parent_data', type: 'jsonb', required: true, description: 'Parent/guardian information' },
        { name: 'school_id', type: 'uuid', required: true, description: 'Target school ID' },
        { name: 'application_id', type: 'uuid', required: true, description: 'Original application ID to update' },
        { name: 'created_by', type: 'uuid', required: false, description: 'User creating the enrollment (defaults to auth.uid())' }
      ],
      returns: { type: 'jsonb', description: 'Enrollment result including student_id, user_id, credentials, parent details' },
      example: `const { data, error } = await supabase.rpc('create_complete_student_enrollment', {
  student_data: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@student.school.com',
    date_of_birth: '2010-01-15',
    year_group: 'Year 7',
    form_class: '7A',
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '1234567890'
  },
  parent_data: {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@example.com',
    phone: '1234567890',
    relationship: 'Mother'
  },
  school_id: 'uuid-here',
  application_id: 'app-uuid-here'
});`
    },
    {
      name: 'is_super_admin',
      description: 'Checks if a user has super_admin role',
      type: 'Database Function',
      parameters: [
        { name: 'user_uuid', type: 'uuid', required: true, description: 'User ID to check' }
      ],
      returns: { type: 'boolean', description: 'True if user is super admin, false otherwise' },
      example: `-- SQL usage
SELECT is_super_admin(auth.uid());

-- In RLS policy
CREATE POLICY "Super admins have full access"
ON some_table FOR ALL
USING (is_super_admin(auth.uid()));

-- TypeScript usage
const { data: isSuperAdmin } = await supabase.rpc('is_super_admin', {
  user_uuid: userId
});`
    },
    {
      name: 'has_permission',
      description: 'Checks if user has specific permission for a resource in a school',
      type: 'Database Function',
      parameters: [
        { name: 'user_uuid', type: 'uuid', required: true, description: 'User to check' },
        { name: 'school_uuid', type: 'uuid', required: true, description: 'School context' },
        { name: 'resource', type: 'resource_type', required: true, description: 'Resource type enum' },
        { name: 'permission', type: 'permission_type', required: true, description: 'Permission type enum (view/create/edit/delete)' }
      ],
      returns: { type: 'boolean', description: 'True if user has permission' },
      example: `-- Check if user can edit students
SELECT has_permission(
  auth.uid(), 
  'school-uuid',
  'students'::resource_type,
  'edit'::permission_type
);

-- TypeScript
const { data: canEdit } = await supabase.rpc('has_permission', {
  user_uuid: user.id,
  school_uuid: schoolId,
  resource: 'students',
  permission: 'edit'
});`
    },
    {
      name: 'request_password_reset',
      description: 'Admin function to force password change for a user',
      type: 'Database Function',
      parameters: [
        { name: 'target_user_id', type: 'uuid', required: true, description: 'User who needs to reset password' }
      ],
      returns: { type: 'boolean', description: 'True if successful' },
      example: `-- Admin forces password reset
SELECT request_password_reset('target-user-uuid');

-- TypeScript
const { data, error } = await supabase.rpc('request_password_reset', {
  target_user_id: userId
});`
    },
    {
      name: 'generate_report_card_data',
      description: 'Generates comprehensive report card data for a student',
      type: 'Database Function',
      parameters: [
        { name: 'p_student_id', type: 'uuid', required: true, description: 'Student ID' },
        { name: 'p_academic_term', type: 'text', required: true, description: 'Term identifier (e.g., "Term 1 2025")' },
        { name: 'p_academic_year', type: 'text', required: true, description: 'Academic year (e.g., "2024-2025")' }
      ],
      returns: { type: 'jsonb', description: 'Report card data including grades, attendance, coverage statistics' },
      example: `const { data } = await supabase.rpc('generate_report_card_data', {
  p_student_id: studentId,
  p_academic_term: 'Term 1 2025',
  p_academic_year: '2024-2025'
});

// Returns:
// {
//   student_info: {...},
//   grades: [...],
//   attendance: {...},
//   generated_at: "2025-01-15T..."
// }`
    }
  ];

  const hooks = [
    {
      name: 'useAuth',
      file: 'src/hooks/useAuth.tsx',
      description: 'Authentication hook providing user state and auth methods',
      exports: {
        state: [
          { name: 'user', type: 'User | null', description: 'Current authenticated user' },
          { name: 'session', type: 'Session | null', description: 'Current session object' },
          { name: 'loading', type: 'boolean', description: 'Auth loading state' }
        ],
        methods: [
          { name: 'signIn(email, password)', returns: 'Promise<void>', description: 'Sign in user' },
          { name: 'signOut()', returns: 'Promise<void>', description: 'Sign out current user' },
          { name: 'signUp()', returns: 'void', description: 'Disabled - use admin user creation instead' }
        ]
      },
      usage: `import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome {user.email}</div>;
}`
    },
    {
      name: 'useRBAC',
      file: 'src/hooks/useRBAC.tsx',
      description: 'Role-based access control hook for checking user roles and permissions',
      exports: {
        state: [
          { name: 'userRoles', type: 'UserRole[]', description: 'All roles assigned to user' },
          { name: 'schools', type: 'School[]', description: 'Schools user has access to' },
          { name: 'currentSchool', type: 'School | null', description: 'Currently selected school' },
          { name: 'loading', type: 'boolean', description: 'Data loading state' }
        ],
        methods: [
          { name: 'hasRole(role, schoolId?)', returns: 'boolean', description: 'Check if user has specific role' },
          { name: 'isSuperAdmin()', returns: 'boolean', description: 'Check if user is super admin' },
          { name: 'isSchoolAdmin(schoolId?)', returns: 'boolean', description: 'Check if user is school admin' },
          { name: 'hasPermission(resource, permission, schoolId?)', returns: 'Promise<boolean>', description: 'Check specific permission' },
          { name: 'switchSchool(school)', returns: 'void', description: 'Change current school context' }
        ]
      },
      usage: `import { useRBAC } from '@/hooks/useRBAC';

function MyComponent() {
  const { hasRole, isSuperAdmin, currentSchool } = useRBAC();
  
  if (isSuperAdmin()) {
    return <div>Admin Panel</div>;
  }
  
  if (hasRole('teacher', currentSchool?.id)) {
    return <div>Teacher Dashboard</div>;
  }
  
  return <div>No access</div>;
}`
    },
    {
      name: 'usePermissions',
      file: 'src/hooks/usePermissions.tsx',
      description: 'Fine-grained permission checking for modules and fields',
      exports: {
        state: [
          { name: 'modules', type: 'Module[]', description: 'All available modules' },
          { name: 'rolePermissions', type: 'RoleModulePermission[]', description: 'Role-module permissions' },
          { name: 'fieldPermissions', type: 'FieldPermission[]', description: 'Field-level permissions' },
          { name: 'loading', type: 'boolean', description: 'Loading state' }
        ],
        methods: [
          { name: 'hasModulePermission(moduleName, action)', returns: 'boolean', description: 'Check CRUD permission for module' },
          { name: 'hasFieldPermission(moduleName, fieldName, type)', returns: 'boolean', description: 'Check field visibility/editability' },
          { name: 'getAccessibleModules()', returns: 'Module[]', description: 'Get modules user can view' },
          { name: 'updateRolePermission(roleId, moduleId, permissions)', returns: 'Promise<void>', description: 'Update role permissions' }
        ]
      },
      usage: `import { usePermissions } from '@/hooks/usePermissions';

function StudentList() {
  const { hasModulePermission } = usePermissions();
  
  const canCreate = hasModulePermission('Students', 'create');
  const canEdit = hasModulePermission('Students', 'edit');
  const canDelete = hasModulePermission('Students', 'delete');
  
  return (
    <div>
      {canCreate && <Button>Add Student</Button>}
      {/* ... */}
    </div>
  );
}`
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Documentation
          </CardTitle>
          <CardDescription>
            Database functions, edge functions, and React hooks API reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Functions
            </h3>
            <Accordion type="multiple" className="w-full">
              {functions.map((func, index) => (
                <AccordionItem key={index} value={`func-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-sm">{func.name}</code>
                      <Badge variant={func.type === 'Edge Function' ? 'default' : 'secondary'}>
                        {func.type}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{func.description}</p>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                        <div className="space-y-2">
                          {func.parameters.map((param, pIndex) => (
                            <div key={pIndex} className="flex gap-3 text-sm border-l-2 border-primary pl-3">
                              <code className="font-mono text-xs">{param.name}</code>
                              <Badge variant="outline" className="text-xs">{param.type}</Badge>
                              {param.required && <Badge variant="destructive" className="text-xs">required</Badge>}
                              <span className="text-muted-foreground flex-1">{param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Returns</h4>
                        <div className="flex gap-3 text-sm">
                          <Badge variant="outline">{func.returns.type}</Badge>
                          <span className="text-muted-foreground">{func.returns.description}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Example Usage</h4>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto">
                          {func.example}
                        </pre>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              React Hooks
            </h3>
            <Accordion type="multiple" className="w-full">
              {hooks.map((hook, index) => (
                <AccordionItem key={index} value={`hook-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-sm">{hook.name}</code>
                      <Badge variant="secondary" className="text-xs">{hook.file}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{hook.description}</p>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-3">State</h4>
                        <div className="space-y-2">
                          {hook.exports.state.map((state, sIndex) => (
                            <div key={sIndex} className="flex gap-3 text-sm border-l-2 border-blue-500 pl-3">
                              <code className="font-mono text-xs">{state.name}</code>
                              <Badge variant="outline" className="text-xs">{state.type}</Badge>
                              <span className="text-muted-foreground flex-1">{state.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-3">Methods</h4>
                        <div className="space-y-2">
                          {hook.exports.methods.map((method, mIndex) => (
                            <div key={mIndex} className="flex gap-3 text-sm border-l-2 border-green-500 pl-3">
                              <code className="font-mono text-xs">{method.name}</code>
                              <Badge variant="outline" className="text-xs">{method.returns}</Badge>
                              <span className="text-muted-foreground flex-1">{method.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Example Usage</h4>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto">
                          {hook.usage}
                        </pre>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
