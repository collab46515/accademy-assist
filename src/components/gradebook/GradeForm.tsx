import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Calculator } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGradingData } from "@/hooks/useGradingData";
import { useToast } from "@/hooks/use-toast";

interface GradeFormProps {
  studentId?: string;
  onSuccess?: () => void;
}

export const GradeForm: React.FC<GradeFormProps> = ({ studentId, onSuccess }) => {
  const { createGrade, calculateGrade } = useGradingData();
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [calculatedGrade, setCalculatedGrade] = React.useState<{ letter: string; points: number } | null>(null);
  
  const score = watch('score');
  const yearGroup = watch('year_group');
  const subject = watch('subject');

  React.useEffect(() => {
    if (score && yearGroup && subject) {
      const result = calculateGrade(Number(score), yearGroup, subject);
      setCalculatedGrade(result);
      setValue('grade', result.letter);
    }
  }, [score, yearGroup, subject, calculateGrade, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await createGrade({
        student_id: studentId || data.student_id,
        student_name: data.student_name,
        subject: data.subject,
        assessment_name: data.assessment_name,
        assessment_type: data.assessment_type || 'summative',
        score: Number(data.score),
        max_score: Number(data.max_score) || 100,
        grade: data.grade,
        effort: data.effort,
        comments: data.comments,
        date_recorded: data.date_recorded,
        term: data.term,
        teacher_id: 'TCH001', // This would come from auth
        year_group: data.year_group,
        weight: Number(data.weight) || 1.0
      });
      
      toast({
        title: "Grade Added",
        description: "The grade has been successfully recorded.",
      });
      
      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add grade. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Grade</DialogTitle>
          <DialogDescription>
            Record a new assessment grade with automatic grade calculation
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_name">Student Name</Label>
              <Input
                id="student_name"
                {...register('student_name', { required: true })}
                placeholder="Enter student name"
              />
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={(value) => setValue('subject', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="PE">Physical Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year_group">Year Group</Label>
              <Select onValueChange={(value) => setValue('year_group', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Year 7">Year 7</SelectItem>
                  <SelectItem value="Year 8">Year 8</SelectItem>
                  <SelectItem value="Year 9">Year 9</SelectItem>
                  <SelectItem value="Year 10">Year 10</SelectItem>
                  <SelectItem value="Year 11">Year 11</SelectItem>
                  <SelectItem value="Year 12">Year 12</SelectItem>
                  <SelectItem value="Year 13">Year 13</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="term">Term</Label>
              <Select onValueChange={(value) => setValue('term', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Autumn Term">Autumn Term</SelectItem>
                  <SelectItem value="Spring Term">Spring Term</SelectItem>
                  <SelectItem value="Summer Term">Summer Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessment_name">Assessment Name</Label>
              <Input
                id="assessment_name"
                {...register('assessment_name', { required: true })}
                placeholder="e.g., Mid-term Exam"
              />
            </div>

            <div>
              <Label htmlFor="assessment_type">Assessment Type</Label>
              <Select onValueChange={(value) => setValue('assessment_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summative">Summative</SelectItem>
                  <SelectItem value="formative">Formative</SelectItem>
                  <SelectItem value="coursework">Coursework</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                {...register('score', { required: true, min: 0 })}
                placeholder="85"
              />
            </div>

            <div>
              <Label htmlFor="max_score">Max Score</Label>
              <Input
                id="max_score"
                type="number"
                {...register('max_score')}
                placeholder="100"
                defaultValue="100"
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                {...register('weight')}
                placeholder="1.0"
                defaultValue="1.0"
              />
            </div>
          </div>

          {calculatedGrade && (
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculated Grade
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-lg font-bold">
                    {calculatedGrade.letter}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {calculatedGrade.points} points
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="effort">Effort Level</Label>
            <Select onValueChange={(value) => setValue('effort', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select effort level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="satisfactory">Satisfactory</SelectItem>
                <SelectItem value="needs improvement">Needs Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comments">Teacher Comments</Label>
            <Textarea
              id="comments"
              {...register('comments')}
              placeholder="Enter detailed feedback for the student..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="date_recorded">Date Recorded</Label>
            <Input
              id="date_recorded"
              type="date"
              {...register('date_recorded', { required: true })}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Grade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};