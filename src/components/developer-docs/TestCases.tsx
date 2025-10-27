import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Code } from 'lucide-react';

export function TestCases() {
  const testSuites = [
    {
      module: 'Authentication & Authorization',
      priority: 'Critical',
      tests: [
        {
          id: 'AUTH-001',
          title: 'User Login with Valid Credentials',
          type: 'Functional',
          steps: [
            'Navigate to login page',
            'Enter valid email and password',
            'Click "Sign In" button',
            'Verify redirect to dashboard'
          ],
          expected: 'User successfully logged in and redirected to dashboard',
          testData: { email: 'teacher@school.com', password: 'ValidPass123!' },
          sqlScript: `SELECT * FROM profiles WHERE email = 'teacher@school.com';`
        },
        {
          id: 'AUTH-002',
          title: 'Password Change on First Login',
          type: 'Functional',
          steps: [
            'Login with new user credentials (must_change_password = true)',
            'Verify forced redirect to password change page',
            'Enter current password',
            'Enter new password (twice)',
            'Submit password change',
            'Verify must_change_password flag cleared',
            'Verify redirect to dashboard'
          ],
          expected: 'User forced to change password, flag cleared after success',
          testData: { email: 'newuser@school.com', oldPass: 'TempPass123!', newPass: 'MyNewPass123!' },
          sqlScript: `-- Check password change flag
SELECT must_change_password FROM profiles WHERE user_id = auth.uid();

-- Reset flag for testing
UPDATE profiles SET must_change_password = true WHERE email = 'newuser@school.com';`
        },
        {
          id: 'AUTH-003',
          title: 'Super Admin Access Control',
          type: 'Security',
          steps: [
            'Login as super_admin',
            'Attempt to access User Management',
            'Verify access granted',
            'Logout',
            'Login as regular teacher',
            'Attempt to access User Management',
            'Verify access denied'
          ],
          expected: 'Only super_admin can access admin modules',
          testData: { superAdmin: 'admin@system.com', teacher: 'teacher@school.com' },
          sqlScript: `-- Verify super admin status
SELECT is_super_admin(auth.uid());

-- Check role assignments
SELECT role, school_id, is_active FROM user_roles WHERE user_id = auth.uid();`
        },
        {
          id: 'AUTH-004',
          title: 'Multi-School Access Control',
          type: 'Security',
          steps: [
            'Login as teacher assigned to School A',
            'View students list',
            'Verify only School A students visible',
            'Attempt to query School B students directly',
            'Verify RLS blocks access'
          ],
          expected: 'Users can only access data from their assigned school',
          sqlScript: `-- Check school association
SELECT school_id FROM user_roles WHERE user_id = auth.uid() AND is_active = true;

-- Test RLS policy
SELECT * FROM students WHERE school_id != (
  SELECT school_id FROM user_roles WHERE user_id = auth.uid() LIMIT 1
); -- Should return empty or error`
        }
      ]
    },
    {
      module: 'Student Admissions Workflow',
      priority: 'High',
      tests: [
        {
          id: 'ADM-001',
          title: 'Complete Admission Flow',
          type: 'Integration',
          steps: [
            'Create new admission application',
            'Fill all required fields',
            'Upload documents',
            'Submit application',
            'Admin reviews and approves',
            'Process enrollment',
            'Generate student credentials',
            'Verify student record created',
            'Verify role assigned',
            'Verify parent account linked'
          ],
          expected: 'Complete admission from application to enrollment with all records created',
          testData: {
            student: { firstName: 'John', lastName: 'Doe', dob: '2010-01-15', yearGroup: 'Year 7' },
            parent: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '1234567890' }
          },
          sqlScript: `-- Create test application
INSERT INTO enrollment_applications (
  school_id, student_first_name, student_last_name, 
  date_of_birth, year_group_applying, status
) VALUES (
  (SELECT id FROM schools WHERE code = 'TEST001'),
  'John', 'Doe', '2010-01-15', 'Year 7', 'pending'
) RETURNING id;

-- Check enrollment process
SELECT * FROM students WHERE student_number LIKE 'STU%' ORDER BY created_at DESC LIMIT 1;

-- Verify parent link
SELECT sp.*, p.email 
FROM student_parents sp 
JOIN profiles p ON p.user_id = sp.parent_id 
WHERE sp.student_id = '[student_id]';`
        },
        {
          id: 'ADM-002',
          title: 'Duplicate Student Number Prevention',
          type: 'Data Integrity',
          steps: [
            'Create first student with auto-generated number',
            'Note the student number',
            'Attempt to create second student with same number',
            'Verify unique constraint violation',
            'Verify auto-increment works correctly'
          ],
          expected: 'Student numbers must be unique per school',
          sqlScript: `-- Check unique constraint
SELECT COUNT(*), student_number 
FROM students 
WHERE school_id = '[school_id]'
GROUP BY student_number 
HAVING COUNT(*) > 1;

-- Should return empty result`
        }
      ]
    },
    {
      module: 'Assignment & Grading',
      priority: 'High',
      tests: [
        {
          id: 'ASSGN-001',
          title: 'Assignment Creation and Publishing',
          type: 'Functional',
          steps: [
            'Login as teacher',
            'Navigate to Assignments',
            'Click Create Assignment',
            'Fill assignment details',
            'Set due date',
            'Save as draft',
            'Verify status = draft',
            'Publish assignment',
            'Verify status = published',
            'Verify students can see it'
          ],
          expected: 'Assignment created, saved as draft, then published successfully',
          testData: {
            title: 'Math Homework 1',
            description: 'Complete exercises 1-10',
            subject: 'Mathematics',
            dueDate: '2025-11-15',
            totalPoints: 100
          },
          sqlScript: `-- Create assignment
INSERT INTO assignments (
  teacher_id, school_id, title, description, 
  subject, due_date, status
) VALUES (
  auth.uid(),
  (SELECT school_id FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
  'Math Homework 1', 'Complete exercises 1-10',
  'Mathematics', '2025-11-15', 'draft'
) RETURNING id;

-- Publish assignment
UPDATE assignments SET status = 'published' WHERE id = '[assignment_id]';

-- Verify student can see
SELECT a.* FROM assignments a
JOIN students s ON s.school_id = a.school_id
WHERE a.status = 'published' AND s.user_id = auth.uid();`
        },
        {
          id: 'ASSGN-002',
          title: 'Student Submission Process',
          type: 'Functional',
          steps: [
            'Login as student',
            'View published assignment',
            'Click Submit',
            'Upload file',
            'Add submission notes',
            'Submit',
            'Verify submission recorded',
            'Verify teacher can see submission'
          ],
          expected: 'Student submission saved and visible to teacher',
          testData: {
            assignmentId: 'uuid',
            submissionText: 'Here is my work',
            attachmentUrl: 'submissions/student_work.pdf'
          },
          sqlScript: `-- Student submits
INSERT INTO assignment_submissions (
  assignment_id, student_id, submission_text, 
  attachment_url, status
) VALUES (
  '[assignment_id]',
  (SELECT id FROM students WHERE user_id = auth.uid()),
  'Here is my work',
  'submissions/student_work.pdf',
  'submitted'
) RETURNING id;

-- Teacher views submissions
SELECT s.*, p.first_name, p.last_name
FROM assignment_submissions s
JOIN students st ON st.id = s.student_id
JOIN profiles p ON p.user_id = st.user_id
WHERE s.assignment_id = '[assignment_id]';`
        },
        {
          id: 'ASSGN-003',
          title: 'Grading and Feedback',
          type: 'Functional',
          steps: [
            'Login as teacher',
            'Navigate to grading interface',
            'Select submitted assignment',
            'Enter grade (85/100)',
            'Add feedback comments',
            'Mark as returned',
            'Verify grade saved to gradebook',
            'Verify student can see grade'
          ],
          expected: 'Grade and feedback saved, visible to student and in gradebook',
          testData: {
            grade: 85,
            feedback: 'Good work! Watch your calculation in problem 5.'
          },
          sqlScript: `-- Grade submission
UPDATE assignment_submissions
SET grade = 85, 
    feedback = 'Good work! Watch your calculation in problem 5.',
    status = 'returned'
WHERE id = '[submission_id]';

-- Add to gradebook
INSERT INTO gradebook_records (
  student_id, subject_id, grade_numeric, 
  assessment_type, teacher_id, comments
) VALUES (
  '[student_id]', 'Mathematics', 85,
  'Assignment', auth.uid(), 'Good work!'
);

-- Student views grade
SELECT * FROM gradebook_records WHERE student_id = (
  SELECT id FROM students WHERE user_id = auth.uid()
);`
        }
      ]
    },
    {
      module: 'Permissions & RBAC',
      priority: 'Critical',
      tests: [
        {
          id: 'PERM-001',
          title: 'Module Permission Enforcement',
          type: 'Security',
          steps: [
            'Set teacher role to have view-only on Students module',
            'Login as teacher',
            'Navigate to Students page',
            'Verify students list visible',
            'Attempt to create new student',
            'Verify create button disabled/hidden',
            'Attempt direct API call to create student',
            'Verify permission denied'
          ],
          expected: 'Permissions enforced at UI and API levels',
          sqlScript: `-- Set module permission
UPDATE role_module_permissions
SET can_view = true, can_create = false, can_edit = false
WHERE role = 'teacher' 
  AND module_id = (SELECT id FROM modules WHERE name = 'Students');

-- Check permission
SELECT can_view, can_create, can_edit, can_delete
FROM role_module_permissions
WHERE role = (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1)
  AND module_id = (SELECT id FROM modules WHERE name = 'Students');`
        },
        {
          id: 'PERM-002',
          title: 'Field-Level Permission',
          type: 'Security',
          steps: [
            'Set salary field to hidden for teacher role',
            'Login as teacher',
            'View employee details',
            'Verify salary field not visible',
            'Login as admin',
            'View same employee',
            'Verify salary field visible'
          ],
          expected: 'Field visibility controlled by role',
          sqlScript: `-- Set field permission
UPDATE field_permissions
SET is_visible = false
WHERE role = 'teacher'
  AND module_id = (SELECT id FROM modules WHERE name = 'HR Management')
  AND field_name = 'salary';

-- Check field permission
SELECT is_visible, is_editable
FROM field_permissions
WHERE role = (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1)
  AND field_name = 'salary';`
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Test Cases & Testing Scripts
          </CardTitle>
          <CardDescription>
            Comprehensive test cases with SQL scripts for validation and regression testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-semibold mb-2">Testing Guidelines</h3>
            <ul className="text-sm space-y-1 text-green-900 dark:text-green-100">
              <li>• Run SQL scripts in Supabase SQL Editor for data setup/validation</li>
              <li>• Test with multiple roles to verify RBAC enforcement</li>
              <li>• Check browser console for errors during manual testing</li>
              <li>• Verify RLS policies block unauthorized access</li>
              <li>• Test edge cases and error handling</li>
            </ul>
          </div>

          <Accordion type="multiple" className="w-full">
            {testSuites.map((suite, suiteIndex) => (
              <AccordionItem key={suiteIndex} value={`suite-${suiteIndex}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {suite.module}
                    <Badge variant={suite.priority === 'Critical' ? 'destructive' : 'secondary'}>
                      {suite.priority}
                    </Badge>
                    <Badge variant="outline">{suite.tests.length} tests</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {suite.tests.map((test, testIndex) => (
                      <Card key={testIndex} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">
                                {test.id}: {test.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                <Badge variant="outline">{test.type}</Badge>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Test Steps
                            </h4>
                            <ol className="space-y-1">
                              {test.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-sm text-muted-foreground flex gap-2">
                                  <span className="font-medium text-foreground">{stepIndex + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="border-t pt-3">
                            <h4 className="text-sm font-semibold mb-2">Expected Result</h4>
                            <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 p-2 rounded">
                              {test.expected}
                            </p>
                          </div>

                          {test.testData && (
                            <div className="border-t pt-3">
                              <h4 className="text-sm font-semibold mb-2">Test Data</h4>
                              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                {JSON.stringify(test.testData, null, 2)}
                              </pre>
                            </div>
                          )}

                          <div className="border-t pt-3">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              SQL Test Script
                            </h4>
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto">
                              {test.sqlScript}
                            </pre>
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
