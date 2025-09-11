import React from 'react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function DocumentsSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Documents & Requirements</h2>
        <p className="text-muted-foreground">
          Information about required documents for the application
        </p>
      </div>

      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="academic_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Records & Previous School Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide details about the student's previous academic performance, any awards, achievements, or relevant academic information..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Documents Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "Birth Certificate", required: true, description: "Official copy required" },
              { name: "Passport Photos", required: true, description: "2 recent photos (within 6 months)" },
              { name: "Previous School Records", required: false, description: "Academic transcripts and reports" },
              { name: "Medical Records", required: false, description: "Including vaccination records" },
              { name: "Proof of Address", required: true, description: "Utility bill or bank statement" },
              { name: "Parent/Guardian ID", required: true, description: "Copy of valid identification" }
            ].map((doc, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${doc.required ? 'bg-destructive' : 'bg-muted-foreground'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{doc.name}</span>
                    {doc.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Document Submission</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Documents can be submitted during your scheduled visit or emailed to admissions@school.edu. 
              All documents should be clear, legible copies. Original documents may be required for verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}