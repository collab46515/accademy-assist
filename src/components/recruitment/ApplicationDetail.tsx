import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Calendar, FileText, 
  Clock, MessageSquare, CheckCircle, XCircle, 
  Star, Download, Eye, Edit
} from 'lucide-react';

interface ApplicationDetailProps {
  applicationId: string;
  onBack: () => void;
}

export function ApplicationDetail({ applicationId, onBack }: ApplicationDetailProps) {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('screening');
  
  // Mock data - replace with actual data fetching
  const application = {
    id: applicationId,
    applicant_name: 'Sarah Johnson',
    applicant_email: 'sarah.johnson@email.com',
    applicant_phone: '+44 7700 900123',
    position: 'Senior Mathematics Teacher',
    application_date: '2024-01-15',
    status: 'screening',
    rating: 4.2,
    experience_years: 8,
    location: 'London, UK',
    resume_url: '/documents/sarah-johnson-cv.pdf',
    cover_letter: 'I am writing to express my strong interest in the Senior Mathematics Teacher position...',
    education: [
      {
        degree: 'MSc Mathematics',
        institution: 'Imperial College London',
        year: '2016',
        grade: 'First Class Honours'
      },
      {
        degree: 'PGCE Secondary Mathematics',
        institution: 'UCL Institute of Education',
        year: '2017'
      }
    ],
    experience: [
      {
        position: 'Mathematics Teacher',
        company: 'Westminster Academy',
        duration: '2018 - Present',
        description: 'Teaching A-Level and GCSE Mathematics to diverse student groups...'
      },
      {
        position: 'Teaching Assistant',
        company: 'Kings College School',
        duration: '2017 - 2018',
        description: 'Supporting mathematics instruction and student development...'
      }
    ],
    skills: ['Advanced Mathematics', 'Classroom Management', 'Curriculum Development', 'Student Assessment'],
    certifications: ['QTS', 'First Aid', 'Safeguarding Level 2'],
    references: [
      {
        name: 'Dr. Michael Smith',
        position: 'Head of Mathematics',
        company: 'Westminster Academy',
        email: 'm.smith@westminster.ac.uk',
        phone: '+44 20 7946 0958'
      }
    ]
  };

  const timeline = [
    { date: '2024-01-15', event: 'Application Submitted', status: 'completed' },
    { date: '2024-01-16', event: 'Initial Screening', status: 'completed' },
    { date: '2024-01-18', event: 'Phone Interview Scheduled', status: 'current' },
    { date: '2024-01-22', event: 'Technical Assessment', status: 'pending' },
    { date: '2024-01-25', event: 'Final Interview', status: 'pending' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'screening': return 'bg-yellow-100 text-yellow-700';
      case 'interview': return 'bg-orange-100 text-orange-700';
      case 'assessment': return 'bg-purple-100 text-purple-700';
      case 'offer': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{application.applicant_name}</h1>
            <p className="text-muted-foreground">{application.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(application.status)}>
            {application.status}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{application.rating}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.applicant_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.applicant_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.experience_years} years experience</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{application.cover_letter}</p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {application.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                      {edu.grade && <p className="text-sm text-green-600">{edu.grade}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-medium">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">CV/Resume</p>
                        <p className="text-sm text-muted-foreground">PDF • 2.1 MB</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Teaching Certificate</p>
                        <p className="text-sm text-muted-foreground">PDF • 1.5 MB</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {application.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{skill}</span>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    No interviews scheduled yet
                  </p>
                  <Button className="w-full">Schedule Interview</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Application Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Update Status</Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add notes about this application..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
              <Button className="w-full">Save Notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}