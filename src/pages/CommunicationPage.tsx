import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Clock, 
  AlertTriangle,
  Search,
  Plus,
  FileText,
  Megaphone,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  BarChart3,
  Monitor,
  Video
} from 'lucide-react';
import { useCommunicationData } from '@/hooks/useCommunicationData';
import { CommunicationForm, DigitalNoticeBoard, AnnouncementsManager, VirtualClassroomManager, VideoConferenceInterface } from '@/components/communication';
import { CSVReportSection } from '@/components/shared/CSVReportSection';

const CommunicationPage: React.FC = () => {
  const { 
    communications, 
    templates, 
    loading, 
    getStats, 
    getFilteredCommunications,
    approveCommunication,
    rejectCommunication,
    sendCommunication
  } = useCommunicationData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCommunication, setEditingCommunication] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const stats = getStats();

  // Helper functions for badges
  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      sent: 'bg-green-100 text-green-800',
      scheduled: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      announcement: 'bg-blue-100 text-blue-800',
      newsletter: 'bg-green-100 text-green-800',
      emergency_alert: 'bg-red-100 text-red-800',
      event_notification: 'bg-yellow-100 text-yellow-800',
      academic_update: 'bg-purple-100 text-purple-800',
      administrative_notice: 'bg-orange-100 text-orange-800',
      parent_communication: 'bg-pink-100 text-pink-800',
      staff_memo: 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  // Filter communications based on search term and status
  const filteredCommunications = getFilteredCommunications(statusFilter).filter(communication =>
    communication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    communication.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    try {
      await approveCommunication(id);
    } catch (error) {
      console.error('Error approving communication:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectCommunication(id, rejectReason || 'No reason provided');
    } catch (error) {
      console.error('Error rejecting communication:', error);
    }
  };

  const handleSend = async (id: string) => {
    try {
      await sendCommunication(id);
    } catch (error) {
      console.error('Error sending communication:', error);
    }
  };

  const csvData = communications.map(comm => ({
    Title: comm.title,
    Type: comm.communication_type,
    Status: comm.status,
    Priority: comm.priority,
    'Audience Type': comm.audience_type,
    'Total Recipients': comm.total_recipients,
    'Delivery Count': comm.delivery_count,
    'Read Count': comm.read_count,
    'Created Date': new Date(comm.created_at).toLocaleDateString(),
    'Sent Date': comm.sent_at ? new Date(comm.sent_at).toLocaleDateString() : 'Not sent'
  }));

  if (loading) {
    return <div>Loading communications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Communication Center</h1>
          <p className="text-muted-foreground">Manage and send communications to students, parents, and staff</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4" />
          New Communication
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommunications}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('pending_approval')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('sent')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('scheduled')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('draft')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for different communication types */}
      <Tabs defaultValue="communications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="communications" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="notice-board" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Notice Board
          </TabsTrigger>
          <TabsTrigger value="virtual-classroom" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Virtual Classrooms
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommunications.map((communication) => (
                    <TableRow key={communication.id}>
                      <TableCell className="font-medium">{communication.title}</TableCell>
                      <TableCell>{getTypeBadge(communication.communication_type)}</TableCell>
                      <TableCell>{getPriorityBadge(communication.priority)}</TableCell>
                      <TableCell>{communication.audience_type.replace('_', ' ')}</TableCell>
                      <TableCell>{getStatusBadge(communication.status)}</TableCell>
                      <TableCell>{communication.total_recipients}</TableCell>
                      <TableCell>{new Date(communication.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCommunication(communication);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {communication.status === 'pending_approval' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(communication.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(communication.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {communication.status === 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSend(communication.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notice-board">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Digital Notice Board</h2>
                <p className="text-muted-foreground">View and manage school announcements</p>
              </div>
            </div>
            <DigitalNoticeBoard />
          </div>
        </TabsContent>

        <TabsContent value="virtual-classroom">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Virtual Classrooms</h2>
                <p className="text-muted-foreground">Manage virtual meetings and classrooms</p>
              </div>
            </div>
            <VirtualClassroomManager />
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Communication Templates</CardTitle>
                <Button 
                  onClick={() => {
                    setSelectedTemplate(null);
                    setShowForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default Priority</TableHead>
                    <TableHead>Default Audience</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.template_name}</TableCell>
                      <TableCell>{getTypeBadge(template.template_type)}</TableCell>
                      <TableCell>{getPriorityBadge(template.default_priority)}</TableCell>
                      <TableCell>{template.default_audience_type?.replace('_', ' ') || 'Not set'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setShowForm(true);
                          }}
                        >
                          Use Template
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <CSVReportSection
            title="Communication Reports"
            description="Export communication data for analysis and compliance"
            moduleName="communications"
          />
        </TabsContent>
      </Tabs>

      <CommunicationForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCommunication(null);
          setSelectedTemplate(null);
        }}
        editingCommunication={editingCommunication}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default CommunicationPage;