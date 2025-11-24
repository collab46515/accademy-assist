import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, CheckCircle, XCircle, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentUploader } from '../documents/DocumentUploader';

interface DocumentVerificationStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  status: string;
  uploaded_at: string | null;
  verified_by: string | null;
  file_path: string;
  mime_type: string | null;
}

export function DocumentVerificationStage({ applicationId, onMoveToNext }: DocumentVerificationStageProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const requiredDocTypes = [
    { id: 'passport_photo', name: 'Child Passport Size Photo', required: true },
    { id: 'birth_certificate', name: 'Birth Certificate', required: true },
    { id: 'aadhaar', name: 'Aadhaar Copy / UID', required: true },
    { id: 'community_cert', name: 'Community Certificate', required: true },
    { id: 'salary_cert', name: 'Salary Certificate / Income Declaration', required: true },
    { id: 'org_endorsement', name: 'Organization Endorsement', required: true },
  ];

  const optionalDocTypes = [
    { id: 'ration_card', name: 'Ration Card', required: false },
    { id: 'medical_cert', name: 'Medical Certificate', required: false },
    { id: 'church_endorsement', name: 'Church Endorsement', required: false },
    { id: 'transfer_cert', name: 'Transfer Certificate', required: false },
    { id: 'migration_cert', name: 'Migration Certificate', required: false },
  ];

  useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDocStatus = (docType: string) => {
    return documents.find(d => d.document_type === docType);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending': return <Badge variant="secondary">Pending Review</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">Missing</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleVerifyDocument = async (documentId: string, newStatus: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('application_documents')
        .update({
          status: newStatus,
          verified_by: user?.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Document updated",
        description: `Document status changed to ${newStatus}`,
      });

      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('application-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const DocumentList = ({ docTypes, title }: { docTypes: typeof requiredDocTypes, title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {docTypes.map((docType) => {
              const doc = getDocStatus(docType.id);
              const status = doc?.status || 'missing';
              
              return (
                <div key={docType.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{docType.name}</p>
                        {docType.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      {doc?.uploaded_at && (
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    {doc && (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(doc.file_path, doc.document_name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDocument(doc.id, 'verified')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDocument(doc.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    {!doc && (
                      <DocumentUploader
                        applicationId={applicationId}
                        documentType={docType.id}
                        documentName={docType.name}
                        onUploadComplete={fetchDocuments}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const rejectedCount = documents.filter(d => d.status === 'rejected').length;
  const missingCount = requiredDocTypes.length + optionalDocTypes.length - documents.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Verification Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{missingCount}</div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="required">
        <TabsList>
          <TabsTrigger value="required">Required Documents</TabsTrigger>
          <TabsTrigger value="optional">Optional Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="required" className="space-y-4">
          <DocumentList docTypes={requiredDocTypes} title="Required Documents" />
        </TabsContent>
        
        <TabsContent value="optional" className="space-y-4">
          <DocumentList docTypes={optionalDocTypes} title="Optional Documents" />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Verification Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Add any notes about the document verification process..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

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
