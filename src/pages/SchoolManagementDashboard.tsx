import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Users, 
  GraduationCap, 
  UserCheck, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { useStudentData } from '@/hooks/useStudentData';
import { StudentQuickView } from '@/components/shared/StudentQuickView';

// Mock staff data
const mockStaff = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'Head Teacher',
    department: 'Leadership',
    status: 'active',
    phone: '+44 7700 900123',
    startDate: '2019-09-01'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@school.edu',
    role: 'Mathematics Teacher',
    department: 'Mathematics',
    status: 'active',
    phone: '+44 7700 900456',
    startDate: '2020-01-15'
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@school.edu',
    role: 'English Teacher',
    department: 'English',
    status: 'on_leave',
    phone: '+44 7700 900789',
    startDate: '2021-09-01'
  }
];

export default function SchoolManagementDashboard() {
  const { students, loading } = useStudentData();
  const [studentSearch, setStudentSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [studentYearFilter, setStudentYearFilter] = useState('all');
  const [staffDepartmentFilter, setStaffDepartmentFilter] = useState('all');

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default', label: 'Active' },
      on_leave: { variant: 'secondary', label: 'On Leave' },
      inactive: { variant: 'destructive', label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const filteredStudents = students.filter(student => {
    const searchTerm = studentSearch.toLowerCase();
    const matchesSearch = 
      student.profiles?.first_name?.toLowerCase().includes(searchTerm) ||
      student.profiles?.last_name?.toLowerCase().includes(searchTerm) ||
      student.student_number.toLowerCase().includes(searchTerm) ||
      student.profiles?.email?.toLowerCase().includes(searchTerm);
    
    const matchesYear = studentYearFilter === 'all' || student.year_group === studentYearFilter;
    
    return matchesSearch && matchesYear;
  });

  const filteredStaff = mockStaff.filter(staff => {
    const searchTerm = staffSearch.toLowerCase();
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchTerm) ||
      staff.lastName.toLowerCase().includes(searchTerm) ||
      staff.email.toLowerCase().includes(searchTerm) ||
      staff.role.toLowerCase().includes(searchTerm) ||
      staff.department.toLowerCase().includes(searchTerm);
    
    const matchesDepartment = staffDepartmentFilter === 'all' || staff.department === staffDepartmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const schoolStats = {
    totalStudents: students.length,
    totalStaff: mockStaff.length,
    activeStaff: mockStaff.filter(s => s.status === 'active').length,
    yearGroups: [...new Set(students.map(s => s.year_group))].length,
    enrollmentThisMonth: 8,
    attendanceRate: 94.2
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">School Management Dashboard</h1>
          <p className="text-muted-foreground">Complete overview and management of your school</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* School Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold">{schoolStats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Staff</p>
                <p className="text-3xl font-bold">{schoolStats.activeStaff}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Attendance Rate</p>
                <p className="text-3xl font-bold">{schoolStats.attendanceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">New Enrollments</p>
                <p className="text-3xl font-bold">{schoolStats.enrollmentThisMonth}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full lg:w-fit grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Year Groups</span>
                  <span className="font-semibold">{schoolStats.yearGroups}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Student-Teacher Ratio</span>
                  <span className="font-semibold">{Math.round(schoolStats.totalStudents / schoolStats.activeStaff)}:1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Staff on Leave</span>
                  <span className="font-semibold">{mockStaff.filter(s => s.status === 'on_leave').length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest school activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">8 new student enrollments processed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Attendance reports generated for all year groups</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Staff meeting scheduled for tomorrow</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Directory
              </CardTitle>
              <CardDescription>Search and manage all students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name, student number, or email..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={studentYearFilter} onValueChange={setStudentYearFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Year Groups</SelectItem>
                    <SelectItem value="Year 7">Year 7</SelectItem>
                    <SelectItem value="Year 8">Year 8</SelectItem>
                    <SelectItem value="Year 9">Year 9</SelectItem>
                    <SelectItem value="Year 10">Year 10</SelectItem>
                    <SelectItem value="Year 11">Year 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student Number</TableHead>
                      <TableHead>Year Group</TableHead>
                      <TableHead>Form Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading students...
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No students found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(
                                    student.profiles?.first_name || '',
                                    student.profiles?.last_name || ''
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {student.profiles?.first_name} {student.profiles?.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {student.profiles?.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {student.student_number}
                          </TableCell>
                          <TableCell>{student.year_group}</TableCell>
                          <TableCell>{student.form_class || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={student.is_enrolled ? 'default' : 'secondary'}>
                              {student.is_enrolled ? 'Enrolled' : 'Not Enrolled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StudentQuickView 
                              student={student}
                              trigger={
                                <Button variant="ghost" size="sm">
                                  View Details
                                </Button>
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Staff Directory
              </CardTitle>
              <CardDescription>Search and manage all staff members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, role, or department..."
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={staffDepartmentFilter} onValueChange={setStaffDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No staff members found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(staff.firstName, staff.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {staff.firstName} {staff.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {staff.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{staff.role}</TableCell>
                          <TableCell>{staff.department}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{staff.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{staff.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(staff.status)}
                          </TableCell>
                          <TableCell>{new Date(staff.startDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                School Alerts & Notifications
              </CardTitle>
              <CardDescription>Important alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium">Attendance Alert</h4>
                    <p className="text-sm text-muted-foreground">3 students have attendance below 85% this term</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium">Staff Meeting Reminder</h4>
                    <p className="text-sm text-muted-foreground">Weekly staff meeting scheduled for tomorrow at 3:30 PM</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Users className="h-5 w-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium">New Enrollments</h4>
                    <p className="text-sm text-muted-foreground">8 new students enrolled this month, all documentation complete</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}