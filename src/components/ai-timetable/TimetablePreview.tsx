import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye,
  Download,
  RefreshCw,
  Save,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Grid3X3,
  Clock,
  Users,
  MapPin,
  Zap,
  Edit,
  Building2,
  Brain
} from "lucide-react";
import { InteractiveTimetableEditor } from './InteractiveTimetableEditor';
import { SubstitutionPlanner } from './live-usage/SubstitutionPlanner';
import { ConflictDetector } from './live-usage/ConflictDetector';
import { AutoRegeneration } from './live-usage/AutoRegeneration';
import { ExportManager } from './export/ExportManager';
import { RoleBasedTimetableView } from './views/RoleBasedTimetableView';
import { MultiSchoolManagement } from '../enterprise/MultiSchoolManagement';
import { InternationalizationManager, I18nProvider } from '../enterprise/InternationalizationManager';
import { SISERPIntegrations } from '../enterprise/SISERPIntegrations';
import { AILearningOptimization } from './ai-learning/AILearningOptimization';

interface TimetablePreviewProps {
  onBack: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  generatedData?: any;
}

export function TimetablePreview({ onBack, onRegenerate, onSave, generatedData }: TimetablePreviewProps) {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [showEditor, setShowEditor] = useState(false);
  
  // Mock timetable data as fallback
  const mockTimetable = {
    Monday: [
      { period: 1, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '08:00-08:45' },
      { period: 2, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '08:45-09:30' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45' },
      { period: 4, subject: 'Physics', teacher: 'Dr. Brown', room: 'Physics Lab', time: '09:45-10:30' },
      { period: 5, subject: 'History', teacher: 'Ms. Davis', room: 'Room 103', time: '10:30-11:15' },
      { period: 6, subject: 'Lunch', teacher: '', room: '', time: '11:15-12:00' },
      { period: 7, subject: 'French', teacher: 'Mme. Martin', room: 'Room 104', time: '12:00-12:45' },
      { period: 8, subject: 'PE', teacher: 'Mr. Wilson', room: 'Gymnasium', time: '12:45-13:30' },
    ],
    Tuesday: [
      { period: 1, subject: 'Chemistry', teacher: 'Dr. Lee', room: 'Chemistry Lab', time: '08:00-08:45' },
      { period: 2, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '08:45-09:30' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45' },
      { period: 4, subject: 'Geography', teacher: 'Mr. Green', room: 'Room 105', time: '09:45-10:30' },
      { period: 5, subject: 'Biology', teacher: 'Dr. White', room: 'Biology Lab', time: '10:30-11:15' },
      { period: 6, subject: 'Lunch', teacher: '', room: '', time: '11:15-12:00' },
      { period: 7, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '12:00-12:45' },
      { period: 8, subject: 'Art', teacher: 'Ms. Turner', room: 'Art Studio', time: '12:45-13:30' },
    ],
    Wednesday: [
      { period: 1, subject: 'Biology', teacher: 'Dr. White', room: 'Biology Lab', time: '08:00-08:45' },
      { period: 2, subject: 'French', teacher: 'Mme. Martin', room: 'Room 104', time: '08:45-09:30' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45' },
      { period: 4, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '09:45-10:30' },
      { period: 5, subject: 'Chemistry', teacher: 'Dr. Lee', room: 'Chemistry Lab', time: '10:30-11:15' },
      { period: 6, subject: 'Lunch', teacher: '', room: '', time: '11:15-12:00' },
      { period: 7, subject: 'History', teacher: 'Ms. Davis', room: 'Room 103', time: '12:00-12:45' },
      { period: 8, subject: 'PE', teacher: 'Mr. Wilson', room: 'Gymnasium', time: '12:45-13:30' },
    ],
    Thursday: [
      { period: 1, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '08:00-08:45' },
      { period: 2, subject: 'Physics', teacher: 'Dr. Brown', room: 'Physics Lab', time: '08:45-09:30' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45' },
      { period: 4, subject: 'Art', teacher: 'Ms. Turner', room: 'Art Studio', time: '09:45-10:30' },
      { period: 5, subject: 'French', teacher: 'Mme. Martin', room: 'Room 104', time: '10:30-11:15' },
      { period: 6, subject: 'Lunch', teacher: '', room: '', time: '11:15-12:00' },
      { period: 7, subject: 'Geography', teacher: 'Mr. Green', room: 'Room 105', time: '12:00-12:45' },
      { period: 8, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '12:45-13:30' },
    ],
    Friday: [
      { period: 1, subject: 'History', teacher: 'Ms. Davis', room: 'Room 103', time: '08:00-08:45' },
      { period: 2, subject: 'PE', teacher: 'Mr. Wilson', room: 'Gymnasium', time: '08:45-09:30' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45' },
      { period: 4, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '09:45-10:30' },
      { period: 5, subject: 'Physics', teacher: 'Dr. Brown', room: 'Physics Lab', time: '10:30-11:15' },
      { period: 6, subject: 'Lunch', teacher: '', room: '', time: '11:15-12:00' },
      { period: 7, subject: 'Chemistry', teacher: 'Dr. Lee', room: 'Chemistry Lab', time: '12:00-12:45' },
      { period: 8, subject: 'Biology', teacher: 'Dr. White', room: 'Biology Lab', time: '12:45-13:30' },
    ],
  };
  
  // Use generated data if available, otherwise fallback to mock
  const timetableData = generatedData?.timetable || mockTimetable;
  const stats = generatedData?.stats || {
    conflictsResolved: 47,
    optimizationScore: 94.2,
    teacherUtilization: 87,
    roomUtilization: 91
  };

  const generationStats = {
    totalClasses: 12,
    totalTeachers: 24,
    totalRooms: 15,
    conflictsResolved: stats.conflictsResolved || 47,
    optimizationScore: stats.optimizationScore || 94.2,
    teacherSatisfaction: stats.teacherUtilization || 87,
    roomUtilization: stats.roomUtilization || 91,
    totalPeriods: 960 // 12 classes × 8 periods × 10 days (2 weeks)
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'English': 'bg-green-100 text-green-800 border-green-200',
      'Physics': 'bg-red-100 text-red-800 border-red-200',
      'Chemistry': 'bg-orange-100 text-orange-800 border-orange-200',
      'Biology': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'History': 'bg-amber-100 text-amber-800 border-amber-200',
      'Geography': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'French': 'bg-purple-100 text-purple-800 border-purple-200',
      'PE': 'bg-lime-100 text-lime-800 border-lime-200',
      'Art': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderDaySchedule = (dayPeriods: any[]) => (
    <div className="space-y-2">
      {dayPeriods.map((period) => (
        <div key={period.period} className="flex items-center space-x-4 p-3 border rounded-lg">
          <div className="w-12 text-center">
            <span className="text-sm font-medium">P{period.period}</span>
          </div>
          <div className="flex-1">
            {period.subject === 'Break' || period.subject === 'Lunch' ? (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">{period.subject}</span>
                <span className="text-sm text-muted-foreground">{period.time}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Badge className={`${getSubjectColor(period.subject)} border`}>
                  {period.subject}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{period.teacher}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{period.room}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{period.time}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success/20 to-success/10 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {generatedData ? 'AI-Generated Timetable Complete!' : 'Sample Timetable Preview'}
        </h2>
        <p className="text-muted-foreground">
          {generatedData 
            ? `AI generated optimized timetables for all ${generationStats.totalClasses} classes`
            : `Preview of what an AI-generated timetable would look like`
          }
        </p>
      </div>

      {/* Generation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Grid3X3 className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Classes</p>
            <p className="text-xl font-bold">{generationStats.totalClasses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Teachers</p>
            <p className="text-xl font-bold">{generationStats.totalTeachers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Rooms</p>
            <p className="text-xl font-bold">{generationStats.totalRooms}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Conflicts Resolved</p>
            <p className="text-xl font-bold">{generationStats.conflictsResolved}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Optimization</p>
            <p className="text-xl font-bold">{generationStats.optimizationScore}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Total Periods</p>
            <p className="text-xl font-bold">{generationStats.totalPeriods}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Timetable Preview - Class {selectedClass}</span>
              </CardTitle>
              <CardDescription>
                {generatedData 
                  ? 'AI-generated timetable with conflict resolution' 
                  : 'Sample timetable showing potential AI generation results'
                }
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {generatedData ? 'AI Generated' : 'Sample Data'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Monday" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="Monday">Monday</TabsTrigger>
              <TabsTrigger value="Tuesday">Tuesday</TabsTrigger>
              <TabsTrigger value="Wednesday">Wednesday</TabsTrigger>
              <TabsTrigger value="Thursday">Thursday</TabsTrigger>
              <TabsTrigger value="Friday">Friday</TabsTrigger>
            </TabsList>
            
            <TabsContent value="Monday" className="mt-6">
              {renderDaySchedule(timetableData.Monday || mockTimetable.Monday)}
            </TabsContent>
            
            <TabsContent value="Tuesday" className="mt-6">
              {renderDaySchedule(timetableData.Tuesday || mockTimetable.Tuesday)}
            </TabsContent>
            
            <TabsContent value="Wednesday" className="mt-6">
              {renderDaySchedule(timetableData.Wednesday || mockTimetable.Wednesday)}
            </TabsContent>
            
            <TabsContent value="Thursday" className="mt-6">
              {renderDaySchedule(timetableData.Thursday || mockTimetable.Thursday)}
            </TabsContent>
            
            <TabsContent value="Friday" className="mt-6">
              {renderDaySchedule(timetableData.Friday || mockTimetable.Friday)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <span>Back: Generation</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowEditor(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Timetable
          </Button>
          
          <Button variant="outline" onClick={onRegenerate}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={onSave} className="shadow-[var(--shadow-elegant)]">
            <Save className="h-4 w-4 mr-2" />
            Save Timetable
          </Button>
        </div>
      </div>

      {/* Interactive Timetable Editor */}
      {showEditor && (
        <InteractiveTimetableEditor
          timetableData={timetableData}
          onClose={() => setShowEditor(false)}
          onSave={(data) => {
            console.log('Saving updated timetable:', data);
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
}