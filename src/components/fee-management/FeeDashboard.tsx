import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Send,
  Eye,
  Download,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentRecordModal } from './PaymentRecordModal';
import { ClassCollectionDetailModal } from './ClassCollectionDetailModal';
import { TodayCollectionModal } from './TodayCollectionModal';
import { MetricDetailModal } from './MetricDetailModal';
import { BulkActionsModal } from './BulkActionsModal';

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
  
  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [classDetailModalOpen, setClassDetailModalOpen] = useState(false);
  const [todayCollectionModalOpen, setTodayCollectionModalOpen] = useState(false);
  const [metricDetailModalOpen, setMetricDetailModalOpen] = useState(false);
  const [bulkActionsModalOpen, setBulkActionsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<'collected' | 'outstanding' | 'percentage' | 'expected' | 'overdue'>('collected');
  const [selectedBulkAction, setSelectedBulkAction] = useState<'reminder' | 'invoice' | 'collection' | 'report'>('reminder');
  const [viewMode, setViewMode] = useState<'overall' | 'class'>('overall');
  
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
    switch (action) {
      case 'Record Payment':
        setPaymentModalOpen(true);
        break;
      case 'Send Reminder to All Overdue':
        setSelectedBulkAction('reminder');
        setBulkActionsModalOpen(true);
        break;
      case 'Generate Invoices (Bulk)':
        setSelectedBulkAction('invoice');
        setBulkActionsModalOpen(true);
        break;
      case "View Today's Collection List":
        setTodayCollectionModalOpen(true);
        break;
      default:
        toast({
          title: "Quick Action",
          description: `${action} feature coming soon!`,
        });
    }
  };

  const handleMetricClick = (metricType: 'collected' | 'outstanding' | 'percentage' | 'expected' | 'overdue') => {
    setSelectedMetric(metricType);
    setMetricDetailModalOpen(true);
  };

  const handleClassClick = (className: string) => {
    setSelectedClass(className);
    setClassDetailModalOpen(true);
  };

  const getClassDetailData = (className: string) => {
    // Mock detailed data for the selected class
    const mockStudents = [
      {
        id: '1',
        name: 'James Wilson',
        amountDue: 1600,
        amountPaid: 0,
        status: 'pending',
        dueDate: '2025-08-15'
      },
      {
        id: '2',
        name: 'Sarah Brown',
        amountDue: 1600,
        amountPaid: 800,
        status: 'partial',
        dueDate: '2025-08-15'
      },
      {
        id: '3',
        name: 'Michael Johnson',
        amountDue: 1600,
        amountPaid: 1600,
        status: 'paid',
        dueDate: '2025-08-15'
      }
    ];

    const summary = {
      totalStudents: mockStudents.length,
      totalDue: mockStudents.reduce((sum, s) => sum + s.amountDue, 0),
      totalPaid: mockStudents.reduce((sum, s) => sum + s.amountPaid, 0),
      percentage: 0
    };
    summary.percentage = Math.round((summary.totalPaid / summary.totalDue) * 100);

    return { students: mockStudents, summary };
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
      {/* Key Metrics Row - All Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card 
          className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => handleMetricClick('collected')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Collected (This Term)</p>
                <p className="text-3xl font-bold">£{metrics.totalCollected.toLocaleString()}</p>
                <p className="text-sm text-primary-foreground/60 mt-1">Click for details</p>
              </div>
              <div className="flex flex-col items-center">
                <PoundSterling className="h-8 w-8 text-primary-foreground/60" />
                <Eye className="h-4 w-4 text-primary-foreground/60 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => handleMetricClick('outstanding')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Outstanding Fees</p>
                <p className="text-3xl font-bold text-destructive">£{metrics.outstandingFees.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Click for breakdown</p>
              </div>
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <Eye className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => handleMetricClick('percentage')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">% Collected</p>
                <p className="text-3xl font-bold text-green-600">{metrics.collectionPercentage}%</p>
                <Progress value={metrics.collectionPercentage} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">Click for trends</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <Eye className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => handleMetricClick('expected')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Today's Expected</p>
                <p className="text-3xl font-bold">£{metrics.todayExpected.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Click for list</p>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <Eye className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => handleMetricClick('overdue')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue Accounts</p>
                <p className="text-3xl font-bold text-orange-600">{metrics.overdueAccounts}</p>
                <p className="text-sm text-muted-foreground">students</p>
                <p className="text-sm text-muted-foreground mt-1">Click for details</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <Eye className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Collection Progress by Class</CardTitle>
                <CardDescription>Click on bars to see detailed breakdown</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classCollections}>
                    <XAxis dataKey="className" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="percentage" 
                      fill="hsl(var(--primary))" 
                      className="cursor-pointer"
                      onClick={(data) => handleClassClick(data.className)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {classCollections.map((classItem) => (
                  <Button
                    key={classItem.className}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-2 flex flex-col items-start"
                    onClick={() => handleClassClick(classItem.className)}
                  >
                    <span className="font-medium">{classItem.className}</span>
                    <span className="text-xs text-muted-foreground">
                      {classItem.percentage}% collected
                    </span>
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  </Button>
                ))}
              </div>
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

      {/* Interactive Modals */}
      <PaymentRecordModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onPaymentRecorded={fetchDashboardData}
      />
      
      <ClassCollectionDetailModal
        open={classDetailModalOpen}
        onOpenChange={setClassDetailModalOpen}
        className={selectedClass}
        data={getClassDetailData(selectedClass)}
      />
      
      <TodayCollectionModal
        open={todayCollectionModalOpen}
        onOpenChange={setTodayCollectionModalOpen}
      />
      
      <MetricDetailModal
        open={metricDetailModalOpen}
        onOpenChange={setMetricDetailModalOpen}
        metricType={selectedMetric}
        data={{}}
      />
      
      <BulkActionsModal
        open={bulkActionsModalOpen}
        onOpenChange={setBulkActionsModalOpen}
        actionType={selectedBulkAction}
      />
    </div>
  );
}