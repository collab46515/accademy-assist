import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Bus, Users, Shield } from 'lucide-react';
import { RouteProfilesManager } from './RouteProfilesManager';
import { TripsManager } from './TripsManager';
import { StandbyResourcesManager } from './StandbyResourcesManager';
import { RouteProfile } from '@/hooks/useTripPlanning';

export const TripPlanningTab = () => {
  const [selectedProfile, setSelectedProfile] = useState<RouteProfile | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('profiles');

  const handleSelectProfile = (profile: RouteProfile) => {
    setSelectedProfile(profile);
    setActiveSubTab('trips');
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
    setActiveSubTab('profiles');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Trip Planning
        </CardTitle>
        <CardDescription>
          Create route profiles, define trips, and manage student assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profiles" className="gap-1">
              <Map className="h-4 w-4" /> Route Profiles
            </TabsTrigger>
            <TabsTrigger value="trips" className="gap-1" disabled={!selectedProfile}>
              <Bus className="h-4 w-4" /> Trips {selectedProfile && `(${selectedProfile.profile_name})`}
            </TabsTrigger>
            <TabsTrigger value="standby" className="gap-1">
              <Shield className="h-4 w-4" /> Standby Pool
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <RouteProfilesManager onSelectProfile={handleSelectProfile} />
          </TabsContent>

          <TabsContent value="trips">
            {selectedProfile ? (
              <TripsManager 
                routeProfile={selectedProfile} 
                onBack={handleBackToProfiles} 
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a route profile to manage trips</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="standby">
            <StandbyResourcesManager routeProfile={selectedProfile} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
