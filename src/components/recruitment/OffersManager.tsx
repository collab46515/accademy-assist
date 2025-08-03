import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function OffersManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offers Manager</CardTitle>
        <CardDescription>Manage job offers - Coming Soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Job offers management interface will be available here.</p>
      </CardContent>
    </Card>
  );
}