import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  Users,
  Clock,
  Target,
  Award,
  Download,
  RefreshCw,
  DollarSign,
  BookOpen,
  MessageSquare,
  Settings,
  Filter,
  Calendar,
  FileText,
  Eye,
  MousePointer
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface AttendanceMetric {
  year: string;
  attendance: number;
  trend: "up" | "down" | "stable";
  absent: number;
  late: number;
}

interface PerformanceMetric {
  subject: string;
  averageGrade: string;
  trend: "up" | "down" | "stable";
  passRate: number;
  topPerformers: number;
}

interface AtRiskStudent {
  id: string;
  name: string;
  year: string;
  riskFactors: string[];
  score: number;
  lastUpdated: string;
}

const mockAttendance: AttendanceMetric[] = [
  { year: "Year 7", attendance: 94.2, trend: "up", absent: 12, late: 8 },
  { year: "Year 8", attendance: 92.8, trend: "down", absent: 18, late: 15 },
  { year: "Year 9", attendance: 89.5, trend: "down", absent: 25, late: 22 },
  { year: "Year 10", attendance: 91.3, trend: "up", absent: 16, late: 12 },
  { year: "Year 11", attendance: 96.1, trend: "up", absent: 8, late: 5 }
];

const mockPerformance: PerformanceMetric[] = [
  { subject: "Mathematics", averageGrade: "B+", trend: "up", passRate: 87, topPerformers: 15 },
  { subject: "English", averageGrade: "A-", trend: "stable", passRate: 92, topPerformers: 22 },
  { subject: "Science", averageGrade: "B", trend: "up", passRate: 84, topPerformers: 18 },
  { subject: "History", averageGrade: "B+", trend: "down", passRate: 79, topPerformers: 12 },
  { subject: "Geography", averageGrade: "A-", trend: "up", passRate: 91, topPerformers: 20 }
];

const mockAtRiskStudents: AtRiskStudent[] = [
  {
    id: "STU001",
    name: "Alex Johnson",
    year: "Year 9",
    riskFactors: ["Poor attendance", "Declining grades"],
    score: 85,
    lastUpdated: "2024-01-15"
  },
  {
    id: "STU002",
    name: "Sam Wilson",
    year: "Year 10",
    riskFactors: ["Behavioral concerns", "Late submissions"],
    score: 78,
    lastUpdated: "2024-01-14"
  },
  {
    id: "STU003",
    name: "Jordan Smith",
    year: "Year 8",
    riskFactors: ["Social isolation", "Attendance drops"],
    score: 72,
    lastUpdated: "2024-01-13"
  }
];

// Enhanced analytics data
const financialData = [
  { month: "Jan", revenue: 125000, expenses: 95000, profit: 30000 },
  { month: "Feb", revenue: 132000, expenses: 98000, profit: 34000 },
  { month: "Mar", revenue: 128000, expenses: 101000, profit: 27000 },
  { month: "Apr", revenue: 145000, expenses: 105000, profit: 40000 },
  { month: "May", revenue: 138000, expenses: 102000, profit: 36000 },
  { month: "Jun", revenue: 155000, expenses: 108000, profit: 47000 }
];

const academicTrendData = [
  { term: "Term 1", mathematics: 78, english: 82, science: 75, history: 80 },
  { term: "Term 2", mathematics: 81, english: 84, science: 78, history: 82 },
  { term: "Term 3", mathematics: 83, english: 86, science: 80, history: 78 },
  { term: "Current", mathematics: 85, english: 88, science: 82, history: 79 }
];

const hrMetrics = [
  { department: "Teaching", employees: 45, satisfaction: 4.2, turnover: 5 },
  { department: "Administration", employees: 12, satisfaction: 4.0, turnover: 8 },
  { department: "Support", employees: 18, satisfaction: 4.5, turnover: 3 },
  { department: "Management", employees: 8, satisfaction: 4.1, turnover: 12 }
];

const communicationData = [
  { type: "Email", sent: 1250, opened: 985, responded: 456 },
  { type: "SMS", sent: 890, opened: 845, responded: 234 },
  { type: "Portal", sent: 567, opened: 432, responded: 198 },
  { type: "Letters", sent: 234, opened: 210, responded: 89 }
];

const moduleColors = {
  financial: "hsl(var(--chart-1))",
  academic: "hsl(var(--chart-2))",
  hr: "hsl(var(--chart-3))",
  communication: "hsl(var(--chart-4))",
  operational: "hsl(var(--chart-5))"
};

const AnalyticsPage = () => {
  const [activeModule, setActiveModule] = useState("overview");
  const [dateRange, setDateRange] = useState("last30days");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [reportBuilder, setReportBuilder] = useState({
    dataSources: [] as string[],
    visualizations: [] as string[],
    reportData: [] as any[],
    reportName: "Custom Report",
    showPreview: false
  });
  const { toast } = useToast();

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        toast({
          title: "Data Refreshed",
          description: "Analytics data has been updated with the latest information.",
        });
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, toast]);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "stable":
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const exportData = async (format: string, module: string) => {
    toast({
      title: `Exporting ${module} Report`,
      description: `Your ${format.toUpperCase()} report is being generated...`,
    });

    try {
      if (format === "pdf") {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text(`${module} Report`, 20, 20);
        
        // Add date
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
        
        // Add report data
        let yPos = 50;
        
        if (reportBuilder.showPreview && reportBuilder.reportData.length > 0) {
          doc.setFontSize(14);
          doc.text('Report Data:', 20, yPos);
          yPos += 10;
          
          doc.setFontSize(10);
          reportBuilder.reportData.slice(0, 20).forEach((item, index) => {
            const line = `${item.type} - ${item.category}: ${item.year || item.subject || item.department || item.month || 'N/A'} - ${item.attendance || item.averageGrade || item.satisfaction || item.revenue || 'N/A'}`;
            doc.text(line, 20, yPos);
            yPos += 8;
            
            // Add new page if needed
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
          });
        } else {
          // Add summary data for the module
          doc.setFontSize(14);
          doc.text('Analytics Summary:', 20, yPos);
          yPos += 15;
          
          doc.setFontSize(10);
          const summaryData = [
            'Total Revenue: £823,400 (+12.5%)',
            'Academic Performance: 85.2% average',
            'Staff Satisfaction: 4.2/5.0',
            'Student Attendance: 92.3%',
            'Active Users: 892',
            'System Uptime: 99.7%'
          ];
          
          summaryData.forEach(item => {
            doc.text(item, 20, yPos);
            yPos += 10;
          });
        }
        
        // Save the PDF
        doc.save(`${module.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`);
        
        toast({
          title: "Export Successful",
          description: "Your PDF report has been downloaded successfully.",
        });
      } else {
        // Handle other formats (CSV, Excel)
        const data = reportBuilder.reportData.length > 0 ? reportBuilder.reportData : [];
        const csvContent = format === 'csv' ? 
          "Type,Category,Details,Value\n" + 
          data.map(item => 
            `${item.type || ''},${item.category || ''},${item.year || item.subject || item.department || item.month || ''},${item.attendance || item.averageGrade || item.satisfaction || item.revenue || ''}`
          ).join('\n') : '';
        
        if (format === 'csv' && csvContent) {
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${module.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Export Successful",
            description: "Your CSV report has been downloaded successfully.",
          });
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const drillDown = (module: string, item: string) => {
    toast({
      title: "Drill-down Analysis",
      description: `Opening detailed view for ${item} in ${module} module.`,
    });
  };

  const addDataSource = (dataSource: string) => {
    if (!reportBuilder.dataSources.includes(dataSource)) {
      setReportBuilder(prev => ({
        ...prev,
        dataSources: [...prev.dataSources, dataSource],
        reportData: getReportData([...prev.dataSources, dataSource])
      }));
      toast({
        title: `${dataSource} Added`,
        description: `${dataSource} data source added to your custom report.`,
      });
    }
  };

  const addVisualization = (visualization: string) => {
    if (!reportBuilder.visualizations.includes(visualization)) {
      setReportBuilder(prev => ({
        ...prev,
        visualizations: [...prev.visualizations, visualization]
      }));
      toast({
        title: `${visualization} Added`,
        description: `${visualization} visualization added to your report.`,
      });
    }
  };

  const removeReportItem = (type: 'dataSources' | 'visualizations', item: string) => {
    setReportBuilder(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i !== item),
      reportData: type === 'dataSources' ? getReportData(prev.dataSources.filter(i => i !== item)) : prev.reportData
    }));
  };

  const getReportData = (dataSources: string[]) => {
    const data: any[] = [];
    
    if (dataSources.includes('Student Data')) {
      data.push(...mockAttendance.map(item => ({ type: 'student', category: 'Attendance', ...item })));
      data.push(...mockPerformance.map(item => ({ type: 'student', category: 'Performance', ...item })));
    }
    
    if (dataSources.includes('Financial Data')) {
      data.push(...financialData.map(item => ({ type: 'financial', category: 'Monthly', ...item })));
    }
    
    if (dataSources.includes('Staff Data')) {
      data.push(...hrMetrics.map(item => ({ type: 'staff', category: 'HR Metrics', ...item })));
    }
    
    return data;
  };

  const generateCustomReport = () => {
    if (reportBuilder.dataSources.length === 0) {
      toast({
        title: "No Data Sources Selected",
        description: "Please select at least one data source to generate a report.",
        variant: "destructive"
      });
      return;
    }

    setReportBuilder(prev => ({
      ...prev,
      showPreview: true
    }));

    toast({
      title: "Report Generated Successfully",
      description: "Your custom report is now ready for viewing and export.",
    });
  };

  const clearReport = () => {
    setReportBuilder({
      dataSources: [],
      visualizations: [],
      reportData: [],
      reportName: "Custom Report",
      showPreview: false
    });
  };

  const renderVisualizationChart = () => {
    if (!reportBuilder.visualizations.length || reportBuilder.dataSources.length === 0) return null;

    // Get the first selected visualization type for preview
    const selectedVisualization = reportBuilder.visualizations[0];
    
    // Determine which data to use based on selected data sources
    let chartData = [];
    let dataKey = '';
    let nameKey = '';
    let color = moduleColors.financial;
    
    if (reportBuilder.dataSources.includes('Student Data')) {
      chartData = mockAttendance;
      dataKey = 'attendance';
      nameKey = 'year';
      color = moduleColors.academic;
    } else if (reportBuilder.dataSources.includes('Financial Data')) {
      chartData = financialData;
      dataKey = 'revenue';
      nameKey = 'month';
      color = moduleColors.financial;
    } else if (reportBuilder.dataSources.includes('Staff Data')) {
      chartData = hrMetrics;
      dataKey = 'satisfaction';
      nameKey = 'department';
      color = moduleColors.hr;
    } else {
      return <div className="text-center text-muted-foreground">No compatible data selected</div>;
    }
    
    switch (selectedVisualization) {
      case 'Bar Charts':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} />
          </BarChart>
        );
      
      case 'Pie Charts':
        // Transform data for pie chart
        const pieData = chartData.map((item, index) => ({
          name: item[nameKey],
          value: item[dataKey],
          fill: [color, moduleColors.academic, moduleColors.hr, moduleColors.communication, moduleColors.operational, '#8884d8'][index % 6]
        }));
        return (
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        );
      
      case 'Line Trends':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
            />
          </LineChart>
        );
      
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Comprehensive Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Multi-module reporting with advanced filtering and real-time insights
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="thisyear">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({
                title: "Advanced Filters",
                description: "Advanced filtering options panel will open here."
              })}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button 
              variant={autoRefresh ? "default" : "outline"} 
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { key: "overview", label: "Overview", icon: BarChart3, color: "text-primary" },
            { key: "financial", label: "Financial", icon: DollarSign, color: "text-green-600" },
            { key: "academic", label: "Academic", icon: BookOpen, color: "text-blue-600" },
            { key: "hr", label: "HR Metrics", icon: Users, color: "text-purple-600" },
            { key: "communication", label: "Communication", icon: MessageSquare, color: "text-orange-600" },
            { key: "operational", label: "Operational", icon: Settings, color: "text-gray-600" }
          ].map((module) => (
            <Button
              key={module.key}
              variant={activeModule === module.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveModule(module.key)}
              className="flex flex-col h-16 p-2"
            >
              <module.icon className={`h-5 w-5 ${module.color} mb-1`} />
              <span className="text-xs">{module.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {activeModule === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-success">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-success">£823,400</p>
                    <p className="text-xs text-muted-foreground">+12.5% vs last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Academic Performance</p>
                    <p className="text-2xl font-bold text-primary">87.2%</p>
                    <p className="text-xs text-muted-foreground">+3.2% vs last term</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Staff Satisfaction</p>
                    <p className="text-2xl font-bold text-purple-600">4.3/5</p>
                    <p className="text-xs text-muted-foreground">+0.2 vs last quarter</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Communication Rate</p>
                    <p className="text-2xl font-bold text-orange-600">78.9%</p>
                    <p className="text-xs text-muted-foreground">+5.1% response rate</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Financial Performance Trends</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => drillDown("financial", "performance trends")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke={moduleColors.financial} fill={moduleColors.financial} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Academic Progress Tracking</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => drillDown("academic", "progress tracking")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={academicTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="term" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mathematics" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="english" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="science" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="history" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeModule === "financial" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Financial Analytics</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportData("excel", "financial")}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData("pdf", "financial")}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue & Expense Analysis</CardTitle>
                <CardDescription>Monthly financial performance with predictive forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial KPIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin</span>
                    <span className="font-bold text-success">28.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: "28.3%" }}></div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Collection Rate</span>
                    <span className="font-bold text-primary">94.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "94.7%" }}></div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Outstanding Fees</span>
                    <span className="font-bold text-warning">£45,300</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeModule === "academic" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Academic Performance Analytics</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportData("csv", "academic")}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={academicTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="term" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mathematics" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="english" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="science" stroke="#f59e0b" strokeWidth={3} />
                    <Line type="monotone" dataKey="history" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformance.map((subject, index) => (
                    <div 
                      key={subject.subject} 
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => drillDown("academic", subject.subject)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{subject.subject}</span>
                        <Badge variant="outline">{subject.averageGrade}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${subject.passRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{subject.passRate}%</span>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeModule === "hr" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">HR Metrics & Staff Analytics</h2>
            <Button variant="outline" size="sm" onClick={() => exportData("pdf", "hr")}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Satisfaction by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hrMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="satisfaction" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hrMetrics.map((dept) => (
                    <div key={dept.department} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{dept.department}</span>
                        <Badge variant={dept.turnover > 10 ? "destructive" : dept.turnover > 5 ? "secondary" : "default"}>
                          {dept.turnover}% turnover
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Employees: </span>
                          <span className="font-medium">{dept.employees}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Satisfaction: </span>
                          <span className="font-medium">{dept.satisfaction}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeModule === "communication" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Communication Effectiveness</h2>
            <Button variant="outline" size="sm" onClick={() => exportData("excel", "communication")}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Communication Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={communicationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                  <Bar dataKey="opened" fill="#10b981" name="Opened" />
                  <Bar dataKey="responded" fill="#f59e0b" name="Responded" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeModule === "operational" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Operational Efficiency Reports</h2>
            <Button variant="outline" size="sm" onClick={() => exportData("pdf", "operational")}>
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Users</span>
                    <span className="font-bold">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Logins</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Module Usage</span>
                    <span className="font-bold">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Process Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Task Time</span>
                    <span className="font-bold">3.2 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-bold text-success">0.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Automation Rate</span>
                    <span className="font-bold">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="font-bold text-success">125ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="font-bold">99.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Accuracy</span>
                    <span className="font-bold">99.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Custom Report Builder */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Custom Report Builder</span>
            </div>
            {(reportBuilder.dataSources.length > 0 || reportBuilder.visualizations.length > 0) && (
              <Button variant="outline" size="sm" onClick={clearReport}>
                Clear All
              </Button>
            )}
          </CardTitle>
          <CardDescription>Build custom reports by selecting data sources and visualizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Data Sources</Label>
              <div className="space-y-2">
                <Button 
                  variant={reportBuilder.dataSources.includes('Student Data') ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => addDataSource('Student Data')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Student Data
                </Button>
                <Button 
                  variant={reportBuilder.dataSources.includes('Financial Data') ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => addDataSource('Financial Data')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial Data
                </Button>
                <Button 
                  variant={reportBuilder.dataSources.includes('Staff Data') ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => addDataSource('Staff Data')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Staff Data
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Visualization Types</Label>
              <div className="space-y-2">
                <Button 
                  variant={reportBuilder.visualizations.includes('Bar Charts') ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => addVisualization('Bar Charts')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bar Charts
                </Button>
                <Button 
                  variant={reportBuilder.visualizations.includes('Pie Charts') ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => addVisualization('Pie Charts')}
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Pie Charts
                </Button>
                <Button 
                  variant={reportBuilder.visualizations.includes('Line Trends') ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => addVisualization('Line Trends')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Line Trends
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Report Configuration</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Report Name</Label>
                  <Input 
                    value={reportBuilder.reportName}
                    onChange={(e) => setReportBuilder(prev => ({ ...prev, reportName: e.target.value }))}
                    placeholder="Enter report name"
                    className="mt-1"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Selected: {reportBuilder.dataSources.length} data sources, {reportBuilder.visualizations.length} visualizations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Items Display */}
          {(reportBuilder.dataSources.length > 0 || reportBuilder.visualizations.length > 0) && (
            <div className="mt-6 space-y-4">
              {reportBuilder.dataSources.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Selected Data Sources:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reportBuilder.dataSources.map(source => (
                      <Badge key={source} variant="secondary" className="flex items-center gap-2">
                        {source}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeReportItem('dataSources', source)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {reportBuilder.visualizations.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Selected Visualizations:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reportBuilder.visualizations.map(viz => (
                      <Badge key={viz} variant="outline" className="flex items-center gap-2">
                        {viz}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeReportItem('visualizations', viz)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 flex justify-center gap-3">
            <Button 
              onClick={generateCustomReport}
              disabled={reportBuilder.dataSources.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            {reportBuilder.showPreview && (
              <Button 
                variant="outline"
                onClick={() => exportData("pdf", reportBuilder.reportName)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>

          {/* Report Preview */}
          {reportBuilder.showPreview && reportBuilder.reportData.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{reportBuilder.reportName} - Preview</h3>
                <Badge variant="outline">{reportBuilder.reportData.length} records</Badge>
              </div>
              
              <div className="space-y-6">
                {/* Data Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Report Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportBuilder.reportData.slice(0, 10).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.type}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>
                                {item.year || item.subject || item.department || item.month || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {item.attendance || item.averageGrade || item.satisfaction || item.revenue || 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {reportBuilder.reportData.length > 10 && (
                        <div className="text-center text-sm text-muted-foreground mt-4">
                          Showing 10 of {reportBuilder.reportData.length} records
                        </div>
                      )}
                     </div>
                   </CardContent>
                 </Card>

                  {/* Chart Preview (if visualizations selected) */}
                  {reportBuilder.visualizations.length > 0 && reportBuilder.dataSources.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Sample Visualization - {reportBuilder.visualizations[0]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          {renderVisualizationChart()}
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Multiple Chart Preview if multiple visualizations selected */}
                  {reportBuilder.visualizations.length > 1 && reportBuilder.dataSources.length > 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {reportBuilder.visualizations.slice(1).map((vizType, index) => (
                       <Card key={index}>
                         <CardHeader>
                           <CardTitle className="text-sm">{vizType} Preview</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <ResponsiveContainer width="100%" height={250}>
                             {(() => {
                               const tempViz = reportBuilder.visualizations[0];
                               reportBuilder.visualizations[0] = vizType;
                               const chart = renderVisualizationChart();
                               reportBuilder.visualizations[0] = tempViz;
                               return chart;
                             })()}
                           </ResponsiveContainer>
                         </CardContent>
                       </Card>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           )}
         </CardContent>
       </Card>
     </div>
   );
 };

 export default AnalyticsPage;