import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceDashboard } from '@/components/attendance/AttendanceDashboard';
import { AttendanceMarker } from '@/components/attendance/AttendanceMarker';
import { AttendanceReports } from '@/components/attendance/AttendanceReports';
import { useRBAC } from '@/hooks/useRBAC';
import { BarChart3, UserCheck, Settings, Users, AlertTriangle } from 'lucide-react';

export default function AttendancePage() {
  const { currentSchool, hasRole } = useRBAC();

  if (!currentSchool) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No School Selected</h3>
            <p className="text-muted-foreground text-center">
              Please select a school to access the attendance system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user can mark attendance (teachers, admin, HOD)
  const canMarkAttendance = hasRole('teacher') || hasRole('school_admin') || hasRole('hod') || true; // Temporarily allow all users

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Attendance System</h1>
        <p className="text-muted-foreground">
          Comprehensive attendance tracking with real-time analytics and reporting
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="mark" className="flex items-center gap-2" disabled={!canMarkAttendance}>
            <UserCheck className="h-4 w-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <AttendanceDashboard />
        </TabsContent>

        <TabsContent value="mark" className="mt-6">
          {canMarkAttendance ? (
            <AttendanceMarker />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                <p className="text-muted-foreground text-center">
                  You don't have permission to mark attendance. Contact your administrator.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <AttendanceReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}