import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  GraduationCap,
  PoundSterling,
  UserCheck,
  Brain,
  MessageSquare,
  BookOpen,
  ClipboardCheck,
  Calendar,
  Activity
} from "lucide-react";

import { StudentManagementWorkflow } from "@/components/workflows/StudentManagementWorkflow";
import { FeeManagementWorkflow } from "@/components/workflows/FeeManagementWorkflow";
import { AdmissionsWorkflow } from "@/components/workflows/AdmissionsWorkflow";
import { HRManagementWorkflow } from "@/components/workflows/HRManagementWorkflow";
import { AITimetableWorkflow } from "@/components/workflows/AITimetableWorkflow";
import { CommunicationWorkflow } from "@/components/workflows/CommunicationWorkflow";

interface Module {
  name: string;
  icon: any;
  description: string;
  features: string[];
  color: string;
}

interface WorkflowDiagramsProps {
  modules: Module[];
}

export function WorkflowDiagrams({ modules }: WorkflowDiagramsProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState("student-management");

  const workflows = [
    {
      id: "student-management",
      name: "Student Management",
      icon: Users,
      description: "Complete student lifecycle from enrollment to graduation",
      component: StudentManagementWorkflow,
      color: "bg-green-500"
    },
    {
      id: "admissions",
      name: "Admissions Process",
      icon: GraduationCap,
      description: "End-to-end admissions workflow from application to enrollment",
      component: AdmissionsWorkflow,
      color: "bg-blue-500"
    },
    {
      id: "fee-management",
      name: "Fee Management",
      icon: PoundSterling,
      description: "Complete financial workflow for fee collection and tracking",
      component: FeeManagementWorkflow,
      color: "bg-emerald-500"
    },
    {
      id: "hr-management",
      name: "HR Management",
      icon: UserCheck,
      description: "Staff recruitment and management workflow",
      component: HRManagementWorkflow,
      color: "bg-indigo-500"
    },
    {
      id: "ai-timetable",
      name: "AI Timetable Generation",
      icon: Brain,
      description: "Intelligent timetable creation with AI optimization",
      component: AITimetableWorkflow,
      color: "bg-purple-500"
    },
    {
      id: "communication",
      name: "Communication Hub",
      icon: MessageSquare,
      description: "Multi-channel communication workflow",
      component: CommunicationWorkflow,
      color: "bg-pink-500"
    }
  ];

  const additionalWorkflows = [
    {
      name: "Curriculum Planning",
      icon: BookOpen,
      description: "Lesson planning → Coverage tracking → Gap analysis → Standards alignment",
      steps: ["Curriculum Setup", "Lesson Creation", "Progress Tracking", "Gap Analysis", "Reports"]
    },
    {
      name: "Assessment & Grading",
      icon: ClipboardCheck,
      description: "Assignment creation → Student submission → Grading → Feedback → Analytics",
      steps: ["Assignment Creation", "Student Submission", "Grading Process", "Feedback Delivery", "Performance Analytics"]
    },
    {
      name: "Attendance Tracking",
      icon: Calendar,
      description: "Daily marking → Real-time alerts → Absence tracking → Parent notifications",
      steps: ["Daily Marking", "Absence Detection", "Alert Generation", "Parent Notification", "Attendance Reports"]
    },
    {
      name: "Student Welfare",
      icon: Activity,
      description: "Health monitoring → Incident tracking → Safeguarding → Intervention planning",
      steps: ["Health Check-in", "Incident Recording", "Risk Assessment", "Intervention Planning", "Follow-up Tracking"]
    }
  ];

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);
  const WorkflowComponent = selectedWorkflowData?.component;

  return (
    <section className="py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/20">
            Interactive Workflows
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            Module Workflows &
            <span className="text-primary block">Process Diagrams</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore how each module works with interactive workflow diagrams that show 
            the complete process from start to finish.
          </p>
        </div>

        <Tabs defaultValue="interactive" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="interactive">Interactive Workflows</TabsTrigger>
            <TabsTrigger value="overview">Process Overview</TabsTrigger>
          </TabsList>

          {/* Interactive Workflows */}
          <TabsContent value="interactive" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Select Workflow</h3>
                {workflows.map((workflow) => (
                  <button
                    key={workflow.id}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedWorkflow === workflow.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${workflow.color} flex items-center justify-center`}>
                        <workflow.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{workflow.name}</div>
                        <div className="text-xs text-muted-foreground">{workflow.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-3">
                {selectedWorkflowData && WorkflowComponent ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${selectedWorkflowData.color} flex items-center justify-center`}>
                          <selectedWorkflowData.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{selectedWorkflowData.name}</CardTitle>
                          <CardDescription>{selectedWorkflowData.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 bg-background">
                        <WorkflowComponent />
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>This interactive diagram shows the complete workflow for {selectedWorkflowData.name.toLowerCase()}. 
                        Each node represents a step in the process, and arrows show the flow of information and actions.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>Select a workflow to view the interactive diagram</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Process Overview */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {additionalWorkflows.map((workflow, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <workflow.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Process Steps
                      </h4>
                      <div className="space-y-2">
                        {workflow.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                              {stepIndex + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                      Interactive Diagram Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}