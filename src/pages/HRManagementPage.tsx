import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
import { supabase } from '@/integrations/supabase/client';
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
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showPerformanceForm, setShowPerformanceForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);

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
      // Get the first available school_id from user roles if user is not super_admin
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('school_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .not('school_id', 'is', null)
        .limit(1);

      const schoolId = userRoles?.[0]?.school_id;

      await createEmployee({
        employee_id: `EMP${Date.now()}`,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        phone: employeeData.phone,
        department_id: employeeData.department_id,
        position: employeeData.position,
        manager_id: employeeData.manager_id,
        start_date: employeeData.start_date,
        salary: employeeData.salary,
        status: employeeData.status || 'active',
        work_type: employeeData.work_type,
        location: employeeData.location,
        emergency_contact_name: employeeData.emergency_contact_name,
        emergency_contact_phone: employeeData.emergency_contact_phone,
        bank_account_details: {},
        tax_information: {},
        benefits: {},
        school_id: schoolId
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
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-primary to-primary-glow"
                onClick={() => setShowTimeEntryForm(true)}
              >
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

  // Render Leave Management
  const renderLeaveManagement = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Leave Management</CardTitle>
              <CardDescription>Manage employee leave requests and approvals</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary-glow"
              onClick={() => setShowLeaveForm(true)}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              New Leave Request
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{leave.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {leave.type} • {leave.startDate} to {leave.endDate} • {leave.days} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={leave.status === 'pending' ? 'secondary' : leave.status === 'approved' ? 'default' : 'destructive'}>
                    {leave.status}
                  </Badge>
                  {leave.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => processLeaveRequest(leave.id, 'approved')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => processLeaveRequest(leave.id, 'rejected')}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Performance Management
  const renderPerformance = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Performance Management</CardTitle>
              <CardDescription>Track and manage employee performance reviews and goals</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary-glow"
              onClick={() => setShowPerformanceForm(true)}
            >
              <Target className="h-4 w-4 mr-2" />
              Add Performance Review
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {performanceReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.review_type} Review</p>
                    <p className="text-sm text-muted-foreground">Rating: {review.overall_rating || 'N/A'}/10</p>
                  </div>
                </div>
                <Badge variant={review.status === 'final' ? 'default' : 'secondary'}>
                  {review.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Training Management  
  const renderTraining = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Training & Development</CardTitle>
              <CardDescription>Employee learning and development programs</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary-glow"
              onClick={() => setShowTrainingForm(true)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Add Training Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {trainingCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{course.course_title}</p>
                    <p className="text-sm text-muted-foreground">{course.course_description}</p>
                  </div>
                </div>
                <Badge variant="default">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Payroll Management
  const renderPayroll = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Payroll Management</CardTitle>
              <CardDescription>Payroll processing and management</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary-glow"
              onClick={() => toast({ title: "Payroll", description: "Payroll processing functionality coming soon!" })}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Process Payroll
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {payrollData.map((payroll) => (
              <div key={payroll.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">{payroll.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{payroll.payPeriod} • £{payroll.netSalary}</p>
                  </div>
                </div>
                <Badge variant={payroll.status === 'paid' ? 'default' : payroll.status === 'processed' ? 'secondary' : 'outline'}>
                  {payroll.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <PageHeader
        title="Human Resources"
        description="Comprehensive HR management system"
      />
      
      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 mb-6">
          <CardContent className="p-2">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                setActiveTab(value);
                setSearchParams({ tab: value });
              }} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto p-1 bg-transparent gap-1">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-medium">Dashboard</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="employees" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Employees</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="timeTracking" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <Timer className="h-4 w-4" />
                  <span className="text-xs font-medium">Timesheet</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="attendance" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="text-xs font-medium">Attendance</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="leave" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Leave</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="recruitment" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-xs font-medium">Recruitment</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="performance" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium">Performance</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="training" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-medium">Training</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="payroll" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-medium">Payroll</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="benefits" 
                  className="flex flex-col gap-1.5 h-16 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 rounded-lg"
                >
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-medium">Benefits</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'employees' && renderEmployees()}
          {activeTab === 'timeTracking' && renderTimesheet()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'recruitment' && <RecruitmentDashboard />}
          {activeTab === 'employee-exit' && <EmployeeExit employees={employees} />}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'training' && renderTraining()}
          {activeTab === 'benefits' && renderComingSoon('Benefits Management', 'Employee benefits and compensation packages', Award, 'Add Benefits Plan')}
          {activeTab === 'leave' && renderLeaveManagement()}
          {activeTab === 'payroll' && renderPayroll()}
        </div>
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

      {/* Time Entry Form Modal */}
      {showTimeEntryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Time Entry</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              try {
                await createTimeEntry({
                  employee_id: formData.get('employee_id') as string,
                  project_id: formData.get('project_id') as string,
                  task_description: formData.get('task_description') as string,
                  hours_worked: Number(formData.get('hours_worked')),
                  start_time: `${formData.get('date')}T09:00:00`,
                  end_time: `${formData.get('date')}T17:00:00`,
                  is_billable: true,
                  status: 'draft'
                });
                setShowTimeEntryForm(false);
                toast({ title: "Success", description: "Time entry added successfully!" });
              } catch (error) {
                toast({ title: "Error", description: "Failed to add time entry" });
              }
            }} className="space-y-4">
              <div>
                <Label htmlFor="employee_id">Employee</Label>
                <Select name="employee_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task_description">Task Description</Label>
                <Input name="task_description" required />
              </div>
              <div>
                <Label htmlFor="hours_worked">Hours Worked</Label>
                <Input name="hours_worked" type="number" step="0.5" required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input name="date" type="date" required />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowTimeEntryForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Entry</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Request Form Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">New Leave Request</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const startDate = formData.get('start_date') as string;
              const endDate = formData.get('end_date') as string;
              const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1;
              
              try {
                await createLeaveRequest({
                  employee_id: formData.get('employee_id') as string,
                  leave_type: formData.get('leave_type') as string,
                  start_date: startDate,
                  end_date: endDate,
                  days_requested: daysDiff,
                  reason: formData.get('reason') as string
                });
                setShowLeaveForm(false);
                toast({ title: "Success", description: "Leave request submitted successfully!" });
              } catch (error) {
                toast({ title: "Error", description: "Failed to submit leave request" });
              }
            }} className="space-y-4">
              <div>
                <Label htmlFor="employee_id">Employee</Label>
                <Select name="employee_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="leave_type">Leave Type</Label>
                <Select name="leave_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input name="start_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input name="end_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea name="reason" rows={3} />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowLeaveForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Performance Review Form Modal */}
      {showPerformanceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Performance Review</h2>
            <p className="text-muted-foreground mb-4">Performance review functionality coming soon!</p>
            <Button onClick={() => setShowPerformanceForm(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Training Course Form Modal */}
      {showTrainingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Training Course</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              try {
                await createTrainingCourse({
                  course_title: formData.get('course_name') as string,
                  course_description: formData.get('description') as string,
                  course_type: 'online',
                  max_participants: Number(formData.get('max_participants')),
                  course_materials: {}
                });
                setShowTrainingForm(false);
                toast({ title: "Success", description: "Training course added successfully!" });
              } catch (error) {
                toast({ title: "Error", description: "Failed to add training course" });
              }
            }} className="space-y-4">
              <div>
                <Label htmlFor="course_name">Course Name</Label>
                <Input name="course_name" required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input name="duration" placeholder="e.g., 2 hours, 1 day" required />
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input name="max_participants" type="number" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" rows={3} />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowTrainingForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Course</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}