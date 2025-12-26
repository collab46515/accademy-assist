import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ClipboardCheck, Award, Car, GraduationCap } from 'lucide-react';
import { IncidentReportingPanel } from './IncidentReportingPanel';
import { SafetyChecklistsPanel } from './SafetyChecklistsPanel';
import { DriverCertificationsPanel } from './DriverCertificationsPanel';
import { VehicleInspectionsPanel } from './VehicleInspectionsPanel';
import { SafetyTrainingPanel } from './SafetyTrainingPanel';

export const SafetyComplianceTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Safety & Compliance</h2>
        <p className="text-muted-foreground">Manage incidents, inspections, certifications, and safety training</p>
      </div>

      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="checklists" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Checklists
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="inspections" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Inspections
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <IncidentReportingPanel />
        </TabsContent>

        <TabsContent value="checklists">
          <SafetyChecklistsPanel />
        </TabsContent>

        <TabsContent value="certifications">
          <DriverCertificationsPanel />
        </TabsContent>

        <TabsContent value="inspections">
          <VehicleInspectionsPanel />
        </TabsContent>

        <TabsContent value="training">
          <SafetyTrainingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
