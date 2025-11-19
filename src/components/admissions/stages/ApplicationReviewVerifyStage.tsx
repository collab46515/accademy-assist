import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, CheckCircle, XCircle, Eye, FileText, AlertTriangle } from 'lucide-react';

interface ApplicationReviewVerifyStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function ApplicationReviewVerifyStage({ applicationId, onMoveToNext }: ApplicationReviewVerifyStageProps) {
  const [academicScore, setAcademicScore] = useState([75]);
  const [behaviorScore, setBehaviorScore] = useState([80]);
  const [communicationScore, setCommunicationScore] = useState([70]);

  // Required documents as per new requirements
  const requiredDocuments = [
    { id: 'aadhaar', name: 'Aadhaar Copy / UID', status: 'verified', uploadedAt: '2024-01-15', verifiedBy: 'John Admin' },
    { id: 'community_cert', name: 'Community Certificate', status: 'verified', uploadedAt: '2024-01-15', verifiedBy: 'John Admin' },
    { id: 'birth_certificate', name: 'Birth Certificate', status: 'verified', uploadedAt: '2024-01-15', verifiedBy: 'John Admin' },
    { id: 'salary_cert', name: 'Salary Certificate / Slip or Self Declaration of Income', status: 'pending', uploadedAt: '2024-01-16', verifiedBy: null },
    { id: 'passport_photo', name: 'Passport Photo', status: 'verified', uploadedAt: '2024-01-14', verifiedBy: 'John Admin' }
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
                {requiredDocuments.map((doc) => (
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
                      {!doc.uploadedAt && (
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
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
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline">Save Notes</Button>
                <Button>Verify All Documents</Button>
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
