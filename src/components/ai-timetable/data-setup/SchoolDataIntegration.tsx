import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  School, 
  Users, 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Database,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRBAC } from "@/hooks/useRBAC";
import { useToast } from "@/hooks/use-toast";

interface SchoolData {
  school: {
    id: string;
    name: string;
    code: string;
  } | null;
  teachers: Array<{
    id: string;
    name: string;
    subjects: string[];
    department?: string;
  }>;
  students: Array<{
    id: string;
    name: string;
    year_group: string;
    form_class?: string;
  }>;
  classrooms: Array<{
    id: string;
    name: string;
    capacity: number;
    type: string;
  }>;
  subjects: Array<{
    name: string;
    department: string;
    hours_per_week: number;
  }>;
  classes: Array<{
    year_group: string;
    form_class: string;
    student_count: number;
  }>;
}

interface SchoolDataIntegrationProps {
  onNext: (data: SchoolData) => void;
  onBack: () => void;
}

export function SchoolDataIntegration({ onNext, onBack }: SchoolDataIntegrationProps) {
  const { currentSchool, isSchoolAdmin, isSuperAdmin } = useRBAC();
  const { toast } = useToast();
  const [schoolData, setSchoolData] = useState<SchoolData>({
    school: null,
    teachers: [],
    students: [],
    classrooms: [],
    subjects: [],
    classes: []
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentSchool) {
      fetchSchoolData();
    }
  }, [currentSchool]);

  const fetchSchoolData = async () => {
    if (!currentSchool) {
      setError("No school selected. Please select a school first.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Get school info
      setProgress(10);
      const schoolInfo = {
        id: currentSchool.id,
        name: currentSchool.name,
        code: currentSchool.code || 'N/A'
      };

      // Step 2: Get teachers
      setProgress(25);
      const { data: teachersData, error: teachersError } = await supabase
        .from('user_roles')
        .select('user_id, department')
        .eq('school_id', currentSchool.id)
        .eq('role', 'teacher')
        .eq('is_active', true);

      if (teachersError) throw teachersError;

      // Get teacher names from profiles
      const teacherIds = teachersData?.map(t => t.user_id) || [];
      const { data: teacherProfiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', teacherIds);

      const teachers = teachersData?.map(teacher => {
        const profile = teacherProfiles?.find(p => p.user_id === teacher.user_id);
        return {
          id: teacher.user_id,
          name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Teacher',
          subjects: [],
          department: teacher.department || 'General'
        };
      }) || [];

      // Step 3: Get students  
      setProgress(40);
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, user_id, year_group, form_class')
        .eq('school_id', currentSchool.id)
        .eq('is_enrolled', true);

      if (studentsError) throw studentsError;

      // Get student names from profiles
      const studentUserIds = studentsData?.map(s => s.user_id).filter(Boolean) || [];
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', studentUserIds);

      const students = studentsData?.map(student => {
        const profile = studentProfiles?.find(p => p.user_id === student.user_id);
        return {
          id: student.id,
          name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Student',
          year_group: student.year_group || 'Unknown',
          form_class: student.form_class || 'Unknown'
        };
      }) || [];

      // Step 4: Get classrooms
      setProgress(55);
      const { data: classroomsData, error: classroomsError } = await supabase
        .from('classrooms')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true);

      if (classroomsError) throw classroomsError;

      const classrooms = classroomsData?.map(room => ({
        id: room.id,
        name: room.room_name,
        capacity: room.capacity || 30,
        type: room.room_type || 'classroom'
      })) || [];

      // Step 5: Get existing class schedules to extract subjects
      setProgress(70);
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('class_schedules')
        .select('subject, year_group, form_class')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true);

      if (schedulesError) throw schedulesError;

      // Extract unique subjects
      const subjectSet = new Set<string>();
      schedulesData?.forEach(schedule => {
        if (schedule.subject) subjectSet.add(schedule.subject);
      });

      const subjects = Array.from(subjectSet).map(subject => ({
        name: subject,
        department: 'General', // Could be enhanced with subject-department mapping
        hours_per_week: 4 // Default hours per week
      }));

      // Step 6: Group students into classes
      setProgress(85);
      const classGroups = new Map<string, number>();
      students.forEach(student => {
        const classKey = `${student.year_group}-${student.form_class}`;
        classGroups.set(classKey, (classGroups.get(classKey) || 0) + 1);
      });

      const classes = Array.from(classGroups.entries()).map(([classKey, count]) => {
        const [year_group, form_class] = classKey.split('-');
        return {
          year_group,
          form_class,
          student_count: count
        };
      });

      setProgress(100);

      const completeSchoolData: SchoolData = {
        school: schoolInfo,
        teachers,
        students,
        classrooms,
        subjects,
        classes
      };

      setSchoolData(completeSchoolData);

      toast({
        title: "Success",
        description: `School data loaded: ${teachers.length} teachers, ${students.length} students, ${classrooms.length} rooms`,
      });

    } catch (error: any) {
      console.error('Error fetching school data:', error);
      setError(error.message || 'Failed to fetch school data');
      toast({
        title: "Error",
        description: "Failed to load school data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isDataComplete = () => {
    return (
      schoolData.school &&
      schoolData.teachers.length > 0 &&
      schoolData.students.length > 0 &&
      schoolData.classrooms.length > 0 &&
      schoolData.subjects.length > 0 &&
      schoolData.classes.length > 0
    );
  };

  const getDataCompleteness = () => {
    let score = 0;
    if (schoolData.school) score += 20;
    if (schoolData.teachers.length > 0) score += 20;
    if (schoolData.students.length > 0) score += 20;
    if (schoolData.classrooms.length > 0) score += 20;
    if (schoolData.subjects.length > 0) score += 10;
    if (schoolData.classes.length > 0) score += 10;
    return score;
  };

  if (!isSchoolAdmin() && !isSuperAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You need admin privileges to access school data for timetable generation.</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentSchool) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-warning">No School Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a school first to load timetable data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            School Data Integration
          </CardTitle>
          <CardDescription>
            Load real school data for AI timetable generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* School Info */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <School className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">{currentSchool.name}</h3>
              <p className="text-sm text-muted-foreground">Code: {currentSchool.code}</p>
            </div>
          </div>

          {/* Data Loading Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Loading school data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Data Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className={schoolData.teachers.length > 0 ? "border-success" : "border-muted"}>
              <CardContent className="p-4 text-center">
                <Users className={`h-6 w-6 mx-auto mb-2 ${schoolData.teachers.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold">{schoolData.teachers.length}</p>
              </CardContent>
            </Card>

            <Card className={schoolData.students.length > 0 ? "border-success" : "border-muted"}>
              <CardContent className="p-4 text-center">
                <GraduationCap className={`h-6 w-6 mx-auto mb-2 ${schoolData.students.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{schoolData.students.length}</p>
              </CardContent>
            </Card>

            <Card className={schoolData.classrooms.length > 0 ? "border-success" : "border-muted"}>
              <CardContent className="p-4 text-center">
                <MapPin className={`h-6 w-6 mx-auto mb-2 ${schoolData.classrooms.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground">Classrooms</p>
                <p className="text-2xl font-bold">{schoolData.classrooms.length}</p>
              </CardContent>
            </Card>

            <Card className={schoolData.subjects.length > 0 ? "border-success" : "border-muted"}>
              <CardContent className="p-4 text-center">
                <BookOpen className={`h-6 w-6 mx-auto mb-2 ${schoolData.subjects.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">{schoolData.subjects.length}</p>
              </CardContent>
            </Card>

            <Card className={schoolData.classes.length > 0 ? "border-success" : "border-muted"}>
              <CardContent className="p-4 text-center">
                <Users className={`h-6 w-6 mx-auto mb-2 ${schoolData.classes.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">{schoolData.classes.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Completeness</p>
                <p className="text-2xl font-bold">{getDataCompleteness()}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Data Status */}
          <div className="space-y-3">
            <h4 className="font-medium">Data Integration Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">School Information</span>
                {schoolData.school ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Teaching Staff ({schoolData.teachers.length})</span>
                {schoolData.teachers.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Student Enrollment ({schoolData.students.length})</span>
                {schoolData.students.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Classroom Resources ({schoolData.classrooms.length})</span>
                {schoolData.classrooms.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchSchoolData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            
            <Button
              onClick={() => onNext(schoolData)}
              disabled={!isDataComplete() || loading}
              className="flex-1"
            >
              Continue with AI Generation
            </Button>
          </div>

          {!isDataComplete() && !loading && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some required data is missing. Please ensure you have teachers, students, and classrooms set up in your school before generating timetables.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back: Setup
        </Button>
      </div>
    </div>
  );
}