import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Database, Key, Lock, Link as LinkIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DatabaseSchema() {
  const tables = [
    {
      category: 'Core System Tables',
      tables: [
        {
          name: 'profiles',
          description: 'User profile information linked to auth.users',
          columns: [
            { name: 'user_id', type: 'uuid', isPrimary: true, isForeign: true, reference: 'auth.users(id)', description: 'Links to Supabase Auth user' },
            { name: 'email', type: 'text', isRequired: true, description: 'User email address' },
            { name: 'first_name', type: 'text', isRequired: true, description: 'User first name' },
            { name: 'last_name', type: 'text', isRequired: true, description: 'User last name' },
            { name: 'phone', type: 'text', description: 'Contact phone number' },
            { name: 'must_change_password', type: 'boolean', default: 'false', description: 'Forces password change on next login' },
            { name: 'created_at', type: 'timestamptz', default: 'now()', description: 'Record creation timestamp' }
          ],
          rlsPolicies: ['Users can view all profiles', 'Users can update own profile', 'Super admins have full access']
        },
        {
          name: 'user_roles',
          description: 'Role assignments for users with school association',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()', description: 'Unique identifier' },
            { name: 'user_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'auth.users(id)', description: 'User being assigned role' },
            { name: 'school_id', type: 'uuid', isForeign: true, reference: 'schools(id)', description: 'School association (null for super_admin)' },
            { name: 'role', type: 'app_role', isRequired: true, description: 'Enum: super_admin, school_admin, teacher, hod, student, parent, dsl' },
            { name: 'is_active', type: 'boolean', default: 'true', description: 'Whether role is currently active' },
            { name: 'department', type: 'text', description: 'Department for HOD/teacher roles' },
            { name: 'year_group', type: 'text', description: 'Year group for teachers' },
            { name: 'assigned_by', type: 'uuid', isForeign: true, reference: 'auth.users(id)', description: 'Who assigned this role' },
            { name: 'created_at', type: 'timestamptz', default: 'now()' }
          ],
          rlsPolicies: ['Only super admins can manage roles', 'Users can view own roles', 'School admins can view school roles']
        },
        {
          name: 'schools',
          description: 'School/institution master data',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'name', type: 'text', isRequired: true, description: 'School name' },
            { name: 'code', type: 'text', isRequired: true, isUnique: true, description: 'Unique school code' },
            { name: 'address', type: 'text', description: 'Physical address' },
            { name: 'contact_phone', type: 'text' },
            { name: 'contact_email', type: 'text' },
            { name: 'website', type: 'text' },
            { name: 'is_active', type: 'boolean', default: 'true' },
            { name: 'created_at', type: 'timestamptz', default: 'now()' }
          ],
          rlsPolicies: ['All authenticated users can view schools', 'Only super admins can modify schools']
        }
      ]
    },
    {
      category: 'Student Management',
      tables: [
        {
          name: 'students',
          description: 'Student demographic and enrollment information',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'user_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'auth.users(id)' },
            { name: 'school_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'schools(id)' },
            { name: 'student_number', type: 'text', isRequired: true, description: 'Unique student ID' },
            { name: 'year_group', type: 'text', isRequired: true },
            { name: 'form_class', type: 'text', isRequired: true },
            { name: 'date_of_birth', type: 'date', isRequired: true },
            { name: 'admission_date', type: 'date', default: 'CURRENT_DATE' },
            { name: 'emergency_contact_name', type: 'text' },
            { name: 'emergency_contact_phone', type: 'text' },
            { name: 'medical_notes', type: 'text' },
            { name: 'status', type: 'text', default: 'active', description: 'active, graduated, withdrawn' }
          ],
          rlsPolicies: ['Teachers and admins can view students in their school', 'Students can view own record', 'Parents can view children']
        },
        {
          name: 'enrollment_applications',
          description: 'Student admission applications',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'application_number', type: 'text', isUnique: true, description: 'Auto-generated application ID' },
            { name: 'school_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'schools(id)' },
            { name: 'student_first_name', type: 'text', isRequired: true },
            { name: 'student_last_name', type: 'text', isRequired: true },
            { name: 'date_of_birth', type: 'date', isRequired: true },
            { name: 'year_group_applying', type: 'text', isRequired: true },
            { name: 'parent_name', type: 'text' },
            { name: 'parent_email', type: 'text' },
            { name: 'parent_phone', type: 'text' },
            { name: 'status', type: 'text', default: 'pending', description: 'pending, approved, rejected, enrolled' },
            { name: 'additional_data', type: 'jsonb', description: 'Flexible data storage' },
            { name: 'created_at', type: 'timestamptz', default: 'now()' }
          ],
          rlsPolicies: ['School admins can view applications for their school', 'Super admins see all']
        },
        {
          name: 'student_parents',
          description: 'Links students to parent accounts',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'student_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'students(id)' },
            { name: 'parent_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'auth.users(id)' },
            { name: 'relationship', type: 'text', default: 'Parent', description: 'Mother, Father, Guardian, etc.' }
          ],
          rlsPolicies: ['Parents can view own student links', 'Teachers/admins can view student-parent links']
        }
      ]
    },
    {
      category: 'Academic Management',
      tables: [
        {
          name: 'assignments',
          description: 'Student assignments and homework',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'teacher_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'auth.users(id)' },
            { name: 'school_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'schools(id)' },
            { name: 'title', type: 'text', isRequired: true },
            { name: 'description', type: 'text' },
            { name: 'subject', type: 'text' },
            { name: 'due_date', type: 'date', isRequired: true },
            { name: 'total_points', type: 'integer', default: '100' },
            { name: 'status', type: 'text', default: 'draft', description: 'draft, published, closed' },
            { name: 'created_at', type: 'timestamptz', default: 'now()' }
          ],
          rlsPolicies: ['Teachers can manage own assignments', 'Students can view published assignments']
        },
        {
          name: 'assignment_submissions',
          description: 'Student work submissions',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'assignment_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'assignments(id)' },
            { name: 'student_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'students(id)' },
            { name: 'submission_text', type: 'text' },
            { name: 'attachment_url', type: 'text', description: 'Link to uploaded file' },
            { name: 'submitted_at', type: 'timestamptz', default: 'now()' },
            { name: 'grade', type: 'numeric' },
            { name: 'feedback', type: 'text' },
            { name: 'status', type: 'text', default: 'submitted', description: 'submitted, graded, returned' }
          ],
          rlsPolicies: ['Students can submit and view own submissions', 'Teachers can view/grade submissions for their assignments']
        },
        {
          name: 'gradebook_records',
          description: 'Student grades and assessments',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'student_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'students(id)' },
            { name: 'subject_id', type: 'text', isRequired: true },
            { name: 'grade_text', type: 'text', description: 'Letter grade (A, B, C, etc.)' },
            { name: 'grade_numeric', type: 'numeric', description: 'Numeric score' },
            { name: 'assessment_type', type: 'text', description: 'Test, Quiz, Assignment, etc.' },
            { name: 'academic_period', type: 'text', description: 'Term/Semester' },
            { name: 'date_recorded', type: 'date', default: 'CURRENT_DATE' },
            { name: 'teacher_id', type: 'uuid', isForeign: true, reference: 'auth.users(id)' },
            { name: 'comments', type: 'text' }
          ],
          rlsPolicies: ['Students and parents can view own grades', 'Teachers can view/edit grades for their subjects']
        },
        {
          name: 'attendance_records',
          description: 'Daily student attendance tracking',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'student_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'students(id)' },
            { name: 'date', type: 'date', isRequired: true, default: 'CURRENT_DATE' },
            { name: 'status', type: 'text', isRequired: true, description: 'present, absent, late, excused' },
            { name: 'notes', type: 'text' },
            { name: 'recorded_by', type: 'uuid', isForeign: true, reference: 'auth.users(id)' },
            { name: 'created_at', type: 'timestamptz', default: 'now()' }
          ],
          rlsPolicies: ['Teachers can record attendance for their classes', 'Students and parents can view own attendance']
        }
      ]
    },
    {
      category: 'Permissions & Access Control',
      tables: [
        {
          name: 'role_module_permissions',
          description: 'Module-level CRUD permissions for each role',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'role', type: 'app_role', isRequired: true },
            { name: 'module_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'modules(id)' },
            { name: 'can_view', type: 'boolean', default: 'false' },
            { name: 'can_create', type: 'boolean', default: 'false' },
            { name: 'can_edit', type: 'boolean', default: 'false' },
            { name: 'can_delete', type: 'boolean', default: 'false' },
            { name: 'can_approve', type: 'boolean', default: 'false' }
          ],
          rlsPolicies: ['Only super admins can modify permissions', 'All users can view permissions']
        },
        {
          name: 'field_permissions',
          description: 'Field-level visibility and editability',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'role', type: 'app_role', isRequired: true },
            { name: 'module_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'modules(id)' },
            { name: 'field_name', type: 'text', isRequired: true },
            { name: 'is_visible', type: 'boolean', default: 'true' },
            { name: 'is_editable', type: 'boolean', default: 'false' },
            { name: 'is_required', type: 'boolean', default: 'false' }
          ],
          rlsPolicies: ['Super admins manage field permissions', 'Users can query own field permissions']
        },
        {
          name: 'school_modules',
          description: 'School-specific module enablement',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
            { name: 'school_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'schools(id)' },
            { name: 'module_id', type: 'uuid', isRequired: true, isForeign: true, reference: 'modules(id)' },
            { name: 'is_enabled', type: 'boolean', default: 'true' },
            { name: 'custom_workflow', type: 'jsonb', description: 'School-specific workflow config' },
            { name: 'settings', type: 'jsonb', description: 'Module settings' }
          ],
          rlsPolicies: ['Super admins manage school modules', 'School admins can view own school modules']
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Schema Documentation
          </CardTitle>
          <CardDescription>
            Complete PostgreSQL database schema with tables, columns, relationships, and RLS policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Features
            </h3>
            <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100">
              <li>• All tables have Row Level Security (RLS) enabled</li>
              <li>• Policies use SECURITY DEFINER functions to prevent recursive checks</li>
              <li>• Foreign key constraints ensure referential integrity</li>
              <li>• Enum types provide type safety for roles and statuses</li>
              <li>• Timestamps track record creation and updates</li>
            </ul>
          </div>

          <Accordion type="multiple" className="w-full">
            {tables.map((category, catIndex) => (
              <AccordionItem key={catIndex} value={`category-${catIndex}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-primary" />
                    {category.category}
                    <Badge variant="secondary">{category.tables.length} tables</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {category.tables.map((table, tableIndex) => (
                      <Card key={tableIndex} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <CardTitle className="text-base font-mono flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            {table.name}
                          </CardTitle>
                          <CardDescription>{table.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-3">Columns</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Column</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Constraints</TableHead>
                                  <TableHead>Description</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {table.columns.map((col, colIndex) => (
                                  <TableRow key={colIndex}>
                                    <TableCell className="font-mono text-xs">
                                      {col.name}
                                      {col.isPrimary && <Key className="w-3 h-3 inline ml-1 text-amber-600" />}
                                      {col.isForeign && <LinkIcon className="w-3 h-3 inline ml-1 text-blue-600" />}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      <Badge variant="outline">{col.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs space-x-1">
                                      {col.isRequired && <Badge variant="destructive" className="text-xs">NOT NULL</Badge>}
                                      {col.isUnique && <Badge variant="secondary" className="text-xs">UNIQUE</Badge>}
                                      {col.default && <Badge variant="outline" className="text-xs">DEFAULT</Badge>}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      {col.description}
                                      {col.reference && (
                                        <div className="text-xs mt-1">
                                          <Badge variant="outline" className="text-xs">FK → {col.reference}</Badge>
                                        </div>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              RLS Policies
                            </h4>
                            <ul className="space-y-1">
                              {table.rlsPolicies.map((policy, pIndex) => (
                                <li key={pIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  {policy}
                                </li>
                              ))}
                            </ul>
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
