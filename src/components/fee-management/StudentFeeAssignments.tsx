import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  GraduationCap, 
  Plus, 
  Upload, 
  Download, 
  Filter,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFeeData } from '@/hooks/useFeeData';

interface Student {
  id: string;
  name: string;
  class: string;
  yearGroup: string;
  admissionNumber: string;
  feeStructureId?: string;
  totalFees: number;
  paidAmount: number;
  status: 'current' | 'graduated' | 'left';
}

interface BulkAssignment {
  feeStructureId: string;
  criteria: {
    classes: string[];
    yearGroups: string[];
    students: string[];
  };
  discounts: {
    type: 'percentage' | 'fixed';
    value: number;
    reason: string;
  }[];
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Johnson', class: '7A', yearGroup: 'Year 7', admissionNumber: 'ADM001', totalFees: 2500, paidAmount: 1200, status: 'current' },
  { id: '2', name: 'Bob Smith', class: '7A', yearGroup: 'Year 7', admissionNumber: 'ADM002', totalFees: 2500, paidAmount: 2500, status: 'current' },
  { id: '3', name: 'Charlie Brown', class: '7B', yearGroup: 'Year 7', admissionNumber: 'ADM003', totalFees: 2500, paidAmount: 800, status: 'current' },
  { id: '4', name: 'Diana Prince', class: '8A', yearGroup: 'Year 8', admissionNumber: 'ADM004', totalFees: 2700, paidAmount: 2700, status: 'current' },
  { id: '5', name: 'Edward Norton', class: '8A', yearGroup: 'Year 8', admissionNumber: 'ADM005', totalFees: 2700, paidAmount: 1350, status: 'current' },
];

const CLASS_OPTIONS = ['7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B', '13A', '13B'];
const YEAR_GROUP_OPTIONS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];

export const StudentFeeAssignments = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterYearGroup, setFilterYearGroup] = useState('all');
  const [showBulkAssignment, setShowBulkAssignment] = useState(false);
  const [bulkAssignment, setBulkAssignment] = useState<BulkAssignment>({
    feeStructureId: '',
    criteria: { classes: [], yearGroups: [], students: [] },
    discounts: []
  });
  const { feeStructures, loading } = useFeeData();
  const { toast } = useToast();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    const matchesYearGroup = filterYearGroup === 'all' || student.yearGroup === filterYearGroup;
    
    return matchesSearch && matchesClass && matchesYearGroup;
  });

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAllStudents = () => {
    const allFilteredIds = filteredStudents.map(s => s.id);
    setSelectedStudents(prev => 
      prev.length === allFilteredIds.length ? [] : allFilteredIds
    );
  };

  const handleBulkAssignment = async () => {
    try {
      // Here you would make API calls to assign fee structures
      toast({
        title: "Success",
        description: `Fee structure assigned to ${selectedStudents.length} students`,
      });
      setShowBulkAssignment(false);
      setSelectedStudents([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign fee structures",
        variant: "destructive",
      });
    }
  };

  const getPaymentStatus = (student: Student) => {
    const percentage = (student.paidAmount / student.totalFees) * 100;
    if (percentage >= 100) return { status: 'Paid', color: 'bg-green-500' };
    if (percentage >= 50) return { status: 'Partial', color: 'bg-yellow-500' };
    return { status: 'Outstanding', color: 'bg-red-500' };
  };

  const totalStudents = students.length;
  const assignedStudents = students.filter(s => s.feeStructureId).length;
  const totalOutstanding = students.reduce((sum, s) => sum + (s.totalFees - s.paidAmount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Fee Assignments</h2>
          <p className="text-muted-foreground">Assign fee structures to students and manage payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Students
          </Button>
          <Dialog open={showBulkAssignment} onOpenChange={setShowBulkAssignment}>
            <DialogTrigger asChild>
              <Button disabled={selectedStudents.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Bulk Assign ({selectedStudents.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Fee Assignment</DialogTitle>
              </DialogHeader>
              <BulkAssignmentForm
                feeStructures={feeStructures}
                selectedCount={selectedStudents.length}
                onAssign={handleBulkAssignment}
                onCancel={() => setShowBulkAssignment(false)}
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
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned Fees</p>
                <p className="text-2xl font-bold text-success">{assignedStudents}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-warning">£{totalOutstanding.toFixed(2)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected</p>
                <p className="text-2xl font-bold text-primary">{selectedStudents.length}</p>
              </div>
              <Square className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assignments">Fee Assignments</TabsTrigger>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="payment-status">Payment Status</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Fee Assignments
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASS_OPTIONS.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterYearGroup} onValueChange={setFilterYearGroup}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Year Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {YEAR_GROUP_OPTIONS.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Students Table */}
              <div className="border rounded-lg">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={toggleAllStudents}
                    />
                    <span className="text-sm font-medium">
                      Select All ({filteredStudents.length} students)
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => {
                    const paymentStatus = getPaymentStatus(student);
                    
                    return (
                      <div key={student.id} className="p-4 border-b last:border-b-0 hover:bg-muted/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => toggleStudentSelection(student.id)}
                            />
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.admissionNumber} • {student.class} • {student.yearGroup}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                £{student.paidAmount} / £{student.totalFees}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${paymentStatus.color}`} />
                                <span className="text-xs text-muted-foreground">
                                  {paymentStatus.status}
                                </span>
                              </div>
                            </div>
                            <Badge variant={student.feeStructureId ? "default" : "outline"}>
                              {student.feeStructureId ? "Assigned" : "Not Assigned"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-operations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class-Based Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Assign fee structures to entire classes or year groups
                  </p>
                  <div className="space-y-3">
                    {CLASS_OPTIONS.slice(0, 4).map(cls => (
                      <div key={cls} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{cls}</div>
                          <div className="text-sm text-muted-foreground">
                            {MOCK_STUDENTS.filter(s => s.class === cls).length} students
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Assign Fees
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Bulk import and assign fees to multiple students
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Student List (CSV)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Import from Student Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment-status">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Paid', 'Partial', 'Outstanding'].map(status => {
                  const statusStudents = filteredStudents.filter(s => getPaymentStatus(s).status === status);
                  const statusColor = status === 'Paid' ? 'text-green-600' : 
                                    status === 'Partial' ? 'text-yellow-600' : 'text-red-600';
                  
                  return (
                    <Card key={status}>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${statusColor}`}>
                            {statusStudents.length}
                          </div>
                          <div className="text-sm text-muted-foreground">{status}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            £{statusStudents.reduce((sum, s) => sum + (s.totalFees - s.paidAmount), 0).toFixed(2)} outstanding
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BulkAssignmentForm = ({ 
  feeStructures, 
  selectedCount, 
  onAssign, 
  onCancel 
}: {
  feeStructures: any[];
  selectedCount: number;
  onAssign: () => void;
  onCancel: () => void;
}) => {
  const [selectedStructure, setSelectedStructure] = useState('');
  const [applyDiscounts, setApplyDiscounts] = useState(false);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm">
          Assigning fee structure to <strong>{selectedCount}</strong> selected students
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Fee Structure</Label>
          <Select value={selectedStructure} onValueChange={setSelectedStructure}>
            <SelectTrigger>
              <SelectValue placeholder="Select fee structure" />
            </SelectTrigger>
            <SelectContent>
              {feeStructures.map(structure => (
                <SelectItem key={structure.id} value={structure.id}>
                  {structure.name} - {structure.academic_year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="apply-discounts" 
            checked={applyDiscounts}
            onCheckedChange={setApplyDiscounts}
          />
          <Label htmlFor="apply-discounts">Apply automatic discounts (sibling, early payment, etc.)</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAssign} disabled={!selectedStructure}>
          Assign Fee Structure
        </Button>
      </div>
    </div>
  );
};