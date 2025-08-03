import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  FileText, 
  Calendar, 
  Users, 
  Mail, 
  MessageSquare,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: 'reminder' | 'invoice' | 'collection' | 'report';
}

export function BulkActionsModal({ open, onOpenChange, actionType }: BulkActionsModalProps) {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [reminderType, setReminderType] = useState('email');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const classes = [
    { id: '7A', name: 'Year 7A', students: 25, outstandingCount: 5 },
    { id: '8B', name: 'Year 8B', students: 28, outstandingCount: 12 },
    { id: '9C', name: 'Year 9C', students: 30, outstandingCount: 8 },
    { id: '10A', name: 'Year 10A', students: 22, outstandingCount: 3 },
    { id: '12A', name: 'Year 12A', students: 18, outstandingCount: 2 }
  ];

  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSelectAll = () => {
    setSelectedClasses(classes.map(c => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedClasses([]);
  };

  const handleExecuteAction = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const selectedCount = selectedClasses.reduce((sum, classId) => {
        const classData = classes.find(c => c.id === classId);
        return sum + (classData?.outstandingCount || 0);
      }, 0);

      let successMessage = '';
      switch (actionType) {
        case 'reminder':
          successMessage = `Sent ${reminderType} reminders to ${selectedCount} students across ${selectedClasses.length} classes`;
          break;
        case 'invoice':
          successMessage = `Generated invoices for ${selectedCount} students across ${selectedClasses.length} classes`;
          break;
        case 'collection':
          successMessage = `Generated collection list for ${selectedClasses.length} classes`;
          break;
        case 'report':
          successMessage = `Generated fee report for ${selectedClasses.length} classes`;
          break;
      }

      toast({
        title: "Action Completed",
        description: successMessage,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalContent = () => {
    switch (actionType) {
      case 'reminder':
        return {
          title: 'Send Bulk Reminders',
          description: 'Send payment reminders to students with outstanding fees',
          icon: <Send className="w-6 h-6" />,
          content: (
            <div className="space-y-6">
              <div>
                <Label htmlFor="reminderType">Reminder Method</Label>
                <Select value={reminderType} onValueChange={setReminderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email & SMS</SelectItem>
                    <SelectItem value="letter">Physical Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="messageTemplate">Message Template</Label>
                <Textarea
                  id="messageTemplate"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Dear Parent/Guardian, This is a friendly reminder that payment for [STUDENT_NAME] is now due. Amount: £[AMOUNT]. Please make payment by [DUE_DATE]."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use placeholders: [STUDENT_NAME], [AMOUNT], [DUE_DATE], [CLASS_NAME]
                </p>
              </div>
            </div>
          )
        };

      case 'invoice':
        return {
          title: 'Generate Bulk Invoices',
          description: 'Create invoices for selected classes and fee structures',
          icon: <FileText className="w-6 h-6" />,
          content: (
            <div className="space-y-6">
              <div>
                <Label>Invoice Settings</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-late-fees" />
                    <Label htmlFor="include-late-fees">Include late payment fees</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-send" />
                    <Label htmlFor="auto-send">Automatically send via email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="payment-link" />
                    <Label htmlFor="payment-link">Include online payment link</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Payment Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  defaultValue="2025-09-15"
                />
              </div>
            </div>
          )
        };

      case 'collection':
        return {
          title: "Today's Collection List",
          description: 'Generate collection list with contact details',
          icon: <Calendar className="w-6 h-6" />,
          content: (
            <div className="space-y-6">
              <div>
                <Label>Export Format</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="excel" defaultChecked />
                    <Label htmlFor="excel">Excel Spreadsheet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pdf" />
                    <Label htmlFor="pdf">PDF Report</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="csv" />
                    <Label htmlFor="csv">CSV File</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Include Information</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parent-contact" defaultChecked />
                    <Label htmlFor="parent-contact">Parent contact details</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="payment-history" />
                    <Label htmlFor="payment-history">Previous payment history</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="outstanding-breakdown" defaultChecked />
                    <Label htmlFor="outstanding-breakdown">Outstanding amount breakdown</Label>
                  </div>
                </div>
              </div>
            </div>
          )
        };

      default:
        return {
          title: 'Bulk Action',
          description: 'Execute bulk action',
          icon: <Users className="w-6 h-6" />,
          content: <div>Action content</div>
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center space-y-0 space-x-3">
          {modalContent.icon}
          <div>
            <DialogTitle>{modalContent.title}</DialogTitle>
            <DialogDescription>{modalContent.description}</DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Classes</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedClasses.includes(classItem.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleClassToggle(classItem.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {classItem.students} students
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={classItem.outstandingCount > 0 ? "destructive" : "default"}>
                          {classItem.outstandingCount} due
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Action Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                {modalContent.content}
              </CardContent>
            </Card>

            {/* Summary and Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Selected Classes:</span>
                    <span className="font-medium">{selectedClasses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affected Students:</span>
                    <span className="font-medium">
                      {selectedClasses.reduce((sum, classId) => {
                        const classData = classes.find(c => c.id === classId);
                        return sum + (classData?.outstandingCount || 0);
                      }, 0)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleExecuteAction}
                    disabled={selectedClasses.length === 0 || loading}
                  >
                    {loading ? 'Processing...' : `Execute ${modalContent.title}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}