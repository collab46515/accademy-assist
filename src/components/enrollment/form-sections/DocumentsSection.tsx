import React from 'react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

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

      <p className="text-sm text-muted-foreground">
        Please ensure you have the following documents ready for submission
      </p>

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
              { name: "Child Passport Size Photo", required: true, description: "Recent passport size photograph of the child" },
              { name: "Birth Certificate", required: true, description: "Official birth certificate" },
              { name: "Aadhaar Copy / UID", required: true, description: "Copy of Aadhaar card or UID" },
              { name: "Community Certificate", required: true, description: "Valid community certificate" },
              { name: "Salary Certificate / Slip or Self Declaration of Income", required: true, description: "Latest salary slip or income declaration" },
              { name: "Organization Endorsement or Reference Letter", required: true, description: "Letter from current employer or reference" },
              { name: "Ration Card", required: false, description: "Copy of ration card (if applicable)" },
              { name: "Medical Certificate", required: false, description: "Medical fitness certificate (if applicable)" },
              { name: "Church Endorsement", required: false, description: "Church certificate or letter from pastor (if applicable)" },
              { name: "Transfer Certificate", required: false, description: "TC from previous school (if applicable)" },
              { name: "Migration Certificate", required: false, description: "Migration certificate (if applicable)" }
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