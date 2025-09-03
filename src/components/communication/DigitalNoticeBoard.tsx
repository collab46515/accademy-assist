import { useState, useEffect } from 'react';
import { Bell, AlertCircle, Calendar, User, Eye, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnnouncementsManager } from './AnnouncementsManager';
import { useCommunicationData } from '@/hooks/useCommunicationData';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  created_at: string;
  expires_at?: string;
  target_audience: string[];
  read_by_count: number;
  is_read: boolean;
}


const priorityConfig = {
  urgent: { color: 'border-l-red-500 bg-red-50 dark:bg-red-950/20', icon: AlertCircle, label: 'Urgent', badgeVariant: 'destructive' as const },
  high: { color: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20', icon: Bell, label: 'High', badgeVariant: 'secondary' as const },
  medium: { color: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20', icon: Bell, label: 'Medium', badgeVariant: 'secondary' as const },
  low: { color: 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20', icon: Bell, label: 'Low', badgeVariant: 'secondary' as const }
};

export function DigitalNoticeBoard() {
  const { communications, loading } = useCommunicationData();
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Convert communications to announcements format
  const announcements: Announcement[] = communications
    .filter(comm => comm.status === 'sent' && comm.communication_type === 'announcement')
    .map(comm => ({
      id: comm.id,
      title: comm.title,
      content: comm.content,
      priority: (comm.priority as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
      author: 'School Admin', // You can enhance this with actual author data
      created_at: comm.created_at,
      expires_at: undefined, // You can add expiry functionality later
      target_audience: [comm.audience_type],
      read_by_count: comm.read_count || 0,
      is_read: Math.random() > 0.5 // Simulate read status - implement proper tracking later
    }));

  const markAsRead = (announcementId: string) => {
    // TODO: Implement actual read tracking in database
    console.log('Marked as read:', announcementId);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !announcement.is_read;
    if (activeTab === 'urgent') return announcement.priority === 'urgent';
    return announcement.priority === activeTab;
  });

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const config = priorityConfig[announcement.priority];
    const IconComponent = config.icon;
    
    return (
      <Card className={`mb-4 border-l-4 ${config.color} ${!announcement.is_read ? 'ring-1 ring-primary/20' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <IconComponent className="h-4 w-4" />
              <CardTitle className="text-lg">{announcement.title}</CardTitle>
              <Badge variant={config.badgeVariant}>
                {config.label}
              </Badge>
              {!announcement.is_read && (
                <Badge variant="outline" className="text-xs">New</Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markAsRead(announcement.id)}
              disabled={announcement.is_read}
              className="shrink-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {announcement.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(announcement.created_at).toLocaleDateString()}
            </div>
            <div>{announcement.read_by_count} reads</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{announcement.content}</p>
          {announcement.expires_at && (
            <div className="mt-3 text-xs text-muted-foreground">
              Expires: {new Date(announcement.expires_at).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const unreadCount = announcements.filter(a => !a.is_read).length;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Digital Notice Board
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {unreadCount} unread
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  console.log('New Announcement button clicked');
                  setShowCreateDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Announcement
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({announcements.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
              <TabsTrigger value="high">High Priority</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[600px] pr-4">
                {filteredAnnouncements.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No announcements found</p>
                  </div>
                ) : (
                  filteredAnnouncements.map(announcement => (
                    <AnnouncementCard 
                      key={announcement.id} 
                      announcement={announcement} 
                    />
                  ))
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* New Announcement Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <AnnouncementsManager />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}