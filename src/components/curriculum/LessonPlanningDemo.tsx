import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, XCircle, Users, UserCheck, MessageSquare } from 'lucide-react';

export const LessonPlanningDemo = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* RBAC Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Role-Based Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Teacher</span>
            <Badge variant="outline">Create, Edit Own Plans</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">HOD</span>
            <Badge variant="outline">View All, Approve, Comment</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">TA</span>
            <Badge variant="outline">View Assigned Plans</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Admin</span>
            <Badge variant="outline">Full Access</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5" />
            Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Draft</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Submitted for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Rejected (with feedback)</span>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            • Comments and feedback system
          </div>
          <div className="text-sm">
            • TA assignment for support
          </div>
          <div className="text-sm">
            • Approval notifications
          </div>
          <div className="text-sm">
            • Version control and audit trail
          </div>
        </CardContent>
      </Card>
    </div>
  );
};