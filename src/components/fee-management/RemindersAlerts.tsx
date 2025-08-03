import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Phone, MessageSquare, Plus, Settings, Send, Clock, Users } from 'lucide-react';

interface ReminderTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'phone';
  trigger: 'before_due' | 'on_due' | 'after_due' | 'manual';
  daysBefore?: number;
  daysAfter?: number;
  subject: string;
  message: string;
  isActive: boolean;
  feeTypes: string[];
  recipientType: 'parent' | 'student' | 'both';
  lastUsed?: string;
  timesSent: number;
}

interface Alert {
  id: string;
  type: 'payment_overdue' | 'large_payment' | 'failed_payment' | 'discount_expiring' | 'bulk_reminder_sent';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  affectedStudents?: number;
  relatedAmount?: number;
}

const MOCK_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: '1',
    name: 'Payment Due Reminder',
    type: 'email',
    trigger: 'before_due',
    daysBefore: 7,
    subject: 'School Fee Payment Due in 7 Days',
    message: 'Dear Parent, This is a friendly reminder that your child\'s school fees are due in 7 days. Please ensure payment is made by the due date to avoid late fees.',
    isActive: true,
    feeTypes: ['Tuition Fee', 'Transport Fee'],
    recipientType: 'parent',
    lastUsed: '2024-01-20',
    timesSent: 234
  },
  {
    id: '2',
    name: 'Overdue Payment Alert',
    type: 'email',
    trigger: 'after_due',
    daysAfter: 3,
    subject: 'URGENT: Overdue School Fee Payment',
    message: 'Dear Parent, Your child\'s school fees are now 3 days overdue. Please contact the finance office immediately to arrange payment.',
    isActive: true,
    feeTypes: ['All'],
    recipientType: 'parent',
    lastUsed: '2024-01-22',
    timesSent: 67
  },
  {
    id: '3',
    name: 'SMS Payment Reminder',
    type: 'sms',
    trigger: 'before_due',
    daysBefore: 3,
    subject: '',
    message: 'School Fee Reminder: Payment due in 3 days for {student_name}. Amount: £{amount}. Pay online at {payment_link}',
    isActive: true,
    feeTypes: ['Tuition Fee'],
    recipientType: 'parent',
    lastUsed: '2024-01-21',
    timesSent: 189
  }
];

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'payment_overdue',
    title: 'Multiple Overdue Payments',
    message: '45 students have payments overdue by more than 30 days',
    severity: 'high',
    timestamp: '2024-01-23T10:30:00Z',
    isRead: false,
    actionRequired: true,
    affectedStudents: 45,
    relatedAmount: 67500
  },
  {
    id: '2',
    type: 'large_payment',
    title: 'Large Payment Received',
    message: 'Payment of £15,000 received from Wilson Family Trust',
    severity: 'low',
    timestamp: '2024-01-23T09:15:00Z',
    isRead: false,
    actionRequired: false,
    relatedAmount: 15000
  },
  {
    id: '3',
    type: 'discount_expiring',
    title: 'Early Payment Discount Expiring',
    message: 'Early payment discount expires in 2 days - 67 families eligible',
    severity: 'medium',
    timestamp: '2024-01-23T08:00:00Z',
    isRead: true,
    actionRequired: true,
    affectedStudents: 67
  },
  {
    id: '4',
    type: 'bulk_reminder_sent',
    title: 'Bulk Reminder Sent',
    message: 'Payment reminders sent to 234 families for upcoming due dates',
    severity: 'low',
    timestamp: '2024-01-22T16:45:00Z',
    isRead: true,
    actionRequired: false,
    affectedStudents: 234
  }
];

export const RemindersAlerts = () => {
  const [templates, setTemplates] = useState<ReminderTemplate[]>(MOCK_REMINDER_TEMPLATES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'phone': return Phone;
      case 'push': return Bell;
      default: return Bell;
    }
  };

  const activeTemplates = templates.filter(t => t.isActive).length;
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reminders & Alerts</h1>
          <p className="text-muted-foreground">Automated communication and system notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send Bulk Reminder
          </Button>
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Reminder Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="e.g., Payment Due Reminder" />
                  </div>
                  <div>
                    <Label htmlFor="template-type">Communication Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="trigger-type">Trigger</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before_due">Before Due Date</SelectItem>
                        <SelectItem value="on_due">On Due Date</SelectItem>
                        <SelectItem value="after_due">After Due Date</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="days-offset">Days Offset</Label>
                    <Input id="days-offset" type="number" placeholder="7" />
                  </div>
                  <div>
                    <Label htmlFor="recipient-type">Recipients</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parents Only</SelectItem>
                        <SelectItem value="student">Students Only</SelectItem>
                        <SelectItem value="both">Both Parents & Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Email subject line (for email templates)" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Template message..." rows={4} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is-active" />
                  <Label htmlFor="is-active">Activate template immediately</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowTemplateDialog(false)}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
                <p className="text-2xl font-bold">{activeTemplates}</p>
              </div>
              <Settings className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread Alerts</p>
                <p className="text-2xl font-bold">{unreadAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold">{criticalAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Reminders</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Send className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Reminder Templates</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="schedule">Reminder Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Times Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => {
                    const IconComponent = getTypeIcon(template.type);
                    return (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {template.subject || 'SMS/Phone template'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="capitalize">{template.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="capitalize">{template.trigger.replace('_', ' ')}</div>
                            {template.daysBefore && (
                              <div className="text-sm text-muted-foreground">
                                {template.daysBefore} days before
                              </div>
                            )}
                            {template.daysAfter && (
                              <div className="text-sm text-muted-foreground">
                                {template.daysAfter} days after
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{template.recipientType}</TableCell>
                        <TableCell>{template.timesSent}</TableCell>
                        <TableCell>
                          <Badge className={template.isActive ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      !alert.isRead ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Bell className={`h-5 w-5 mt-0.5 ${
                          alert.severity === 'critical' || alert.severity === 'high'
                            ? 'text-destructive'
                            : alert.severity === 'medium'
                            ? 'text-warning'
                            : 'text-primary'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            {!alert.isRead && (
                              <Badge variant="outline">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            {alert.affectedStudents && (
                              <span>{alert.affectedStudents} students affected</span>
                            )}
                            {alert.relatedAmount && (
                              <span>£{alert.relatedAmount.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.actionRequired && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                        {!alert.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setAlerts(alerts.map(a => 
                                a.id === alert.id ? { ...a, isRead: true } : a
                              ));
                            }}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reminder Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Reminders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Payment Due Reminders (Email)</span>
                          <Badge>67 families</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Overdue Payment Alerts (SMS)</span>
                          <Badge variant="outline">23 families</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Early Payment Discount Ending</span>
                          <Badge>145 families</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Monthly Payment Plan Due</span>
                          <Badge variant="outline">89 families</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Reminder Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">234</div>
                      <div className="text-sm text-muted-foreground">Emails sent this week</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm text-muted-foreground">SMS sent this week</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-sm text-muted-foreground">Delivery success rate</div>
                    </div>
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