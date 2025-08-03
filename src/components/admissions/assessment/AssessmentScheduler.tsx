import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, Clock, User, MapPin, CheckCircle } from 'lucide-react';

export function AssessmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const assessments = [
    {
      id: '1',
      studentName: 'Emma Thompson',
      applicationId: 'APP20241001',
      type: 'CAT4 Assessment',
      date: '2024-01-15',
      time: '09:00',
      duration: '2 hours',
      room: 'Assessment Room A',
      assessor: 'Dr. Sarah Wilson',
      status: 'scheduled'
    },
    {
      id: '2',
      studentName: 'James Chen',
      applicationId: 'APP20241002',
      type: 'Subject Interview',
      date: '2024-01-15',
      time: '11:00',
      duration: '1 hour',
      room: 'Interview Room 1',
      assessor: 'Mr. David Brown',
      status: 'confirmed'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today's Assessments</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">This Week</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <CalendarDays className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Assessments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{assessment.studentName}</h4>
                      <Badge variant="outline" className="text-xs">
                        {assessment.applicationId}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {assessment.time} - {assessment.duration}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {assessment.room}
                      </p>
                      <p className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {assessment.assessor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={assessment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {assessment.status}
                    </Badge>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      {assessment.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Assessment</CardTitle>
            <CardDescription>Book new assessments for applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Assessment scheduling interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}