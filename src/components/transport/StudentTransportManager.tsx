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
import {
  Plus,
  Search,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  Edit,
  Eye,
  Phone,
  Route,
  GraduationCap,
  DollarSign,
  Clock
} from 'lucide-react';
import { useTransportData, type StudentTransport } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StudentTransportFormData {
  student_id: string;
  route_id: string;
  stop_id: string;
  pickup_stop_id?: string;
  drop_stop_id?: string;
  transport_fee: number;
  fee_frequency: string;
  start_date: Date;
  end_date?: Date;
  status: string;
  parent_phone?: string;
  emergency_contact?: string;
  special_instructions?: string;
}

export const StudentTransportManager = () => {
  const { studentTransport, routes, stops, loading } = useTransportData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<StudentTransport | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<StudentTransport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const form = useForm<StudentTransportFormData>({
    defaultValues: {
      transport_fee: 0,
      fee_frequency: 'monthly',
      start_date: new Date(),
      status: 'active',
    }
  });

  const filteredAssignments = studentTransport.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
                         assignment.student_id.includes(searchTerm) ||
                         assignment.parent_phone?.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-purple-100 text-purple-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      case 'termly': return 'bg-orange-100 text-orange-800';
      case 'annual': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.route_name : 'Unknown Route';
  };

  const getStopName = (stopId: string) => {
    const stop = stops.find(s => s.id === stopId);
    return stop ? stop.stop_name : 'Unknown Stop';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Transport</h2>
          <p className="text-muted-foreground">Manage student transport assignments and schedules</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAssignment(null); form.reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Assign Student to Transport'}</DialogTitle>
              <DialogDescription>
                Enter the student transport assignment details.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assignment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Assignment Details</h3>
                    <FormField
                      control={form.control}
                      name="student_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter student ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="route_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select route" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {routes.filter(r => r.status === 'active').map((route) => (
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
                       name="stop_id"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Main Stop</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="Select stop" />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                               {stops.filter(stop => {
                                 const selectedRouteId = form.watch('route_id');
                                 return !selectedRouteId || stop.route_id === selectedRouteId;
                               }).map((stop) => (
                                 <SelectItem key={stop.id} value={stop.id}>
                                   {stop.stop_name}
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
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Fee & Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Fee & Contact Info</h3>
                    <FormField
                      control={form.control}
                      name="transport_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transport Fee</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fee_frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="termly">Termly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parent_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Parent contact number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Emergency contact number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
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
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Special Instructions */}
                <FormField
                  control={form.control}
                  name="special_instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Any special requirements or instructions..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAssignment ? 'Update Assignment' : 'Assign Student'}
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
            placeholder="Search students..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Student Transport Assignments */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">Student {assignment.student_id}</CardTitle>
                  <CardDescription>{getRouteName(assignment.route_id)}</CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(assignment.status)}>
                {assignment.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Route className="h-4 w-4 text-muted-foreground" />
                <span>{getRouteName(assignment.route_id)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{getStopName(assignment.stop_id)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>£{assignment.transport_fee}</span>
                </div>
                <Badge className={getFrequencyColor(assignment.fee_frequency)}>
                  {assignment.fee_frequency}
                </Badge>
              </div>
              
              {assignment.parent_phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{assignment.parent_phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Started: {new Date(assignment.start_date).toLocaleDateString()}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setIsDetailOpen(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAssignment(assignment);
                    // Set form values here
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No student assignments found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'No assignments match your search criteria.' : 'Get started by assigning students to transport routes.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Assign Student
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assignment Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Transport Assignment</DialogTitle>
            <DialogDescription>
              Complete assignment details and contact information
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.student_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedAssignment.status)}>
                    {selectedAssignment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Route</Label>
                  <p className="text-sm text-muted-foreground">{getRouteName(selectedAssignment.route_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stop</Label>
                  <p className="text-sm text-muted-foreground">{getStopName(selectedAssignment.stop_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transport Fee</Label>
                  <p className="text-sm text-muted-foreground">
                    £{selectedAssignment.transport_fee} 
                    <Badge className={`${getFrequencyColor(selectedAssignment.fee_frequency)} ml-2 text-xs`}>
                      {selectedAssignment.fee_frequency}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedAssignment.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedAssignment.end_date ? 
                      new Date(selectedAssignment.end_date).toLocaleDateString() : 
                      'Ongoing'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Parent Phone</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.parent_phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Emergency Contact</Label>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.emergency_contact || 'Not provided'}</p>
                </div>
              </div>
              
              {selectedAssignment.special_instructions && (
                <div>
                  <Label className="text-sm font-medium">Special Instructions</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAssignment.special_instructions}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};