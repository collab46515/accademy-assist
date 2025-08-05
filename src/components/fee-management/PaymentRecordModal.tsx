import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStudentData } from '@/hooks/useStudentData';
import { supabase } from '@/integrations/supabase/client';

interface PaymentRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentRecorded: () => void;
}

export function PaymentRecordModal({ open, onOpenChange, onPaymentRecorded }: PaymentRecordModalProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMethod: 'cash',
    referenceNumber: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { students, loading: studentsLoading } = useStudentData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd get the actual student_id and school_id
      const { data, error } = await supabase
        .from('payment_records')
        .insert({
          school_id: '1e109f61-4780-4071-acf0-aa746ab119ca', // Mock school ID
          student_id: formData.studentId,
          amount: parseFloat(formData.amount),
          payment_method: formData.paymentMethod,
          reference_number: formData.referenceNumber,
          notes: formData.notes,
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Payment Recorded",
        description: `Payment of £${formData.amount} has been recorded successfully.`,
      });

      // Reset form
      setFormData({
        studentId: '',
        amount: '',
        paymentMethod: 'cash',
        referenceNumber: '',
        notes: ''
      });

      onPaymentRecorded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Enter payment details to record a new payment.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student</Label>
            <Select 
              value={formData.studentId} 
              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select student"} />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {studentsLoading ? (
                  <SelectItem value="loading" disabled>Loading students...</SelectItem>
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.profiles?.first_name} {student.profiles?.last_name} ({student.student_number}) - {student.year_group}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-students" disabled>No students found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (£)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              placeholder="Transaction reference (optional)"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}