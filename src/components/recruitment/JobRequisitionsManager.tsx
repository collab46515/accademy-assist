import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Eye, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { useAdvancedRecruitment } from '@/hooks/useAdvancedRecruitment';

export function JobRequisitionsManager() {
  const { jobRequisitions, createJobRequisition, loading } = useAdvancedRecruitment();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    justification: '',
    urgency_level: 'medium',
    headcount_requested: 1,
    employment_type: 'full_time',
    location: '',
    remote_work_option: false,
    salary_range_min: '',
    salary_range_max: '',
    required_start_date: '',
    requested_by: '' // This should be set to current user ID
  });

  const handleCreateRequisition = async () => {
    try {
      await createJobRequisition({
        ...formData,
        salary_range_min: formData.salary_range_min ? parseFloat(formData.salary_range_min) : undefined,
        salary_range_max: formData.salary_range_max ? parseFloat(formData.salary_range_max) : undefined,
        status: 'draft'
      });
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        justification: '',
        urgency_level: 'medium',
        headcount_requested: 1,
        employment_type: 'full_time',
        location: '',
        remote_work_option: false,
        salary_range_min: '',
        salary_range_max: '',
        required_start_date: '',
        requested_by: ''
      });
    } catch (error) {
      console.error('Error creating requisition:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'on_hold': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'filled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredRequisitions = jobRequisitions.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.justification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Requisitions</h2>
          <p className="text-muted-foreground">
            Manage hiring requests and approvals
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Requisition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Job Requisition</DialogTitle>
              <DialogDescription>
                Submit a formal request to hire for a new position
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="justification">Business Justification</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  placeholder="Explain why this position is needed..."
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency_level} onValueChange={(value) => setFormData({ ...formData, urgency_level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="headcount">Headcount</Label>
                <Input
                  id="headcount"
                  type="number"
                  min="1"
                  value={formData.headcount_requested}
                  onChange={(e) => setFormData({ ...formData, headcount_requested: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select value={formData.employment_type} onValueChange={(value) => setFormData({ ...formData, employment_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="London, UK"
                />
              </div>
              <div>
                <Label htmlFor="salary_min">Min Salary (£)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_range_min}
                  onChange={(e) => setFormData({ ...formData, salary_range_min: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="salary_max">Max Salary (£)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_range_max}
                  onChange={(e) => setFormData({ ...formData, salary_range_max: e.target.value })}
                  placeholder="70000"
                />
              </div>
              <div>
                <Label htmlFor="start_date">Required Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.required_start_date}
                  onChange={(e) => setFormData({ ...formData, required_start_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequisition} disabled={loading}>
                Create Requisition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search requisitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requisitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Requisitions</CardTitle>
          <CardDescription>
            {filteredRequisitions.length} requisition(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Headcount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisitions.map((requisition) => (
                <TableRow key={requisition.id}>
                  <TableCell className="font-medium">{requisition.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(requisition.status)}>
                      {requisition.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUrgencyColor(requisition.urgency_level)}>
                      {requisition.urgency_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {requisition.headcount_requested}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {requisition.location || 'Not specified'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {requisition.salary_range_min && requisition.salary_range_max ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        £{requisition.salary_range_min.toLocaleString()} - £{requisition.salary_range_max.toLocaleString()}
                      </div>
                    ) : 'Not specified'}
                  </TableCell>
                  <TableCell>
                    {requisition.required_start_date ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(requisition.required_start_date).toLocaleDateString()}
                      </div>
                    ) : 'Flexible'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}