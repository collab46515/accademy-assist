import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Users, Plus, Search, Clock, Trash2, AlertTriangle, Loader2, Navigation } from 'lucide-react';
import { TripStop } from '@/hooks/useTripPlanning';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRouteOptimizer } from '@/hooks/useRouteOptimizer';

interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  year_group: string;
}

interface StopAssignmentPanelProps {
  tripId: string;
  schoolId: string;
  stops: TripStop[];
  vehicleCapacity?: number;
  onStopsUpdated: () => void;
  onAddStop: (stop: Partial<TripStop>) => Promise<void>;
  onUpdateStop: (stopId: string, updates: Partial<TripStop>) => Promise<void>;
  onDeleteStop: (stopId: string) => Promise<void>;
}

export const StopAssignmentPanel: React.FC<StopAssignmentPanelProps> = ({
  tripId,
  schoolId,
  stops,
  vehicleCapacity,
  onStopsUpdated,
  onAddStop,
  onUpdateStop,
  onDeleteStop,
}) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [showAddStopDialog, setShowAddStopDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { geocodeAddress } = useRouteOptimizer();

  const [newStopForm, setNewStopForm] = useState({
    stop_name: '',
    location_address: '',
    scheduled_arrival_time: '07:30',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  useEffect(() => {
    if (schoolId) {
      loadStudents();
      loadAssignments();
    }
  }, [schoolId, tripId]);

  const loadStudents = async () => {
    try {
      // Fetch students with their profile names
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          year_group,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('school_id', schoolId)
        .eq('is_enrolled', true);

      if (error) throw error;
      
      const formattedStudents: StudentData[] = (data || []).map((s: any) => ({
        id: s.id,
        first_name: s.profiles?.first_name || 'Unknown',
        last_name: s.profiles?.last_name || '',
        year_group: s.year_group || '',
      }));
      
      setStudents(formattedStudents);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('student_trip_assignments')
        .select('student_id, trip_stop_id')
        .eq('trip_id', tripId);

      if (error) throw error;

      const assignmentMap: Record<string, string[]> = {};
      (data || []).forEach((a: any) => {
        const stopId = a.trip_stop_id;
        if (!assignmentMap[stopId]) {
          assignmentMap[stopId] = [];
        }
        assignmentMap[stopId].push(a.student_id);
      });
      setAssignments(assignmentMap);
    } catch (err) {
      console.error('Error loading assignments:', err);
    }
  };

  // Geocode address to get lat/lng
  const handleGeocodeAddress = async () => {
    if (!newStopForm.location_address) {
      toast.error('Please enter an address to geocode');
      return;
    }
    
    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(newStopForm.location_address);
      if (result) {
        setNewStopForm(prev => ({
          ...prev,
          latitude: result.lat,
          longitude: result.lng,
          location_address: result.formattedAddress || prev.location_address,
        }));
        toast.success('Address geocoded successfully');
      } else {
        toast.error('Could not geocode address. Please check the address and try again.');
      }
    } catch (err) {
      toast.error('Geocoding failed');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddStop = async () => {
    if (!newStopForm.stop_name) {
      toast.error('Stop name is required');
      return;
    }

    setLoading(true);
    try {
      await onAddStop({
        trip_id: tripId,
        stop_name: newStopForm.stop_name,
        location_address: newStopForm.location_address,
        latitude: newStopForm.latitude,
        longitude: newStopForm.longitude,
        scheduled_arrival_time: newStopForm.scheduled_arrival_time,
        stop_order: stops.length + 1,
        assigned_students_count: 0,
        total_students_at_stop: 0,
      });

      setShowAddStopDialog(false);
      setNewStopForm({
        stop_name: '',
        location_address: '',
        scheduled_arrival_time: '07:30',
        latitude: null,
        longitude: null,
      });
      onStopsUpdated();
      toast.success('Stop added successfully');
    } catch (err) {
      toast.error('Failed to add stop');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = (stop: TripStop) => {
    setSelectedStop(stop);
    setSelectedStudents(assignments[stop.id] || []);
    setShowAssignDialog(true);
  };

  const handleSaveAssignments = async () => {
    if (!selectedStop) return;

    setLoading(true);
    try {
      // Remove existing assignments for this stop
      await supabase
        .from('student_trip_assignments')
        .delete()
        .eq('trip_id', tripId)
        .eq('trip_stop_id', selectedStop.id);

      // Add new assignments
      if (selectedStudents.length > 0) {
        const assignmentsToInsert = selectedStudents.map(studentId => ({
          trip_id: tripId,
          trip_stop_id: selectedStop.id,
          student_id: studentId,
          school_id: schoolId,
          assignment_type: 'pickup',
          status: 'active',
        }));

        const { error } = await supabase
          .from('student_trip_assignments')
          .insert(assignmentsToInsert);

        if (error) throw error;
      }

      // Update stop student counts
      await onUpdateStop(selectedStop.id, {
        assigned_students_count: selectedStudents.length,
        total_students_at_stop: selectedStudents.length,
      });

      toast.success(`Assigned ${selectedStudents.length} students to ${selectedStop.stop_name}`);
      setShowAssignDialog(false);
      loadAssignments();
      onStopsUpdated();
    } catch (err) {
      toast.error('Failed to save assignments');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total assigned across all stops
  const getTotalAssignedCount = () => {
    return Object.values(assignments).reduce((sum, studentIds) => sum + studentIds.length, 0);
  };

  // Calculate what total would be if we save current selection
  const getProjectedTotalAfterSave = () => {
    if (!selectedStop) return getTotalAssignedCount();
    const currentStopCount = assignments[selectedStop.id]?.length || 0;
    return getTotalAssignedCount() - currentStopCount + selectedStudents.length;
  };

  const projectedTotal = getProjectedTotalAfterSave();
  const isOverCapacity = vehicleCapacity != null && projectedTotal > vehicleCapacity;

  const getStopStatus = (stop: TripStop): 'red' | 'yellow' | 'green' => {
    const count = assignments[stop.id]?.length || 0;
    if (count === 0) return 'red';
    if (count < (stop.total_students_at_stop || 1)) return 'yellow';
    return 'green';
  };

  const getStatusColor = (status: 'red' | 'yellow' | 'green') => {
    switch (status) {
      case 'red': return 'bg-destructive';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Stops & Assignments
        </h3>
        <Button size="sm" onClick={() => setShowAddStopDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Stop
        </Button>
      </div>

      {/* Color Legend */}
      <div className="flex items-center gap-4 p-2 bg-muted rounded-lg text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span>No Students</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Complete</span>
        </div>
      </div>

      {/* Stops List */}
      <ScrollArea className="h-[300px]">
        {stops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-8 w-8 opacity-50" />
            </div>
            <p className="font-medium">No stops added yet</p>
            <p className="text-sm mt-1">Click "Add Stop" above to create pickup/drop-off points</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stops.sort((a, b) => a.stop_order - b.stop_order).map((stop, index) => {
              const status = getStopStatus(stop);
              const studentCount = assignments[stop.id]?.length || 0;

              return (
                <div
                  key={stop.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  {/* Order & Status */}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white ${getStatusColor(status)}`}>
                      {index + 1}
                    </div>
                    {index < stops.length - 1 && (
                      <div className="w-0.5 h-4 bg-border" />
                    )}
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{stop.stop_name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAssign(stop)}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDeleteStop(stop.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {stop.location_address || 'No address'}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {stop.scheduled_arrival_time}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {studentCount} students
                      </Badge>
                      {stop.latitude && stop.longitude ? (
                        <Badge variant="outline" className="text-xs text-green-600">
                          <Navigation className="h-3 w-3 mr-1" />
                          GPS
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          No GPS
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Add Stop Dialog */}
      <Dialog open={showAddStopDialog} onOpenChange={setShowAddStopDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stop</DialogTitle>
            <DialogDescription>
              Add a new pickup/drop-off point for this trip
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Stop Name *</Label>
              <Input
                value={newStopForm.stop_name}
                onChange={(e) => setNewStopForm(prev => ({ ...prev, stop_name: e.target.value }))}
                placeholder="e.g., Central Park Gate"
              />
            </div>
            <div>
              <Label>Address</Label>
              <div className="flex gap-2">
                <Input
                  value={newStopForm.location_address}
                  onChange={(e) => setNewStopForm(prev => ({ ...prev, location_address: e.target.value, latitude: null, longitude: null }))}
                  placeholder="Full address"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGeocodeAddress}
                  disabled={isGeocoding || !newStopForm.location_address}
                >
                  {isGeocoding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {newStopForm.latitude && newStopForm.longitude ? (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  GPS: {newStopForm.latitude.toFixed(6)}, {newStopForm.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Click the button to geocode address and get GPS coordinates
                </p>
              )}
            </div>
            <div>
              <Label>Scheduled Time</Label>
              <Input
                type="time"
                value={newStopForm.scheduled_arrival_time}
                onChange={(e) => setNewStopForm(prev => ({ ...prev, scheduled_arrival_time: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStopDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStop} disabled={loading}>
              Add Stop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Students Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Students</DialogTitle>
            <DialogDescription>
              {selectedStop?.stop_name} - Select students for this stop
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedStudents.length} students selected
              </span>
              {vehicleCapacity != null && (
                <span className={`${isOverCapacity ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  Trip total: {projectedTotal} / {vehicleCapacity}
                </span>
              )}
            </div>

            {/* Over capacity warning */}
            {isOverCapacity && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Exceeds vehicle capacity by {projectedTotal - (vehicleCapacity || 0)} students. 
                  Assignment is blocked.
                </span>
              </div>
            )}

            <ScrollArea className="h-[250px] border rounded-lg p-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No students found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredStudents.map(student => (
                    <div
                      key={student.id}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => toggleStudent(student.id)}
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.year_group}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAssignments} 
              disabled={loading || isOverCapacity}
              title={isOverCapacity ? 'Cannot save: exceeds vehicle capacity' : undefined}
            >
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
