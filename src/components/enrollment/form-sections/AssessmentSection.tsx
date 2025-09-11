import React from 'react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen } from 'lucide-react';

export function AssessmentSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Assessment & Interview</h2>
        <p className="text-muted-foreground">
          Information about assessment requirements and interview preferences
        </p>
      </div>

      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="assessment_required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Assessment Required</FormLabel>
                <FormDescription>
                  Check this if the student requires an academic assessment
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="special_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment & Academic Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide any information about the student's academic interests, learning style, assessment preferences, or special requirements for the assessment process..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This information helps us prepare appropriate assessments and interviews
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Assessment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Assessment Duration</p>
              <p className="text-sm text-muted-foreground">
                Typically 1-2 hours depending on the assessment type
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">What to Expect</p>
              <p className="text-sm text-muted-foreground">
                The assessment may include academic questions, problem-solving tasks, and a brief interview
              </p>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              We will contact you within 2-3 business days to schedule the assessment and provide additional details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}