import { useState } from 'react';
import { Bell, AlertCircle, Calendar, User, Eye, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnnouncementsManager } from './AnnouncementsManager';

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

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'School Closure - Snow Day',
    content: 'Due to heavy snowfall, the school will be closed today. All classes are moved to online mode. Please check your email for virtual classroom links.',
    priority: 'urgent',
    author: 'Head Teacher',
    created_at: '2024-01-15T08:00:00Z',
    target_audience: ['all'],
    read_by_count: 45,
    is_read: false
  },
  {
    id: '2',
    title: 'Parent-Teacher Conference Schedule',
    content: 'Parent-teacher conferences will be held next week from February 5-9. Please book your slots through the parent portal. Virtual meetings are also available.',
    priority: 'high',
    author: 'School Administrator',
    created_at: '2024-01-14T14:30:00Z',
    expires_at: '2024-02-10T00:00:00Z',
    target_audience: ['parents', 'teachers'],
    read_by_count: 128,
    is_read: true
  },
  {
    id: '3',
    title: 'Library New Book Collection',
    content: 'We have added 200 new books to our library collection including fiction, science, and educational materials. Visit the library to explore!',
    priority: 'medium',
    author: 'Librarian',
    created_at: '2024-01-13T10:15:00Z',
    target_audience: ['students', 'teachers'],
    read_by_count: 67,
    is_read: true
  },
  {
    id: '4',
    title: 'Sports Day Registration Open',
    content: 'Registration for annual sports day is now open. Students can register for various events through the student portal. Last date: January 30th.',
    priority: 'medium',
    author: 'Sports Teacher',
    created_at: '2024-01-12T11:00:00Z',
    expires_at: '2024-01-30T23:59:59Z',
    target_audience: ['students'],
    read_by_count: 89,
    is_read: false
  }
];

const priorityConfig = {
  urgent: { color: 'border-l-red-500 bg-red-50 dark:bg-red-950/20', icon: AlertCircle, label: 'Urgent', badgeVariant: 'destructive' as const },
  high: { color: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20', icon: Bell, label: 'High', badgeVariant: 'secondary' as const },
  medium: { color: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20', icon: Bell, label: 'Medium', badgeVariant: 'secondary' as const },
  low: { color: 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20', icon: Bell, label: 'Low', badgeVariant: 'secondary' as const }
};

export function DigitalNoticeBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const markAsRead = (announcementId: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, is_read: true, read_by_count: announcement.read_by_count + 1 }
          : announcement
      )
    );
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
    </div>
  );
}