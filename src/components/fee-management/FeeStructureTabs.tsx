import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database } from 'lucide-react';
import { FeeStructureBuilder } from './FeeStructureBuilder';
import { MasterDataSetup } from './MasterDataSetup';

export const FeeStructureTabs = () => {
  return (
    <Tabs defaultValue="master-data" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="master-data" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Master Data Setup
        </TabsTrigger>
        <TabsTrigger value="fee-builder" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Fee Structure Builder
        </TabsTrigger>
      </TabsList>

      <TabsContent value="master-data">
        <MasterDataSetup />
      </TabsContent>

      <TabsContent value="fee-builder">
        <FeeStructureBuilder />
      </TabsContent>
    </Tabs>
  );
};