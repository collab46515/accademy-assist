import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Assignment } from '@/hooks/useAssignmentData';

interface AssignmentsListProps {
  assignments: Assignment[];
  loading: boolean;
  title: string;
}

export const AssignmentsList: React.FC<AssignmentsListProps> = ({
  assignments,
  loading,
  title
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'classwork':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'assessment':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assignments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div 
                key={assignment.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {assignment.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(assignment.status)}
                      >
                        {assignment.status}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={getTypeColor(assignment.assignment_type)}
                      >
                        {assignment.assignment_type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {assignment.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDueDate(assignment.due_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {assignment.subject}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {assignment.year_group}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {assignment.total_marks} marks
                      </div>
                      {assignment.curriculum_topic_id && (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <Button variant="link" className="h-auto p-0 text-sm text-blue-600">
                            Curriculum Topic
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.log('View assignment details:', assignment.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Edit assignment:', assignment.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Assignment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('View submissions for:', assignment.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        View Submissions
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive" 
                        onClick={() => console.log('Delete assignment:', assignment.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};