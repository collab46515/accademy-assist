import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, FileText, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DriverDocumentUploaderProps {
  driverId?: string;
  documentType: 'photo' | 'aadhar' | 'background_check' | 'medical_certificate' | 'license' | 'psv_badge' | 'hmv_permit';
  documentLabel: string;
  currentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  schoolId: string;
}

const DOCUMENT_LABELS: Record<string, string> = {
  photo: 'Photo',
  aadhar: 'Aadhar Document',
  background_check: 'Background Check Report',
  medical_certificate: 'Medical Certificate',
  license: 'Driving License',
  psv_badge: 'PSV Badge',
  hmv_permit: 'HMV Permit',
};

export function DriverDocumentUploader({
  driverId,
  documentType,
  documentLabel,
  currentUrl,
  onUploadComplete,
  onRemove,
  schoolId,
}: DriverDocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    setUploading(true);

    try {
      // Create file path: school_id/driver_id or temp/document_type_timestamp_filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${Date.now()}.${fileExt}`;
      const filePath = driverId 
        ? `${schoolId}/${driverId}/${fileName}`
        : `${schoolId}/temp/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('driver-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('driver-documents')
        .getPublicUrl(filePath);

      onUploadComplete(urlData.publicUrl);

      toast.success(`${documentLabel} uploaded successfully`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleViewDocument = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank');
    }
  };

  const inputId = `upload-${documentType}-${driverId || 'new'}`;

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id={inputId}
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      
      {currentUrl ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleViewDocument}
            className="gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </Button>
          <label htmlFor={inputId}>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploading}
              asChild
            >
              <span className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-3 w-3 mr-1" />
                    Replace
                  </>
                )}
              </span>
            </Button>
          </label>
          {onRemove && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <label htmlFor={inputId} className="w-full">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            className="w-full gap-1"
            asChild
          >
            <span className="cursor-pointer">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload {documentLabel}
                </>
              )}
            </span>
          </Button>
        </label>
      )}
    </div>
  );
}
