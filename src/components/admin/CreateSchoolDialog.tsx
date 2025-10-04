import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Building2, Loader2 } from 'lucide-react';

interface CreateSchoolDialogProps {
  onSchoolCreated: () => void;
}

export function CreateSchoolDialog({ onSchoolCreated }: CreateSchoolDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    contact_phone: '',
    contact_email: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create school
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: formData.name,
          code: formData.code,
          address: formData.address,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          website: formData.website,
          is_active: true,
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Get all active modules
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id')
        .eq('is_active', true);

      if (modulesError) throw modulesError;

      // Create school_modules entries for all modules (disabled by default)
      if (modules && modules.length > 0) {
        const schoolModules = modules.map((module) => ({
          school_id: school.id,
          module_id: module.id,
          is_enabled: false,
          custom_workflow: {},
          settings: {},
        }));

        const { error: schoolModulesError } = await supabase
          .from('school_modules')
          .insert(schoolModules);

        if (schoolModulesError) throw schoolModulesError;
      }

      toast({
        title: 'School Created',
        description: `${formData.name} has been created with all modules ready to configure.`,
      });

      setFormData({
        name: '',
        code: '',
        address: '',
        contact_phone: '',
        contact_email: '',
        website: '',
      });
      setOpen(false);
      onSchoolCreated();
    } catch (error: any) {
      console.error('Error creating school:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create school',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Building2 className="h-4 w-4" />
          Create New School
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New School</DialogTitle>
          <DialogDescription>
            Add a new school and automatically initialize all modules for configuration.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Lincoln High School"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">School Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  placeholder="e.g., LHS001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full school address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  required
                  placeholder="admin@school.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+44 20 1234 5678"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://school.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create School
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
