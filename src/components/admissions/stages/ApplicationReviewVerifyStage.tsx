import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, CheckCircle, XCircle, Eye, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApplicationReviewVerifyStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

interface Document {
  id?: string;
  document_type: string;
  document_name: string;
  status: string;
  required: boolean;
  file_path?: string;
  uploaded_at?: string;
  verified_by?: string;
  file_size?: number;
  mime_type?: string;
}

export function ApplicationReviewVerifyStage({ applicationId, onMoveToNext }: ApplicationReviewVerifyStageProps) {
  const [academicScore, setAcademicScore] = useState([75]);
  const [behaviorScore, setBehaviorScore] = useState([80]);
  const [communicationScore, setCommunicationScore] = useState([70]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  // Required documents template
  const requiredDocumentsTemplate = [
    { document_type: 'passport_photo', document_name: 'Child Passport Size Photo', required: true },
    { document_type: 'birth_certificate', document_name: 'Birth Certificate', required: true },
    { document_type: 'aadhaar', document_name: 'Aadhaar Copy / UID', required: true },
    { document_type: 'community_cert', document_name: 'Community Certificate', required: true },
    { document_type: 'salary_cert', document_name: 'Salary Certificate / Slip or Self Declaration of Income', required: true },
    { document_type: 'org_endorsement', document_name: 'Organization Endorsement or Reference Letter', required: true },
    { document_type: 'ration_card', document_name: 'Ration Card', required: false },
    { document_type: 'medical_cert', document_name: 'Medical Certificate', required: false },
    { document_type: 'church_endorsement', document_name: 'Church Endorsement (Church Certificate or Letter from Pastor)', required: false },
    { document_type: 'transfer_cert', document_name: 'Transfer Certificate', required: false },
    { document_type: 'migration_cert', document_name: 'Migration Certificate', required: false }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId);

      if (error) throw error;

      // Merge fetched documents with template
      const mergedDocs = requiredDocumentsTemplate.map(template => {
        const existingDoc = data?.find(d => d.document_type === template.document_type);
        if (existingDoc) {
          return {
            ...template,
            id: existingDoc.id,
            status: existingDoc.status,
            file_path: existingDoc.file_path,
            uploaded_at: existingDoc.uploaded_at,
            verified_by: existingDoc.verified_by,
            file_size: existingDoc.file_size,
            mime_type: existingDoc.mime_type
          };
        }
        return { ...template, status: 'pending' };
      });

      setDocuments(mergedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    try {
      setUploading(documentType);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${applicationId}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Check if document record exists
      const existingDoc = documents.find(d => d.document_type === documentType);
      
      if (existingDoc?.id) {
        // Update existing document
        const { error: updateError } = await supabase
          .from('application_documents')
          .update({
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            uploaded_at: new Date().toISOString(),
            uploaded_by: user.id,
            status: 'pending'
          })
          .eq('id', existingDoc.id);

        if (updateError) throw updateError;
      } else {
        // Create new document record
        const doc = documents.find(d => d.document_type === documentType);
        const { error: insertError } = await supabase
          .from('application_documents')
          .insert({
            application_id: applicationId,
            document_type: documentType,
            document_name: doc?.document_name || documentType,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            uploaded_at: new Date().toISOString(),
            uploaded_by: user.id,
            status: 'pending'
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('application_documents')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: user.id
        })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document verified successfully",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        title: "Error",
        description: "Failed to verify document",
        variant: "destructive",
      });
    }
  };

  const handleVerifyAll = async () => {
    try {
      setVerifying(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all document IDs that have been uploaded
      const uploadedDocIds = documents
        .filter(d => d.id && d.file_path)
        .map(d => d.id);

      if (uploadedDocIds.length === 0) {
        toast({
          title: "No documents",
          description: "No documents to verify",
          variant: "destructive",
        });
        return;
      }

      // Update all uploaded documents to verified
      const { error } = await supabase
        .from('application_documents')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: user.id,
          verification_notes: notes
        })
        .in('id', uploadedDocIds);

      if (error) throw error;

      // Refetch documents to get updated status
      const { data: updatedDocs } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId);

      // Check if all required documents are verified
      const allRequiredVerified = requiredDocumentsTemplate
        .filter(d => d.required)
        .every(req => {
          const doc = updatedDocs?.find(d => d.document_type === req.document_type);
          return doc?.status === 'verified';
        });

      if (allRequiredVerified) {
        // Update application status to move to next stage
        await supabase
          .from('enrollment_applications')
          .update({ status: 'assessment_scheduled' })
          .eq('id', applicationId);
      }

      toast({
        title: "Success",
        description: "All documents verified successfully",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error verifying documents:', error);
      toast({
        title: "Error",
        description: "Failed to verify documents",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDownloadDocument = async (filePath: string, documentName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('application-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('application-documents')
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: "Error",
        description: "Failed to view document",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'pending': return <Badge variant="secondary">Pending Review</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
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

  const compositeScore = Math.round((academicScore[0] + behaviorScore[0] + communicationScore[0]) / 3);

  const ScoreCard = ({ title, score, onScoreChange }: { title: string, score: number[], onScoreChange: (value: number[]) => void }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{score[0]}/100</span>
            <Badge variant={score[0] >= 80 ? "default" : score[0] >= 60 ? "secondary" : "destructive"}>
              {score[0] >= 80 ? "Excellent" : score[0] >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <Slider
            value={score}
            onValueChange={onScoreChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Document Verification</TabsTrigger>
          <TabsTrigger value="review">Application Review</TabsTrigger>
        </TabsList>

        {/* Document Verification Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.document_type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{doc.document_name}</p>
                          {doc.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        {doc.uploaded_at && (
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                            {doc.verified_by && ` • Verified`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      {doc.file_path && (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDocument(doc.file_path!)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadDocument(doc.file_path!, doc.document_name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {doc.status !== 'verified' && doc.id && (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleVerifyDocument(doc.id!)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      )}
                      {!doc.file_path && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={uploading === doc.document_type}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'application/pdf,image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleFileUpload(doc.document_type, file);
                            };
                            input.click();
                          }}
                        >
                          {uploading === doc.document_type ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Review Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add notes about document verification..." 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleVerifyAll}
                  disabled={verifying || documents.filter(d => d.file_path).length === 0}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify All Documents
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Review Tab */}
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScoreCard 
                  title="Academic Performance" 
                  score={academicScore} 
                  onScoreChange={setAcademicScore}
                />
                <ScoreCard 
                  title="Behavioral Assessment" 
                  score={behaviorScore} 
                  onScoreChange={setBehaviorScore}
                />
                <ScoreCard 
                  title="Communication Skill" 
                  score={communicationScore} 
                  onScoreChange={setCommunicationScore}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Composite Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Assessment Score</p>
                  <p className="text-4xl font-bold">{compositeScore}/100</p>
                </div>
                <Badge 
                  variant={compositeScore >= 80 ? "default" : compositeScore >= 60 ? "secondary" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {compositeScore >= 80 ? "Excellent" : compositeScore >= 60 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Committee Review Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add your review notes and recommendations..." 
                rows={6}
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline">Save Draft</Button>
                <Button>Submit Review</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stage Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to proceed to Assessment & Interview?</p>
              <p className="text-sm text-muted-foreground">
                Ensure all documents are verified and review is complete.
              </p>
            </div>
            <Button onClick={onMoveToNext} className="ml-4">
              Move to Assessment & Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
