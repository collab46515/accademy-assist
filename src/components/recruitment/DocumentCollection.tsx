import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, Upload, Download, Eye, CheckCircle, 
  XCircle, Clock, AlertCircle, Send, Plus 
} from 'lucide-react';

export function DocumentCollection() {
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);

  // Mock document templates
  const documentTemplates = [
    {
      id: 'onboarding',
      name: 'Onboarding Checklist',
      description: 'Essential documents for new hires',
      documents: [
        'Passport/ID Copy',
        'Right to Work Documentation',
        'Educational Certificates',
        'Professional Qualifications',
        'References (2 minimum)',
        'DBS Certificate',
        'Medical Clearance',
        'Bank Details Form',
        'Emergency Contact Form',
        'IT Policy Agreement'
      ]
    },
    {
      id: 'teaching',
      name: 'Teaching Position',
      description: 'Additional documents for teaching roles',
      documents: [
        'Teaching Qualification Certificate',
        'QTS Certificate',
        'Safeguarding Training Certificate',
        'Subject Specific Qualifications',
        'CPD Records',
        'Teaching References'
      ]
    }
  ];

  // Mock candidate document status
  const candidateDocuments = [
    {
      candidateId: '1',
      candidateName: 'Sarah Johnson',
      position: 'Senior Mathematics Teacher',
      totalDocuments: 10,
      submittedDocuments: 7,
      verifiedDocuments: 5,
      documents: [
        { name: 'Passport Copy', status: 'verified', submittedDate: '2024-01-15' },
        { name: 'Right to Work', status: 'verified', submittedDate: '2024-01-15' },
        { name: 'Teaching Certificate', status: 'verified', submittedDate: '2024-01-16' },
        { name: 'QTS Certificate', status: 'pending', submittedDate: '2024-01-17' },
        { name: 'References', status: 'pending', submittedDate: '2024-01-18' },
        { name: 'DBS Certificate', status: 'submitted', submittedDate: '2024-01-19' },
        { name: 'Medical Clearance', status: 'submitted', submittedDate: '2024-01-20' },
        { name: 'Bank Details', status: 'missing', submittedDate: null },
        { name: 'Emergency Contact', status: 'missing', submittedDate: null },
        { name: 'IT Policy', status: 'missing', submittedDate: null }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'missing': return 'bg-red-100 text-red-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'missing': return <XCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const calculateProgress = (documents: any[]) => {
    const completed = documents.filter(d => d.status === 'verified').length;
    return (completed / documents.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Collection</h2>
          <p className="text-muted-foreground">
            Manage candidate document requirements and verification
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Document Template</DialogTitle>
                <DialogDescription>
                  Create a new document collection template
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input id="templateName" placeholder="e.g. Support Staff Onboarding" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea id="templateDescription" placeholder="Brief description of this template" />
                </div>
                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <Textarea placeholder="Enter each document requirement on a new line" className="min-h-[120px]" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateTemplateOpen(false)}>
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Requests
          </Button>
        </div>
      </div>

      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidates">Candidate Documents</TabsTrigger>
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4">
          {candidateDocuments.map((candidate) => {
            const progress = calculateProgress(candidate.documents);
            return (
              <Card key={candidate.candidateId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{candidate.candidateName}</CardTitle>
                      <CardDescription>{candidate.position}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {candidate.verifiedDocuments}/{candidate.totalDocuments} Verified
                      </div>
                      <Progress value={progress} className="w-24 mt-1" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {candidate.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            {doc.submittedDate && (
                              <p className="text-xs text-muted-foreground">
                                Submitted: {doc.submittedDate}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send Reminder
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View All Documents
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Required Documents ({template.documents.length}):</p>
                    <div className="max-h-40 overflow-y-auto">
                      {template.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm py-1">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
              <CardDescription>Documents awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidateDocuments[0].documents
                  .filter(doc => doc.status === 'submitted' || doc.status === 'pending')
                  .map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {candidateDocuments[0].candidateName} • Submitted: {doc.submittedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}