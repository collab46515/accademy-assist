import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, HardDrive, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ResetResult {
  success: boolean;
  message: string;
  database_reset?: {
    tables_truncated: string[];
    sequences_reset: string[];
    tables_count: number;
  };
  storage_reset?: {
    buckets_emptied: string[];
    files_deleted: number;
  };
}

export function SystemResetManager() {
  const [isResetting, setIsResetting] = useState(false);
  const [lastReset, setLastReset] = useState<ResetResult | null>(null);
  const { toast } = useToast();

  const handleFullReset = async () => {
    if (!confirm('⚠️ DANGER: This will permanently delete ALL DATA (students, staff, admissions, etc.) while preserving Auth users. This action CANNOT be undone. Are you absolutely sure?')) {
      return;
    }

    if (!confirm('🔴 FINAL WARNING: You are about to wipe the entire system clean. Only Auth users will remain. Type YES in your mind and click OK to proceed.')) {
      return;
    }

    setIsResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke('full-system-reset');
      
      if (error) {
        console.error('Reset error:', error);
        toast({
          title: "Reset Failed",
          description: error.message || "An error occurred during system reset",
          variant: "destructive"
        });
        return;
      }

      setLastReset(data);
      
      if (data.success) {
        toast({
          title: "System Reset Complete",
          description: data.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Reset Failed",
          description: data.error || "Reset operation failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            System Reset Manager
          </CardTitle>
          <CardDescription>
            Permanently wipe all system data while preserving authentication accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This operation will permanently delete all data including:
              students, staff, admissions, fees, timetables, attendance, and all uploaded files.
              Only user authentication accounts will be preserved.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Database Tables</div>
                <div className="text-sm text-muted-foreground">All public data will be truncated</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <HardDrive className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium">Storage Files</div>
                <div className="text-sm text-muted-foreground">All uploaded files will be deleted</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Auth Users</div>
                <div className="text-sm text-muted-foreground">Will be preserved</div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleFullReset}
            disabled={isResetting}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isResetting ? 'Resetting System...' : 'Full System Reset'}
          </Button>

          {lastReset && (
            <Card className={lastReset.success ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="text-sm">Last Reset Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{lastReset.message}</p>
                
                {lastReset.database_reset && (
                  <div className="text-xs space-y-1">
                    <div>📊 Tables truncated: {lastReset.database_reset.tables_count}</div>
                    <div>🔄 Sequences reset: {lastReset.database_reset.sequences_reset.length}</div>
                  </div>
                )}
                
                {lastReset.storage_reset && (
                  <div className="text-xs space-y-1">
                    <div>🗂️ Buckets emptied: {lastReset.storage_reset.buckets_emptied.length}</div>
                    <div>📁 Files deleted: {lastReset.storage_reset.files_deleted}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}