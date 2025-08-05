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
}

export function TimetablePreview({ onBack, onRegenerate, onSave }: TimetablePreviewProps) {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [showEditor, setShowEditor] = useState(false);
  
  // Mock timetable data
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
    // Add other days...
  };

  const generationStats = {
    totalClasses: 12,
    conflictsResolved: 15,
    optimizationScore: 94.2,
    teacherSatisfaction: 87,
    roomUtilization: 91
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success/20 to-success/10 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Timetable Generated Successfully!</h2>
        <p className="text-muted-foreground">Review your AI-generated timetable and make any final adjustments</p>
      </div>

      {/* Generation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Grid3X3 className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Classes</p>
            <p className="text-xl font-bold">{generationStats.totalClasses}</p>
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
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Teacher Satisfaction</p>
            <p className="text-xl font-bold">{generationStats.teacherSatisfaction}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Room Utilization</p>
            <p className="text-xl font-bold">{generationStats.roomUtilization}%</p>
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
              <CardDescription>Generated timetable with AI optimization</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="10A">Class 10A</option>
                <option value="10B">Class 10B</option>
                <option value="11A">Class 11A</option>
                <option value="11B">Class 11B</option>
              </select>
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
              <div className="space-y-2">
                {mockTimetable.Monday.map((period) => (
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
            </TabsContent>
            
            <TabsContent value="Tuesday" className="mt-6">
              <div className="space-y-2">
                {mockTimetable.Tuesday.map((period) => (
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
            </TabsContent>
            
            {/* Add other day tabs with similar content */}
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
          timetableData={mockTimetable}
          onClose={() => setShowEditor(false)}
          onSave={(data) => {
            console.log('Saving updated timetable:', data);
            setShowEditor(false);
          }}
        />
      )}

      {/* Live Usage Features */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Live Usage Features
          </CardTitle>
          <CardDescription>
            Manage day-to-day operations after timetable deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="views" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Views
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Enterprise
              </TabsTrigger>
              <TabsTrigger value="substitution" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Substitutions
              </TabsTrigger>
              <TabsTrigger value="conflicts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Conflicts
              </TabsTrigger>
              <TabsTrigger value="regeneration" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Auto-Regen
              </TabsTrigger>
              <TabsTrigger value="ai-learning" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Learning
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="mt-6">
              <ExportManager />
            </TabsContent>
            
            <TabsContent value="views" className="mt-6">
              <Tabs defaultValue="admin" className="w-full">
                <TabsList>
                  <TabsTrigger value="admin">Admin View</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher View</TabsTrigger>
                  <TabsTrigger value="student">Student View</TabsTrigger>
                </TabsList>
                <TabsContent value="admin">
                  <RoleBasedTimetableView role="admin" />
                </TabsContent>
                <TabsContent value="teacher">
                  <RoleBasedTimetableView role="teacher" />
                </TabsContent>
                <TabsContent value="student">
                  <RoleBasedTimetableView role="student" />
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="enterprise" className="mt-6">
              <Tabs defaultValue="multi-school" className="w-full">
                <TabsList>
                  <TabsTrigger value="multi-school">Multi-School</TabsTrigger>
                  <TabsTrigger value="i18n">Languages</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                <TabsContent value="multi-school">
                  <MultiSchoolManagement />
                </TabsContent>
                <TabsContent value="i18n">
                  <I18nProvider>
                    <InternationalizationManager />
                  </I18nProvider>
                </TabsContent>
                <TabsContent value="integrations">
                  <SISERPIntegrations />
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="substitution" className="mt-6">
              <SubstitutionPlanner />
            </TabsContent>
            
            <TabsContent value="conflicts" className="mt-6">
              <ConflictDetector />
            </TabsContent>
            
            <TabsContent value="regeneration" className="mt-6">
              <AutoRegeneration />
            </TabsContent>
            
            <TabsContent value="ai-learning" className="mt-6">
              <AILearningOptimization />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}