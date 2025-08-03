import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { 
  PoundSterling, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Bell, 
  FileText, 
  Calendar, 
  Send 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardMetrics {
  totalCollected: number;
  outstandingFees: number;
  collectionPercentage: number;
  todayExpected: number;
  overdueAccounts: number;
}

interface ClassCollection {
  className: string;
  percentage: number;
  collected: number;
  total: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface DailyCollection {
  date: string;
  amount: number;
}

interface FeeAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
}

const chartConfig = {
  collected: {
    label: "Collected",
    color: "hsl(var(--primary))",
  },
  outstanding: {
    label: "Outstanding", 
    color: "hsl(var(--muted))",
  },
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
};

export function FeeDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCollected: 0,
    outstandingFees: 0,
    collectionPercentage: 0,
    todayExpected: 0,
    overdueAccounts: 0
  });
  const [classCollections, setClassCollections] = useState<ClassCollection[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [dailyCollections, setDailyCollections] = useState<DailyCollection[]>([]);
  const [alerts, setAlerts] = useState<FeeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch payment records for total collected
      const { data: payments } = await supabase
        .from('payment_records')
        .select('amount, payment_date')
        .eq('status', 'completed');

      // Fetch student fee assignments for outstanding fees
      const { data: assignments } = await supabase
        .from('student_fee_assignments')
        .select('amount_due, amount_paid, status, class_name, due_date');

      // Fetch fee alerts
      const { data: alertsData } = await supabase
        .from('fee_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (payments && assignments) {
        // Calculate metrics
        const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalDue = assignments.reduce((sum, a) => sum + Number(a.amount_due), 0);
        const totalPaid = assignments.reduce((sum, a) => sum + Number(a.amount_paid), 0);
        const outstandingFees = totalDue - totalPaid;
        const collectionPercentage = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;
        
        // Calculate overdue accounts
        const today = new Date();
        const overdueAccounts = assignments.filter(a => 
          a.status !== 'paid' && new Date(a.due_date) < today
        ).length;

        // Calculate today's expected (mock for now)
        const todayExpected = 2100;

        setMetrics({
          totalCollected,
          outstandingFees,
          collectionPercentage,
          todayExpected,
          overdueAccounts
        });

        // Process class collections
        const classGroups = assignments.reduce((acc, assignment) => {
          const className = assignment.class_name || 'Unknown';
          if (!acc[className]) {
            acc[className] = { collected: 0, total: 0 };
          }
          acc[className].collected += Number(assignment.amount_paid);
          acc[className].total += Number(assignment.amount_due);
          return acc;
        }, {} as Record<string, { collected: number; total: number }>);

        const classCollectionsData = Object.entries(classGroups).map(([className, data]) => ({
          className,
          collected: data.collected,
          total: data.total,
          percentage: data.total > 0 ? Math.round((data.collected / data.total) * 100) : 0
        }));

        setClassCollections(classCollectionsData);

        // Mock category breakdown (would come from fee heads)
        setCategoryBreakdown([
          { category: 'Tuition', amount: outstandingFees * 0.6, percentage: 60 },
          { category: 'Transport', amount: outstandingFees * 0.25, percentage: 25 },
          { category: 'Exam', amount: outstandingFees * 0.15, percentage: 15 }
        ]);

        // Mock daily collections (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            amount: Math.floor(Math.random() * 2000) + 500
          };
        });
        setDailyCollections(last7Days);
      }

      setAlerts(alertsData?.map(alert => ({
        id: alert.id,
        type: alert.alert_type,
        title: alert.title,
        message: alert.message,
        priority: alert.priority
      })) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} feature coming soon!`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Collected (This Term)</p>
                <p className="text-3xl font-bold">£{metrics.totalCollected.toLocaleString()}</p>
              </div>
              <PoundSterling className="h-8 w-8 text-primary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Outstanding Fees</p>
                <p className="text-3xl font-bold text-destructive">£{metrics.outstandingFees.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">% Collected</p>
                <p className="text-3xl font-bold text-green-600">{metrics.collectionPercentage}%</p>
                <Progress value={metrics.collectionPercentage} className="mt-2" />
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Today's Expected</p>
                <p className="text-3xl font-bold">£{metrics.todayExpected.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue Accounts</p>
                <p className="text-3xl font-bold text-orange-600">{metrics.overdueAccounts}</p>
                <p className="text-sm text-muted-foreground">students</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Charts Section - 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Collection Progress by Class */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Progress by Class</CardTitle>
              <CardDescription>Percentage collected per class</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classCollections}>
                    <XAxis dataKey="className" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Outstanding Fees by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Outstanding by Category</CardTitle>
                <CardDescription>Breakdown of unpaid fees</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="amount"
                        label={({ category, percentage }) => `${category} ${percentage}%`}
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Daily Collections */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Collections (Last 7 Days)</CardTitle>
                <CardDescription>Collection trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dailyCollections}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Sidebar - 1 column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleQuickAction('Record Payment')}
                className="w-full justify-start"
                variant="outline"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
              <Button 
                onClick={() => handleQuickAction('Send Reminder to All Overdue')}
                className="w-full justify-start"
                variant="outline"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Reminder to All Overdue
              </Button>
              <Button 
                onClick={() => handleQuickAction('Generate Invoices (Bulk)')}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoices (Bulk)
              </Button>
              <Button 
                onClick={() => handleQuickAction("View Today's Collection List")}
                className="w-full justify-start"
                variant="outline"
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Today's Collection List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Urgent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Urgent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground">No active alerts</p>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-primary">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <strong>{alert.title}</strong> - {alert.message}
                  </div>
                  <Badge variant={getPriorityColor(alert.priority) as any}>
                    {alert.priority}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}