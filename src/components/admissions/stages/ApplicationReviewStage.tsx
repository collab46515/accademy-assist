import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, User, GraduationCap, Award, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationReviewStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function ApplicationReviewStage({ applicationId, onMoveToNext }: ApplicationReviewStageProps) {
  const [academicScore, setAcademicScore] = useState([75]);
  const [behaviorScore, setBehaviorScore] = useState([80]);
  const [potentialScore, setPotentialScore] = useState([70]);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      console.log('Saving draft review:', {
        applicationId,
        academicScore: academicScore[0],
        behaviorScore: behaviorScore[0],
        potentialScore: potentialScore[0],
        reviewNotes,
        status: 'draft'
      });
      toast.success('Review draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting review:', {
        applicationId,
        academicScore: academicScore[0],
        behaviorScore: behaviorScore[0],
        potentialScore: potentialScore[0],
        reviewNotes,
        status: 'submitted'
      });
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewCriteria = [
    { id: 'academic_performance', label: 'Academic Performance', score: 75, reviewer: 'Dr. Smith', completed: true },
    { id: 'behavior_conduct', label: 'Behavior & Conduct', score: 80, reviewer: 'Ms. Johnson', completed: true },
    { id: 'leadership_potential', label: 'Leadership Potential', score: 70, reviewer: 'Mr. Wilson', completed: false },
    { id: 'extracurricular', label: 'Extracurricular Activities', score: 85, reviewer: 'Mrs. Brown', completed: true },
    { id: 'interview_performance', label: 'Interview Performance', score: null, reviewer: null, completed: false }
  ];

  const previousSchoolReports = [
    { subject: 'Mathematics', grade: 'A', year: '2023', teacher: 'Mr. Anderson' },
    { subject: 'English', grade: 'B+', year: '2023', teacher: 'Ms. Davis' },
    { subject: 'Science', grade: 'A-', year: '2023', teacher: 'Dr. Taylor' },
    { subject: 'History', grade: 'B', year: '2023', teacher: 'Mr. Roberts' }
  ];

  const references = [
    { 
      name: 'Mrs. Sarah Thompson', 
      role: 'Head Teacher', 
      school: 'Greenfield Primary School',
      recommendation: 'Excellent student with strong academic abilities and leadership qualities.',
      rating: 5
    },
    { 
      name: 'Mr. James Wilson', 
      role: 'Sports Coach', 
      school: 'Local Sports Club',
      recommendation: 'Outstanding team player with great dedication and sportsmanship.',
      rating: 4
    }
  ];

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

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
      {/* Review Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Review Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviewCriteria.map((criteria) => (
              <div key={criteria.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {criteria.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{criteria.label}</p>
                    {criteria.reviewer && (
                      <p className="text-sm text-muted-foreground">Reviewer: {criteria.reviewer}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {criteria.score !== null && (
                    <span className={`font-bold ${getScoreColor(criteria.score)}`}>
                      {criteria.score}/100
                    </span>
                  )}
                  <Badge variant={criteria.completed ? "default" : "secondary"}>
                    {criteria.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scoring">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="academics">Academic History</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="notes">Review Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScoreCard 
              title="Academic Performance" 
              score={academicScore} 
              onScoreChange={setAcademicScore} 
            />
            <ScoreCard 
              title="Behavior & Conduct" 
              score={behaviorScore} 
              onScoreChange={setBehaviorScore} 
            />
            <ScoreCard 
              title="Leadership Potential" 
              score={potentialScore} 
              onScoreChange={setPotentialScore} 
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round((academicScore[0] + behaviorScore[0] + potentialScore[0]) / 3)}
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  Overall Score
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="academics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Previous School Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previousSchoolReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.subject}</p>
                      <p className="text-sm text-muted-foreground">Teacher: {report.teacher}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{report.grade}</div>
                      <div className="text-sm text-muted-foreground">{report.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="references" className="space-y-4">
          {references.map((ref, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {ref.name}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < ref.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{ref.role} at {ref.school}</p>
                <p className="text-sm">{ref.recommendation}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Review Notes & Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Add your review notes and recommendations..."
                  rows={6}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
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
              <p className="font-medium">Ready to proceed to Assessment/Interview?</p>
              <p className="text-sm text-muted-foreground">
                Complete all review criteria before moving to the next stage.
              </p>
            </div>
            <Button onClick={onMoveToNext}>
              Move to Assessment/Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}