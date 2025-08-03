import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function DocumentManager() {
  // Mock data
  const documents = [
    {
      id: '1',
      name: 'Birth Certificate',
      type: 'required',
      status: 'verified',
      uploadedBy: 'Parent',
      uploadedAt: '2024-01-10',
      verifiedBy: 'Admin',
      verifiedAt: '2024-01-11'
    },
    {
      id: '2', 
      name: 'Previous School Reports',
      type: 'required',
      status: 'pending',
      uploadedBy: 'Parent',
      uploadedAt: '2024-01-12',
      verifiedBy: null,
      verifiedAt: null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verified</p>
                <p className="text-3xl font-bold">142</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Pending</p>
                <p className="text-3xl font-bold">23</p>
              </div>
              <Clock className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Missing</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-3xl font-bold">173</p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Verification Queue</CardTitle>
          <CardDescription>Documents awaiting verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={doc.status === 'verified' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}