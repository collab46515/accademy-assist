import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function OnboardingManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Manager</CardTitle>
        <CardDescription>Manage employee onboarding - Coming Soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Employee onboarding interface will be available here.</p>
      </CardContent>
    </Card>
  );
}