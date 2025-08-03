import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, CheckCircle, XCircle, Eye, FileText, AlertTriangle } from 'lucide-react';

interface DocumentVerificationStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function DocumentVerificationStage({ applicationId, onMoveToNext }: DocumentVerificationStageProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const requiredDocuments = [
    { id: 'birth_certificate', name: 'Birth Certificate', status: 'verified', uploadedAt: '2024-01-15', verifiedBy: 'John Admin' },
    { id: 'passport_photo', name: 'Passport Photo', status: 'verified', uploadedAt: '2024-01-15', verifiedBy: 'John Admin' },
    { id: 'school_reports', name: 'Previous School Reports', status: 'pending', uploadedAt: '2024-01-16', verifiedBy: null },
    { id: 'medical_records', name: 'Medical Records', status: 'rejected', uploadedAt: '2024-01-14', verifiedBy: 'Sarah Nurse', notes: 'Document unclear, please resubmit' },
    { id: 'proof_address', name: 'Proof of Address', status: 'missing', uploadedAt: null, verifiedBy: null }
  ];

  const optionalDocuments = [
    { id: 'awards_certificates', name: 'Awards & Certificates', status: 'verified', uploadedAt: '2024-01-16', verifiedBy: 'John Admin' },
    { id: 'recommendation_letter', name: 'Recommendation Letter', status: 'missing', uploadedAt: null, verifiedBy: null }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending': return <Badge variant="secondary">Pending Review</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'missing': return <Badge variant="outline">Missing</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'missing': return <FileText className="h-4 w-4 text-gray-400" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleVerifyDocument = (documentId: string, action: 'approve' | 'reject') => {
    console.log(`${action} document: ${documentId}`);
  };

  const DocumentList = ({ documents, title }: { documents: any[], title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(doc.status)}
                <div>
                  <p className="font-medium">{doc.name}</p>
                  {doc.uploadedAt && (
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      {doc.verifiedBy && ` • Verified by: ${doc.verifiedBy}`}
                    </p>
                  )}
                  {doc.notes && (
                    <p className="text-sm text-red-600 mt-1">{doc.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
                {doc.uploadedAt && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {doc.status === 'missing' && (
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Document Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Document Verification Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">2</div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Lists */}
      <Tabs defaultValue="required">
        <TabsList>
          <TabsTrigger value="required">Required Documents</TabsTrigger>
          <TabsTrigger value="optional">Optional Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="required" className="space-y-4">
          <DocumentList documents={requiredDocuments} title="Required Documents" />
        </TabsContent>
        
        <TabsContent value="optional" className="space-y-4">
          <DocumentList documents={optionalDocuments} title="Optional Documents" />
        </TabsContent>
      </Tabs>

      {/* Document Verification Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Bulk Approve Verified
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Request Missing Documents
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium">Verification Notes</label>
              <Textarea 
                placeholder="Add any notes about the document verification process..."
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to proceed to Application Review?</p>
              <p className="text-sm text-muted-foreground">
                All required documents must be verified before proceeding.
              </p>
            </div>
            <Button onClick={onMoveToNext}>
              Move to Application Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}