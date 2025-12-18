import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, ClipboardCheck, Play, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { supabase } from "@/integrations/supabase/client";
import { useSchoolFilter } from "@/hooks/useSchoolFilter";
import { toast } from "sonner";
import { format } from "date-fns";

export function LibraryStockVerification() {
  const { stockVerifications, bookCopies, fetchAllData, isLoading } = useLibraryData();
  const { currentSchoolId } = useSchoolFilter();
  const [showAdd, setShowAdd] = useState(false);
  const [newVerification, setNewVerification] = useState({
    verification_name: "",
    start_date: new Date().toISOString().split('T')[0],
    accession_range_start: "",
    accession_range_end: "",
    supervised_by: "",
    remarks: "",
  });

  const handleStartVerification = async () => {
    if (!currentSchoolId) return;

    const totalBooks = bookCopies.filter(c => c.status !== 'withdrawn').length;

    const { error } = await supabase
      .from('library_stock_verifications')
      .insert({
        school_id: currentSchoolId,
        verification_number: `SV-${Date.now()}`,
        verification_name: newVerification.verification_name || `Stock Verification ${new Date().getFullYear()}`,
        start_date: newVerification.start_date,
        accession_range_start: newVerification.accession_range_start ? parseInt(newVerification.accession_range_start) : null,
        accession_range_end: newVerification.accession_range_end ? parseInt(newVerification.accession_range_end) : null,
        total_expected: totalBooks,
        total_found: 0,
        total_missing: 0,
        total_withdrawn: 0,
        total_damaged: 0,
        status: 'in_progress',
        supervised_by: newVerification.supervised_by || null,
        remarks: newVerification.remarks || null,
      });

    if (error) {
      toast.error('Failed to start verification');
      console.error(error);
      return;
    }

    toast.success('Stock verification started');
    setShowAdd(false);
    setNewVerification({
      verification_name: "",
      start_date: new Date().toISOString().split('T')[0],
      accession_range_start: "",
      accession_range_end: "",
      supervised_by: "",
      remarks: "",
    });
    fetchAllData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default">Completed</Badge>;
      case 'in_progress': return <Badge variant="secondary">In Progress</Badge>;
      case 'approved': return <Badge className="bg-green-500">Approved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeVerification = stockVerifications.find(v => v.status === 'in_progress');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Stock Verification</h2>
          <p className="text-muted-foreground">Annual stock check and reconciliation</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button disabled={!!activeVerification}>
              <Plus className="mr-2 h-4 w-4" />
              Start New Verification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Start Stock Verification</DialogTitle>
              <DialogDescription>Begin a new stock verification cycle</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Verification Name</Label>
                <Input
                  id="name"
                  value={newVerification.verification_name}
                  onChange={(e) => setNewVerification({ ...newVerification, verification_name: e.target.value })}
                  placeholder={`Stock Verification ${new Date().getFullYear()}`}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newVerification.start_date}
                  onChange={(e) => setNewVerification({ ...newVerification, start_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rangeStart">Accession Range Start</Label>
                  <Input
                    id="rangeStart"
                    type="number"
                    value={newVerification.accession_range_start}
                    onChange={(e) => setNewVerification({ ...newVerification, accession_range_start: e.target.value })}
                    placeholder="Leave empty for all"
                  />
                </div>
                <div>
                  <Label htmlFor="rangeEnd">Accession Range End</Label>
                  <Input
                    id="rangeEnd"
                    type="number"
                    value={newVerification.accession_range_end}
                    onChange={(e) => setNewVerification({ ...newVerification, accession_range_end: e.target.value })}
                    placeholder="Leave empty for all"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="supervisor">Supervised By</Label>
                <Input
                  id="supervisor"
                  value={newVerification.supervised_by}
                  onChange={(e) => setNewVerification({ ...newVerification, supervised_by: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newVerification.remarks}
                  onChange={(e) => setNewVerification({ ...newVerification, remarks: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleStartVerification}>
                <Play className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Verification */}
      {activeVerification && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Active Verification: {activeVerification.verification_name}
            </CardTitle>
            <CardDescription>
              Started {format(new Date(activeVerification.start_date), 'dd MMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{activeVerification.total_expected}</p>
                <p className="text-xs text-muted-foreground">Expected</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{activeVerification.total_found}</p>
                <p className="text-xs text-muted-foreground">Found</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{activeVerification.total_missing}</p>
                <p className="text-xs text-muted-foreground">Missing</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{activeVerification.total_damaged}</p>
                <p className="text-xs text-muted-foreground">Damaged</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold">{activeVerification.total_withdrawn}</p>
                <p className="text-xs text-muted-foreground">Withdrawn</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>
                  {Math.round(((activeVerification.total_found + activeVerification.total_missing + activeVerification.total_withdrawn) / activeVerification.total_expected) * 100)}%
                </span>
              </div>
              <Progress 
                value={((activeVerification.total_found + activeVerification.total_missing + activeVerification.total_withdrawn) / activeVerification.total_expected) * 100} 
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Mark Books
              </Button>
              <Button variant="outline">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Verifications */}
      <Card>
        <CardHeader>
          <CardTitle>Verification History</CardTitle>
          <CardDescription>Past stock verification records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Verification</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Found</TableHead>
                <TableHead>Missing</TableHead>
                <TableHead>Damaged</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockVerifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No verification records found
                  </TableCell>
                </TableRow>
              ) : (
                stockVerifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{verification.verification_name}</p>
                        <code className="text-xs text-muted-foreground">{verification.verification_number}</code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(verification.start_date), 'dd MMM yyyy')}</p>
                        {verification.end_date && (
                          <p className="text-muted-foreground">to {format(new Date(verification.end_date), 'dd MMM yyyy')}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{verification.total_expected}</TableCell>
                    <TableCell className="text-green-600">{verification.total_found}</TableCell>
                    <TableCell className="text-red-600">{verification.total_missing}</TableCell>
                    <TableCell className="text-yellow-600">{verification.total_damaged}</TableCell>
                    <TableCell>{getStatusBadge(verification.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
