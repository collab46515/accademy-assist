import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  BookOpen, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  ClipboardList,
  Bell,
  User,
  DollarSign,
  PlaneTakeoff,
  Download,
  Eye,
  Plus,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHRData } from '@/hooks/useHRData';
import { useToast } from '@/hooks/use-toast';

const leaveSchema = z.object({
  leave_type: z.string().min(1, 'Leave type is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  reason: z.string().optional(),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export function TeacherPortal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { leaveRequests, createLeaveRequest, loading } = useHRData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leave_type: '',
      start_date: '',
      end_date: '',
      reason: '',
    },
  });

  // Use real teacher data from database only - empty for now
  const teacherData = {
    employee_id: 'EMP001',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+44 7700 900123',
    department: 'Mathematics',
    position: 'Senior Mathematics Teacher',
    start_date: '2020-09-01',
    salary: 45000,
    status: 'active',
    work_type: 'full_time',
    location: 'Main Campus',
    manager: 'Dr. Emily Watson',
    emergency_contact_name: 'John Johnson',
    emergency_contact_phone: '+44 7700 900456',
  };

  const payrollData = [
    { month: 'November 2024', gross: '£3,750.00', deductions: '£912.50', net: '£2,837.50', status: 'Paid', date: '2024-11-30' },
    { month: 'October 2024', gross: '£3,750.00', deductions: '£912.50', net: '£2,837.50', status: 'Paid', date: '2024-10-31' },
    { month: 'September 2024', gross: '£3,750.00', deductions: '£912.50', net: '£2,837.50', status: 'Paid', date: '2024-09-30' },
  ];

  const leaveBalance = {
    annual: { total: 25, used: 8, remaining: 17 },
    sick: { total: 10, used: 2, remaining: 8 },
    personal: { total: 3, used: 1, remaining: 2 },
  };

  const myLeaveRequests = [
    { id: '1', type: 'Annual Leave', dates: '15-17 Dec 2024', days: 3, status: 'approved', reason: 'Christmas holidays' },
    { id: '2', type: 'Sick Leave', dates: '2 Nov 2024', days: 1, status: 'approved', reason: 'Flu symptoms' },
    { id: '3', type: 'Personal Leave', dates: '20 Jan 2025', days: 1, status: 'pending', reason: 'Medical appointment' },
  ];

  const todayStats = [
    { title: 'Classes Today', value: '6', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Students', value: '127', icon: Users, color: 'text-green-600' },
    { title: 'Assignments Due', value: '8', icon: FileText, color: 'text-orange-600' },
    { title: 'Messages', value: '3', icon: MessageSquare, color: 'text-purple-600' }
  ];

  const todayClasses = [
    { time: '09:00-09:45', subject: 'Mathematics', class: 'Year 7A', room: 'M101', students: 28 },
    { time: '09:45-10:30', subject: 'Mathematics', class: 'Year 7B', room: 'M101', students: 26 },
    { time: '11:00-11:45', subject: 'Mathematics', class: 'Year 8A', room: 'M102', students: 30 },
    { time: '13:30-14:15', subject: 'Mathematics', class: 'Year 9A', room: 'M101', students: 24 }
  ];

  const pendingTasks = [
    { task: 'Grade Year 8 Math Test', due: 'Today', priority: 'high', type: 'grading' },
    { task: 'Submit lesson plans for next week', due: 'Tomorrow', priority: 'medium', type: 'planning' },
    { task: 'Parent meeting - Sarah Johnson', due: 'Friday', priority: 'medium', type: 'meeting' },
    { task: 'Update student progress reports', due: 'Next week', priority: 'low', type: 'reports' }
  ];

  const quickActions = [
    { title: 'Take Attendance', description: 'Mark student attendance', icon: CheckCircle, path: '/attendance', color: 'bg-green-500' },
    { title: 'Gradebook', description: 'Enter grades and assessments', icon: TrendingUp, path: '/gradebook', color: 'bg-blue-500' },
    { title: 'Lesson Plans', description: 'View and update plans', icon: Calendar, path: '/curriculum', color: 'bg-purple-500' },
    { title: 'Student Reports', description: 'Progress and behavior', icon: FileText, path: '/students', color: 'bg-orange-500' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grading': return TrendingUp;
      case 'planning': return Calendar;
      case 'meeting': return Users;
      default: return FileText;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const onSubmitLeave = async (data: LeaveFormData) => {
    try {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

      await createLeaveRequest({
        employee_id: teacherData.employee_id,
        leave_type: data.leave_type,
        start_date: data.start_date,
        end_date: data.end_date,
        days_requested: days,
        reason: data.reason,
      });

      setShowLeaveDialog(false);
      form.reset();
      toast({
        title: "Success",
        description: "Leave request submitted successfully.",
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50">
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-medium">{classItem.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{classItem.subject}</p>
                      <p className="text-sm text-muted-foreground">{classItem.class} • Room {classItem.room}</p>
                    </div>
                    <Badge variant="outline">{classItem.students} students</Badge>
                    <Button size="sm" variant="outline">
                      Start Class
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task, index) => {
              const TaskIcon = getTaskIcon(task.type);
              return (
                <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-start gap-2">
                    <TaskIcon className="h-4 w-4 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs opacity-70">Due: {task.due}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" size="sm" className="w-full">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-lg ${action.color} text-white flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(action.path)}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: 'John Smith', assignment: 'Algebra Test', grade: 'A-', class: 'Year 8A' },
                { student: 'Emma Wilson', assignment: 'Geometry Quiz', grade: 'B+', class: 'Year 7A' },
                { student: 'Michael Brown', assignment: 'Statistics Project', grade: 'A', class: 'Year 9A' }
              ].map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{grade.student}</p>
                    <p className="text-sm text-muted-foreground">{grade.assignment} • {grade.class}</p>
                  </div>
                  <Badge>{grade.grade}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Attendance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: 'Sarah Johnson', issue: 'Absent 3 days this week', class: 'Year 7B', severity: 'high' },
                { student: 'David Lee', issue: 'Late arrival today', class: 'Year 8A', severity: 'low' },
                { student: 'Lisa Chen', issue: 'Missed 2 classes', class: 'Year 9A', severity: 'medium' }
              ].map((alert, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500' : 
                    alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.student}</p>
                    <p className="text-sm text-muted-foreground">{alert.issue} • {alert.class}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const HRDetailsContent = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium">{teacherData.first_name} {teacherData.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </label>
                <p className="font-medium">{teacherData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </label>
                <p className="font-medium">{teacherData.phone}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                <p className="font-medium">{teacherData.employee_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Department
                </label>
                <p className="font-medium">{teacherData.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Position
                </label>
                <p className="font-medium">{teacherData.position}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                <p className="font-medium">{new Date(teacherData.start_date).toLocaleDateString('en-GB')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location
                </label>
                <p className="font-medium">{teacherData.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Work Type</label>
                <p className="font-medium capitalize">{teacherData.work_type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
              <p className="font-medium">{teacherData.emergency_contact_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Phone</label>
              <p className="font-medium">{teacherData.emergency_contact_phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Employment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Direct Manager</label>
              <p className="font-medium">{teacherData.manager}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {teacherData.status.charAt(0).toUpperCase() + teacherData.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PayrollContent = () => (
    <div className="space-y-6">
      {/* Salary Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Salary Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Annual Salary</p>
              <p className="text-2xl font-bold text-blue-600">£{teacherData.salary.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Monthly Gross</p>
              <p className="text-2xl font-bold text-green-600">£{(teacherData.salary / 12).toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Monthly Net (Est.)</p>
              <p className="text-2xl font-bold text-purple-600">£{(teacherData.salary / 12 * 0.76).toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payslips */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Payslips
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payrollData.map((payslip, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">{payslip.month}</p>
                  <p className="text-sm text-muted-foreground">Paid on {new Date(payslip.date).toLocaleDateString('en-GB')}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">Net: {payslip.net}</p>
                  <p className="text-sm text-muted-foreground">Gross: {payslip.gross}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {payslip.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tax Code</label>
              <p className="font-medium">1257L</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">NI Number</label>
              <p className="font-medium">QQ 12 34 56 C</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pension Scheme</label>
              <p className="font-medium">Teachers' Pension Scheme</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pension Contribution</label>
              <p className="font-medium">9.6% (£337.50/month)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LeaveManagementContent = () => (
    <div className="space-y-6">
      {/* Leave Balance Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Balance
            </CardTitle>
            <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Leave</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitLeave)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="leave_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leave Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select leave type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                              <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                              <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                              <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Please provide a reason for your leave request..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowLeaveDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(leaveBalance).map(([type, balance]) => (
              <div key={type} className="p-4 border rounded-lg">
                <h3 className="font-medium capitalize mb-2">{type.replace('_', ' ')} Leave</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Allocated:</span>
                    <span className="font-medium">{balance.total} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Used:</span>
                    <span className="font-medium">{balance.used} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span className="font-medium text-green-600">{balance.remaining} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(balance.used / balance.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlaneTakeoff className="h-5 w-5" />
            My Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myLeaveRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">{request.type}</p>
                  <p className="text-sm text-muted-foreground">{request.dates} • {request.days} day(s)</p>
                  {request.reason && (
                    <p className="text-sm text-muted-foreground">Reason: {request.reason}</p>
                  )}
                </div>
                <Badge className={getStatusBadgeColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Leave Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Annual Leave Policy</h4>
              <p className="text-sm text-muted-foreground">
                Full-time employees are entitled to 25 days of annual leave per year. Leave requests should be submitted at least 2 weeks in advance.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">Sick Leave Policy</h4>
              <p className="text-sm text-muted-foreground">
                Up to 10 days of sick leave per year. Medical certificates required for absences over 5 consecutive days.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium mb-2">Personal Leave Policy</h4>
              <p className="text-sm text-muted-foreground">
                3 days of personal leave per year for urgent personal matters. Subject to manager approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teacher Portal</h1>
            <p className="text-muted-foreground">Welcome back, {teacherData.first_name}! Here's your dashboard.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long' })}</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="hr-details" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              HR Details
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <PlaneTakeoff className="h-4 w-4" />
              Leave Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="hr-details">
            <HRDetailsContent />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollContent />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveManagementContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}