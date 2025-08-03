import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, User } from 'lucide-react';

interface ApplicationTimelineProps {
  applicationId: string;
}

export function ApplicationTimeline({ applicationId }: ApplicationTimelineProps) {
  const events = [
    { id: '1', type: 'submitted', description: 'Application submitted', timestamp: '2024-01-10 09:00', user: 'Parent' },
    { id: '2', type: 'review_started', description: 'Review started', timestamp: '2024-01-11 14:30', user: 'Admin' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{event.description}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{event.timestamp}</span>
                  <User className="h-3 w-3 ml-2" />
                  <span>{event.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}