import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download, Send, Edit, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateReportCardPDF } from '@/utils/pdfGenerator';

interface ReportCard {
  id: string;
  student_name: string;
  year_group: string;
  academic_term: string;
  academic_year: string;
  status: string;
  generated_at: string;
  teacher_name: string;
  grades_data: any;
  attendance_data: any;
  class_name: string;
}

interface ReportViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportCard | null;
  onStatusChange?: () => void;
}

export function ReportViewDialog({ open, onOpenChange, report, onStatusChange }: ReportViewDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!report) return null;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('report_cards')
        .update({ 
          status: newStatus,
          ...(newStatus === 'published' && { published_at: new Date().toISOString() })
        })
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Report ${newStatus === 'published' ? 'published' : 'updated'} successfully`,
      });

      onStatusChange?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update report status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const filename = generateReportCardPDF(report);
      toast({
        title: "PDF Downloaded",
        description: `Report card saved as ${filename}`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('report_cards')
        .delete()
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Report Deleted",
        description: "Report card has been deleted successfully",
      });

      onStatusChange?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete report card",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Card - {report.student_name}
          </DialogTitle>
          <DialogDescription>
            {report.academic_term} {report.academic_year} • {report.year_group}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {report.student_name}
                </div>
                <div>
                  <span className="font-medium">Year Group:</span> {report.year_group}
                </div>
                <div>
                  <span className="font-medium">Class:</span> {report.class_name}
                </div>
                <div>
                  <span className="font-medium">Teacher:</span> {report.teacher_name}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Term:</span> {report.academic_term} {report.academic_year}
                </div>
                <div>
                  <span className="font-medium">Generated:</span> {new Date(report.generated_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge className={
                    report.status === 'draft' ? 'bg-orange-100 text-orange-800' :
                    report.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {report.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(report.grades_data) && report.grades_data.length > 0 ? (
                <div className="space-y-2">
                  {report.grades_data.map((grade, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{grade.subject}</span>
                      <span className="font-medium">{grade.grade}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No grades recorded yet</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleDownload} variant="outline" disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>

            {report.status === 'draft' && (
              <>
                <Button 
                  onClick={() => handleStatusChange('published')} 
                  disabled={loading}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publish Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast({ title: "Edit Feature", description: "Edit functionality coming soon!" })}
                  disabled={loading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}

            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}