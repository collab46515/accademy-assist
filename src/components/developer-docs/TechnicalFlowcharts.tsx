import React, { useEffect, useRef } from 'react';
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
          title: 'RBAC Context Flow',
          description: 'Role-based access control initialization and updates',
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
        }
      ]
    },
    {
      category: 'Data Operations',
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
        }
      ]
    },
    {
      category: 'School Context & Multi-tenancy',
      flows: [
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
        },
        {
          title: 'Module Access Control Flow',
          description: 'How module visibility and permissions are determined',
          diagram: `graph TD
    A[User navigates app] --> B[Get currentSchool from useRBAC]
    B --> C[Get user roles for current school]
    C --> D[Fetch all modules from modules table]
    D --> E[Fetch role_module_permissions]
    E --> F[Filter active modules]
    F --> G{For each module}
    G --> H[Check role_module_permissions]
    H --> I{User role has can_view?}
    I -->|No| J[Module hidden]
    I -->|Yes| K[Module visible]
    K --> L[Check specific permissions]
    L --> M[can_create, can_edit, can_delete, can_approve]
    M --> N[Render module with appropriate actions]
    J --> O[Skip module]
    N --> P[User sees allowed modules only]
    O --> P`
        }
      ]
    },
    {
      category: 'Module-Specific Flows',
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
          title: 'Assignment Submission & Grading',
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
          title: 'Attendance Marking Flow',
          description: 'Daily attendance recording and tracking',
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
    S --> R`
        },
        {
          title: 'Grade Report Generation',
          description: 'End of term report card creation',
          diagram: `graph TD
    A[Teacher initiates report] --> B[Select term & students]
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
    P --> Q{Approval required?}
    Q -->|Yes| R[Send to HOD for review]
    R --> S{HOD approves?}
    S -->|No| T[Return for revision]
    T --> K
    S -->|Yes| U[Mark as approved]
    Q -->|No| U
    U --> V[Generate PDF]
    V --> W[Store in reports bucket]
    W --> X[Notify parent]
    X --> Y[Report accessible in portal]`
        }
      ]
    },
    {
      category: 'File Operations',
      flows: [
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
          title: 'File Download & Access Control',
          description: 'Checking permissions before serving files',
          diagram: `graph TD
    A[User requests file] --> B[Get file metadata]
    B --> C[Get file owner & school]
    C --> D[Get current user]
    D --> E[Check user roles]
    E --> F{User authorized?}
    F -->|Super Admin| G[Allow access]
    F -->|Same School| H{Check role permissions}
    F -->|Different School| I[Deny access]
    H --> J{Has view permission?}
    J -->|Yes| G
    J -->|No| I
    G --> K[Generate signed URL]
    K --> L[Set expiration time]
    L --> M[Return download link]
    M --> N[Browser downloads file]
    I --> O[Show 403 error]`
        }
      ]
    },
    {
      category: 'Error Handling & Edge Cases',
      flows: [
        {
          title: 'API Error Handling Flow',
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
          title: 'Session Expiry & Re-authentication',
          description: 'Handling expired sessions gracefully',
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
    },
    {
      category: 'Performance Optimization',
      flows: [
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
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Technical Flowcharts
        </CardTitle>
        <CardDescription>
          Visual representation of all major technical flows in the system using Mermaid diagrams.
          These flowcharts show the complete execution paths, decision points, and data flows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {flowcharts.map((section, idx) => (
            <AccordionItem key={idx} value={`flowchart-${idx}`}>
              <AccordionTrigger className="text-lg font-semibold">
                {section.category}
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
            <li><strong>Arrows</strong>: Flow direction</li>
            <li><strong>Labels on arrows</strong>: Conditions or data being passed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
