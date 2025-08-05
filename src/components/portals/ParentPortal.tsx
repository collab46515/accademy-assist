import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar,
  BookOpen,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  Star,
  Award,
  DollarSign,
  PlaneTakeoff,
  Briefcase,
  Building,
  Download,
  Eye
} from 'lucide-react';

export function ParentPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('parent');
  
  // Mock data to check if parent is also a staff member
  const isStaffMember = true; // In real app, this would come from user context/auth
  
  const parentData = {
    name: 'David Johnson',
    employee_id: 'EMP002', // Only if staff member
    department: 'History', // Only if staff member
    position: 'History Teacher', // Only if staff member
  };

  const children = [
    { 
      name: 'Emma Johnson', 
      class: 'Year 8A', 
      attendance: 96,
      recentGrades: [
        { subject: 'Mathematics', grade: 'A-', date: '2024-01-15' },
        { subject: 'English', grade: 'B+', date: '2024-01-12' },
        { subject: 'Science', grade: 'A', date: '2024-01-10' }
      ]
    }
  ];

  const upcomingEvents = [
    { date: '2024-01-20', event: 'Parent-Teacher Conference', time: '2:00 PM', type: 'meeting' },
    { date: '2024-01-22', event: 'Science Fair', time: '10:00 AM', type: 'event' },
    { date: '2024-01-25', event: 'School Report Due', time: 'All Day', type: 'academic' }
  ];

  const recentMessages = [
    { from: 'Ms. Smith (Mathematics)', message: 'Emma is showing excellent progress in algebra', time: '2 hours ago', unread: true },
    { from: 'School Office', message: 'Reminder: Parent-Teacher Conference on Friday', time: '1 day ago', unread: false },
    { from: 'Mr. Johnson (Form Tutor)', message: 'Weekly progress update attached', time: '3 days ago', unread: false }
  ];

  const homework = [
    { subject: 'Mathematics', task: 'Complete worksheet 5.2', due: 'Tomorrow', status: 'pending' },
    { subject: 'English', task: 'Read Chapter 7-9', due: 'Friday', status: 'in-progress' },
    { subject: 'Science', task: 'Lab report on photosynthesis', due: 'Next week', status: 'not-started' }
  ];

  // Staff-specific data (shown only if isStaffMember is true)
  const staffPayrollData = [
    { month: 'November 2024', gross: '£3,500.00', net: '£2,650.00', status: 'Paid' },
    { month: 'October 2024', gross: '£3,500.00', net: '£2,650.00', status: 'Paid' },
    { month: 'September 2024', gross: '£3,500.00', net: '£2,650.00', status: 'Paid' },
  ];

  const staffLeaveBalance = {
    annual: { total: 25, used: 6, remaining: 19 },
    sick: { total: 10, used: 1, remaining: 9 },
    personal: { total: 3, used: 0, remaining: 3 },
  };

  const myLeaveRequests = [
    { id: '1', type: 'Annual Leave', dates: '15-17 Dec 2024', days: 3, status: 'approved' },
    { id: '2', type: 'Sick Leave', dates: '2 Nov 2024', days: 1, status: 'approved' },
    { id: '3', type: 'Annual Leave', dates: '20 Jan 2025', days: 2, status: 'pending' },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'event': return 'bg-green-100 text-green-700';
      case 'academic': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getHomeworkStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'not-started': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const ParentContent = () => (
    <div className="space-y-6">
      {/* Child Overview */}
      {children.map((child, index) => (
        <Card key={index} className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-bold">
                {child.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl">{child.name}</h2>
                <p className="text-sm text-muted-foreground">{child.class}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance</span>
                  <span className="text-sm font-bold">{child.attendance}%</span>
                </div>
                <Progress value={child.attendance} className="h-2" />
                <p className="text-xs text-muted-foreground">Excellent attendance this term</p>
              </div>

              {/* Recent Grades */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Recent Grades</span>
                <div className="space-y-1">
                  {child.recentGrades.slice(0, 3).map((grade, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs">{grade.subject}</span>
                      <Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Quick Actions</span>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Report Card
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Meeting
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={`p-3 rounded-lg ${getEventTypeColor(event.type)}`}>
                <p className="font-medium text-sm">{event.event}</p>
                <p className="text-xs opacity-80">{event.date} at {event.time}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View School Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.map((message, index) => (
              <div key={index} className={`p-3 rounded-lg border ${message.unread ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'}`}>
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm">{message.from}</p>
                  {message.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                <p className="text-sm text-muted-foreground">{message.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All Messages
            </Button>
          </CardContent>
        </Card>

        {/* Homework Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Homework Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {homework.map((hw, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-sm">{hw.subject}</p>
                  <Badge className={getHomeworkStatusColor(hw.status)} variant="outline">
                    {hw.status.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{hw.task}</p>
                <p className="text-xs text-muted-foreground mt-1">Due: {hw.due}</p>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/parents/academics/assignments')}
            >
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Academic Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { subject: 'Mathematics', grade: 'A-', trend: 'up', teacher: 'Ms. Smith' },
              { subject: 'English', grade: 'B+', trend: 'stable', teacher: 'Mr. Wilson' },
              { subject: 'Science', grade: 'A', trend: 'up', teacher: 'Dr. Brown' },
              { subject: 'History', grade: 'B', trend: 'down', teacher: 'Ms. Davis' }
            ].map((subject, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{subject.subject}</h3>
                  <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{subject.teacher}</p>
                <div className="flex items-center gap-1">
                  {subject.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {subject.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                  {subject.trend === 'stable' && <div className="w-4 h-4 border-t-2 border-gray-400" />}
                  <span className="text-xs text-muted-foreground capitalize">{subject.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Mathematics Excellence', description: 'Top performer in Year 8 mathematics', date: '2024-01-15', type: 'academic' },
              { title: 'Perfect Attendance', description: 'No absences this term', date: '2024-01-10', type: 'attendance' },
              { title: 'Science Fair Winner', description: '1st place in environmental science', date: '2024-01-08', type: 'competition' }
            ].map((achievement, index) => (
              <div key={index} className="border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StaffContent = () => (
    <div className="space-y-6">
      {/* Staff Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Staff Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
              <p className="font-medium">{parentData.employee_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" />
                Department
              </label>
              <p className="font-medium">{parentData.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              <p className="font-medium">{parentData.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Payroll Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Payslips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffPayrollData.slice(0, 3).map((payslip, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{payslip.month}</p>
                    <p className="text-xs text-muted-foreground">Net: {payslip.net}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {payslip.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                View All Payslips
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlaneTakeoff className="h-5 w-5" />
              Leave Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(staffLeaveBalance).map(([type, balance]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{type} Leave</span>
                    <span className="text-sm font-bold text-green-600">{balance.remaining} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(balance.used / balance.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Used: {balance.used}</span>
                    <span>Total: {balance.total}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                Request Leave
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myLeaveRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{request.type}</p>
                  <p className="text-xs text-muted-foreground">{request.dates} • {request.days} day(s)</p>
                </div>
                <Badge className={getStatusBadgeColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Staff Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'View Timetable', description: 'Teaching schedule', icon: Calendar, color: 'bg-blue-500' },
              { title: 'Submit Grades', description: 'Grade student work', icon: TrendingUp, color: 'bg-green-500' },
              { title: 'Lesson Plans', description: 'Plan and review', icon: BookOpen, color: 'bg-purple-500' },
              { title: 'Staff Directory', description: 'Contact colleagues', icon: User, color: 'bg-orange-500' }
            ].map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center mx-auto mb-2`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
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
            <h1 className="text-3xl font-bold">
              {isStaffMember ? 'Parent & Staff Portal' : 'Parent Portal'}
            </h1>
            <p className="text-muted-foreground">
              {isStaffMember 
                ? `Welcome back, ${parentData.name}! Access both parent and staff information.`
                : 'Stay connected with your child\'s education journey'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Contact School
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>

        {/* Tabs for Parent/Staff views */}
        {isStaffMember ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Parent View
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Staff View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parent">
              <ParentContent />
            </TabsContent>

            <TabsContent value="staff">
              <StaffContent />
            </TabsContent>
          </Tabs>
        ) : (
          <ParentContent />
        )}
      </div>
    </div>
  );
}