import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare, 
  Bell,
  TrendingDown,
  UserCheck,
  Target,
  FileText
} from 'lucide-react';
import { useCurriculumGaps } from '@/hooks/useCurriculumGaps';
import { useToast } from '@/hooks/use-toast';

interface GapAlertsSystemProps {
  schoolId: string;
}

export const GapAlertsSystem: React.FC<GapAlertsSystemProps> = ({ schoolId }) => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [actionNote, setActionNote] = useState('');
  const [actionType, setActionType] = useState<string>('');
  
  const { 
    gaps, 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    getCriticalAlertsCount,
    getUpcomingDeadlines
  } = useCurriculumGaps();
  
  const { toast } = useToast();

  // Mock predictive analytics data
  const [predictiveInsights, setPredictiveInsights] = useState({
    likelyToMissDeadlines: 3,
    teachersNeedingSupport: 2,
    emergingGaps: 5,
    riskTrend: 'increasing'
  });

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'critical') return alert.severity === 'critical';
    if (alertFilter === 'unacknowledged') return alert.status === 'active';
    if (alertFilter === 'deadline') return alert.alert_type === 'deadline_warning';
    return true;
  });

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'deadline_warning': return <Calendar className="h-4 w-4" />;
      case 'gap_detected': return <TrendingDown className="h-4 w-4" />;
      case 'coverage_low': return <Target className="h-4 w-4" />;
      case 'teacher_support_needed': return <UserCheck className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-destructive';
      case 'acknowledged': return 'text-warning';
      case 'resolved': return 'text-success';
      case 'dismissed': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatAlertType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId);
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged"
    });
  };

  const handleResolve = async (alertId: string) => {
    if (!actionNote) {
      toast({
        title: "Action Required",
        description: "Please provide resolution notes",
        variant: "destructive"
      });
      return;
    }

    await resolveAlert(alertId);
    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved with action notes"
    });
    
    setSelectedAlert(null);
    setActionNote('');
    setActionType('');
  };

  const getTimeUntilDeadline = (date: string) => {
    const deadline = new Date(date);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Critical Alerts</span>
            </div>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Deadline Warnings</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              {alerts.filter(a => a.alert_type === 'deadline_warning' && a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Topics at risk</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Coverage Gaps</span>
            </div>
            <div className="text-2xl font-bold text-info">
              {alerts.filter(a => a.alert_type === 'coverage_low' && a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Below target coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Support Requests</span>
            </div>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.alert_type === 'teacher_support_needed' && a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Teachers need help</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Alert Management */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
            <TabsTrigger value="escalation">Escalation Flow</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <Select value={alertFilter} onValueChange={setAlertFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter alerts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
              <SelectItem value="deadline">Deadline Warnings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={getSeverityColor(alert.severity)}>
                          {getAlertIcon(alert.alert_type)}
                        </div>
                        <Badge variant={getBadgeVariant(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatAlertType(alert.alert_type)}
                        </Badge>
                        <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="font-semibold mb-1">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                        {alert.gap_id && (
                          <span>Related to curriculum gap</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm"
                                onClick={() => setSelectedAlert(alert)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Resolve Alert</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">{alert.title}</h4>
                                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                                </div>

                                <div>
                                  <label className="text-sm font-medium mb-2 block">Action Taken</label>
                                  <Select value={actionType} onValueChange={setActionType}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select action type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="contacted_teacher">Contacted Teacher</SelectItem>
                                      <SelectItem value="scheduled_meeting">Scheduled Meeting</SelectItem>
                                      <SelectItem value="provided_resources">Provided Resources</SelectItem>
                                      <SelectItem value="adjusted_timeline">Adjusted Timeline</SelectItem>
                                      <SelectItem value="escalated">Escalated to Leadership</SelectItem>
                                      <SelectItem value="resolved">Issue Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                                  <Textarea
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                    placeholder="Describe the action taken and outcome..."
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button 
                                    onClick={() => handleResolve(alert.id)}
                                    disabled={!actionNote || !actionType}
                                    className="flex-1"
                                  >
                                    Resolve Alert
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">All curriculum gaps are on track!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Predictive Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Predictions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <span className="text-sm">Likely to miss deadlines</span>
                      <span className="font-bold text-destructive">{predictiveInsights.likelyToMissDeadlines}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <span className="text-sm">Teachers needing support</span>
                      <span className="font-bold text-warning">{predictiveInsights.teachersNeedingSupport}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-info/5 border border-info/20 rounded-lg">
                      <span className="text-sm">Emerging coverage gaps</span>
                      <span className="font-bold text-info">{predictiveInsights.emergingGaps}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Trend Analysis</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">Risk Trend</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on historical data and current patterns, curriculum coverage risks are {predictiveInsights.riskTrend}.
                    </p>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View Full Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Escalation workflow configuration coming soon...</p>
                  <p className="text-xs mt-2">Will include automatic escalation rules and notification chains</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(a => a.status !== 'active').map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg opacity-75">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{alert.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.resolved_at ? 
                        `Resolved ${new Date(alert.resolved_at).toLocaleDateString()}` :
                        `Acknowledged ${new Date(alert.acknowledged_at || alert.created_at).toLocaleDateString()}`
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};