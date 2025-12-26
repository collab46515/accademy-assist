import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, FileText, MapPin, Phone, History } from 'lucide-react';
import { NotificationTemplatesManager } from './NotificationTemplatesManager';
import { NotificationLogsPanel } from './NotificationLogsPanel';
import { EmergencyContactsManager } from './EmergencyContactsManager';
import { GeofenceManager } from './GeofenceManager';

export const CommunicationsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('templates');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Communications & Notifications
        </CardTitle>
        <CardDescription>
          Manage notification templates, emergency contacts, and geofence alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="templates" className="gap-1">
              <FileText className="h-4 w-4" /> Templates
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-1">
              <History className="h-4 w-4" /> Notification Logs
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-1">
              <Phone className="h-4 w-4" /> Emergency Contacts
            </TabsTrigger>
            <TabsTrigger value="geofences" className="gap-1">
              <MapPin className="h-4 w-4" /> Geofences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <NotificationTemplatesManager />
          </TabsContent>

          <TabsContent value="logs">
            <NotificationLogsPanel />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyContactsManager />
          </TabsContent>

          <TabsContent value="geofences">
            <GeofenceManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
