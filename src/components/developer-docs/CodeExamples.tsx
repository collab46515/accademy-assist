import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Code, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CodeExamples() {
  const examples = [
    {
      category: 'Authentication & Sessions',
      examples: [
        {
          title: 'Protected Route Component',
          description: 'Create a component that requires authentication and specific role',
          code: `import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: string;
}) {
  const { user, loading } = useAuth();
  const { hasRole, isSuperAdmin } = useRBAC();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole) && !isSuperAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Usage in App.tsx
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="super_admin">
    <AdminPanel />
  </ProtectedRoute>
} />`
        },
        {
          title: 'Custom Hook for Data Fetching with Auth',
          description: 'Fetch data with proper error handling and authentication',
          code: `import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useStudents(schoolId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['students', schoolId],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select(\`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        \`)
        .order('created_at', { ascending: false });

      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!user, // Only run when user is authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

// Usage in component
function StudentList() {
  const { data: students, isLoading, error } = useStudents();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      {students?.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}`
        }
      ]
    },
    {
      category: 'Data Mutations & Form Handling',
      examples: [
        {
          title: 'Create Student with Form Validation',
          description: 'Complete form with validation, submission, and error handling',
          code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const studentSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  date_of_birth: z.string(),
  year_group: z.string().min(1, 'Year group is required'),
  form_class: z.string().min(1, 'Form class is required'),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function CreateStudentForm({ schoolId }: { schoolId: string }) {
  const queryClient = useQueryClient();
  
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      date_of_birth: '',
      year_group: '',
      form_class: '',
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const { data: result, error } = await supabase.rpc(
        'create_student_with_user',
        {
          student_data: {
            ...data,
            password: 'TempPass123!', // Temporary password
          },
          school_id: schoolId,
        }
      );

      if (error) throw error;
      return result;
    },
    onSuccess: (result) => {
      toast.success(\`Student created successfully!\`, {
        description: \`Email: \${result.email}, Password: \${result.temp_password}\`,
      });
      
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
      
      // Reset form
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create student', {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: StudentFormData) => {
    createStudentMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add other fields similarly */}
        
        <Button 
          type="submit" 
          disabled={createStudentMutation.isPending}
        >
          {createStudentMutation.isPending ? 'Creating...' : 'Create Student'}
        </Button>
      </form>
    </Form>
  );
}`
        },
        {
          title: 'Optimistic Updates for Better UX',
          description: 'Update UI immediately before server confirms',
          code: `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      studentId, 
      status 
    }: { 
      studentId: string; 
      status: string;
    }) => {
      const { error } = await supabase
        .from('students')
        .update({ status })
        .eq('id', studentId);

      if (error) throw error;
    },
    
    // Optimistic update
    onMutate: async ({ studentId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['students'] });

      // Snapshot previous value
      const previousStudents = queryClient.getQueryData(['students']);

      // Optimistically update to new value
      queryClient.setQueryData(['students'], (old: any) => {
        return old?.map((student: any) =>
          student.id === studentId
            ? { ...student, status }
            : student
        );
      });

      // Return context with snapshot
      return { previousStudents };
    },
    
    // On error, rollback to previous value
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['students'],
        context?.previousStudents
      );
      toast.error('Failed to update status');
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}`
        }
      ]
    },
    {
      category: 'Permission Checking',
      examples: [
        {
          title: 'Component with Permission-Based Rendering',
          description: 'Show/hide UI elements based on user permissions',
          code: `import { usePermissions } from '@/hooks/usePermissions';
import { useRBAC } from '@/hooks/useRBAC';

export function StudentActions({ student }: { student: Student }) {
  const { hasModulePermission } = usePermissions();
  const { isSuperAdmin } = useRBAC();

  const canEdit = hasModulePermission('Students', 'edit');
  const canDelete = hasModulePermission('Students', 'delete');
  const canViewGrades = hasModulePermission('Gradebook', 'view');

  return (
    <div className="flex gap-2">
      {canViewGrades && (
        <Button variant="outline" onClick={() => viewGrades(student.id)}>
          View Grades
        </Button>
      )}
      
      {canEdit && (
        <Button variant="outline" onClick={() => editStudent(student.id)}>
          Edit
        </Button>
      )}
      
      {(canDelete || isSuperAdmin()) && (
        <Button 
          variant="destructive" 
          onClick={() => deleteStudent(student.id)}
        >
          Delete
        </Button>
      )}
    </div>
  );
}

// Alternative: Using guard component
export function PermissionGate({
  children,
  module,
  action,
  fallback = null,
}: {
  children: React.ReactNode;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete';
  fallback?: React.ReactNode;
}) {
  const { hasModulePermission } = usePermissions();

  if (!hasModulePermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage
<PermissionGate module="Students" action="delete">
  <Button variant="destructive">Delete Student</Button>
</PermissionGate>`
        }
      ]
    },
    {
      category: 'Real-time Subscriptions',
      examples: [
        {
          title: 'Subscribe to Real-time Updates',
          description: 'Listen to database changes in real-time',
          code: `import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRealtimeStudents(schoolId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'students',
          filter: \`school_id=eq.\${schoolId}\`,
        },
        (payload) => {
          console.log('Change received!', payload);

          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['students', schoolId] });

          // Show notification
          if (payload.eventType === 'INSERT') {
            toast.info('New student added');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Student updated');
          } else if (payload.eventType === 'DELETE') {
            toast.info('Student removed');
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [schoolId, queryClient]);
}

// Usage in component
function StudentList({ schoolId }: { schoolId: string }) {
  const { data: students } = useStudents(schoolId);
  
  // Enable real-time updates
  useRealtimeStudents(schoolId);

  return (
    <div>
      {students?.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}`
        }
      ]
    },
    {
      category: 'File Upload & Storage',
      examples: [
        {
          title: 'Upload File to Supabase Storage',
          description: 'Handle file uploads with progress tracking',
          code: `import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    bucket: string,
    path: string
  ): Promise<string> => {
    setUploading(true);
    setProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${path}/\${Date.now()}.\${fileExt}\`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProgress(100);
      toast.success('File uploaded successfully');
      
      return publicUrl;
    } catch (error) {
      toast.error('Failed to upload file');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
}

// Usage in component
function DocumentUpload({ studentId }: { studentId: string }) {
  const { uploadFile, uploading, progress } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(
        file,
        'application-documents',
        \`students/\${studentId}\`
      );

      // Save URL to database
      await supabase
        .from('student_documents')
        .insert({
          student_id: studentId,
          document_url: url,
          document_name: file.name,
        });

      toast.success('Document uploaded and saved');
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-secondary h-2 rounded">
            <div
              className="bg-primary h-2 rounded transition-all"
              style={{ width: \`\${progress}%\` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
}`
        }
      ]
    }
  ];

  const copyToClipboard = (code: string, title: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${title}" to clipboard`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Code Examples & Patterns
          </CardTitle>
          <CardDescription>
            Real working code examples for common tasks and patterns used throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {examples.map((category, catIndex) => (
              <AccordionItem key={catIndex} value={`category-${catIndex}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-primary" />
                    {category.category}
                    <Badge variant="secondary">{category.examples.length} examples</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {category.examples.map((example, exIndex) => (
                      <Card key={exIndex} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{example.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {example.description}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(example.code, example.title)}
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto">
                            {example.code}
                          </pre>
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
