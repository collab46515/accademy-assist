import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Search, Receipt, Check, X } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LibraryFine } from "@/types/library";

export function LibraryFinesNew() {
  const { fines, members, fetchAllData, isLoading } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedFine, setSelectedFine] = useState<LibraryFine | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const pendingFines = fines.filter(f => f.status === 'pending' || f.status === 'partially_paid');
  const paidFines = fines.filter(f => f.status === 'paid');
  const waivedFines = fines.filter(f => f.status === 'waived');

  const totalPending = pendingFines.reduce((sum, f) => sum + f.balance, 0);
  const totalCollected = paidFines.reduce((sum, f) => sum + f.paid_amount, 0);

  const filteredPendingFines = pendingFines.filter(fine => {
    const member = members.find(m => m.id === fine.member_id);
    return member?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member?.admission_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member?.staff_id?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCollectFine = async () => {
    if (!selectedFine) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedFine.balance) {
      toast.error('Invalid payment amount');
      return;
    }

    const newPaidAmount = selectedFine.paid_amount + amount;
    const newBalance = selectedFine.fine_amount - newPaidAmount;
    const newStatus = newBalance === 0 ? 'paid' : 'partially_paid';

    const { error } = await supabase
      .from('library_fines')
      .update({
        paid_amount: newPaidAmount,
        balance: newBalance,
        status: newStatus,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: paymentMethod,
      })
      .eq('id', selectedFine.id);

    if (error) {
      toast.error('Failed to record payment');
      return;
    }

    toast.success(`Payment of ₹${amount.toFixed(2)} recorded`);
    setShowPayment(false);
    setSelectedFine(null);
    setPaymentAmount("");
    fetchAllData();
  };

  const handleWaiveFine = async (fine: LibraryFine) => {
    const { error } = await supabase
      .from('library_fines')
      .update({
        status: 'waived',
        balance: 0,
      })
      .eq('id', fine.id);

    if (error) {
      toast.error('Failed to waive fine');
      return;
    }

    toast.success('Fine waived successfully');
    fetchAllData();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">₹{totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{pendingFines.length} fines</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalCollected.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{paidFines.length} paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waived Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waivedFines.length}</div>
            <p className="text-xs text-muted-foreground">fines waived</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by member name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingFines.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidFines.length})</TabsTrigger>
          <TabsTrigger value="waived">Waived ({waivedFines.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Fines</CardTitle>
              <CardDescription>Fines awaiting collection</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingFines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No pending fines
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingFines.map((fine) => (
                      <TableRow key={fine.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{fine.member?.full_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">
                              {fine.member?.member_type === 'student' 
                                ? fine.member?.class_name 
                                : fine.member?.department}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{fine.fine_type}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(fine.fine_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>₹{fine.fine_amount.toFixed(2)}</TableCell>
                        <TableCell>₹{fine.paid_amount.toFixed(2)}</TableCell>
                        <TableCell className="font-medium text-destructive">
                          ₹{fine.balance.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedFine(fine);
                                setPaymentAmount(fine.balance.toString());
                                setShowPayment(true);
                              }}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Collect
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleWaiveFine(fine)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Paid Fines</CardTitle>
              <CardDescription>Fully collected fines</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fine Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>{fine.member?.full_name || "Unknown"}</TableCell>
                      <TableCell><Badge variant="outline">{fine.fine_type}</Badge></TableCell>
                      <TableCell>{format(new Date(fine.fine_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{fine.payment_date && format(new Date(fine.payment_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>₹{fine.paid_amount.toFixed(2)}</TableCell>
                      <TableCell>{fine.payment_method || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waived">
          <Card>
            <CardHeader>
              <CardTitle>Waived Fines</CardTitle>
              <CardDescription>Fines that were waived</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Original Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waivedFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>{fine.member?.full_name || "Unknown"}</TableCell>
                      <TableCell><Badge variant="outline">{fine.fine_type}</Badge></TableCell>
                      <TableCell>₹{fine.fine_amount.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(fine.fine_date), 'dd MMM yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Fine Payment</DialogTitle>
            <DialogDescription>
              Record payment for {selectedFine?.member?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fine Amount</Label>
                <Input value={`₹${selectedFine?.fine_amount.toFixed(2)}`} disabled />
              </div>
              <div>
                <Label>Balance Due</Label>
                <Input value={`₹${selectedFine?.balance.toFixed(2)}`} disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="payment">Payment Amount *</Label>
              <Input
                id="payment"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                max={selectedFine?.balance}
              />
            </div>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayment(false)}>Cancel</Button>
            <Button onClick={handleCollectFine}>
              <Receipt className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
