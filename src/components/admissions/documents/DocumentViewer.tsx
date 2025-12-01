import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  documentName: string;
  mimeType?: string;
  onDownload?: () => void;
}

export function DocumentViewer({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  mimeType,
  onDownload,
}: DocumentViewerProps) {
  const [zoom, setZoom] = React.useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const isPDF = mimeType?.includes('pdf') || documentName.toLowerCase().endsWith('.pdf');
  const isImage = mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(documentName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{documentName}</DialogTitle>
            <div className="flex items-center gap-2">
              {isImage && (
                <>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-slate-100 p-4">
          {!documentUrl ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Loading document...</p>
            </div>
          ) : isPDF ? (
            <div className="w-full h-full bg-white rounded shadow-sm">
              <iframe
                src={documentUrl}
                className="w-full h-full border-0 rounded"
                title={documentName}
              />
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={documentUrl}
                alt={documentName}
                className="max-w-full max-h-full object-contain rounded shadow-lg"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
              <p>Preview not available for this file type</p>
              <p className="text-sm">File type: {mimeType || 'Unknown'}</p>
              {onDownload && (
                <Button onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download to view
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}