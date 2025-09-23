import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Search, 
  Plus,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Clock,
  AlertCircle
} from "lucide-react";
import { useHRData } from "@/hooks/useHRData";
import { useComprehensiveHR } from "@/hooks/useComprehensiveHR";
import { EmployeeForm } from "@/components/hr/EmployeeForm";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  startDate: string;
  status: "active" | "on-leave" | "inactive" | "terminated";
  subjects?: string[];
  qualifications?: string[];
  salary?: number;
  location?: string;
}

const StaffPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
  
  // Debug logging for viewingEmployee state
  console.log('StaffPage render - viewingEmployee:', viewingEmployee);
  const [selectedTab, setSelectedTab] = useState("directory");

  // Use real HR data from database
  const {
    loading,
    employees: dbEmployees,
    departments: dbDepartments,
    createEmployee,
    updateEmployee,
    refreshData
  } = useHRData();

  // Use comprehensive HR data for time tracking
  const {
    timeEntries,
    createTimeEntry,
    refreshData: refreshComprehensiveData
  } = useComprehensiveHR();

  // Transform database data to UI format
  const staff: StaffMember[] = dbEmployees.map(emp => ({
    id: emp.id,
    employeeId: emp.employee_id,
    firstName: emp.first_name,
    lastName: emp.last_name,
    email: emp.email,
    phone: emp.phone || '',
    role: emp.position,
    department: emp.department_name || 'Unknown',
    startDate: emp.start_date,
    status: emp.status as "active" | "on-leave" | "inactive" | "terminated",
    salary: emp.salary,
    location: emp.location || ''
  }));

  const getStatusBadge = (status: StaffMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "on-leave":
        return <Badge variant="secondary">On Leave</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>;
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === "active").length;
  const onLeave = staff.filter(s => s.status === "on-leave").length;
  const departments = [...new Set(staff.map(s => s.department))].length;

  const handleViewEmployee = (employee: StaffMember) => {
    console.log('🔍 VIEW EMPLOYEE CLICKED:', employee.firstName, employee.lastName);
    try {
      // Close any other dialogs first
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      setViewingEmployee(employee);
      console.log('✅ Employee set for viewing:', employee);
    } catch (error) {
      console.error('❌ Error setting viewing employee:', error);
      toast({
        title: "Error",
        description: "Failed to open employee details",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = (employee: StaffMember) => {
    // Close view dialog first
    setViewingEmployee(null);
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await updateEmployee(employeeId, { status: 'terminated' });
        toast({
          title: "Success",
          description: "Employee has been terminated.",
        });
        await refreshData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to terminate employee.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Employee ID', 'Email', 'Phone', 'Department', 'Role', 'Status', 'Start Date'],
      ...filteredStaff.map(member => [
        `${member.firstName} ${member.lastName}`,
        member.employeeId,
        member.email,
        member.phone,
        member.department,
        member.role,
        member.status,
        member.startDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_directory.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Staff data exported successfully.",
    });
  };

  const handleCreateEmployee = async (employeeData: any) => {
    try {
      await createEmployee({
        employee_id: `EMP${Date.now()}`,
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        department_id: employeeData.departmentId,
        position: employeeData.position,
        manager_id: employeeData.managerId,
        start_date: employeeData.startDate,
        salary: employeeData.salary,
        status: employeeData.status || 'active',
        work_type: employeeData.workType || 'full_time',
        location: employeeData.location,
        emergency_contact_name: employeeData.emergencyContactName,
        emergency_contact_phone: employeeData.emergencyContactPhone
      });
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      await refreshData();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleUpdateEmployee = async (employeeData: any) => {
    if (!editingEmployee) return;
    try {
      await updateEmployee(editingEmployee.id, {
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        department_id: employeeData.departmentId,
        position: employeeData.position,
        manager_id: employeeData.managerId,
        salary: employeeData.salary,
        status: employeeData.status,
        work_type: employeeData.workType,
        location: employeeData.location,
        emergency_contact_name: employeeData.emergencyContactName,
        emergency_contact_phone: employeeData.emergencyContactPhone
      });
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      await refreshData();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Teacher & Staff Management</h1>
        <p className="text-muted-foreground">HR for academic and non-academic staff with contracts, CPD tracking, and performance reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-3xl font-bold text-primary">{totalStaff}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{activeStaff}</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-3xl font-bold text-warning">{onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-3xl font-bold text-primary">{departments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="timesheet">Time Sheet</TabsTrigger>
          <TabsTrigger value="cpd">CPD Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Staff Directory</span>
                  </CardTitle>
                  <CardDescription>Manage academic and non-academic staff records</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    className="shadow-[var(--shadow-elegant)]"
                    onClick={() => {
                      // Close view dialog first
                      setViewingEmployee(null);
                      setShowEmployeeForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff by name, email, department, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {dbDepartments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow 
                        key={member.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          console.log('🟢 ENTIRE ROW CLICKED for:', member.firstName, member.lastName);
                          console.log('🟢 viewingEmployee state before:', viewingEmployee);
                          handleViewEmployee(member);
                          console.log('🟢 viewingEmployee state after:', member);
                        }}
                        data-testid={`employee-row-${member.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.firstName[0]}{member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              {member.subjects && (
                                <div className="text-sm text-muted-foreground">
                                  {member.subjects.join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{member.employeeId}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{member.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.startDate}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('👁️ VIEW BUTTON CLICKED for:', member.firstName, member.lastName);
                                handleViewEmployee(member);
                              }}
                              title="View Employee Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEmployee(member);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEmployee(member.id);
                              }}
                              disabled={member.status === 'terminated'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheet">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Time Sheet Management</span>
                  </CardTitle>
                  <CardDescription>Track staff working hours and attendance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Export time sheet data
                      const csvContent = [
                        ['Employee', 'Date', 'Hours', 'Project', 'Description'],
                        ...timeEntries.map(entry => [
                          entry.employee_id,
                          entry.start_time,
                          entry.hours_worked,
                          entry.project_id || 'N/A',
                          entry.task_description || 'N/A'
                        ])
                      ].map(row => row.join(',')).join('\n');

                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'timesheet_data.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                      
                      toast({
                        title: "Success",
                        description: "Timesheet data exported successfully.",
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeEntries.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeEntries.slice(0, 10).map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.employee_id}</TableCell>
                            <TableCell>{new Date(entry.start_time).toLocaleDateString()}</TableCell>
                            <TableCell>{entry.hours_worked}h</TableCell>
                            <TableCell>{entry.project_id || 'N/A'}</TableCell>
                            <TableCell>{entry.task_description || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Time Entries</h3>
                    <p className="text-muted-foreground">No time sheet entries found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cpd">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>CPD Tracking</span>
              </CardTitle>
              <CardDescription>Monitor continuing professional development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">CPD Management</h3>
                <p className="text-muted-foreground">Professional development tracking and certification coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Details Dialog */}
      <Dialog open={!!viewingEmployee} onOpenChange={(open) => {
        console.log('🔧 Dialog onOpenChange called with:', open, 'viewingEmployee:', !!viewingEmployee);
        if (!open) setViewingEmployee(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View complete employee information
            </DialogDescription>
          </DialogHeader>
          {viewingEmployee && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {viewingEmployee.firstName?.[0] || 'U'}{viewingEmployee.lastName?.[0] || 'N'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewingEmployee.firstName || 'Unknown'} {viewingEmployee.lastName || 'Name'}
                  </h3>
                  <p className="text-muted-foreground">{viewingEmployee.role || 'No role specified'}</p>
                  {getStatusBadge(viewingEmployee.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="text-sm">{viewingEmployee.employeeId || 'Not assigned'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-sm">{viewingEmployee.department || 'No department'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <p className="text-sm">
                      {viewingEmployee.startDate 
                        ? new Date(viewingEmployee.startDate).toLocaleDateString()
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  {viewingEmployee.location && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p className="text-sm">{viewingEmployee.location}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{viewingEmployee.email || 'No email provided'}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{viewingEmployee.phone || 'Not provided'}</span>
                    </p>
                  </div>
                  {viewingEmployee.salary != null && viewingEmployee.salary > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Salary</label>
                      <p className="text-sm">${Number(viewingEmployee.salary).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {viewingEmployee.subjects && Array.isArray(viewingEmployee.subjects) && viewingEmployee.subjects.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subjects</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingEmployee.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">{subject}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setViewingEmployee(null)}>
                  Close
                </Button>
                <Button onClick={() => handleEditEmployee(viewingEmployee)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Employee
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Form Dialog */}
      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogDescription>
              {editingEmployee ? 'Update employee information' : 'Enter details for the new employee'}
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            employee={editingEmployee}
            departments={dbDepartments}
            employees={dbEmployees}
            onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
            onCancel={() => {
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            }}
            isSubmitting={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;