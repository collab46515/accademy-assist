import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function TechnicalFlowcharts() {
  const { toast } = useToast();
  
  useEffect(() => {
    // Load mermaid from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.mermaid) {
        // @ts-ignore
        window.mermaid.initialize({ 
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
        });
        // @ts-ignore
        window.mermaid.contentLoaded();
      }
    };
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${title} flowchart code copied`,
    });
  };

  const flowcharts = [
    {
      category: 'Authentication & Authorization',
      flows: [
        {
          title: 'User Login Flow',
          description: 'Complete authentication flow from login to session establishment',
          diagram: `graph TD
    A[User visits /auth] --> B{Is Authenticated?}
    B -->|Yes| C[Redirect to Dashboard]
    B -->|No| D[Show Login Form]
    D --> E[User enters credentials]
    E --> F[Submit to Supabase Auth]
    F --> G{Auth Success?}
    G -->|No| H[Show Error Message]
    H --> D
    G -->|Yes| I[Supabase creates session]
    I --> J[Store session in localStorage]
    J --> K[useAuth hook detects user]
    K --> L[Fetch user roles from user_roles]
    L --> M[Fetch schools data]
    M --> N[Set currentSchool from localStorage or first school]
    N --> O[Redirect to Dashboard]
    O --> P[Render protected routes]`
        },
        {
          title: 'Permission Check Flow',
          description: 'How permissions are verified for resources',
          diagram: `graph TD
    A[Component needs permission] --> B[Call hasPermission hook]
    B --> C[Get current user from useAuth]
    C --> D{User exists?}
    D -->|No| E[Return false]
    D -->|Yes| F[Get currentSchool from useRBAC]
    F --> G{School exists?}
    G -->|No| E
    G -->|Yes| H[Call Supabase RPC has_permission]
    H --> I[RPC checks user_roles table]
    I --> J[RPC checks role_module_permissions]
    J --> K[RPC checks specific permission flag]
    K --> L{Permission granted?}
    L -->|Yes| M[Return true - Allow access]
    L -->|No| N[Return false - Deny access]`
        },
        {
          title: 'RBAC Context Initialization',
          description: 'Role-based access control setup on app load',
          diagram: `graph TD
    A[App loads] --> B[RBACProvider initializes]
    B --> C[useAuth provides user]
    C --> D{User authenticated?}
    D -->|No| E[Set empty roles/schools]
    D -->|Yes| F[fetchUserData called]
    F --> G[Query user_roles table]
    G --> H[Filter active roles for user]
    H --> I{Is super_admin?}
    I -->|Yes| J[Fetch ALL schools]
    I -->|No| K[Fetch only assigned schools]
    J --> L[Set schools state]
    K --> L
    L --> M[Check localStorage for currentSchoolId]
    M --> N{Stored school found?}
    N -->|Yes| O[Set as currentSchool]
    N -->|No| P[Set first school as current]
    O --> Q[Context ready]
    P --> Q
    Q --> R[Components can use useRBAC]`
        },
        {
          title: 'School Switching Flow',
          description: 'How users switch between schools in multi-tenant setup',
          diagram: `graph TD
    A[User clicks school selector] --> B[SchoolSwitcher component opens]
    B --> C[Display available schools]
    C --> D[User selects new school]
    D --> E[Call switchSchool from useRBAC]
    E --> F[Update currentSchool state]
    F --> G[Store school_id in localStorage]
    G --> H[Trigger React state update]
    H --> I[All components using useRBAC re-render]
    I --> J[Queries refetch with new school filter]
    J --> K[getCurrentSchoolRoles returns new roles]
    K --> L[Permissions recalculated]
    L --> M[Sidebar menu items update]
    M --> N[Dashboard shows new school data]
    N --> O[URL may update with school context]`
        }
      ]
    },
    {
      category: 'Academic Operations - Admissions',
      flows: [
        {
          title: 'Student Admission Workflow',
          description: 'Complete flow from application to enrollment',
          diagram: `graph TD
    A[Parent submits application] --> B[Create student record]
    B --> C[Set status = pending]
    C --> D[Store in students table]
    D --> E[Notification sent to admissions]
    E --> F[Admission officer reviews]
    F --> G{Approve?}
    G -->|No| H[Set status = rejected]
    H --> I[Notify parent]
    G -->|Yes| J[Set status = approved]
    J --> K[Assign admission_number]
    K --> L[Assign to year_group & class]
    L --> M[Create user account]
    M --> N[Assign student role]
    N --> O[Link to parent account]
    O --> P[Generate fee structure]
    P --> Q[Set status = enrolled]
    Q --> R[Send welcome email]
    R --> S[Student can access portal]`
        },
        {
          title: 'Enrollment Test Flow',
          description: 'Admission test scheduling and evaluation',
          diagram: `graph TD
    A[Student application approved for test] --> B[Admin schedules test date]
    B --> C[Create test record in enrollment_tests]
    C --> D[Send test invitation to parent]
    D --> E[Parent confirms attendance]
    E --> F[Test day arrives]
    F --> G[Proctor marks attendance]
    G --> H{Student present?}
    H -->|No| I[Mark as absent]
    I --> J[Reschedule if allowed]
    H -->|Yes| K[Student takes test]
    K --> L[Submit test answers]
    L --> M[Teacher evaluates]
    M --> N[Enter marks in system]
    N --> O[Calculate percentage]
    O --> P{Meets cutoff?}
    P -->|No| Q[Update status = failed]
    Q --> R[Notify parent of result]
    P -->|Yes| S[Update status = passed]
    S --> T[Proceed to admission]
    T --> U[Create admission offer]`
        },
        {
          title: 'Student Exit Process',
          description: 'Handling student withdrawal or transfer',
          diagram: `graph TD
    A[Exit request initiated] --> B{Exit type?}
    B -->|Transfer| C[Request transfer certificate]
    B -->|Withdrawal| D[Process withdrawal]
    C --> E[Verify fee clearance]
    D --> E
    E --> F{Fees cleared?}
    F -->|No| G[Generate outstanding fees report]
    G --> H[Notify parent to clear dues]
    H --> I[Wait for payment]
    I --> E
    F -->|Yes| J[Check library books return]
    J --> K{Books returned?}
    K -->|No| L[Send reminder]
    L --> J
    K -->|Yes| M[Deactivate student portal access]
    M --> N[Update status = exited]
    N --> O[Set exit_date]
    O --> P[Generate transfer certificate]
    P --> Q[Sign and seal by principal]
    Q --> R[Provide to parent]
    R --> S[Archive student records]
    S --> T[Move to alumni if applicable]`
        }
      ]
    },
    {
      category: 'Academic Operations - Curriculum & Teaching',
      flows: [
        {
          title: 'Curriculum Management Flow',
          description: 'Creating and managing curriculum structure',
          diagram: `graph TD
    A[HOD initiates curriculum] --> B[Create curriculum record]
    B --> C[Define academic year & term]
    C --> D[Add subjects]
    D --> E[Assign to year groups]
    E --> F[Define learning objectives]
    F --> G[Create topic breakdown]
    G --> H[Set weekly schedule]
    H --> I[Assign teachers to subjects]
    I --> J[Upload syllabus documents]
    J --> K{Approval required?}
    K -->|Yes| L[Submit to principal]
    L --> M{Approved?}
    M -->|No| N[Return for revision]
    N --> G
    M -->|Yes| O[Mark as active]
    K -->|No| O
    O --> P[Publish to teacher portal]
    P --> Q[Teachers access curriculum]
    Q --> R[Create lesson plans]`
        },
        {
          title: 'Lesson Planning Flow',
          description: 'Teacher creates lesson plans from curriculum',
          diagram: `graph TD
    A[Teacher opens lesson planner] --> B[Select subject & topic]
    B --> C[Choose date range]
    C --> D[Define learning outcomes]
    D --> E[Add teaching activities]
    E --> F[Specify resources needed]
    F --> G[Add assessment methods]
    G --> H[Upload materials]
    H --> I[Save lesson plan]
    I --> J{Use AI assistant?}
    J -->|Yes| K[AI generates suggestions]
    K --> L[Review AI recommendations]
    L --> M[Accept or modify]
    M --> N[Finalize plan]
    J -->|No| N
    N --> O{HOD review required?}
    O -->|Yes| P[Submit for approval]
    P --> Q{Approved?}
    Q -->|No| R[Revise plan]
    R --> D
    Q -->|Yes| S[Mark as approved]
    O -->|No| S
    S --> T[Lesson ready for delivery]`
        },
        {
          title: 'Timetable Generation Flow',
          description: 'Creating class and teacher schedules',
          diagram: `graph TD
    A[Admin initiates timetable] --> B[Define school timings]
    B --> C[Set periods per day]
    C --> D[Add break times]
    D --> E[List all subjects]
    E --> F[List all teachers]
    F --> G[Define teacher availability]
    G --> H[Set room constraints]
    H --> I{Use AI generator?}
    I -->|Yes| J[AI analyzes constraints]
    J --> K[AI generates optimal schedule]
    K --> L[Review conflicts]
    I -->|No| M[Manual slot assignment]
    L --> N{Conflicts found?}
    N -->|Yes| O[AI suggests alternatives]
    O --> P[Accept or modify]
    M --> N
    N -->|No| Q[Validate timetable]
    Q --> R[Check teacher load balance]
    R --> S{Balanced?}
    S -->|No| T[Rebalance assignments]
    T --> K
    S -->|Yes| U[Publish timetable]
    U --> V[Notify teachers]
    V --> W[Notify students]
    W --> X[Display in portals]`
        },
        {
          title: 'Academic Management Flow',
          description: 'Overall academic operations monitoring',
          diagram: `graph TD
    A[HOD Dashboard loads] --> B[Fetch department data]
    B --> C[Display teacher performance]
    C --> D[Show class progress]
    D --> E[List pending approvals]
    E --> F[Review lesson plans]
    F --> G{Action needed?}
    G -->|Approve| H[Approve lesson plan]
    G -->|Reject| I[Send feedback]
    G -->|Monitor| J[Check assignment completion]
    J --> K[View grade distribution]
    K --> L{Intervention needed?}
    L -->|Yes| M[Schedule teacher meeting]
    M --> N[Create action plan]
    N --> O[Set follow-up date]
    L -->|No| P[Continue monitoring]
    O --> P
    P --> Q[Generate department report]
    Q --> R[Share with principal]`
        }
      ]
    },
    {
      category: 'Academic Operations - Assessments',
      flows: [
        {
          title: 'Assignment Creation & Submission',
          description: 'Flow from assignment creation to final grade',
          diagram: `graph TD
    A[Teacher creates assignment] --> B[Set due_date & max_marks]
    B --> C[Assign to class/students]
    C --> D[Store in assignments table]
    D --> E[Students notified]
    E --> F[Student views assignment]
    F --> G[Student uploads submission]
    G --> H[Store file in storage bucket]
    H --> I[Create submission record]
    I --> J[Set submitted_at timestamp]
    J --> K[Teacher receives notification]
    K --> L[Teacher reviews submission]
    L --> M{Grade submission?}
    M -->|Yes| N[Enter marks & feedback]
    N --> O[Store in grades table]
    O --> P[Calculate percentage]
    P --> Q[Update submission status]
    Q --> R[Notify student]
    R --> S[Student views grade]
    M -->|Request revision| T[Set status = needs_revision]
    T --> U[Student resubmits]
    U --> G`
        },
        {
          title: 'Exam Management Flow',
          description: 'Scheduling and conducting examinations',
          diagram: `graph TD
    A[Admin creates exam] --> B[Define exam details]
    B --> C[Set exam type - midterm/final/quiz]
    C --> D[Assign subjects]
    D --> E[Set date and time]
    E --> F[Assign invigilators]
    F --> G[Allocate rooms]
    G --> H[Generate seating arrangement]
    H --> I[Publish exam schedule]
    I --> J[Print hall tickets]
    J --> K[Exam day arrives]
    K --> L[Invigilator marks attendance]
    L --> M[Students take exam]
    M --> N[Collect answer sheets]
    N --> O[Distribute to evaluators]
    O --> P[Teachers grade papers]
    P --> Q[Enter marks in system]
    Q --> R[HOD reviews marks]
    R --> S{Moderation needed?}
    S -->|Yes| T[Adjust marks]
    T --> U[Document moderation]
    S -->|No| U
    U --> V[Publish results]
    V --> W[Generate rank list]
    W --> X[Notify students]`
        },
        {
          title: 'Gradebook Management',
          description: 'Recording and managing student grades',
          diagram: `graph TD
    A[Teacher opens gradebook] --> B[Select class & subject]
    B --> C[View all students]
    C --> D[Select assessment type]
    D --> E{Entry method?}
    E -->|Individual| F[Enter marks per student]
    E -->|Bulk upload| G[Download template]
    G --> H[Fill marks in Excel]
    H --> I[Upload file]
    I --> J[Validate data]
    J --> K{Valid?}
    K -->|No| L[Show errors]
    L --> G
    K -->|Yes| M[Import to database]
    F --> M
    M --> N[Calculate grades]
    N --> O[Apply grading scale]
    O --> P[Update student records]
    P --> Q[Generate statistics]
    Q --> R{Publish grades?}
    R -->|Yes| S[Make visible to students]
    S --> T[Send notifications]
    R -->|No| U[Save as draft]
    T --> V[Students view in portal]`
        },
        {
          title: 'Report Card Generation',
          description: 'End of term comprehensive report creation',
          diagram: `graph TD
    A[Term end approaches] --> B[Select term & students]
    B --> C[Fetch all grades for term]
    C --> D[Group by subject]
    D --> E[Calculate subject averages]
    E --> F[Fetch attendance records]
    F --> G[Calculate attendance percentage]
    G --> H[Fetch behavior logs]
    H --> I[Aggregate behavior scores]
    I --> J[Fetch teacher comments]
    J --> K[Generate report template]
    K --> L[Populate student data]
    L --> M[Add grade breakdown]
    M --> N[Add attendance summary]
    N --> O[Add teacher remarks]
    O --> P[Calculate overall GPA]
    P --> Q[Determine rank in class]
    Q --> R{Approval required?}
    R -->|Yes| S[Send to HOD for review]
    S --> T{HOD approves?}
    T -->|No| U[Return for revision]
    U --> K
    T -->|Yes| V[Mark as approved]
    R -->|No| V
    V --> W[Generate PDF]
    W --> X[Store in reports bucket]
    X --> Y[Notify parent]
    Y --> Z[Report accessible in portal]`
        },
        {
          title: 'HOD Dashboard Monitoring',
          description: 'Department head oversight of academics',
          diagram: `graph TD
    A[HOD logs in] --> B[Load dashboard]
    B --> C[Display department KPIs]
    C --> D[Show teacher performance]
    D --> E[Display class progress]
    E --> F[List pending tasks]
    F --> G{Review type?}
    G -->|Lesson plans| H[View pending lesson plans]
    H --> I[Approve or reject]
    G -->|Grade submission| J[Check grading progress]
    J --> K{Delayed grading?}
    K -->|Yes| L[Send reminder to teacher]
    K -->|No| M[Monitor progress]
    G -->|Student performance| N[View failing students]
    N --> O[Identify at-risk students]
    O --> P[Schedule interventions]
    P --> Q[Assign remedial classes]
    Q --> R[Track improvement]
    R --> S[Generate reports]
    S --> T[Present to principal]`
        }
      ]
    },
    {
      category: 'Student Services - Core Operations',
      flows: [
        {
          title: 'Student Directory Management',
          description: 'Managing student master data',
          diagram: `graph TD
    A[Admin opens student directory] --> B[View all students]
    B --> C{Action?}
    C -->|Add new| D[Open student form]
    D --> E[Enter basic details]
    E --> F[Upload photo]
    F --> G[Add parent details]
    G --> H[Set academic info]
    H --> I[Assign to class]
    I --> J[Generate admission number]
    J --> K[Create student account]
    K --> L[Send credentials]
    C -->|Edit| M[Select student]
    M --> N[Update information]
    N --> O[Save changes]
    O --> P[Log modification]
    C -->|View| Q[Display student profile]
    Q --> R[Show academic history]
    R --> S[Show attendance]
    S --> T[Show fee status]
    C -->|Bulk import| U[Download template]
    U --> V[Fill student data]
    V --> W[Upload CSV]
    W --> X[Validate entries]
    X --> Y{Valid?}
    Y -->|No| Z[Show errors]
    Z --> V
    Y -->|Yes| AA[Import all students]`
        },
        {
          title: 'Attendance Tracking Flow',
          description: 'Daily attendance recording and monitoring',
          diagram: `graph TD
    A[Teacher opens attendance] --> B[Select class & date]
    B --> C[Fetch class students]
    C --> D[Fetch existing attendance records]
    D --> E[Display student list]
    E --> F[Teacher marks each student]
    F --> G{Status options}
    G --> H[Present]
    G --> I[Absent]
    G --> J[Late]
    G --> K[Excused]
    H --> L[Store in attendance table]
    I --> L
    J --> L
    K --> L
    L --> M[Add notes if needed]
    M --> N[Save attendance batch]
    N --> O[Update student attendance stats]
    O --> P{Absence threshold exceeded?}
    P -->|Yes| Q[Trigger alert to form tutor]
    P -->|No| R[Complete]
    Q --> S[Create follow-up task]
    S --> T[Notify parent]
    T --> R`
        },
        {
          title: 'Transport Management Flow',
          description: 'Bus routing and student transport tracking',
          diagram: `graph TD
    A[Admin manages transport] --> B{Task?}
    B -->|Define routes| C[Create bus route]
    C --> D[Add stops with timings]
    D --> E[Assign vehicle]
    E --> F[Assign driver & attendant]
    F --> G[Set route capacity]
    B -->|Assign students| H[Select route]
    H --> I[Add students to route]
    I --> J[Set pickup/drop points]
    J --> K[Calculate route fee]
    K --> L[Add to student fees]
    B -->|Track daily| M[Daily operations view]
    M --> N[Driver starts route]
    N --> O[Mark students boarding]
    O --> P[Update live location]
    P --> Q[Send ETA to parents]
    Q --> R[Complete route]
    R --> S[Mark students dropped]
    S --> T{Issues?}
    T -->|Yes| U[Log incident]
    U --> V[Notify school admin]
    T -->|No| W[End route]
    W --> X[Generate daily report]`
        },
        {
          title: 'Library Services Flow',
          description: 'Book circulation and library management',
          diagram: `graph TD
    A[Library operations] --> B{Task?}
    B -->|Add book| C[Enter book details]
    C --> D[Assign ISBN/accession]
    D --> E[Categorize by subject]
    E --> F[Set shelf location]
    F --> G[Add to catalog]
    B -->|Issue book| H[Student requests book]
    H --> I[Librarian searches catalog]
    I --> J{Book available?}
    J -->|No| K[Add to waitlist]
    J -->|Yes| L[Scan student ID]
    L --> M[Scan book barcode]
    M --> N[Set due date]
    N --> O[Create issue record]
    O --> P[Print issue slip]
    B -->|Return book| Q[Student returns book]
    Q --> R[Scan book barcode]
    R --> S[Check due date]
    S --> T{Overdue?}
    T -->|Yes| U[Calculate fine]
    U --> V[Collect payment]
    V --> W[Mark as returned]
    T -->|No| W
    W --> X[Update book status]
    X --> Y[Check waitlist]
    Y --> Z{Next student waiting?}
    Z -->|Yes| AA[Notify student]
    Z -->|No| AB[Return to shelf]`
        },
        {
          title: 'Behavior Tracking Flow',
          description: 'Recording and managing student behavior incidents',
          diagram: `graph TD
    A[Incident occurs] --> B[Teacher logs incident]
    B --> C[Select student]
    C --> D[Choose incident type]
    D --> E{Type?}
    E -->|Positive| F[Award points]
    F --> G[Select achievement category]
    E -->|Negative| H[Deduct points]
    H --> I[Select violation category]
    G --> J[Add detailed description]
    I --> J
    J --> K[Upload evidence if any]
    K --> L[Set severity level]
    L --> M[Save incident]
    M --> N{Severity high?}
    N -->|Yes| O[Notify form tutor]
    O --> P[Notify parents]
    P --> Q[Schedule meeting]
    Q --> R[DSL reviews case]
    R --> S{Action required?}
    S -->|Yes| T[Create action plan]
    T --> U[Assign interventions]
    U --> V[Set review date]
    V --> W[Monitor progress]
    S -->|No| X[Continue monitoring]
    N -->|No| X
    W --> X
    X --> Y[Update student profile]`
        }
      ]
    },
    {
      category: 'Student Services - Welfare & Safety',
      flows: [
        {
          title: 'Infirmary Management Flow',
          description: 'Student health records and medical incidents',
          diagram: `graph TD
    A[Student visits infirmary] --> B[Nurse records visit]
    B --> C[Check student medical history]
    C --> D[Record symptoms]
    D --> E[Take vitals]
    E --> F[Perform initial assessment]
    F --> G{Severity?}
    G -->|Minor| H[Provide first aid]
    H --> I[Give medication if approved]
    I --> J[Rest period]
    J --> K[Monitor condition]
    K --> L{Improved?}
    L -->|Yes| M[Allow return to class]
    M --> N[Document treatment]
    L -->|No| O[Escalate]
    G -->|Moderate| P[Contact parent]
    P --> Q[Provide detailed care]
    Q --> R{Needs hospital?}
    R -->|Yes| S[Arrange transport]
    S --> T[Accompany to hospital]
    R -->|No| U[Parent picks up]
    G -->|Severe| V[Call emergency]
    V --> W[Administer emergency aid]
    W --> X[Contact parent immediately]
    X --> S
    N --> Y[Update medical records]
    T --> Y
    U --> Y
    Y --> Z[Generate incident report]
    Z --> AA[File in student record]`
        },
        {
          title: 'Complaints Management Flow',
          description: 'Handling student and parent complaints',
          diagram: `graph TD
    A[Complaint received] --> B{Source?}
    B -->|Student| C[Student submits complaint]
    B -->|Parent| D[Parent submits complaint]
    B -->|Staff| E[Staff reports issue]
    C --> F[Create complaint record]
    D --> F
    E --> F
    F --> G[Assign ticket number]
    G --> H[Categorize complaint]
    H --> I{Category?}
    I -->|Bullying| J[Route to DSL]
    I -->|Academic| K[Route to HOD]
    I -->|Facilities| L[Route to Admin]
    I -->|Other| M[Route to appropriate dept]
    J --> N[Investigate complaint]
    K --> N
    L --> N
    M --> N
    N --> O[Gather evidence]
    O --> P[Interview involved parties]
    P --> Q[Document findings]
    Q --> R{Action needed?}
    R -->|Yes| S[Define corrective action]
    S --> T[Implement solution]
    T --> U[Monitor effectiveness]
    R -->|No| V[Document reason]
    U --> W[Update complaint status]
    V --> W
    W --> X[Notify complainant]
    X --> Y{Satisfied?}
    Y -->|Yes| Z[Close complaint]
    Y -->|No| AA[Escalate to principal]
    AA --> AB[Principal reviews]
    AB --> S`
        },
        {
          title: 'Safeguarding Flow',
          description: 'Child protection and safeguarding procedures',
          diagram: `graph TD
    A[Concern identified] --> B{Reported by?}
    B -->|Staff| C[Staff reports concern]
    B -->|Student| D[Student discloses]
    B -->|Parent| E[Parent raises concern]
    C --> F[DSL notified immediately]
    D --> F
    E --> F
    F --> G[DSL records initial information]
    G --> H[Assess risk level]
    H --> I{Risk level?}
    I -->|Low| J[Monitor situation]
    J --> K[Create monitoring plan]
    K --> L[Assign staff to observe]
    I -->|Medium| M[Internal investigation]
    M --> N[Interview child separately]
    N --> O[Gather evidence]
    O --> P[Contact parents if safe]
    P --> Q[Create support plan]
    I -->|High| R[Contact authorities]
    R --> S[Call police/social services]
    S --> T[Follow statutory procedures]
    T --> U[Preserve evidence]
    U --> V[Do not investigate further]
    V --> W[Cooperate with authorities]
    Q --> X[Document all actions]
    L --> X
    W --> X
    X --> Y[Store securely]
    Y --> Z[Regular review]
    Z --> AA{Case resolved?}
    AA -->|Yes| AB[Close with summary]
    AA -->|No| AC[Continue support]
    AC --> Z`
        },
        {
          title: 'Activities & Events Management',
          description: 'Extra-curricular activities and school events',
          diagram: `graph TD
    A[Plan activity/event] --> B[Define event details]
    B --> C[Set date and venue]
    C --> D[Create budget]
    D --> E[Get approval]
    E --> F{Approved?}
    F -->|No| G[Revise plan]
    G --> B
    F -->|Yes| H[Create event record]
    H --> I[Open registrations]
    I --> J[Students register]
    J --> K[Collect participation fees]
    K --> L[Send consent forms]
    L --> M[Track consent returns]
    M --> N{Event type?}
    N -->|Competition| O[Create teams]
    O --> P[Schedule matches]
    P --> Q[Record results]
    N -->|Field trip| R[Arrange transport]
    R --> S[Assign supervisors]
    S --> T[Conduct trip]
    N -->|Workshop| U[Book facilitators]
    U --> V[Prepare materials]
    V --> W[Conduct sessions]
    Q --> X[Update records]
    T --> X
    W --> X
    X --> Y[Collect feedback]
    Y --> Z[Generate report]
    Z --> AA[Share with stakeholders]
    AA --> AB[Archive event data]`
        },
        {
          title: 'Communication Management',
          description: 'School-wide and targeted communication',
          diagram: `graph TD
    A[Create communication] --> B{Type?}
    B -->|Announcement| C[Write announcement]
    B -->|Newsletter| D[Create newsletter]
    B -->|Alert| E[Create urgent alert]
    C --> F[Select recipients]
    D --> F
    E --> F
    F --> G{Target?}
    G -->|All school| H[Select all users]
    G -->|By class| I[Select year/class]
    G -->|By role| J[Select role type]
    G -->|Individual| K[Search & select]
    H --> L[Choose channels]
    I --> L
    J --> L
    K --> L
    L --> M{Channels?}
    M -->|Email| N[Queue email]
    M -->|SMS| O[Queue SMS]
    M -->|Push notification| P[Queue notification]
    M -->|Portal| Q[Post to portal]
    N --> R[Send communications]
    O --> R
    P --> R
    Q --> R
    R --> S[Track delivery]
    S --> T{Delivery status?}
    T -->|Failed| U[Retry or escalate]
    T -->|Success| V[Mark as delivered]
    V --> W[Track read receipts]
    W --> X{Action required?}
    X -->|Yes| Y[Track responses]
    Y --> Z[Generate report]
    X -->|No| Z
    Z --> AA[Archive communication]`
        }
      ]
    },
    {
      category: 'Staff & HR Operations',
      flows: [
        {
          title: 'Employee Management Flow',
          description: 'Managing staff master data and profiles',
          diagram: `graph TD
    A[HR opens employee directory] --> B{Action?}
    B -->|Add employee| C[Create employee profile]
    C --> D[Enter personal details]
    D --> E[Upload documents]
    E --> F[Set employment details]
    F --> G[Assign department & role]
    G --> H[Set salary structure]
    H --> I[Create user account]
    I --> J[Assign system roles]
    J --> K[Generate employee ID]
    K --> L[Send welcome email]
    B -->|Update| M[Select employee]
    M --> N[Modify information]
    N --> O[Update records]
    O --> P[Log changes]
    B -->|View| Q[Display employee profile]
    Q --> R[Show employment history]
    R --> S[Show performance records]
    S --> T[Show leave balance]
    T --> U[Show payroll history]
    B -->|Deactivate| V[Initiate exit process]
    V --> W[Update status to inactive]
    W --> X[Revoke system access]
    X --> Y[Archive employee data]`
        },
        {
          title: 'Recruitment Process',
          description: 'Hiring workflow from job posting to onboarding',
          diagram: `graph TD
    A[Identify vacancy] --> B[Create job requisition]
    B --> C[Get approval]
    C --> D{Approved?}
    D -->|No| E[Close requisition]
    D -->|Yes| F[Post job opening]
    F --> G[Publish on portals]
    G --> H[Receive applications]
    H --> I[Screen resumes]
    I --> J{Qualified?}
    J -->|No| K[Send rejection]
    J -->|Yes| L[Shortlist candidate]
    L --> M[Schedule interview]
    M --> N[Conduct interview]
    N --> O[Panel evaluation]
    O --> P{Recommend?}
    P -->|No| Q[Thank candidate]
    P -->|Yes| R[Background check]
    R --> S{Check passed?}
    S -->|No| Q
    S -->|Yes| T[Make offer]
    T --> U{Accepted?}
    U -->|No| V[Return to pool]
    U -->|Yes| W[Send offer letter]
    W --> X[Collect documents]
    X --> Y[Create employee record]
    Y --> Z[Begin onboarding]
    Z --> AA[Assign mentor]
    AA --> AB[Complete orientation]`
        },
        {
          title: 'Employee Exit Process',
          description: 'Managing resignations and terminations',
          diagram: `graph TD
    A[Exit initiated] --> B{Type?}
    B -->|Resignation| C[Employee submits resignation]
    B -->|Termination| D[HR initiates termination]
    B -->|Retirement| E[Process retirement]
    C --> F[Verify notice period]
    D --> F
    E --> F
    F --> G{Notice adequate?}
    G -->|No| H[Negotiate terms]
    H --> I[Document agreement]
    G -->|Yes| I
    I --> J[Create exit checklist]
    J --> K[Handover responsibilities]
    K --> L[Knowledge transfer]
    L --> M[Return company assets]
    M --> N{Assets returned?}
    N -->|No| O[Send reminder]
    O --> M
    N -->|Yes| P[Clear pending work]
    P --> Q[Conduct exit interview]
    Q --> R[Process final settlement]
    R --> S[Calculate dues]
    S --> T[Process final payroll]
    T --> U[Issue clearance certificate]
    U --> V[Revoke all access]
    V --> W[Update employee status]
    W --> X[Archive records]
    X --> Y[Maintain alumni database]`
        },
        {
          title: 'Performance & Training Management',
          description: 'Employee development and appraisals',
          diagram: `graph TD
    A[Performance cycle begins] --> B[Set annual goals]
    B --> C[Manager approves goals]
    C --> D[Quarterly reviews]
    D --> E[Track progress]
    E --> F[Identify training needs]
    F --> G{Training needed?}
    G -->|Yes| H[Nominate for training]
    H --> I[Schedule training]
    I --> J[Employee attends]
    J --> K[Complete training]
    K --> L[Assessment]
    L --> M[Update skill matrix]
    M --> N[Certificate issued]
    G -->|No| O[Continue monitoring]
    N --> O
    O --> P[Mid-year review]
    P --> Q[Update goals if needed]
    Q --> R[Continue tracking]
    R --> S[Annual appraisal]
    S --> T[Self-assessment]
    T --> U[Manager assessment]
    U --> V[HOD review]
    V --> W[Calculate rating]
    W --> X{Performance?}
    X -->|Excellent| Y[Promotion consideration]
    X -->|Good| Z[Merit increment]
    X -->|Needs improvement| AA[Performance plan]
    Y --> AB[Update records]
    Z --> AB
    AA --> AB
    AB --> AC[Start new cycle]`
        },
        {
          title: 'Payroll Processing',
          description: 'Monthly salary calculation and disbursement',
          diagram: `graph TD
    A[Month end approaches] --> B[Collect attendance data]
    B --> C[Import leave records]
    C --> D[Get overtime data]
    D --> E[Calculate gross salary]
    E --> F[Apply deductions]
    F --> G{Deduction types}
    G -->|Statutory| H[Calculate PF/ESI/Tax]
    G -->|Loans| I[Deduct loan installments]
    G -->|Others| J[Other deductions]
    H --> K[Calculate net salary]
    I --> K
    J --> K
    K --> L[Generate payslips]
    L --> M[HOD review]
    M --> N{Approved?}
    N -->|No| O[Make corrections]
    O --> E
    N -->|Yes| P[Process payments]
    P --> Q[Bank file generation]
    Q --> R[Upload to bank]
    R --> S[Confirm payment]
    S --> T{Payment successful?}
    T -->|No| U[Investigate failure]
    U --> V[Reprocess]
    V --> Q
    T -->|Yes| W[Email payslips]
    W --> X[Update payroll records]
    X --> Y[Generate reports]
    Y --> Z[Archive payroll data]`
        },
        {
          title: 'Time & Attendance Tracking',
          description: 'Staff attendance and leave management',
          diagram: `graph TD
    A[Daily attendance] --> B{Check-in method}
    B -->|Biometric| C[Scan fingerprint]
    B -->|Manual| D[Mark manually]
    B -->|Mobile app| E[GPS check-in]
    C --> F[Record in system]
    D --> F
    E --> F
    F --> G[Track working hours]
    G --> H{Leave request?}
    H -->|Yes| I[Employee applies leave]
    I --> J[Select leave type]
    J --> K{Leave balance?}
    K -->|Insufficient| L[Reject application]
    K -->|Sufficient| M[Submit to manager]
    M --> N{Manager approves?}
    N -->|No| O[Return with reason]
    N -->|Yes| P[Deduct from balance]
    P --> Q[Update calendar]
    Q --> R[Notify employee]
    H -->|No| S[Continue work]
    R --> T[Leave taken]
    T --> U[Update attendance]
    S --> U
    U --> V{End of month}
    V -->|Yes| W[Generate attendance report]
    W --> X[Send to payroll]
    V -->|No| A`
        }
      ]
    },
    {
      category: 'Finance & Operations',
      flows: [
        {
          title: 'Fee Management Flow',
          description: 'Student fee structure and collection',
          diagram: `graph TD
    A[Academic year starts] --> B[Define fee structure]
    B --> C[Set fee heads]
    C --> D{Fee types}
    D -->|Tuition| E[Set tuition fees]
    D -->|Transport| F[Set transport fees]
    D -->|Others| G[Set misc fees]
    E --> H[Assign to year groups]
    F --> H
    G --> H
    H --> I[Create student fee records]
    I --> J[Apply discounts if any]
    J --> K[Generate fee schedule]
    K --> L[Send to parents]
    L --> M[Parent views fees]
    M --> N{Payment method}
    N -->|Online| O[Online payment gateway]
    N -->|Cash| P[Counter payment]
    N -->|Cheque| Q[Cheque deposit]
    O --> R[Payment confirmation]
    P --> R
    Q --> R
    R --> S[Update payment status]
    S --> T[Generate receipt]
    T --> U[Email receipt]
    U --> V{Fully paid?}
    V -->|Yes| W[Mark as paid]
    V -->|No| X[Track outstanding]
    X --> Y{Overdue?}
    Y -->|Yes| Z[Send reminder]
    Z --> AA[Apply late fee]
    AA --> M
    Y -->|No| M`
        },
        {
          title: 'Accounting & Ledger Management',
          description: 'General ledger and bookkeeping',
          diagram: `graph TD
    A[Transaction occurs] --> B{Transaction type}
    B -->|Income| C[Record revenue]
    B -->|Expense| D[Record expenditure]
    B -->|Transfer| E[Record transfer]
    C --> F[Select account head]
    D --> F
    E --> F
    F --> G[Enter amount]
    G --> H[Add description]
    H --> I[Attach supporting documents]
    I --> J[Submit for approval]
    J --> K{Approval required?}
    K -->|Yes| L[Send to approver]
    L --> M{Approved?}
    M -->|No| N[Return with reason]
    M -->|Yes| O[Post to ledger]
    K -->|No| O
    O --> P[Update account balance]
    P --> Q[Generate journal entry]
    Q --> R{Transaction validated?}
    R -->|No| S[Flag for review]
    S --> T[Accountant reviews]
    T --> U{Correct?}
    U -->|No| V[Reverse entry]
    V --> A
    U -->|Yes| W[Mark as verified]
    R -->|Yes| W
    W --> X[Update financial reports]`
        },
        {
          title: 'Financial Reports Generation',
          description: 'Creating financial statements and reports',
          diagram: `graph TD
    A[Report request] --> B{Report type}
    B -->|Balance Sheet| C[Fetch assets & liabilities]
    B -->|P&L Statement| D[Fetch income & expenses]
    B -->|Cash Flow| E[Fetch cash movements]
    B -->|Custom| F[Define parameters]
    C --> G[Group by categories]
    D --> G
    E --> G
    F --> G
    G --> H[Apply date filters]
    H --> I[Calculate totals]
    I --> J[Format report]
    J --> K{Export format}
    K -->|PDF| L[Generate PDF]
    K -->|Excel| M[Generate Excel]
    K -->|Dashboard| N[Display interactive]
    L --> O[Add charts & graphs]
    M --> O
    N --> O
    O --> P{Schedule report?}
    P -->|Yes| Q[Set frequency]
    Q --> R[Save schedule]
    R --> S[Auto-send on schedule]
    P -->|No| T[One-time report]
    S --> U[Email to recipients]
    T --> U
    U --> V[Archive report]`
        },
        {
          title: 'Budget Planning & Control',
          description: 'Annual budget creation and monitoring',
          diagram: `graph TD
    A[Budget cycle starts] --> B[Review last year data]
    B --> C[Department heads submit requirements]
    C --> D[Finance team consolidates]
    D --> E[Categorize by heads]
    E --> F[Estimate revenues]
    F --> G[Estimate expenses]
    G --> H[Calculate surplus/deficit]
    H --> I{Balanced?}
    I -->|No| J[Adjust allocations]
    J --> E
    I -->|Yes| K[Create budget draft]
    K --> L[Principal reviews]
    L --> M{Approved?}
    M -->|No| N[Revise budget]
    N --> E
    M -->|Yes| O[Board approval]
    O --> P[Finalize budget]
    P --> Q[Allocate to departments]
    Q --> R[Monitor monthly spending]
    R --> S[Compare actual vs budget]
    S --> T{Variance?}
    T -->|Over budget| U[Alert HOD]
    U --> V[Request justification]
    V --> W[Approve or control]
    T -->|Within budget| X[Continue monitoring]
    W --> Y[Update forecast]
    X --> Y
    Y --> Z{Quarter end?}
    Z -->|Yes| AA[Generate variance report]
    Z -->|No| R`
        },
        {
          title: 'Vendor Management',
          description: 'Supplier registration and evaluation',
          diagram: `graph TD
    A[Vendor inquiry] --> B[Submit vendor details]
    B --> C[KYC verification]
    C --> D{Documents valid?}
    D -->|No| E[Request corrections]
    E --> B
    D -->|Yes| F[Create vendor profile]
    F --> G[Assign vendor ID]
    G --> H[Set payment terms]
    H --> I[Set credit limit]
    I --> J[Approve vendor]
    J --> K[Vendor active]
    K --> L[Receive quotation]
    L --> M[Compare with others]
    M --> N{Best quote?}
    N -->|Yes| O[Issue purchase order]
    N -->|No| P[Negotiate]
    P --> L
    O --> Q[Vendor delivers]
    Q --> R[Goods received note]
    R --> S[Quality check]
    S --> T{Acceptable?}
    T -->|No| U[Return to vendor]
    U --> V[Debit note]
    T -->|Yes| W[Accept goods]
    W --> X[Process invoice]
    X --> Y[Schedule payment]
    Y --> Z[Rate vendor performance]
    Z --> AA{Performance good?}
    AA -->|Yes| AB[Increase credit limit]
    AA -->|No| AC[Review or blacklist]`
        },
        {
          title: 'Purchase Order Management',
          description: 'Requisition to payment cycle',
          diagram: `graph TD
    A[Need identified] --> B[Create purchase requisition]
    B --> C[Specify items & quantity]
    C --> D[Estimate budget]
    D --> E{Budget available?}
    E -->|No| F[Request allocation]
    F --> G{Approved?}
    G -->|No| H[Reject requisition]
    G -->|Yes| I[Proceed]
    E -->|Yes| I
    I --> J[Get quotations]
    J --> K[Compare vendors]
    K --> L[Select best vendor]
    L --> M[Create purchase order]
    M --> N[HOD approval]
    N --> O{Approved?}
    O -->|No| P[Revise PO]
    P --> M
    O -->|Yes| Q[Send to vendor]
    Q --> R[Vendor confirms]
    R --> S[Track delivery]
    S --> T{Delivered?}
    T -->|Delayed| U[Follow up]
    U --> S
    T -->|Yes| V[Receive goods]
    V --> W[Inspect quality]
    W --> X{Quality OK?}
    X -->|No| Y[Raise complaint]
    Y --> Z[Return/replace]
    X -->|Yes| AA[Update inventory]
    AA --> AB[Match with invoice]
    AB --> AC[Process payment]`
        }
      ]
    },
    {
      category: 'AI Suite',
      flows: [
        {
          title: 'AI Classroom Assistant',
          description: 'Real-time teaching assistance',
          diagram: `graph TD
    A[Teacher starts class] --> B[AI assistant activated]
    B --> C[Monitor student engagement]
    C --> D{Student interaction}
    D -->|Question asked| E[AI analyzes question]
    E --> F[Generate response]
    F --> G[Teacher reviews]
    G --> H{Approve response?}
    H -->|Yes| I[Display to student]
    H -->|No| J[Modify response]
    J --> I
    D -->|Low engagement| K[AI detects pattern]
    K --> L[Suggest interactive activity]
    L --> M[Teacher implements]
    D -->|Concept difficulty| N[AI identifies struggle]
    N --> O[Recommend alternative explanation]
    O --> P[Provide visual aids]
    P --> Q[Generate examples]
    I --> R[Track student progress]
    M --> R
    Q --> R
    R --> S[Update analytics]
    S --> T[Generate insights]
    T --> U[Teacher dashboard]`
        },
        {
          title: 'Virtual Classroom Management',
          description: 'Online teaching session flow',
          diagram: `graph TD
    A[Schedule virtual class] --> B[Send meeting link]
    B --> C[Students join]
    C --> D[Attendance auto-marked]
    D --> E[Teacher shares screen]
    E --> F[Deliver content]
    F --> G{Interaction type}
    G -->|Quiz| H[Launch poll/quiz]
    H --> I[Students respond]
    I --> J[AI grades responses]
    J --> K[Display results]
    G -->|Discussion| L[Open chat]
    L --> M[Monitor participation]
    M --> N[AI flags inappropriate content]
    G -->|Breakout| O[Create breakout rooms]
    O --> P[Students collaborate]
    P --> Q[AI monitors groups]
    K --> R[Continue teaching]
    N --> R
    Q --> R
    R --> S{Recording?}
    S -->|Yes| T[Save recording]
    T --> U[Process video]
    U --> V[Generate transcript]
    V --> W[Extract key points]
    W --> X[Upload to library]
    S -->|No| Y[End session]
    X --> Y
    Y --> Z[Generate report]`
        },
        {
          title: 'AI Timetable Generator',
          description: 'Automated schedule optimization',
          diagram: `graph TD
    A[Input constraints] --> B[Define periods & timings]
    B --> C[List subjects per class]
    C --> D[Add teacher availability]
    D --> E[Set room allocations]
    E --> F[Define constraints]
    F --> G{Constraint types}
    G -->|Hard| H[Must-follow rules]
    G -->|Soft| I[Preferred rules]
    H --> J[AI processes constraints]
    I --> J
    J --> K[Generate initial solution]
    K --> L[Optimize allocation]
    L --> M{Conflicts found?}
    M -->|Yes| N[AI resolves conflicts]
    N --> O[Try alternative arrangement]
    O --> P{Resolved?}
    P -->|No| Q[Relax soft constraints]
    Q --> O
    P -->|Yes| R[Validate solution]
    M -->|No| R
    R --> S[Check teacher load balance]
    S --> T{Balanced?}
    T -->|No| U[Rebalance load]
    U --> L
    T -->|Yes| V[Preview timetable]
    V --> W{Approve?}
    W -->|No| X[Adjust manually]
    X --> L
    W -->|Yes| Y[Publish timetable]`
        },
        {
          title: 'AI Lesson Planner',
          description: 'Automated lesson plan generation',
          diagram: `graph TD
    A[Teacher selects topic] --> B[Choose subject & grade]
    B --> C[Set learning objectives]
    C --> D[Specify duration]
    D --> E[AI analyzes curriculum]
    E --> F[Identify prerequisite knowledge]
    F --> G[Generate lesson structure]
    G --> H{Lesson components}
    H -->|Introduction| I[Create hook/engagement]
    H -->|Main content| J[Break into chunks]
    H -->|Activities| K[Suggest exercises]
    H -->|Assessment| L[Generate questions]
    I --> M[Compile lesson plan]
    J --> M
    K --> M
    L --> M
    M --> N[Add teaching aids]
    N --> O[Suggest resources]
    O --> P[Create worksheets]
    P --> Q[Teacher reviews]
    Q --> R{Modifications needed?}
    R -->|Yes| S[Teacher edits]
    S --> T[AI learns preferences]
    T --> U[Update plan]
    R -->|No| U
    U --> V{Save as template?}
    V -->|Yes| W[Store in library]
    V -->|No| X[Save for class]
    W --> X
    X --> Y[Ready to teach]`
        },
        {
          title: 'AI Grading Assistant',
          description: 'Automated assessment and feedback',
          diagram: `graph TD
    A[Upload student submissions] --> B[AI scans documents]
    B --> C{Assignment type}
    C -->|MCQ| D[Auto-grade answers]
    D --> E[Calculate scores]
    C -->|Essay| F[Analyze content]
    F --> G[Check grammar & structure]
    G --> H[Evaluate arguments]
    H --> I[Compare with rubric]
    I --> J[Generate score]
    C -->|Math| K[Check solutions]
    K --> L[Verify steps]
    L --> M[Award partial credit]
    E --> N[Teacher reviews]
    J --> N
    M --> N
    N --> O{Approve scores?}
    O -->|Yes| P[Finalize grades]
    O -->|Adjust| Q[Modify scores]
    Q --> R[Document reason]
    R --> P
    P --> S[Generate feedback]
    S --> T[AI creates comments]
    T --> U[Personalize per student]
    U --> V{Custom feedback needed?}
    V -->|Yes| W[Teacher adds notes]
    V -->|No| X[Use AI feedback]
    W --> Y[Combine feedback]
    X --> Y
    Y --> Z[Send to students]`
        },
        {
          title: 'AI Comment Generator',
          description: 'Report card comment automation',
          diagram: `graph TD
    A[Select students] --> B[Fetch student data]
    B --> C[Analyze performance]
    C --> D{Data sources}
    D -->|Grades| E[Subject-wise performance]
    D -->|Attendance| F[Attendance patterns]
    D -->|Behavior| G[Conduct records]
    D -->|Participation| H[Activity involvement]
    E --> I[AI processes data]
    F --> I
    G --> I
    H --> I
    I --> J[Identify strengths]
    J --> K[Identify improvement areas]
    K --> L[Generate comment structure]
    L --> M{Comment style}
    M -->|Formal| N[Professional tone]
    M -->|Encouraging| O[Positive tone]
    M -->|Balanced| P[Mixed tone]
    N --> Q[Draft comments]
    O --> Q
    P --> Q
    Q --> R[Personalize per student]
    R --> S[Teacher reviews]
    S --> T{Edits needed?}
    T -->|Yes| U[Teacher modifies]
    U --> V[AI learns style]
    V --> W[Update comment]
    T -->|No| W
    W --> X{Approve all?}
    X -->|Yes| Y[Finalize for reports]
    X -->|No| Z[Review individually]
    Z --> S`
        },
        {
          title: 'Predictive Analytics Dashboard',
          description: 'Student performance prediction and intervention',
          diagram: `graph TD
    A[System collects data] --> B[Historical performance]
    B --> C[Current grades]
    C --> D[Attendance records]
    D --> E[Engagement metrics]
    E --> F[AI analyzes patterns]
    F --> G[Build prediction models]
    G --> H{Predict outcomes}
    H -->|Academic risk| I[Identify at-risk students]
    H -->|Performance trend| J[Forecast final grades]
    H -->|Dropout risk| K[Flag high-risk students]
    I --> L[Calculate risk score]
    J --> L
    K --> L
    L --> M{Risk level?}
    M -->|High| N[Immediate intervention]
    N --> O[Assign to counselor]
    O --> P[Create action plan]
    M -->|Medium| Q[Monitor closely]
    Q --> R[Weekly check-ins]
    M -->|Low| S[Continue normal support]
    P --> T[Track intervention impact]
    R --> T
    S --> T
    T --> U[Update predictions]
    U --> V[Generate insights report]
    V --> W[Dashboard visualization]
    W --> X[Stakeholder notifications]
    X --> Y{Effective intervention?}
    Y -->|Yes| Z[Document success]
    Y -->|No| AA[Revise strategy]
    AA --> P`
        }
      ]
    },
    {
      category: 'Administration',
      flows: [
        {
          title: 'School Settings Management',
          description: 'Configuring school parameters and preferences',
          diagram: `graph TD
    A[Admin opens settings] --> B{Setting category}
    B -->|Basic info| C[Update school details]
    C --> D[Modify name/address/contact]
    D --> E[Upload logo]
    E --> F[Set academic calendar]
    B -->|Academic| G[Configure year groups]
    G --> H[Define terms/semesters]
    H --> I[Set grading scale]
    I --> J[Configure subjects]
    B -->|Financial| K[Set fee structure]
    K --> L[Define payment methods]
    L --> M[Configure late fee rules]
    B -->|System| N[Email settings]
    N --> O[SMS gateway config]
    O --> P[Notification preferences]
    F --> Q[Save changes]
    J --> Q
    M --> Q
    P --> Q
    Q --> R{Validation passed?}
    R -->|No| S[Show errors]
    S --> B
    R -->|Yes| T[Apply settings]
    T --> U[Log configuration change]
    U --> V[Notify affected users]
    V --> W[Restart services if needed]`
        },
        {
          title: 'Module Features Configuration',
          description: 'Enabling/disabling school-specific features',
          diagram: `graph TD
    A[Admin opens module manager] --> B[View all modules]
    B --> C[Select module]
    C --> D{Action?}
    D -->|Enable| E[Activate module]
    E --> F[Configure module settings]
    F --> G[Set permissions]
    G --> H[Assign to roles]
    D -->|Disable| I[Confirm disable]
    I --> J{Data exists?}
    J -->|Yes| K[Warn about data]
    K --> L{Proceed?}
    L -->|No| B
    L -->|Yes| M[Deactivate module]
    J -->|No| M
    D -->|Configure| N[Open feature settings]
    N --> O[Modify parameters]
    O --> P[Test configuration]
    H --> Q[Apply changes]
    M --> Q
    P --> Q
    Q --> R{Changes valid?}
    R -->|No| S[Rollback]
    S --> B
    R -->|Yes| T[Update module registry]
    T --> U[Refresh menus]
    U --> V[Clear cache]
    V --> W[Notify users]`
        },
        {
          title: 'User Management Flow',
          description: 'Creating and managing user accounts',
          diagram: `graph TD
    A[Admin creates user] --> B[Enter user details]
    B --> C[Set username/email]
    C --> D[Generate password]
    D --> E[Assign roles]
    E --> F{Role type}
    F -->|Staff| G[Link to employee]
    F -->|Student| H[Link to student]
    F -->|Parent| I[Link to children]
    F -->|Admin| J[Set admin level]
    G --> K[Set permissions]
    H --> K
    I --> K
    J --> K
    K --> L[Define school access]
    L --> M{Multi-school?}
    M -->|Yes| N[Assign multiple schools]
    M -->|No| O[Assign single school]
    N --> P[Create user account]
    O --> P
    P --> Q{Send credentials?}
    Q -->|Yes| R[Email credentials]
    Q -->|No| S[Store securely]
    R --> T[User first login]
    S --> T
    T --> U[Force password change]
    U --> V[Account activated]
    V --> W{Deactivation needed?}
    W -->|Yes| X[Disable account]
    X --> Y[Revoke access]
    Y --> Z[Archive user data]`
        },
        {
          title: 'Permission Management',
          description: 'Role-based access control configuration',
          diagram: `graph TD
    A[Admin opens permissions] --> B[Select role]
    B --> C[View current permissions]
    C --> D{Action?}
    D -->|Modify module access| E[Select modules]
    E --> F[Set view/create/edit/delete]
    F --> G[Apply to role]
    D -->|Field-level| H[Select module]
    H --> I[Choose fields]
    I --> J[Set visible/editable/required]
    J --> G
    D -->|Custom permission| K[Define new permission]
    K --> L[Set permission scope]
    L --> M[Assign to resources]
    M --> G
    G --> N{Test permissions?}
    N -->|Yes| O[Simulate user view]
    O --> P{Correct?}
    P -->|No| Q[Adjust settings]
    Q --> E
    P -->|Yes| R[Save permissions]
    N -->|No| R
    R --> S[Invalidate cache]
    S --> T[Update all sessions]
    T --> U{Audit trail?}
    U -->|Yes| V[Log changes]
    V --> W[Generate report]
    U -->|No| X[Complete]
    W --> X`
        },
        {
          title: 'Master Data Management',
          description: 'Managing system reference data',
          diagram: `graph TD
    A[Admin opens master data] --> B{Data category}
    B -->|Academic| C[Year groups/Classes/Sections]
    B -->|HR| D[Departments/Designations]
    B -->|Finance| E[Fee heads/Account types]
    B -->|General| F[Categories/Tags]
    C --> G[View existing data]
    D --> G
    E --> G
    F --> G
    G --> H{Action?}
    H -->|Add| I[Create new entry]
    I --> J[Enter details]
    J --> K[Set sort order]
    K --> L[Mark as active]
    H -->|Edit| M[Select entry]
    M --> N[Modify data]
    N --> O[Save changes]
    H -->|Delete| P[Check dependencies]
    P --> Q{In use?}
    Q -->|Yes| R[Cannot delete]
    R --> S[Suggest deactivate]
    Q -->|No| T[Confirm deletion]
    T --> U[Delete entry]
    L --> V[Save to database]
    O --> V
    U --> V
    V --> W{Sync required?}
    W -->|Yes| X[Sync to dependent modules]
    W -->|No| Y[Complete]
    X --> Y
    Y --> Z[Refresh cache]`
        },
        {
          title: 'Data Integrity Testing',
          description: 'Validating database consistency',
          diagram: `graph TD
    A[Initiate integrity test] --> B[Select test scope]
    B --> C{Scope}
    C -->|Full system| D[Test all tables]
    C -->|Specific module| E[Test module tables]
    C -->|Custom| F[Select tables]
    D --> G[Run validation checks]
    E --> G
    F --> G
    G --> H{Check types}
    H -->|Orphan records| I[Find unlinked data]
    H -->|Duplicates| J[Identify duplicates]
    H -->|Missing required| K[Find null values]
    H -->|Invalid references| L[Check foreign keys]
    I --> M[Collect issues]
    J --> M
    K --> M
    L --> M
    M --> N{Issues found?}
    N -->|No| O[Generate clean report]
    N -->|Yes| P[List all issues]
    P --> Q{Auto-fix available?}
    Q -->|Yes| R[Suggest fixes]
    R --> S{Approve fixes?}
    S -->|Yes| T[Apply corrections]
    S -->|No| U[Manual review]
    Q -->|No| U
    T --> V[Verify corrections]
    U --> W[Create task list]
    V --> X[Generate report]
    W --> X
    O --> X
    X --> Y[Email to admin]
    Y --> Z[Archive test results]`
        },
        {
          title: 'Integration Management',
          description: 'Configuring third-party integrations',
          diagram: `graph TD
    A[Select integration] --> B{Integration type}
    B -->|Payment gateway| C[Configure payment API]
    B -->|SMS provider| D[Setup SMS gateway]
    B -->|Email service| E[Configure SMTP]
    B -->|Biometric| F[Connect biometric device]
    B -->|Learning platform| G[Setup LMS sync]
    C --> H[Enter API credentials]
    D --> H
    E --> H
    F --> H
    G --> H
    H --> I[Test connection]
    I --> J{Connected?}
    J -->|No| K[Debug connection]
    K --> L[Check credentials]
    L --> M{Resolved?}
    M -->|No| N[Contact support]
    M -->|Yes| O[Retry connection]
    O --> I
    J -->|Yes| P[Configure sync settings]
    P --> Q[Set sync frequency]
    Q --> R[Map data fields]
    R --> S[Test data flow]
    S --> T{Working?}
    T -->|No| U[Adjust mappings]
    U --> R
    T -->|Yes| V[Activate integration]
    V --> W[Schedule sync jobs]
    W --> X[Monitor integration]
    X --> Y{Issues detected?}
    Y -->|Yes| Z[Alert admin]
    Z --> AA[Troubleshoot]
    Y -->|No| AB[Continue]`
        },
        {
          title: 'Portal Management',
          description: 'Managing student/parent/teacher portals',
          diagram: `graph TD
    A[Configure portal] --> B{Portal type}
    B -->|Student| C[Student portal settings]
    B -->|Parent| D[Parent portal settings]
    B -->|Teacher| E[Teacher portal settings]
    C --> F[Define visible modules]
    D --> F
    E --> F
    F --> G[Set dashboard widgets]
    G --> H[Configure notifications]
    H --> I[Customize branding]
    I --> J[Set theme colors]
    J --> K[Upload portal logo]
    K --> L[Define menu structure]
    L --> M{Permission check}
    M -->|By role| N[Filter by user role]
    M -->|By module| O[Filter by enabled modules]
    N --> P[Preview portal]
    O --> P
    P --> Q{Approved?}
    Q -->|No| R[Modify settings]
    R --> F
    Q -->|Yes| S[Publish changes]
    S --> T[Clear portal cache]
    T --> U[Notify users]
    U --> V{Feedback received?}
    V -->|Yes| W[Review feedback]
    W --> X{Improvements needed?}
    X -->|Yes| R
    X -->|No| Y[Monitor usage]
    V -->|No| Y`
        }
      ]
    },
    {
      category: 'Data Operations & Performance',
      flows: [
        {
          title: 'Data Fetching with React Query',
          description: 'Standard data fetching pattern using TanStack Query',
          diagram: `graph TD
    A[Component mounts] --> B[useQuery hook called]
    B --> C[Check React Query cache]
    C --> D{Data in cache?}
    D -->|Yes & Fresh| E[Return cached data]
    D -->|No or Stale| F[Set loading state]
    F --> G[Execute queryFn]
    G --> H[Supabase client query]
    H --> I[Apply filters/sorting]
    I --> J{Query successful?}
    J -->|No| K[Set error state]
    J -->|Yes| L[Update cache]
    L --> M[Return data]
    M --> N[Component re-renders]
    K --> N`
        },
        {
          title: 'Data Mutation Flow',
          description: 'Creating, updating, or deleting data with optimistic updates',
          diagram: `graph TD
    A[User triggers action] --> B[Call mutate from useMutation]
    B --> C[Optimistic update - Update cache immediately]
    C --> D[Show optimistic UI]
    D --> E[Execute mutationFn]
    E --> F[Supabase insert/update/delete]
    F --> G{Mutation successful?}
    G -->|No| H[Revert optimistic update]
    H --> I[Show error toast]
    I --> J[Cache restored to previous state]
    G -->|Yes| K[Invalidate related queries]
    K --> L[Refetch affected data]
    L --> M[Show success toast]
    M --> N[UI reflects real server state]`
        },
        {
          title: 'Real-time Subscription Flow',
          description: 'Supabase real-time updates for collaborative features',
          diagram: `graph TD
    A[Component mounts] --> B[Setup Supabase channel]
    B --> C[Subscribe to table changes]
    C --> D[Filter by school_id or user_id]
    D --> E[Register event handlers]
    E --> F[Component renders with initial data]
    F --> G[Database change occurs]
    G --> H[Postgres triggers notification]
    H --> I[Supabase Realtime broadcasts event]
    I --> J{Event matches filter?}
    J -->|No| F
    J -->|Yes| K[Event handler executes]
    K --> L[Update local state]
    L --> M[Invalidate React Query cache]
    M --> N[Component re-renders]
    N --> O[UI shows updated data]
    O --> P[Component unmounts]
    P --> Q[Unsubscribe from channel]`
        },
        {
          title: 'File Upload Flow',
          description: 'Secure file upload with storage policies',
          diagram: `graph TD
    A[User selects file] --> B[Validate file type & size]
    B --> C{Valid?}
    C -->|No| D[Show error message]
    C -->|Yes| E[Get current user & school]
    E --> F[Generate unique filename]
    F --> G[Construct storage path]
    G --> H[user_id/school_id/timestamp_filename]
    H --> I[Upload to Supabase Storage]
    I --> J[Check storage policies]
    J --> K{Policy allows?}
    K -->|No| L[Return 403 error]
    L --> D
    K -->|Yes| M[Store file]
    M --> N[Generate public URL]
    N --> O[Create file metadata record]
    O --> P[Store in files table]
    P --> Q[Return file URL & ID]
    Q --> R[Update parent record with file_id]
    R --> S[Show success message]`
        },
        {
          title: 'Query Optimization Flow',
          description: 'How data fetching is optimized for performance',
          diagram: `graph TD
    A[Component needs data] --> B[Check React Query cache]
    B --> C{Data cached?}
    C -->|Yes & Fresh| D[Return immediately]
    C -->|No or Stale| E[Check if query in flight]
    E --> F{Already fetching?}
    F -->|Yes| G[Wait for existing request]
    F -->|No| H[Start new request]
    H --> I[Use Supabase query]
    I --> J[Apply select to limit columns]
    J --> K[Add filters for school/user]
    K --> L[Add pagination limit]
    L --> M[Add indexes hint if available]
    M --> N[Execute query]
    N --> O[Cache result with TTL]
    O --> P[Return data]
    G --> P
    D --> Q[Trigger background revalidation if needed]`
        },
        {
          title: 'Error Handling Flow',
          description: 'How errors are caught and displayed to users',
          diagram: `graph TD
    A[API call initiated] --> B[Try block execution]
    B --> C{Error occurs?}
    C -->|No| D[Return success data]
    C -->|Yes| E[Catch error]
    E --> F{Error type?}
    F -->|Network Error| G[Check internet connection]
    G --> H[Show offline message]
    F -->|Auth Error 401| I[Session expired]
    I --> J[Clear local session]
    J --> K[Redirect to login]
    F -->|Permission Error 403| L[Show access denied]
    F -->|Not Found 404| M[Show not found message]
    F -->|Server Error 5xx| N[Log to error tracking]
    N --> O[Show generic error]
    F -->|Validation Error| P[Show field errors]
    H --> Q[Log error details]
    L --> Q
    M --> Q
    O --> Q
    P --> Q
    Q --> R[Display toast notification]
    R --> S[Allow retry]`
        },
        {
          title: 'Session Management Flow',
          description: 'Handling user sessions and expiry',
          diagram: `graph TD
    A[User active in app] --> B[Make API request]
    B --> C[Check session validity]
    C --> D{Session valid?}
    D -->|Yes| E[Process request]
    D -->|No| F[Session expired]
    F --> G[Clear localStorage]
    G --> H[Reset auth state]
    H --> I[Save current route]
    I --> J[Redirect to /auth]
    J --> K[Show session expired message]
    K --> L[User re-authenticates]
    L --> M[New session created]
    M --> N[Restore saved route]
    N --> O[Redirect to original page]
    O --> P[Resume user activity]`
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Comprehensive Technical Flowcharts
        </CardTitle>
        <CardDescription>
          Complete visual documentation of all 60+ modules and system flows. Each flowchart represents 
          the exact technical implementation with decision points, data flows, and integration points.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {flowcharts.map((section, idx) => (
            <AccordionItem key={idx} value={`flowchart-${idx}`}>
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  {section.category}
                  <Badge variant="outline">{section.flows.length} flows</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {section.flows.map((flow, flowIdx) => (
                    <Card key={flowIdx}>
                      <CardHeader>
                        <CardTitle className="text-base">{flow.title}</CardTitle>
                        <CardDescription>{flow.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => copyToClipboard(flow.diagram, flow.title)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                            <pre className="mermaid">
{flow.diagram}
                            </pre>
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

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">How to Read These Flowcharts</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Rectangles</strong>: Process steps or actions</li>
            <li><strong>Diamonds</strong>: Decision points (conditions)</li>
            <li><strong>Arrows</strong>: Flow direction and data movement</li>
            <li><strong>Labels on arrows</strong>: Conditions or data being passed</li>
          </ul>
          <div className="mt-4 p-3 bg-background rounded border">
            <p className="text-sm font-medium">Coverage Summary:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>✅ Authentication & Authorization (4 flows)</li>
              <li>✅ Academic Operations - Admissions (3 flows)</li>
              <li>✅ Academic Operations - Curriculum & Teaching (4 flows)</li>
              <li>✅ Academic Operations - Assessments (5 flows)</li>
              <li>✅ Student Services - Core Operations (5 flows)</li>
              <li>✅ Student Services - Welfare & Safety (5 flows)</li>
              <li>✅ Staff & HR Operations (6 flows)</li>
              <li>✅ Finance & Operations (6 flows)</li>
              <li>✅ AI Suite (7 flows)</li>
              <li>✅ Administration (8 flows)</li>
              <li>✅ Data Operations & Performance (7 flows)</li>
            </ul>
            <p className="text-sm font-semibold mt-3">Total: 60 comprehensive flowcharts covering the entire codebase</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
