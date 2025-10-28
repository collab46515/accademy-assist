import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Database,
  Lock,
  GitBranch,
  FileCode,
  Users,
  Settings,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

import { SystemArchitecture } from '@/components/developer-docs/SystemArchitecture';
import { ModuleDocumentation } from '@/components/developer-docs/ModuleDocumentation';
import { UserFlows } from '@/components/developer-docs/UserFlows';
import { AccessControlMatrix } from '@/components/developer-docs/AccessControlMatrix';
import { DatabaseSchema } from '@/components/developer-docs/DatabaseSchema';
import { TestCases } from '@/components/developer-docs/TestCases';
import { APIDocumentation } from '@/components/developer-docs/APIDocumentation';
import { SetupGuide } from '@/components/developer-docs/SetupGuide';
import { CodeExamples } from '@/components/developer-docs/CodeExamples';
import { CommonPatterns } from '@/components/developer-docs/CommonPatterns';
import { ExtensionGuide } from '@/components/developer-docs/ExtensionGuide';

export default function DeveloperDocsPage() {
  const [activeTab, setActiveTab] = useState('architecture');

  const docSections = [
    {
      id: 'architecture',
      label: 'System Architecture',
      icon: GitBranch,
      component: SystemArchitecture
    },
    {
      id: 'modules',
      label: 'Module Documentation',
      icon: FileCode,
      component: ModuleDocumentation
    },
    {
      id: 'flows',
      label: 'User Flows',
      icon: Activity,
      component: UserFlows
    },
    {
      id: 'access',
      label: 'Access Control Matrix',
      icon: Lock,
      component: AccessControlMatrix
    },
    {
      id: 'database',
      label: 'Database Schema',
      icon: Database,
      component: DatabaseSchema
    },
    {
      id: 'api',
      label: 'API Documentation',
      icon: Code,
      component: APIDocumentation
    },
    {
      id: 'tests',
      label: 'Test Cases & Scripts',
      icon: CheckCircle,
      component: TestCases
    },
    {
      id: 'setup',
      label: 'Setup Guide',
      icon: BookOpen,
      component: SetupGuide
    },
    {
      id: 'code-examples',
      label: 'Code Examples',
      icon: Code,
      component: CodeExamples
    },
    {
      id: 'patterns',
      label: 'Best Practices',
      icon: CheckCircle,
      component: CommonPatterns
    },
    {
      id: 'extension',
      label: 'Extension Guide',
      icon: Settings,
      component: ExtensionGuide
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Developer Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive technical documentation for the School Management ERP System
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Code className="w-4 h-4 mr-2" />
          v1.0.0
        </Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Documentation Overview
          </CardTitle>
          <CardDescription>
            This documentation provides complete technical details about the system architecture, modules, 
            workflows, security, database design, APIs, and testing procedures. Read through each section 
            to understand the codebase thoroughly.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <TabsList className="inline-flex h-12 items-center justify-start w-full">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="inline-flex items-center gap-2 px-4 py-2"
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </ScrollArea>

        {docSections.map((section) => {
          const Component = section.component;
          return (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
