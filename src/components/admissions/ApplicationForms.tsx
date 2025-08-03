import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnrollmentForm } from '@/components/enrollment/EnrollmentForm';
import { PathwayType, pathwayConfig } from '@/lib/enrollment-schemas';
import { supabase } from "@/integrations/supabase/client";

// Form schemas for each pathway
const standardDigitalSchema = z.object({
  // Student Information
  studentName: z.string().min(2, "Student name is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  nationality: z.string().min(2, "Nationality is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  yearGroup: z.string().min(1, "Year group is required"),
  studentEmail: z.string().email().optional(),
  studentPhone: z.string().optional(),
  
  // Parent/Guardian Information
  parentName: z.string().min(2, "Parent/Guardian name is required"),
  parentEmail: z.string().email("Valid email is required"),
  parentPhone: z.string().min(10, "Phone number is required"),
  parentRelationship: z.string().default("Parent"),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
  
  // Address Information
  homeAddress: z.string().min(10, "Full address is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().default("United Kingdom"),
  
  // Academic Information
  previousSchool: z.string().min(2, "Previous school is required"),
  currentYearGroup: z.string().min(1, "Current year group is required"),
  academicNotes: z.string().optional(),
  specialRequirements: z.string().optional(),
  medicalInformation: z.string().optional(),
  
  // Preferences
  housePreference: z.string().optional(),
  
  // Additional Information
  reasonForApplication: z.string().min(10, "Please explain why you're applying"),
  
  // Declarations
  accuracyDeclaration: z.boolean().refine(val => val === true, "You must confirm accuracy"),
  marketingConsent: z.boolean().default(false),
  dataProcessingConsent: z.boolean().refine(val => val === true, "Data processing consent is required")
});

const siblingEnrollmentSchema = z.object({
  // Student Information
  studentName: z.string().min(2, "Student name is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  yearGroup: z.string().min(1, "Year group is required"),
  
  // Sibling Information
  siblingStudentId: z.string().min(1, "Please select the sibling"),
  siblingName: z.string().min(2, "Sibling name is required"),
  siblingYearGroup: z.string().min(1, "Sibling's year group is required"),
  
  // Parent Information (pre-filled from sibling record)
  parentName: z.string().min(2, "Parent name is required"),
  parentEmail: z.string().email("Valid email is required"),
  parentPhone: z.string().min(10, "Phone number is required"),
  
  // Medical Information
  medicalInformation: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  
  // Preferences
  sameHousePlacement: z.boolean().default(true),
  sameTransportArrangement: z.boolean().default(true),
  
  // Declarations
  accuracyDeclaration: z.boolean().refine(val => val === true, "You must confirm accuracy"),
  siblingConfirmation: z.boolean().refine(val => val === true, "You must confirm sibling relationship")
});

const staffChildSchema = z.object({
  // Student Information
  studentName: z.string().min(2, "Student name is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  yearGroup: z.string().min(1, "Year group is required"),
  
  // Staff Information
  staffMemberName: z.string().min(2, "Staff member name is required"),
  staffEmployeeId: z.string().min(1, "Employee ID is required"),
  staffDepartment: z.string().min(2, "Department is required"),
  staffPosition: z.string().min(2, "Position is required"),
  staffStartDate: z.date({ required_error: "Employment start date is required" }),
  relationshipToStudent: z.string().min(2, "Relationship to student is required"),
  
  // Contact Information
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(10, "Phone number is required"),
  homeAddress: z.string().min(10, "Full address is required"),
  
  // Student Details
  medicalInformation: z.string().optional(),
  specialRequirements: z.string().optional(),
  previousSchool: z.string().optional(),
  
  // Fee Information
  feeWaiverRequested: z.boolean().default(true),
  feeWaiverJustification: z.string().optional(),
  
  // Declarations
  employmentConfirmation: z.boolean().refine(val => val === true, "Employment confirmation required"),
  accuracyDeclaration: z.boolean().refine(val => val === true, "Accuracy declaration required")
});

const emergencyEnrollmentSchema = z.object({
  // Student Information
  studentName: z.string().min(2, "Student name is required"),
  dateOfBirth: z.date().optional(),
  estimatedAge: z.number().min(3).max(18).optional(),
  yearGroup: z.string().min(1, "Year group is required"),
  gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  
  // Referral Information
  referralSource: z.enum(["social_services", "local_authority", "police", "nhs", "charity", "other"]),
  referralSourceDetails: z.string().min(2, "Referral source details required"),
  referrerName: z.string().min(2, "Referrer name is required"),
  referrerContact: z.string().min(10, "Referrer contact is required"),
  urgencyLevel: z.enum(["immediate", "within_24h", "within_week"]),
  
  // Safeguarding Information
  safeguardingConcerns: z.string().min(10, "Safeguarding concerns must be detailed"),
  riskAssessment: z.string().min(10, "Risk assessment is required"),
  supportNeeds: z.string().min(10, "Support needs must be outlined"),
  
  // Current Situation
  currentAccommodation: z.string().min(2, "Current accommodation status required"),
  careStatus: z.enum(["looked_after", "care_leaver", "child_in_need", "refugee", "asylum_seeker", "other"]),
  socialWorkerName: z.string().optional(),
  socialWorkerContact: z.string().optional(),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, "Emergency contact is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
  
  // Additional Information
  languageSupport: z.string().optional(),
  medicalNeeds: z.string().optional(),
  previousEducation: z.string().optional(),
  
  // Declarations
  informationAccuracy: z.boolean().refine(val => val === true, "Information accuracy confirmation required"),
  urgentPlacement: z.boolean().refine(val => val === true, "Urgent placement confirmation required")
});

const bulkImportSchema = z.object({
  // Operation Details
  operationName: z.string().min(2, "Operation name is required"),
  sourceSchool: z.string().min(2, "Source school is required"),
  partnershipType: z.enum(["feeder_school", "academy_trust", "formal_partnership", "one_off_transfer"]),
  expectedStudentCount: z.number().min(1, "Expected student count is required"),
  
  // Academic Year Information
  academicYear: z.string().min(4, "Academic year is required"),
  yearGroupMapping: z.string().min(2, "Year group mapping is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  
  // Data Source
  dataSource: z.enum(["csv_upload", "mis_integration", "manual_entry"]),
  csvFile: z.instanceof(File).optional(),
  
  // Contact Information
  coordinatorName: z.string().min(2, "Coordinator name is required"),
  coordinatorEmail: z.string().email("Valid email is required"),
  coordinatorPhone: z.string().min(10, "Phone number is required"),
  
  // Additional Settings
  autoApprove: z.boolean().default(false),
  requireParentConfirmation: z.boolean().default(true),
  generateWelcomeLetters: z.boolean().default(true),
  
  // Declarations
  dataAccuracy: z.boolean().refine(val => val === true, "Data accuracy confirmation required"),
  authorizedTransfer: z.boolean().refine(val => val === true, "Transfer authorization required")
});

interface ApplicationFormProps {
  pathway: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const StandardDigitalForm: React.FC<ApplicationFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof standardDigitalSchema>>({
    resolver: zodResolver(standardDigitalSchema),
    defaultValues: {
      country: "United Kingdom",
      parentRelationship: "Parent",
      marketingConsent: false,
      accuracyDeclaration: false,
      dataProcessingConsent: false
    }
  });

  const handleSubmit = (data: z.infer<typeof standardDigitalSchema>) => {
    onSubmit({
      pathway: "standard_digital",
      ...data
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Standard Digital Application</h2>
            <p className="text-muted-foreground">Complete online application process for external families</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Please provide details about the student applying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., British" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applying for Year Group *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Year 7">Year 7</SelectItem>
                          <SelectItem value="Year 8">Year 8</SelectItem>
                          <SelectItem value="Year 9">Year 9</SelectItem>
                          <SelectItem value="Year 10">Year 10</SelectItem>
                          <SelectItem value="Year 11">Year 11</SelectItem>
                          <SelectItem value="Year 12">Year 12 (6th Form)</SelectItem>
                          <SelectItem value="Year 13">Year 13 (6th Form)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="student@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 7700 900000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>Primary contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent/guardian name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Student</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                          <SelectItem value="Grandparent">Grandparent</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="parent@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 7700 900000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Alternative contact person</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 7700 900000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Grandmother" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full home address" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="SW1A 1AA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="previousSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous/Current School *</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of current school" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentYearGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Year Group *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Year 6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="academicNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any academic achievements, interests, or relevant information" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Educational Needs (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any special educational needs or support requirements" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalInformation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any medical conditions, allergies, or health information we should be aware of" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="housePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Preference (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select house preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Churchill">Churchill</SelectItem>
                        <SelectItem value="Darwin">Darwin</SelectItem>
                        <SelectItem value="Newton">Newton</SelectItem>
                        <SelectItem value="Shakespeare">Shakespeare</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reasonForApplication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Application *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Please explain why you are applying to our school and what you hope your child will gain from the experience" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Declarations */}
          <Card>
            <CardHeader>
              <CardTitle>Declarations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="accuracyDeclaration"
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
                        I declare that the information provided is accurate and complete *
                      </FormLabel>
                      <FormDescription>
                        You confirm that all information provided in this application is true and accurate to the best of your knowledge.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataProcessingConsent"
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
                        I consent to the processing of this data for admissions purposes *
                      </FormLabel>
                      <FormDescription>
                        Required for processing your application and communicating with you about the admissions process.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketingConsent"
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
                        I would like to receive news and updates from the school (Optional)
                      </FormLabel>
                      <FormDescription>
                        You can unsubscribe at any time.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export const SiblingEnrollmentForm: React.FC<ApplicationFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof siblingEnrollmentSchema>>({
    resolver: zodResolver(siblingEnrollmentSchema),
    defaultValues: {
      sameHousePlacement: true,
      sameTransportArrangement: true,
      accuracyDeclaration: false,
      siblingConfirmation: false
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-green-100 text-green-800 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Sibling Enrollment Application</h2>
            <p className="text-muted-foreground">Priority enrollment for siblings of current students</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit({ pathway: "sibling_automatic", ...data }))} className="space-y-8">
          {/* Sibling Information */}
          <Card>
            <CardHeader>
              <CardTitle>Current Student (Sibling) Information</CardTitle>
              <CardDescription>Information about the student already enrolled at the school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="siblingStudentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Student ID *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sibling" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ST001234">Emma Wilson - ST001234</SelectItem>
                          <SelectItem value="ST001567">James Smith - ST001567</SelectItem>
                          <SelectItem value="ST002890">Sarah Johnson - ST002890</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siblingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sibling's Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Current student's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siblingYearGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sibling's Year Group *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Year 9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* New Student Information */}
          <Card>
            <CardHeader>
              <CardTitle>New Student Information</CardTitle>
              <CardDescription>Information about the student applying for enrollment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applying for Year Group *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Year 7">Year 7</SelectItem>
                          <SelectItem value="Year 8">Year 8</SelectItem>
                          <SelectItem value="Year 9">Year 9</SelectItem>
                          <SelectItem value="Year 10">Year 10</SelectItem>
                          <SelectItem value="Year 11">Year 11</SelectItem>
                          <SelectItem value="Year 12">Year 12 (6th Form)</SelectItem>
                          <SelectItem value="Year 13">Year 13 (6th Form)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent Information (Pre-filled) */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>Pre-filled from existing sibling record - please verify</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medical & Health Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="medicalInformation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any medical conditions we should be aware of" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any known allergies" {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any regular medications" {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Placement Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Placement Preferences</CardTitle>
              <CardDescription>Options for sibling placement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="sameHousePlacement"
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
                        Place in same house as sibling (if possible)
                      </FormLabel>
                      <FormDescription>
                        We will attempt to place the student in the same house as their sibling.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sameTransportArrangement"
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
                        Use same transport arrangements as sibling
                      </FormLabel>
                      <FormDescription>
                        Apply the same bus route or transport arrangement as the current student.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Declarations */}
          <Card>
            <CardHeader>
              <CardTitle>Declarations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="siblingConfirmation"
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
                        I confirm the sibling relationship *
                      </FormLabel>
                      <FormDescription>
                        I confirm that the named students are siblings and that I have parental responsibility for both.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accuracyDeclaration"
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
                        I declare that the information provided is accurate and complete *
                      </FormLabel>
                      <FormDescription>
                        All information provided is true and accurate to the best of my knowledge.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Sibling Enrollment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Continue with other form components...