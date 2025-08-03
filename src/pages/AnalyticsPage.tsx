import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RefreshCw
} from "lucide-react";

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

const AnalyticsPage = () => {
  const [attendance] = useState(mockAttendance);
  const [performance] = useState(mockPerformance);
  const [atRiskStudents] = useState(mockAtRiskStudents);

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

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 60) return <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>;
    return <Badge className="bg-success text-success-foreground">Low Risk</Badge>;
  };

  const overallAttendance = Math.round(attendance.reduce((sum, item) => sum + item.attendance, 0) / attendance.length);
  const totalAtRisk = atRiskStudents.length;
  const improvingSubjects = performance.filter(p => p.trend === "up").length;
  const averagePassRate = Math.round(performance.reduce((sum, item) => sum + item.passRate, 0) / performance.length);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Data Analytics & Insights</h1>
        <p className="text-muted-foreground">Turn data into action with attendance dashboards, at-risk alerts, and custom reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
                <p className="text-3xl font-bold text-success">{overallAttendance}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At-Risk Students</p>
                <p className="text-3xl font-bold text-destructive">{totalAtRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improving Subjects</p>
                <p className="text-3xl font-bold text-primary">{improvingSubjects}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Pass Rate</p>
                <p className="text-3xl font-bold text-primary">{averagePassRate}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="at-risk">At-Risk</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Attendance Analytics</span>
                  </CardTitle>
                  <CardDescription>Track attendance patterns across year groups</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year Group</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Absent Today</TableHead>
                      <TableHead>Late Today</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((item) => (
                      <TableRow key={item.year}>
                        <TableCell className="font-medium">{item.year}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{item.attendance}%</span>
                            {item.attendance >= 95 && <Award className="h-4 w-4 text-warning" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(item.trend)}
                            <span className="capitalize">{item.trend}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-destructive" />
                            <span>{item.absent}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-warning" />
                            <span>{item.late}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={item.attendance >= 95 ? "bg-success text-success-foreground" : 
                                          item.attendance >= 90 ? "bg-warning text-warning-foreground" : 
                                          "bg-destructive text-destructive-foreground"}>
                            {item.attendance >= 95 ? "Excellent" : item.attendance >= 90 ? "Good" : "Concern"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Academic Performance</span>
              </CardTitle>
              <CardDescription>Subject-wise performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Average Grade</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Top Performers</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance.map((item) => (
                      <TableRow key={item.subject}>
                        <TableCell className="font-medium">{item.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold text-lg">
                            {item.averageGrade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(item.trend)}
                            <span className="capitalize">{item.trend}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.passRate}%</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4 text-warning" />
                            <span>{item.topPerformers}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={item.passRate >= 90 ? "bg-success text-success-foreground" : 
                                          item.passRate >= 80 ? "bg-warning text-warning-foreground" : 
                                          "bg-destructive text-destructive-foreground"}>
                            {item.passRate >= 90 ? "Excellent" : item.passRate >= 80 ? "Good" : "Needs Focus"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="at-risk">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span>At-Risk Student Alerts</span>
                  </CardTitle>
                  <CardDescription>Early intervention system for struggling students</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Alerts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Year Group</TableHead>
                      <TableHead>Risk Factors</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {student.riskFactors.map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{student.score}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${student.score >= 80 ? 'bg-destructive' : 
                                          student.score >= 60 ? 'bg-warning' : 'bg-success'}`}
                                style={{ width: `${student.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.lastUpdated}</TableCell>
                        <TableCell>{getRiskBadge(student.score)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Intervene</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-primary" />
                <span>Custom Reports</span>
              </CardTitle>
              <CardDescription>Generate detailed analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Report Generator</h3>
                <p className="text-muted-foreground">Custom report builder with advanced filtering and export options coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;