import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, Send, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReportViewDialog } from './ReportViewDialog';

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

interface ReportCardsListProps {
  onRefresh?: () => void;
}

export function ReportCardsList({ onRefresh }: ReportCardsListProps) {
  const [reports, setReports] = useState<ReportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('report_cards')
        .select('*')
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load report cards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-orange-100 text-orange-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (action: string, report: ReportCard) => {
    switch (action) {
      case 'View':
        setSelectedReport(report);
        setViewDialogOpen(true);
        break;
      case 'Download':
        toast({
          title: "Download Started",
          description: "PDF generation feature coming soon!",
        });
        break;
      case 'Edit':
        toast({
          title: "Edit Report",
          description: "Edit functionality coming soon!",
        });
        break;
      case 'Publish':
        handleStatusChange(report.id, 'published');
        break;
      case 'Delete':
        handleDelete(report.id);
        break;
      default:
        toast({
          title: `${action} Report`,
          description: `${action} functionality coming soon!`,
        });
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('report_cards')
        .update({ 
          status: newStatus,
          ...(newStatus === 'published' && { published_at: new Date().toISOString() })
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Report ${newStatus === 'published' ? 'published' : 'updated'} successfully`,
      });

      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const { error } = await supabase
        .from('report_cards')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report Deleted",
        description: "Report card has been deleted successfully",
      });

      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete report card",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading reports...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Cards</CardTitle>
        <CardDescription>
          Manage and view generated report cards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No report cards found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Generate your first report card to get started
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Year Group</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.student_name}</TableCell>
                  <TableCell>{report.year_group}</TableCell>
                  <TableCell>{report.academic_term} {report.academic_year}</TableCell>
                  <TableCell>{report.teacher_name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(report.generated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction('View', report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction('Download', report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {report.status === 'draft' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction('Edit', report)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction('Publish', report)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction('Delete', report)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      <ReportViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        report={selectedReport}
        onStatusChange={fetchReports}
      />
    </Card>
  );
}