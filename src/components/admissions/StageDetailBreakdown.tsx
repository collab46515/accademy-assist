import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  UserPlus, 
  DollarSign, 
  FileCheck, 
  Eye, 
  Calendar, 
  CheckCircle, 
  CreditCard,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Clock,
  AlertCircle,
  Target,
  CheckSquare,
  User
} from 'lucide-react';

interface StageDetail {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  activities: string[];
  tasks: {
    task: string;
    responsible: string;
    timeframe: string;
    critical: boolean;
  }[];
  stakeholders: {
    role: string;
    responsibilities: string[];
  }[];
  requirements: {
    category: string;
    items: string[];
    mandatory: boolean;
  }[];
  outcomes: string[];
  nextSteps: string[];
  duration: string;
  automations: string[];
}

const DETAILED_WORKFLOW_STAGES: StageDetail[] = [
  {
    key: 'submitted',
    label: 'Application Submitted',
    description: 'Application received and initial review',
    icon: UserPlus,
    color: 'bg-blue-100 text-blue-800',
    duration: '1-2 hours',
    activities: [
      'Receive application via online form (7 steps)',
      'Generate unique application number',
      'Verify all Anand Niketan form fields submitted',
      'Send confirmation email to parents',
      'Assign to review queue'
    ],
    tasks: [
      { task: 'Generate application number', responsible: 'System', timeframe: 'Immediate', critical: true },
      { task: 'Initial data validation', responsible: 'Admissions Officer', timeframe: '2 hours', critical: true },
      { task: 'Source tracking setup', responsible: 'System', timeframe: 'Immediate', critical: false },
      { task: 'Parent confirmation email', responsible: 'System', timeframe: '5 minutes', critical: true }
    ],
    stakeholders: [
      {
        role: 'Admissions Officer',
        responsibilities: ['Data validation', 'Initial review', 'Parent contact']
      },
      {
        role: 'Reception Staff',
        responsibilities: ['Walk-in applications', 'Phone enquiries', 'Initial guidance']
      },
      {
        role: 'IT System',
        responsibilities: ['Auto-numbering', 'Email notifications', 'Data capture']
      }
    ],
    requirements: [
      {
        category: 'Basic Information',
        items: ['Student name', 'Date of birth', 'Parent contact details', 'Current school'],
        mandatory: true
      },
      {
        category: 'Application Source',
        items: ['Source tracking', 'Referral details', 'Marketing attribution'],
        mandatory: false
      }
    ],
    outcomes: [
      'Application number assigned',
      'Initial record created',
      'Confirmation sent to parents',
      'Ready for fee processing'
    ],
    nextSteps: [
      'Application fee processing',
      'Document collection preparation',
      'Pathway-specific workflow initiation'
    ],
    automations: [
      'Application number generation',
      'Confirmation email sending',
      'CRM record creation',
      'Workflow queue assignment'
    ]
  },
  {
    key: 'under_review',
    label: 'Application Review & Verify',
    description: 'Document verification and comprehensive review',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-800',
    duration: '2-5 days',
    activities: [
      'Verify all 11 required documents from Anand Niketan form',
      'Check mandatory documents: Passport photo, Birth cert, Aadhaar, Community cert, Salary cert, Org endorsement',
      'Review optional documents: Ration card, Medical cert, Church endorsement, Transfer cert, Migration cert',
      'Score application (Academic, Behavior, Communication)',
      'Conduct detailed data validation'
    ],
    tasks: [
      { task: 'Issue payment invoice', responsible: 'Finance System', timeframe: '1 hour', critical: true },
      { task: 'Monitor payment status', responsible: 'Finance Officer', timeframe: '24 hours', critical: true },
      { task: 'Payment verification', responsible: 'Finance Officer', timeframe: '2 hours', critical: true },
      { task: 'Fee waiver assessment', responsible: 'Senior Admin', timeframe: '24 hours', critical: false }
    ],
    stakeholders: [
      {
        role: 'Finance Officer',
        responsibilities: ['Payment processing', 'Fee verification', 'Financial record updates']
      },
      {
        role: 'Admissions Team',
        responsibilities: ['Fee waiver decisions', 'Payment follow-up', 'Parent communication']
      },
      {
        role: 'Payment Gateway',
        responsibilities: ['Secure payment processing', 'Transaction verification', 'Refund processing']
      }
    ],
    requirements: [
      {
        category: 'Payment Details',
        items: ['Application fee amount', 'Payment method', 'Transaction reference'],
        mandatory: true
      },
      {
        category: 'Fee Waivers',
        items: ['Financial hardship documentation', 'Staff child verification', 'Scholarship eligibility'],
        mandatory: false
      }
    ],
    outcomes: [
      'Payment confirmed and recorded',
      'Financial records updated',
      'Application unlocked for processing',
      'Receipt issued to parents'
    ],
    nextSteps: [
      'Begin enrollment requirements collection',
      'Document verification process',
      'Academic record review'
    ],
    automations: [
      'Payment link generation',
      'Transaction verification',
      'Receipt generation',
      'Workflow progression trigger'
    ]
  },
  {
    key: 'enrollment',
    label: 'Enrollment Processing',
    description: 'Basic enrollment requirements processing and document collection',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-800',
    duration: '3-5 days',
    activities: [
      'Collect essential documents',
      'Verify age and year group eligibility',
      'Check previous school records',
      'Initial medical information review',
      'Set up student portal access'
    ],
    tasks: [
      { task: 'Document checklist creation', responsible: 'Admissions Officer', timeframe: '1 day', critical: true },
      { task: 'Age verification', responsible: 'Admissions Officer', timeframe: '2 hours', critical: true },
      { task: 'Previous school contact', responsible: 'Academic Admin', timeframe: '2 days', critical: true },
      { task: 'Medical form review', responsible: 'School Nurse', timeframe: '1 day', critical: false }
    ],
    stakeholders: [
      {
        role: 'Admissions Officer',
        responsibilities: ['Document verification', 'Eligibility checking', 'Parent communication']
      },
      {
        role: 'Academic Administrator',
        responsibilities: ['Previous school liaison', 'Academic record verification', 'Year group placement']
      },
      {
        role: 'School Nurse',
        responsibilities: ['Medical information review', 'Health requirement assessment', 'Special needs identification']
      }
    ],
    requirements: [
      {
        category: 'Essential Documents',
        items: ['Birth certificate', 'Proof of address', 'Previous school reports', 'Passport/ID'],
        mandatory: true
      },
      {
        category: 'Medical Information',
        items: ['Medical history form', 'Immunization records', 'Special needs documentation'],
        mandatory: true
      },
      {
        category: 'Academic Records',
        items: ['Last 2 years reports', 'Current school reference', 'Test scores'],
        mandatory: true
      }
    ],
    outcomes: [
      'All essential documents collected',
      'Eligibility confirmed',
      'Student portal activated',
      'Initial academic profile created'
    ],
    nextSteps: [
      'Comprehensive application review',
      'Academic assessment scheduling',
      'Interview preparation'
    ],
    automations: [
      'Document checklist generation',
      'Portal account creation',
      'Reminder email scheduling',
      'Compliance checking'
    ]
  },
  {
    key: 'review',
    label: 'Detailed Review',
    description: 'Comprehensive review of all application details and documentation',
    icon: Eye,
    color: 'bg-amber-100 text-amber-800',
    duration: '5-7 days',
    activities: [
      'Complete document verification',
      'Academic history analysis',
      'Special educational needs assessment',
      'Behavioral and pastoral review',
      'Reference verification'
    ],
    tasks: [
      { task: 'Academic transcript analysis', responsible: 'Academic Head', timeframe: '2 days', critical: true },
      { task: 'SEN assessment review', responsible: 'SENCO', timeframe: '3 days', critical: true },
      { task: 'Reference verification', responsible: 'Admissions Officer', timeframe: '2 days', critical: true },
      { task: 'Pastoral concerns review', responsible: 'Head of Pastoral', timeframe: '1 day', critical: false }
    ],
    stakeholders: [
      {
        role: 'Academic Head',
        responsibilities: ['Academic standard assessment', 'Curriculum fit evaluation', 'Grade progression analysis']
      },
      {
        role: 'SENCO',
        responsibilities: ['Special needs assessment', 'Support requirement planning', 'Resource allocation']
      },
      {
        role: 'Head of Pastoral',
        responsibilities: ['Behavioral review', 'Social integration assessment', 'Welfare considerations']
      },
      {
        role: 'Admissions Committee',
        responsibilities: ['Holistic review', 'Decision recommendations', 'Policy compliance']
      }
    ],
    requirements: [
      {
        category: 'Academic Assessment',
        items: ['Grade analysis', 'Subject performance', 'Learning difficulties identification'],
        mandatory: true
      },
      {
        category: 'References',
        items: ['Current school reference', 'Character reference', 'Academic reference'],
        mandatory: true
      },
      {
        category: 'Special Considerations',
        items: ['SEN documentation', 'Behavioral reports', 'Medical accommodations'],
        mandatory: false
      }
    ],
    outcomes: [
      'Complete application profile',
      'Academic fit assessment',
      'Support needs identification',
      'Assessment/interview recommendation'
    ],
    nextSteps: [
      'Schedule assessment or interview',
      'Prepare assessment materials',
      'Brief assessment team'
    ],
    automations: [
      'Document completeness checking',
      'Grade calculation analysis',
      'Red flag identification',
      'Assessment scheduling triggers'
    ]
  },
  {
    key: 'assessment',
    label: 'Assessment/Interview',
    description: 'Academic assessment and/or personal interview conducted',
    icon: Calendar,
    color: 'bg-indigo-100 text-indigo-800',
    duration: '1-2 weeks',
    activities: [
      'Schedule assessment/interview slots',
      'Conduct academic assessments',
      'Perform personal interviews',
      'Evaluate assessment results',
      'Provide feedback and recommendations'
    ],
    tasks: [
      { task: 'Assessment scheduling', responsible: 'Admissions Coordinator', timeframe: '3 days', critical: true },
      { task: 'Assessment delivery', responsible: 'Assessment Team', timeframe: '2 hours', critical: true },
      { task: 'Interview conduct', responsible: 'Interview Panel', timeframe: '45 minutes', critical: true },
      { task: 'Results evaluation', responsible: 'Academic Team', timeframe: '2 days', critical: true }
    ],
    stakeholders: [
      {
        role: 'Assessment Team',
        responsibilities: ['Test administration', 'Academic evaluation', 'Skills assessment']
      },
      {
        role: 'Interview Panel',
        responsibilities: ['Personal interviews', 'Character assessment', 'Motivation evaluation']
      },
      {
        role: 'Subject Teachers',
        responsibilities: ['Subject-specific assessment', 'Academic potential evaluation', 'Learning style identification']
      }
    ],
    requirements: [
      {
        category: 'Assessment Setup',
        items: ['Test materials', 'Assessment room booking', 'Technology setup'],
        mandatory: true
      },
      {
        category: 'Interview Preparation',
        items: ['Interview panel availability', 'Student information brief', 'Question framework'],
        mandatory: true
      }
    ],
    outcomes: [
      'Academic assessment scores',
      'Interview evaluation reports',
      'Recommendation for admission',
      'Support needs identification'
    ],
    nextSteps: [
      'Compile assessment reports',
      'Decision committee review',
      'Admission recommendation'
    ],
    automations: [
      'Scheduling system integration',
      'Assessment scoring automation',
      'Report generation',
      'Result notification preparation'
    ]
  },
  {
    key: 'decision',
    label: 'Admission Decision',
    description: 'Final decision making: Approved, Rejected, or On Hold',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    duration: '2-3 days',
    activities: [
      'Review all assessment data',
      'Committee decision meeting',
      'Decision documentation',
      'Outcome communication',
      'Next steps planning'
    ],
    tasks: [
      { task: 'Committee meeting', responsible: 'Admissions Committee', timeframe: '1 day', critical: true },
      { task: 'Decision documentation', responsible: 'Admissions Head', timeframe: '4 hours', critical: true },
      { task: 'Parent notification', responsible: 'Admissions Officer', timeframe: '2 hours', critical: true },
      { task: 'Waiting list management', responsible: 'Admissions Team', timeframe: '1 day', critical: false }
    ],
    stakeholders: [
      {
        role: 'Admissions Committee',
        responsibilities: ['Final decision making', 'Policy compliance', 'Appeals consideration']
      },
      {
        role: 'Headteacher',
        responsibilities: ['Decision approval', 'Appeal reviews', 'Policy exceptions']
      },
      {
        role: 'Admissions Head',
        responsibilities: ['Decision communication', 'Documentation', 'Process management']
      }
    ],
    requirements: [
      {
        category: 'Decision Criteria',
        items: ['Academic standards', 'School fit', 'Available spaces', 'Special considerations'],
        mandatory: true
      },
      {
        category: 'Documentation',
        items: ['Decision rationale', 'Committee minutes', 'Appeal process information'],
        mandatory: true
      }
    ],
    outcomes: [
      'Approved/Rejected/On Hold decision',
      'Decision communication sent',
      'Next steps outlined',
      'Appeals process activated if needed'
    ],
    nextSteps: [
      'If approved: Deposit invoice generation',
      'If rejected: Appeal process information',
      'If on hold: Review timeline communication'
    ],
    automations: [
      'Decision letter generation',
      'Parent notification emails',
      'Deposit invoice creation',
      'CRM status updates'
    ]
  },
  {
    key: 'deposit',
    label: 'Deposit Payment',
    description: 'Deposit payment processing to secure student place',
    icon: CreditCard,
    color: 'bg-emerald-100 text-emerald-800',
    duration: '2 weeks',
    activities: [
      'Generate deposit invoice',
      'Monitor payment deadline',
      'Process deposit payment',
      'Secure student place',
      'Prepare welcome materials'
    ],
    tasks: [
      { task: 'Deposit invoice generation', responsible: 'Finance System', timeframe: '1 hour', critical: true },
      { task: 'Payment monitoring', responsible: 'Finance Officer', timeframe: 'Daily', critical: true },
      { task: 'Place confirmation', responsible: 'Admissions Officer', timeframe: '2 hours', critical: true },
      { task: 'Welcome pack preparation', responsible: 'Admissions Team', timeframe: '1 day', critical: false }
    ],
    stakeholders: [
      {
        role: 'Finance Team',
        responsibilities: ['Deposit processing', 'Payment verification', 'Financial record updates']
      },
      {
        role: 'Admissions Team',
        responsibilities: ['Place confirmation', 'Welcome pack preparation', 'Parent communication']
      }
    ],
    requirements: [
      {
        category: 'Payment Processing',
        items: ['Deposit amount calculation', 'Payment deadline', 'Payment methods'],
        mandatory: true
      },
      {
        category: 'Place Security',
        items: ['Confirmation documentation', 'Contract signing', 'Terms acceptance'],
        mandatory: true
      }
    ],
    outcomes: [
      'Deposit payment received',
      'Student place secured',
      'Welcome materials sent',
      'Admission confirmed'
    ],
    nextSteps: [
      'Final admission confirmation',
      'Class allocation preparation',
      'Orientation planning'
    ],
    automations: [
      'Deposit invoice generation',
      'Payment deadline reminders',
      'Confirmation letter creation',
      'CRM status updates'
    ]
  },
  {
    key: 'confirmed',
    label: 'Admission Confirmed',
    description: 'Final admission confirmation and welcome process',
    icon: Award,
    color: 'bg-green-200 text-green-900',
    duration: '1 week',
    activities: [
      'Send final confirmation',
      'Provide welcome pack',
      'School policies distribution',
      'Medical clearance',
      'Orientation preparation'
    ],
    tasks: [
      { task: 'Confirmation letter sending', responsible: 'Admissions Officer', timeframe: '1 day', critical: true },
      { task: 'Welcome pack distribution', responsible: 'Admissions Team', timeframe: '2 days', critical: true },
      { task: 'Medical clearance', responsible: 'School Nurse', timeframe: '3 days', critical: true },
      { task: 'Orientation invitation', responsible: 'Pastoral Team', timeframe: '1 day', critical: false }
    ],
    stakeholders: [
      {
        role: 'Admissions Team',
        responsibilities: ['Final confirmation', 'Documentation distribution', 'Parent liaison']
      },
      {
        role: 'School Nurse',
        responsibilities: ['Medical clearance', 'Health plan creation', 'Emergency contact verification']
      },
      {
        role: 'Pastoral Team',
        responsibilities: ['Orientation planning', 'House assignment', 'Buddy system setup']
      }
    ],
    requirements: [
      {
        category: 'Final Documentation',
        items: ['Signed contracts', 'Medical clearance', 'Emergency contacts', 'Photo permissions'],
        mandatory: true
      },
      {
        category: 'Welcome Materials',
        items: ['Student handbook', 'Uniform requirements', 'School calendar', 'Contact directories'],
        mandatory: true
      }
    ],
    outcomes: [
      'Admission fully confirmed',
      'All documentation complete',
      'Student ready for placement',
      'Orientation scheduled'
    ],
    nextSteps: [
      'Class allocation process',
      'Timetable creation',
      'IT account setup'
    ],
    automations: [
      'Confirmation letter generation',
      'Welcome pack assembly',
      'Medical reminder scheduling',
      'Orientation invitation sending'
    ]
  },
  {
    key: 'class_allocation',
    label: 'Class Allocation',
    description: 'Class assignment, house allocation, and final setup',
    icon: GraduationCap,
    color: 'bg-blue-200 text-blue-900',
    duration: '3-5 days',
    activities: [
      'Analyze academic profile',
      'Assign to appropriate class',
      'House allocation',
      'Timetable creation',
      'IT systems setup'
    ],
    tasks: [
      { task: 'Academic level assessment', responsible: 'Academic Coordinator', timeframe: '1 day', critical: true },
      { task: 'Class assignment', responsible: 'Head of Year', timeframe: '1 day', critical: true },
      { task: 'House allocation', responsible: 'House Coordinator', timeframe: '1 day', critical: true },
      { task: 'IT account creation', responsible: 'IT Team', timeframe: '2 days', critical: true }
    ],
    stakeholders: [
      {
        role: 'Academic Coordinator',
        responsibilities: ['Academic placement', 'Subject level assignment', 'Learning support allocation']
      },
      {
        role: 'Head of Year',
        responsibilities: ['Class balancing', 'Pastoral considerations', 'Form tutor assignment']
      },
      {
        role: 'House Coordinator',
        responsibilities: ['House selection', 'House mentor assignment', 'House activity inclusion']
      },
      {
        role: 'IT Team',
        responsibilities: ['Account creation', 'System access setup', 'Device assignment']
      }
    ],
    requirements: [
      {
        category: 'Academic Placement',
        items: ['Subject level assessment', 'Learning support needs', 'Class size balancing'],
        mandatory: true
      },
      {
        category: 'System Setup',
        items: ['Student ID creation', 'IT account setup', 'Access permissions', 'Device assignment'],
        mandatory: true
      },
      {
        category: 'Pastoral Setup',
        items: ['House assignment', 'Form tutor allocation', 'Buddy assignment'],
        mandatory: true
      }
    ],
    outcomes: [
      'Class placement confirmed',
      'House allocation complete',
      'IT systems active',
      'Student ready to start'
    ],
    nextSteps: [
      'First day preparation',
      'Parent orientation',
      'Student induction planning'
    ],
    automations: [
      'Student ID generation',
      'IT account creation',
      'Timetable generation',
      'Parent notification sending'
    ]
  }
];

interface StageDetailBreakdownProps {
  selectedStage?: string;
}

export function StageDetailBreakdown({ selectedStage }: StageDetailBreakdownProps) {
  const [expandedStages, setExpandedStages] = useState<string[]>(selectedStage ? [selectedStage] : []);

  const toggleStage = (stageKey: string) => {
    setExpandedStages(prev => 
      prev.includes(stageKey) 
        ? prev.filter(key => key !== stageKey)
        : [...prev, stageKey]
    );
  };

  const expandAll = () => {
    setExpandedStages(DETAILED_WORKFLOW_STAGES.map(stage => stage.key));
  };

  const collapseAll = () => {
    setExpandedStages([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Detailed Stage Breakdown</h3>
          <p className="text-muted-foreground">
            Complete activities, tasks, and requirements for each workflow stage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {DETAILED_WORKFLOW_STAGES.map((stage) => (
          <Card key={stage.key} className="shadow-sm">
            <Collapsible 
              open={expandedStages.includes(stage.key)}
              onOpenChange={() => toggleStage(stage.key)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${stage.color}`}>
                        <stage.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{stage.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            {stage.duration}
                          </Badge>
                          <Badge variant="outline">
                            {stage.tasks.length} tasks
                          </Badge>
                          <Badge variant="outline">
                            {stage.stakeholders.length} stakeholders
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {expandedStages.includes(stage.key) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <Tabs defaultValue="activities" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="activities">Activities</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                      <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                      <TabsTrigger value="automation">Automation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="activities" className="mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Key Activities
                        </h4>
                        <ul className="space-y-2">
                          {stage.activities.map((activity, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="tasks" className="mt-4">
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <CheckSquare className="h-4 w-4" />
                          Specific Tasks
                        </h4>
                        <div className="space-y-3">
                          {stage.tasks.map((task, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{task.task}</span>
                                    {task.critical && (
                                      <Badge variant="destructive" className="text-xs">
                                        Critical
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span>👤 {task.responsible}</span>
                                    <span>⏰ {task.timeframe}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="stakeholders" className="mt-4">
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Stakeholders & Responsibilities
                        </h4>
                        <div className="grid gap-3">
                          {stage.stakeholders.map((stakeholder, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h5 className="font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {stakeholder.role}
                              </h5>
                              <ul className="mt-2 space-y-1">
                                {stakeholder.responsibilities.map((resp, respIndex) => (
                                  <li key={respIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span>•</span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="requirements" className="mt-4">
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Requirements & Documentation
                        </h4>
                        <div className="space-y-3">
                          {stage.requirements.map((req, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{req.category}</h5>
                                <Badge variant={req.mandatory ? "default" : "secondary"}>
                                  {req.mandatory ? "Mandatory" : "Optional"}
                                </Badge>
                              </div>
                              <ul className="space-y-1">
                                {req.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="text-sm flex items-center gap-2">
                                    {req.mandatory ? (
                                      <AlertCircle className="h-3 w-3 text-red-500" />
                                    ) : (
                                      <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                                    )}
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="outcomes" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-3">
                            <CheckCircle className="h-4 w-4" />
                            Expected Outcomes
                          </h4>
                          <ul className="space-y-2">
                            {stage.outcomes.map((outcome, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4" />
                            Next Steps
                          </h4>
                          <ul className="space-y-2">
                            {stage.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <span className="text-sm">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="automation" className="mt-4">
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileCheck className="h-4 w-4" />
                          Automated Processes
                        </h4>
                        <div className="grid gap-2">
                          {stage.automations.map((automation, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm">{automation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}