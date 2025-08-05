import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  FileText, 
  Upload,
  Image,
  FileAudio,
  FileVideo,
  Mic,
  Camera,
  Star, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Save,
  Download,
  Trash2,
  Eye,
  BarChart3,
  Users,
  Brain,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';

interface GradingResult {
  suggestedGrade: string;
  marksAwarded: number;
  questionBreakdown: Array<{
    question: number;
    marks: number;
    feedback: string;
  }>;
  rubricScores: Array<{
    criterion: string;
    score: number;
    feedback: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  nextSteps: string[];
  effort: string;
  confidence: string;
  classInsights: {
    commonMistakes: string[];
    conceptualGaps: string[];
  };
}

interface Assignment {
  id?: string;
  title: string;
  subject: string;
  year_group: string;
  max_marks: number;
  assignment_type: string;
  description?: string;
  questions: Array<{
    text: string;
    marks: number;
    type: string;
  }>;
}

interface Rubric {
  id: string;
  title: string;
  subject: string;
  criteria: any;
  point_scale: any;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface Submission {
  id?: string;
  submission_type: string;
  content: string;
  file_urls: string[];
  metadata: any;
}

export const EnhancedAIGradingAssistant = () => {
  const { toast } = useToast();
  const { currentSchool } = useRBAC();
  
  const [activeTab, setActiveTab] = useState('setup');
  const [submission, setSubmission] = useState<Submission>({
    submission_type: 'text',
    content: '',
    file_urls: [],
    metadata: {}
  });
  
  const [assignment, setAssignment] = useState<Assignment>({
    title: '',
    subject: '',
    year_group: '',
    max_marks: 100,
    assignment_type: 'essay',
    description: '',
    questions: []
  });
  
  const [selectedRubricId, setSelectedRubricId] = useState<string>('');
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [classAnalytics, setClassAnalytics] = useState<any>(null);

  const subjectOptions = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Art', 'Music', 'Physical Education', 'Computer Science', 
    'Modern Languages', 'Religious Studies', 'Drama'
  ];

  const yearGroupOptions = [
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ];

  const assignmentTypes = [
    'essay', 'short_answer', 'multiple_choice', 'project', 
    'presentation', 'practical', 'creative_writing', 'analysis'
  ];

  // Load rubrics for the school
  React.useEffect(() => {
    loadRubrics();
  }, [currentSchool?.id]);

  const loadRubrics = async () => {
    if (!currentSchool?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('grading_rubrics')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRubrics(data || []);
    } catch (error) {
      console.error('Error loading rubrics:', error);
    }
  };

  // Handle file uploads
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return;

    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${currentSchool?.id}/${fileName}`;

      try {
        const { data, error } = await supabase.storage
          .from('submissions')
          .upload(filePath, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('submissions')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setSubmission(prev => ({
      ...prev,
      file_urls: [...prev.file_urls, ...uploadedUrls],
      submission_type: files[0].type.startsWith('image/') ? 'image' :
                      files[0].type.startsWith('audio/') ? 'audio' :
                      files[0].type.startsWith('video/') ? 'video' :
                      files[0].type === 'application/pdf' ? 'pdf' : 'document'
    }));

    toast({
      title: "Upload Complete",
      description: `${uploadedUrls.length} file(s) uploaded successfully`,
    });
  }, [currentSchool?.id, toast]);

  // Add question to assignment
  const addQuestion = () => {
    setAssignment(prev => ({
      ...prev,
      questions: [...prev.questions, {
        text: '',
        marks: 10,
        type: 'short_answer'
      }]
    }));
  };

  // Remove question from assignment
  const removeQuestion = (index: number) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // Update question
  const updateQuestion = (index: number, field: string, value: any) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  // Handle enhanced grading
  const handleEnhancedGrading = async () => {
    if (!submission.content.trim() && submission.file_urls.length === 0) {
      toast({
        title: "Error",
        description: "Please provide student work (text or files) to grade",
        variant: "destructive"
      });
      return;
    }

    if (!assignment.title || !assignment.subject || !assignment.year_group) {
      toast({
        title: "Error",
        description: "Please fill in all assignment details",
        variant: "destructive"
      });
      return;
    }

    setIsGrading(true);
    setGradingResult(null);

    try {
      // Create submission record
      const { data: submissionData, error: submissionError } = await supabase
        .from('student_submissions')
        .insert({
          school_id: currentSchool?.id,
          assignment_id: assignment.id,
          student_id: currentSchool?.id, // Placeholder - would be actual student ID
          submitted_by: (await supabase.auth.getUser()).data.user?.id,
          submission_type: submission.submission_type,
          content: submission.content,
          file_urls: submission.file_urls,
          metadata: submission.metadata
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Call enhanced AI grading function
      const { data, error } = await supabase.functions.invoke('enhanced-ai-grading', {
        body: {
          submissionId: submissionData.id,
          submissionData: submission,
          rubricId: selectedRubricId || null,
          assignmentData: assignment,
          processingType: 'enhanced_grading',
          classAnalytics: true
        }
      });

      if (error) throw error;

      if (data.success) {
        setGradingResult(data.grading);
        setActiveTab('results');
        
        // Load class analytics
        if (assignment.year_group) {
          loadClassAnalytics(assignment.id || '', assignment.year_group);
        }
        
        toast({
          title: "Enhanced Grading Complete",
          description: "AI has successfully analyzed the submission with advanced features",
        });
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error in enhanced grading:', error);
      toast({
        title: "Grading Failed",
        description: error.message || "Failed to grade submission. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGrading(false);
    }
  };

  // Load class analytics
  const loadClassAnalytics = async (assignmentId: string, classId: string) => {
    try {
      const { data, error } = await supabase
        .from('class_analytics')
        .select('*')
        .eq('school_id', currentSchool?.id)
        .eq('assignment_id', assignmentId)
        .eq('class_id', classId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setClassAnalytics(data);
    } catch (error) {
      console.error('Error loading class analytics:', error);
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800"><Star className="h-3 w-3 mr-1" />Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'satisfactory':
        return <Badge variant="secondary">Satisfactory</Badge>;
      case 'needs improvement':
        return <Badge variant="destructive">Needs Improvement</Badge>;
      default:
        return <Badge variant="outline">{effort}</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          Enhanced AI Grading Assistant
        </h1>
        <p className="text-muted-foreground">
          Advanced AI grading with multi-format support, rubrics, and class-level insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Assignment Setup</TabsTrigger>
          <TabsTrigger value="submission">Student Work</TabsTrigger>
          <TabsTrigger value="rubric">Rubric & Criteria</TabsTrigger>
          <TabsTrigger value="results">Results & Analytics</TabsTrigger>
        </TabsList>

        {/* Assignment Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assignment Configuration
              </CardTitle>
              <CardDescription>Set up the assignment details and questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Climate Change Analysis Essay"
                    value={assignment.title}
                    onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-type">Assignment Type</Label>
                  <Select value={assignment.assignment_type} onValueChange={(value) => setAssignment(prev => ({ ...prev, assignment_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={assignment.subject} onValueChange={(value) => setAssignment(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year-group">Year Group</Label>
                  <Select value={assignment.year_group} onValueChange={(value) => setAssignment(prev => ({ ...prev, year_group: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year group" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearGroupOptions.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-marks">Maximum Marks</Label>
                  <Input
                    id="max-marks"
                    type="number"
                    placeholder="100"
                    value={assignment.max_marks}
                    onChange={(e) => setAssignment(prev => ({ ...prev, max_marks: parseInt(e.target.value) || 100 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Assignment Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the assignment requirements, learning objectives, and expectations..."
                  value={assignment.description}
                  onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Assignment Questions</h4>
                  <Button onClick={addQuestion} variant="outline" size="sm">
                    Add Question
                  </Button>
                </div>

                {assignment.questions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Question {index + 1}</Label>
                        <Button 
                          onClick={() => removeQuestion(index)} 
                          variant="ghost" 
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Enter the question text..."
                        value={question.text}
                        onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Marks</Label>
                          <Input
                            type="number"
                            value={question.marks}
                            onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select value={question.type} onValueChange={(value) => updateQuestion(index, 'type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                              <SelectItem value="calculation">Calculation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Work Tab */}
        <TabsContent value="submission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Student Submission
              </CardTitle>
              <CardDescription>Upload files or paste text content for grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Submission Type Selector */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { type: 'text', icon: FileText, label: 'Text' },
                  { type: 'image', icon: Image, label: 'Images' },
                  { type: 'audio', icon: FileAudio, label: 'Audio' },
                  { type: 'video', icon: FileVideo, label: 'Video' },
                  { type: 'pdf', icon: FileText, label: 'PDF/Docs' }
                ].map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant={submission.submission_type === type ? "default" : "outline"}
                    onClick={() => setSubmission(prev => ({ ...prev, submission_type: type }))}
                    className="flex flex-col gap-2 h-16"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept={
                    submission.submission_type === 'image' ? 'image/*' :
                    submission.submission_type === 'audio' ? 'audio/*' :
                    submission.submission_type === 'video' ? 'video/*' :
                    submission.submission_type === 'pdf' ? '.pdf,.doc,.docx' : '*'
                  }
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground">
                    Support for {submission.submission_type} files, OCR, and transcription
                  </p>
                </label>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>

              {/* Uploaded Files */}
              {submission.file_urls.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files ({submission.file_urls.length})</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {submission.file_urls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm truncate">File {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSubmission(prev => ({
                            ...prev,
                            file_urls: prev.file_urls.filter((_, i) => i !== index)
                          }))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Text Content (Optional)</Label>
                <Textarea
                  id="content"
                  placeholder="Paste written work, or leave blank if using file uploads only..."
                  value={submission.content}
                  onChange={(e) => setSubmission(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="min-h-[200px]"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{submission.content.length} characters</span>
                  <span>{submission.content.split(/\s+/).filter(word => word.length > 0).length} words</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rubric Tab */}
        <TabsContent value="rubric" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Grading Rubric
              </CardTitle>
              <CardDescription>Select or create a rubric for consistent grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Existing Rubric (Optional)</Label>
                <Select value={selectedRubricId} onValueChange={setSelectedRubricId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a rubric or grade without one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No rubric (general grading)</SelectItem>
                    {rubrics.map(rubric => (
                      <SelectItem key={rubric.id} value={rubric.id}>
                        {rubric.title} - {rubric.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRubricId && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Rubric Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {rubrics.find(r => r.id === selectedRubricId) && (
                      <div className="space-y-3">
                        <h4 className="font-medium">
                          {rubrics.find(r => r.id === selectedRubricId)?.title}
                        </h4>
                        <div className="grid gap-2">
                          {Array.isArray(rubrics.find(r => r.id === selectedRubricId)?.criteria) ? 
                            rubrics.find(r => r.id === selectedRubricId)?.criteria.map((criterion: any, index: number) => (
                              <div key={index} className="p-3 bg-background rounded border">
                                <h5 className="font-medium">{criterion.name || `Criterion ${index + 1}`}</h5>
                                <p className="text-sm text-muted-foreground">{criterion.description || 'No description'}</p>
                              </div>
                            )) : (
                              <div className="p-3 bg-background rounded border">
                                <p className="text-sm text-muted-foreground">Rubric criteria will be displayed here</p>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {gradingResult ? (
            <>
              {/* Main Grading Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-green-600" />
                    Enhanced AI Grading Results
                  </CardTitle>
                  <CardDescription>Comprehensive feedback and assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Grade Overview */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Grade</p>
                      <p className="text-3xl font-bold text-primary">{gradingResult.suggestedGrade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Marks Awarded</p>
                      <p className="text-2xl font-semibold">{gradingResult.marksAwarded}/{assignment.max_marks}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getEffortBadge(gradingResult.effort)}
                      {getConfidenceBadge(gradingResult.confidence)}
                    </div>
                  </div>

                  {/* Question Breakdown */}
                  {gradingResult.questionBreakdown.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Question-by-Question Breakdown</h4>
                      <div className="space-y-3">
                        {gradingResult.questionBreakdown.map((q, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">Question {q.question}</h5>
                              <Badge variant="outline">{q.marks} marks</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{q.feedback}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rubric Scores */}
                  {gradingResult.rubricScores.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Rubric Assessment</h4>
                      <div className="space-y-3">
                        {gradingResult.rubricScores.map((score, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{score.criterion}</h5>
                              <Badge>{score.score}/4</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{score.feedback}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Feedback Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {gradingResult.strengths.map((strength, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {gradingResult.areasForImprovement.map((area, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Next Steps
                    </h4>
                    <ul className="space-y-1">
                      {gradingResult.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Detailed Feedback</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">{gradingResult.detailedFeedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Class Analytics */}
              {classAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Class-Level Insights
                    </CardTitle>
                    <CardDescription>Trends and patterns across the class</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{classAnalytics.analytics_data.totalSubmissions}</p>
                        <p className="text-sm text-muted-foreground">Submissions Processed</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{classAnalytics.analytics_data.commonMistakes?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Common Issues</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{classAnalytics.analytics_data.conceptualGaps?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Learning Gaps</p>
                      </div>
                    </div>

                    {classAnalytics.insights && classAnalytics.insights.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Key Insights</h5>
                        <ul className="space-y-1">
                          {classAnalytics.insights.map((insight: string, index: number) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 mt-1 text-primary" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Grade</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Complete the assignment setup and submit student work to see AI grading results
                </p>
                <Button onClick={() => setActiveTab('setup')}>
                  Start Setup
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <Button 
          onClick={handleEnhancedGrading}
          disabled={isGrading || (!submission.content.trim() && submission.file_urls.length === 0)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-lg"
        >
          {isGrading ? (
            <Bot className="h-6 w-6 animate-spin" />
          ) : (
            <Zap className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};