import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModuleConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  moduleName: string;
  schoolId: string;
  onSaved: () => void;
}

export function ModuleConfigDialog({
  open,
  onOpenChange,
  moduleId,
  moduleName,
  schoolId,
  onSaved,
}: ModuleConfigDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customWorkflow, setCustomWorkflow] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      loadConfiguration();
    }
  }, [open, moduleId, schoolId]);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('school_modules')
        .select('custom_workflow, settings')
        .eq('school_id', schoolId)
        .eq('module_id', moduleId)
        .single();

      if (error) throw error;

      setCustomWorkflow((data?.custom_workflow as Record<string, any>) || {});
      setSettings((data?.settings as Record<string, any>) || {});
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('school_modules')
        .update({
          custom_workflow: customWorkflow,
          settings: settings,
        })
        .eq('school_id', schoolId)
        .eq('module_id', moduleId);

      if (error) throw error;

      toast({
        title: 'Configuration Saved',
        description: 'Module configuration has been updated successfully.',
      });

      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save configuration',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateWorkflowField = (key: string, value: any) => {
    setCustomWorkflow({ ...customWorkflow, [key]: value });
  };

  const updateSettingField = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{moduleName} Configuration</DialogTitle>
          <DialogDescription>
            Customize workflow steps and module settings for this school
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="workflow" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workflow">Custom Workflow</TabsTrigger>
              <TabsTrigger value="settings">Module Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="workflow" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Customization</CardTitle>
                  <CardDescription>
                    Define custom workflow steps and approval processes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      value={customWorkflow.workflow_name || ''}
                      onChange={(e) => updateWorkflowField('workflow_name', e.target.value)}
                      placeholder="e.g., Standard Approval Process"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approval-required">Require Approval</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="approval-required"
                        checked={customWorkflow.approval_required || false}
                        onCheckedChange={(checked) => updateWorkflowField('approval_required', checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {customWorkflow.approval_required ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auto-notify">Auto-Notify Stakeholders</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="auto-notify"
                        checked={customWorkflow.auto_notify || false}
                        onCheckedChange={(checked) => updateWorkflowField('auto_notify', checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {customWorkflow.auto_notify ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workflow-steps">Custom Steps (JSON)</Label>
                    <Textarea
                      id="workflow-steps"
                      value={JSON.stringify(customWorkflow.steps || [], null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateWorkflowField('steps', parsed);
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      placeholder='[{"step": "Review", "approver": "HOD"}, {"step": "Final Approval", "approver": "Principal"}]'
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Module Settings</CardTitle>
                  <CardDescription>
                    Configure module-specific options and features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="access-level">Access Level</Label>
                    <Input
                      id="access-level"
                      value={settings.access_level || ''}
                      onChange={(e) => updateSettingField('access_level', e.target.value)}
                      placeholder="e.g., all, teachers_only, admin_only"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention (days)</Label>
                    <Input
                      id="data-retention"
                      type="number"
                      value={settings.data_retention_days || ''}
                      onChange={(e) => updateSettingField('data_retention_days', parseInt(e.target.value) || 0)}
                      placeholder="365"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="enable-notifications"
                        checked={settings.enable_notifications || false}
                        onCheckedChange={(checked) => updateSettingField('enable_notifications', checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {settings.enable_notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-fields">Custom Fields (JSON)</Label>
                    <Textarea
                      id="custom-fields"
                      value={JSON.stringify(settings.custom_fields || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateSettingField('custom_fields', parsed);
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      placeholder='{"field1": "value1", "field2": "value2"}'
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
