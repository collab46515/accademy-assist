import React, { useState } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { useHRData } from '@/hooks/useHRData';
import { useFeeData } from '@/hooks/useFeeData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Banknote, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const { students, loading: studentsLoading } = useStudentData();
  const { employees, loading: hrLoading } = useHRData();
  const { feeHeads, loading: feesLoading } = useFeeData();

  // Filter students and teachers based on search
  const filteredStudents = students.filter(student => 
    `${student.profiles?.first_name} ${student.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = employees.filter(employee => 
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalStudents = students.length;
  const totalTeachers = employees.filter(emp => emp.position?.includes('Teacher')).length;
  const pendingFees = 450; // Mock data
  const todayAttendance = Math.round((totalStudents * 0.92)); // Mock 92% attendance

  const quickStats = [
    { 
      label: "Total Students", 
      value: totalStudents.toString(), 
      icon: Users, 
      color: "bg-blue-500",
      trend: "+12 this month",
      action: () => setActiveModal('students')
    },
    { 
      label: "Teachers", 
      value: totalTeachers.toString(), 
      icon: GraduationCap, 
      color: "bg-green-500",
      trend: "5 new hires",
      action: () => setActiveModal('teachers')
    },
    { 
      label: "Today's Attendance", 
      value: `${todayAttendance}/${totalStudents}`, 
      icon: UserCheck, 
      color: "bg-purple-500",
      trend: "92% present",
      action: () => setActiveModal('attendance')
    },
    { 
      label: "Pending Fees", 
      value: `£${pendingFees}k`, 
      icon: Banknote, 
      color: "bg-orange-500",
      trend: "£23k collected today",
      action: () => setActiveModal('fees')
    }
  ];

  const StudentDetailModal = ({ student }: { student: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Student Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Student Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={student.profiles?.avatar_url} />
            <AvatarFallback className="text-lg">
              {student.profiles?.first_name?.[0]}{student.profiles?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">
              {student.profiles?.first_name} {student.profiles?.last_name}
            </h3>
            <p className="text-muted-foreground">Student ID: {student.student_number}</p>
            <Badge variant={student.is_enrolled ? "default" : "secondary"}>
              {student.is_enrolled ? "Enrolled" : "Not Enrolled"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Year Group</label>
                <p>{student.year_group}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Form Class</label>
                <p>{student.form_class || 'Not assigned'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <p>{student.date_of_birth || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Admission Date</label>
                <p>{student.admission_date || 'Not provided'}</p>
              </div>
            </div>
            
            {student.emergency_contact_name && (
              <div>
                <label className="text-sm font-medium">Emergency Contact</label>
                <p>{student.emergency_contact_name}</p>
                <p className="text-sm text-muted-foreground">{student.emergency_contact_phone}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="academic">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.7</div>
                    <p className="text-xs text-muted-foreground">
                      +0.2 from last term
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      Active courses
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fees">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Outstanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">£450</div>
                    <p className="text-xs text-muted-foreground">
                      Due in 5 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Paid This Term</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">£2,150</div>
                    <p className="text-xs text-muted-foreground">
                      On time
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">95%</div>
                    <p className="text-xs text-muted-foreground">
                      18/19 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">This Term</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <p className="text-xs text-muted-foreground">
                      88/96 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Lates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      This month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );

  const TeacherDetailModal = ({ teacher }: { teacher: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Teacher Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Teacher Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">
              {teacher.first_name?.[0]}{teacher.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{teacher.first_name} {teacher.last_name}</h3>
            <p className="text-muted-foreground">ID: {teacher.employee_id}</p>
            <Badge variant={teacher.status === 'active' ? "default" : "secondary"}>
              {teacher.status === 'active' ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Position</label>
                <p>{teacher.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <p>{teacher.department_name || 'Not assigned'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <p>{teacher.start_date || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Work Type</label>
                <p className="capitalize">{teacher.work_type?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{teacher.email || 'No email'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{teacher.phone || 'No phone'}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Current week teaching schedule</p>
              <div className="grid gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <Card key={day}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{day}</span>
                        <span className="text-sm text-muted-foreground">6 periods</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leave">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">days left</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">this year</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">request</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Student Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.7/5</div>
                    <p className="text-xs text-muted-foreground">Based on feedback</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">teaching load</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-primary-glow to-primary/90 text-primary-foreground py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">School Management Dashboard</h1>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Complete overview of students, teachers, fees, and school operations
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-lg mx-auto relative group">
              <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search students, teachers, ID numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-background/95 backdrop-blur-sm text-foreground border-0 rounded-xl shadow-lg text-lg focus:shadow-xl transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {quickStats.map((stat, index) => (
            <div key={index} className="animate-fade-in hover-scale" style={{ animationDelay: `${index * 100}ms` }}>
              <Card 
                className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={stat.action}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight">{stat.label}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-none">{stat.value}</p>
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-tight truncate">{stat.trend}</p>
                    </div>
                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg flex-shrink-0`}>
                      <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Students Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Students ({filteredStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStudents.slice(0, 5).map((student) => (
                    <Dialog key={student.id}>
                      <DialogTrigger asChild>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted cursor-pointer">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.profiles?.avatar_url} />
                            <AvatarFallback>
                              {student.profiles?.first_name?.[0]}{student.profiles?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">
                              {student.profiles?.first_name} {student.profiles?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.student_number} • {student.year_group}
                            </p>
                          </div>
                          <Badge variant={student.is_enrolled ? "default" : "secondary"}>
                            {student.is_enrolled ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </DialogTrigger>
                      <StudentDetailModal student={student} />
                    </Dialog>
                  ))}
                  {filteredStudents.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{filteredStudents.length - 5} more students
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Teachers Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Teachers ({filteredTeachers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTeachers.slice(0, 5).map((teacher) => (
                    <Dialog key={teacher.id}>
                      <DialogTrigger asChild>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted cursor-pointer">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{teacher.first_name} {teacher.last_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.employee_id} • {teacher.position}
                            </p>
                          </div>
                          <Badge variant={teacher.status === 'active' ? "default" : "secondary"}>
                            {teacher.status === 'active' ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </DialogTrigger>
                      <TeacherDetailModal teacher={teacher} />
                    </Dialog>
                  ))}
                  {filteredTeachers.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{filteredTeachers.length - 5} more teachers
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity & Alerts */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Fee Payment Overdue</p>
                    <p className="text-xs text-muted-foreground">5 students have overdue payments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Low Attendance</p>
                    <p className="text-xs text-muted-foreground">3 students below 80% this month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Leave Requests</p>
                    <p className="text-xs text-muted-foreground">2 pending teacher leave requests</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Morning Assembly</span>
                  <span className="text-xs text-muted-foreground">8:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Staff Meeting</span>
                  <span className="text-xs text-muted-foreground">3:30 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Parent Evening</span>
                  <span className="text-xs text-muted-foreground">6:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Today's Collections</span>
                  <span className="font-medium text-green-600">£23,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Month</span>
                  <span className="font-medium">£125,890</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Outstanding</span>
                  <span className="font-medium text-red-600">£45,230</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drill-down Modals */}
        {activeModal && (
          <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {activeModal === 'students' && 'All Students'}
                  {activeModal === 'teachers' && 'All Teachers'}
                  {activeModal === 'attendance' && 'Attendance Overview'}
                  {activeModal === 'fees' && 'Fee Management'}
                </DialogTitle>
              </DialogHeader>
              
              {activeModal === 'students' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Total: {students.length} students</p>
                    <Button>Add New Student</Button>
                  </div>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.profiles?.avatar_url} />
                          <AvatarFallback>
                            {student.profiles?.first_name?.[0]}{student.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{student.profiles?.first_name} {student.profiles?.last_name}</p>
                          <p className="text-sm text-muted-foreground">{student.student_number} • {student.year_group}</p>
                        </div>
                        <Badge variant={student.is_enrolled ? "default" : "secondary"}>
                          {student.is_enrolled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeModal === 'teachers' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Total: {employees.length} staff members</p>
                    <Button>Add New Staff</Button>
                  </div>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {employees.map((teacher) => (
                      <div key={teacher.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{teacher.first_name} {teacher.last_name}</p>
                          <p className="text-sm text-muted-foreground">{teacher.employee_id} • {teacher.position}</p>
                        </div>
                        <Badge variant={teacher.status === 'active' ? "default" : "secondary"}>
                          {teacher.status === 'active' ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeModal === 'attendance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Today's Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">
                          {todayAttendance}/{totalStudents} present
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">This Week</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">89%</div>
                        <p className="text-xs text-muted-foreground">
                          Average attendance
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">12</div>
                        <p className="text-xs text-muted-foreground">
                          Low attendance warnings
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {activeModal === 'fees' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Outstanding</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">£{pendingFees}k</div>
                        <p className="text-xs text-muted-foreground">
                          From 156 students
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Collected Today</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">£23k</div>
                        <p className="text-xs text-muted-foreground">
                          45 payments received
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">£125k</div>
                        <p className="text-xs text-muted-foreground">
                          Total collections
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Overdue Fees</h4>
                    <div className="grid gap-2">
                      {['John Smith - £450 (5 days overdue)', 'Emma Wilson - £280 (2 days overdue)', 'Alex Johnson - £320 (7 days overdue)'].map((fee, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-sm">{fee}</span>
                          <Button size="sm" variant="outline">Send Reminder</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}