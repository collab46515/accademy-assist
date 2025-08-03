import React, { useState, useRef } from 'react';
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
import { useRBAC } from '@/hooks/useRBAC';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Download,
  Upload,
  Edit,
  Trash,
  BarChart3,
  TrendingUp,
  CheckCircle,
  FileText,
  Shield
} from 'lucide-react';

export function MasterDataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm();
  const { isSuperAdmin, isSchoolAdmin, currentSchool } = useRBAC();
  
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

  // Check admin access
  if (!isSuperAdmin() && !isSchoolAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators can access Master Data Management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleBulkUpload = (type: string) => {
    const templates = {
      schools: 'Name,Code,Address,Contact Email,Contact Phone\nExample School,EXS001,123 Main St,admin@example.edu,555-0123',
      students: 'Student Number,Year Group,User ID,School ID\nSTU001,Year 7,user-uuid,school-uuid',
      subjects: 'Subject Name,Subject Code,School ID\nMathematics,MATH,school-uuid',
      parents: 'Parent ID,Student ID,Relationship Type\nparent-uuid,student-uuid,Father'
    };
    
    const template = templates[type as keyof typeof templates];
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
          });
          return obj;
        });
        
        console.log('Processing CSV file:', file.name);
        console.log('Parsed data:', data);
        // TODO: Process the parsed CSV data based on active tab
        setUploadDialogOpen(false);
      };
      reader.readAsText(file);
    } else {
      console.error('Please select a valid CSV file');
    }
  };

  const handleExportAllData = () => {
    const exportData = [];
    
    // Export Schools
    if (schools.length > 0) {
      exportData.push('=== SCHOOLS ===');
      exportData.push('Name,Code,Address,Contact Email,Contact Phone,Is Active');
      schools.forEach(school => {
        exportData.push(`"${school.name}","${school.code}","${school.address || ''}","${school.contact_email || ''}","${school.contact_phone || ''}","${school.is_active}"`);
      });
      exportData.push('');
    }
    
    // Export Subjects
    if (subjects.length > 0) {
      exportData.push('=== SUBJECTS ===');
      exportData.push('Subject Name,Subject Code,Color Code,Requires Lab,Periods Per Week,Is Active');
      subjects.forEach(subject => {
        exportData.push(`"${subject.subject_name}","${subject.subject_code}","${subject.color_code || ''}","${subject.requires_lab}","${subject.periods_per_week || ''}","${subject.is_active}"`);
      });
      exportData.push('');
    }
    
    // Export Students
    if (students.length > 0) {
      exportData.push('=== STUDENTS ===');
      exportData.push('Student Number,Year Group,Form Class,Date of Birth,Emergency Contact Name,Emergency Contact Phone,Is Enrolled');
      students.forEach(student => {
        exportData.push(`"${student.student_number}","${student.year_group}","${student.form_class || ''}","${student.date_of_birth || ''}","${student.emergency_contact_name || ''}","${student.emergency_contact_phone || ''}","${student.is_enrolled}"`);
      });
      exportData.push('');
    }
    
    // Export Parents
    if (parents.length > 0) {
      exportData.push('=== PARENTS ===');
      exportData.push('Parent ID,Student ID,Relationship Type');
      parents.forEach(parent => {
        exportData.push(`"${parent.id}","${parent.student_id}","${parent.relationship_type || ''}"`);
      });
    }
    
    const csvData = exportData.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master_data_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingItem) {
        // Update existing item
        switch (activeTab) {
          case 'schools':
            await updateSchool(editingItem.id, data);
            break;
          case 'subjects':
            await updateSubject(editingItem.id, { ...data, school_id: currentSchool?.id });
            break;
          case 'students':
            await updateStudent(editingItem.id, { ...data, school_id: currentSchool?.id });
            break;
        }
      } else {
        // Create new item
        switch (activeTab) {
          case 'schools':
            await createSchool({ ...data, is_active: true, settings: {} });
            break;
          case 'subjects':
            await createSubject({ ...data, school_id: currentSchool?.id, is_active: true });
            break;
          case 'students':
            // Generate a temporary user_id that's a valid UUID
            const tempUserId = crypto.randomUUID();
            await createStudent({ 
              ...data, 
              school_id: currentSchool?.id || '',
              user_id: tempUserId,
              is_enrolled: true 
            });
            break;
        }
      }
      form.reset();
      setDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    form.reset(item);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading master data...</div>
      </div>
    );
  }

  const entityCounts = getEntityCounts();
  const activeEntities = getActiveEntities();

  const filteredData = {
    schools: schools.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    subjects: subjects.filter(item => 
      item.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject_code.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    students: students.filter(item => 
      item.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.form_class && item.form_class.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    parents: parents.filter(item => 
      (item.relationship_type && item.relationship_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.student_id && item.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  };

  const renderEntityForm = () => {
    switch (activeTab) {
      case 'schools':
        return (
          <div className="space-y-4">
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
          </div>
        );
      case 'subjects':
        return (
          <div className="space-y-4">
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
            <div>
              <label className="text-sm font-medium">Color Code</label>
              <Input {...form.register('color_code')} placeholder="#FF5733" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Requires Lab</label>
                <Select onValueChange={(value) => form.setValue('requires_lab', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Requires lab?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Periods per Week</label>
                <Input {...form.register('periods_per_week')} type="number" placeholder="5" />
              </div>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Student Number</label>
                <Input {...form.register('student_number')} placeholder="STU001" />
              </div>
              <div>
                <label className="text-sm font-medium">Year Group</label>
                <Input {...form.register('year_group')} placeholder="Year 7" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Form Class</label>
                <Input {...form.register('form_class')} placeholder="7A" />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <Input {...form.register('date_of_birth')} type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Emergency Contact Name</label>
                <Input {...form.register('emergency_contact_name')} placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-medium">Emergency Contact Phone</label>
                <Input {...form.register('emergency_contact_phone')} placeholder="555-0123" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderEntityTable = (data: any[], type: string) => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">
            {type === 'schools' && <SchoolIcon className="h-12 w-12" />}
            {type === 'subjects' && <BookOpen className="h-12 w-12" />}
            {type === 'students' && <GraduationCap className="h-12 w-12" />}
            {type === 'parents' && <Home className="h-12 w-12" />}
          </div>
          <h3 className="text-lg font-semibold mb-2">No {type} found</h3>
          <p className="text-muted-foreground">Create your first {type.slice(0, -1)} to get started.</p>
        </div>
      );
    }

    const headers = {
      schools: ['School', 'Code', 'Contact', 'Status', 'Actions'],
      subjects: ['Subject', 'Code', 'Lab Required', 'Status', 'Actions'],
      students: ['Student', 'Number', 'Year Group', 'Status', 'Actions'],
      parents: ['ID', 'Student ID', 'Relationship', 'Actions']
    };

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers[type as keyof typeof headers].map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {type === 'schools' && (
                <>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.address}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{item.contact_email}</p>
                      <p className="text-xs text-muted-foreground">{item.contact_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </>
              )}
              {type === 'subjects' && (
                <>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.subject_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.color_code && (
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color_code }}
                          />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {item.periods_per_week ? `${item.periods_per_week} periods/week` : ''}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.subject_code}</TableCell>
                  <TableCell>
                    <Badge variant={item.requires_lab ? 'default' : 'secondary'}>
                      {item.requires_lab ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </>
              )}
              {type === 'students' && (
                <>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.student_number}</p>
                      <p className="text-sm text-muted-foreground">{item.form_class || 'No form class'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.student_number}</TableCell>
                  <TableCell>{item.year_group}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_enrolled ? 'default' : 'secondary'}>
                      {item.is_enrolled ? 'Enrolled' : 'Not Enrolled'}
                    </Badge>
                  </TableCell>
                </>
              )}
              {type === 'parents' && (
                <>
                  <TableCell className="font-medium">{item.id.slice(0, 8)}...</TableCell>
                  <TableCell>{item.student_id?.slice(0, 8)}...</TableCell>
                  <TableCell>{item.relationship_type || 'Not specified'}</TableCell>
                </>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {type !== 'parents' && (
                    <Button size="sm" variant="outline" onClick={() => deleteRecord(type as any, item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

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
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Data Upload</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {['schools', 'students', 'subjects', 'parents'].map((type) => (
                      <Card key={type} className="cursor-pointer hover:bg-accent/50 transition-colors">
                        <CardContent className="p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <h3 className="font-medium capitalize">{type}</h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => handleBulkUpload(type)}
                          >
                            Download Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Upload Data File</h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose CSV File
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Download a template first, fill it with your data, then upload the CSV file.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <Download className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Schools</CardTitle>
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
                  <CardTitle className="text-sm font-medium">Subjects</CardTitle>
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
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.students}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeEntities.students} enrolled
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parents</CardTitle>
                  <Home className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.parents}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Family contacts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline" onClick={() => setUploadDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Bulk Import Data
                  </Button>
                  <Button className="w-full" variant="outline" onClick={handleExportAllData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Data Quality Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Data Summary
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
            </div>
          </TabsContent>

          {/* Entity Management Tabs */}
          {['schools', 'subjects', 'students', 'parents'].map((entityType) => (
            <TabsContent key={entityType} value={entityType} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {entityType === 'schools' && <SchoolIcon className="h-5 w-5" />}
                      {entityType === 'subjects' && <BookOpen className="h-5 w-5" />}
                      {entityType === 'students' && <GraduationCap className="h-5 w-5" />}
                      {entityType === 'parents' && <Home className="h-5 w-5" />}
                      {entityType} Management
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={`Search ${entityType}...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      {entityType !== 'parents' && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={() => { setEditingItem(null); form.reset(); }}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add {entityType.slice(0, -1)}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingItem ? 'Edit' : 'Add New'} {entityType.slice(0, -1)}
                              </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                              {renderEntityForm()}
                              <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {editingItem ? 'Update' : 'Add'} {entityType.slice(0, -1)}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderEntityTable(filteredData[entityType as keyof typeof filteredData], entityType)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}