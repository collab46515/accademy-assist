import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Clock, Users, BookOpen, Mic, Video, CheckCircle, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssessmentInterviewStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function AssessmentInterviewStage({ applicationId, onMoveToNext }: AssessmentInterviewStageProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    type: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    assessor: ''
  });
  const { toast } = useToast();

  const scheduledAssessments = [
    {
      id: 'math_assessment',
      type: 'Academic Assessment',
      subject: 'Mathematics',
      date: '2024-01-25',
      time: '10:00 AM',
      duration: '60 minutes',
      assessor: 'Dr. Smith',
      status: 'completed',
      score: 85
    },
    {
      id: 'english_assessment',
      type: 'Academic Assessment',
      subject: 'English',
      date: '2024-01-25',
      time: '11:30 AM',
      duration: '45 minutes',
      assessor: 'Ms. Johnson',
      status: 'completed',
      score: 78
    },
    {
      id: 'interview',
      type: 'Interview',
      subject: 'General Interview',
      date: '2024-01-26',
      time: '2:00 PM',
      duration: '30 minutes',
      assessor: 'Head of Admissions',
      status: 'scheduled',
      score: null
    }
  ];

  const assessmentResults = [
    {
      subject: 'Mathematics',
      score: 85,
      maxScore: 100,
      assessor: 'Dr. Smith',
      date: '2024-01-25',
      notes: 'Strong problem-solving skills, excellent understanding of algebraic concepts.',
      recommendations: 'Suitable for advanced mathematics program.'
    },
    {
      subject: 'English',
      score: 78,
      maxScore: 100,
      assessor: 'Ms. Johnson',
      date: '2024-01-25',
      notes: 'Good reading comprehension, needs improvement in creative writing.',
      recommendations: 'Additional support in creative writing would be beneficial.'
    }
  ];

  const interviewQuestions = [
    'Why do you want to join our school?',
    'Tell us about your favorite subject and why you enjoy it.',
    'Describe a challenge you have overcome.',
    'What are your hobbies and interests outside of school?',
    'How do you handle working in a team?'
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'scheduled': return <Badge variant="secondary">Scheduled</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleScheduleAssessment = () => {
    // Validate form
    if (!newAssessment.type || !newAssessment.subject || !newAssessment.date || !newAssessment.time || !newAssessment.assessor) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to database
    toast({
      title: "Assessment Scheduled",
      description: `${newAssessment.subject} assessment has been scheduled for ${newAssessment.date} at ${newAssessment.time}`,
    });

    // Reset form and close dialog
    setNewAssessment({
      type: '',
      subject: '',
      date: '',
      time: '',
      duration: '',
      assessor: ''
    });
    setIsScheduleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment & Interview Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">81.5</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scheduled Assessments</h3>
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Schedule New Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Assessment</DialogTitle>
                  <DialogDescription>
                    Add a new assessment or interview for this application
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Assessment Type *</Label>
                      <Select 
                        value={newAssessment.type} 
                        onValueChange={(value) => setNewAssessment({...newAssessment, type: value})}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic Assessment</SelectItem>
                          <SelectItem value="behavioral">Behavioral Assessment</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="practical">Practical Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject/Title *</Label>
                      <Input 
                        id="subject" 
                        placeholder="e.g., Mathematics"
                        value={newAssessment.subject}
                        onChange={(e) => setNewAssessment({...newAssessment, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input 
                        id="date" 
                        type="date"
                        value={newAssessment.date}
                        onChange={(e) => setNewAssessment({...newAssessment, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input 
                        id="time" 
                        type="time"
                        value={newAssessment.time}
                        onChange={(e) => setNewAssessment({...newAssessment, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input 
                        id="duration" 
                        placeholder="e.g., 60 minutes"
                        value={newAssessment.duration}
                        onChange={(e) => setNewAssessment({...newAssessment, duration: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assessor">Assessor/Interviewer *</Label>
                      <Input 
                        id="assessor" 
                        placeholder="e.g., Dr. Smith"
                        value={newAssessment.assessor}
                        onChange={(e) => setNewAssessment({...newAssessment, assessor: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleAssessment}>
                    Schedule Assessment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-3">
            {scheduledAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {assessment.type === 'Interview' ? (
                          <Mic className="h-5 w-5 text-primary" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{assessment.subject}</p>
                        <p className="text-sm text-muted-foreground">{assessment.type}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {assessment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {assessment.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {assessment.assessor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(assessment.status)}
                      {assessment.score && (
                        <p className="text-sm font-medium mt-1">Score: {assessment.score}/100</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          {assessmentResults.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{result.subject} Assessment</span>
                  <span className={`text-2xl font-bold ${getScoreColor(result.score, result.maxScore)}`}>
                    {result.score}/{result.maxScore}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Assessor: {result.assessor}</span>
                    <span>Date: {result.date}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Notes:</p>
                    <p className="text-sm text-muted-foreground">{result.notes}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Recommendations:</p>
                    <p className="text-sm text-muted-foreground">{result.recommendations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="interview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Interview Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Interview Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input placeholder="30 minutes" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {interviewQuestions.map((question, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="text-sm">{index + 1}. {question}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interview Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Record interview observations, responses, and overall impression..."
                rows={6}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Overall Recommendation</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strong-accept">Strong Accept</SelectItem>
                      <SelectItem value="accept">Accept</SelectItem>
                      <SelectItem value="conditional">Conditional Accept</SelectItem>
                      <SelectItem value="waitlist">Waitlist</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Detailed Recommendations</label>
                  <Textarea 
                    placeholder="Provide detailed recommendations based on assessment results..."
                    rows={6}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Save Draft</Button>
                  <Button className="flex-1">Submit Assessment</Button>
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
              <p className="font-medium">Ready to proceed to Admission Decision?</p>
              <p className="text-sm text-muted-foreground">
                Complete all assessments and interviews before moving to the final decision stage.
              </p>
            </div>
            <Button onClick={onMoveToNext}>
              Move to Admission Decision
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}