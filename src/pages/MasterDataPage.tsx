import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { useMasterData } from '@/hooks/useMasterData';
import { 
  Database,
  School as SchoolIcon,
  BookOpen,
  Users,
  GraduationCap,
  Home,
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash,
  BarChart3,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export function MasterDataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const form = useForm();
  
  const {
    isLoading,
    schools,
    subjects,
    students,
    parents,
    createSchool,
    createSubject,
    createStudent,
    updateSchool,
    updateSubject,
    updateStudent,
    deleteRecord,
    getEntityCounts,
    getActiveEntities,
    refreshData
  } = useMasterData();

  const entityCounts = getEntityCounts();
  const activeEntities = getActiveEntities();

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject => 
    subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subject_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student => 
    student.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.year_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Master Data Management</h1>
              <p className="text-sm text-muted-foreground">
                Centralized management of core school data entities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2">
              <CheckCircle className="h-3 w-3" />
              Data Synchronized
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <Download className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                  <SchoolIcon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.schools}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeEntities.schools} active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                  <BookOpen className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.subjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeEntities.subjects} active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.students}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeEntities.students} enrolled
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.parents}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Family contacts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Data Quality Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Data Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Schools</span>
                      <Badge variant="secondary">{entityCounts.schools}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Subjects</span>
                      <Badge variant="secondary">{entityCounts.subjects}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Students</span>
                      <Badge variant="secondary">{entityCounts.students}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Parents</span>
                      <Badge variant="secondary">{entityCounts.parents}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Bulk Import Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Data Quality Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Relationship Mapping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SchoolIcon className="h-5 w-5" />
                    Schools Management
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search schools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add School
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New School</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                          try {
                            await createSchool({
                              name: data.name,
                              code: data.code,
                              address: data.address,
                              contact_email: data.contact_email,
                              contact_phone: data.contact_phone,
                              is_active: true,
                              settings: {}
                            });
                            form.reset();
                          } catch (error) {
                            console.error('Error creating school:', error);
                          }
                        })}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">School Name</label>
                              <Input {...form.register('name')} placeholder="School Name" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">School Code</label>
                              <Input {...form.register('code')} placeholder="SCH001" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Contact Email</label>
                              <Input {...form.register('contact_email')} type="email" placeholder="admin@school.edu" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Contact Phone</label>
                              <Input {...form.register('contact_phone')} placeholder="+44 20 1234 5678" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Address</label>
                            <Textarea {...form.register('address')} placeholder="School address..." />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button type="submit">Add School</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading schools...</div>
                ) : filteredSchools.length === 0 ? (
                  <div className="text-center py-12">
                    <SchoolIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No schools found</h3>
                    <p className="text-muted-foreground">Create your first school to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchools.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{school.name}</p>
                              <p className="text-sm text-muted-foreground">{school.address}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{school.code}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{school.contact_email}</p>
                              <p className="text-xs text-muted-foreground">{school.contact_phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={school.is_active ? 'default' : 'secondary'}>
                              {school.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => deleteRecord('schools', school.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Subjects Management
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Subject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Subject</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                          try {
                            await createSubject({
                              school_id: schools[0]?.id || '', // Use first school for now
                              subject_name: data.subject_name,
                              subject_code: data.subject_code,
                              color_code: data.color_code,
                              requires_lab: data.requires_lab === 'true',
                              periods_per_week: parseInt(data.periods_per_week) || 0,
                              is_active: true
                            });
                            form.reset();
                          } catch (error) {
                            console.error('Error creating subject:', error);
                          }
                        })}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Subject Name</label>
                              <Input {...form.register('subject_name')} placeholder="Mathematics" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Subject Code</label>
                              <Input {...form.register('subject_code')} placeholder="MATH" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Color Code</label>
                              <Input {...form.register('color_code')} placeholder="#3B82F6" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Periods Per Week</label>
                              <Input {...form.register('periods_per_week')} type="number" placeholder="5" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Requires Lab</label>
                            <Select onValueChange={(value) => form.setValue('requires_lab', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="false">No</SelectItem>
                                <SelectItem value="true">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button type="submit">Add Subject</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading subjects...</div>
                ) : filteredSubjects.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
                    <p className="text-muted-foreground">Create your first subject to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Lab Required</TableHead>
                        <TableHead>Periods/Week</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {subject.color_code && (
                                <div 
                                  className="w-4 h-4 rounded-full border" 
                                  style={{ backgroundColor: subject.color_code }}
                                />
                              )}
                              <span className="font-medium">{subject.subject_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{subject.subject_code}</TableCell>
                          <TableCell>
                            <Badge variant={subject.requires_lab ? 'default' : 'secondary'}>
                              {subject.requires_lab ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>{subject.periods_per_week || 'Not set'}</TableCell>
                          <TableCell>
                            <Badge variant={subject.is_active ? 'default' : 'secondary'}>
                              {subject.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => deleteRecord('subjects', subject.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Students Management
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No students found</h3>
                    <p className="text-muted-foreground">Student data will be displayed here.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Number</TableHead>
                        <TableHead>Year Group</TableHead>
                        <TableHead>Form Class</TableHead>
                        <TableHead>Admission Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.student_number}</TableCell>
                          <TableCell>{student.year_group}</TableCell>
                          <TableCell>{student.form_class || 'Not assigned'}</TableCell>
                          <TableCell>
                            {student.admission_date ? new Date(student.admission_date).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.is_enrolled ? 'default' : 'secondary'}>
                              {student.is_enrolled ? 'Enrolled' : 'Not Enrolled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs placeholders */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Staff Management</h3>
                <p className="text-muted-foreground">Staff data management will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parents" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Parent Management</h3>
                <p className="text-muted-foreground">Parent and guardian data management will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Data Relationships</h3>
                <p className="text-muted-foreground">Manage relationships between different data entities.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
