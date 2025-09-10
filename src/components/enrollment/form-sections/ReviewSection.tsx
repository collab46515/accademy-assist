import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';
import { format } from 'date-fns';

export function ReviewSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form } = formHook;
  const formData = form.getValues() as any; // Use any to handle different pathway schemas

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review all the information below before submitting your application.
        </p>
      </div>

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Student Information
            <Badge variant="outline">Step 1</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.student_name || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.student_email || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formData.student_phone || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span> {formData.date_of_birth ? format(formData.date_of_birth, 'PPP') : 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Gender:</span> {formData.gender || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Nationality:</span> {formData.nationality || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Year Group:</span> {formData.year_group || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Previous School:</span> {formData.previous_school || 'Not provided'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Parent/Guardian Information
            <Badge variant="outline">Step 2</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.parent_name || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.parent_email || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formData.parent_phone || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Relationship:</span> {formData.parent_relationship || 'Parent'}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Address:</span> {formData.home_address || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">PIN Code:</span> {formData.postal_code || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Country:</span> {formData.country || 'Not provided'}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-medium">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {formData.emergency_contact_name || 'Not provided'}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {formData.emergency_contact_phone || 'Not provided'}
              </div>
              <div>
                <span className="font-medium">Relationship:</span> {formData.emergency_contact_relationship || 'Not provided'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical & SEN Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Medical & Special Educational Needs
            <Badge variant="outline">Step 3</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Medical Information:</span>
              <p className="mt-1 text-muted-foreground">
                {formData.medical_information || 'No medical information provided'}
              </p>
            </div>
            <div>
              <span className="font-medium">Special Requirements:</span>
              <p className="mt-1 text-muted-foreground">
                {formData.special_requirements || 'No special requirements noted'}
              </p>
            </div>
            <div>
              <span className="font-medium">Assessment Required:</span> {formData.assessment_required ? 'Yes' : 'No'}
            </div>
            
            {pathway === 'sen' && (
              <>
                <Separator />
                <div>
                  <span className="font-medium">SEN Status:</span> {formData.sen_status || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Current SEN Provision:</span>
                  <p className="mt-1 text-muted-foreground">
                    {formData.current_sen_provision || 'Not provided'}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Consent Section */}
      <Card>
        <CardHeader>
          <CardTitle>Consent & Data Protection</CardTitle>
          <CardDescription>
            Please read and confirm the following consents before submitting your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="data_protection_consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Data Protection Consent *
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    I consent to the school processing and storing the personal data provided in this application 
                    for the purpose of student admission and school administration, in accordance with applicable 
                    data protection laws.
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketing_consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Marketing Communications (Optional)
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    I would like to receive updates about school events, news, and other relevant information 
                    via email and other communication channels.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}