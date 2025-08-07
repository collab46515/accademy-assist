import React, { useState, useMemo, useCallback } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { useHRData } from '@/hooks/useHRData';
import { useFeeData } from '@/hooks/useFeeData';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { useAcademicData } from '@/hooks/useAcademicData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AISystemAdminAssistant } from '@/components/shared/AISystemAdminAssistant';
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
  TrendingUp,
  Bot,
  Sparkles,
  MessageSquare,
  Settings,
  Shield
} from 'lucide-react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const [showSystemAdmin, setShowSystemAdmin] = useState(false);
  
  const { students, loading: studentsLoading } = useStudentData();
  const { employees, loading: hrLoading } = useHRData();
  const { feeHeads, loading: feesLoading } = useFeeData();
  const { attendanceRecords } = useAttendanceData();
  const { subjects } = useAcademicData();

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredStudents = useMemo(() => 
    students.filter(student => 
      `${student.profiles?.first_name} ${student.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]
  );

  const filteredTeachers = useMemo(() => 
    employees.filter(employee => 
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [employees, searchTerm]
  );

  // Memoize calculated stats to prevent recalculation on every render
  const { totalStudents, totalTeachers, pendingFees, todayAttendance } = useMemo(() => ({
    totalStudents: students.length,
    totalTeachers: employees.filter(emp => emp.position?.includes('Teacher')).length,
    pendingFees: 450, // Mock data
    todayAttendance: Math.round((students.length * 0.92)) // Mock 92% attendance
  }), [students.length, employees]);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-primary to-primary-glow text-primary-foreground py-20 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 animate-pulse"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/8 rounded-full blur-lg animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                Pappaya Academy Dashboard
              </h1>
              <p className="text-xl md:text-2xl opacity-95 mb-12 leading-relaxed max-w-3xl mx-auto">
                Complete overview and control of your educational institution with real-time insights and powerful AI-powered tools
              </p>
            </div>
            

            {/* Enhanced Search Bar with Glass Morphism */}
            <div className="max-w-2xl mx-auto relative group animate-scale-in delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-500"></div>
              <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                <Input
                  type="text"
                  placeholder="Search students, teachers, ID numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 pr-6 py-6 bg-transparent text-white placeholder:text-white/60 border-0 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
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
            <div key={index} className="animate-fade-in hover-scale h-full" style={{ animationDelay: `${index * 100}ms` }}>
              <Card 
                className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full"
                onClick={stat.action}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 h-full">
                  <div className="flex items-center justify-between h-full">
                    <div className="space-y-3 flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight line-clamp-2">{stat.label}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-none">{stat.value}</p>
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-tight line-clamp-1">{stat.trend}</p>
                    </div>
                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg flex-shrink-0 self-center`}>
                      <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Enhanced Search Results */}
        {searchTerm && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Students Results */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Students ({filteredStudents.length} found)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredStudents.slice(0, 8).map((student) => (
                    <Dialog key={student.id}>
                      <DialogTrigger asChild>
                        <div className="flex items-start space-x-4 p-4 rounded-xl border border-border/50 hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-md">
                          <Avatar className="h-14 w-14 border-2 border-primary/20">
                            <AvatarImage src={student.profiles?.avatar_url} />
                            <AvatarFallback className="text-lg font-semibold bg-primary/10">
                              {student.profiles?.first_name?.[0]}{student.profiles?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-lg">
                                {student.profiles?.first_name} {student.profiles?.last_name}
                              </h4>
                              <Badge variant={student.is_enrolled ? "default" : "secondary"} className="ml-2">
                                {student.is_enrolled ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">ID:</span>
                                <span>{student.student_number}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Year:</span>
                                <span>{student.year_group}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Class:</span>
                                <span>{student.form_class || 'Not assigned'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Joined:</span>
                                <span>{student.admission_date ? new Date(student.admission_date).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                            
                            {/* Parent Contact Information */}
                            <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-medium text-foreground">Parent Contact</span>
                              </div>
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Primary Parent:</span>
                                  <span className="font-medium">Mrs. {student.profiles?.last_name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Phone:</span>
                                  <span className="font-mono text-primary">+44 7700 900123</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span className="text-primary text-xs">parent.{student.profiles?.last_name?.toLowerCase() || 'contact'}@email.com</span>
                                </div>
                              </div>
                            </div>

                            {student.emergency_contact_name && (
                              <div className="mt-2 p-2 bg-destructive/5 border border-destructive/20 rounded-lg">
                                <div className="text-xs">
                                  <span className="font-medium text-destructive">Emergency Contact:</span>
                                  <div className="text-muted-foreground mt-1">
                                    {student.emergency_contact_name}
                                    {student.emergency_contact_phone && (
                                      <span className="ml-2 font-mono text-destructive">• {student.emergency_contact_phone}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogTrigger>
                      <StudentDetailModal student={student} />
                    </Dialog>
                  ))}
                  {filteredStudents.length > 8 && (
                    <div className="text-center p-4 text-muted-foreground">
                      <p className="text-sm">+{filteredStudents.length - 8} more students</p>
                      <Button variant="outline" size="sm" className="mt-2">View All Students</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Teachers Results */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Teachers ({filteredTeachers.length} found)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredTeachers.slice(0, 8).map((teacher) => (
                    <Dialog key={teacher.id}>
                      <DialogTrigger asChild>
                        <div className="flex items-start space-x-4 p-4 rounded-xl border border-border/50 hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-md">
                          <Avatar className="h-14 w-14 border-2 border-primary/20">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-lg font-semibold bg-primary/10">
                              {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-lg">
                                {teacher.first_name} {teacher.last_name}
                              </h4>
                              <Badge variant={teacher.status === 'active' ? "default" : "secondary"} className="ml-2">
                                {teacher.status === 'active' ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">ID:</span>
                                <span>{teacher.employee_id}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Position:</span>
                                <span>{teacher.position}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Email:</span>
                                <span className="truncate">{teacher.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Started:</span>
                                <span>{teacher.start_date ? new Date(teacher.start_date).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{teacher.phone || 'No phone'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="capitalize">{teacher.work_type?.replace('_', ' ') || 'Full time'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <TeacherDetailModal teacher={teacher} />
                    </Dialog>
                  ))}
                  {filteredTeachers.length > 8 && (
                    <div className="text-center p-4 text-muted-foreground">
                      <p className="text-sm">+{filteredTeachers.length - 8} more teachers</p>
                      <Button variant="outline" size="sm" className="mt-2">View All Teachers</Button>
                    </div>
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

        {/* Enhanced Modal for detailed view with animations */}
        {activeModal && (
          <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
            <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden animate-scale-in">
              <DialogHeader className="animate-fade-in">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  {activeModal === 'students' && (
                    <>
                      <Users className="h-6 w-6 text-primary" />
                      All Students ({students.length})
                    </>
                  )}
                  {activeModal === 'teachers' && (
                    <>
                      <GraduationCap className="h-6 w-6 text-primary" />
                      All Teachers ({employees.length})
                    </>
                  )}
                  {activeModal === 'attendance' && (
                    <>
                      <UserCheck className="h-6 w-6 text-primary" />
                      Attendance Overview
                    </>
                  )}
                  {activeModal === 'fees' && (
                    <>
                      <Banknote className="h-6 w-6 text-primary" />
                      Fee Management
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              {activeModal === 'students' && (
                <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[60vh]">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Total Students: {students.length}</p>
                        <p className="text-sm text-muted-foreground">
                          Showing first {Math.min(20, students.length)} students (optimized for performance)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Performance Note:</p>
                      <p className="text-xs text-amber-600">
                        For 1000+ students, pagination & search will be implemented
                      </p>
                    </div>
                  </div>
                  
                  {/* Performance Warning for Large Datasets */}
                  {students.length > 50 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Performance Optimization Required</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        For {students.length}+ records, implementing pagination, virtual scrolling, and search indexing is recommended.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid gap-4">
                    {students.slice(0, 20).map((student, index) => (
                      <Dialog key={student.id}>
                        <DialogTrigger asChild>
                          <div 
                            className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                              <AvatarImage src={student.profiles?.avatar_url} />
                              <AvatarFallback className="text-lg font-semibold bg-primary/10">
                                {student.profiles?.first_name?.[0]}{student.profiles?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-semibold text-foreground">
                                  {student.profiles?.first_name} {student.profiles?.last_name}
                                </h4>
                                <Badge variant={student.is_enrolled ? "default" : "secondary"} className="shrink-0">
                                  {student.is_enrolled ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">ID:</span>
                                  <span className="font-mono">{student.student_number}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Year:</span>
                                  <span>{student.year_group}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Class:</span>
                                  <span>{student.form_class}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Joined:</span>
                                  <span>{student.admission_date ? new Date(student.admission_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                              </div>
                              
                              {student.emergency_contact_name && (
                                <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    <span className="font-medium text-destructive text-sm">Emergency Contact</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">{student.emergency_contact_name}</span>
                                    {student.emergency_contact_phone && (
                                      <span className="ml-2 font-mono text-destructive">• {student.emergency_contact_phone}</span>
                                    )}
                                    <div className="text-xs text-muted-foreground mt-1 italic">
                                      * Mock data - would be from enrollment records in real system
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogTrigger>
                        <StudentDetailModal student={student} />
                      </Dialog>
                    ))}
                    
                    {students.length > 20 && (
                      <div className="text-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                        <p className="text-muted-foreground font-medium">
                          +{students.length - 20} more students not shown
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pagination and search would be implemented for production use
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" disabled>
                          Load More (Demo)
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeModal === 'teachers' && (
                <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[60vh]">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/5 to-green-400/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-full">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Total Teachers: {employees.length}</p>
                        <p className="text-sm text-muted-foreground">
                          Showing first {Math.min(20, employees.length)} staff members (optimized for performance)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Performance Note:</p>
                      <p className="text-xs text-amber-600">
                        For 200+ staff, pagination & filtering will be implemented
                      </p>
                    </div>
                  </div>
                  
                  {/* Performance Warning for Large Datasets */}
                  {employees.length > 50 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Performance Optimization Required</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        For {employees.length}+ records, implementing departmental filtering and search indexing is recommended.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid gap-4">
                    {employees.slice(0, 20).map((teacher, index) => (
                      <Dialog key={teacher.id}>
                        <DialogTrigger asChild>
                          <div 
                            className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <Avatar className="h-16 w-16 border-2 border-green-500/20">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-lg font-semibold bg-green-500/10">
                                {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-semibold text-foreground">
                                  {teacher.first_name} {teacher.last_name}
                                </h4>
                                <Badge variant={teacher.status === 'active' ? "default" : "secondary"} className="shrink-0">
                                  {teacher.status === 'active' ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">ID:</span>
                                  <span className="font-mono">{teacher.employee_id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Position:</span>
                                  <span className="truncate">{teacher.position}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Department:</span>
                                  <span className="truncate">{teacher.department_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Started:</span>
                                  <span>{new Date(teacher.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate text-primary">{teacher.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-mono text-primary">{teacher.phone}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-md">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Work Type:</span>
                                  <span className="font-medium capitalize">{teacher.work_type?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                  <span className="text-muted-foreground">Salary:</span>
                                  <span className="font-medium">£{teacher.salary?.toLocaleString()}/year</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <TeacherDetailModal teacher={teacher} />
                      </Dialog>
                    ))}
                    
                    {employees.length > 20 && (
                      <div className="text-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                        <p className="text-muted-foreground font-medium">
                          +{employees.length - 20} more staff members not shown
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Department filtering and search would be implemented for production use
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" disabled>
                          Load More (Demo)
                        </Button>
                      </div>
                    )}
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
        

        {/* AI System Admin Assistant */}
        <AISystemAdminAssistant
          systemData={[...students, ...employees]} // Combined system data
          userData={employees}
          databaseStats={{ totalStudents: students.length, totalStaff: employees.length }}
          context="School ERP System Administration"
          queryType="system_admin"
          isOpen={showSystemAdmin}
          onClose={() => setShowSystemAdmin(false)}
        />
      </div>
    </div>
  );
}