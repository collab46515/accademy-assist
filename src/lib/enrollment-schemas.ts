import { z } from "zod";

// Common validation schemas
const ukPhoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
const emailSchema = z.string().email("Please enter a valid email address");
const ukPhoneSchema = z.string().regex(ukPhoneRegex, "Please enter a valid UK phone number");
const postcodeSchema = z.string().regex(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, "Please enter a valid UK postcode");

// Base student schema
const baseStudentSchema = z.object({
  student_name: z.string().min(2, "Student name is required"),
  student_email: z.string().email().optional().or(z.literal("")),
  student_phone: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  year_group: z.string().min(1, "Year group is required"),
  date_of_birth: z.date().optional(),
});

// Base parent schema
const baseParentSchema = z.object({
  parent_name: z.string().min(2, "Parent/guardian name is required"),
  parent_email: emailSchema,
  parent_phone: z.string().regex(/^(\+91\s?[6-9]\d{9}|\+91\d{10})$/, "Please enter a valid Indian phone number"),
  parent_aadhaar: z.string().optional().refine((val) => !val || /^\d{4}\s?\d{4}\s?\d{4}$/.test(val), "Please enter a valid 12-digit Aadhaar number"),
  parent_pan: z.string().optional().refine((val) => !val || /^[A-Z]{5}\d{4}[A-Z]$/.test(val), "Please enter a valid 10-character PAN number"),
  parent_relationship: z.string().default("Parent"),
  home_address: z.string().min(10, "Please enter a full address"),
  postal_code: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
});

// Emergency contact schema
const emergencyContactSchema = z.object({
  emergency_contact_name: z.string().min(2, "Emergency contact name is required"),
  emergency_contact_phone: z.string().regex(/^(\+91\s?[6-9]\d{9}|\+91\d{10})$/, "Please enter a valid Indian phone number"),
  emergency_contact_relationship: z.string().min(1, "Relationship is required"),
});

// Standard Admission Schema
const standardAdmissionSchema = z.object({
  // Student details
  ...baseStudentSchema.shape,
  previous_school: z.string().optional(),
  current_year_group: z.string().optional(),
  
  // Parent details
  ...baseParentSchema.shape,
  ...emergencyContactSchema.shape,
  
  // Additional fields
  house_preference: z.string().optional(),
  form_class_preference: z.string().optional(),
  academic_notes: z.string().optional(),
  special_requirements: z.string().optional(),
  medical_information: z.string().optional(),
  
  // Sibling information
  sibling_student_id: z.string().optional(),
  
  // Assessment
  assessment_required: z.boolean().default(true),
  
  // Fees
  fee_status: z.enum(["full_fees", "bursary", "scholarship"]).default("full_fees"),
  bursary_application: z.boolean().default(false),
  scholarship_application: z.boolean().default(false),
  
  // Consent
  data_protection_consent: z.boolean().refine(val => val === true, "Data protection consent is required"),
  marketing_consent: z.boolean().default(false),
});

// SEN Admission Schema
const senAdmissionSchema = standardAdmissionSchema.extend({
  // SEN specific fields
  sen_status: z.enum(["EHCP", "SEN Support", "None"]),
  ehcp_number: z.string().optional(),
  ehcp_expiry_date: z.date().optional(),
  current_sen_provision: z.string().optional(),
  sen_assessment_reports: z.boolean().default(false),
  
  // Additional support
  mobility_requirements: z.string().optional(),
  communication_needs: z.string().optional(),
  learning_support_needs: z.string().optional(),
  behaviour_support_needs: z.string().optional(),
  
  // Professionals
  senco_contact_name: z.string().optional(),
  senco_contact_email: z.string().email().optional().or(z.literal("")),
  senco_contact_phone: z.string().optional(),
  educational_psychologist: z.string().optional(),
  
  // Previous schools
  previous_sen_school: z.string().optional(),
  sen_transition_notes: z.string().optional(),
});

// Staff Child Schema
const staffChildSchema = z.object({
  // Student details
  ...baseStudentSchema.shape,
  
  // Staff details
  staff_member_id: z.string().min(1, "Staff member ID is required"),
  staff_member_name: z.string().min(2, "Staff member name is required"),
  staff_member_email: emailSchema,
  staff_member_department: z.string().min(1, "Department is required"),
  staff_member_role: z.string().min(1, "Role is required"),
  
  // Relationship
  relationship_to_staff: z.enum(["Child", "Stepchild", "Adopted child", "Guardian"]),
  
  // Simplified fields
  emergency_contact_name: z.string().min(2, "Emergency contact name is required"),
  emergency_contact_phone: ukPhoneSchema,
  medical_information: z.string().optional(),
  
  // Consent
  staff_discount_applied: z.boolean().default(true),
  data_protection_consent: z.boolean().refine(val => val === true, "Data protection consent is required"),
});

// Emergency Enrollment Schema
const emergencyEnrollmentSchema = z.object({
  // Student details
  student_first_name: z.string().min(1, "First name is required"),
  student_last_name: z.string().min(1, "Last name is required"),
  student_dob: z.date(),
  student_gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  student_known_risks: z.string().optional(),
  student_immigration_status: z.string().optional(),
  student_visa_status: z.string().optional(),
  
  // Referral information
  referral_source_type: z.enum(["Social Worker", "LA", "DSL", "Charity", "Other"]),
  referral_source_name: z.string().min(2, "Referral source name is required"),
  referral_source_email: emailSchema,
  referral_source_phone: ukPhoneSchema,
  referral_date: z.date(),
  
  // Urgent needs
  urgent_needs_uniform: z.boolean().default(false),
  urgent_needs_meals: z.boolean().default(false),
  urgent_needs_device: z.boolean().default(false),
  urgent_needs_transport: z.boolean().default(false),
  urgent_needs_counselling: z.boolean().default(false),
  
  // Safeguarding
  safeguarding_has_been_in_care: z.boolean().default(false),
  safeguarding_subject_to_child_protection_plan: z.boolean().default(false),
  safeguarding_referral_document: z.boolean().default(false),
  
  // Assignments
  assigned_dsl_id: z.string().optional(),
  assigned_form_tutor_id: z.string().optional(),
  assigned_house: z.string().optional(),
  
  // Consent
  consent_urgent_placement_declaration: z.boolean().refine(val => val === true, "Urgent placement consent is required"),
});

// Bulk Import Schema
const bulkImportSchema = z.object({
  // CSV upload
  csv_file: z.instanceof(File).optional(),
  
  // Field mapping
  map_first_name_to: z.string().min(1, "First name mapping is required"),
  map_last_name_to: z.string().min(1, "Last name mapping is required"),
  map_dob_to: z.string().min(1, "Date of birth mapping is required"),
  map_gender_to: z.string().optional(),
  map_sen_status_to: z.string().optional(),
  map_eal_level_to: z.string().optional(),
  
  // Default values
  default_year_group_assigned: z.string().min(1, "Default year group is required"),
  default_house_assigned: z.string().optional(),
  
  // Options
  send_parent_welcome_email: z.boolean().default(true),
  
  // Consent
  bulk_import_consent: z.boolean().refine(val => val === true, "Bulk import consent is required"),
});

// Internal Progression Schema
const internalProgressionSchema = z.object({
  current_academic_year: z.string().min(1, "Current academic year is required"),
  target_academic_year: z.string().min(1, "Target academic year is required"),
  current_year_group: z.string().min(1, "Current year group is required"),
  target_year_group: z.string().min(1, "Target year group is required"),
  
  // Student lists
  students_to_exclude: z.array(z.string()).default([]),
  sen_students_requiring_review: z.array(z.string()).default([]),
  eal_students_requiring_review: z.array(z.string()).default([]),
  
  // Options
  generate_ks4_option_forms: z.boolean().default(false),
  notify_parents_via_email: z.boolean().default(true),
  
  // Approval
  promotion_initiated_by: z.string().min(1, "Initiator is required"),
  promotion_approved_by: z.string().optional(),
  promotion_execution_date: z.date(),
  
  // Consent
  progression_consent: z.boolean().refine(val => val === true, "Progression consent is required"),
});

// Main discriminated union schema
export const enrollmentFormSchema = z.discriminatedUnion("pathway", [
  z.object({ pathway: z.literal("standard"), ...standardAdmissionSchema.shape }),
  z.object({ pathway: z.literal("sen"), ...senAdmissionSchema.shape }),
  z.object({ pathway: z.literal("staff_child"), ...staffChildSchema.shape }),
  z.object({ pathway: z.literal("emergency"), ...emergencyEnrollmentSchema.shape }),
  z.object({ pathway: z.literal("bulk_import"), ...bulkImportSchema.shape }),
  z.object({ pathway: z.literal("internal_progression"), ...internalProgressionSchema.shape }),
]);

export type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;

// Individual schema exports for type inference
export type StandardAdmissionData = z.infer<typeof standardAdmissionSchema>;
export type SENAdmissionData = z.infer<typeof senAdmissionSchema>;
export type StaffChildData = z.infer<typeof staffChildSchema>;
export type EmergencyEnrollmentData = z.infer<typeof emergencyEnrollmentSchema>;
export type BulkImportData = z.infer<typeof bulkImportSchema>;
export type InternalProgressionData = z.infer<typeof internalProgressionSchema>;

// Pathway configuration
export const pathwayConfig = {
  standard: {
    name: "Standard Admission",
    description: "Regular admission process with assessment",
    steps: ["Student Details", "Parent Details", "Medical & SEN", "Documents", "Assessment", "Review"],
    totalSteps: 6,
  },
  sen: {
    name: "SEN Admission", 
    description: "Special Educational Needs admission pathway",
    steps: ["Student Details", "SEN Information", "Support Needs", "Professional Contacts", "Documents", "Review"],
    totalSteps: 6,
  },
  staff_child: {
    name: "Staff Child",
    description: "Streamlined admission for staff children",
    steps: ["Student Details", "Staff Information", "Emergency Contact", "Review"],
    totalSteps: 4,
  },
  emergency: {
    name: "Emergency Enrollment",
    description: "Urgent placement with safeguarding priority",
    steps: ["Student Details", "Referral Information", "Safeguarding", "Urgent Needs", "Review"],
    totalSteps: 5,
  },
  bulk_import: {
    name: "Bulk Import",
    description: "Mass upload via CSV with field mapping",
    steps: ["Upload CSV", "Map Fields", "Default Values", "Review"],
    totalSteps: 4,
  },
  internal_progression: {
    name: "Internal Progression",
    description: "Year group transitions for existing students",
    steps: ["Academic Years", "Student Selection", "Review Lists", "Approval"],
    totalSteps: 4,
  },
} as const;

export type PathwayType = keyof typeof pathwayConfig;