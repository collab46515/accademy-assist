import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';

export function UserFlows() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyMermaid = (code: string, index: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const flowcharts = [
    {
      id: 'admission-detailed',
      title: 'Detailed Admissions Process (8 Stages)',
      mermaid: `graph TD
    Start([Student Applies]) --> Stage1[Stage 1: Application Submitted]
    
    Stage1 --> V1{Initial Validation}
    V1 -->|Complete Forms| Stage2[Stage 2: Document Verification]
    V1 -->|Incomplete| Reject1[Request Additional Info]
    Reject1 --> Stage1
    
    Stage2 --> D1{Required Documents}
    D1 -->|All Verified| Stage3[Stage 3: Assessment & Interview]
    D1 -->|Missing/Invalid| Reject2[Request Documents]
    Reject2 --> Stage2
    
    Stage3 --> A1[Academic Assessment]
    Stage3 --> A2[Behavioral Assessment]
    Stage3 --> A3[Interview]
    
    A1 --> Score1[Academic Score]
    A2 --> Score2[Behavior Score]
    A3 --> Score3[Interview Score]
    
    Score1 --> Stage4[Stage 4: Application Review]
    Score2 --> Stage4
    Score3 --> Stage4
    
    Stage4 --> R1{Committee Review}
    R1 -->|Scores Compiled| Stage5[Stage 5: Admission Decision]
    R1 -->|Need More Info| Stage3
    
    Stage5 --> Decision{Final Decision}
    Decision -->|Accept| Stage6[Stage 6: Fee Payment]
    Decision -->|Conditional Accept| Conditions[Set Conditions]
    Decision -->|Waitlist| Waitlist[Add to Waitlist]
    Decision -->|Reject| End1([Application Rejected])
    
    Conditions --> Stage6
    Waitlist --> MonitorWaitlist{Space Available?}
    MonitorWaitlist -->|Yes| Stage6
    MonitorWaitlist -->|No| End1
    
    Stage6 --> Payment{Payment Status}
    Payment -->|Payment Received| Stage7[Stage 7: Enrollment Confirmation]
    Payment -->|Payment Pending| Reminder[Send Payment Reminder]
    Reminder --> Payment
    Payment -->|Payment Failed/Expired| End2([Offer Withdrawn])
    
    Stage7 --> Assign[Assign Student ID, Class, House]
    Assign --> Stage8[Stage 8: Welcome & Onboarding]
    
    Stage8 --> Onboard1[Send Welcome Pack]
    Stage8 --> Onboard2[Schedule Orientation]
    Stage8 --> Onboard3[Order Uniform]
    
    Onboard1 --> Complete{All Complete?}
    Onboard2 --> Complete
    Onboard3 --> Complete
    
    Complete -->|Yes| End3([Fully Enrolled Student])
    Complete -->|No| Pending[Pending Items]
    Pending --> Stage8
    
    style Stage1 fill:#3b82f6,color:#fff
    style Stage2 fill:#8b5cf6,color:#fff
    style Stage3 fill:#f59e0b,color:#fff
    style Stage4 fill:#ef4444,color:#fff
    style Stage5 fill:#06b6d4,color:#fff
    style Stage6 fill:#10b981,color:#fff
    style Stage7 fill:#84cc16,color:#fff
    style Stage8 fill:#f97316,color:#fff
    style End3 fill:#22c55e,color:#fff
    style End1 fill:#dc2626,color:#fff
    style End2 fill:#dc2626,color:#fff`
    },
    {
      id: 'admission',
      title: 'Student Admission Flow',
      mermaid: `graph TD
    A[Parent/Guardian Visits Portal] --> B[Fill Application Form]
    B --> C[Upload Required Documents]
    C --> D[Submit Application]
    D --> E[Application Saved to DB]
    E --> F[Admissions Officer Notified]
    
    F --> G[Officer Reviews Application]
    G --> H{Documents Complete?}
    H -->|No| I[Request Additional Documents]
    I --> C
    H -->|Yes| J{Information Valid?}
    J -->|No| K[Reject Application]
    J -->|Yes| L[Approve Application]
    
    L --> M[Officer Processes Enrollment]
    M --> N[Enter Student Details]
    N --> O[Generate Student Credentials]
    O --> P[Create Parent Account]
    P --> Q[Assign Student Number]
    Q --> R[Call create_complete_student_enrollment]
    
    R --> S[Records Created in DB]
    S --> T[Generate Temporary Passwords]
    T --> U[Display Credentials to Officer]
    U --> V[Mark Application as Enrolled]
    
    V --> W[Student/Parent Receives Credentials]
    W --> X[First Login Attempt]
    X --> Y{Must Change Password?}
    Y -->|Yes| Z[Force Password Change Screen]
    Z --> AA[Set New Secure Password]
    AA --> AB[Clear Password Change Flag]
    AB --> AC[Access Portal]
    Y -->|No| AC
    
    K --> AD[Notify Parent of Rejection]
    AC --> AE[Complete]`
    },
    {
      id: 'assignment',
      title: 'Assignment Workflow',
      mermaid: `graph TD
    A[Teacher Logs In] --> B[Navigate to Assignments]
    B --> C[Click Create Assignment]
    C --> D[Fill Assignment Details]
    D --> E{Add Resources?}
    E -->|Yes| F[Attach Files/Links]
    E -->|No| G[Select Target Class]
    F --> G
    G --> H[Set Due Date]
    H --> I[Publish Assignment]
    I --> J[Save to assignments Table]
    
    J --> K[Students See Assignment]
    K --> L[Student Logs In]
    L --> M[Navigate to My Assignments]
    M --> N{Assignments Available?}
    N -->|No| O[Show Empty State]
    N -->|Yes| P[View Assignment List]
    
    P --> Q[Click Assignment]
    Q --> R[View Details & Resources]
    R --> S{Download Resources?}
    S -->|Yes| T[Download Files]
    T --> U[Click Submit Button]
    S -->|No| U
    
    U --> V[Upload Assignment File]
    V --> W[Add Submission Notes]
    W --> X[Submit Assignment]
    X --> Y[Save to assignment_submissions]
    Y --> Z[Upload File to Storage Bucket]
    Z --> AA[Show Confirmation]
    
    AA --> AB[Teacher Views Pending Submissions]
    AB --> AC[Navigate to Grading]
    AC --> AD[Select Assignment]
    AD --> AE[Review Student Work]
    AE --> AF[Download Submission]
    AF --> AG[Enter Grade]
    AG --> AH[Add Feedback Comments]
    AH --> AI[Mark as Returned]
    
    AI --> AJ[Update assignment_submissions]
    AJ --> AK[Create gradebook_records Entry]
    AK --> AL[Student Notified]
    AL --> AM[Grade Visible to Parents]
    AM --> AN[Complete]`
    },
    {
      id: 'attendance',
      title: 'Attendance Recording Flow',
      mermaid: `graph TD
    A[Teacher Logs In] --> B[Navigate to Attendance]
    B --> C[Select Class from Dropdown]
    C --> D[Select Date]
    D --> E[System Loads Student List]
    E --> F[Query students by class_id]
    F --> G[Create Attendance Session]
    
    G --> H[Display Student List]
    H --> I[Teacher Reviews List]
    I --> J{Mark Next Student}
    J --> K[Select Status: Present/Absent/Late]
    K --> L{Status is Absent/Late?}
    L -->|Yes| M[Add Notes/Reason]
    L -->|No| N{More Students?}
    M --> N
    
    N -->|Yes| J
    N -->|No| O[Review All Entries]
    O --> P[Click Save Attendance]
    P --> Q[Bulk Insert to attendance_records]
    
    Q --> R{Any Absences?}
    R -->|Yes| S[Identify Absent Students]
    S --> T[Send Parent Notifications]
    T --> U[Log Notification Delivery]
    U --> V[Mark Attendance Complete]
    R -->|No| V
    
    V --> W[Admin Views Reports]
    W --> X[Navigate to Analytics]
    X --> Y[Select Attendance Report]
    Y --> Z[Aggregate attendance_records]
    Z --> AA[Calculate Attendance %]
    AA --> AB[Identify Chronic Absentees]
    AB --> AC{Export Needed?}
    AC -->|Yes| AD[Export to Excel/PDF]
    AC -->|No| AE[View Dashboard]
    AD --> AE
    AE --> AF[Complete]`
    },
    {
      id: 'user-role',
      title: 'User & Role Management Flow',
      mermaid: `graph TD
    A[Super Admin Logs In] --> B[Navigate to User Management]
    B --> C[Click Add User]
    C --> D[Enter User Details]
    D --> E[Enter Name & Email]
    E --> F[Select School Association]
    F --> G[Assign Initial Role]
    G --> H[Generate Temporary Password]
    H --> I[Save to profiles Table]
    I --> J[Create user_roles Entry]
    
    J --> K{Assign Additional Roles?}
    K -->|Yes| L[Select Additional Role]
    L --> M[Choose School for Role]
    M --> N{Department/Year Group?}
    N -->|Yes| O[Set Department/Year]
    N -->|No| P[Activate Role]
    O --> P
    P --> Q[Insert into user_roles]
    Q --> K
    
    K -->|No| R[Navigate to Permission Management]
    R --> S[Select Role Type]
    S --> T[Choose Module]
    T --> U{Set Module Permissions}
    U --> V[Configure View Permission]
    V --> W[Configure Create Permission]
    W --> X[Configure Edit Permission]
    X --> Y[Configure Delete Permission]
    Y --> Z[Update role_module_permissions]
    
    Z --> AA{Field-Level Access?}
    AA -->|Yes| AB[Select Sensitive Fields]
    AB --> AC[Set Access Level]
    AC --> AD[Update field_permissions]
    AD --> AE{More Modules?}
    AA -->|No| AE
    
    AE -->|Yes| T
    AE -->|No| AF[Send Credentials to User]
    AF --> AG[User Attempts Login]
    AG --> AH[System Validates Credentials]
    AH --> AI[Load User Roles]
    AI --> AJ[Query user_roles Table]
    AJ --> AK[Check RLS Policies]
    
    AK --> AL{Access Module?}
    AL --> AM[User Clicks Module]
    AM --> AN[System Checks Permissions]
    AN --> AO[Query role_module_permissions]
    AO --> AP{Permission Granted?}
    AP -->|Yes| AQ[Load Module]
    AP -->|No| AR[Show Access Denied]
    AQ --> AS[Apply Field-Level Restrictions]
    AS --> AT[Render UI]
    AR --> AU[Log Access Attempt]
    AT --> AV[Complete]
    AU --> AV`
    }
  ];

  const flows = [
    {
      category: 'Detailed Admissions Process (8 Stages)',
      steps: [
        {
          step: 1,
          title: 'Application Submitted',
          actor: 'Parent/Guardian & System',
          actions: ['Parent submits application form', 'System performs initial validation', 'Required documents checked', 'Application saved to database'],
          technicalDetails: 'Creates record in enrollment_applications table, validates required fields, uploads documents to storage',
          files: ['src/components/admissions/stages/ApplicationSubmittedStage.tsx']
        },
        {
          step: 2,
          title: 'Document Verification',
          actor: 'Admissions Officer',
          actions: ['Review all required documents', 'Verify authenticity', 'Request missing documents if needed', 'Mark documents as verified/rejected'],
          technicalDetails: 'Updates document status in enrollment_applications, manages document storage bucket with RLS policies',
          files: ['src/components/admissions/stages/DocumentVerificationStage.tsx']
        },
        {
          step: 3,
          title: 'Assessment & Interview',
          actor: 'Academic Staff & Admissions Team',
          actions: ['Schedule academic assessments', 'Conduct behavioral assessments', 'Perform student interview', 'Score all assessment components'],
          technicalDetails: 'Stores assessment results, interview notes, and scores in application metadata JSONB field',
          files: ['src/components/admissions/stages/AssessmentInterviewStage.tsx']
        },
        {
          step: 4,
          title: 'Application Review',
          actor: 'Admissions Committee',
          actions: ['Review all assessment scores', 'Examine academic history', 'Review references', 'Compile comprehensive evaluation', 'Add review notes'],
          technicalDetails: 'Aggregates data from multiple sources, committee members add reviews to application record',
          files: ['src/components/admissions/stages/ApplicationReviewStage.tsx']
        },
        {
          step: 5,
          title: 'Admission Decision',
          actor: 'Head of Admissions',
          actions: ['Review committee recommendations', 'Make final decision (Accept/Conditional/Waitlist/Reject)', 'Set conditions if conditional acceptance', 'Prepare decision letter'],
          technicalDetails: 'Updates application status, stores decision details and conditions, triggers notification workflows',
          files: ['src/components/admissions/stages/AdmissionDecisionStage.tsx']
        },
        {
          step: 6,
          title: 'Fee Payment',
          actor: 'Parent/Guardian & Finance',
          actions: ['Receive payment link', 'Complete payment via gateway', 'System verifies payment', 'Generate receipt', 'Send payment reminders if pending'],
          technicalDetails: 'Integrates with payment gateways, creates fee records, webhook handlers verify payment status',
          files: ['src/components/admissions/stages/FeePaymentStage.tsx']
        },
        {
          step: 7,
          title: 'Enrollment Confirmation',
          actor: 'Admissions Officer & System',
          actions: ['Assign Student ID', 'Assign Form Class', 'Assign House', 'Set start date', 'Generate enrollment credentials'],
          technicalDetails: 'Creates student record in students table, assigns to classes, sets up user accounts',
          files: ['src/components/admissions/stages/EnrollmentConfirmationStage.tsx']
        },
        {
          step: 8,
          title: 'Welcome & Onboarding',
          actor: 'Admissions & Administrative Staff',
          actions: ['Send welcome pack', 'Schedule orientation', 'Order uniform', 'Complete onboarding checklist', 'Mark student as fully enrolled'],
          technicalDetails: 'Updates onboarding status, sends automated communications, finalizes student enrollment',
          files: ['src/components/admissions/stages/WelcomeOnboardingStage.tsx']
        }
      ]
    },
    {
      category: 'Student Admission Flow',
      steps: [
        {
          step: 1,
          title: 'Application Submission',
          actor: 'Parent/Guardian',
          actions: ['Navigate to public admissions portal', 'Fill application form with student details', 'Upload required documents', 'Submit application'],
          technicalDetails: 'Form data saved to enrollment_applications table, documents uploaded to application-documents storage bucket',
          files: ['src/pages/UnifiedAdmissionsPage.tsx']
        },
        {
          step: 2,
          title: 'Application Review',
          actor: 'Admissions Officer',
          actions: ['View new applications', 'Review submitted documents', 'Verify information', 'Update application status (pending/approved/rejected)'],
          technicalDetails: 'Queries enrollment_applications, updates status field, can add notes to additional_data JSONB column',
          files: ['src/pages/NewApplicationsPage.tsx']
        },
        {
          step: 3,
          title: 'Enrollment Processing',
          actor: 'Admissions Officer',
          actions: ['Select approved application', 'Enter student enrollment details', 'Generate student credentials', 'Create parent account if needed', 'Assign student number'],
          technicalDetails: 'Calls create_complete_student_enrollment() function which creates records in students, profiles, user_roles, student_parents tables',
          files: ['src/pages/EnrollmentPage.tsx', 'supabase/functions/create_complete_student_enrollment']
        },
        {
          step: 4,
          title: 'Credential Distribution',
          actor: 'System',
          actions: ['Generate temporary passwords', 'Display credentials to officer', 'Mark application as enrolled', 'Set must_change_password flag'],
          technicalDetails: 'Credentials shown in UI, emails can be sent, must_change_password enforces password change on first login',
          files: ['src/pages/EnrollmentPage.tsx']
        },
        {
          step: 5,
          title: 'First Login',
          actor: 'Student/Parent',
          actions: ['Login with provided credentials', 'Forced password change screen', 'Set new secure password', 'Access student/parent portal'],
          technicalDetails: 'useAuth checks must_change_password flag, redirects to password change, calls clear_password_change_requirement()',
          files: ['src/hooks/useAuth.tsx', 'src/pages/Index.tsx']
        }
      ]
    },
    {
      category: 'Assignment Workflow',
      steps: [
        {
          step: 1,
          title: 'Assignment Creation',
          actor: 'Teacher',
          actions: ['Navigate to Assignments', 'Click Create Assignment', 'Fill assignment details (title, description, due date)', 'Select target class/students', 'Attach resources if needed', 'Publish assignment'],
          technicalDetails: 'Creates record in assignments table with teacher_id, school_id, status=published',
          files: ['src/pages/AssignmentsPage.tsx', 'src/hooks/useAssignmentData.tsx']
        },
        {
          step: 2,
          title: 'Student Views Assignment',
          actor: 'Student',
          actions: ['Login to portal', 'Navigate to My Assignments', 'View assignment details', 'Download attached resources', 'Click Submit'],
          technicalDetails: 'Queries assignments filtered by class enrollment, shows pending assignments first',
          files: ['src/pages/AssignmentsPage.tsx']
        },
        {
          step: 3,
          title: 'Student Submission',
          actor: 'Student',
          actions: ['Upload assignment file', 'Add submission notes', 'Submit assignment', 'See confirmation'],
          technicalDetails: 'Inserts into assignment_submissions table, uploads file to submissions bucket with RLS policies',
          files: ['src/components/assignments/StudentSubmissionInterface.tsx']
        },
        {
          step: 4,
          title: 'Teacher Grading',
          actor: 'Teacher',
          actions: ['Navigate to Grading', 'View pending submissions', 'Select assignment', 'Review student work', 'Enter grade and feedback', 'Mark as returned'],
          technicalDetails: 'Updates assignment_submissions with grade, feedback, creates gradebook_records entry',
          files: ['src/pages/GradingPage.tsx', 'src/components/assignments/GradingInterface.tsx']
        },
        {
          step: 5,
          title: 'Grade Publication',
          actor: 'System',
          actions: ['Save grade to gradebook', 'Update submission status', 'Notify student', 'Make grade visible to parents'],
          technicalDetails: 'Inserts/updates gradebook_records, parents can view via RLS policies',
          files: ['src/components/assignments/GradingInterface.tsx']
        }
      ]
    },
    {
      category: 'Attendance Recording Flow',
      steps: [
        {
          step: 1,
          title: 'Register Opening',
          actor: 'Teacher',
          actions: ['Navigate to Attendance', 'Select class and date', 'View student list', 'Begin attendance marking'],
          technicalDetails: 'Queries students by class, creates attendance session record',
          files: ['src/pages/AttendancePage.tsx']
        },
        {
          step: 2,
          title: 'Mark Attendance',
          actor: 'Teacher',
          actions: ['Mark each student as Present/Absent/Late', 'Add notes for absences', 'Save attendance record'],
          technicalDetails: 'Bulk inserts into attendance_records table with student_id, status, date, notes',
          files: ['src/pages/AttendancePage.tsx']
        },
        {
          step: 3,
          title: 'Absence Notification',
          actor: 'System',
          actions: ['Identify absent students', 'Send notifications to parents', 'Log notification delivery'],
          technicalDetails: 'Automated notifications via communication module, logged in notification_logs',
          files: ['src/pages/AttendancePage.tsx']
        },
        {
          step: 4,
          title: 'Attendance Reports',
          actor: 'Admin/HOD',
          actions: ['Generate attendance reports', 'View attendance trends', 'Identify chronic absentees', 'Export data'],
          technicalDetails: 'Aggregates attendance_records with GROUP BY, calculates percentages',
          files: ['src/pages/AttendancePage.tsx', 'src/pages/AnalyticsPage.tsx']
        }
      ]
    },
    {
      category: 'User & Role Management Flow',
      steps: [
        {
          step: 1,
          title: 'User Creation',
          actor: 'Super Admin',
          actions: ['Navigate to User Management', 'Click Add User', 'Enter user details (name, email)', 'Assign initial role', 'Set school association', 'Generate temporary password'],
          technicalDetails: 'Creates profile in profiles table, assigns role in user_roles table with school_id',
          files: ['src/pages/UserManagementPage.tsx']
        },
        {
          step: 2,
          title: 'Role Assignment',
          actor: 'Super Admin',
          actions: ['Select user', 'Choose role (teacher, school_admin, etc.)', 'Assign to school', 'Set department/year group if applicable', 'Activate role'],
          technicalDetails: 'Inserts into user_roles with role enum, school_id, is_active=true',
          files: ['src/pages/UserManagementPage.tsx']
        },
        {
          step: 3,
          title: 'Permission Configuration',
          actor: 'Super Admin',
          actions: ['Navigate to Permission Management', 'Select role', 'Choose module', 'Set permissions (view/create/edit/delete)', 'Configure field-level access'],
          technicalDetails: 'Updates role_module_permissions and field_permissions tables',
          files: ['src/pages/PermissionManagementPage.tsx', 'src/components/admin/PermissionManager.tsx']
        },
        {
          step: 4,
          title: 'Access Validation',
          actor: 'System',
          actions: ['User attempts to access module', 'Check RLS policies', 'Verify role permissions', 'Validate school association', 'Grant or deny access'],
          technicalDetails: 'RLS policies query user_roles, usePermissions hook checks role_module_permissions',
          files: ['src/hooks/useRBAC.tsx', 'src/hooks/usePermissions.tsx']
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            User Flows & Processes
          </CardTitle>
          <CardDescription>
            Step-by-step workflow documentation for major system processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {flows.map((flow, flowIndex) => (
              <AccordionItem key={flowIndex} value={`flow-${flowIndex}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    {flow.category}
                    <Badge variant="secondary">{flow.steps.length} steps</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {/* Visual Flowchart */}
                    {flowcharts[flowIndex] && (
                      <Card className="border-2 border-primary/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Visual Flowchart</CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyMermaid(flowcharts[flowIndex].mermaid, `flow-${flowIndex}`)}
                            >
                              {copiedIndex === `flow-${flowIndex}` ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Mermaid Code
                                </>
                              )}
                            </Button>
                          </div>
                          <CardDescription>
                            Complete visual representation of {flow.category}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mermaid-container p-4 bg-muted/50 rounded-lg overflow-x-auto">
                            <pre className="mermaid text-sm">
                              {flowcharts[flowIndex].mermaid}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Detailed Steps */}
                    {flow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="relative">
                        {stepIndex < flow.steps.length - 1 && (
                          <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                        )}
                        
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold relative z-10">
                            {step.step}
                          </div>
                          
                          <Card className="flex-1">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {step.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {step.actor}
                                    </Badge>
                                  </CardDescription>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Actions</h4>
                                <ul className="space-y-1">
                                  {step.actions.map((action, aIndex) => (
                                    <li key={aIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="border-t pt-3">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Technical Implementation
                                </h4>
                                <p className="text-sm text-muted-foreground">{step.technicalDetails}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold mb-2">Related Files</h4>
                                <div className="flex flex-wrap gap-2">
                                  {step.files.map((file, fIndex) => (
                                    <Badge key={fIndex} variant="secondary" className="text-xs font-mono">
                                      {file}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Initialize Mermaid */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof mermaid !== 'undefined') {
              mermaid.initialize({ 
                startOnLoad: true,
                theme: 'default',
                flowchart: {
                  useMaxWidth: true,
                  htmlLabels: true,
                  curve: 'basis'
                }
              });
              // Re-render mermaid diagrams
              setTimeout(() => {
                mermaid.contentLoaded();
              }, 100);
            }
          `
        }}
      />
    </div>
  );
}
