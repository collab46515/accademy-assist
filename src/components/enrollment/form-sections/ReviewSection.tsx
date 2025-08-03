import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FileText, Clock, AlertCircle, User, Mail, Phone, MapPin } from 'lucide-react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';

export function ReviewSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form, config } = formHook;
  
  const formData = form.getValues() as any; // Type assertion for easier access

  // Type-safe accessors for different pathways
  const getStudentName = () => {
    if (pathway === 'emergency') {
      return `${formData.student_first_name || ''} ${formData.student_last_name || ''}`.trim();
    }
    return formData.student_name || '';
  };

  const getDateOfBirth = () => {
    if (pathway === 'emergency') {
      return formData.student_dob;
    }
    return formData.date_of_birth;
  };

  const getGender = () => {
    if (pathway === 'emergency') {
      return formData.student_gender;
    }
    return formData.gender;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Review & Submit</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Application Summary</h4>
            <p className="text-sm text-blue-700 mt-1">
              Please review all information carefully before submitting. You can still make changes by going back to previous steps.
            </p>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Pathway:</span>
            <Badge variant="outline">{config.name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Application Type:</span>
            <span className="text-sm">{config.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant="secondary">Draft</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Name:</span>
            <span className="text-sm">{getStudentName()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Date of Birth:</span>
            <span className="text-sm">
              {getDateOfBirth() ? new Date(getDateOfBirth()).toLocaleDateString() : 'Not provided'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Gender:</span>
            <span className="text-sm">{getGender() || 'Not specified'}</span>
          </div>
          {pathway !== 'emergency' && (
            <>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Year Group:</span>
                <span className="text-sm">{formData.year_group}</span>
              </div>
              {formData.nationality && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nationality:</span>
                  <span className="text-sm">{formData.nationality}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      {pathway === 'emergency' ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Referral Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Source Type:</span>
              <span className="text-sm">{formData.referral_source_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Contact Name:</span>
              <span className="text-sm">{formData.referral_source_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{formData.referral_source_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-sm">{formData.referral_source_phone}</span>
            </div>
          </CardContent>
        </Card>
      ) : pathway === 'staff_child' ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Staff Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Staff Name:</span>
              <span className="text-sm">{formData.staff_member_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Staff ID:</span>
              <span className="text-sm">{formData.staff_member_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Department:</span>
              <span className="text-sm">{formData.staff_member_department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Role:</span>
              <span className="text-sm">{formData.staff_member_role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Relationship:</span>
              <span className="text-sm">{formData.relationship_to_staff}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Parent/Guardian Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{formData.parent_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{formData.parent_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-sm">{formData.parent_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Relationship:</span>
              <span className="text-sm">{formData.parent_relationship}</span>
            </div>
            {formData.home_address && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Address:</span>
                <span className="text-sm text-right">{formData.home_address}, {formData.postal_code}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Name:</span>
            <span className="text-sm">{formData.emergency_contact_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Phone:</span>
            <span className="text-sm">{formData.emergency_contact_phone}</span>
          </div>
          {formData.emergency_contact_relationship && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Relationship:</span>
              <span className="text-sm">{formData.emergency_contact_relationship}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Special Information */}
      {pathway === 'sen' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEN Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">SEN Status:</span>
              <Badge variant={formData.sen_status === 'EHCP' ? 'default' : 'secondary'}>
                {formData.sen_status}
              </Badge>
            </div>
            {formData.ehcp_number && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">EHCP Number:</span>
                <span className="text-sm">{formData.ehcp_number}</span>
              </div>
            )}
            {formData.current_sen_provision && (
              <div>
                <span className="text-sm font-medium">Current Provision:</span>
                <p className="text-sm mt-1 text-muted-foreground">{formData.current_sen_provision}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {pathway === 'emergency' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Urgent Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {formData.urgent_needs_uniform && <Badge variant="destructive" className="justify-center">Uniform</Badge>}
              {formData.urgent_needs_meals && <Badge variant="destructive" className="justify-center">Meals</Badge>}
              {formData.urgent_needs_device && <Badge variant="destructive" className="justify-center">Device</Badge>}
              {formData.urgent_needs_transport && <Badge variant="destructive" className="justify-center">Transport</Badge>}
              {formData.urgent_needs_counselling && <Badge variant="destructive" className="justify-center">Counselling</Badge>}
            </div>
            {!Object.values({
              uniform: formData.urgent_needs_uniform,
              meals: formData.urgent_needs_meals,
              device: formData.urgent_needs_device,
              transport: formData.urgent_needs_transport,
              counselling: formData.urgent_needs_counselling
            }).some(Boolean) && (
              <p className="text-sm text-muted-foreground">No urgent needs identified</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Medical Information */}
      {(formData.medical_information || formData.special_requirements) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medical & Special Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.medical_information && (
              <div>
                <span className="text-sm font-medium">Medical Information:</span>
                <p className="text-sm mt-1 text-muted-foreground">{formData.medical_information}</p>
              </div>
            )}
            {formData.special_requirements && (
              <div>
                <span className="text-sm font-medium">Special Requirements:</span>
                <p className="text-sm mt-1 text-muted-foreground">{formData.special_requirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Consent and Declaration */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-base">Declaration & Consent</CardTitle>
          <CardDescription>
            By submitting this application, I confirm that:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
            <li>All information provided is accurate and complete to the best of my knowledge</li>
            <li>I understand that providing false information may result in the application being rejected</li>
            <li>I consent to the school processing this information for admission purposes</li>
            <li>I understand the school's data protection and privacy policies</li>
            {pathway === 'emergency' && (
              <li>I consent to urgent placement procedures and understand safeguarding protocols will be followed</li>
            )}
            {pathway === 'staff_child' && (
              <li>I confirm my employment status and understand staff discount policies</li>
            )}
          </ul>
          
          <Separator />
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Ready to Submit</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your application is complete and ready for submission. You'll receive a confirmation email once submitted.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}