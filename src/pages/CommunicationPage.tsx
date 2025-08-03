import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MessageSquare, 
  Search, 
  Plus,
  Send,
  Mail,
  Bell,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  type: "email" | "sms" | "notification" | "announcement";
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "sent" | "delivered" | "read";
  timestamp: string;
  recipients: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  audience: "all" | "parents" | "students" | "staff" | "year-group";
  yearGroup?: string;
  publishedAt: string;
  views: number;
  status: "draft" | "published" | "archived";
}

const mockMessages: Message[] = [
  {
    id: "1",
    from: "School Office",
    to: "Year 7 Parents",
    subject: "Parent Evening Booking Now Open",
    content: "Booking for Year 7 Parent Evening is now available online...",
    type: "email",
    priority: "medium",
    status: "sent",
    timestamp: "2024-01-15 14:30",
    recipients: 28
  },
  {
    id: "2",
    from: "Head Teacher",
    to: "All Parents",
    subject: "School Closure - Snow Day",
    content: "Due to severe weather conditions, school will be closed tomorrow...",
    type: "notification",
    priority: "urgent",
    status: "delivered",
    timestamp: "2024-01-14 16:45",
    recipients: 847
  },
  {
    id: "3",
    from: "PE Department",
    to: "Year 9 Students",
    subject: "Sports Day Reminder",
    content: "Reminder: Sports Day is this Friday. Please bring...",
    type: "sms",
    priority: "medium",
    status: "read",
    timestamp: "2024-01-13 09:15",
    recipients: 156
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "New Online Learning Platform",
    content: "We're excited to announce the launch of our new online learning platform...",
    author: "IT Department",
    audience: "all",
    publishedAt: "2024-01-15",
    views: 234,
    status: "published"
  },
  {
    id: "2",
    title: "Year 11 GCSE Information Evening",
    content: "Information session for Year 11 parents about GCSE examinations...",
    author: "Exams Office",
    audience: "parents",
    yearGroup: "Year 11",
    publishedAt: "2024-01-14",
    views: 67,
    status: "published"
  }
];

const CommunicationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages] = useState(mockMessages);
  const [announcements] = useState(mockAnnouncements);

  const getStatusBadge = (status: Message["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "sent":
        return <Badge className="bg-primary text-primary-foreground"><Send className="h-3 w-3 mr-1" />Sent</Badge>;
      case "delivered":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
      case "read":
        return <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" />Read</Badge>;
    }
  };

  const getPriorityBadge = (priority: Message["priority"]) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Low</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "high":
        return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "urgent":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>;
    }
  };

  const getTypeBadge = (type: Message["type"]) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      notification: Bell,
      announcement: Users
    };
    const Icon = icons[type];
    
    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </Badge>
    );
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMessages = messages.length;
  const sentMessages = messages.filter(m => m.status === "sent" || m.status === "delivered" || m.status === "read").length;
  const totalRecipients = messages.reduce((sum, message) => sum + message.recipients, 0);
  const urgentMessages = messages.filter(m => m.priority === "urgent").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Communication Hub</h1>
        <p className="text-muted-foreground">Centralized messaging with broadcast emails, parent-teacher messaging, and emergency alerts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-3xl font-bold text-primary">{totalMessages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-3xl font-bold text-success">{sentMessages}</p>
              </div>
              <Send className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recipients</p>
                <p className="text-3xl font-bold text-primary">{totalRecipients}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-3xl font-bold text-destructive">{urgentMessages}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Message Center</span>
                  </CardTitle>
                  <CardDescription>Send and manage communications to parents, students, and staff</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages by subject, sender, or recipient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.from}</TableCell>
                        <TableCell>{message.to}</TableCell>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell>{getTypeBadge(message.type)}</TableCell>
                        <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                        <TableCell>{message.recipients}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{message.timestamp}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Announcements</span>
                  </CardTitle>
                  <CardDescription>Publish announcements to school community</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium">{announcement.title}</TableCell>
                        <TableCell>{announcement.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {announcement.audience}
                            {announcement.yearGroup && ` - ${announcement.yearGroup}`}
                          </Badge>
                        </TableCell>
                        <TableCell>{announcement.publishedAt}</TableCell>
                        <TableCell>{announcement.views}</TableCell>
                        <TableCell>
                          <Badge className={announcement.status === "published" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"}>
                            {announcement.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Message Templates</span>
              </CardTitle>
              <CardDescription>Pre-designed templates for common communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Message Templates</h3>
                <p className="text-muted-foreground">Pre-designed communication templates coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationPage;