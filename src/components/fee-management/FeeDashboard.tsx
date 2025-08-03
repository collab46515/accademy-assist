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
import { FiltersModal, FilterOptions } from './FiltersModal';
import { ExportModal } from './ExportModal';

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
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<'collected' | 'outstanding' | 'percentage' | 'expected' | 'overdue'>('collected');
  const [selectedBulkAction, setSelectedBulkAction] = useState<'reminder' | 'invoice' | 'collection' | 'report'>('reminder');
  const [viewMode, setViewMode] = useState<'overall' | 'class'>('overall');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    dateRange: { from: null, to: null },
    classes: [],
    yearGroups: [],
    feeTypes: [],
    paymentStatus: [],
    amountRange: { min: null, max: null },
    searchTerm: ''
  });
  
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

  const handleApplyFilters = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    // Apply filters to data
    fetchDashboardData(); // In real app, this would filter the query
    toast({
      title: "Filters Applied",
      description: "Dashboard data updated with your filter selection.",
    });
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
      <div className="space-y-8 animate-fade-in">
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-10 bg-muted rounded-lg w-32 animate-pulse"></div>
        </div>

        {/* Loading Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                      <div className="h-8 bg-gradient-to-r from-muted to-muted/50 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-12 w-12 bg-muted rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="h-64 bg-gradient-to-b from-muted/50 to-muted rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="h-64 bg-gradient-to-t from-muted/50 to-muted rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Fee Management Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real-time financial overview with interactive analytics and streamlined fee collection tools
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => setFiltersModalOpen(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(currentFilters.classes.length > 0 || currentFilters.searchTerm || currentFilters.dateRange.from) && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {[
                    currentFilters.classes.length,
                    currentFilters.yearGroups.length,
                    currentFilters.feeTypes.length,
                    currentFilters.paymentStatus.length,
                    currentFilters.searchTerm ? 1 : 0,
                    (currentFilters.dateRange.from || currentFilters.dateRange.to) ? 1 : 0,
                    (currentFilters.amountRange.min || currentFilters.amountRange.max) ? 1 : 0
                  ].reduce((sum, count) => sum + count, 0)}
                </Badge>
              )}
            </Button>
            <Button 
              className="shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary to-primary/90"
              onClick={() => setExportModalOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid - Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Collected */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-0 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 animate-scale-in"
            onClick={() => handleMetricClick('collected')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-primary-foreground/90 text-sm font-medium">Total Collected</p>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">This Term</Badge>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight">£{metrics.totalCollected.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-primary-foreground/80">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">Click for insights</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <PoundSterling className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Fees */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 animate-scale-in"
            onClick={() => handleMetricClick('outstanding')}
            style={{ animationDelay: '0.1s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-red-700 text-sm font-medium">Outstanding Fees</p>
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-red-600 tracking-tight">£{metrics.outstandingFees.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">View breakdown</span>
                  </div>
                </div>
                <div className="p-3 bg-red-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection Percentage */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 animate-scale-in"
            onClick={() => handleMetricClick('percentage')}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-green-700 text-sm font-medium">Collection Rate</p>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-300">Target: 85%</Badge>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-green-600 tracking-tight">{metrics.collectionPercentage}%</p>
                  <Progress 
                    value={metrics.collectionPercentage} 
                    className="h-2 bg-green-100"
                    style={{ 
                      // @ts-ignore
                      '--tw-progress-background': 'hsl(142 76% 36%)'
                    }}
                  />
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">View trends</span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Expected */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 animate-scale-in"
            onClick={() => handleMetricClick('expected')}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-blue-700 text-sm font-medium">Today's Expected</p>
                    <Badge variant="default" className="text-xs bg-blue-100 text-blue-700 border-blue-300">8 pending</Badge>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-600 tracking-tight">£{metrics.todayExpected.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">View list</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Accounts */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 animate-scale-in"
            onClick={() => handleMetricClick('overdue')}
            style={{ animationDelay: '0.4s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-orange-700 text-sm font-medium">Overdue Accounts</p>
                    {metrics.overdueAccounts > 0 && (
                      <Badge variant="destructive" className="text-xs animate-pulse">Action Required</Badge>
                    )}
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-orange-600 tracking-tight">{metrics.overdueAccounts}</p>
                  <p className="text-sm text-orange-600/80 font-medium">students</p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">View details</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Charts Section */}
          <div className="xl:col-span-3 space-y-8">
            {/* Collection Progress by Class */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background/50 to-muted/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      Collection Progress by Class
                    </CardTitle>
                    <CardDescription>Interactive overview - click bars or class buttons for detailed breakdown</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-primary/10"
                      onClick={() => setFiltersModalOpen(true)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter Classes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-primary/10"
                      onClick={() => {
                        setSelectedMetric('collected');
                        setMetricDetailModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={classCollections} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis 
                          dataKey="className" 
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                        />
                        <Bar 
                          dataKey="percentage" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                          onClick={(data) => handleClassClick(data.className)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                {/* Class Quick Access Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {classCollections.map((classItem, index) => (
                    <Button
                      key={classItem.className}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-start bg-gradient-to-br from-muted/50 to-muted/30 hover:from-primary/10 hover:to-primary/5 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-md group animate-scale-in"
                      onClick={() => handleClassClick(classItem.className)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-sm">{classItem.className}</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={classItem.percentage} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {classItem.percentage}%
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        £{classItem.collected.toLocaleString()} / £{classItem.total.toLocaleString()}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Secondary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Outstanding by Category */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-lg font-semibold">Outstanding by Category</CardTitle>
                  <CardDescription>Fee breakdown requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          dataKey="amount"
                          label={({ category, percentage }) => `${category}\n${percentage}%`}
                          labelLine={false}
                          className="outline-none"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Daily Collections Trend */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    Daily Collections Trend
                    <Badge variant="default" className="text-xs">Last 7 Days</Badge>
                  </CardTitle>
                  <CardDescription>Payment collection momentum</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={dailyCollections} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          tickFormatter={(value) => `£${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ 
                            fill: "hsl(var(--primary))", 
                            strokeWidth: 2, 
                            r: 5,
                            className: "hover:r-7 transition-all duration-200"
                          }}
                          activeDot={{ 
                            r: 7, 
                            fill: "hsl(var(--primary))",
                            stroke: "hsl(var(--background))",
                            strokeWidth: 2
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-slide-in-right">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background/50 to-muted/20">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Essential tools at your fingertips</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { label: 'Record Payment', icon: CreditCard, action: 'Record Payment', color: 'text-green-600', bg: 'hover:bg-green-50' },
                  { label: 'Send Reminders', icon: Send, action: 'Send Reminder to All Overdue', color: 'text-blue-600', bg: 'hover:bg-blue-50' },
                  { label: 'Generate Invoices', icon: FileText, action: 'Generate Invoices (Bulk)', color: 'text-purple-600', bg: 'hover:bg-purple-50' },
                  { label: "Today's Collection", icon: Calendar, action: "View Today's Collection List", color: 'text-orange-600', bg: 'hover:bg-orange-50' }
                ].map((item, index) => (
                  <Button 
                    key={item.action}
                    onClick={() => handleQuickAction(item.action)}
                    variant="ghost"
                    className={`w-full justify-start h-auto p-4 ${item.bg} border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-md group animate-scale-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br from-background to-muted/50 group-hover:scale-110 transition-transform duration-200 mr-3`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">Click to access</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Mini Stats Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm animate-fade-in">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-primary">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                      <div className="text-lg font-bold">{classCollections.length}</div>
                      <div className="text-xs text-muted-foreground">Classes</div>
                    </div>
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                      <div className="text-lg font-bold">£{(metrics.totalCollected / 100).toFixed(0)}k</div>
                      <div className="text-xs text-muted-foreground">Avg/Class</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background/50 to-muted/20">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Priority Alerts
              {alerts.length > 0 && (
                <Badge variant="destructive" className="animate-bounce">{alerts.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-muted-foreground font-medium">All systems operating smoothly</p>
                <p className="text-sm text-muted-foreground mt-1">No active alerts at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <Alert 
                    key={alert.id} 
                    className={`border-l-4 ${alert.priority === 'high' ? 'border-l-red-500 bg-red-50/50' : alert.priority === 'medium' ? 'border-l-amber-500 bg-amber-50/50' : 'border-l-blue-500 bg-blue-50/50'} transition-all duration-300 hover:shadow-md animate-scale-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <AlertTriangle className={`h-4 w-4 ${alert.priority === 'high' ? 'text-red-500' : alert.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />
                    <AlertDescription className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{alert.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{alert.message}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(alert.priority) as any} className="text-xs">
                          {alert.priority}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Action
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
      
      <FiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        dataType="dashboard"
      />
    </div>
  );
}