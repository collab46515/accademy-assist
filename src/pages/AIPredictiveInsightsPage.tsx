import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Brain,
  Clock, 
  BarChart3, 
  Target,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';

interface PredictiveInsight {
  id: string;
  type: "attendance" | "performance" | "behaviour";
  title: string;
  prediction: string;
  confidence: number;
  actionRequired: boolean;
  affectedStudents: number;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

const mockInsights: PredictiveInsight[] = [
  {
    id: "1",
    type: "attendance",
    title: "Attendance Drop Prediction",
    prediction: "15 Year 9 students likely to have attendance issues in next 2 weeks",
    confidence: 87,
    actionRequired: true,
    affectedStudents: 15,
    severity: "high",
    recommendation: "Implement early intervention calls and support meetings"
  },
  {
    id: "2",
    type: "performance",
    title: "Grade Decline Alert",
    prediction: "8 students in Year 11 Mathematics at risk of grade drop",
    confidence: 92,
    actionRequired: true,
    affectedStudents: 8,
    severity: "high",
    recommendation: "Schedule additional support sessions and progress reviews"
  },
  {
    id: "3",
    type: "behaviour",
    title: "Behavioral Pattern Detection",
    prediction: "Increased disruption likely during Friday Period 5 classes",
    confidence: 76,
    actionRequired: false,
    affectedStudents: 0,
    severity: "medium",
    recommendation: "Consider adjusting Friday afternoon schedule or activities"
  },
  {
    id: "4",
    type: "performance",
    title: "Improvement Trend",
    prediction: "12 Year 7 students showing consistent upward grade trajectory",
    confidence: 85,
    actionRequired: false,
    affectedStudents: 12,
    severity: "low",
    recommendation: "Continue current teaching strategies and provide stretch activities"
  }
];

export const AIPredictiveInsightsPage = () => {
  const [insights] = useState(mockInsights);

  const getInsightIcon = (type: PredictiveInsight["type"]) => {
    switch (type) {
      case "attendance":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "performance":
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case "behaviour":
        return <Target className="h-4 w-4 text-purple-500" />;
    }
  };

  const getSeverityBadge = (severity: PredictiveInsight["severity"]) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "low":
        return <Badge className="bg-success text-success-foreground">Low</Badge>;
    }
  };

  const criticalInsights = insights.filter(i => i.actionRequired).length;
  const highConfidenceInsights = insights.filter(i => i.confidence > 85).length;
  const totalAffectedStudents = insights.reduce((sum, i) => sum + i.affectedStudents, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Brain className="h-8 w-8 text-primary" />
          <span>AI Predictive Insights</span>
          <Badge className="bg-warning text-warning-foreground">Beta</Badge>
        </h1>
        <p className="text-muted-foreground">AI-powered early warning system and predictive analytics for student outcomes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Insights</p>
                <p className="text-3xl font-bold text-primary">{insights.length}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Action Required</p>
                <p className="text-3xl font-bold text-destructive">{criticalInsights}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Confidence</p>
                <p className="text-3xl font-bold text-success">{highConfidenceInsights}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Affected</p>
                <p className="text-3xl font-bold text-primary">{totalAffectedStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Table */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Predictive Insights Dashboard</span>
          </CardTitle>
          <CardDescription>AI-powered predictions and early warning alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Insight</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Affected Students</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Action Required</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insights.map((insight) => (
                  <TableRow key={insight.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <span className="capitalize">{insight.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{insight.title}</TableCell>
                    <TableCell className="max-w-xs">{insight.prediction}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{insight.confidence}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {insight.affectedStudents > 0 ? insight.affectedStudents : "-"}
                    </TableCell>
                    <TableCell>
                      {getSeverityBadge(insight.severity)}
                    </TableCell>
                    <TableCell>
                      {insight.actionRequired ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        {insight.actionRequired ? "Take Action" : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>AI Recommendations</span>
          </CardTitle>
          <CardDescription>Suggested actions based on predictive insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.filter(i => i.actionRequired).map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.prediction}</p>
                  </div>
                  {getSeverityBadge(insight.severity)}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">💡 Recommended Action:</p>
                  <p className="text-sm text-blue-800">{insight.recommendation}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm">Implement Action</Button>
                  <Button size="sm" variant="outline">Schedule Review</Button>
                  <Button size="sm" variant="outline">Mark as Addressed</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};