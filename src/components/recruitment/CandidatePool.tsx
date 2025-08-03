import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Mail, Phone, MapPin, Calendar, DollarSign, Link as LinkIcon, FileText } from 'lucide-react';
import { useComprehensiveHR } from '@/hooks/useComprehensiveHR';

export function CandidatePool() {
  const { jobApplications, loading } = useComprehensiveHR();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // For now, we'll show job applications as our "candidates" until we implement proper candidate management
  const candidates = jobApplications.map(app => ({
    id: app.id,
    name: app.applicant_name,
    email: app.applicant_email,
    phone: app.applicant_phone,
    status: app.application_status,
    created_at: app.created_at,
    application_score: app.application_score
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'screening': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'interview': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'offered': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'hired': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Candidate Pool</h2>
          <p className="text-muted-foreground">
            Manage and track potential candidates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>
            View Job Applications
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search candidates..."
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
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {candidate.name}
                  </CardTitle>
                  <CardDescription className="truncate">
                    Score: {candidate.application_score || 'Not scored'}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(candidate.status)}>
                  {candidate.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="ml-auto">
                  View Application
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No candidates found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}