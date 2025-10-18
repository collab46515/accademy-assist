import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmptyStateHelperProps {
  onDepartmentCreated?: () => void;
}

export function EmptyStateHelper({ onDepartmentCreated }: EmptyStateHelperProps) {
  const { toast } = useToast();

  const createSampleDepartments = async () => {
    try {
      const sampleDepartments = [
        { name: 'Administration', description: 'Administrative staff and management' },
        { name: 'Teaching', description: 'Teaching and academic staff' },
        { name: 'Support Services', description: 'Support and auxiliary staff' },
        { name: 'IT', description: 'Information technology department' },
      ];

      const { error } = await supabase
        .from('departments')
        .insert(sampleDepartments);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sample departments created successfully!",
      });

      onDepartmentCreated?.();
    } catch (error) {
      console.error('Error creating departments:', error);
      toast({
        title: "Error",
        description: "Failed to create departments. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle>Get Started with HR Management</CardTitle>
          </div>
          <CardDescription>
            Your HR system is ready, but you need to set up departments first before adding employees.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Building2 className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Step 1: Create Departments</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Start by creating departments to organize your staff. You can create them manually or use our quick setup.
                </p>
                <Button onClick={createSampleDepartments} variant="outline" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Create Sample Departments
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Step 2: Add Employees</h4>
                <p className="text-sm text-muted-foreground">
                  Once departments are set up, you can start adding employee records with all their details.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm">
              <strong>Need help?</strong> You can manually create departments by clicking "Add Department" in the HR Management page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
