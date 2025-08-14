import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, GraduationCap, TrendingUp, Eye } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { useStudentData } from "@/hooks/useStudentData";
import { useAcademicData } from "@/hooks/useAcademicData";
import { StudentQuickView } from "@/components/shared/StudentQuickView";
import { useToast } from "@/hooks/use-toast";

export default function StudentsPage() {
  const { students, loading } = useStudentData();
  const { yearGroups } = useAcademicData();
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearGroup, setSelectedYearGroup] = useState("all");
  const { hasRole, currentSchool } = useRBAC();
  const { toast } = useToast();

  useEffect(() => {
    let filtered = students.filter(student =>
      student.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedYearGroup !== "all") {
      filtered = filtered.filter(student => student.year_group === selectedYearGroup);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, selectedYearGroup, students]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getStatusBadge = (isEnrolled: boolean) => {
    return isEnrolled ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const canManageStudents = hasRole('school_admin') || hasRole('dsl') || hasRole('teacher');

  if (!currentSchool) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please select a school to view students.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">
            Manage and view student information for {currentSchool.name}
          </p>
        </div>
        {canManageStudents && (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Bulk Import",
                  description: "Bulk import functionality will be implemented soon.",
                });
              }}
            >
              Bulk Import
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Export Students",
                  description: "Student export functionality will be implemented soon.",
                });
              }}
            >
              Export Students
            </Button>
            <Button onClick={() => {
              toast({
                title: "Add Student",
                description: "Student creation form will be implemented soon.",
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Active enrollments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year Groups</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearGroups.length}</div>
            <p className="text-xs text-muted-foreground">
              Active year groups
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Term</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => 
                s.admission_date && 
                new Date(s.admission_date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 90 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(students.map(s => s.form_class).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Active classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by year group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Year Groups</SelectItem>
                {yearGroups.map((yearGroup) => (
                  <SelectItem key={yearGroup.id} value={yearGroup.name}>
                    {yearGroup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>
            Manage student records and view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading students...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Year Group</TableHead>
                  <TableHead>Form Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.profiles?.avatar_url} />
                          <AvatarFallback>
                            {getInitials(student.profiles?.first_name || '', student.profiles?.last_name || '')}
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
                    <TableCell className="font-mono">{student.student_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.year_group}</Badge>
                    </TableCell>
                    <TableCell>{student.form_class || 'Not assigned'}</TableCell>
                    <TableCell>{getStatusBadge(student.is_enrolled)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StudentQuickView 
                          student={student}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

