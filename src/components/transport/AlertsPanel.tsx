import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock,
  XCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useLiveOperations } from '@/hooks/useLiveOperations';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export const AlertsPanel = () => {
  const { user } = useAuth();
  const schoolId = user?.user_metadata?.school_id || null;
  const { alerts, loading, acknowledgeAlert, resolveAlert } = useLiveOperations(schoolId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'sos': return <Zap className="h-5 w-5 text-red-600" />;
      case 'accident': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'breakdown': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'delay': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'student_missing': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged_at);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged_at && !a.resolved_at);

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {unacknowledgedAlerts.filter(a => a.priority === 'critical').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Critical Alerts
          </h3>
          <div className="space-y-3">
            {unacknowledgedAlerts
              .filter(a => a.priority === 'critical')
              .map((alert) => (
                <Card key={alert.id} className="border-red-300 bg-white">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.alert_type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant="destructive">CRITICAL</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Unacknowledged Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          New Alerts ({unacknowledgedAlerts.filter(a => a.priority !== 'critical').length})
        </h3>
        {unacknowledgedAlerts.filter(a => a.priority !== 'critical').length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-600" />
              <p>No new alerts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {unacknowledgedAlerts
              .filter(a => a.priority !== 'critical')
              .map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.alert_type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Acknowledged (In Progress) */}
      {acknowledgedAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            In Progress ({acknowledgedAlerts.length})
          </h3>
          <div className="space-y-3">
            {acknowledgedAlerts.map((alert) => (
              <Card key={alert.id} className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.alert_type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant="outline">Acknowledged</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Acknowledged {formatDistanceToNow(new Date(alert.acknowledged_at!), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Resolved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
