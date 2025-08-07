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

  const exportData = (format: string, module: string) => {
    toast({
      title: `Exporting ${module} Report`,
      description: `Your ${format.toUpperCase()} report is being generated and will be downloaded shortly.`,
    });
  };

  const drillDown = (module: string, item: string) => {
    toast({
      title: "Drill-down Analysis",
      description: `Opening detailed view for ${item} in ${module} module.`,
    });
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
            <Button variant="outline" size="sm">
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
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Custom Report Builder</span>
          </CardTitle>
          <CardDescription>Drag-and-drop interface to create custom reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium">Data Sources</Label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Student Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Staff Data
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Visualization Types</Label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bar Charts
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <PieChart className="h-4 w-4 mr-2" />
                  Pie Charts
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Line Trends
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Export Options</Label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Excel Export
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  CSV Data
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;