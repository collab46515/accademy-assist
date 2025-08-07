import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  AlertTriangle,
  Clock,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function BehaviorIncidents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewIncidentDialog, setShowNewIncidentDialog] = useState(false);

  const incidents = [
    {
      id: 1,
      student: 'Sarah Johnson',
      studentId: 'STU001',
      class: '9A',
      type: 'Classroom Disruption',
      severity: 'Minor',
      status: 'Resolved',
      date: '2024-01-15',
      time: '10:30 AM',
      teacher: 'Mr. Smith',
      location: 'Math Classroom',
      description: 'Student was talking during lesson and disrupting other students.',
      action: 'Verbal warning given, student moved to front of class.',
      followUp: 'Monitor for remainder of week'
    },
    {
      id: 2,
      student: 'Mike Chen',
      studentId: 'STU002',
      class: '10B',
      type: 'Persistent Lateness',
      severity: 'Minor',
      status: 'Active',
      date: '2024-01-15',
      time: '8:45 AM',
      teacher: 'Ms. Davis',
      location: 'Form Room',
      description: 'Student arrived 15 minutes late for the third time this week.',
      action: 'Detention scheduled for Friday',
      followUp: 'Contact parents if continues'
    },
    {
      id: 3,
      student: 'Emma Wilson',
      studentId: 'STU003',
      class: '8C',
      type: 'Bullying',
      severity: 'Major',
      status: 'Under Investigation',
      date: '2024-01-14',
      time: '12:15 PM',
      teacher: 'Mrs. Brown',
      location: 'Playground',
      description: 'Reported verbal bullying of younger student during lunch break.',
      action: 'Student interviewed, parents contacted',
      followUp: 'Meeting with parents scheduled for Monday'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'bg-yellow-100 text-yellow-800';
      case 'Major': return 'bg-red-100 text-red-800';
      case 'Serious': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Behavior Incidents</h2>
          <p className="text-muted-foreground">Track and manage student behavior incidents</p>
        </div>
        <Dialog open={showNewIncidentDialog} onOpenChange={setShowNewIncidentDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log New Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log New Behavior Incident</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stu001">Sarah Johnson (9A)</SelectItem>
                    <SelectItem value="stu002">Mike Chen (10B)</SelectItem>
                    <SelectItem value="stu003">Emma Wilson (8C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Incident Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disruption">Classroom Disruption</SelectItem>
                    <SelectItem value="lateness">Persistent Lateness</SelectItem>
                    <SelectItem value="bullying">Bullying</SelectItem>
                    <SelectItem value="defiance">Defiance</SelectItem>
                    <SelectItem value="fighting">Fighting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="serious">Serious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Where did this occur?" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe what happened..." rows={3} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Action Taken</Label>
                <Textarea placeholder="What action was taken immediately?" rows={2} />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewIncidentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewIncidentDialog(false)}>
                  Log Incident
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Minor">Minor</SelectItem>
            <SelectItem value="Major">Major</SelectItem>
            <SelectItem value="Serious">Serious</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{incident.student}</h3>
                    <Badge variant="outline">{incident.class}</Badge>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {incident.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {incident.date} at {incident.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {incident.teacher}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {incident.location}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Description: </span>
                      {incident.description}
                    </div>
                    <div>
                      <span className="font-medium">Action Taken: </span>
                      {incident.action}
                    </div>
                    {incident.followUp && (
                      <div>
                        <span className="font-medium">Follow-up: </span>
                        {incident.followUp}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {incident.status !== 'Resolved' && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No incidents found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterSeverity !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'No behavior incidents have been logged yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}