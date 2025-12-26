import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle, Users, MapPin } from 'lucide-react';
import { LiveTripsDashboard } from './LiveTripsDashboard';
import { AlertsPanel } from './AlertsPanel';
import { StudentBoardingPanel } from './StudentBoardingPanel';

export const LiveOperationsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Operations
        </CardTitle>
        <CardDescription>
          Monitor real-time trip execution, student boarding, and handle alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="gap-1">
              <MapPin className="h-4 w-4" /> Live Dashboard
            </TabsTrigger>
            <TabsTrigger value="boarding" className="gap-1">
              <Users className="h-4 w-4" /> Student Boarding
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-1">
              <AlertTriangle className="h-4 w-4" /> Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <LiveTripsDashboard />
          </TabsContent>

          <TabsContent value="boarding">
            <StudentBoardingPanel />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
