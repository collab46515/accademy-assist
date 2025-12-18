import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { supabase } from "@/integrations/supabase/client";
import { useSchoolFilter } from "@/hooks/useSchoolFilter";
import { toast } from "sonner";
import { format } from "date-fns";
import type { LibraryWithdrawal } from "@/types/library";

export function LibraryWithdrawals() {
  const { withdrawals, fetchAllData, isLoading } = useLibraryData();
  const { currentSchoolId } = useSchoolFilter();
  const [showAdd, setShowAdd] = useState(false);
  const [newWithdrawal, setNewWithdrawal] = useState({
    withdrawal_number: "",
    withdrawal_date: new Date().toISOString().split('T')[0],
    reason: "",
    approved_by: "",
    approval_date: new Date().toISOString().split('T')[0],
    approval_authority: "",
    approval_reference: "",
    total_books: "",
    total_value: "",
    disposal_method: "",
    remarks: "",
  });

  const handleAdd = async () => {
    if (!currentSchoolId) return;

    const { error } = await supabase
      .from('library_withdrawals')
      .insert({
        school_id: currentSchoolId,
        withdrawal_number: newWithdrawal.withdrawal_number || `WD-${Date.now()}`,
        withdrawal_date: newWithdrawal.withdrawal_date,
        reason: newWithdrawal.reason,
        approved_by: newWithdrawal.approved_by,
        approval_date: newWithdrawal.approval_date,
        approval_authority: newWithdrawal.approval_authority || null,
        approval_reference: newWithdrawal.approval_reference || null,
        total_books: parseInt(newWithdrawal.total_books) || 0,
        total_value: newWithdrawal.total_value ? parseFloat(newWithdrawal.total_value) : null,
        disposal_method: newWithdrawal.disposal_method || null,
        remarks: newWithdrawal.remarks || null,
      });

    if (error) {
      toast.error('Failed to record withdrawal');
      console.error(error);
      return;
    }

    toast.success('Withdrawal recorded successfully');
    setShowAdd(false);
    setNewWithdrawal({
      withdrawal_number: "",
      withdrawal_date: new Date().toISOString().split('T')[0],
      reason: "",
      approved_by: "",
      approval_date: new Date().toISOString().split('T')[0],
      approval_authority: "",
      approval_reference: "",
      total_books: "",
      total_value: "",
      disposal_method: "",
      remarks: "",
    });
    fetchAllData();
  };

  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.total_books, 0);
  const totalValue = withdrawals.reduce((sum, w) => sum + (w.total_value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Withdrawal / Condemnation Register</h2>
          <p className="text-muted-foreground">Track book withdrawals with approval details</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Plus className="mr-2 h-4 w-4" />
              Record Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Book Withdrawal</DialogTitle>
              <DialogDescription>Document book withdrawal with proper approval</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wdNumber">Withdrawal Number</Label>
                  <Input
                    id="wdNumber"
                    value={newWithdrawal.withdrawal_number}
                    onChange={(e) => setNewWithdrawal({ ...newWithdrawal, withdrawal_number: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <Label htmlFor="wdDate">Withdrawal Date *</Label>
                  <Input
                    id="wdDate"
                    type="date"
                    value={newWithdrawal.withdrawal_date}
                    onChange={(e) => setNewWithdrawal({ ...newWithdrawal, withdrawal_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason for Withdrawal *</Label>
                <Select value={newWithdrawal.reason} onValueChange={(v) => setNewWithdrawal({ ...newWithdrawal, reason: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damaged">Damaged Beyond Repair</SelectItem>
                    <SelectItem value="lost">Lost (Unrecoverable)</SelectItem>
                    <SelectItem value="obsolete">Obsolete Content</SelectItem>
                    <SelectItem value="duplicate">Excess Duplicates</SelectItem>
                    <SelectItem value="wear">Normal Wear and Tear</SelectItem>
                    <SelectItem value="weeding">Collection Weeding</SelectItem>
                    <SelectItem value="missing">Missing (Stock Verification)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Approval Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approvedBy">Approved By *</Label>
                    <Input
                      id="approvedBy"
                      value={newWithdrawal.approved_by}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, approved_by: e.target.value })}
                      placeholder="Name of approving authority"
                    />
                  </div>
                  <div>
                    <Label htmlFor="approvalDate">Approval Date *</Label>
                    <Input
                      id="approvalDate"
                      type="date"
                      value={newWithdrawal.approval_date}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, approval_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="authority">Approval Authority</Label>
                    <Input
                      id="authority"
                      value={newWithdrawal.approval_authority}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, approval_authority: e.target.value })}
                      placeholder="e.g., Principal, Library Committee"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reference">Reference Number</Label>
                    <Input
                      id="reference"
                      value={newWithdrawal.approval_reference}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, approval_reference: e.target.value })}
                      placeholder="Approval order/letter number"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Book Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalBooks">Total Books</Label>
                    <Input
                      id="totalBooks"
                      type="number"
                      value={newWithdrawal.total_books}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, total_books: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalValue">Total Value (₹)</Label>
                    <Input
                      id="totalValue"
                      type="number"
                      value={newWithdrawal.total_value}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, total_value: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="disposal">Disposal Method</Label>
                    <Select value={newWithdrawal.disposal_method} onValueChange={(v) => setNewWithdrawal({ ...newWithdrawal, disposal_method: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="recycle">Recycle</SelectItem>
                        <SelectItem value="donate">Donate</SelectItem>
                        <SelectItem value="destroy">Destroy</SelectItem>
                        <SelectItem value="pending">Pending Decision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newWithdrawal.remarks}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, remarks: e.target.value })}
                  placeholder="Additional notes about the withdrawal"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newWithdrawal.reason || !newWithdrawal.approved_by}>
                Record Withdrawal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withdrawals.length}</div>
            <p className="text-xs text-muted-foreground">records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Books Withdrawn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalWithdrawn}</div>
            <p className="text-xs text-muted-foreground">total books</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Written Off Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">total value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Withdrawal Records
          </CardTitle>
          <CardDescription>All book withdrawal/condemnation transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>WD Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Disposal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No withdrawal records found
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      <code className="font-mono">{withdrawal.withdrawal_number}</code>
                    </TableCell>
                    <TableCell>{format(new Date(withdrawal.withdrawal_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{withdrawal.reason}</Badge>
                    </TableCell>
                    <TableCell>{withdrawal.total_books}</TableCell>
                    <TableCell>{withdrawal.total_value ? `₹${withdrawal.total_value.toFixed(2)}` : "-"}</TableCell>
                    <TableCell>{withdrawal.approved_by}</TableCell>
                    <TableCell>{withdrawal.approval_authority || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{withdrawal.disposal_method || "pending"}</Badge>
                    </TableCell>
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
