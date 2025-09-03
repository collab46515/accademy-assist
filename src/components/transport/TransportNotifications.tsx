import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, MessageSquare, AlertTriangle, Phone, Mail, Eye, RefreshCw, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useTransportData } from "@/hooks/useTransportData";
import { supabase } from "@/integrations/supabase/client";
import { useRBAC } from "@/hooks/useRBAC";

export function TransportNotifications() {
  const { toast } = useToast();
  const { routes, drivers } = useTransportData();
  const { currentSchool } = useRBAC();
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: "",
    recipients: "",
    title: "",
    message: "",
    sendSms: true,
    sendEmail: true,
    sendPush: false
  });

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Load notifications from database
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_notifications')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setRecentNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const staticNotifications = [
    {
      id: "1",
      type: "delay",
      title: "Route 2 Delayed",
      message: "Due to traffic incident, Route 2 is running 15 minutes behind schedule. Estimated arrival at school: 8:30 AM",
      timestamp: "8:10 AM",
      recipients: 38,
      status: "sent"
    },
    {
      id: "2", 
      type: "emergency",
      title: "Weather Alert",
      message: "Heavy rain warning in effect. All drivers please exercise extra caution and reduce speed.",
      timestamp: "7:45 AM",
      recipients: 15,
      status: "sent"
    },
    {
      id: "3",
      type: "route_change",
      title: "Route 5 Temporary Change",
      message: "Due to road works on Mill Street, Route 5 will use alternative route today. Pickup times may vary by 5-10 minutes.",
      timestamp: "7:30 AM", 
      recipients: 42,
      status: "sent"
    },
    {
      id: "4",
      type: "general",
      title: "Driver Training Reminder",
      message: "Reminder: Monthly safety training session scheduled for this Friday at 2 PM in the main hall.",
      timestamp: "Yesterday",
      recipients: 18,
      status: "sent"
    }
  ];

  const notificationTemplates = [
    { name: "Route Delay", type: "delay" },
    { name: "Route Cancellation", type: "emergency" }, 
    { name: "Weather Alert", type: "weather" },
    { name: "Driver Update", type: "staff" },
    { name: "Route Change", type: "route_change" },
    { name: "Emergency Alert", type: "emergency" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "route_change":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "delay":
        return <Badge variant="secondary">Delay</Badge>;
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      case "route_change":
        return <Badge variant="outline">Route Change</Badge>;
      case "weather":
        return <Badge className="bg-blue-600">Weather</Badge>;
      case "staff":
        return <Badge variant="outline">Staff</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const handleSendNotification = async () => {
    if (!formData.type || !formData.recipients || !formData.title || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!currentSchool?.id) {
      toast({
        title: "Error",
        description: "No school selected. Please contact administrator.",
        variant: "destructive"
      });
      return;
    }

    console.log('Sending notification...', { currentSchool: currentSchool.id, user: currentUser?.id });

    try {
      // Calculate recipient count based on selection
      let recipientCount = 0;
      switch (formData.recipients) {
        case 'all':
          recipientCount = 100; // Approximate all users
          break;
        case 'route_specific':
          recipientCount = routes.length > 0 ? 25 : 0; // Average route users
          break;
        case 'drivers':
          recipientCount = drivers.length;
          break;
        case 'staff':
          recipientCount = 15; // Approximate staff count
          break;
        default:
          recipientCount = 1;
      }

      // Save notification to database
      const { data, error } = await supabase
        .from('transport_notifications')
        .insert({
          school_id: currentSchool.id,
          type: formData.type,
          recipients: formData.recipients,
          title: formData.title,
          message: formData.message,
          send_sms: formData.sendSms,
          send_email: formData.sendEmail,
          send_push: formData.sendPush,
          sent_by: currentUser?.id,
          recipient_count: recipientCount,
          status: 'sent'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Notification saved successfully:', data);
      
      toast({
        title: "Success",
        description: `Notification sent successfully to ${recipientCount} ${formData.recipients === 'all' ? 'users' : formData.recipients}`
      });

      // Reset form and close dialog
      setFormData({
        type: "",
        recipients: "",
        title: "",
        message: "",
        sendSms: true,
        sendEmail: true,
        sendPush: false
      });
      setOpen(false);
      
      // Refresh notifications list
      loadNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateClick = (template: { name: string; type: string }) => {
    setFormData(prev => ({
      ...prev,
      type: template.type,
      title: template.name
    }));
    setOpen(true);
  };

  const handleSaveAsTemplate = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in title and message to save as template",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('communication_templates')
        .insert({
          school_id: 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
          template_name: formData.title,
          subject_template: formData.title,
          content_template: formData.message,
          template_type: 'announcement',
          created_by: currentUser?.id || 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully"
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleResendNotification = async (notification: any) => {
    try {
      const { error } = await supabase
        .from('transport_notifications')
        .insert({
          school_id: notification.school_id,
          type: notification.type,
          recipients: notification.recipients,
          title: `[RESEND] ${notification.title}`,
          message: notification.message,
          send_sms: notification.send_sms,
          send_email: notification.send_email,
          send_push: notification.send_push,
          sent_by: currentUser?.id || 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
          recipient_count: notification.recipient_count,
          status: 'sent'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification resent successfully"
      });

      loadNotifications();
    } catch (error) {
      console.error('Error resending notification:', error);
      toast({
        title: "Error",
        description: "Failed to resend notification. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (notification: any) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transport Notifications</h2>
          <p className="text-muted-foreground">Send updates and alerts to parents, students, and staff</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Transport Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delay">Route Delay</SelectItem>
                      <SelectItem value="emergency">Emergency Alert</SelectItem>
                      <SelectItem value="route_change">Route Change</SelectItem>
                      <SelectItem value="weather">Weather Update</SelectItem>
                      <SelectItem value="general">General Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Send To</Label>
                  <Select value={formData.recipients} onValueChange={(value) => setFormData(prev => ({ ...prev, recipients: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parents & Students</SelectItem>
                      <SelectItem value="route_specific">Specific Route</SelectItem>
                      <SelectItem value="drivers">All Drivers</SelectItem>
                      <SelectItem value="staff">Transport Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your notification message here..."
                  className="min-h-24"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sms"
                    checked={formData.sendSms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendSms: checked as boolean }))}
                  />
                  <Label htmlFor="sms" className="text-sm">Send SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email"
                    checked={formData.sendEmail}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendEmail: checked as boolean }))}
                  />
                  <Label htmlFor="email" className="text-sm">Send Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="push"
                    checked={formData.sendPush}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendPush: checked as boolean }))}
                  />
                  <Label htmlFor="push" className="text-sm">Push Notification</Label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleSaveAsTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
                <Button onClick={handleSendNotification} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Pre-built notification templates for common scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {notificationTemplates.map((template, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleTemplateClick(template)}
              >
                <div className="text-left">
                  <p className="font-medium">{template.name}</p>
                  {getTypeBadge(template.type)}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>History of sent transport communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(recentNotifications.length > 0 ? recentNotifications : staticNotifications).map((notification, index) => (
            <div key={notification.id || `static-${index}`} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getTypeIcon(notification.type)}
                  <div className="space-y-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
                {getTypeBadge(notification.type)}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Sent: {notification.sent_at ? new Date(notification.sent_at).toLocaleString() : notification.timestamp}</span>
                  <span>Recipients: {notification.recipient_count || notification.recipients}</span>
                  <Badge variant="outline" className="text-xs">
                    {notification.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleResendNotification(notification)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(notification)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Communication Channels */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>Configure notification delivery methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">SMS Messages</p>
                  <p className="text-sm text-muted-foreground">Direct text messages to parents</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Detailed email updates</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Mobile app alerts</p>
                </div>
              </div>
              <Badge variant="secondary">Setup Required</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Voice Calls</p>
                  <p className="text-sm text-muted-foreground">Emergency voice alerts</p>
                </div>
              </div>
              <Badge variant="outline">Inactive</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Statistics</CardTitle>
            <CardDescription>Delivery rates and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">SMS Delivery Rate</span>
                <span className="font-medium">98.5%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "98.5%" }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Email Open Rate</span>
                <span className="font-medium">89.2%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "89.2%" }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <span className="font-medium">76.8%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "76.8%" }} />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Sent Today</span>
                <span className="font-medium">145 notifications</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Response Time</span>
                <span className="font-medium">3.2 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotification.type}</p>
                </div>
                <div>
                  <Label className="font-medium">Recipients</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotification.recipients}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium">Title</Label>
                <p className="text-sm text-muted-foreground">{selectedNotification.title}</p>
              </div>
              <div>
                <Label className="font-medium">Message</Label>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedNotification.message}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="font-medium">SMS</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotification.send_sms ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotification.send_email ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <Label className="font-medium">Push</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotification.send_push ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Sent At</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedNotification.sent_at ? new Date(selectedNotification.sent_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Recipient Count</Label>
                  <p className="text-sm text-muted-foreground">{selectedNotification.recipient_count || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}