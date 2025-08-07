import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Target, 
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  TrendingUp,
  Users,
  FileText,
  Clock
} from 'lucide-react';

export function InterventionPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const interventionPlans = [
    {
      id: 1,
      student: 'Marcus Brown',
      studentId: 'STU003',
      class: '10C',
      type: 'Behavioral Support',
      priority: 'High',
      status: 'Active',
      startDate: '2024-01-10',
      reviewDate: '2024-02-10',
      progress: 65,
      keyWorker: 'Ms. Thompson',
      goals: [
        { goal: 'Reduce classroom disruptions', target: '90% reduction', current: '65% reduction', achieved: false },
        { goal: 'Complete homework on time', target: '100% completion', current: '80% completion', achieved: false },
        { goal: 'Improve peer relationships', target: 'No conflicts for 2 weeks', current: '1 week achieved', achieved: false }
      ],
      strategies: [
        'Daily check-ins with key worker',
        'Modified seating arrangement',
        'Regular parent communication',
        'Homework support sessions'
      ],
      notes: 'Student showing good progress. Parents very supportive. Continue current strategies.'
    },
    {
      id: 2,
      student: 'Sophie Wilson',
      studentId: 'STU004',
      class: '8A',
      type: 'Academic Support',
      priority: 'Medium',
      status: 'Active',
      startDate: '2024-01-05',
      reviewDate: '2024-02-05',
      progress: 40,
      keyWorker: 'Mr. Davis',
      goals: [
        { goal: 'Attend all lessons', target: '100% attendance', current: '85% attendance', achieved: false },
        { goal: 'Submit assignments on time', target: '100% on time', current: '60% on time', achieved: false }
      ],
      strategies: [
        'Daily attendance monitoring',
        'Assignment reminder system',
        'Study skills workshop',
        'Mentoring support'
      ],
      notes: 'Progress slower than expected. Consider additional support options.'
    },
    {
      id: 3,
      student: 'Jamie Foster',
      studentId: 'STU005',
      class: '9B',
      type: 'Social Integration',
      priority: 'Medium',
      status: 'Completed',
      startDate: '2023-11-15',
      reviewDate: '2024-01-15',
      progress: 100,
      keyWorker: 'Mrs. Johnson',
      goals: [
        { goal: 'Make positive friendships', target: '3 stable friendships', current: '4 friendships', achieved: true },
        { goal: 'Participate in group activities', target: 'Join 2 clubs', current: 'Member of 3 clubs', achieved: true }
      ],
      strategies: [
        'Peer buddy system',
        'Social skills group',
        'Extracurricular activities',
        'Regular social progress reviews'
      ],
      notes: 'Excellent progress. All goals achieved. Student well integrated.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredPlans = interventionPlans.filter(plan => {
    const matchesSearch = plan.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Intervention Plans</h2>
          <p className="text-muted-foreground">Support plans for students requiring additional help</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Intervention Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Intervention Plan</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stu001">Marcus Brown (10C)</SelectItem>
                    <SelectItem value="stu002">Sophie Wilson (8A)</SelectItem>
                    <SelectItem value="stu003">Jamie Foster (9B)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Intervention Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="behavioral">Behavioral Support</SelectItem>
                    <SelectItem value="academic">Academic Support</SelectItem>
                    <SelectItem value="social">Social Integration</SelectItem>
                    <SelectItem value="attendance">Attendance Improvement</SelectItem>
                    <SelectItem value="emotional">Emotional Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Key Worker</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select key worker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ms-thompson">Ms. Thompson</SelectItem>
                    <SelectItem value="mr-davis">Mr. Davis</SelectItem>
                    <SelectItem value="mrs-johnson">Mrs. Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Current Concerns</Label>
                <Textarea placeholder="Describe the current issues or challenges..." rows={3} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Goals and Targets</Label>
                <Textarea placeholder="List specific, measurable goals..." rows={3} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Intervention Strategies</Label>
                <Textarea placeholder="Detail the strategies and support to be implemented..." rows={3} />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  Create Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Year</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Across active plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search intervention plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Intervention Plans List */}
      <div className="space-y-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{plan.student}</CardTitle>
                    <Badge variant="outline">{plan.class}</Badge>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                    <Badge className={getPriorityColor(plan.priority)}>
                      {plan.priority} Priority
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    {plan.type} • Key Worker: {plan.keyWorker}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Overview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="h-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Started: {plan.startDate}</span>
                  <span>Review: {plan.reviewDate}</span>
                </div>
              </div>

              {/* Goals Progress */}
              <div>
                <h4 className="font-medium mb-3">Goals & Targets</h4>
                <div className="space-y-3">
                  {plan.goals.map((goal, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{goal.goal}</div>
                          <div className="text-xs text-muted-foreground">Target: {goal.target}</div>
                        </div>
                        {goal.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Current: </span>
                        {goal.current}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intervention Strategies */}
              <div>
                <h4 className="font-medium mb-3">Intervention Strategies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.strategies.map((strategy, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
                      {strategy}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {plan.notes && (
                <div>
                  <h4 className="font-medium mb-2">Latest Notes</h4>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                    {plan.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No intervention plans found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'No intervention plans have been created yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}