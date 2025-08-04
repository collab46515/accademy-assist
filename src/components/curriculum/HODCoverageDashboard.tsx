import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Users, Calendar, Target, Eye, MessageSquare, FileText } from 'lucide-react';
import { useCurriculumGaps } from '@/hooks/useCurriculumGaps';
import { useRBAC } from '@/hooks/useRBAC';

interface HODCoverageDashboardProps {
  schoolId: string;
}

export const HODCoverageDashboard: React.FC<HODCoverageDashboardProps> = ({ schoolId }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedYearGroup, setSelectedYearGroup] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('current_term');
  
  const { gaps, alerts, departmentCoverage, loading, getCriticalAlertsCount, getUpcomingDeadlines } = useCurriculumGaps();
  const { currentSchool } = useRBAC();

  // Mock real-time data (would be from WebSocket/real-time subscription)
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter data based on selections
  const filteredGaps = gaps.filter(gap => {
    if (selectedDepartment !== 'all' && gap.subject !== selectedDepartment) return false;
    if (selectedYearGroup !== 'all' && gap.year_group !== selectedYearGroup) return false;
    return true;
  });

  const filteredCoverage = departmentCoverage.filter(coverage => {
    if (selectedDepartment !== 'all' && coverage.department !== selectedDepartment) return false;
    if (selectedYearGroup !== 'all' && coverage.year_group !== selectedYearGroup) return false;
    return true;
  });

  // Calculate summary metrics
  const summaryMetrics = {
    totalTopics: filteredCoverage.reduce((sum, item) => sum + item.total_topics, 0),
    completedTopics: filteredCoverage.reduce((sum, item) => sum + item.completed_topics, 0),
    atRiskTopics: filteredCoverage.reduce((sum, item) => sum + item.at_risk_topics, 0),
    averageCoverage: filteredCoverage.length > 0 
      ? filteredCoverage.reduce((sum, item) => sum + item.overall_coverage_percentage, 0) / filteredCoverage.length 
      : 0,
    criticalGaps: filteredGaps.filter(gap => gap.risk_level === 'critical').length,
    upcomingDeadlines: getUpcomingDeadlines().length,
    activeAlerts: getCriticalAlertsCount()
  };

  const departments = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Modern Languages'];
  const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'];

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    if (percentage >= 60) return 'text-info';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Curriculum Coverage Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Real-time progress tracking • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {yearGroups.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_term">Current Term</SelectItem>
              <SelectItem value="academic_year">Academic Year</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Overall Coverage</span>
            </div>
            <div className="text-2xl font-bold mb-1">{summaryMetrics.averageCoverage.toFixed(1)}%</div>
            <Progress value={summaryMetrics.averageCoverage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Critical Gaps</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.criticalGaps}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Upcoming Deadlines</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Active Alerts</span>
            </div>
            <div className="text-2xl font-bold">{summaryMetrics.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending acknowledgment</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="teachers">Teacher Support</TabsTrigger>
          <TabsTrigger value="inspection">Inspection Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Department Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCoverage.map((coverage) => (
                    <div key={`${coverage.department}-${coverage.year_group}`} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-sm">{coverage.department}</span>
                          <span className="text-xs text-muted-foreground ml-2">{coverage.year_group}</span>
                        </div>
                        <span className={`font-bold text-sm ${getCoverageColor(coverage.overall_coverage_percentage)}`}>
                          {coverage.overall_coverage_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={coverage.overall_coverage_percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{coverage.completed_topics}/{coverage.total_topics} topics completed</span>
                        <span>{coverage.at_risk_topics} at risk</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getRiskBadgeVariant(alert.severity)} className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Gaps Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGaps.map((gap) => (
                  <div key={gap.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{gap.topic_name}</h4>
                        <p className="text-sm text-muted-foreground">{gap.subject} • {gap.year_group}</p>
                      </div>
                      <Badge variant={getRiskBadgeVariant(gap.risk_level)}>
                        {gap.risk_level.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Coverage:</span>
                        <div className="font-medium">{gap.coverage_percentage}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lessons:</span>
                        <div className="font-medium">{gap.lessons_completed}/{gap.lessons_planned}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due:</span>
                        <div className="font-medium">{new Date(gap.expected_completion_date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gap:</span>
                        <div className="font-medium">{gap.gap_size_days} days</div>
                      </div>
                    </div>

                    <Progress value={gap.coverage_percentage} className="h-2" />
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact Teacher
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View Plans
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Support Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Teacher support features coming soon...</p>
                <p className="text-xs mt-2">Will include workload analysis, support requests, and collaboration tools</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <h4 className="font-semibold text-success">Ready</h4>
                    <p className="text-2xl font-bold text-success">
                      {filteredCoverage.filter(c => c.overall_coverage_percentage >= 90).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Departments at 90%+ coverage</p>
                  </div>
                  
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <h4 className="font-semibold text-warning">Needs Attention</h4>
                    <p className="text-2xl font-bold text-warning">
                      {filteredCoverage.filter(c => c.overall_coverage_percentage >= 75 && c.overall_coverage_percentage < 90).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Departments at 75-89% coverage</p>
                  </div>
                  
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h4 className="font-semibold text-destructive">At Risk</h4>
                    <p className="text-2xl font-bold text-destructive">
                      {filteredCoverage.filter(c => c.overall_coverage_percentage < 75).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Departments below 75% coverage</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Inspection Report Summary</h4>
                  <div className="text-sm space-y-1">
                    <p>• Overall curriculum coverage: <span className="font-medium">{summaryMetrics.averageCoverage.toFixed(1)}%</span></p>
                    <p>• Topics completed on time: <span className="font-medium">{summaryMetrics.completedTopics}/{summaryMetrics.totalTopics}</span></p>
                    <p>• Critical gaps requiring attention: <span className="font-medium text-destructive">{summaryMetrics.criticalGaps}</span></p>
                    <p>• Last assessment: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};