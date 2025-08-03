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
import { useAdvancedRecruitment } from '@/hooks/useAdvancedRecruitment';

export function CandidatePool() {
  const { candidates, createCandidate, loading } = useAdvancedRecruitment();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    portfolio_url: '',
    current_location: '',
    willing_to_relocate: false,
    current_salary: '',
    expected_salary: '',
    notice_period_weeks: '',
    availability_date: '',
    source: 'website',
    source_details: '',
    skills: [],
    experience_years: '',
    notes: '',
    tags: [],
    status: 'new'
  });

  const handleCreateCandidate = async () => {
    try {
      await createCandidate({
        ...formData,
        current_salary: formData.current_salary ? parseFloat(formData.current_salary) : undefined,
        expected_salary: formData.expected_salary ? parseFloat(formData.expected_salary) : undefined,
        notice_period_weeks: formData.notice_period_weeks ? parseInt(formData.notice_period_weeks) : undefined,
        experience_years: formData.experience_years ? parseFloat(formData.experience_years) : undefined,
        education: [],
        certifications: [],
        languages: []
      });
      setIsCreateDialogOpen(false);
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        portfolio_url: '',
        current_location: '',
        willing_to_relocate: false,
        current_salary: '',
        expected_salary: '',
        notice_period_weeks: '',
        availability_date: '',
        source: 'website',
        source_details: '',
        skills: [],
        experience_years: '',
        notes: '',
        tags: [],
        status: 'new'
      });
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-700 border-green-200';
      case 'contacted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'interviewing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'offered': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'hired': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'withdrawn': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.current_location?.toLowerCase().includes(searchTerm.toLowerCase());
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Add a new candidate to the recruitment pool
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+44 7700 900000"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://johndoe.dev"
                />
              </div>
              <div>
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={formData.current_location}
                  onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                  placeholder="London, UK"
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  step="0.5"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="current_salary">Current Salary (£)</Label>
                <Input
                  id="current_salary"
                  type="number"
                  value={formData.current_salary}
                  onChange={(e) => setFormData({ ...formData, current_salary: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="expected_salary">Expected Salary (£)</Label>
                <Input
                  id="expected_salary"
                  type="number"
                  value={formData.expected_salary}
                  onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
                  placeholder="60000"
                />
              </div>
              <div>
                <Label htmlFor="notice_period">Notice Period (weeks)</Label>
                <Input
                  id="notice_period"
                  type="number"
                  value={formData.notice_period_weeks}
                  onChange={(e) => setFormData({ ...formData, notice_period_weeks: e.target.value })}
                  placeholder="4"
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability Date</Label>
                <Input
                  id="availability"
                  type="date"
                  value={formData.availability_date}
                  onChange={(e) => setFormData({ ...formData, availability_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="job_board">Job Board</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="career_fair">Career Fair</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCandidate} disabled={loading}>
                Add Candidate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
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
                    {candidate.first_name[0]}{candidate.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {candidate.first_name} {candidate.last_name}
                  </CardTitle>
                  <CardDescription className="truncate">
                    {candidate.experience_years ? `${candidate.experience_years} years experience` : 'Experience not specified'}
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
              {candidate.current_location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{candidate.current_location}</span>
                </div>
              )}
              {candidate.expected_salary && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>£{candidate.expected_salary.toLocaleString()} expected</span>
                </div>
              )}
              {candidate.availability_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Available {new Date(candidate.availability_date).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {candidate.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.cv_file_path && (
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" className="ml-auto">
                  View Profile
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