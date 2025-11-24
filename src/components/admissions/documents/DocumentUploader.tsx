import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  applicationId: string;
  documentType: string;
  documentName: string;
  onUploadComplete: () => void;
}

export function DocumentUploader({ 
  applicationId, 
  documentType, 
  documentName,
  onUploadComplete 
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, JPG, PNG, DOC, and DOCX files are allowed",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to storage
      const filePath = `${applicationId}/${documentType}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Create document record
      const { error: dbError } = await supabase
        .from('application_documents')
        .insert({
          application_id: applicationId,
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          status: 'pending',
          uploaded_by: user?.id,
          uploaded_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: `${documentName} has been uploaded`,
      });

      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        id={`upload-${documentType}`}
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <label htmlFor={`upload-${documentType}`}>
        <Button
          size="sm"
          variant="outline"
          disabled={uploading}
          asChild
        >
          <span>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </span>
        </Button>
      </label>
    </div>
  );
}
