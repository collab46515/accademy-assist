import { z } from "zod";

// Common validation schemas
const phoneRegex = /^(\+91\s?[6-9]\d{9}|\+91\d{10}|[6-9]\d{9})$/;
const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z.string().regex(phoneRegex, "Please enter a valid Indian phone number");
const postcodeSchema = z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code");

// Base student schema - Anand Niketan fields
const baseStudentSchema = z.object({
  student_name: z.string().min(2, "Student name is required"),
  date_of_birth: z.date({ required_error: "Date of birth is required" })
    .refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      
      // Calculate precise age
      const preciseAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
      
      return preciseAge >= 2 && preciseAge <= 25;
    }, {
      message: "Student must be between 2 and 25 years old"
    }),
  mother_tongue: z.string().min(1, "Mother tongue is required"),
  state: z.string().min(1, "State is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  blood_group: z.string().min(1, "Blood group is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().optional().or(z.literal("")),
  apar_id: z.string().min(1, "APAR ID is required"),
  caste: z.string().optional().or(z.literal("")),
  caste_classification: z.string().optional().or(z.literal("")),
  aadhaar_number: z.string().optional().or(z.literal("")),
  ration_card_number: z.string().optional().or(z.literal("")),
  udise_number: z.string().optional().or(z.literal("")),
  food_choice: z.string().min(1, "Food choice is required"),
  chronic_diseases: z.string().min(1, "Please specify chronic diseases or enter 'None'"),
  medicine_treatment: z.string().min(1, "Please specify if taking any medicine"),
  year_group: z.string().min(1, "Year group is required"),
});

// Family Details Schema - Anand Niketan
const familyDetailsSchema = z.object({
  // Father Details
  father_name: z.string().min(2, "Father's name is required"),
  father_profession: z.string().min(1, "Father's profession is required"),
  father_mobile: phoneSchema,
  father_email: emailSchema,
  father_monthly_income: z.string().min(1, "Father's monthly income is required"),
  father_organization: z.string().min(1, "Organization employed is required"),
  
  // Mother Details
  mother_name: z.string().min(2, "Mother's name is required"),
  mother_profession: z.string().min(1, "Mother's profession is required"),
  mother_mobile: phoneSchema,
  mother_email: emailSchema,
  mother_monthly_income: z.string().min(1, "Mother's monthly income is required"),
  mother_organization: z.string().min(1, "Organization employed is required"),
  
  // Guardian Details (Optional)
  guardian_name: z.string().optional().or(z.literal("")),
  guardian_profession: z.string().optional().or(z.literal("")),
  guardian_mobile: z.string().optional().or(z.literal("")),
  guardian_email: z.string().optional().or(z.literal("")),
  guardian_monthly_income: z.string().optional().or(z.literal("")),
  guardian_organization: z.string().optional().or(z.literal("")),
  
  // Sibling Information
  has_sibling_in_school: z.string().min(1, "Please select if child has siblings in school"),
  sibling_information: z.string().optional().or(z.literal("")),
});

// Address Schema - Permanent & Communication
const addressSchema = z.object({
  // Permanent Address
  permanent_house_no: z.string().min(1, "House no is required"),
  permanent_street: z.string().min(1, "Street is required"),
  permanent_city: z.string().min(1, "Town/City is required"),
  permanent_district: z.string().min(1, "District is required"),
  permanent_state: z.string().min(1, "State is required"),
  permanent_postal_code: postcodeSchema,
  
  // Communication Address
  communication_house_no: z.string().min(1, "House no is required"),
  communication_street: z.string().min(1, "Street is required"),
  communication_city: z.string().min(1, "Town/City is required"),
  communication_district: z.string().min(1, "District is required"),
  communication_state: z.string().min(1, "State is required"),
  communication_postal_code: postcodeSchema,
});

// Academic & Language Choice Schema
const academicChoiceSchema = z.object({
  class_last_studied: z.string().min(1, "Class last studied is required"),
  school_last_studied: z.string().optional().or(z.literal("")),
  class_seeking_admission: z.string().min(1, "Class for admission is required"),
  last_school_location: z.string().optional().or(z.literal("")),
  language_studied: z.string().min(1, "Language studied is required"),
  last_syllabus: z.string().optional().or(z.literal("")),
  group_first_choice: z.string().optional().or(z.literal("")),
  group_second_choice: z.string().optional().or(z.literal("")),
});

// References Schema
const referencesSchema = z.object({
  reference1_name: z.string().optional().or(z.literal("")),
  reference1_mobile: z.string().optional().or(z.literal("")),
  reference2_name: z.string().optional().or(z.literal("")),
  reference2_mobile: z.string().optional().or(z.literal("")),
});

// Standard Admission Schema - Anand Niketan Complete
const standardAdmissionSchema = z.object({
  // Student details
  ...baseStudentSchema.shape,
  
  // Family details
  ...familyDetailsSchema.shape,
  
  // Address details
  ...addressSchema.shape,
  
  // Academic & Language
  ...academicChoiceSchema.shape,
  
  // References
  ...referencesSchema.shape,
  
  // Consent & Declaration
  declaration_accepted: z.boolean().refine(val => val === true, "Declaration must be accepted"),
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
  emergency_contact_phone: phoneSchema,
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
  student_dob: z.date()
    .refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      
      // Calculate precise age
      const preciseAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
      
      return preciseAge >= 2 && preciseAge <= 25;
    }, {
      message: "Student must be between 2 and 25 years old"
    }),
  student_gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  student_known_risks: z.string().optional(),
  student_immigration_status: z.string().optional(),
  student_visa_status: z.string().optional(),
  
  // Referral information
  referral_source_type: z.enum(["Social Worker", "LA", "DSL", "Charity", "Other"]),
  referral_source_name: z.string().min(2, "Referral source name is required"),
  referral_source_email: emailSchema,
  referral_source_phone: phoneSchema,
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
    steps: ["Student Details", "Family Details", "Address Details", "Academic & Language", "References", "Documents", "Review"],
    totalSteps: 7,
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