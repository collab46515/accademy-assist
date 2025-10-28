import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CommonPatterns() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Common Patterns & Best Practices
          </CardTitle>
          <CardDescription>
            Learn the recommended patterns and avoid common pitfalls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="good" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="good">✓ Best Practices</TabsTrigger>
              <TabsTrigger value="bad">✗ Anti-patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="good" className="space-y-6 mt-6">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Component Organization</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✓ DO: Keep components small and focused</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Good: Single responsibility
function StudentCard({ student }: { student: Student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.first_name} {student.last_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentDetails student={student} />
      </CardContent>
    </Card>
  );
}

function StudentDetails({ student }: { student: Student }) {
  return (
    <div className="space-y-2">
      <p>Email: {student.email}</p>
      <p>Class: {student.form_class}</p>
    </div>
  );
}`}</pre>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Data Fetching with React Query</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✓ DO: Use React Query for server state</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Good: Proper caching and error handling
export function useStudents(schoolId: string) {
  return useQuery({
    queryKey: ['students', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId);
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Usage
function StudentList({ schoolId }: { schoolId: string }) {
  const { data, isLoading, error } = useStudents(schoolId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{/* Render students */}</div>;
}`}</pre>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Type Safety</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✓ DO: Use TypeScript types from database</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Good: Import types from generated schema
import { Database } from '@/integrations/supabase/types';

type Student = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];
type StudentUpdate = Database['public']['Tables']['students']['Update'];

// Use in component
function StudentForm({ 
  student, 
  onSave 
}: { 
  student?: Student; 
  onSave: (data: StudentInsert) => void;
}) {
  // Type-safe form handling
}`}</pre>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Error Handling</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✓ DO: Handle errors gracefully with user feedback</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Good: Comprehensive error handling
const mutation = useMutation({
  mutationFn: async (data: StudentInsert) => {
    const { data: result, error } = await supabase
      .from('students')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      // Log for debugging
      console.error('Student creation error:', error);
      
      // User-friendly error message
      if (error.code === '23505') {
        throw new Error('Student number already exists');
      }
      
      throw new Error(error.message || 'Failed to create student');
    }
    
    return result;
  },
  onSuccess: () => {
    toast.success('Student created successfully');
    queryClient.invalidateQueries({ queryKey: ['students'] });
  },
  onError: (error) => {
    toast.error('Failed to create student', {
      description: error.message,
    });
  },
});`}</pre>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Security Patterns</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✓ DO: Always check permissions at multiple layers</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Good: Multi-layer security
// 1. Database RLS Policy
CREATE POLICY "Students viewable by school staff"
ON students FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND school_id = students.school_id
    AND role IN ('teacher', 'school_admin')
    AND is_active = true
  )
);

// 2. Backend validation in Edge Function
export async function handler(req: Request) {
  const user = await getAuthUser(req);
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Check role
  const hasAccess = await checkRole(user.id, 'teacher');
  if (!hasAccess) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with operation
}

// 3. Frontend permission check
function StudentActions() {
  const { hasModulePermission } = usePermissions();
  
  if (!hasModulePermission('Students', 'delete')) {
    return null; // Don't show delete button
  }
  
  return <Button variant="destructive">Delete</Button>;
}`}</pre>
                  </div>
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="bad" className="space-y-6 mt-6">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Component Anti-pattern</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✗ DON'T: Create massive components</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Bad: Too many responsibilities
function StudentPage() {
  // 500+ lines of code
  // Fetching data
  // Form handling
  // Validation
  // Permissions
  // UI rendering
  // Business logic
  
  // This is too much for one component!
  // Split into smaller, focused components
}`}</pre>
                    <p className="text-sm mt-2">
                      <strong>Problem:</strong> Hard to maintain, test, and reuse. <br />
                      <strong>Solution:</strong> Break into StudentList, StudentForm, StudentDetails, etc.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>State Management Anti-pattern</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✗ DON'T: Store server data in useState</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Bad: Manual state management for server data
const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  async function fetchStudents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) throw error;
      setStudents(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }
  
  fetchStudents();
}, []); // No caching, no invalidation, manual refetch

// This loses data when component unmounts!
// No automatic refetching or caching`}</pre>
                    <p className="text-sm mt-2">
                      <strong>Problem:</strong> No caching, manual refetch logic, loses data on unmount <br />
                      <strong>Solution:</strong> Use React Query (useQuery) for server state
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Security Anti-pattern</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✗ DON'T: Check roles only in frontend</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Bad: Client-side only security
const user = await supabase.auth.getUser();
const isAdmin = localStorage.getItem('role') === 'admin'; // ❌

if (isAdmin) {
  // Show admin panel
  // User can manipulate localStorage!
}

// Bad: No RLS policy, trusting client
const { data } = await supabase
  .from('students')
  .select('*'); // ❌ No RLS = Anyone can access all data!

// Bad: Storing sensitive data in localStorage
localStorage.setItem('user_role', role); // ❌ Easily manipulated
localStorage.setItem('permissions', JSON.stringify(perms)); // ❌`}</pre>
                    <p className="text-sm mt-2">
                      <strong>Problem:</strong> Client-side checks can be bypassed, localStorage is editable <br />
                      <strong>Solution:</strong> Always enforce security with RLS policies and server-side checks
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Styling Anti-pattern</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✗ DON'T: Use hardcoded colors</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Bad: Direct colors everywhere
<div className="bg-white text-black border-gray-300">
  <h1 className="text-blue-600">Title</h1>
  <p className="text-gray-700">Content</p>
</div>

// Bad: Inline styles
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  Content
</div>

// This breaks dark mode and theme consistency!`}</pre>
                    <p className="text-sm mt-2">
                      <strong>Problem:</strong> Breaks theming, inconsistent design, no dark mode support <br />
                      <strong>Solution:</strong> Use semantic tokens from index.css (bg-background, text-foreground, etc.)
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error Handling Anti-pattern</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <p className="font-semibold">✗ DON'T: Silent failures</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{`// Bad: Swallowing errors
try {
  await createStudent(data);
} catch (error) {
  // Nothing happens - user has no idea it failed!
}

// Bad: Generic error messages
catch (error) {
  toast.error('Something went wrong'); // ❌ Not helpful
}

// Bad: Console.log only
catch (error) {
  console.log(error); // ❌ User doesn't see this
}`}</pre>
                    <p className="text-sm mt-2">
                      <strong>Problem:</strong> Users don't know what happened, can't take action <br />
                      <strong>Solution:</strong> Show specific, actionable error messages to users
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Critical Gotchas
          </CardTitle>
          <CardDescription>
            Common pitfalls that can cause serious issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>RLS Policy Recursion</AlertTitle>
            <AlertDescription>
              If an RLS policy queries the same table (or related table with RLS), you'll get infinite recursion.
              <strong className="block mt-2">Solution:</strong> Use SECURITY DEFINER functions that bypass RLS for the check.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Query Key Invalidation</AlertTitle>
            <AlertDescription>
              Not invalidating React Query cache after mutations leads to stale data.
              <strong className="block mt-2">Solution:</strong> Always call queryClient.invalidateQueries() after successful mutations.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>School Context Missing</AlertTitle>
            <AlertDescription>
              Queries without school_id filter can expose data from other schools.
              <strong className="block mt-2">Solution:</strong> Always filter by school_id except for super_admin queries.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Type Mismatches</AlertTitle>
            <AlertDescription>
              Database schema changes without regenerating types causes runtime errors.
              <strong className="block mt-2">Solution:</strong> Run `supabase gen types typescript` after every schema change.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
