import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Search,
  AlertTriangle,
  Clock,
  Calendar as CalendarIcon,
  Edit,
  Eye,
  MapPin,
  FileText,
  Shield,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useTransportData, type TransportIncident } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface IncidentFormData {
  vehicle_id: string;
  route_id?: string;
  incident_type: string;
  incident_date: Date;
  location?: string;
  description: string;
  severity: string;
  status: string;
  parent_notified: boolean;
  authorities_notified: boolean;
  insurance_claim: boolean;
  resolution_notes?: string;
}

export const IncidentsManager = () => {
  const { incidents, vehicles, routes, loading, addIncident, updateIncident, userSchoolId } = useTransportData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<TransportIncident | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<TransportIncident | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const form = useForm<IncidentFormData>({
    defaultValues: {
      incident_date: new Date(),
      incident_type: 'breakdown',
      severity: 'low',
      status: 'open',
      parent_notified: false,
      authorities_notified: false,
      insurance_claim: false,
    }
  });

  const filteredIncidents = incidents.filter(incident => {
    if (!incident) return false;
    
    const matchesSearch = (incident.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (incident.incident_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (incident.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleSubmit = async (data: IncidentFormData) => {
    if (!userSchoolId) {
      toast.error('No school association found. Please contact administrator.');
      return;
    }

    try {
      const incidentData = {
        ...data,
        school_id: userSchoolId,
        reported_by: user?.id || '',
        incident_date: data.incident_date.toISOString(),
      };

      if (editingIncident) {
        await updateIncident(editingIncident.id, incidentData);
      } else {
        await addIncident(incidentData);
      }

      setIsFormOpen(false);
      setEditingIncident(null);
      form.reset();
    } catch (error) {
      console.error('Failed to save incident:', error);
    }
  };

  const handleEdit = (incident: TransportIncident) => {
    setEditingIncident(incident);
    form.reset({
      vehicle_id: incident.vehicle_id,
      route_id: incident.route_id || '',
      incident_type: incident.incident_type,
      incident_date: new Date(incident.incident_date),
      location: incident.location || '',
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      parent_notified: incident.parent_notified,
      authorities_notified: incident.authorities_notified,
      insurance_claim: incident.insurance_claim,
      resolution_notes: incident.resolution_notes || '',
    });
    setIsFormOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'breakdown': return AlertTriangle;
      case 'accident': return XCircle;
      case 'delay': return Clock;
      case 'medical': return Shield;
      case 'disciplinary': return AlertCircle;
      default: return FileText;
    }
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.vehicle_number : 'Unknown Vehicle';
  };

  const getRouteName = (routeId?: string) => {
    if (!routeId) return 'Not specified';
    const route = routes.find(r => r.id === routeId);
    return route ? route.route_name : 'Unknown Route';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Incidents Management</h2>
          <p className="text-muted-foreground">Track and manage transport incidents and resolutions</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingIncident(null); form.reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIncident ? 'Update Incident' : 'Report New Incident'}</DialogTitle>
              <DialogDescription>
                Enter the incident details and required actions.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Incident Details</h3>
                    <FormField
                      control={form.control}
                      name="vehicle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Involved</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.vehicle_number} ({vehicle.vehicle_type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="route_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route (if applicable)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select route" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no-route">Not on route</SelectItem>
                              {routes.map((route) => (
                                <SelectItem key={route.id} value={route.id}>
                                  {route.route_name} ({route.route_code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incident_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="breakdown">Breakdown</SelectItem>
                              <SelectItem value="accident">Accident</SelectItem>
                              <SelectItem value="delay">Delay</SelectItem>
                              <SelectItem value="medical">Medical Emergency</SelectItem>
                              <SelectItem value="disciplinary">Disciplinary Issue</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incident_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Incident Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location & Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location & Status</h3>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Incident location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="investigating">Investigating</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Notification Checkboxes */}
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="parent_notified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Parents Notified</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorities_notified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Authorities Notified</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="insurance_claim"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Insurance Claim Required</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Detailed description of the incident..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {editingIncident && (
                  <FormField
                    control={form.control}
                    name="resolution_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resolution Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Actions taken and resolution details..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingIncident ? 'Update Incident' : 'Report Incident'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const IncidentIcon = getIncidentTypeIcon(incident.incident_type);
          return (
            <Card key={incident.id} className={cn(
              "relative",
              incident.severity === 'critical' && "border-red-200 bg-red-50",
              incident.severity === 'high' && "border-orange-200 bg-orange-50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center space-x-3">
                  <IncidentIcon className={cn(
                    "h-5 w-5",
                    incident.severity === 'critical' && "text-red-600",
                    incident.severity === 'high' && "text-orange-600",
                    incident.severity === 'medium' && "text-yellow-600",
                    incident.severity === 'low' && "text-green-600"
                  )} />
                  <div>
                    <CardTitle className="text-lg capitalize">{incident.incident_type} Incident</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{getVehicleName(incident.vehicle_id)}</span>
                      <span>•</span>
                      <span>{new Date(incident.incident_date).toLocaleDateString()}</span>
                      {incident.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {incident.location}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge className={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{incident.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Route: {getRouteName(incident.route_id)}</span>
                    {incident.parent_notified && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>Parents notified</span>
                      </div>
                    )}
                    {incident.authorities_notified && (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>Authorities notified</span>
                      </div>
                    )}
                    {incident.insurance_claim && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Insurance claim</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIncident(incident);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(incident)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'No incidents match your search criteria.' : 'No incidents have been reported yet.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Report Incident
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Incident Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {selectedIncident?.incident_type} Incident Details
            </DialogTitle>
            <DialogDescription>
              Complete incident information and actions taken
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Vehicle</Label>
                  <p className="text-sm text-muted-foreground">{getVehicleName(selectedIncident.vehicle_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Route</Label>
                  <p className="text-sm text-muted-foreground">{getRouteName(selectedIncident.route_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date & Time</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedIncident.incident_date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{selectedIncident.location || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <Badge className={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedIncident.status)}>
                    {selectedIncident.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description}</p>
              </div>
              
              {selectedIncident.resolution_notes && (
                <div>
                  <Label className="text-sm font-medium">Resolution Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedIncident.resolution_notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  {selectedIncident.parent_notified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Parents Notified</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedIncident.authorities_notified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Authorities Notified</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedIncident.insurance_claim ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Insurance Claim</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};