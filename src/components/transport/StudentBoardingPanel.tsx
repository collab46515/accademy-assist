import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search,
  QrCode,
  Bus,
  Clock
} from 'lucide-react';
import { useLiveOperations } from '@/hooks/useLiveOperations';
import { useAuth } from '@/hooks/useAuth';

export const StudentBoardingPanel = () => {
  const { user } = useAuth();
  const schoolId = user?.user_metadata?.school_id || null;
  const { tripInstances, recordStudentAction, loading } = useLiveOperations(schoolId);
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTrips = tripInstances.filter(t => t.status === 'in_progress');

  const handleBoardStudent = async (studentId: string, stopId?: string) => {
    if (!selectedTrip || !schoolId) return;

    await recordStudentAction({
      school_id: schoolId,
      trip_instance_id: selectedTrip,
      student_id: studentId,
      trip_stop_id: stopId,
      action_type: 'board',
      action_time: new Date().toISOString(),
      recorded_by: user?.id,
      recorded_method: 'manual',
      parent_notified: false
    });
  };

  const handleAlightStudent = async (studentId: string, stopId?: string) => {
    if (!selectedTrip || !schoolId) return;

    await recordStudentAction({
      school_id: schoolId,
      trip_instance_id: selectedTrip,
      student_id: studentId,
      trip_stop_id: stopId,
      action_type: 'alight',
      action_time: new Date().toISOString(),
      recorded_by: user?.id,
      recorded_method: 'manual',
      parent_notified: false
    });
  };

  const handleMarkAbsent = async (studentId: string, stopId?: string) => {
    if (!selectedTrip || !schoolId) return;

    await recordStudentAction({
      school_id: schoolId,
      trip_instance_id: selectedTrip,
      student_id: studentId,
      trip_stop_id: stopId,
      action_type: 'no_show',
      action_time: new Date().toISOString(),
      recorded_by: user?.id,
      recorded_method: 'manual',
      parent_notified: false
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trip Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Select Active Trip
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTrips.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active trips at the moment</p>
              <p className="text-sm">Start a trip from the Live Dashboard to begin boarding</p>
            </div>
          ) : (
            <Select value={selectedTrip} onValueChange={setSelectedTrip}>
              <SelectTrigger>
                <SelectValue placeholder="Select a trip to manage boarding" />
              </SelectTrigger>
              <SelectContent>
                {activeTrips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    <div className="flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      {trip.trip?.trip_name || 'Trip'} - {trip.total_students_boarded || 0}/{trip.total_students_expected || 0} boarded
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedTrip && (
        <>
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <QrCode className="h-6 w-6" />
              <span>Scan QR Code</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <UserCheck className="h-6 w-6 text-green-600" />
              <span>Board All Present</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <UserX className="h-6 w-6 text-red-600" />
              <span>Mark All Absent</span>
            </Button>
          </div>

          {/* Search & Student List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student List
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Student list will appear here based on trip assignments</p>
                <p className="text-sm mt-2">Use the Trip Planning module to assign students to trips</p>
              </div>
            </CardContent>
          </Card>

          {/* Boarding Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Boarding Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {tripInstances.find(t => t.id === selectedTrip)?.total_students_expected || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Expected</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {tripInstances.find(t => t.id === selectedTrip)?.total_students_boarded || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Boarded</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {tripInstances.find(t => t.id === selectedTrip)?.total_students_dropped || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Dropped</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <p className="text-sm text-muted-foreground">No Show</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
