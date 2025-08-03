import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ApplicationsManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications Manager</CardTitle>
        <CardDescription>Manage job applications - Coming Soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Applications management interface will be available here.</p>
      </CardContent>
    </Card>
  );
}