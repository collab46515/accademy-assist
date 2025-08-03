import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function InterviewManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Manager</CardTitle>
        <CardDescription>Schedule and manage interviews - Coming Soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Interview management interface will be available here.</p>
      </CardContent>
    </Card>
  );
}