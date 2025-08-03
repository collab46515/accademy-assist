import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Send, 
  Download, 
  Eye, 
  Calendar,
  Users,
  DollarSign,
  Clock,
  Plus,
  RefreshCw,
  Mail,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFeeData } from '@/hooks/useFeeData';

interface InvoiceBatch {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  status: 'draft' | 'generated' | 'sent' | 'completed';
  totalStudents: number;
  totalAmount: number;
  generatedAt?: Date;
  sentAt?: Date;
  progress: number;
}

interface InvoiceTemplate {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  dueDate: string;
  feeStructureIds: string[];
  studentCriteria: {
    classes: string[];
    yearGroups: string[];
    boardingStatus: string[];
  };
  reminderSchedule: {
    beforeDue: number[];
    afterDue: number[];
  };
}

const MOCK_INVOICE_BATCHES: InvoiceBatch[] = [
  {
    id: '1',
    name: 'Autumn Term 2024',
    academicYear: '2024-25',
    term: 'Autumn',
    status: 'completed',
    totalStudents: 1247,
    totalAmount: 2847650,
    generatedAt: new Date('2024-09-01'),
    sentAt: new Date('2024-09-02'),
    progress: 100
  },
  {
    id: '2',
    name: 'Spring Term 2024',
    academicYear: '2024-25',
    term: 'Spring',
    status: 'sent',
    totalStudents: 1198,
    totalAmount: 2654320,
    generatedAt: new Date('2024-01-15'),
    sentAt: new Date('2024-01-16'),
    progress: 100
  },
  {
    id: '3',
    name: 'Summer Term 2024',
    academicYear: '2024-25',
    term: 'Summer',
    status: 'draft',
    totalStudents: 0,
    totalAmount: 0,
    progress: 0
  }
];

export const InvoiceGeneration = () => {
  const [batches, setBatches] = useState<InvoiceBatch[]>(MOCK_INVOICE_BATCHES);
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [generatingBatch, setGeneratingBatch] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const { feeStructures, loading } = useFeeData();
  const { toast } = useToast();

  const handleGenerateBatch = async (batchId: string) => {
    setGeneratingBatch(batchId);
    
    try {
      // Simulate batch generation with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setBatches(prev => prev.map(batch => 
          batch.id === batchId 
            ? { ...batch, progress: i, status: i === 100 ? 'generated' : 'draft' }
            : batch
        ));
      }

      setBatches(prev => prev.map(batch => 
        batch.id === batchId 
          ? { 
              ...batch, 
              status: 'generated',
              totalStudents: 1247,
              totalAmount: 2847650,
              generatedAt: new Date()
            }
          : batch
      ));

      toast({
        title: "Success",
        description: "Invoice batch generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice batch",
        variant: "destructive",
      });
    } finally {
      setGeneratingBatch(null);
    }
  };

  const handleSendBatch = async (batchId: string) => {
    try {
      setBatches(prev => prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'sent', sentAt: new Date() }
          : batch
      ));

      toast({
        title: "Success",
        description: "Invoices sent to parents successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invoices",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'generated': return 'bg-blue-500';
      case 'sent': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const totalInvoicesThisTerm = batches.reduce((sum, batch) => sum + batch.totalStudents, 0);
  const totalAmountThisTerm = batches.reduce((sum, batch) => sum + batch.totalAmount, 0);
  const pendingBatches = batches.filter(b => b.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Generation</h2>
          <p className="text-muted-foreground">Generate and manage student fee invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Batch
          </Button>
          <Dialog open={showNewBatch} onOpenChange={setShowNewBatch}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice Batch</DialogTitle>
              </DialogHeader>
              <NewBatchForm
                feeStructures={feeStructures}
                onCancel={() => setShowNewBatch(false)}
                onCreate={(batch) => {
                  setBatches(prev => [...prev, batch]);
                  setShowNewBatch(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{totalInvoicesThisTerm}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">£{(totalAmountThisTerm / 100).toFixed(0)}k</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Batches</p>
                <p className="text-2xl font-bold text-warning">{pendingBatches}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">1,247</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="batches">Invoice Batches</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview & Send</TabsTrigger>
        </TabsList>

        <TabsContent value="batches">
          <div className="space-y-4">
            {batches.map((batch) => (
              <Card key={batch.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {batch.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {batch.academicYear} • {batch.term} Term
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatingBatch === batch.id && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Generating invoices...</span>
                          <span>{batch.progress}%</span>
                        </div>
                        <Progress value={batch.progress} className="h-2" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Students</p>
                        <p className="font-semibold">{batch.totalStudents.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-semibold">£{batch.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Generated</p>
                        <p className="font-semibold">
                          {batch.generatedAt ? batch.generatedAt.toLocaleDateString() : 'Not yet'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sent</p>
                        <p className="font-semibold">
                          {batch.sentAt ? batch.sentAt.toLocaleDateString() : 'Not yet'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {batch.status === 'draft' && (
                        <Button 
                          onClick={() => handleGenerateBatch(batch.id)}
                          disabled={generatingBatch === batch.id}
                        >
                          {generatingBatch === batch.id ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4 mr-2" />
                          )}
                          Generate Invoices
                        </Button>
                      )}
                      
                      {batch.status === 'generated' && (
                        <>
                          <Button onClick={() => handleSendBatch(batch.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Parents
                          </Button>
                          <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </>
                      )}
                      
                      {(batch.status === 'sent' || batch.status === 'completed') && (
                        <>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Batch
                          </Button>
                          <Button variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminders
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Printer className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoice Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage invoice templates for different fee structures and terms.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview & Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Preview & Send Invoices</h3>
                <p className="text-muted-foreground mb-4">
                  Preview generated invoices and manage delivery to parents via email or parent portal.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Sample
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NewBatchForm = ({ 
  feeStructures, 
  onCancel, 
  onCreate 
}: {
  feeStructures: any[];
  onCancel: () => void;
  onCreate: (batch: InvoiceBatch) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    academicYear: '2024-25',
    term: '',
    dueDate: '',
    feeStructureIds: [] as string[],
    classes: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBatch: InvoiceBatch = {
      id: Date.now().toString(),
      name: formData.name,
      academicYear: formData.academicYear,
      term: formData.term,
      status: 'draft',
      totalStudents: 0,
      totalAmount: 0,
      progress: 0
    };

    onCreate(newBatch);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch Name</Label>
          <Input
            id="batch-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Autumn Term 2024"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic-year">Academic Year</Label>
          <Select 
            value={formData.academicYear} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2025-26">2025-26</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="term">Term</Label>
          <Select 
            value={formData.term} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Autumn">Autumn</SelectItem>
              <SelectItem value="Spring">Spring</SelectItem>
              <SelectItem value="Summer">Summer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due-date">Due Date</Label>
          <Input
            id="due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Batch
        </Button>
      </div>
    </form>
  );
};