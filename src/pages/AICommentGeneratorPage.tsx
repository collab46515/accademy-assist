import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  FileText, 
  Settings,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedComment {
  id: string;
  studentName: string;
  subject: string;
  generatedText: string;
  status: "generated" | "approved" | "edited";
  confidence: number;
  timestamp: string;
}

const mockComments: GeneratedComment[] = [
  {
    id: "1",
    studentName: "Emma Thompson",
    subject: "Mathematics",
    generatedText: "Emma has shown excellent progress in algebra this term. Her problem-solving skills have improved significantly, and she demonstrates strong analytical thinking. She actively participates in class discussions and helps her peers understand complex concepts.",
    status: "approved",
    confidence: 94,
    timestamp: "2024-01-15 14:30"
  },
  {
    id: "2",
    studentName: "James Wilson",
    subject: "English Literature",
    generatedText: "James has made good progress in his essay writing this term. His analysis of character development has improved, though he would benefit from more detailed textual evidence in his arguments. His creative writing shows imagination and flair.",
    status: "edited",
    confidence: 89,
    timestamp: "2024-01-15 15:45"
  }
];

export const AICommentGeneratorPage = () => {
  const { toast } = useToast();
  const [comments] = useState(mockComments);
  const [commentPrompt, setCommentPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const getCommentStatusBadge = (status: GeneratedComment["status"]) => {
    switch (status) {
      case "generated":
        return <Badge variant="secondary">Generated</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "edited":
        return <Badge className="bg-warning text-warning-foreground">Edited</Badge>;
    }
  };

  const handleGenerateComment = async () => {
    if (!commentPrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter details about the student to generate a comment",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Comment Generated!",
        description: "AI-generated student comment is ready for review",
      });
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <span>AI Comment Generator</span>
          <Badge className="bg-warning text-warning-foreground">Beta</Badge>
        </h1>
        <p className="text-muted-foreground">Generate personalized student comments for reports and assessments using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comment Generation */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Generate Comment</span>
            </CardTitle>
            <CardDescription>AI-powered student comment generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Comment prompt:</label>
              <Textarea
                placeholder="Enter details about the student's performance, behavior, or achievements..."
                value={commentPrompt}
                onChange={(e) => setCommentPrompt(e.target.value)}
                rows={6}
              />
            </div>
            <Button 
              onClick={handleGenerateComment}
              disabled={generating}
              className="w-full shadow-[var(--shadow-elegant)]"
              size="lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Comment...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate AI Comment
                </>
              )}
            </Button>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Better Comments</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Include specific examples of student work or behavior</li>
                <li>• Mention subject area and learning objectives</li>
                <li>• Add context about class performance or progress</li>
                <li>• Specify the tone (encouraging, constructive, celebratory)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Recent Comments</span>
            </CardTitle>
            <CardDescription>AI-generated comments awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.studentName}</p>
                      <p className="text-sm text-muted-foreground">{comment.subject}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{comment.confidence}%</span>
                      {getCommentStatusBadge(comment.status)}
                    </div>
                  </div>
                  <p className="text-sm">{comment.generatedText}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline">Copy</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings & Configuration */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Comment Generation Settings</span>
          </CardTitle>
          <CardDescription>Configure AI comment generation preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Tone & Style</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Professional and constructive</li>
                <li>• Age-appropriate language</li>
                <li>• Balanced feedback approach</li>
                <li>• Encouraging and supportive</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Content Focus</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Academic progress and achievement</li>
                <li>• Social and behavioral aspects</li>
                <li>• Areas for improvement</li>
                <li>• Next steps and recommendations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Quality Assurance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Grammar and spelling check</li>
                <li>• Appropriate length (50-150 words)</li>
                <li>• Personalized content</li>
                <li>• Review before approval</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};