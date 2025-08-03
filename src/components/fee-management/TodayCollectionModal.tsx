import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Send, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TodayCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExpectedCollection {
  id: string;
  studentName: string;
  className: string;
  amount: number;
  feeType: string;
  parentContact: string;
  lastReminder: string;
  priority: 'high' | 'medium' | 'low';
}

export function TodayCollectionModal({ open, onOpenChange }: TodayCollectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState<ExpectedCollection[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for today's expected collections
    const mockCollections: ExpectedCollection[] = [
      {
        id: '1',
        studentName: 'James Wilson',
        className: '8B',
        amount: 1600,
        feeType: 'Tuition Fee',
        parentContact: '+44 7123 456789',
        lastReminder: '2 days ago',
        priority: 'high'
      },
      {
        id: '2',
        studentName: 'Sarah Johnson',
        className: '7A',
        amount: 800,
        feeType: 'School Transport',
        parentContact: '+44 7234 567890',
        lastReminder: '1 day ago',
        priority: 'medium'
      },
      {
        id: '3',
        studentName: 'Michael Brown',
        className: '9C',
        amount: 1250,
        feeType: 'Tuition Fee',
        parentContact: '+44 7345 678901',
        lastReminder: '3 days ago',
        priority: 'high'
      },
      {
        id: '4',
        studentName: 'Emma Davis',
        className: '12A',
        amount: 1575,
        feeType: 'Sixth Form Fee',
        parentContact: '+44 7456 789012',
        lastReminder: 'Never',
        priority: 'low'
      }
    ];
    setCollections(mockCollections);
  }, []);

  const filteredCollections = collections.filter(
    collection =>
      collection.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.feeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpected = collections.reduce((sum, collection) => sum + collection.amount, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleSendReminder = (studentName: string, amount: number) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${studentName} for £${amount}`,
    });
  };

  const handleCall = (studentName: string, contact: string) => {
    toast({
      title: "Initiating Call",
      description: `Calling ${studentName} at ${contact}`,
    });
  };

  const handleMarkPaid = (studentName: string, amount: number) => {
    toast({
      title: "Payment Recorded",
      description: `Marked £${amount} payment as received from ${studentName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Today's Expected Collections</DialogTitle>
          <DialogDescription>
            Students expected to make payments today
          </DialogDescription>
        </DialogHeader>
        
        {/* Summary and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="text-2xl font-bold">£{totalExpected.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Expected Today</div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
            <Button variant="outline" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send All Reminders
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by student name, class, or fee type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Collections Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead>Last Reminder</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-medium">{collection.studentName}</TableCell>
                  <TableCell>{collection.className}</TableCell>
                  <TableCell className="font-semibold">£{collection.amount.toFixed(2)}</TableCell>
                  <TableCell>{collection.feeType}</TableCell>
                  <TableCell>{collection.parentContact}</TableCell>
                  <TableCell className={collection.lastReminder === 'Never' ? 'text-destructive' : ''}>
                    {collection.lastReminder}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(collection.priority)}>
                      {collection.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSendReminder(collection.studentName, collection.amount)}
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCall(collection.studentName, collection.parentContact)}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkPaid(collection.studentName, collection.amount)}
                      >
                        Mark Paid
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No collections found matching your search.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}