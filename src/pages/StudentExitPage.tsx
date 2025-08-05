import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  UserMinus, 
  FileMinus, 
  ClipboardX, 
  Archive, 
  HandCoins,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Search,
  Eye,
  Edit
} from 'lucide-react';

const StudentExitPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewExitDialog, setShowNewExitDialog] = useState(false);
  const [selectedExit, setSelectedExit] = useState<any>(null);

  // Mock data for exit applications
  const [exitApplications, setExitApplications] = useState([
    {
      id: 'EXIT2024001',
      studentName: 'Sarah Johnson',
      studentId: 'STU001',
      yearGroup: 'Year 10',
      exitType: 'Transfer',
      status: 'Clearance in Progress',
      submittedDate: '2024-10-15',
      expectedExitDate: '2024-11-15',
      reason: 'Family relocation',
      progress: 45,
      clearanceItems: {
        library: 'Pending',
        fees: 'Cleared',
        equipment: 'Pending',
        documents: 'In Progress'
      }
    },
    {
      id: 'EXIT2024002',
      studentName: 'Michael Chen',
      studentId: 'STU002',
      yearGroup: 'Year 12',
      exitType: 'Graduation',
      status: 'Documents Generated',
      submittedDate: '2024-10-10',
      expectedExitDate: '2024-10-30',
      reason: 'Course completion',
      progress: 85,
      clearanceItems: {
        library: 'Cleared',
        fees: 'Cleared',
        equipment: 'Cleared',
        documents: 'Generated'
      }
    },
    {
      id: 'EXIT2024003',
      studentName: 'Emma Thompson',
      studentId: 'STU003',
      yearGroup: 'Year 8',
      exitType: 'Withdrawal',
      status: 'Final Settlement',
      submittedDate: '2024-10-08',
      expectedExitDate: '2024-10-25',
      reason: 'Personal circumstances',
      progress: 95,
      clearanceItems: {
        library: 'Cleared',
        fees: 'Settlement Due',
        equipment: 'Cleared',
        documents: 'Generated'
      }
    }
  ]);

  const [newExitForm, setNewExitForm] = useState({
    studentId: '',
    exitType: '',
    expectedDate: '',
    reason: '',
    noticeGiven: '',
    parentConsent: false
  });

  const stats = [
    { label: 'Total Exit Applications', value: '15', icon: UserMinus, color: 'text-blue-600' },
    { label: 'Pending Clearance', value: '8', icon: ClipboardX, color: 'text-orange-600' },
    { label: 'Documents Ready', value: '4', icon: Archive, color: 'text-green-600' },
    { label: 'Final Settlement', value: '3', icon: HandCoins, color: 'text-purple-600' }
  ];

  const statusColors = {
    'Clearance in Progress': 'bg-yellow-100 text-yellow-800',
    'Documents Generated': 'bg-blue-100 text-blue-800',
    'Final Settlement': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-red-100 text-red-800'
  };

  const handleCreateExitApplication = () => {
    if (!newExitForm.studentId || !newExitForm.exitType || !newExitForm.expectedDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const newExit = {
      id: `EXIT2024${String(exitApplications.length + 1).padStart(3, '0')}`,
      studentName: 'Student Name', // This would be fetched from student ID
      studentId: newExitForm.studentId,
      yearGroup: 'Year X', // This would be fetched from student data
      exitType: newExitForm.exitType,
      status: 'Clearance in Progress',
      submittedDate: new Date().toISOString().split('T')[0],
      expectedExitDate: newExitForm.expectedDate,
      reason: newExitForm.reason,
      progress: 10,
      clearanceItems: {
        library: 'Pending',
        fees: 'Pending',
        equipment: 'Pending',
        documents: 'Not Started'
      }
    };

    setExitApplications(prev => [newExit, ...prev]);
    
    toast({
      title: 'Exit Application Created',
      description: `Exit application ${newExit.id} has been created successfully`,
    });

    setNewExitForm({
      studentId: '',
      exitType: '',
      expectedDate: '',
      reason: '',
      noticeGiven: '',
      parentConsent: false
    });
    setShowNewExitDialog(false);
  };

  const handleGenerateDocuments = (exitId: string) => {
    toast({
      title: 'Documents Generated',
      description: 'Exit documents have been generated and are ready for download',
    });
  };

  const handleClearanceUpdate = (exitId: string, item: string, status: string) => {
    setExitApplications(prev => prev.map(exit => 
      exit.id === exitId 
        ? {
            ...exit,
            clearanceItems: { ...exit.clearanceItems, [item]: status },
            progress: Math.min(100, exit.progress + 20)
          }
        : exit
    ));
    
    toast({
      title: 'Clearance Updated',
      description: `${item} clearance has been updated to ${status}`,
    });
  };

  const filteredExits = exitApplications.filter(exit =>
    exit.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exit.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Exit Process</h1>
        <p className="text-muted-foreground">Manage student withdrawals, transfers, and graduations with complete clearance tracking</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Exit Applications</TabsTrigger>
          <TabsTrigger value="clearance">Clearance Process</TabsTrigger>
          <TabsTrigger value="documents">Document Generation</TabsTrigger>
          <TabsTrigger value="settlement">Final Settlement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Exit Applications</CardTitle>
                <CardDescription>Latest student exit requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exitApplications.slice(0, 3).map((exit) => (
                    <div key={exit.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{exit.studentName}</p>
                        <p className="text-sm text-muted-foreground">{exit.id} • {exit.exitType}</p>
                      </div>
                      <Badge className={statusColors[exit.status as keyof typeof statusColors]}>
                        {exit.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clearance Summary</CardTitle>
                <CardDescription>Outstanding clearance items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Library Returns</span>
                    <Badge variant="outline">3 Pending</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee Settlements</span>
                    <Badge variant="outline">2 Pending</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment Returns</span>
                    <Badge variant="outline">1 Pending</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Document Generation</span>
                    <Badge variant="outline">4 Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Exit Applications</CardTitle>
                  <CardDescription>Manage all student exit applications</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={showNewExitDialog} onOpenChange={setShowNewExitDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Exit Application
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Exit Application</DialogTitle>
                        <DialogDescription>
                          Start the exit process for a student
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input
                              id="studentId"
                              value={newExitForm.studentId}
                              onChange={(e) => setNewExitForm(prev => ({ ...prev, studentId: e.target.value }))}
                              placeholder="STU001"
                            />
                          </div>
                          <div>
                            <Label htmlFor="exitType">Exit Type</Label>
                            <Select onValueChange={(value) => setNewExitForm(prev => ({ ...prev, exitType: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select exit type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Transfer">Transfer</SelectItem>
                                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                                <SelectItem value="Graduation">Graduation</SelectItem>
                                <SelectItem value="Expulsion">Expulsion</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="expectedDate">Expected Exit Date</Label>
                          <Input
                            id="expectedDate"
                            type="date"
                            value={newExitForm.expectedDate}
                            onChange={(e) => setNewExitForm(prev => ({ ...prev, expectedDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="reason">Reason for Exit</Label>
                          <Textarea
                            id="reason"
                            value={newExitForm.reason}
                            onChange={(e) => setNewExitForm(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Please provide the reason for exit..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setShowNewExitDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateExitApplication}>
                          Create Application
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, ID, or application ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredExits.map((exit) => (
                  <Card key={exit.id} className="border-border/50 hover:border-primary/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{exit.studentName}</h3>
                          <p className="text-sm text-muted-foreground">{exit.id} • {exit.studentId} • {exit.yearGroup}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={statusColors[exit.status as keyof typeof statusColors]}>
                            {exit.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Exit Progress</span>
                            <span>{exit.progress}%</span>
                          </div>
                          <Progress value={exit.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Exit Type:</span>
                            <p className="font-medium">{exit.exitType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <p className="font-medium">{exit.submittedDate}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Date:</span>
                            <p className="font-medium">{exit.expectedExitDate}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedExit(exit)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateDocuments(exit.id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Documents
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clearance Process</CardTitle>
              <CardDescription>Track and manage student clearance items</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Library</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exitApplications.map((exit) => (
                    <TableRow key={exit.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{exit.studentName}</p>
                          <p className="text-sm text-muted-foreground">{exit.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={exit.clearanceItems.library === 'Cleared' ? 'default' : 'secondary'}>
                          {exit.clearanceItems.library}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={exit.clearanceItems.fees === 'Cleared' ? 'default' : 'secondary'}>
                          {exit.clearanceItems.fees}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={exit.clearanceItems.equipment === 'Cleared' ? 'default' : 'secondary'}>
                          {exit.clearanceItems.equipment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={exit.clearanceItems.documents === 'Generated' ? 'default' : 'secondary'}>
                          {exit.clearanceItems.documents}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedExit(exit)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Generation</CardTitle>
              <CardDescription>Generate and manage exit documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Document Generation Center</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate transfer certificates, clearance letters, and final transcripts
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>Generate Transfer Certificate</Button>
                    <Button variant="outline">Generate Clearance Letter</Button>
                    <Button variant="outline">Generate Final Transcript</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Settlement</CardTitle>
              <CardDescription>Manage final fee settlements and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <HandCoins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Settlement Processing</h3>
                  <p className="text-muted-foreground mb-4">
                    Process final fee settlements, refunds, and outstanding payments
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>Process Settlement</Button>
                    <Button variant="outline">Calculate Refund</Button>
                    <Button variant="outline">Generate Invoice</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Exit Details Modal */}
      {selectedExit && (
        <Dialog open={!!selectedExit} onOpenChange={() => setSelectedExit(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Exit Application Details - {selectedExit.studentName}</DialogTitle>
              <DialogDescription>
                Application ID: {selectedExit.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedExit.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Exit Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedExit.exitType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <Badge className={statusColors[selectedExit.status as keyof typeof statusColors]}>
                    {selectedExit.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedExit.progress} className="flex-1" />
                    <span className="text-sm">{selectedExit.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Reason for Exit</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedExit.reason}</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedExit(null)}
                >
                  Close
                </Button>
                <Button>
                  Continue Process
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentExitPage;