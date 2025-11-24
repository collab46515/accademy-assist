import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Award,
  AlertCircle,
  Calendar,
  Plus,
  Download,
  Settings,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  growth: number;
  rejectionRate: number;
}

interface StageCount {
  stage: string;
  count: number;
  conversion: number;
}

interface MonthlyData {
  month: string;
  applications: number;
}

interface GradeData {
  grade: string;
  count: number;
}

interface RecentActivity {
  id: string;
  applicantName: string;
  action: string;
  timestamp: string;
  status: string;
}

export default function ApplicationsDashboard() {
  const navigate = useNavigate();
  const { currentSchool } = useRBAC();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    growth: 0,
    rejectionRate: 0
  });
  const [stageData, setStageData] = useState<StageCount[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [gradeData, setGradeData] = useState<GradeData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (currentSchool?.id) {
      loadDashboardData();
    }
  }, [currentSchool?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all applications
      const { data: applications, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('school_id', currentSchool.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const total = applications?.length || 0;
      const pending = applications?.filter(a => a.status === 'under_review' || a.status === 'documents_pending' || a.status === 'submitted').length || 0;
      const approved = applications?.filter(a => a.status === 'approved' || a.status === 'enrolled').length || 0;
      const rejected = applications?.filter(a => a.status === 'rejected').length || 0;

      // Calculate growth (compare to last month)
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonthApps = applications?.filter(a => new Date(a.created_at) >= lastMonth).length || 0;
      const prevMonthApps = total - thisMonthApps;
      const growth = prevMonthApps > 0 ? ((thisMonthApps - prevMonthApps) / prevMonthApps) * 100 : 0;

      const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;

      setStats({ total, pending, approved, rejected, growth, rejectionRate });

      // Calculate stage funnel
      const stages = [
        { stage: 'Applied', count: total, conversion: 100 },
        { 
          stage: 'Verified', 
          count: applications?.filter(a => 
            a.status !== 'under_review' && 
            a.status !== 'documents_pending' &&
            a.status !== 'submitted'
          ).length || 0,
          conversion: 0
        },
        { 
          stage: 'Assessed', 
          count: applications?.filter(a => 
            a.status === 'assessment_complete' || 
            a.status === 'interview_scheduled' ||
            a.status === 'interview_complete' ||
            a.status === 'approved' ||
            a.status === 'enrolled'
          ).length || 0,
          conversion: 0
        },
        { 
          stage: 'Interviewed', 
          count: applications?.filter(a => 
            a.status === 'interview_complete' ||
            a.status === 'approved' ||
            a.status === 'enrolled'
          ).length || 0,
          conversion: 0
        },
        { 
          stage: 'Approved', 
          count: approved,
          conversion: 0
        }
      ];

      // Calculate conversion rates
      stages.forEach((stage, index) => {
        if (index > 0) {
          stage.conversion = stages[0].count > 0 
            ? Math.round((stage.count / stages[0].count) * 100)
            : 0;
        }
      });

      setStageData(stages);

      // Monthly trend data (last 6 months)
      const monthlyApps: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const count = applications?.filter(a => {
          const appDate = new Date(a.created_at);
          return appDate >= monthStart && appDate <= monthEnd;
        }).length || 0;

        monthlyApps.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          applications: count
        });
      }
      setMonthlyData(monthlyApps);

      // Grade distribution
      const gradeMap: { [key: string]: number } = {};
      applications?.forEach(app => {
        const grade = app.year_group || 'Unknown';
        gradeMap[grade] = (gradeMap[grade] || 0) + 1;
      });

      const gradeDistribution = Object.entries(gradeMap)
        .map(([grade, count]) => ({ grade, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      setGradeData(gradeDistribution);

      // Recent activity (last 10)
      const recent = applications?.slice(0, 10).map(app => ({
        id: app.id,
        applicantName: app.student_name,
        action: getActionText(app.status),
        timestamp: new Date(app.updated_at).toLocaleString(),
        status: app.status
      })) || [];

      setRecentActivity(recent);

      // Generate alerts
      const pendingAlerts = applications?.filter(a => 
        (a.status === 'under_review' || a.status === 'documents_pending' || a.status === 'submitted') &&
        new Date(a.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // older than 7 days
      ) || [];

      const interviewAlerts = applications?.filter(a => 
        a.status === 'interview_scheduled'
      ) || [];

      const generatedAlerts = [
        ...pendingAlerts.slice(0, 3).map(app => ({
          id: app.id,
          type: 'overdue',
          message: `Application ${app.application_number} awaiting review for ${Math.floor((Date.now() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`,
          applicant: app.student_name
        })),
        ...interviewAlerts.slice(0, 2).map(app => ({
          id: app.id,
          type: 'interview',
          message: `Interview scheduled for ${app.student_name}`,
          applicant: app.student_name
        }))
      ];

      setAlerts(generatedAlerts);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActionText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'draft': 'Draft Created',
      'submitted': 'Application Submitted',
      'under_review': 'Under Review',
      'documents_pending': 'Documents Pending',
      'assessment_scheduled': 'Assessment Scheduled',
      'assessment_complete': 'Assessment Completed',
      'interview_scheduled': 'Interview Scheduled',
      'interview_complete': 'Interview Completed',
      'pending_approval': 'Awaiting Approval',
      'approved': 'Application Approved',
      'rejected': 'Application Rejected',
      'enrolled': 'Student Enrolled',
      'withdrawn': 'Application Withdrawn'
    };
    return statusMap[status] || 'Status Updated';
  };

  const statusColors = [
    { name: 'Pending', value: stats.pending, color: 'hsl(var(--chart-4))' },
    { name: 'Approved', value: stats.approved, color: 'hsl(var(--chart-2))' },
    { name: 'Rejected', value: stats.rejected, color: 'hsl(var(--chart-1))' }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-background to-primary/5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Application Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage student applications across all stages
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/admissions/enroll')}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center justify-between">
              Total Applications
              <Users className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {stats.growth >= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4" />
                  <span>+{stats.growth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4" />
                  <span>{stats.growth.toFixed(1)}%</span>
                </>
              )}
              <span className="text-white/80 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center justify-between">
              Pending Reviews
              <Clock className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
            <p className="text-sm text-white/80 mt-2">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-400 to-green-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center justify-between">
              Approved This Month
              <CheckCircle className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.approved}</div>
            <p className="text-sm text-white/80 mt-2">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-red-400 to-rose-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center justify-between">
              Rejection Rate
              <XCircle className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.rejectionRate.toFixed(1)}%</div>
            <p className="text-sm text-white/80 mt-2">
              {stats.rejected} rejected applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Funnel */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Application Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stageData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{stage.stage}</div>
                      <div className="text-sm text-muted-foreground">
                        {stage.count} applications • {stage.conversion}% conversion
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">{stage.count}</div>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${stage.conversion}%` }}
                  />
                </div>
                {index < stageData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Application Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusColors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="border-none shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Grade Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div>
                    <div className="font-medium">{activity.applicantName}</div>
                    <div className="text-sm text-muted-foreground">{activity.action}</div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                  </div>
                  <Badge variant={
                    activity.status === 'approved' ? 'default' :
                    activity.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/admissions/my-applications')}
            >
              View All Applications
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>All caught up! No pending alerts.</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'overdue' 
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-500' 
                        : 'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {alert.type === 'overdue' ? (
                        <Clock className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{alert.applicant}</div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/admissions?stage=3`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              onClick={() => navigate('/admissions/enroll')}
            >
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Start New Application</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 border-2"
              onClick={() => navigate('/admissions/my-applications')}
            >
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">View All Applications</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20 border-2">
              <div className="text-center">
                <Download className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Export Reports</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20 border-2">
              <div className="text-center">
                <Settings className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Manage Settings</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
