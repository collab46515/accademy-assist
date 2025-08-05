import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UserMinus, 
  FileText, 
  Package, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmployeeExitProps {
  employees: any[];
}

export function EmployeeExit({ employees }: EmployeeExitProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeExitTab, setActiveExitTab] = useState('form');

  // Mock exit process data
  const [exitProcesses] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      position: 'Senior Developer',
      submittedDate: '2024-01-15',
      lastWorkingDate: '2024-02-15',
      status: 'in-progress',
      exitType: 'resignation',
      reason: 'Career advancement',
      completedSteps: 3,
      totalSteps: 8,
      assetsClearance: 'pending',
      documentHandover: 'completed',
      finalSettlement: 'pending'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Mike Chen',
      department: 'Marketing',
      position: 'Marketing Manager',
      submittedDate: '2024-01-10',
      lastWorkingDate: '2024-01-31',
      status: 'completed',
      exitType: 'termination',
      reason: 'Performance issues',
      completedSteps: 8,
      totalSteps: 8,
      assetsClearance: 'completed',
      documentHandover: 'completed',
      finalSettlement: 'completed'
    }
  ]);

  const exitSteps = [
    { id: 1, name: 'Exit Form Submission', completed: true },
    { id: 2, name: 'Manager Approval', completed: true },
    { id: 3, name: 'HR Review', completed: true },
    { id: 4, name: 'Asset Return', completed: false },
    { id: 5, name: 'Document Handover', completed: false },
    { id: 6, name: 'Access Revocation', completed: false },
    { id: 7, name: 'Final Settlement', completed: false },
    { id: 8, name: 'Exit Interview', completed: false }
  ];

  const assetsList = [
    { id: 1, name: 'Laptop - MacBook Pro', serialNumber: 'MBP2023001', status: 'assigned', returnDate: null },
    { id: 2, name: 'Mobile Phone - iPhone 14', serialNumber: 'IP14001', status: 'assigned', returnDate: null },
    { id: 3, name: 'Access Card', serialNumber: 'AC001', status: 'assigned', returnDate: null },
    { id: 4, name: 'Office Keys', serialNumber: 'KEY001', status: 'assigned', returnDate: null }
  ];

  const filteredExitProcesses = exitProcesses.filter(process => {
    const matchesSearch = process.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || process.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleInitiateExit = (employee: any) => {
    setSelectedEmployee(employee);
    setShowExitDialog(true);
  };

  const renderExitProcesses = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exit Processes List */}
      <div className="grid gap-6">
        {filteredExitProcesses.map((process) => (
          <Card key={process.id} className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{process.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{process.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">{process.position} • {process.department}</p>
                    <p className="text-sm text-muted-foreground">Employee ID: {process.employeeId}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={process.status === 'completed' ? 'default' : process.status === 'in-progress' ? 'secondary' : 'destructive'}>
                        {process.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline">{process.exitType}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-sm text-muted-foreground">Last Working Date</p>
                  <p className="font-medium">{process.lastWorkingDate}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{process.completedSteps}/{process.totalSteps}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Assets: </span>
                  <Badge variant={process.assetsClearance === 'completed' ? 'default' : 'secondary'}>
                    {process.assetsClearance}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Handover: </span>
                  <Badge variant={process.documentHandover === 'completed' ? 'default' : 'secondary'}>
                    {process.documentHandover}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Settlement: </span>
                  <Badge variant={process.finalSettlement === 'completed' ? 'default' : 'secondary'}>
                    {process.finalSettlement}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExitWorkflow = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle>Exit Process Workflow</CardTitle>
          <CardDescription>Standard steps for employee exit process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exitSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.name}</h4>
                </div>
                <Badge variant={step.completed ? 'default' : 'secondary'}>
                  {step.completed ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssetManagement = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asset Return Management</CardTitle>
              <CardDescription>Track and manage asset returns during exit process</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assetsList.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{asset.name}</h4>
                    <p className="text-sm text-muted-foreground">Serial: {asset.serialNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={asset.status === 'returned' ? 'default' : 'secondary'}>
                    {asset.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Mark Returned
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employee Exit Management</h2>
          <p className="text-muted-foreground">Manage employee departures and exit processes</p>
        </div>
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
              <UserMinus className="h-4 w-4 mr-2" />
              Initiate Exit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Initiate Employee Exit</DialogTitle>
              <DialogDescription>
                Start the exit process for an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Select Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitType">Exit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resignation">Resignation</SelectItem>
                      <SelectItem value="termination">Termination</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="contract-end">Contract End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastWorkingDate">Last Working Date</Label>
                <Input type="date" id="lastWorkingDate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Exit</Label>
                <Textarea id="reason" placeholder="Provide details about the exit reason..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Exit Process Initiated",
                  description: "Employee exit process has been started successfully.",
                });
                setShowExitDialog(false);
              }}>
                Initiate Exit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeExitTab} onValueChange={setActiveExitTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="processes">Exit Processes</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="assets">Asset Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processes" className="mt-6">
          {renderExitProcesses()}
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-6">
          {renderExitWorkflow()}
        </TabsContent>
        
        <TabsContent value="assets" className="mt-6">
          {renderAssetManagement()}
        </TabsContent>
      </Tabs>
    </div>
  );
}