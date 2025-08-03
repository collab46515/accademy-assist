import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentCollection } from './DocumentCollection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';

export function OnboardingManager() {
  // Mock onboarding data
  const newHires = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Mathematics Teacher',
      startDate: '2024-02-01',
      status: 'in-progress',
      completedTasks: 7,
      totalTasks: 12,
      documents: { submitted: 8, verified: 6, pending: 2 }
    },
    {
      id: '2',
      name: 'Michael Brown',
      position: 'History Teacher',
      startDate: '2024-02-15',
      status: 'pending',
      completedTasks: 2,
      totalTasks: 12,
      documents: { submitted: 3, verified: 1, pending: 2 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Onboarding Management</h2>
          <p className="text-muted-foreground">
            Manage new hire onboarding process
          </p>
        </div>
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Onboarding Progress</TabsTrigger>
          <TabsTrigger value="documents">Document Collection</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newHires.map((hire) => {
              const progress = (hire.completedTasks / hire.totalTasks) * 100;
              return (
                <Card key={hire.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{hire.name}</CardTitle>
                        <CardDescription>{hire.position}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(hire.status)}>
                        {hire.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Start Date: {hire.startDate}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Onboarding Progress</span>
                        <span>{hire.completedTasks}/{hire.totalTasks}</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-sm font-medium text-blue-700">{hire.documents.submitted}</div>
                        <div className="text-xs text-blue-600">Submitted</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-medium text-green-700">{hire.documents.verified}</div>
                        <div className="text-xs text-green-600">Verified</div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-sm font-medium text-yellow-700">{hire.documents.pending}</div>
                        <div className="text-xs text-yellow-600">Pending</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Send Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentCollection />
        </TabsContent>

        <TabsContent value="checklists">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Checklists</CardTitle>
              <CardDescription>Manage onboarding task templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Checklist management interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}