import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Calendar,
  FileText,
  UserCheck,
  Send
} from 'lucide-react';

interface WorkflowDashboardProps {
  getStatusColor: (status: string) => string;
  onViewApplications?: (status: string) => void;
}

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  applications: number;
  avgDays: number;
  color: string;
}

export function WorkflowDashboard({ getStatusColor, onViewApplications }: WorkflowDashboardProps) {
  const [workflowData, setWorkflowData] = useState<WorkflowStage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      // Mock data - in real implementation, this would aggregate from database
      const stages: WorkflowStage[] = [
        {
          id: 'submitted',
          name: 'Application Submitted',
          description: 'New applications awaiting initial review',
          icon: <FileText className="h-5 w-5" />,
          applications: 15,
          avgDays: 1,
          color: 'bg-blue-500'
        },
        {
          id: 'reviewing',
          name: 'Under Review',
          description: 'Applications being reviewed by admissions team',
          icon: <Users className="h-5 w-5" />,
          applications: 23,
          avgDays: 3,
          color: 'bg-amber-500'
        },
        {
          id: 'assessment',
          name: 'Assessment Stage',
          description: 'Students scheduled for or completing assessments',
          icon: <Calendar className="h-5 w-5" />,
          applications: 12,
          avgDays: 7,
          color: 'bg-purple-500'
        },
        {
          id: 'interview',
          name: 'Interview Scheduled',
          description: 'Interviews arranged with families',
          icon: <UserCheck className="h-5 w-5" />,
          applications: 8,
          avgDays: 5,
          color: 'bg-indigo-500'
        },
        {
          id: 'decision',
          name: 'Decision Pending',
          description: 'Final decisions being made',
          icon: <CheckCircle className="h-5 w-5" />,
          applications: 6,
          avgDays: 2,
          color: 'bg-orange-500'
        },
        {
          id: 'approved',
          name: 'Approved',
          description: 'Offers sent, awaiting acceptance',
          icon: <Send className="h-5 w-5" />,
          applications: 18,
          avgDays: 14,
          color: 'bg-green-500'
        }
      ];
      
      setWorkflowData(stages);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = workflowData.reduce((sum, stage) => sum + stage.applications, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total in Pipeline</p>
                <p className="text-3xl font-bold">{totalApplications}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Avg Processing Time</p>
                <p className="text-3xl font-bold">5.2d</p>
              </div>
              <Clock className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold">78%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Bottlenecks</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Stages */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Workflow Pipeline</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflowData.map((stage, index) => (
            <Card key={stage.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stage.color} text-white`}>
                    {stage.icon}
                  </div>
                  <Badge variant="secondary">{stage.applications} apps</Badge>
                </div>
                <CardTitle className="text-lg">{stage.name}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Applications</span>
                    <span className="font-semibold">{stage.applications}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Days</span>
                    <span className="font-semibold">{stage.avgDays}d</span>
                  </div>
                  
                  <Progress 
                    value={(stage.applications / totalApplications) * 100} 
                    className="h-2"
                  />
                  
                  <div className="pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-slate-100"
                      onClick={() => onViewApplications?.(stage.id)}
                    >
                      View Applications
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stage Performance</CardTitle>
            <CardDescription>Average time spent in each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflowData.map((stage) => (
                <div key={stage.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${stage.color} text-white`}>
                      {stage.icon}
                    </div>
                    <span className="text-sm font-medium">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{stage.avgDays} days</span>
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stage.color} transition-all duration-300`}
                        style={{ width: `${(stage.avgDays / 14) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottleneck Alerts</CardTitle>
            <CardDescription>Stages requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Assessment Stage Delays</p>
                  <p className="text-sm text-amber-700">
                    12 applications have been in assessment for over 10 days
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Review Cases
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Interview Backlog</p>
                  <p className="text-sm text-blue-700">
                    8 interviews need to be scheduled this week
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Schedule Interviews
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">On Track</p>
                  <p className="text-sm text-green-700">
                    Most workflows are proceeding normally
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}