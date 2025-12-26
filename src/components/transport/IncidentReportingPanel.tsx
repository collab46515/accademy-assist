import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Plus, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTransportData } from '@/hooks/useTransportData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const IncidentReportingPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const { vehicles, drivers, routes, incidents } = useTransportData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    incident_date: new Date().toISOString().slice(0, 16),
    incident_type: '',
    severity: 'low',
    vehicle_id: '',
    driver_id: '',
    route_id: '',
    location_address: '',
    description: '',
    immediate_actions: '',
    reported_by: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Incident reported', description: 'The incident has been logged successfully.' });
    setIsOpen(false);
    setFormData({
      incident_date: new Date().toISOString().slice(0, 16),
      incident_type: '',
      severity: 'low',
      vehicle_id: '',
      driver_id: '',
      route_id: '',
      location_address: '',
      description: '',
      immediate_actions: '',
      reported_by: '',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const stats = {
    total: incidents?.length || 0,
    open: incidents?.filter(i => i.status === 'open' || i.status === 'investigating').length || 0,
    critical: incidents?.filter(i => i.severity === 'critical' && i.status !== 'closed').length || 0,
    thisMonth: incidents?.filter(i => new Date(i.incident_date).getMonth() === new Date().getMonth()).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Incident Reports</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Report Incident</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.incident_date}
                      onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Incident Type *</Label>
                    <Select value={formData.incident_type} onValueChange={(v) => setFormData({ ...formData, incident_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="breakdown">Breakdown</SelectItem>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="behavioral">Behavioral Issue</SelectItem>
                        <SelectItem value="security">Security Concern</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Severity *</Label>
                    <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reported By *</Label>
                    <Input
                      value={formData.reported_by}
                      onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Vehicle</Label>
                    <Select value={formData.vehicle_id} onValueChange={(v) => setFormData({ ...formData, vehicle_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                      <SelectContent>
                        {vehicles?.map((v: any) => (
                          <SelectItem key={v.id} value={v.id}>{v.registration_number} - {v.make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Driver</Label>
                    <Select value={formData.driver_id} onValueChange={(v) => setFormData({ ...formData, driver_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                      <SelectContent>
                        {drivers?.map((d: any) => (
                          <SelectItem key={d.id} value={d.id}>{d.first_name} {d.last_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Route</Label>
                    <Select value={formData.route_id} onValueChange={(v) => setFormData({ ...formData, route_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                      <SelectContent>
                        {routes?.map((r: any) => (
                          <SelectItem key={r.id} value={r.id}>{r.route_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={formData.location_address}
                      onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the incident in detail"
                    required
                  />
                </div>
                <div>
                  <Label>Immediate Actions Taken</Label>
                  <Textarea
                    value={formData.immediate_actions}
                    onChange={(e) => setFormData({ ...formData, immediate_actions: e.target.value })}
                    placeholder="What actions were taken immediately?"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit">Report Incident</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents?.map((incident: any) => (
                <TableRow key={incident.id}>
                  <TableCell>{format(new Date(incident.incident_date), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell className="capitalize">{incident.incident_type}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(incident.status)}
                      <span className="capitalize">{incident.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!incidents || incidents.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No incidents reported
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Date:</strong> {format(new Date(selectedIncident.incident_date), 'PPpp')}</div>
                <div><strong>Type:</strong> <span className="capitalize">{selectedIncident.incident_type}</span></div>
                <div><strong>Severity:</strong> <Badge className={getSeverityColor(selectedIncident.severity)}>{selectedIncident.severity}</Badge></div>
                <div><strong>Status:</strong> <span className="capitalize">{selectedIncident.status}</span></div>
              </div>
              {selectedIncident.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-muted-foreground">{selectedIncident.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
