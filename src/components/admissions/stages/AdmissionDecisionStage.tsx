import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, FileText, Mail, Award, AlertTriangle } from 'lucide-react';

interface AdmissionDecisionStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function AdmissionDecisionStage({ applicationId, onMoveToNext }: AdmissionDecisionStageProps) {
  const [decision, setDecision] = useState<string>('');
  const [conditions, setConditions] = useState<string[]>([]);

  const applicationSummary = {
    studentName: 'John Smith',
    applicationNumber: 'APP-2024-001',
    yearGroup: 'Year 7',
    overallScore: 82,
    assessmentScores: {
      mathematics: 85,
      english: 78,
      interview: 84
    },
    documentStatus: 'complete',
    reviewStatus: 'complete'
  };

  const committeeMember = [
    { name: 'Dr. Sarah Wilson', role: 'Head of Admissions', decision: 'approve', notes: 'Strong academic performance' },
    { name: 'Mr. James Brown', role: 'Academic Director', decision: 'approve', notes: 'Good potential for growth' },
    { name: 'Ms. Emily Davis', role: 'Year Head', decision: 'conditional', notes: 'Needs support in English' },
    { name: 'Dr. Michael Thompson', role: 'Deputy Head', decision: null, notes: null }
  ];

  const decisionOptions = [
    { value: 'accept', label: 'Accept (Unconditional)', color: 'text-green-600', icon: CheckCircle },
    { value: 'conditional', label: 'Accept (Conditional)', color: 'text-yellow-600', icon: AlertTriangle },
    { value: 'waitlist', label: 'Waitlist', color: 'text-blue-600', icon: Clock },
    { value: 'reject', label: 'Reject', color: 'text-red-600', icon: XCircle }
  ];

  const possibleConditions = [
    'Achieve minimum grade B in English',
    'Complete summer mathematics program',
    'Provide additional character reference',
    'Attend orientation session',
    'Submit health clearance'
  ];

  const getDecisionBadge = (decision: string | null) => {
    switch (decision) {
      case 'approve': return <Badge variant="default" className="bg-green-100 text-green-800">Approve</Badge>;
      case 'conditional': return <Badge variant="secondary">Conditional</Badge>;
      case 'reject': return <Badge variant="destructive">Reject</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getOverallRecommendation = () => {
    const decisions = committeeMember.filter(m => m.decision).map(m => m.decision);
    const approvals = decisions.filter(d => d === 'approve').length;
    const conditionals = decisions.filter(d => d === 'conditional').length;
    const rejections = decisions.filter(d => d === 'reject').length;

    if (approvals >= conditionals + rejections) return 'approve';
    if (conditionals > rejections) return 'conditional';
    return 'reject';
  };

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-medium">{applicationSummary.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Application Number</p>
              <p className="font-medium">{applicationSummary.applicationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year Group</p>
              <p className="font-medium">{applicationSummary.yearGroup}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="font-medium text-primary">{applicationSummary.overallScore}/100</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{applicationSummary.assessmentScores.mathematics}</div>
              <div className="text-sm text-muted-foreground">Mathematics</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{applicationSummary.assessmentScores.english}</div>
              <div className="text-sm text-muted-foreground">English</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{applicationSummary.assessmentScores.interview}</div>
              <div className="text-sm text-muted-foreground">Interview</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="committee">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="committee">Committee Review</TabsTrigger>
          <TabsTrigger value="decision">Final Decision</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="committee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Committee Members Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {committeeMember.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      {member.notes && (
                        <p className="text-sm mt-1">{member.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {getDecisionBadge(member.decision)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">Committee Recommendation: 
                  <span className="ml-2 text-primary">{getOverallRecommendation().toUpperCase()}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="decision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Final Admission Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Decision</label>
                  <Select value={decision} onValueChange={setDecision}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select final decision" />
                    </SelectTrigger>
                    <SelectContent>
                      {decisionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className={`h-4 w-4 ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {decision === 'accept' && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Unconditional Acceptance</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Student meets all requirements for admission without conditions.
                    </p>
                  </div>
                )}
                
                {decision === 'conditional' && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Conditional Acceptance</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Acceptance subject to meeting specified conditions.
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Decision Notes</label>
                  <Textarea 
                    placeholder="Provide reasoning for the admission decision..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Decision Date</label>
                  <Input type="date" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admission Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add conditions that must be met for conditional acceptance.
                </p>
                
                <div>
                  <label className="text-sm font-medium">Select Conditions</label>
                  <div className="space-y-2 mt-2">
                    {possibleConditions.map((condition, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConditions([...conditions, condition]);
                            } else {
                              setConditions(conditions.filter(c => c !== condition));
                            }
                          }}
                        />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Custom Condition</label>
                  <Input placeholder="Add custom condition..." />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Condition Due Date</label>
                  <Input type="date" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Decision Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Acceptance Letter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Rejection Letter
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Communication Notes</label>
                  <Textarea 
                    placeholder="Additional notes for the decision letter..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Print Letter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Next Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to proceed to Fee Payment?</p>
              <p className="text-sm text-muted-foreground">
                Finalize and communicate the admission decision before proceeding.
              </p>
            </div>
            <Button onClick={onMoveToNext}>
              Move to Fee Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}