import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { ModuleGuard } from '@/components/modules/ModuleGuard';
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
  Shield,
  CreditCard
} from 'lucide-react';
import { FeeManagementMasterData } from '@/components/master-data/FeeManagementMasterData';
import { HRMasterData } from '@/components/master-data/HRMasterData';
import { AccountingMasterData } from '@/components/master-data/AccountingMasterData';
import { MasterDataHierarchy } from '@/components/master-data/MasterDataHierarchy';

export function MasterDataPage() {
  return (
    <ModuleGuard moduleName="Master Data">
      <MasterDataPageContent />
    </ModuleGuard>
  );
}

function MasterDataPageContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Persist tab state in URL
  const activeTab = searchParams.get('tab') || 'overview';
  const activeEntityTab = searchParams.get('entity') || 'schools';
  
  const setActiveTab = (tab: string) => {
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    }, { replace: true });
  };
  
  const setActiveEntityTab = (entity: string) => {
    setSearchParams(prev => {
      prev.set('entity', entity);
      return prev;
    }, { replace: true });
  };
  
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
    classes,
    yearGroups,
    houses,
    createSchool,
    createSubject,
    createStudent,
    createClass,
    createYearGroup,
    createHouse,
    updateSchool,
    updateSubject,
    updateStudent,
    updateClass,
    updateYearGroup,
    updateHouse,
    deleteRecord,
    getEntityCounts,
    getActiveEntities,
    refreshData
  } = useMasterData();

  // Allow access for super admins or school admins only
  const hasAccess = isSuperAdmin() || isSchoolAdmin();

  // Check admin access
  if (!hasAccess) {
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
    if (type === 'master') {
      // Generate comprehensive master template with all entity types
      const masterTemplate = [
        '=== SCHOOLS ===',
        'Name,Code,Address,Contact Email,Contact Phone',
        'Example Primary School,EPS001,123 Main Street,admin@example.edu,+44 20 1234 5678',
        'Example Secondary School,ESS002,456 Oak Avenue,contact@secondary.edu,+44 20 9876 5432',
        '',
        '=== SUBJECTS ===',
        'Subject Name,Subject Code,Color Code,Requires Lab,Periods Per Week',
        'Mathematics,MATH,#3B82F6,false,5',
        'Chemistry,CHEM,#F59E0B,true,3',
        'English Language,ENG,#10B981,false,4',
        '',
        '=== STUDENTS ===',
        'Student Number,Year Group,Form Class,Date of Birth,Emergency Contact Name,Emergency Contact Phone',
        'STU001,Year 7,7A,2010-05-15,John Smith,+44 7700 900123',
        'STU002,Year 8,8B,2009-08-22,Jane Doe,+44 7700 900456',
        '',
        '=== PARENTS ===',
        'Parent ID,Student ID,Relationship Type',
        'parent-uuid-1,student-uuid-1,Father',
        'parent-uuid-2,student-uuid-2,Mother',
        '',
        '=== CLASSROOMS ===',
        'Room Name,Room Type,Capacity',
        'Room 101,Classroom,30',
        'Science Lab A,Laboratory,25',
        'Main Hall,Assembly,200',
        '',
        '=== PERIODS ===',
        'Period Number,Start Time,End Time,Day of Week',
        '1,09:00,09:45,Monday',
        '2,09:45,10:30,Monday',
        '3,11:00,11:45,Monday',
        '',
        '=== DEPARTMENTS ===',
        'Name,Description,Cost Center',
        'Mathematics,Mathematics Department,MATH001',
        'Science,Science Department,SCI001',
        'English,English Department,ENG001',
        '',
        '=== STAFF ===',
        'Employee ID,First Name,Last Name,Email,Position,Department,Start Date',
        'EMP001,John,Smith,j.smith@school.edu,Head Teacher,Administration,2020-09-01',
        'EMP002,Sarah,Jones,s.jones@school.edu,Mathematics Teacher,Mathematics,2021-01-15',
        '',
        '=== FEE HEADS ===',
        'Fee Name,Description,Category,Default Amount,Currency,Is Mandatory,Is Recurring,Recurrence Frequency,Applicable Classes,Applicable Genders',
        'Tuition Fee,Main academic tuition fees,Tuition,1500,GBP,true,true,termly,,',
        'Registration Fee,One-time registration fee for new students,Registration,250,GBP,true,false,,,',
        'Transport Fee,School transport services,Transport,150,GBP,false,true,termly,,',
        'Meals Fee,School lunch and meal services,Meals,200,GBP,false,true,termly,,',
        'Examination Fee,External and internal examination fees,Examination,100,GBP,true,false,,Year 10;Year 11;Year 12;Year 13,',
        'ICT Fee,Information and Communication Technology resources,ICT,75,GBP,false,true,annually,,',
        'Laboratory Fee,Science laboratory usage and materials,Laboratory,120,GBP,false,true,termly,Year 7;Year 8;Year 9;Year 10;Year 11;Year 12;Year 13,',
        'Library Fee,Library resources and book replacement,Library,30,GBP,false,true,annually,,',
        'Sports Fee,Sports equipment and activities,Sports,80,GBP,false,true,termly,,',
        'Music Lessons,Individual music lessons and instrument hire,Music Lessons,200,GBP,false,true,termly,,',
        'Boarding Fee,Accommodation and boarding services,Boarding,2500,GBP,false,true,termly,,',
        'Uniform Fee,School uniform and PE kit,Uniform,150,GBP,true,false,,,',
        'Activity Fee,Extracurricular activities and clubs,Activity Fees,60,GBP,false,true,termly,,',
        'Excursion Fee,Educational trips and excursions,Excursions,100,GBP,false,false,,,'
      ].join('\n');
      
      const blob = new Blob([masterTemplate], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'master_data_template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Individual templates for specific entity types
      const templates = {
        schools: 'Name,Code,Address,Contact Email,Contact Phone\nExample School,EXS001,123 Main St,admin@example.edu,555-0123',
        students: 'Student Number,Year Group,Form Class,Date of Birth,Emergency Contact Name,Emergency Contact Phone\nSTU001,Year 7,7A,2010-05-15,John Smith,+44 7700 900123',
        subjects: 'Subject Name,Subject Code,Color Code,Requires Lab,Periods Per Week\nMathematics,MATH,#3B82F6,false,5',
        parents: 'Parent ID,Student ID,Relationship Type\nparent-uuid,student-uuid,Father',
        classrooms: 'Room Name,Room Type,Capacity\nRoom 101,Classroom,30',
        periods: 'Period Number,Start Time,End Time,Day of Week\n1,09:00,09:45,Monday',
        departments: 'Name,Description,Cost Center\nMathematics,Mathematics Department,MATH001',
        staff: 'Employee ID,First Name,Last Name,Email,Position,Department,Start Date\nEMP001,John,Smith,j.smith@school.edu,Head Teacher,Administration,2020-09-01',
        'fee-heads': 'Fee Name,Description,Category,Default Amount,Currency,Is Mandatory,Is Recurring,Recurrence Frequency,Applicable Classes,Applicable Genders\nTuition Fee,Main academic tuition fees,Tuition,120000,INR,true,true,termly,,'
      };
      
      const template = templates[type as keyof typeof templates];
      const blob = new Blob([template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_template.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
        
        let currentSection = '';
        const parsedData: any = {
          schools: [],
          subjects: [],
          students: [],
          parents: [],
          feeHeads: []
        };
        
        let i = 0;
        while (i < lines.length) {
          const line = lines[i];
          
          // Check for section headers
          if (line.includes('=== SCHOOLS ===')) {
            currentSection = 'schools';
            i++; // Skip to headers line
            const headers = lines[i]?.split(',').map(h => h.trim()) || [];
            i++; // Move to data lines
            
            while (i < lines.length && !lines[i].includes('===') && lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
              });
              parsedData.schools.push(obj);
              i++;
            }
          } else if (line.includes('=== SUBJECTS ===')) {
            currentSection = 'subjects';
            i++;
            const headers = lines[i]?.split(',').map(h => h.trim()) || [];
            i++;
            
            while (i < lines.length && !lines[i].includes('===') && lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
              });
              parsedData.subjects.push(obj);
              i++;
            }
          } else if (line.includes('=== STUDENTS ===')) {
            currentSection = 'students';
            i++;
            const headers = lines[i]?.split(',').map(h => h.trim()) || [];
            i++;
            
            while (i < lines.length && !lines[i].includes('===') && lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
              });
              parsedData.students.push(obj);
              i++;
            }
          } else if (line.includes('=== PARENTS ===')) {
            currentSection = 'parents';
            i++;
            const headers = lines[i]?.split(',').map(h => h.trim()) || [];
            i++;
            
            while (i < lines.length && !lines[i].includes('===') && lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
              });
              parsedData.parents.push(obj);
              i++;
            }
          } else if (line.includes('=== FEE HEADS ===')) {
            currentSection = 'feeHeads';
            i++;
            const headers = lines[i]?.split(',').map(h => h.trim()) || [];
            i++;
            
            while (i < lines.length && !lines[i].includes('===') && lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                const key = header.toLowerCase().replace(/\s+/g, '_');
                let value: any = values[index] || '';
                
                // Handle special processing for fee heads
                if (key === 'is_mandatory' || key === 'is_recurring') {
                  obj[key] = value.toLowerCase() === 'true';
                } else if (key === 'default_amount') {
                  obj[key] = parseFloat(value) || 0;
                } else if (key === 'applicable_classes' || key === 'applicable_genders') {
                  obj[key] = value ? value.split(';').filter((v: string) => v.trim()) : [];
                } else {
                  obj[key] = value;
                }
              });
              parsedData.feeHeads.push(obj);
              i++;
            }
          } else {
            i++;
          }
        }
        
        console.log('Processing master CSV file:', file.name);
        console.log('Parsed data:', parsedData);
        // TODO: Process the parsed master CSV data
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
      exportData.push('');
    }
    
    // Note: Fee heads can be exported separately from the Fee Management tab
    // as they are managed centrally in the Master Data section
    
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
        switch (activeEntityTab) {
          case 'schools':
            await updateSchool(editingItem.id, data);
            break;
          case 'subjects':
            await updateSubject(editingItem.id, { ...data, school_id: currentSchool?.id });
            break;
          case 'classes':
            await updateClass(editingItem.id, { ...data, school_id: currentSchool?.id });
            break;
          case 'students':
            await updateStudent(editingItem.id, { ...data, school_id: currentSchool?.id });
            break;
          case 'yearGroups':
            await updateYearGroup(editingItem.id, data);
            break;
          case 'houses':
            await updateHouse(editingItem.id, data);
            break;
        }
      } else {
        // Create new item
        switch (activeEntityTab) {
          case 'schools':
            await createSchool({ ...data, is_active: true, settings: {} });
            break;
          case 'subjects':
            await createSubject({ ...data, school_id: currentSchool?.id || schools[0]?.id, is_active: true });
            break;
          case 'classes':
            await createClass({ ...data, school_id: currentSchool?.id || schools[0]?.id || '', is_active: true, current_enrollment: 0 });
            break;
          case 'students':
            // No need to generate user_id - we'll set it to null for now
            await createStudent({ 
              ...data, 
              school_id: currentSchool?.id || schools[0]?.id || '',
              is_enrolled: true 
            });
            break;
          case 'yearGroups':
            await createYearGroup({ ...data, school_id: currentSchool?.id || schools[0]?.id, is_active: true });
            break;
          case 'houses':
            await createHouse({ ...data, school_id: currentSchool?.id || schools[0]?.id, is_active: true, points: 0 });
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
    classes: classes.filter(item => 
      item.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year_group.toLowerCase().includes(searchTerm.toLowerCase())
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
    ),
    yearGroups: yearGroups.filter(item => 
      item.year_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year_code.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    houses: houses.filter(item => 
      item.house_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.house_code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const renderEntityForm = () => {
    switch (activeEntityTab) {
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
                <Input {...form.register('contact_phone')} placeholder="+91 11 xxxx xxxx" />
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
      case 'classes':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Class Name</label>
                <Input {...form.register('class_name')} placeholder="7A" />
              </div>
              <div>
                <label className="text-sm font-medium">Year Group</label>
                <Select onValueChange={(value) => form.setValue('year_group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Year 1">Year 1</SelectItem>
                    <SelectItem value="Year 2">Year 2</SelectItem>
                    <SelectItem value="Year 3">Year 3</SelectItem>
                    <SelectItem value="Year 4">Year 4</SelectItem>
                    <SelectItem value="Year 5">Year 5</SelectItem>
                    <SelectItem value="Year 6">Year 6</SelectItem>
                    <SelectItem value="Year 7">Year 7</SelectItem>
                    <SelectItem value="Year 8">Year 8</SelectItem>
                    <SelectItem value="Year 9">Year 9</SelectItem>
                    <SelectItem value="Year 10">Year 10</SelectItem>
                    <SelectItem value="Year 11">Year 11</SelectItem>
                    <SelectItem value="Year 12">Year 12</SelectItem>
                    <SelectItem value="Year 13">Year 13</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Capacity</label>
                <Input {...form.register('capacity')} type="number" placeholder="30" />
              </div>
              <div>
                <label className="text-sm font-medium">Academic Year</label>
                <Input {...form.register('academic_year')} placeholder="2024-2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea {...form.register('notes')} placeholder="Additional notes..." />
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
      case 'yearGroups':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Year Code</label>
                <Input {...form.register('year_code')} placeholder="Y7" />
              </div>
              <div>
                <label className="text-sm font-medium">Year Name</label>
                <Input {...form.register('year_name')} placeholder="Year 7" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Key Stage</label>
                <Input {...form.register('key_stage')} placeholder="Key Stage 3" />
              </div>
              <div>
                <label className="text-sm font-medium">Sort Order</label>
                <Input {...form.register('sort_order')} type="number" placeholder="7" />
              </div>
            </div>
          </div>
        );
      case 'houses':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">House Code</label>
                <Input {...form.register('house_code')} placeholder="RED" />
              </div>
              <div>
                <label className="text-sm font-medium">House Name</label>
                <Input {...form.register('house_name')} placeholder="Red House" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">House Color</label>
                <Input {...form.register('house_color')} placeholder="#EF4444" />
              </div>
              <div>
                <label className="text-sm font-medium">House Points</label>
                <Input {...form.register('points')} type="number" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">House Motto</label>
              <Input {...form.register('house_motto')} placeholder="Strength and Courage" />
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
            {type === 'classes' && <Building2 className="h-12 w-12" />}
            {type === 'students' && <GraduationCap className="h-12 w-12" />}
            {type === 'parents' && <Home className="h-12 w-12" />}
            {type === 'yearGroups' && <GraduationCap className="h-12 w-12" />}
            {type === 'houses' && <Home className="h-12 w-12" />}
          </div>
          <h3 className="text-lg font-semibold mb-2">No {type} found</h3>
          <p className="text-muted-foreground">Create your first {type.slice(0, -1)} to get started.</p>
        </div>
      );
    }

    const headers = {
      schools: ['School', 'Code', 'Contact', 'Status', 'Actions'],
      subjects: ['Subject', 'Code', 'Lab Required', 'Status', 'Actions'],
      classes: ['Class', 'Year Group', 'Capacity', 'Status', 'Actions'],
      students: ['Student', 'Number', 'Year Group', 'Status', 'Actions'],
      parents: ['ID', 'Student ID', 'Relationship', 'Actions'],
      yearGroups: ['Year', 'Code', 'Key Stage', 'Order', 'Actions'],
      houses: ['House', 'Code', 'Color', 'Points', 'Actions']
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
              {type === 'classes' && (
                <>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.class_name}</p>
                      <p className="text-sm text-muted-foreground">{item.notes || 'No notes'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.year_group}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{item.current_enrollment}/{item.capacity}</p>
                      <p className="text-xs text-muted-foreground">{item.academic_year}</p>
                    </div>
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
                {currentSchool ? (
                  <>School-specific data for <span className="font-semibold text-foreground">{currentSchool.name}</span></>
                ) : (
                  'Centralized management of core school data entities'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentSchool && (
              <Badge variant="secondary" className="gap-2">
                <SchoolIcon className="h-3 w-3" />
                {currentSchool.code}
              </Badge>
            )}
            <Badge variant="outline" className="gap-2">
              <CheckCircle className="h-3 w-3" />
              Data Synchronized
            </Badge>
            <Button onClick={() => navigate('/master-data/import')} size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Data Upload</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Master Template */}
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Master Template</h3>
                      <p className="text-sm text-muted-foreground mb-3">Load all data types in one shot</p>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleBulkUpload('master')}
                      >
                        Download Master Template
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Individual Templates */}
                  <div>
                    <h3 className="font-medium mb-3">Individual Templates</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { type: 'schools', icon: SchoolIcon, color: 'text-blue-600' },
                        { type: 'subjects', icon: BookOpen, color: 'text-green-600' },
                        { type: 'students', icon: GraduationCap, color: 'text-purple-600' },
                        { type: 'parents', icon: Home, color: 'text-red-600' },
                        { type: 'classrooms', icon: Building2, color: 'text-orange-600' },
                        { type: 'periods', icon: FileText, color: 'text-teal-600' },
                        { type: 'departments', icon: Users, color: 'text-indigo-600' },
                        { type: 'staff', icon: Users, color: 'text-pink-600' }
                      ].map((item) => (
                        <Card key={item.type} className="cursor-pointer hover:bg-accent/50 transition-colors">
                          <CardContent className="p-3 text-center">
                            <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                            <h4 className="font-medium text-xs capitalize mb-2">{item.type}</h4>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs h-7"
                              onClick={() => handleBulkUpload(item.type)}
                            >
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic Data</TabsTrigger>
            <TabsTrigger value="business">Business Data</TabsTrigger>
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

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes</CardTitle>
                  <Building2 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityCounts.classes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeEntities.classes} active
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

            {/* Master Data Hierarchy Guide */}
            <MasterDataHierarchy />

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
                      <span className="text-sm">Classes</span>
                      <Badge variant="secondary">{entityCounts.classes}</Badge>
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

          {/* Academic Data Tab */}
          <TabsContent value="academic" className="space-y-6">
            <Tabs value={activeEntityTab} onValueChange={setActiveEntityTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="schools">Schools</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="parents">Parents</TabsTrigger>
              </TabsList>

              {/* Academic Entity Management */}
              {['schools', 'subjects', 'classes', 'students', 'parents'].map((entityType) => (
                <TabsContent key={entityType} value={entityType} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 capitalize">
                          {entityType === 'schools' && <SchoolIcon className="h-5 w-5" />}
                          {entityType === 'subjects' && <BookOpen className="h-5 w-5" />}
                          {entityType === 'classes' && <Building2 className="h-5 w-5" />}
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
                                <Button onClick={() => { setEditingItem(null); form.reset(); setActiveEntityTab(entityType); }}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add {entityType.slice(0, -1)}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    {editingItem ? 'Edit' : 'Add New'} {entityType.slice(0, -1)}
                                  </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                  {renderEntityForm()}
                                  <div className="flex justify-end gap-3 pt-4 border-t">
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
          </TabsContent>

          {/* Business Data Tab */}
          <TabsContent value="business" className="space-y-6">
            <Tabs defaultValue="fee-management" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fee-management">Fee Management</TabsTrigger>
                <TabsTrigger value="hr-management">HR Management</TabsTrigger>
                <TabsTrigger value="accounting">Accounting</TabsTrigger>
              </TabsList>

              <TabsContent value="fee-management" className="space-y-6">
                <FeeManagementMasterData />
              </TabsContent>

              <TabsContent value="hr-management" className="space-y-6">
                <HRMasterData />
              </TabsContent>

              <TabsContent value="accounting" className="space-y-6">
                <AccountingMasterData />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}