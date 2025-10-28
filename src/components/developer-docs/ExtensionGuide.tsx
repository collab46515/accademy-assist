import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Rocket, Database, Code, FileCode, Settings } from 'lucide-react';

export function ExtensionGuide() {
  const recipes = [
    {
      title: 'Adding a New Module',
      icon: Rocket,
      difficulty: 'Intermediate',
      estimatedTime: '2-4 hours',
      steps: [
        {
          step: 1,
          title: 'Create Database Tables',
          description: 'Design and create the necessary database schema',
          code: `-- Example: Creating an Events module
-- File: supabase/migrations/YYYYMMDDHHMMSS_create_events.sql

CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time,
  end_time time,
  location text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view events in their school"
ON public.events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND school_id = events.school_id
    AND is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can create events"
ON public.events FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND school_id = events.school_id
    AND role IN ('school_admin', 'super_admin')
    AND is_active = true
  )
);

-- Add to modules table
INSERT INTO modules (name, description, icon, category)
VALUES (
  'Events',
  'School event management',
  'Calendar',
  'Administration'
);`,
          notes: [
            'Always enable RLS on new tables',
            'Create policies for each operation (SELECT, INSERT, UPDATE, DELETE)',
            'Add foreign keys for referential integrity',
            'Include created_at and updated_at timestamps',
          ]
        },
        {
          step: 2,
          title: 'Generate TypeScript Types',
          description: 'Update types to include new tables',
          code: `# Run in terminal
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Or if using remote Supabase
supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts`,
          notes: [
            'Run this after every database schema change',
            'Commit the generated types to version control',
            'Types file should not be edited manually'
          ]
        },
        {
          step: 3,
          title: 'Create Custom Hook',
          description: 'Build a hook for data fetching and mutations',
          code: `// File: src/hooks/useEvents.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];

export function useEvents(schoolId: string) {
  return useQuery({
    queryKey: ['events', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(\`
          *,
          creator:created_by (
            first_name,
            last_name
          )
        \`)
        .eq('school_id', schoolId)
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Event created successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error('Failed to create event', {
        description: error.message,
      });
    },
  });
}`,
          notes: [
            'Use React Query for server state management',
            'Always invalidate queries after mutations',
            'Include related data with .select() joins',
            'Export types for component usage'
          ]
        },
        {
          step: 4,
          title: 'Create Components',
          description: 'Build UI components for the module',
          code: `// File: src/components/events/EventCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

type Event = Database['public']['Tables']['events']['Row'];

export function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {event.title}
          <Badge>{format(new Date(event.event_date), 'MMM dd')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          {format(new Date(event.event_date), 'PPP')}
        </div>
        
        {event.start_time && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            {event.start_time} - {event.end_time}
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// File: src/components/events/CreateEventDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useCreateEvent } from '@/hooks/useEvents';

export function CreateEventDialog({ 
  open, 
  onOpenChange, 
  schoolId 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}) {
  const form = useForm();
  const createEvent = useCreateEvent();
  
  const onSubmit = (data: any) => {
    createEvent.mutate(
      { ...data, school_id: schoolId },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input {...form.register('title')} placeholder="Event title" />
          <Input {...form.register('event_date')} type="date" />
          {/* Add more form fields */}
          
          <Button type="submit" disabled={createEvent.isPending}>
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}`,
          notes: [
            'Keep components small and reusable',
            'Use shadcn/ui components for consistency',
            'Extract forms into separate components',
            'Use semantic tokens for styling'
          ]
        },
        {
          step: 5,
          title: 'Create Page Component',
          description: 'Build the main page that uses the components',
          code: `// File: src/pages/EventsPage.tsx
import { useState } from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EventCard } from '@/components/events/EventCard';
import { CreateEventDialog } from '@/components/events/CreateEventDialog';

export default function EventsPage() {
  const { currentSchool } = useRBAC();
  const { data: events, isLoading } = useEvents(currentSchool?.id || '');
  const [createOpen, setCreateOpen] = useState(false);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">School Events</h1>
          <p className="text-muted-foreground">
            View and manage upcoming school events
          </p>
        </div>
        
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events?.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      
      <CreateEventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        schoolId={currentSchool?.id || ''}
      />
    </div>
  );
}`,
          notes: [
            'Use current school from useRBAC()',
            'Handle loading and error states',
            'Follow consistent layout patterns',
            'Add proper heading hierarchy for SEO'
          ]
        },
        {
          step: 6,
          title: 'Add Route',
          description: 'Register the new route in App.tsx',
          code: `// File: src/App.tsx
import EventsPage from '@/pages/EventsPage';

// Inside the Routes component
<Route 
  path="/events" 
  element={
    <ProtectedRoute>
      <EventsPage />
    </ProtectedRoute>
  } 
/>`,
          notes: [
            'Wrap with ProtectedRoute if authentication required',
            'Add requiredRole prop if specific role needed',
            'Use nested routes for sub-pages if needed'
          ]
        },
        {
          step: 7,
          title: 'Add to Navigation',
          description: 'Add menu item to sidebar',
          code: `// File: src/components/layout/AppSidebar.tsx
import { Calendar } from 'lucide-react';

// Add to appropriate section
{
  title: 'Events',
  url: '/events',
  icon: Calendar,
},`,
          notes: [
            'Choose appropriate Lucide icon',
            'Place in logical section',
            'Permission checks handled by module visibility'
          ]
        },
        {
          step: 8,
          title: 'Configure Permissions',
          description: 'Set up role permissions for the module',
          code: `-- Add permissions for the new module
INSERT INTO role_module_permissions (
  role, module_id, can_view, can_create, can_edit, can_delete
) VALUES
  ('super_admin', 
   (SELECT id FROM modules WHERE name = 'Events'), 
   true, true, true, true),
  ('school_admin', 
   (SELECT id FROM modules WHERE name = 'Events'), 
   true, true, true, true),
  ('teacher', 
   (SELECT id FROM modules WHERE name = 'Events'), 
   true, false, false, false),
  ('student', 
   (SELECT id FROM modules WHERE name = 'Events'), 
   true, false, false, false);`,
          notes: [
            'Define permissions for each role',
            'Consider view vs. manage permissions',
            'Can be adjusted later via Permission Management page'
          ]
        }
      ]
    },
    {
      title: 'Adding a New Role',
      icon: Settings,
      difficulty: 'Advanced',
      estimatedTime: '1-2 hours',
      steps: [
        {
          step: 1,
          title: 'Update Enum Type',
          description: 'Add new role to app_role enum',
          code: `-- Add new role to enum
ALTER TYPE app_role ADD VALUE 'counselor';

-- Note: This is permanent and cannot be rolled back easily
-- Consider carefully before adding new roles`,
          notes: [
            'Enum values cannot be removed once added',
            'Plan role names carefully',
            'Document the purpose of each role'
          ]
        },
        {
          step: 2,
          title: 'Create RLS Policies',
          description: 'Add policies for the new role',
          code: `-- Example: Counselor can view students but not edit
CREATE POLICY "Counselors can view students"
ON students FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND school_id = students.school_id
    AND role = 'counselor'
    AND is_active = true
  )
);`,
          notes: [
            'Add policies for each table the role should access',
            'Define clear boundaries for what each role can do',
            'Test policies thoroughly'
          ]
        },
        {
          step: 3,
          title: 'Update Permission Management',
          description: 'Add default permissions for the role',
          code: `-- Insert default permissions for counselor role
INSERT INTO role_module_permissions (role, module_id, can_view, can_create)
SELECT 'counselor', id, true, false
FROM modules
WHERE name IN ('Students', 'Student Welfare', 'Behavior Tracking');`,
          notes: [
            'Define which modules the role can access',
            'Set appropriate CRUD permissions',
            'Can be fine-tuned later via UI'
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Extension Recipes
          </CardTitle>
          <CardDescription>
            Step-by-step guides for extending the system with new functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {recipes.map((recipe, index) => {
              const Icon = recipe.icon;
              return (
                <AccordionItem key={index} value={`recipe-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      {recipe.title}
                      <Badge variant={recipe.difficulty === 'Advanced' ? 'destructive' : 'secondary'}>
                        {recipe.difficulty}
                      </Badge>
                      <Badge variant="outline">{recipe.estimatedTime}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      {recipe.steps.map((step, stepIndex) => (
                        <Card key={stepIndex} className="border-l-4 border-l-primary">
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                {step.step}
                              </div>
                              {step.title}
                            </CardTitle>
                            <CardDescription>{step.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto">
                              {step.code}
                            </pre>
                            
                            {step.notes && step.notes.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Important Notes</h4>
                                <ul className="space-y-1">
                                  {step.notes.map((note, noteIndex) => (
                                    <li key={noteIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-primary mt-0.5">•</span>
                                      {note}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
