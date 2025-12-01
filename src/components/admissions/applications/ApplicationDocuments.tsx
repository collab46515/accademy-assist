import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, CheckCircle, Clock, AlertTriangle, Upload, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentViewer } from '../documents/DocumentViewer';

interface ApplicationDocumentsProps {
  applicationId: string;
}

interface DocumentData {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
  verification_notes?: string;
}

export function ApplicationDocuments({ applicationId }: ApplicationDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerDocName, setViewerDocName] = useState('');
  const [viewerMimeType, setViewerMimeType] = useState('');
  const [currentViewFilePath, setCurrentViewFilePath] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: 'Error',
        description: 'Please select a file and document type',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${applicationId}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('application_documents')
        .insert([{
          application_id: applicationId,
          document_name: selectedFile.name,
          document_type: documentType,
          file_path: fileName,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Document uploaded successfully'
      });

      setSelectedFile(null);
      setDocumentType('');
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVerifyDocument = async (docId: string, status: 'verified' | 'rejected') => {
    try {
      setVerifyingDocId(docId);
      const { error } = await supabase
        .from('application_documents')
        .update({
          status,
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verified_at: new Date().toISOString(),
          verification_notes: verificationNotes || null
        })
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Document ${status} successfully`
      });

      setVerificationNotes('');
      fetchDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify document',
        variant: 'destructive'
      });
    } finally {
      setVerifyingDocId(null);
    }
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
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
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive'
      });
    }
  };

  const viewDocument = async (filePath: string, fileName: string, mimeType?: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('application-documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;

      setViewerUrl(data.signedUrl);
      setViewerDocName(fileName);
      setViewerMimeType(mimeType || '');
      setCurrentViewFilePath(filePath);
      setViewerOpen(true);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document for viewing',
        variant: 'destructive'
      });
    }
  };

  const documentTypes = [
    'Birth Certificate',
    'Passport Copy',
    'Previous School Reports',
    'Medical Records',
    'Proof of Address',
    'Immunization Records',
    'Photo ID',
    'Other'
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <Card>
              <CardContent className="p-4">
                <div className="h-16 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const rejectedCount = documents.filter(d => d.status === 'rejected').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verified</p>
                <p className="text-2xl font-bold">{verifiedCount}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-6 w-6 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-6 w-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-slate-100 rounded">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button 
            onClick={handleFileUpload} 
            disabled={!selectedFile || !documentType || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div 
                  key={document.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{document.document_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{document.document_type}</span>
                        <span>•</span>
                        <span>{(document.file_size / 1024 / 1024).toFixed(1)} MB</span>
                        <span>•</span>
                        <span>Uploaded {new Date(document.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      {document.verification_notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Notes:</strong> {document.verification_notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(document.status)}
                      <Badge className={getStatusColor(document.status)}>
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewDocument(document.file_path, document.document_name, document.mime_type)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadDocument(document.file_path, document.document_name)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {document.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleVerifyDocument(document.id, 'verified')}
                            disabled={verifyingDocId === document.id}
                          >
                            Verify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleVerifyDocument(document.id, 'rejected')}
                            disabled={verifyingDocId === document.id}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Notes for Pending Documents */}
      {documents.some(d => d.status === 'pending') && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes for document verification..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      <DocumentViewer
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setViewerUrl(null);
        }}
        documentUrl={viewerUrl}
        documentName={viewerDocName}
        mimeType={viewerMimeType}
        onDownload={() => downloadDocument(currentViewFilePath, viewerDocName)}
      />
    </div>
  );
}