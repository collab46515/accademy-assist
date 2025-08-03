import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle, FileText, DollarSign, User, MapPin, Phone, Mail, Building, Briefcase, Calendar as CalendarIcon, Target, Award, BookOpen, HeartHandshake, MessageSquare, Settings, Plus, Search, Filter, Edit, Trash2, Download, Upload, Eye, UserPlus, UserCheck, UserX, Clock3, CreditCard, PieChart, BarChart3, Activity, Archive, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager: string;
  startDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  avatar: string;
  location: string;
  workType: 'full-time' | 'part-time' | 'contract' | 'intern';
  performance: number;
  attendanceRate: number;
  leaveBalance: number;
  certifications: string[];
}

interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  budget: number;
  description: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  approver?: string;
}

interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payPeriod: string;
  status: 'draft' | 'processed' | 'paid';
  payDate: string;
}

export function HRManagementPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Mock data
  const employees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+44 7700 900123',
      department: 'Engineering',
      position: 'Senior Developer',
      manager: 'Sarah Johnson',
      startDate: '2022-01-15',
      salary: 75000,
      status: 'active',
      avatar: '/placeholder.svg',
      location: 'London, UK',
      workType: 'full-time',
      performance: 92,
      attendanceRate: 96,
      leaveBalance: 18,
      certifications: ['AWS Certified', 'React Expert']
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+44 7700 900124',
      department: 'Marketing',
      position: 'Marketing Manager',
      manager: 'Michael Brown',
      startDate: '2021-08-10',
      salary: 62000,
      status: 'active',
      avatar: '/placeholder.svg',
      location: 'Manchester, UK',
      workType: 'full-time',
      performance: 88,
      attendanceRate: 94,
      leaveBalance: 15,
      certifications: ['Digital Marketing', 'Google Analytics']
    }
  ];

  const departments: Department[] = [
    { id: '1', name: 'Engineering', head: 'Sarah Johnson', employeeCount: 45, budget: 2800000, description: 'Software development and technical operations' },
    { id: '2', name: 'Marketing', head: 'Michael Brown', employeeCount: 22, budget: 850000, description: 'Brand management and customer acquisition' },
    { id: '3', name: 'Sales', head: 'David Wilson', employeeCount: 18, budget: 720000, description: 'Revenue generation and client relations' },
    { id: '4', name: 'HR', head: 'Lisa Anderson', employeeCount: 8, budget: 480000, description: 'Human resources and talent management' }
  ];

  const leaveRequests: LeaveRequest[] = [
    { id: '1', employeeId: 'EMP001', employeeName: 'John Smith', type: 'Annual Leave', startDate: '2024-02-15', endDate: '2024-02-19', days: 5, status: 'pending', reason: 'Family vacation' },
    { id: '2', employeeId: 'EMP002', employeeName: 'Emily Davis', type: 'Sick Leave', startDate: '2024-02-10', endDate: '2024-02-12', days: 3, status: 'approved', reason: 'Medical appointment', approver: 'Michael Brown' }
  ];

  const payrollData: Payroll[] = [
    { id: '1', employeeId: 'EMP001', employeeName: 'John Smith', basicSalary: 6250, allowances: 500, deductions: 750, netSalary: 6000, payPeriod: 'February 2024', status: 'processed', payDate: '2024-02-28' },
    { id: '2', employeeId: 'EMP002', employeeName: 'Emily Davis', basicSalary: 5167, allowances: 300, deductions: 617, netSalary: 4850, payPeriod: 'February 2024', status: 'paid', payDate: '2024-02-28' }
  ];

  const handleApproveLeave = (id: string) => {
    toast({ title: "Leave Approved", description: "Leave request has been approved successfully." });
  };

  const handleRejectLeave = (id: string) => {
    toast({ title: "Leave Rejected", description: "Leave request has been rejected." });
  };

  const handleProcessPayroll = (id: string) => {
    toast({ title: "Payroll Processed", description: "Payroll has been processed successfully." });
  };

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    pendingLeaves: leaveRequests.filter(l => l.status === 'pending').length,
    avgPerformance: Math.round(employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Management</h1>
          <p className="text-muted-foreground">Complete human resources management system</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Employees</p>
                    <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Employees</p>
                    <p className="text-3xl font-bold text-green-600">{stats.activeEmployees}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Leaves</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingLeaves}</p>
                  </div>
                  <Clock3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Performance</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.avgPerformance}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used HR functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <UserPlus className="h-6 w-6" />
                  <span>Add Employee</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CalendarIcon className="h-6 w-6" />
                  <span>Process Leave</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span>Run Payroll</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Generate Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.slice(0, 3).map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{leave.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{leave.type} • {leave.days} days</p>
                      </div>
                      <Badge variant={leave.status === 'pending' ? 'secondary' : leave.status === 'approved' ? 'default' : 'destructive'}>
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.slice(0, 3).map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">{dept.employeeCount} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{(dept.budget / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-muted-foreground">Budget</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Employee Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>Manage all employee information and profiles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{employee.name}</h3>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {employee.phone}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {employee.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Performance: {employee.performance}%</p>
                        <Progress value={employee.performance} className="w-20 h-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {/* Department Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{department.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Department Head</span>
                      <span className="font-medium">{department.head}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Employees</span>
                      <Badge variant="outline">{department.employeeCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Annual Budget</span>
                      <span className="font-medium">£{(department.budget / 1000).toFixed(0)}K</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Management */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Dashboard</CardTitle>
              <CardDescription>Monitor and manage employee attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">96%</p>
                  <p className="text-sm text-muted-foreground">Average Attendance</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-sm text-muted-foreground">Late Arrivals Today</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <UserX className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-muted-foreground">Absent Today</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Today's Attendance</h3>
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">Check-in: 09:15 AM</p>
                        <p className="text-xs text-muted-foreground">Hours: 8h 30m</p>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-6">
          {/* Leave Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leave Management</CardTitle>
                  <CardDescription>Process and track employee leave requests</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Leave Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((leave) => (
                  <div key={leave.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{leave.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{leave.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">{leave.type}</p>
                        </div>
                      </div>
                      <Badge variant={leave.status === 'pending' ? 'secondary' : leave.status === 'approved' ? 'default' : 'destructive'}>
                        {leave.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{leave.startDate} to {leave.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Days</p>
                        <p className="font-medium">{leave.days} day(s)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="font-medium">{leave.reason}</p>
                      </div>
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproveLeave(leave.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectLeave(leave.id)}>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          {/* Payroll Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payroll Management</CardTitle>
                  <CardDescription>Process employee salaries and manage payroll</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Payroll
                  </Button>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payroll
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollData.map((payroll) => (
                  <div key={payroll.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{payroll.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">{payroll.payPeriod}</p>
                      </div>
                      <Badge variant={payroll.status === 'paid' ? 'default' : payroll.status === 'processed' ? 'secondary' : 'outline'}>
                        {payroll.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Basic Salary</p>
                        <p className="font-medium">£{payroll.basicSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allowances</p>
                        <p className="font-medium text-green-600">+£{payroll.allowances.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Deductions</p>
                        <p className="font-medium text-red-600">-£{payroll.deductions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Net Salary</p>
                        <p className="font-bold">£{payroll.netSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        {payroll.status === 'draft' && (
                          <Button size="sm" onClick={() => handleProcessPayroll(payroll.id)}>
                            Process
                          </Button>
                        )}
                        {payroll.status === 'processed' && (
                          <Button size="sm" variant="outline">
                            <Send className="h-4 w-4 mr-2" />
                            Send Payslip
                          </Button>
                        )}
                        {payroll.status === 'paid' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Management */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Track and manage employee performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Performance</span>
                          <span className="text-sm font-medium">{employee.performance}%</span>
                        </div>
                        <Progress value={employee.performance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Attendance</span>
                          <span className="text-sm font-medium">{employee.attendanceRate}%</span>
                        </div>
                        <Progress value={employee.attendanceRate} className="h-2" />
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                        <div className="flex flex-wrap gap-1">
                          {employee.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-3">
                        View Performance Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports & Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Reports</CardTitle>
                <CardDescription>Generate comprehensive HR reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Employee Directory Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Attendance Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="h-4 w-4 mr-2" />
                    Performance Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payroll Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Leave Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Key HR metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Employee Turnover Rate</span>
                      <span className="font-medium text-green-600">2.3%</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Time to Hire</span>
                      <span className="font-medium">18 days</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Employee Satisfaction</span>
                      <span className="font-medium text-blue-600">4.6/5</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Training Completion Rate</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}