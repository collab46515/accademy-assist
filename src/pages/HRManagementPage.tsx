import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  DollarSign, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Briefcase, 
  Calendar as CalendarIcon, 
  Target, 
  Award, 
  BookOpen, 
  HeartHandshake, 
  MessageSquare, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Clock3, 
  CreditCard, 
  PieChart, 
  BarChart3, 
  Activity, 
  Archive, 
  Send,
  Plane,
  Timer,
  Folder,
  Package,
  ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHRData } from '@/hooks/useHRData';
import { useComprehensiveHR } from '@/hooks/useComprehensiveHR';
import { RecruitmentDashboard } from '@/components/recruitment/RecruitmentDashboard';
import { EmployeeForm } from '@/components/hr/EmployeeForm';
import { EmployeeExit } from '@/components/hr/EmployeeExit';
import { PageHeader } from '@/components/layout/PageHeader';

export function HRManagementPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'dashboard';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  // Use real HR data from database
  const {
    loading,
    employees: dbEmployees,
    departments: dbDepartments,
    leaveRequests: dbLeaveRequests,
    attendanceRecords,
    payrollRecords,
    createEmployee,
    updateEmployee,
    createDepartment,
    createLeaveRequest,
    processLeaveRequest,
    recordAttendance,
    processPayroll,
    updatePayrollStatus,
    refreshData
  } = useHRData();

  // Use comprehensive HR data
  const {
    loading: comprehensiveLoading,
    performanceReviews,
    performanceGoals,
    jobPostings,
    jobApplications,
    trainingCourses,
    trainingEnrollments,
    benefitPlans,
    companyAssets,
    projects,
    timeEntries,
    travelRequests,
    expenseReports,
    engagementSurveys,
    createJobPosting,
    createTrainingCourse,
    createProject,
    createTimeEntry,
    updateApplicationStatus,
    refreshData: refreshComprehensiveData
  } = useComprehensiveHR();

  // Transform database data to match UI expectations
  const employees = dbEmployees.map(emp => ({
    id: emp.id,
    employeeId: emp.employee_id,
    name: `${emp.first_name} ${emp.last_name}`,
    email: emp.email,
    phone: emp.phone || '',
    department: emp.department_id,
    position: emp.position,
    manager: emp.manager_id || '',
    startDate: emp.start_date,
    salary: emp.salary,
    status: emp.status as 'active' | 'inactive' | 'terminated',
    avatar: '/placeholder.svg',
    location: emp.location || '',
    workType: emp.work_type.replace('_', '-') as 'full-time' | 'part-time' | 'contract' | 'intern',
    performance: 85,
    attendanceRate: 94,
    leaveBalance: 20,
    certifications: []
  }));

  const departments = dbDepartments.map(dept => ({
    id: dept.id,
    name: dept.name,
    head: dept.department_head_id || 'Not assigned',
    employeeCount: dbEmployees.filter(emp => emp.department_id === dept.id).length,
    budget: dept.budget || 0,
    description: dept.description || ''
  }));

  const leaveRequests = dbLeaveRequests.map(leave => ({
    id: leave.id,
    employeeId: leave.employee_id,
    employeeName: (() => {
      const emp = dbEmployees.find(e => e.id === leave.employee_id);
      return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
    })(),
    type: leave.leave_type,
    startDate: leave.start_date,
    endDate: leave.end_date,
    days: leave.days_requested,
    status: leave.status as 'pending' | 'approved' | 'rejected',
    reason: leave.reason || '',
    approver: leave.approved_by || undefined
  }));

  const payrollData = payrollRecords.map(payroll => ({
    id: payroll.id,
    employeeId: payroll.employee_id,
    employeeName: (() => {
      const emp = dbEmployees.find(e => e.id === payroll.employee_id);
      return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
    })(),
    basicSalary: payroll.basic_salary,
    allowances: payroll.allowances,
    deductions: payroll.total_deductions,
    netSalary: payroll.net_salary,
    payPeriod: `${payroll.pay_period_start} to ${payroll.pay_period_end}`,
    status: payroll.status as 'draft' | 'processed' | 'paid',
    payDate: payroll.pay_date || ''
  }));

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    pendingLeaves: leaveRequests.filter(l => l.status === 'pending').length,
    avgPerformance: employees.length > 0 ? Math.round(employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length) : 0
  };

  // Sync activeTab with URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
        emergency_contact_phone: employeeData.emergencyContactPhone,
        bank_account_details: {},
        tax_information: {},
        benefits: {}
      });
      setShowEmployeeForm(false);
      await refreshData();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading HR data...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="border-2 border-border/40 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer" 
          onClick={() => setSearchParams({ tab: 'employees' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                <p className="text-xs text-success">+2.5% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-border/40 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:border-success/50 transition-all duration-300 cursor-pointer" 
          onClick={() => setSearchParams({ tab: 'employees' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                <p className="text-3xl font-bold text-success">{stats.activeEmployees}</p>
                <p className="text-xs text-success">98.2% retention rate</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-border/40 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:border-warning/50 transition-all duration-300 cursor-pointer" 
          onClick={() => setSearchParams({ tab: 'leave' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Leaves</p>
                <p className="text-3xl font-bold text-warning">{stats.pendingLeaves}</p>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock3 className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-border/40 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:border-info/50 transition-all duration-300 cursor-pointer" 
          onClick={() => setSearchParams({ tab: 'performance' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-3xl font-bold text-info">{stats.avgPerformance}%</p>
                <p className="text-xs text-info">Above target</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used HR functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-3 hover:bg-primary/5 hover:border-primary transition-all duration-200" 
              onClick={() => setShowEmployeeForm(true)}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Add Employee</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-3 hover:bg-warning/5 hover:border-warning transition-all duration-200"
              onClick={() => setSearchParams({ tab: 'leave' })}
            >
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-warning" />
              </div>
              <span className="font-medium">Process Leave</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-3 hover:bg-success/5 hover:border-success transition-all duration-200"
              onClick={() => setSearchParams({ tab: 'payroll' })}
            >
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
              <span className="font-medium">Run Payroll</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-3 hover:bg-info/5 hover:border-info transition-all duration-200"
            >
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-info" />
              </div>
              <span className="font-medium">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSearchParams({ tab: 'leave' })}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.slice(0, 3).map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{leave.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{leave.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{leave.type} • {leave.days} days</p>
                    </div>
                  </div>
                  <Badge variant={leave.status === 'pending' ? 'secondary' : leave.status === 'approved' ? 'default' : 'destructive'}>
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Department Overview</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.slice(0, 3).map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">{dept.employeeCount} employees</p>
                    </div>
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
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Employee Directory</CardTitle>
              <CardDescription>Manage all employee information and profiles</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="hover:bg-muted/50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary" onClick={() => setShowEmployeeForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
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

          <div className="grid gap-4">
            {employees.slice(0, 8).map((employee) => (
              <Card key={employee.id} className="border border-border/50 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-primary/10">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{employee.name}</h3>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {employee.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{employee.position}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {employee.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Performance:</span>
                          <Badge variant="outline">{employee.performance}%</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Attendance:</span>
                          <Badge variant="outline">{employee.attendanceRate}%</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-primary/5"
                          onClick={() => {
                            console.log('Viewing employee:', employee.name);
                            toast({
                              title: "View Employee",
                              description: `Viewing details for ${employee.name}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-primary/5"
                          onClick={() => {
                            console.log('Editing employee:', employee.name);
                            setEditingEmployee(employee);
                            setShowEmployeeForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
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
    </div>
  );

  const renderComingSoon = (title: string, description: string, icon: any, actionText: string) => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            {React.createElement(icon, { className: "h-16 w-16 text-muted-foreground mx-auto mb-6" })}
            <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This comprehensive feature is being developed and will be available soon.
            </p>
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
              <Plus className="h-4 w-4 mr-2" />
              {actionText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Timesheet Management
  const renderTimesheet = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Time Tracking & Timesheets</CardTitle>
              <CardDescription>Track employee hours and manage timesheets</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Timesheets
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow">
                <Timer className="h-4 w-4 mr-2" />
                Add Time Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">168</p>
                    <p className="text-sm text-muted-foreground">Hours This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Time Entries</h3>
            {timeEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {entry.employee_id?.slice(0, 2).toUpperCase() || 'EE'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{entry.task_description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toISOString().split('T')[0]} • {entry.hours_worked} hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={entry.status === 'approved' ? 'default' : 'secondary'}>
                    {entry.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Attendance Management
  const renderAttendance = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="text-xl">Attendance Management</CardTitle>
          <CardDescription>Track and manage employee attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">95%</p>
                  <p className="text-sm text-muted-foreground">Average Attendance</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.activeEmployees}</p>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">3</p>
                  <p className="text-sm text-muted-foreground">Late Arrivals</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">2</p>
                  <p className="text-sm text-muted-foreground">Absent Today</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Today's Attendance</h3>
            {employees.slice(0, 6).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={Math.random() > 0.2 ? 'default' : 'destructive'}>
                    {Math.random() > 0.2 ? 'Present' : 'Absent'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">09:15 AM</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'employees':
        return renderEmployees();
      case 'timesheet':
        return renderTimesheet();
      case 'attendance':
        return renderAttendance();
      case 'recruitment':
        return <RecruitmentDashboard />;
      case 'employee-exit':
        return <EmployeeExit employees={employees} />;
      case 'performance':
        return renderComingSoon('Performance Management', 'Track and manage employee performance reviews and goals', Target, 'Add Performance Review');
      case 'training':
        return renderComingSoon('Training & Development', 'Employee learning and development programs', BookOpen, 'Add Training Course');
      case 'benefits':
        return renderComingSoon('Benefits Management', 'Employee benefits and compensation packages', Award, 'Add Benefits Plan');
      case 'leave':
        return renderComingSoon('Leave Management', 'Manage employee leave requests and approvals', CalendarIcon, 'Process Leave Request');
      case 'payroll':
        return renderComingSoon('Payroll Management', 'Payroll processing and management', DollarSign, 'Process Payroll');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <PageHeader
        title="HR Management"
        description="Complete human resources management system"
        showBackButton={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'HR Management' }
        ]}
      />
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              HR Management
            </h1>
            <p className="text-lg text-muted-foreground">Complete human resources management system</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {stats.totalEmployees} Employees
            </Badge>
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg" onClick={() => setShowEmployeeForm(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 mb-6">
          <CardContent className="p-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto p-1">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 p-3">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="employees" className="flex items-center gap-2 p-3">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Employees</span>
                </TabsTrigger>
                <TabsTrigger value="timesheet" className="flex items-center gap-2 p-3">
                  <Timer className="h-4 w-4" />
                  <span className="hidden sm:inline">Timesheet</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="flex items-center gap-2 p-3">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Attendance</span>
                </TabsTrigger>
                <TabsTrigger value="leave" className="flex items-center gap-2 p-3">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Leave</span>
                </TabsTrigger>
                <TabsTrigger value="recruitment" className="flex items-center gap-2 p-3">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Recruitment</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2 p-3">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Performance</span>
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-2 p-3">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Training</span>
                </TabsTrigger>
                <TabsTrigger value="payroll" className="flex items-center gap-2 p-3">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Payroll</span>
                </TabsTrigger>
                <TabsTrigger value="benefits" className="flex items-center gap-2 p-3">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Benefits</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {renderContent()}
      </div>

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <EmployeeForm
              employee={editingEmployee}
              departments={dbDepartments}
              employees={dbEmployees}
              onSubmit={handleCreateEmployee}
              onCancel={() => {
                setShowEmployeeForm(false);
                setEditingEmployee(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}