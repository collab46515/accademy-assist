import React, { useState, useEffect, useCallback } from 'react';
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
  Clock,
  Loader2,
  IndianRupee
} from 'lucide-react';
import { useTransportData, type StudentTransport } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudentResult {
  id: string;
  student_number: string;
  year_group: string;
  form_class: string;
  first_name: string;
  last_name: string;
}

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
  const { studentTransport, routes, stops, loading, addStudentTransport, updateStudentTransport, userSchoolId } = useTransportData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<StudentTransport | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<StudentTransport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Student search state
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [isStudentPopoverOpen, setIsStudentPopoverOpen] = useState(false);
  
  // Student names cache for display
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});

  const form = useForm<StudentTransportFormData>({
    defaultValues: {
      transport_fee: 0,
      fee_frequency: 'monthly',
      start_date: new Date(),
      status: 'active',
    }
  });

  // Fetch student names for display
  useEffect(() => {
    const fetchStudentNames = async () => {
      if (studentTransport.length === 0) return;
      
      const studentIds = studentTransport.map(st => st.student_id);
      const uniqueIds = [...new Set(studentIds)];
      
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            id,
            student_number,
            profiles:user_id (
              first_name,
              last_name
            )
          `)
          .in('id', uniqueIds);
        
        if (error) throw error;
        
        const namesMap: Record<string, string> = {};
        (data || []).forEach((student: any) => {
          const firstName = student.profiles?.first_name || '';
          const lastName = student.profiles?.last_name || '';
          namesMap[student.id] = firstName || lastName 
            ? `${firstName} ${lastName}`.trim() 
            : student.student_number || 'Unknown';
        });
        
        setStudentNames(namesMap);
      } catch (error) {
        console.error('Error fetching student names:', error);
      }
    };
    
    fetchStudentNames();
  }, [studentTransport]);

  // Debounced student search
  useEffect(() => {
    const searchStudents = async () => {
      if (studentSearchTerm.length < 2) {
        setStudentResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            id,
            student_number,
            year_group,
            form_class,
            profiles:user_id (
              first_name,
              last_name
            )
          `)
          .or(`student_number.ilike.%${studentSearchTerm}%`)
          .limit(10);

        if (error) throw error;

        // Also search by name in profiles
        const { data: profileData, error: profileError } = await supabase
          .from('students')
          .select(`
            id,
            student_number,
            year_group,
            form_class,
            profiles:user_id (
              first_name,
              last_name
            )
          `)
          .limit(10);

        if (profileError) throw profileError;

        // Filter by name match
        const nameFiltered = (profileData || []).filter((s: any) => {
          const fullName = `${s.profiles?.first_name || ''} ${s.profiles?.last_name || ''}`.toLowerCase();
          return fullName.includes(studentSearchTerm.toLowerCase());
        });

        // Combine and dedupe results
        const allResults = [...(data || []), ...nameFiltered];
        const uniqueResults = allResults.reduce((acc: any[], curr: any) => {
          if (!acc.find(s => s.id === curr.id)) {
            acc.push({
              id: curr.id,
              student_number: curr.student_number,
              year_group: curr.year_group,
              form_class: curr.form_class,
              first_name: curr.profiles?.first_name || '',
              last_name: curr.profiles?.last_name || '',
            });
          }
          return acc;
        }, []);

        setStudentResults(uniqueResults.slice(0, 10));
      } catch (error) {
        console.error('Error searching students:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchStudents, 300);
    return () => clearTimeout(debounceTimer);
  }, [studentSearchTerm]);

  const handleStudentSelect = (student: StudentResult) => {
    setSelectedStudent(student);
    form.setValue('student_id', student.id);
    setStudentSearchTerm(`${student.first_name} ${student.last_name} (${student.student_number})`);
    setIsStudentPopoverOpen(false);
  };

  const handleSubmit = async (data: StudentTransportFormData) => {
    if (!userSchoolId) {
      toast.error('No school association found. Please contact administrator.');
      return;
    }

    try {
      const assignmentData = {
        ...data,
        school_id: userSchoolId,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : undefined,
      };

      if (editingAssignment) {
        await updateStudentTransport(editingAssignment.id, assignmentData);
      } else {
        await addStudentTransport(assignmentData as any);
      }

      setIsFormOpen(false);
      setEditingAssignment(null);
      setSelectedStudent(null);
      setStudentSearchTerm('');
      form.reset();
    } catch (error) {
      console.error('Failed to save assignment:', error);
    }
  };

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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assignment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Assignment Details</h3>
                    <FormField
                      control={form.control}
                      name="student_id"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Student</FormLabel>
                          <Popover open={isStudentPopoverOpen} onOpenChange={setIsStudentPopoverOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !selectedStudent && "text-muted-foreground"
                                  )}
                                >
                                  {selectedStudent 
                                    ? `${selectedStudent.first_name} ${selectedStudent.last_name} (${selectedStudent.student_number})`
                                    : "Search student by name or ID..."}
                                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                              <Command shouldFilter={false}>
                                <CommandInput 
                                  placeholder="Type student name or ID..." 
                                  value={studentSearchTerm}
                                  onValueChange={setStudentSearchTerm}
                                />
                                <CommandList>
                                  {isSearching && (
                                    <div className="flex items-center justify-center py-6">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                                    </div>
                                  )}
                                  {!isSearching && studentSearchTerm.length >= 2 && studentResults.length === 0 && (
                                    <CommandEmpty>No students found.</CommandEmpty>
                                  )}
                                  {!isSearching && studentSearchTerm.length < 2 && (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                      Type at least 2 characters to search
                                    </div>
                                  )}
                                  {studentResults.length > 0 && (
                                    <CommandGroup heading="Students">
                                      {studentResults.map((student) => (
                                        <CommandItem
                                          key={student.id}
                                          value={student.id}
                                          onSelect={() => handleStudentSelect(student)}
                                          className="cursor-pointer"
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {student.first_name} {student.last_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              ID: {student.student_number} • {student.year_group} • {student.form_class}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {selectedStudent && (
                            <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                              <div className="font-medium">{selectedStudent.first_name} {selectedStudent.last_name}</div>
                              <div className="text-muted-foreground">
                                {selectedStudent.year_group} • {selectedStudent.form_class}
                              </div>
                            </div>
                          )}
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
                  <CardTitle className="text-lg">{studentNames[assignment.student_id] || 'Loading...'}</CardTitle>
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
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span>₹{assignment.transport_fee}</span>
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
                  <Label className="text-sm font-medium">Student Name</Label>
                  <p className="text-sm text-muted-foreground">{studentNames[selectedAssignment.student_id] || selectedAssignment.student_id}</p>
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
                    ₹{selectedAssignment.transport_fee} 
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