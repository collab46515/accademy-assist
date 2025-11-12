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
      category: '1. ACTUAL ADMISSION STAGES - AS IMPLEMENTED',
      description: '8-stage admission process (Stage 0-7) with real navigation via /admissions?stage=0-7',
      steps: [
        {
          step: 0,
          title: 'Stage 0: Application Submitted',
          actor: 'Parent/Guardian & Admissions Officer',
          actions: [
            'Shows validation checks: Personal details, Parent details, Academic history, Emergency contact, Medical info',
            'Each item shows status: completed/pending',
            'Button: "Move to Document Verification"',
            'Status in DB: "submitted"'
          ],
          technicalDetails: 'Component: ApplicationSubmittedStage.tsx. Shows hardcoded validation checklist. Updates status when moving to next stage.',
          dataFlow: 'enrollment_applications.status = "submitted" → button click → updates to "document_verification"',
          files: ['src/components/admissions/stages/ApplicationSubmittedStage.tsx', 'src/components/admissions/StageWorkflowManager.tsx']
        },
        {
          step: 1,
          title: 'Stage 1: Document Verification',
          actor: 'Admissions Officer',
          actions: [
            'Lists required documents: Birth Certificate, Passport Photo, School Reports, Immunization Records, Transfer Certificate',
            'Each document shows: status (verified/pending), upload date, verified by name',
            'Document preview functionality',
            'Button: "Move to Assessment & Interview"',
            'Status in DB: "document_verification"'
          ],
          technicalDetails: 'Component: DocumentVerificationStage.tsx. Lists documents with hardcoded sample data. Has document selection and preview UI.',
          dataFlow: 'Document list display → selection → verification → button updates status to "assessment_scheduled"',
          files: ['src/components/admissions/stages/DocumentVerificationStage.tsx']
        },
        {
          step: 2,
          title: 'Stage 2: Assessment & Interview',
          actor: 'Academic Staff & Admissions Team',
          actions: [
            'Shows assessment list: Math, English, Science, Behavioral Assessment',
            'Each shows: type, subject, scheduled date, time, status (pending/scheduled/completed)',
            'Dialog to schedule new assessments with date/time picker',
            'Interview scheduling functionality',
            'Button: "Move to Application Review"',
            'Status in DB: "assessment_scheduled"'
          ],
          technicalDetails: 'Component: AssessmentInterviewStage.tsx. Has scheduling dialog with form. Displays assessment cards with status badges.',
          dataFlow: 'Assessment scheduling → status tracking → button updates to "under_review"',
          files: ['src/components/admissions/stages/AssessmentInterviewStage.tsx']
        },
        {
          step: 3,
          title: 'Stage 3: Application Review',
          actor: 'Admissions Committee',
          actions: [
            'Review criteria with sliders: Academic Performance (0-100), Behavioral Assessment (0-100), Potential Score (0-100)',
            'Shows reviewer name, completion status for each criterion',
            'Composite score calculation display',
            'Committee review notes section',
            'Button: "Move to Admission Decision"',
            'Status in DB: "under_review"'
          ],
          technicalDetails: 'Component: ApplicationReviewStage.tsx. Uses Slider components for scoring. Shows hardcoded review criteria with sample reviewers.',
          dataFlow: 'Score sliders → composite calculation → review notes → button updates to "pending_decision"',
          files: ['src/components/admissions/stages/ApplicationReviewStage.tsx']
        },
        {
          step: 4,
          title: 'Stage 4: Admission Decision',
          actor: 'Head of Admissions',
          actions: [
            'Decision selector: Accept, Conditional Accept, Waitlist, Reject',
            'Conditions input field (for conditional acceptance)',
            'Application summary display with student details',
            'Assessment scores summary display',
            'Button: "Move to Fee Payment"',
            'Status in DB: "approved" or "rejected" or "on_hold"'
          ],
          technicalDetails: 'Component: AdmissionDecisionStage.tsx. Radio buttons for decision selection. Text input for conditions. Shows hardcoded application summary.',
          dataFlow: 'Decision selection → conditions input → button updates status to "approved"/"rejected"/"on_hold"',
          files: ['src/components/admissions/stages/AdmissionDecisionStage.tsx']
        },
        {
          step: 5,
          title: 'Stage 5: Fee Payment',
          actor: 'Parent/Guardian & Finance Team',
          actions: [
            'Fee structure display: Application Fee $100, Registration Fee $500, Tuition Fee $12,000, Total $12,600',
            'Payment plan selector: Full Payment or Installment',
            'Payment gateway integration (PLACEHOLDER - not fully connected)',
            'Payment status tracking',
            'Button: "Move to Enrollment Confirmation"',
            'Status in DB: "fee_pending" or "fee_paid"'
          ],
          technicalDetails: 'Component: FeePaymentStage.tsx. Shows hardcoded fee amounts. Payment plan radio buttons. Gateway integration is placeholder only.',
          dataFlow: 'Fee display → plan selection → payment (placeholder) → button updates to "enrollment_confirmed"',
          files: ['src/components/admissions/stages/FeePaymentStage.tsx']
        },
        {
          step: 6,
          title: 'Stage 6: Enrollment Confirmation',
          actor: 'Admissions Officer & System',
          actions: [
            'Student ID generation confirmation',
            'Class assignment display',
            'House assignment display (Churchill, Kennedy, etc.)',
            'Academic start date display',
            'Login credentials generation confirmation',
            'Profile creation status',
            'Button: "Move to Welcome & Onboarding"',
            'Status in DB: "enrollment_confirmed"'
          ],
          technicalDetails: 'Component: EnrollmentConfirmationStage.tsx. Shows enrollment summary with generated details. Creates student, profile, and user_role records.',
          dataFlow: 'Enrollment data → student record creation → profile creation → credentials → button updates to "enrolled"',
          files: ['src/components/admissions/stages/EnrollmentConfirmationStage.tsx', 'src/pages/EnrollmentPage.tsx']
        },
        {
          step: 7,
          title: 'Stage 7: Welcome & Onboarding',
          actor: 'Administrative Staff',
          actions: [
            'Onboarding checklist display: Welcome pack sent, Orientation scheduled, Uniform ordered, Portal access granted, Calendar shared',
            'Each item shows completion status checkbox',
            'Mark items as complete',
            'Button: "Complete Enrollment"',
            'Status in DB: "enrolled" (final status)',
            'THIS IS THE LAST STAGE - No next stage button after this'
          ],
          technicalDetails: 'Component: WelcomeOnboardingStage.tsx. Shows checklist with checkboxes. Final stage - button marks as fully enrolled.',
          dataFlow: 'Checklist tracking → completion status → button marks application as "enrolled" (final)',
          files: ['src/components/admissions/stages/WelcomeOnboardingStage.tsx']
        }
      ]
    },
    {
      category: '2. Student Information Management',
      description: 'Comprehensive student data management and profile tracking',
      steps: [
        {
          step: 1,
          title: 'View Student List',
          actor: 'Teacher/Admin',
          actions: [
            'Access Students page',
            'View complete list of enrolled students',
            'Filter by class, year group, or house',
            'Search by student name or ID',
            'Sort by various criteria'
          ],
          technicalDetails: 'Queries students table with JOINs to profiles, classes. Uses RLS policies to filter by school_id and user permissions.',
          dataFlow: 'students → profiles → classes → student_class_assignments',
          files: ['src/pages/StudentsPage.tsx', 'src/hooks/useStudentData.tsx']
        },
        {
          step: 2,
          title: 'View Student Profile',
          actor: 'Teacher/Admin/Parent',
          actions: [
            'Click on student name',
            'View comprehensive student information',
            'See academic performance summary',
            'Check attendance records',
            'View behavioral notes',
            'Access contact information'
          ],
          technicalDetails: 'Loads student data with related records: grades, attendance, behavior incidents. Parent access restricted via RLS to their own children.',
          dataFlow: 'student_id → students + profiles + gradebook_records + attendance_records + behavior_incidents',
          files: ['src/pages/StudentProfilePage.tsx', 'src/components/students/StudentProfileView.tsx']
        },
        {
          step: 3,
          title: 'Edit Student Information',
          actor: 'School Admin',
          actions: [
            'Click Edit on student profile',
            'Update personal information',
            'Modify emergency contacts',
            'Update medical information',
            'Change class/house assignments',
            'Save changes'
          ],
          technicalDetails: 'Updates students and profiles tables. Validates required fields. Logs changes in audit trail.',
          dataFlow: 'updated_data → students/profiles validation → UPDATE query → audit_log',
          files: ['src/components/students/StudentEditForm.tsx']
        },
        {
          step: 4,
          title: 'Manage Parent Links',
          actor: 'School Admin',
          actions: [
            'View student\'s linked parents',
            'Add new parent/guardian',
            'Remove parent link',
            'Set primary contact',
            'Update parent permissions'
          ],
          technicalDetails: 'Manages student_parents junction table. Creates parent profile if needed. Sets relationship_type (mother/father/guardian).',
          dataFlow: 'parent_data → profiles (parent) → student_parents → relationship validation',
          files: ['src/components/students/ParentLinksManager.tsx']
        }
      ]
    },
    {
      category: '3. Assignment & Homework Management',
      description: 'Complete lifecycle from creation to grading and feedback',
      steps: [
        {
          step: 1,
          title: 'Create Assignment',
          actor: 'Teacher',
          actions: [
            'Navigate to Assignments page',
            'Click "Create New Assignment"',
            'Enter assignment title and description',
            'Set due date and time',
            'Select target class/students',
            'Attach resource files (PDFs, documents)',
            'Set maximum marks',
            'Set assignment type (homework/classwork/project)',
            'Publish assignment'
          ],
          technicalDetails: 'Creates record in assignments table with status="published", teacher_id, school_id. Files uploaded to assignments-resources storage bucket with RLS policies.',
          dataFlow: 'assignment_data → assignments table → storage bucket → student_notifications',
          files: ['src/pages/AssignmentsPage.tsx', 'src/hooks/useAssignmentData.tsx', 'src/components/assignments/AssignmentCreator.tsx']
        },
        {
          step: 2,
          title: 'Student Views Assignment',
          actor: 'Student',
          actions: [
            'Login to student portal',
            'Navigate to "My Assignments"',
            'View list of pending assignments',
            'Filter by subject or due date',
            'Click on assignment to view details',
            'Read instructions and requirements',
            'Download attached resources',
            'Note the due date'
          ],
          technicalDetails: 'Queries assignments filtered by student\'s class enrollment (student_class_assignments JOIN). Shows status (pending/submitted/graded).',
          dataFlow: 'student_id → student_class_assignments → assignments WHERE class_id → assignment_submissions (status)',
          files: ['src/pages/AssignmentsPage.tsx', 'src/components/assignments/StudentAssignmentList.tsx']
        },
        {
          step: 3,
          title: 'Submit Assignment',
          actor: 'Student',
          actions: [
            'Click "Submit Assignment" button',
            'Upload assignment file (PDF, DOC, images)',
            'Add submission notes or comments',
            'Review submission details',
            'Confirm and submit',
            'Receive confirmation message'
          ],
          technicalDetails: 'Inserts into assignment_submissions table with student_id, assignment_id, submission_date. File uploaded to submissions storage bucket. RLS ensures student can only submit for themselves.',
          dataFlow: 'file + notes → assignment_submissions INSERT → storage upload → submission confirmation',
          files: ['src/components/assignments/StudentSubmissionInterface.tsx']
        },
        {
          step: 4,
          title: 'Teacher Reviews Submissions',
          actor: 'Teacher',
          actions: [
            'Navigate to Grading page',
            'View list of pending submissions',
            'Filter by assignment or class',
            'Click on submission to review',
            'Download student\'s submitted file',
            'Review student work',
            'Prepare feedback'
          ],
          technicalDetails: 'Queries assignment_submissions WHERE status="submitted" and teacher owns assignment. Provides download links with presigned URLs.',
          dataFlow: 'teacher_id → assignments → assignment_submissions WHERE status="submitted" → storage download URLs',
          files: ['src/pages/GradingPage.tsx', 'src/components/assignments/GradingInterface.tsx']
        },
        {
          step: 5,
          title: 'Grade & Provide Feedback',
          actor: 'Teacher',
          actions: [
            'Enter numerical grade (out of maximum marks)',
            'Write detailed feedback comments',
            'Optionally attach feedback file',
            'Mark as "Returned"',
            'Save grading'
          ],
          technicalDetails: 'Updates assignment_submissions with grade, feedback. Creates gradebook_records entry. Status changed to "returned". Student and parent notified.',
          dataFlow: 'grade + feedback → assignment_submissions UPDATE → gradebook_records INSERT → notification_queue',
          files: ['src/components/assignments/GradingInterface.tsx']
        },
        {
          step: 6,
          title: 'Student Views Grade',
          actor: 'Student/Parent',
          actions: [
            'Receive notification of graded assignment',
            'Navigate to Assignments page',
            'View graded assignments section',
            'Click to see grade and feedback',
            'Download feedback file if attached',
            'Review teacher comments'
          ],
          technicalDetails: 'assignment_submissions with status="returned" visible to student. Parents can view via student_parents link and RLS policies.',
          dataFlow: 'student_id → assignment_submissions WHERE status="returned" → grade display',
          files: ['src/pages/AssignmentsPage.tsx', 'src/components/assignments/StudentGradedView.tsx']
        }
      ]
    },
    {
      category: '4. Attendance Tracking & Reporting',
      description: 'Daily attendance marking, absence tracking, and analytics',
      steps: [
        {
          step: 1,
          title: 'Open Attendance Register',
          actor: 'Teacher/Form Tutor',
          actions: [
            'Navigate to Attendance page',
            'Select class from dropdown',
            'Select date (defaults to today)',
            'View student list for class',
            'System loads existing attendance if already marked'
          ],
          technicalDetails: 'Queries students via student_class_assignments. Checks attendance_records for existing entries for selected date.',
          dataFlow: 'class_id + date → student_class_assignments JOIN students → attendance_records (existing check)',
          files: ['src/pages/AttendancePage.tsx', 'src/components/attendance/AttendanceRegister.tsx']
        },
        {
          step: 2,
          title: 'Mark Student Attendance',
          actor: 'Teacher',
          actions: [
            'Review list of students',
            'For each student, mark status: Present / Absent / Late / Excused',
            'For absences/late: add reason notes',
            'Mark special circumstances',
            'Review all entries before saving'
          ],
          technicalDetails: 'UI maintains state for each student. Validates all students have status before allowing save.',
          dataFlow: 'UI state management → validation → bulk insert preparation',
          files: ['src/components/attendance/AttendanceRegister.tsx']
        },
        {
          step: 3,
          title: 'Save Attendance Records',
          actor: 'System',
          actions: [
            'Validate all students marked',
            'Bulk insert attendance records',
            'Identify absent students',
            'Queue parent notifications',
            'Update attendance session status',
            'Show confirmation'
          ],
          technicalDetails: 'Bulk INSERT into attendance_records. Triggers notification workflow for absences. Creates attendance_session record.',
          dataFlow: 'attendance_data[] → attendance_records (bulk INSERT) → notification_queue (for absences) → confirmation',
          files: ['src/pages/AttendancePage.tsx']
        },
        {
          step: 4,
          title: 'Parent Receives Absence Notification',
          actor: 'Parent/Guardian',
          actions: [
            'Receive SMS/email notification of absence',
            'View absence details',
            'Optional: Provide explanation via portal',
            'View student attendance history'
          ],
          technicalDetails: 'Automated notifications sent via communication module. Parents can respond via parent portal.',
          dataFlow: 'absence detected → notification_queue → SMS/email gateway → parent device',
          files: ['src/components/communication/NotificationSender.tsx']
        },
        {
          step: 5,
          title: 'View Attendance Reports',
          actor: 'Admin/HOD/Teacher',
          actions: [
            'Navigate to Analytics/Reports',
            'Select Attendance Report',
            'Choose date range',
            'Filter by class/year/student',
            'View attendance percentage',
            'Identify chronic absentees',
            'Export to Excel/PDF'
          ],
          technicalDetails: 'Aggregates attendance_records with GROUP BY. Calculates attendance_percentage = (present_days / total_days) * 100. Identifies students < 80%.',
          dataFlow: 'date_range + filters → attendance_records aggregate → percentage calculation → report generation',
          files: ['src/pages/AnalyticsPage.tsx', 'src/components/reports/AttendanceReport.tsx']
        }
      ]
    },
    {
      category: '5. Timetable Management',
      description: 'Schedule creation, class allocation, and timetable distribution',
      steps: [
        {
          step: 1,
          title: 'Create Timetable Structure',
          actor: 'Academic Admin',
          actions: [
            'Navigate to Timetable page',
            'Define periods (Period 1-8)',
            'Set period timings',
            'Define days of week',
            'Create timetable template',
            'Save structure'
          ],
          technicalDetails: 'Creates timetable_structure with period definitions, timings. Linked to academic_year and term.',
          dataFlow: 'timetable_config → timetable_structure → periods table',
          files: ['src/pages/TimetablePage.tsx', 'src/components/timetable/TimetableBuilder.tsx']
        },
        {
          step: 2,
          title: 'Assign Classes to Periods',
          actor: 'Academic Admin',
          actions: [
            'Select class/form',
            'Select day and period',
            'Assign subject',
            'Assign teacher',
            'Assign room/location',
            'Save slot assignment',
            'Repeat for all periods',
            'Check for conflicts'
          ],
          technicalDetails: 'Inserts into timetable_slots with class_id, subject_id, teacher_id, room_id. Validates no conflicts (teacher/room double booking).',
          dataFlow: 'slot_data → conflict_check → timetable_slots INSERT → validation',
          files: ['src/components/timetable/TimetableEditor.tsx']
        },
        {
          step: 3,
          title: 'Publish Timetable',
          actor: 'Academic Admin',
          actions: [
            'Review complete timetable',
            'Check for gaps or conflicts',
            'Validate all slots filled',
            'Publish timetable',
            'Notify teachers and students',
            'Make visible in portals'
          ],
          technicalDetails: 'Updates timetable_structure status to "published". Triggers notifications. Students/teachers can now view.',
          dataFlow: 'timetable_structure.status → "published" → notification_queue → portal visibility',
          files: ['src/pages/TimetablePage.tsx']
        },
        {
          step: 4,
          title: 'View Timetable (Student/Teacher)',
          actor: 'Student/Teacher',
          actions: [
            'Login to portal',
            'Navigate to Timetable',
            'View weekly schedule',
            'See subjects, teachers, rooms',
            'Filter by day',
            'Export/download timetable'
          ],
          technicalDetails: 'Queries timetable_slots filtered by user: students see their class timetable, teachers see where they teach.',
          dataFlow: 'user_id → class_assignment/teacher_id → timetable_slots → formatted display',
          files: ['src/pages/TimetablePage.tsx', 'src/components/timetable/TimetableView.tsx']
        }
      ]
    },
    {
      category: '6. Examination & Grading System',
      description: 'Exam scheduling, grade entry, report card generation',
      steps: [
        {
          step: 1,
          title: 'Schedule Examination',
          actor: 'Academic Admin/HOD',
          actions: [
            'Navigate to Exams page',
            'Click Create Exam',
            'Select exam type (Midterm/Final/Mock)',
            'Set exam dates',
            'Select classes/year groups',
            'Add subject papers',
            'Set duration for each paper',
            'Assign invigilators',
            'Publish exam schedule'
          ],
          technicalDetails: 'Creates exam_schedule with exam_type, start_date, end_date. exam_papers table holds subject-specific details. Links to academic_term.',
          dataFlow: 'exam_data → exam_schedule → exam_papers[] → invigilator_assignments → publication',
          files: ['src/pages/ExamsPage.tsx', 'src/components/exams/ExamScheduler.tsx']
        },
        {
          step: 2,
          title: 'Enter Student Marks',
          actor: 'Teacher/Subject Head',
          actions: [
            'Navigate to Grading page',
            'Select exam and subject',
            'View student list for class',
            'Enter marks for each student',
            'Add grade comments if needed',
            'Validate marks (within max marks)',
            'Submit marks',
            'Mark as completed'
          ],
          technicalDetails: 'Inserts/updates gradebook_records with student_id, exam_id, subject_id, marks_obtained, max_marks. Validates marks <= max_marks.',
          dataFlow: 'marks_data[] → validation → gradebook_records (bulk upsert) → submission confirmation',
          files: ['src/pages/GradingPage.tsx', 'src/components/grading/MarksEntryForm.tsx']
        },
        {
          step: 3,
          title: 'Calculate Grades & Rankings',
          actor: 'System',
          actions: [
            'Aggregate all subject marks',
            'Calculate total marks',
            'Calculate percentage',
            'Apply grading scale (A-F)',
            'Calculate class average',
            'Determine class rank',
            'Calculate GPA if applicable'
          ],
          technicalDetails: 'Database function calculates aggregates. Grade scale applied based on percentage. Rankings computed with RANK() window function.',
          dataFlow: 'gradebook_records → SUM(marks) → percentage calculation → grade scale application → ranking',
          files: ['Database functions', 'src/hooks/useGradebook.tsx']
        },
        {
          step: 4,
          title: 'Generate Report Cards',
          actor: 'System/Admin',
          actions: [
            'Navigate to Report Cards page',
            'Select exam term',
            'Select class/students',
            'Generate reports (bulk or individual)',
            'Review generated PDFs',
            'Add principal/HOD comments',
            'Approve and publish',
            'Make available to parents'
          ],
          technicalDetails: 'Uses jsPDF library. Queries gradebook_records, calculates aggregates, applies school template. Stores PDFs in report_cards storage bucket.',
          dataFlow: 'exam_id + student_ids → gradebook_records aggregation → PDF generation → storage upload → parent access',
          files: ['src/pages/ReportCardsPage.tsx', 'src/utils/reportCardGenerator.ts']
        },
        {
          step: 5,
          title: 'View & Download Report Card',
          actor: 'Student/Parent',
          actions: [
            'Receive notification of available report',
            'Login to portal',
            'Navigate to Report Cards',
            'Select term/exam',
            'View report card online',
            'Download PDF',
            'View detailed subject breakdowns',
            'See teacher comments'
          ],
          technicalDetails: 'RLS policies ensure students/parents only see their own reports. Presigned URLs for PDF downloads.',
          dataFlow: 'student_id → report_cards filtered by RLS → PDF download URL → user device',
          files: ['src/components/reports/ReportCardViewer.tsx']
        }
      ]
    },
    {
      category: '7. Behavior Tracking & Discipline',
      description: 'Incident logging, merit/demerit system, behavior analytics',
      steps: [
        {
          step: 1,
          title: 'Log Behavior Incident',
          actor: 'Teacher/Staff',
          actions: [
            'Navigate to Behavior Tracking',
            'Click "Log Incident"',
            'Select student',
            'Choose incident type (positive/negative)',
            'Select category (discipline, achievement, conduct)',
            'Enter detailed description',
            'Set severity level',
            'Add any witnesses',
            'Attach evidence (photos) if applicable',
            'Submit incident report'
          ],
          technicalDetails: 'Inserts into behavior_incidents table with student_id, reported_by, incident_type, severity, description. Can attach files to storage.',
          dataFlow: 'incident_data + files → behavior_incidents INSERT → storage upload → notifications (parent, admin)',
          files: ['src/pages/BehaviorTrackingPage.tsx', 'src/components/behavior/IncidentLogger.tsx']
        },
        {
          step: 2,
          title: 'Review & Action Incident',
          actor: 'Discipline Coordinator/Head',
          actions: [
            'View pending incidents',
            'Review incident details',
            'Investigate if needed',
            'Determine appropriate action',
            'Assign consequences (detention, suspension)',
            'Schedule parent meeting if serious',
            'Update incident status',
            'Add resolution notes'
          ],
          technicalDetails: 'Updates behavior_incidents with action_taken, resolution_notes, status. Creates disciplinary_actions record if needed.',
          dataFlow: 'incident_id → behavior_incidents UPDATE → disciplinary_actions INSERT → parent_notifications',
          files: ['src/components/behavior/IncidentReview.tsx']
        },
        {
          step: 3,
          title: 'Merit/Demerit Points System',
          actor: 'System',
          actions: [
            'Automatically assign points based on incident',
            'Positive incidents: award merit points',
            'Negative incidents: assign demerit points',
            'Update student behavior score',
            'Track cumulative points',
            'Trigger rewards/consequences at thresholds'
          ],
          technicalDetails: 'behavior_points table tracks running total. Triggers fire on INSERT to behavior_incidents to auto-calculate points.',
          dataFlow: 'behavior_incident → points_calculation → behavior_points UPDATE → threshold_checks → actions',
          files: ['Database triggers', 'src/hooks/useBehaviorPoints.tsx']
        },
        {
          step: 4,
          title: 'View Behavior Reports',
          actor: 'Teacher/Admin/Parent',
          actions: [
            'Navigate to behavior reports',
            'View student behavior history',
            'See trends over time',
            'Filter by incident type',
            'View behavior score',
            'Export behavior report',
            'Identify repeat offenders'
          ],
          technicalDetails: 'Aggregates behavior_incidents with time-series analysis. Charts show trends. RLS ensures parents only see their children.',
          dataFlow: 'student_id + date_range → behavior_incidents aggregate → trend analysis → visualization',
          files: ['src/pages/BehaviorTrackingPage.tsx', 'src/components/behavior/BehaviorAnalytics.tsx']
        }
      ]
    },
    {
      category: '8. Library Management System',
      description: 'Book cataloging, borrowing, returns, and fine management',
      steps: [
        {
          step: 1,
          title: 'Add Book to Catalog',
          actor: 'Librarian',
          actions: [
            'Navigate to Library page',
            'Click Add New Book',
            'Enter book details (title, author, ISBN)',
            'Set category/genre',
            'Add copies count',
            'Set borrowing rules',
            'Upload book cover image',
            'Save to catalog'
          ],
          technicalDetails: 'Inserts into library_books with title, author, isbn, category, total_copies, available_copies. Cover image uploaded to storage.',
          dataFlow: 'book_data + image → library_books INSERT → storage upload → catalog update',
          files: ['src/pages/LibraryPage.tsx', 'src/components/library/BookCatalog.tsx']
        },
        {
          step: 2,
          title: 'Student Borrows Book',
          actor: 'Librarian + Student',
          actions: [
            'Student requests book',
            'Librarian searches catalog',
            'Check book availability',
            'Scan student ID card',
            'Record borrowing transaction',
            'Set due date (typically 2 weeks)',
            'Provide book to student',
            'Print receipt'
          ],
          technicalDetails: 'Inserts into library_transactions with book_id, student_id, borrowed_date, due_date, status="borrowed". Decrements available_copies.',
          dataFlow: 'book_id + student_id → library_transactions INSERT → library_books.available_copies - 1',
          files: ['src/components/library/BookCheckout.tsx']
        },
        {
          step: 3,
          title: 'Return Book',
          actor: 'Librarian',
          actions: [
            'Student returns book',
            'Librarian scans book',
            'Check for damages',
            'Update transaction status',
            'Check if overdue',
            'Calculate fine if applicable',
            'Accept payment if fine',
            'Mark as returned'
          ],
          technicalDetails: 'Updates library_transactions status="returned", return_date=now(). If overdue, calculates fine: days_overdue * fine_per_day. Increments available_copies.',
          dataFlow: 'transaction_id → library_transactions UPDATE → fine_calculation → library_books.available_copies + 1',
          files: ['src/components/library/BookReturn.tsx']
        },
        {
          step: 4,
          title: 'Send Overdue Reminders',
          actor: 'System (Automated)',
          actions: [
            'Daily cron job runs',
            'Identify overdue books',
            'Send reminder to students',
            'CC parents if multiple days overdue',
            'Generate overdue report',
            'Flag chronic late returners'
          ],
          technicalDetails: 'Scheduled edge function queries library_transactions WHERE due_date < now() AND status="borrowed". Sends notifications via communication module.',
          dataFlow: 'cron trigger → overdue_query → notification_queue → email/SMS → report generation',
          files: ['supabase/functions/send-library-reminders', 'src/components/library/OverdueManager.tsx']
        }
      ]
    },
    {
      category: '9. Finance & Fee Management',
      description: 'Fee structure, payment tracking, receipts, financial reports',
      steps: [
        {
          step: 1,
          title: 'Set Fee Structure',
          actor: 'Finance Manager',
          actions: ['Define fee types (tuition, transport, meals)', 'Set amounts per year group', 'Configure payment terms', 'Set due dates', 'Publish fee structure'],
          technicalDetails: 'Creates fee_structure records linked to academic_year. Supports multiple fee types and installment plans.',
          dataFlow: 'fee_config → fee_structure → student_fee_assignments',
          files: ['src/pages/FinanceOperationsPage.tsx', 'src/components/finance/FeeStructureManager.tsx']
        },
        {
          step: 2,
          title: 'Process Payment',
          actor: 'Parent/Bursar',
          actions: ['View outstanding fees', 'Select payment method', 'Complete transaction', 'Generate receipt', 'Update payment status'],
          technicalDetails: 'Records payment in fee_payments table. Integrates with payment gateways. Generates PDF receipts.',
          dataFlow: 'payment_data → payment_gateway → fee_payments INSERT → receipt_generation',
          files: ['src/components/finance/PaymentProcessor.tsx']
        },
        {
          step: 3,
          title: 'Generate Financial Reports',
          actor: 'Finance Manager',
          actions: ['Select report type', 'Set date range', 'Filter parameters', 'Generate report', 'Export to Excel/PDF'],
          technicalDetails: 'Aggregates fee_payments with various GROUP BY clauses. Calculates totals, outstanding amounts, collection rates.',
          dataFlow: 'date_range + filters → fee_payments aggregate → report_generation → export',
          files: ['src/components/finance/FinancialReports.tsx']
        }
      ]
    },
    {
      category: '10. User & Permission Management',
      description: 'Role-based access control, multi-school support, granular permissions',
      steps: [
        {
          step: 1,
          title: 'Create User Account',
          actor: 'Super Admin/School Admin',
          actions: ['Enter user details', 'Assign roles', 'Set school association', 'Generate credentials', 'Send welcome email'],
          technicalDetails: 'Creates records in profiles and user_roles tables. RLS policies ensure school isolation.',
          dataFlow: 'user_data → profiles INSERT → user_roles INSERT → credential_generation',
          files: ['src/pages/AdminManagementPage.tsx']
        },
        {
          step: 2,
          title: 'Configure Role Permissions',
          actor: 'Super Admin',
          actions: ['Select role type', 'Choose module', 'Set CRUD permissions', 'Configure field-level access', 'Save permissions'],
          technicalDetails: 'Updates role_module_permissions table. Field restrictions stored in field_permissions.',
          dataFlow: 'role + module → permission_settings → role_module_permissions UPSERT',
          files: ['src/pages/PermissionManagementPage.tsx', 'src/components/admin/PermissionManager.tsx']
        },
        {
          step: 3,
          title: 'Access Control Enforcement',
          actor: 'System',
          actions: ['User login', 'Load user roles', 'Check module permissions', 'Apply RLS policies', 'Render UI based on permissions'],
          technicalDetails: 'useRBAC hook loads user_roles. RLS policies filter all queries by school_id. usePermissions validates actions.',
          dataFlow: 'auth.uid() → user_roles → RLS enforcement → UI rendering',
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
