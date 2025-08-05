import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  FileText, 
  Star, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Save,
  Download,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';

interface GradingResult {
  suggestedGrade: string;
  marksAwarded: number;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  nextSteps: string[];
  effort: string;
  confidence: string;
}

interface Assignment {
  title: string;
  subject: string;
  year_group: string;
  max_marks: number;
  description?: string;
}

interface SavedGrading {
  id: string;
  title: string;
  subject: string;
  year_group: string;
  total_marks: number;
  created_at: string;
  marking_scheme: GradingResult[];
}

export const AIGradingAssistant = () => {
  const { toast } = useToast();
  const { currentSchool } = useRBAC();
  
  const [studentWork, setStudentWork] = useState('');
  const [assignment, setAssignment] = useState<Assignment>({
    title: '',
    subject: '',
    year_group: '',
    max_marks: 100,
    description: ''
  });
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [savedGradings, setSavedGradings] = useState<SavedGrading[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  const subjectOptions = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Art', 'Music', 'Physical Education', 'Computer Science', 
    'Modern Languages', 'Religious Studies', 'Drama'
  ];

  const yearGroupOptions = [
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ];

  const loadSavedGradings = async () => {
    if (!currentSchool?.id) return;
    
    setIsLoadingSaved(true);
    try {
      // TODO: Load saved gradings from database once migration is complete
      // For now, use empty array
      setSavedGradings([]);
    } catch (error) {
      console.error('Error loading saved gradings:', error);
      setSavedGradings([]);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  React.useEffect(() => {
    loadSavedGradings();
  }, [currentSchool?.id]);

  const handleGradeSubmission = async () => {
    if (!studentWork.trim()) {
      toast({
        title: "Error",
        description: "Please enter the student's work to grade",
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
      const { data, error } = await supabase.functions.invoke('ai-grading-assistant', {
        body: {
          gradingData: { studentWork },
          assignment,
          rubric: null // Could be extended to include custom rubrics
        }
      });

      if (error) throw error;

      if (data.success) {
        setGradingResult(data.grading);
        await loadSavedGradings(); // Refresh saved gradings
        toast({
          title: "Grading Complete",
          description: "AI has successfully analyzed the submission",
        });
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      toast({
        title: "Grading Failed",
        description: error.message || "Failed to grade submission. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleDeleteSavedGrading = async (id: string) => {
    try {
      // TODO: Delete from database once migration is complete
      setSavedGradings(prev => prev.filter(g => g.id !== id));
      toast({
        title: "Deleted",
        description: "Saved grading has been deleted",
      });
    } catch (error) {
      console.error('Error deleting grading:', error);
      toast({
        title: "Error",
        description: "Failed to delete saved grading",
        variant: "destructive"
      });
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          AI Grading Assistant
        </h1>
        <p className="text-muted-foreground">
          Use AI to provide detailed feedback and suggested grades for student submissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assignment Details
              </CardTitle>
              <CardDescription>Configure the assignment parameters for grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Essay on Climate Change"
                    value={assignment.title}
                    onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Assignment Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the assignment requirements..."
                  value={assignment.description}
                  onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Student Submission
              </CardTitle>
              <CardDescription>Paste the student's work that needs to be graded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste the student's written work, essay, or assignment response here..."
                  value={studentWork}
                  onChange={(e) => setStudentWork(e.target.value)}
                  rows={10}
                  className="min-h-[200px]"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{studentWork.length} characters</span>
                  <span>{studentWork.split(/\s+/).filter(word => word.length > 0).length} words</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={handleGradeSubmission}
              disabled={isGrading || !studentWork.trim()}
              className="flex-1"
              size="lg"
            >
              {isGrading ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Grading in Progress...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Grade with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {gradingResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  AI Grading Results
                </CardTitle>
                <CardDescription>Detailed feedback and assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grade and Marks */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Suggested Grade</p>
                    <p className="text-2xl font-bold text-primary">{gradingResult.suggestedGrade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Marks Awarded</p>
                    <p className="text-xl font-semibold">{gradingResult.marksAwarded}/{assignment.max_marks}</p>
                  </div>
                </div>

                {/* Effort and Confidence */}
                <div className="flex gap-2">
                  {getEffortBadge(gradingResult.effort)}
                  {getConfidenceBadge(gradingResult.confidence)}
                </div>

                <Separator />

                {/* Strengths */}
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

                {/* Areas for Improvement */}
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

                {/* Next Steps */}
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

                {/* Detailed Feedback */}
                <div>
                  <h4 className="font-semibold mb-2">Detailed Feedback</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {gradingResult.detailedFeedback}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Gradings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Recent AI Gradings
              </CardTitle>
              <CardDescription>Previously graded submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSaved ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              ) : savedGradings.length > 0 ? (
                <div className="space-y-3">
                  {savedGradings.map((grading) => (
                    <div key={grading.id} className="p-3 border rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{grading.title}</h5>
                          <p className="text-xs text-muted-foreground">
                            {grading.subject} • {grading.year_group}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(grading.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSavedGrading(grading.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No saved gradings yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};