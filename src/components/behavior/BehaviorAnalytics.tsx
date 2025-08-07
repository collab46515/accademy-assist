import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Award,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

export function BehaviorAnalytics() {
  const monthlyTrends = {
    incidents: { current: 23, previous: 31, change: -25.8 },
    merits: { current: 142, previous: 128, change: 10.9 },
    demerits: { current: 31, previous: 45, change: -31.1 },
    detentions: { current: 8, previous: 12, change: -33.3 }
  };

  const incidentsByType = [
    { type: 'Classroom Disruption', count: 8, percentage: 35 },
    { type: 'Late to Class', count: 6, percentage: 26 },
    { type: 'Homework Issues', count: 4, percentage: 17 },
    { type: 'Inappropriate Behavior', count: 3, percentage: 13 },
    { type: 'Other', count: 2, percentage: 9 }
  ];

  const classAnalysis = [
    { class: '9A', incidents: 2, merits: 34, demerits: 5, score: 85 },
    { class: '9B', incidents: 4, merits: 28, demerits: 8, score: 78 },
    { class: '10A', incidents: 3, merits: 32, demerits: 6, score: 82 },
    { class: '10B', incidents: 6, merits: 22, demerits: 12, score: 68 },
    { class: '11A', incidents: 1, merits: 38, demerits: 3, score: 92 }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', class: '9A', score: 45, trend: 'up' },
    { name: 'Mike Chen', class: '10B', score: 32, trend: 'up' },
    { name: 'Emma Wilson', class: '8C', score: 28, trend: 'down' },
    { name: 'Alex Thompson', class: '11A', score: 26, trend: 'up' },
    { name: 'Jessica Lee', class: '9B', score: 24, trend: 'stable' }
  ];

  const concernStudents = [
    { name: 'Marcus Brown', class: '10C', score: -8, incidents: 5, trend: 'down' },
    { name: 'Sophie Wilson', class: '8A', score: -3, incidents: 3, trend: 'down' }
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (change: number, isGoodTrend: boolean = true) => {
    if (change === 0) return 'text-gray-600';
    const isPositive = isGoodTrend ? change > 0 : change < 0;
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getClassScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Behavior Analytics</h2>
        <p className="text-muted-foreground">Comprehensive behavior insights and trends</p>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents This Month</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTrends.incidents.current}</div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(monthlyTrends.incidents.change)}
              <span className={getTrendColor(monthlyTrends.incidents.change, false)}>
                {Math.abs(monthlyTrends.incidents.change)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merit Points</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTrends.merits.current}</div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(monthlyTrends.merits.change)}
              <span className={getTrendColor(monthlyTrends.merits.change)}>
                {Math.abs(monthlyTrends.merits.change)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demerit Points</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTrends.demerits.current}</div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(monthlyTrends.demerits.change)}
              <span className={getTrendColor(monthlyTrends.demerits.change, false)}>
                {Math.abs(monthlyTrends.demerits.change)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detentions</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTrends.detentions.current}</div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(monthlyTrends.detentions.change)}
              <span className={getTrendColor(monthlyTrends.detentions.change, false)}>
                {Math.abs(monthlyTrends.detentions.change)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Types */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentsByType.map((incident, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{incident.type}</span>
                    <span className="text-sm text-muted-foreground">{incident.count}</span>
                  </div>
                  <Progress value={incident.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Behavior Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classAnalysis.map((classData, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{classData.class}</div>
                    <div className="text-sm text-muted-foreground">
                      {classData.incidents} incidents • {classData.merits} merits • {classData.demerits} demerits
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getClassScoreColor(classData.score)}`}>
                      {classData.score}%
                    </div>
                    <div className="text-xs text-muted-foreground">behavior score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.class}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">+{student.score}</span>
                    {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {student.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {student.trend === 'stable' && <Target className="h-4 w-4 text-gray-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students of Concern */}
        <Card>
          <CardHeader>
            <CardTitle>Students Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {concernStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.class} • {student.incidents} incidents
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600">{student.score}</span>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              ))}
              {concernStudents.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p>No students currently require immediate attention</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Behavior Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Behavior Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const incidents = Math.floor(Math.random() * 8);
              const merits = Math.floor(Math.random() * 25) + 10;
              
              return (
                <div key={day} className="text-center">
                  <div className="font-medium text-sm mb-2">{day}</div>
                  <div className="space-y-2">
                    <div className="text-xs">
                      <div className="text-red-600">{incidents} incidents</div>
                      <div className="text-green-600">{merits} merits</div>
                    </div>
                    <div className="h-16 bg-muted rounded flex items-end justify-center">
                      <div 
                        className="w-4 bg-gradient-to-t from-primary to-primary-glow rounded-t"
                        style={{ height: `${Math.max((merits - incidents) / 30 * 100, 10)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}