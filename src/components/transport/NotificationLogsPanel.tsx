import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Bell, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { useTransportNotifications } from '@/hooks/useTransportNotifications';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export const NotificationLogsPanel = () => {
  const { user } = useAuth();
  const schoolId = user?.user_metadata?.school_id || null;
  const { logs, loading } = useTransportNotifications(schoolId);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Delivered</Badge>;
      case 'sent':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" /> Sent</Badge>;
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      case 'read':
        return <Badge variant="default" className="gap-1"><Eye className="h-3 w-3" /> Read</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Notification History</h3>
        <p className="text-sm text-muted-foreground">Recent transport notifications sent to parents and staff</p>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications sent yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {getChannelIcon(log.channel)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{log.event_trigger.replace('_', ' ')}</span>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{log.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>To: {log.recipient_contact}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {log.error_message && (
                  <div className="mt-3 p-2 bg-destructive/10 rounded text-sm text-destructive">
                    Error: {log.error_message}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
