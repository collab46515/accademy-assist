import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudentData } from '@/hooks/useStudentData';
import { useHRData } from '@/hooks/useHRData';
import { useFeeData } from '@/hooks/useFeeData';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { useAcademicData } from '@/hooks/useAcademicData';
import { AISchoolAssistant } from '@/components/shared/AISchoolAssistant';
import { AISystemAdminAssistant } from '@/components/shared/AISystemAdminAssistant';
import { AIKnowledgeBase } from '@/components/shared/AIKnowledgeBase';
import { 
  Bot, 
  Brain,
  Sparkles,
  Calendar,
  BarChart3,
  Clock,
  Zap,
  Target,
  Grid3X3,
  Wand2,
  Settings,
  Users,
  Shield,
  BookOpen,
  TrendingUp,
  DollarSign
} from "lucide-react";

const AISuitePage = () => {
  const criticalInsights = 2;
  const activeFeatures = 6; // Updated to include new assistants
  const totalUsage = 492;
  const avgAccuracy = 91;

  // Data hooks for AI assistants
  const { students } = useStudentData();
  const { employees } = useHRData();
  const { feeHeads } = useFeeData();
  const { attendanceRecords } = useAttendanceData();
  const { subjects } = useAcademicData();

  // AI Assistant states
  const [showManagementAssistant, setShowManagementAssistant] = useState(false);
  const [showSystemAdmin, setShowSystemAdmin] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Bot className="h-8 w-8 text-primary" />
          <span>AI & Automation Suite</span>
          <Badge className="bg-warning text-warning-foreground">Beta</Badge>
        </h1>
        <p className="text-muted-foreground">Smart features with AI-generated comments, predictive analytics, and automated scheduling</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Features</p>
                <p className="text-3xl font-bold text-primary">{activeFeatures}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-3xl font-bold text-success">{totalUsage}</p>
              </div>
              <Bot className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-3xl font-bold text-primary">{avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Insights</p>
                <p className="text-3xl font-bold text-destructive">{criticalInsights}</p>
              </div>
              <Brain className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistants Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span>AI Assistants</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Knowledge Base AI */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => setShowKnowledgeBase(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    🧠 Knowledge Base AI
                  </CardTitle>
                  <CardDescription>
                    Comprehensive educational intelligence
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Educational Best Practices</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4" />
                  <span>Curriculum & Pedagogy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Policy & Compliance</span>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600">
                  <Brain className="h-4 w-4 mr-2" />
                  Access Knowledge Base
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Management Assistant */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary-glow/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => setShowManagementAssistant(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    📊 Management Assistant
                  </CardTitle>
                  <CardDescription>
                    Data analysis and strategic recommendations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Performance Reports</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Strategic Insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Financial Analysis</span>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Request Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Admin Assistant */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive/5 to-destructive/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => setShowSystemAdmin(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-destructive transition-colors">
                    🔧 System Administrator
                  </CardTitle>
                  <CardDescription>
                    Technical management and system operations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>User Account Management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span>System Configuration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Security & Compliance</span>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-destructive to-destructive/80">
                  <Settings className="h-4 w-4 mr-2" />
                  Access Admin Console
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing AI Tools Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center space-x-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <span>AI Tools & Generators</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/timetable'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>AI Timetable Generator</span>
            </CardTitle>
            <CardDescription>Automated scheduling with AI optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">87%</p>
                <p className="text-sm text-muted-foreground">Optimization rate</p>
              </div>
              <Button variant="outline" size="sm">
                Open Generator
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/lesson-planner'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <span>Lesson Planner</span>
            </CardTitle>
            <CardDescription>AI-powered lesson planning and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">23</p>
                <p className="text-sm text-muted-foreground">Plans generated</p>
              </div>
              <Button variant="outline" size="sm">
                Create Lesson
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/grading'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>AI Grading Assistant</span>
            </CardTitle>
            <CardDescription>Intelligent feedback and grading suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">12</p>
                <p className="text-sm text-muted-foreground">Submissions graded</p>
              </div>
              <Button variant="outline" size="sm">
                Grade Work
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/comments'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Comment Generator</span>
            </CardTitle>
            <CardDescription>AI-generated student report comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">Comments created</p>
              </div>
              <Button variant="outline" size="sm">
                Generate Comment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/insights'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Predictive Insights</span>
            </CardTitle>
            <CardDescription>Early warning system and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-destructive">{criticalInsights}</p>
                <p className="text-sm text-muted-foreground">Critical insights</p>
              </div>
              <Button variant="outline" size="sm">
                View Insights
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/settings'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Grid3X3 className="h-5 w-5 text-primary" />
              <span>AI Settings</span>
            </CardTitle>
            <CardDescription>Configure AI models and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Models configured</p>
              </div>
              <Button variant="outline" size="sm">
                Manage Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-muted-foreground">
              <Zap className="h-5 w-5" />
              <span>More AI Features</span>
            </CardTitle>
            <CardDescription>Additional AI capabilities coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Voice assistants, image generation, and more AI-powered tools in development
              </p>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* AI Assistant Components */}
      <AIKnowledgeBase
        schoolData={{ students, staff: employees, totalStudents: students.length }}
        context="AI Suite Educational Knowledge Base"
        isOpen={showKnowledgeBase}
        onClose={() => setShowKnowledgeBase(false)}
      />

      <AISchoolAssistant
        studentData={students}
        feeData={feeHeads}
        staffData={employees}
        attendanceData={attendanceRecords}
        academicData={subjects}
        context="AI Suite Management - Comprehensive Analytics and Decision Support"
        queryType="ai_suite"
        isOpen={showManagementAssistant}
        onClose={() => setShowManagementAssistant(false)}
      />

      <AISystemAdminAssistant
        systemData={[...students, ...employees]}
        userData={employees}
        databaseStats={{ totalStudents: students.length, totalStaff: employees.length }}
        context="AI Suite ERP System Administration"
        queryType="system_admin"
        isOpen={showSystemAdmin}
        onClose={() => setShowSystemAdmin(false)}
      />

      {/* Recent Activity */}
      <Card className="shadow-[var(--shadow-card)] mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recent AI Activity</span>
          </CardTitle>
          <CardDescription>Latest AI-generated content and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Lesson plan generated</p>
                  <p className="text-sm text-muted-foreground">Mathematics - Year 7 Fractions</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">5 comments generated</p>
                  <p className="text-sm text-muted-foreground">Year 9 Science reports</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">4 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Predictive insight generated</p>
                  <p className="text-sm text-muted-foreground">Attendance warning for 8 students</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISuitePage;