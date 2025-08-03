import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ApplicationDocumentsProps {
  applicationId: string;
}

export function ApplicationDocuments({ applicationId }: ApplicationDocumentsProps) {
  // Mock documents data
  const documents = [
    {
      id: '1',
      name: 'Birth Certificate',
      type: 'Identity',
      status: 'verified',
      size: '2.4 MB',
      uploadedAt: '2024-01-10',
      verifiedAt: '2024-01-11'
    },
    {
      id: '2',
      name: 'Previous School Reports',
      type: 'Academic',
      status: 'pending',
      size: '5.1 MB',
      uploadedAt: '2024-01-12',
      verifiedAt: null
    },
    {
      id: '3',
      name: 'Passport Copy',
      type: 'Identity',
      status: 'verified',
      size: '1.8 MB',
      uploadedAt: '2024-01-10',
      verifiedAt: '2024-01-11'
    }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verified</p>
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-2xl font-bold">1</p>
              </div>
              <Clock className="h-6 w-6 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <FileText className="h-6 w-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <h4 className="font-medium">{document.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{document.type}</span>
                      <span>•</span>
                      <span>{document.size}</span>
                      <span>•</span>
                      <span>Uploaded {document.uploadedAt}</span>
                    </div>
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
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {document.status === 'pending' && (
                      <Button size="sm">
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Additional Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Button>
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}