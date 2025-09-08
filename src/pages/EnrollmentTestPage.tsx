import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnrollmentTestPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Enrollment Test</h1>
        <p className="text-muted-foreground">
          Test enrollment features have been removed. Please use the main Admissions workflow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Features Removed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            All mock data and test utilities have been removed from the system. 
            Please navigate to the Admissions page to manage real enrollment processes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentTestPage;