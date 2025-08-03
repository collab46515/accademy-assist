export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      attendance_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          recipients: Json
          school_id: string
          sent_at: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          recipients: Json
          school_id: string
          sent_at?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          recipients?: Json
          school_id?: string
          sent_at?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: []
      }
      attendance_excuses: {
        Row: {
          attendance_record_id: string
          created_at: string
          excuse_reason: string
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          submitted_by: string
          supporting_document_url: string | null
          updated_at: string
        }
        Insert: {
          attendance_record_id: string
          created_at?: string
          excuse_reason: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          submitted_by: string
          supporting_document_url?: string | null
          updated_at?: string
        }
        Update: {
          attendance_record_id?: string
          created_at?: string
          excuse_reason?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          submitted_by?: string
          supporting_document_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          created_at: string
          date: string
          excuse_document_url: string | null
          excused_at: string | null
          excused_by: string | null
          id: string
          is_excused: boolean | null
          marked_at: string
          notes: string | null
          period: number | null
          reason: string | null
          school_id: string
          status: string
          student_id: string
          subject: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          excuse_document_url?: string | null
          excused_at?: string | null
          excused_by?: string | null
          id?: string
          is_excused?: boolean | null
          marked_at?: string
          notes?: string | null
          period?: number | null
          reason?: string | null
          school_id: string
          status: string
          student_id: string
          subject?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          excuse_document_url?: string | null
          excused_at?: string | null
          excused_by?: string | null
          id?: string
          is_excused?: boolean | null
          marked_at?: string
          notes?: string | null
          period?: number | null
          reason?: string | null
          school_id?: string
          status?: string
          student_id?: string
          subject?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance_records_hr: {
        Row: {
          break_duration: number | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          break_duration?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          break_duration?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_hr_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_settings: {
        Row: {
          alert_after_days: number | null
          attendance_mode: string | null
          auto_mark_weekends: boolean | null
          created_at: string
          enable_biometric_checkin: boolean | null
          enable_qr_checkin: boolean | null
          id: string
          late_threshold_minutes: number | null
          require_excuse_approval: boolean | null
          school_id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          alert_after_days?: number | null
          attendance_mode?: string | null
          auto_mark_weekends?: boolean | null
          created_at?: string
          enable_biometric_checkin?: boolean | null
          enable_qr_checkin?: boolean | null
          id?: string
          late_threshold_minutes?: number | null
          require_excuse_approval?: boolean | null
          school_id: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          alert_after_days?: number | null
          attendance_mode?: string | null
          auto_mark_weekends?: boolean | null
          created_at?: string
          enable_biometric_checkin?: boolean | null
          enable_qr_checkin?: boolean | null
          id?: string
          late_threshold_minutes?: number | null
          require_excuse_approval?: boolean | null
          school_id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          elevated_privilege: boolean | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          school_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          elevated_privilege?: boolean | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          school_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          elevated_privilege?: boolean | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          school_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          created_at: string
          days_of_week: number[]
          form_class: string | null
          id: string
          is_active: boolean | null
          period_id: string
          room: string | null
          school_id: string
          student_ids: string[]
          subject: string
          teacher_id: string
          updated_at: string
          year_group: string
        }
        Insert: {
          created_at?: string
          days_of_week: number[]
          form_class?: string | null
          id?: string
          is_active?: boolean | null
          period_id: string
          room?: string | null
          school_id: string
          student_ids: string[]
          subject: string
          teacher_id: string
          updated_at?: string
          year_group: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          form_class?: string | null
          id?: string
          is_active?: boolean | null
          period_id?: string
          room?: string | null
          school_id?: string
          student_ids?: string[]
          subject?: string
          teacher_id?: string
          updated_at?: string
          year_group?: string
        }
        Relationships: []
      }
      classrooms: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          is_active: boolean | null
          room_name: string
          room_type: string | null
          school_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          room_name: string
          room_type?: string | null
          school_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          room_name?: string
          room_type?: string | null
          school_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          budget: number | null
          cost_center: string | null
          created_at: string
          department_head_id: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          cost_center?: string | null
          created_at?: string
          department_head_id?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          cost_center?: string | null
          created_at?: string
          department_head_id?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          bank_account_details: Json | null
          benefits: Json | null
          created_at: string
          department_id: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          first_name: string
          id: string
          last_name: string
          location: string | null
          manager_id: string | null
          phone: string | null
          position: string
          salary: number
          start_date: string
          status: string
          tax_information: Json | null
          updated_at: string
          user_id: string | null
          work_type: string
        }
        Insert: {
          bank_account_details?: Json | null
          benefits?: Json | null
          created_at?: string
          department_id?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          first_name: string
          id?: string
          last_name: string
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          position: string
          salary: number
          start_date: string
          status?: string
          tax_information?: Json | null
          updated_at?: string
          user_id?: string | null
          work_type?: string
        }
        Update: {
          bank_account_details?: Json | null
          benefits?: Json | null
          created_at?: string
          department_id?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          first_name?: string
          id?: string
          last_name?: string
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          position?: string
          salary?: number
          start_date?: string
          status?: string
          tax_information?: Json | null
          updated_at?: string
          user_id?: string | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_applications: {
        Row: {
          academic_notes: string | null
          additional_data: Json | null
          application_number: string
          assigned_to: string | null
          bulk_operation_id: string | null
          bursary_application: boolean | null
          country: string | null
          created_at: string
          current_workflow_step: string | null
          current_year_group: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          fee_status: string | null
          form_class_preference: string | null
          gender: string | null
          home_address: string | null
          house_preference: string | null
          id: string
          last_activity_at: string | null
          medical_information: string | null
          nationality: string | null
          parent_email: string
          parent_name: string
          parent_phone: string | null
          parent_relationship: string | null
          pathway: Database["public"]["Enums"]["enrollment_pathway"]
          postal_code: string | null
          previous_school: string | null
          priority_score: number | null
          referring_staff_id: string | null
          scholarship_application: boolean | null
          school_id: string
          sibling_student_id: string | null
          source_school_id: string | null
          special_requirements: string | null
          status: Database["public"]["Enums"]["enrollment_status"]
          student_email: string | null
          student_name: string
          student_phone: string | null
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
          workflow_completion_percentage: number | null
          year_group: string
        }
        Insert: {
          academic_notes?: string | null
          additional_data?: Json | null
          application_number: string
          assigned_to?: string | null
          bulk_operation_id?: string | null
          bursary_application?: boolean | null
          country?: string | null
          created_at?: string
          current_workflow_step?: string | null
          current_year_group?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          fee_status?: string | null
          form_class_preference?: string | null
          gender?: string | null
          home_address?: string | null
          house_preference?: string | null
          id?: string
          last_activity_at?: string | null
          medical_information?: string | null
          nationality?: string | null
          parent_email: string
          parent_name: string
          parent_phone?: string | null
          parent_relationship?: string | null
          pathway: Database["public"]["Enums"]["enrollment_pathway"]
          postal_code?: string | null
          previous_school?: string | null
          priority_score?: number | null
          referring_staff_id?: string | null
          scholarship_application?: boolean | null
          school_id: string
          sibling_student_id?: string | null
          source_school_id?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_email?: string | null
          student_name: string
          student_phone?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          workflow_completion_percentage?: number | null
          year_group: string
        }
        Update: {
          academic_notes?: string | null
          additional_data?: Json | null
          application_number?: string
          assigned_to?: string | null
          bulk_operation_id?: string | null
          bursary_application?: boolean | null
          country?: string | null
          created_at?: string
          current_workflow_step?: string | null
          current_year_group?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          fee_status?: string | null
          form_class_preference?: string | null
          gender?: string | null
          home_address?: string | null
          house_preference?: string | null
          id?: string
          last_activity_at?: string | null
          medical_information?: string | null
          nationality?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string | null
          parent_relationship?: string | null
          pathway?: Database["public"]["Enums"]["enrollment_pathway"]
          postal_code?: string | null
          previous_school?: string | null
          priority_score?: number | null
          referring_staff_id?: string | null
          scholarship_application?: boolean | null
          school_id?: string
          sibling_student_id?: string | null
          source_school_id?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_email?: string | null
          student_name?: string
          student_phone?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          workflow_completion_percentage?: number | null
          year_group?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_submitted_by"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollment_approvals: {
        Row: {
          application_id: string
          approval_data: Json | null
          approval_notes: string | null
          approval_type: string
          approved_by: string | null
          approver_role: string | null
          assigned_approver: string | null
          conditions: string | null
          due_date: string | null
          id: string
          priority_level: number | null
          request_reason: string | null
          requested_at: string
          requested_by: string
          responded_at: string | null
          status: Database["public"]["Enums"]["approval_status"]
          workflow_step_id: string | null
        }
        Insert: {
          application_id: string
          approval_data?: Json | null
          approval_notes?: string | null
          approval_type: string
          approved_by?: string | null
          approver_role?: string | null
          assigned_approver?: string | null
          conditions?: string | null
          due_date?: string | null
          id?: string
          priority_level?: number | null
          request_reason?: string | null
          requested_at?: string
          requested_by: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          workflow_step_id?: string | null
        }
        Update: {
          application_id?: string
          approval_data?: Json | null
          approval_notes?: string | null
          approval_type?: string
          approved_by?: string | null
          approver_role?: string | null
          assigned_approver?: string | null
          conditions?: string | null
          due_date?: string | null
          id?: string
          priority_level?: number | null
          request_reason?: string | null
          requested_at?: string
          requested_by?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          workflow_step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment_approval_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_approval_approved_by"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_approval_assigned_approver"
            columns: ["assigned_approver"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_approval_requested_by"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_approval_workflow_step"
            columns: ["workflow_step_id"]
            isOneToOne: false
            referencedRelation: "enrollment_workflow_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_assessments: {
        Row: {
          application_id: string
          assessed_by: string | null
          assessment_date: string | null
          assessment_type: string
          assessor_notes: string | null
          created_at: string
          id: string
          overall_score: number | null
          recommendations: string | null
          scheduled_by: string | null
          status: string
          subject_scores: Json | null
          updated_at: string
        }
        Insert: {
          application_id: string
          assessed_by?: string | null
          assessment_date?: string | null
          assessment_type: string
          assessor_notes?: string | null
          created_at?: string
          id?: string
          overall_score?: number | null
          recommendations?: string | null
          scheduled_by?: string | null
          status?: string
          subject_scores?: Json | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          assessed_by?: string | null
          assessment_date?: string | null
          assessment_type?: string
          assessor_notes?: string | null
          created_at?: string
          id?: string
          overall_score?: number | null
          recommendations?: string | null
          scheduled_by?: string | null
          status?: string
          subject_scores?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment_assessment_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_assessment_assessed_by"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_assessment_scheduled_by"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollment_bulk_operations: {
        Row: {
          completed_at: string | null
          created_at: string
          error_log: Json | null
          failed_records: number | null
          id: string
          initiated_by: string
          operation_config: Json | null
          operation_name: string
          operation_type: string
          pathway: Database["public"]["Enums"]["enrollment_pathway"] | null
          processed_records: number | null
          school_id: string
          source_data: Json | null
          started_at: string | null
          status: string
          successful_records: number | null
          total_records: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_records?: number | null
          id?: string
          initiated_by: string
          operation_config?: Json | null
          operation_name: string
          operation_type: string
          pathway?: Database["public"]["Enums"]["enrollment_pathway"] | null
          processed_records?: number | null
          school_id: string
          source_data?: Json | null
          started_at?: string | null
          status?: string
          successful_records?: number | null
          total_records?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_records?: number | null
          id?: string
          initiated_by?: string
          operation_config?: Json | null
          operation_name?: string
          operation_type?: string
          pathway?: Database["public"]["Enums"]["enrollment_pathway"] | null
          processed_records?: number | null
          school_id?: string
          source_data?: Json | null
          started_at?: string | null
          status?: string
          successful_records?: number | null
          total_records?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_bulk_operation_initiated_by"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_bulk_operation_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_documents: {
        Row: {
          application_id: string
          document_name: string
          document_type: string
          file_path: string | null
          file_size: number | null
          id: string
          is_required: boolean
          is_verified: boolean
          metadata: Json | null
          mime_type: string | null
          uploaded_at: string | null
          uploaded_by: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          document_name: string
          document_type: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_required?: boolean
          is_verified?: boolean
          metadata?: Json | null
          mime_type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          document_name?: string
          document_type?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_required?: boolean
          is_verified?: boolean
          metadata?: Json | null
          mime_type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment_document_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_document_uploaded_by"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_document_verified_by"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollment_overrides: {
        Row: {
          application_id: string
          approval_id: string | null
          approved_at: string | null
          approved_by: string | null
          field_name: string
          id: string
          is_active: boolean
          justification: string | null
          metadata: Json | null
          original_value: string | null
          override_type: Database["public"]["Enums"]["override_reason"]
          override_value: string
          reason: string
          requested_at: string
          requested_by: string
          requires_approval: boolean
          supporting_evidence: string | null
        }
        Insert: {
          application_id: string
          approval_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          field_name: string
          id?: string
          is_active?: boolean
          justification?: string | null
          metadata?: Json | null
          original_value?: string | null
          override_type: Database["public"]["Enums"]["override_reason"]
          override_value: string
          reason: string
          requested_at?: string
          requested_by: string
          requires_approval?: boolean
          supporting_evidence?: string | null
        }
        Update: {
          application_id?: string
          approval_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          field_name?: string
          id?: string
          is_active?: boolean
          justification?: string | null
          metadata?: Json | null
          original_value?: string | null
          override_type?: Database["public"]["Enums"]["override_reason"]
          override_value?: string
          reason?: string
          requested_at?: string
          requested_by?: string
          requires_approval?: boolean
          supporting_evidence?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment_override_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_override_approval"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "enrollment_approvals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_override_approved_by"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_enrollment_override_requested_by"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollment_payments: {
        Row: {
          amount: number
          application_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          paid_at: string | null
          payment_metadata: Json | null
          payment_method: string | null
          payment_status: string
          payment_type: string
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_metadata?: Json | null
          payment_method?: string | null
          payment_status?: string
          payment_type: string
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_metadata?: Json | null
          payment_method?: string | null
          payment_status?: string
          payment_type?: string
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment_payment_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_types: {
        Row: {
          auto_approve_siblings: boolean
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          pathway: Database["public"]["Enums"]["enrollment_pathway"]
          priority_level: number
          requires_assessment: boolean
          requires_interview: boolean
          requires_payment: boolean
          settings: Json | null
          updated_at: string
        }
        Insert: {
          auto_approve_siblings?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          pathway: Database["public"]["Enums"]["enrollment_pathway"]
          priority_level?: number
          requires_assessment?: boolean
          requires_interview?: boolean
          requires_payment?: boolean
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          auto_approve_siblings?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          pathway?: Database["public"]["Enums"]["enrollment_pathway"]
          priority_level?: number
          requires_assessment?: boolean
          requires_interview?: boolean
          requires_payment?: boolean
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollment_workflow_steps: {
        Row: {
          application_id: string
          assigned_to: string | null
          can_skip: boolean
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          is_completed: boolean
          is_required: boolean
          order_index: number
          started_at: string | null
          status: Database["public"]["Enums"]["enrollment_status"]
          step_data: Json | null
          step_name: string
          step_type: string
          updated_at: string
          workflow_id: string
        }
        Insert: {
          application_id: string
          assigned_to?: string | null
          can_skip?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          is_required?: boolean
          order_index: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          step_data?: Json | null
          step_name: string
          step_type: string
          updated_at?: string
          workflow_id: string
        }
        Update: {
          application_id?: string
          assigned_to?: string | null
          can_skip?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          is_required?: boolean
          order_index?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          step_data?: Json | null
          step_name?: string
          step_type?: string
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_workflow_step_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_workflow_step_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_workflow_step_workflow"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "enrollment_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_workflows: {
        Row: {
          approval_matrix: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          pathway: Database["public"]["Enums"]["enrollment_pathway"]
          settings: Json | null
          steps_config: Json
          updated_at: string
        }
        Insert: {
          approval_matrix?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          pathway: Database["public"]["Enums"]["enrollment_pathway"]
          settings?: Json | null
          steps_config?: Json
          updated_at?: string
        }
        Update: {
          approval_matrix?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          pathway?: Database["public"]["Enums"]["enrollment_pathway"]
          settings?: Json | null
          steps_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          days_requested: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_requested: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_requested?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          allowances: number | null
          basic_salary: number
          bonus: number | null
          created_at: string
          employee_id: string
          gross_salary: number
          id: string
          insurance_deduction: number | null
          net_salary: number
          other_deductions: number | null
          overtime_pay: number | null
          pay_date: string | null
          pay_period_end: string
          pay_period_start: string
          status: string
          tax_deduction: number | null
          total_deductions: number | null
          updated_at: string
        }
        Insert: {
          allowances?: number | null
          basic_salary: number
          bonus?: number | null
          created_at?: string
          employee_id: string
          gross_salary: number
          id?: string
          insurance_deduction?: number | null
          net_salary: number
          other_deductions?: number | null
          overtime_pay?: number | null
          pay_date?: string | null
          pay_period_end: string
          pay_period_start: string
          status?: string
          tax_deduction?: number | null
          total_deductions?: number | null
          updated_at?: string
        }
        Update: {
          allowances?: number | null
          basic_salary?: number
          bonus?: number | null
          created_at?: string
          employee_id?: string
          gross_salary?: number
          id?: string
          insurance_deduction?: number | null
          net_salary?: number
          other_deductions?: number | null
          overtime_pay?: number | null
          pay_date?: string | null
          pay_period_end?: string
          pay_period_start?: string
          status?: string
          tax_deduction?: number | null
          total_deductions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_login: string | null
          last_name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          conditions: Json | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          resource: Database["public"]["Enums"]["resource_type"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          conditions?: Json | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          resource: Database["public"]["Enums"]["resource_type"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          conditions?: Json | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          resource?: Database["public"]["Enums"]["resource_type"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      school_periods: {
        Row: {
          created_at: string
          days_of_week: number[]
          end_time: string
          id: string
          is_active: boolean | null
          period_name: string
          period_number: number
          school_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_of_week: number[]
          end_time: string
          id?: string
          is_active?: boolean | null
          period_name: string
          period_number: number
          school_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          end_time?: string
          id?: string
          is_active?: boolean | null
          period_name?: string
          period_number?: number
          school_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          code: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      student_parents: {
        Row: {
          created_at: string
          emergency_contact: boolean | null
          id: string
          is_primary: boolean | null
          parent_id: string
          relationship: string
          student_id: string
        }
        Insert: {
          created_at?: string
          emergency_contact?: boolean | null
          id?: string
          is_primary?: boolean | null
          parent_id: string
          relationship: string
          student_id: string
        }
        Update: {
          created_at?: string
          emergency_contact?: boolean | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string
          relationship?: string
          student_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          admission_date: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          form_class: string | null
          id: string
          is_enrolled: boolean
          medical_notes: string | null
          safeguarding_notes: string | null
          school_id: string
          student_number: string
          updated_at: string
          user_id: string
          year_group: string
        }
        Insert: {
          admission_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          form_class?: string | null
          id?: string
          is_enrolled?: boolean
          medical_notes?: string | null
          safeguarding_notes?: string | null
          school_id: string
          student_number: string
          updated_at?: string
          user_id: string
          year_group: string
        }
        Update: {
          admission_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          form_class?: string | null
          id?: string
          is_enrolled?: boolean
          medical_notes?: string | null
          safeguarding_notes?: string | null
          school_id?: string
          student_number?: string
          updated_at?: string
          user_id?: string
          year_group?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          color_code: string | null
          created_at: string
          id: string
          is_active: boolean | null
          periods_per_week: number | null
          requires_lab: boolean | null
          school_id: string
          subject_code: string
          subject_name: string
          updated_at: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          periods_per_week?: number | null
          requires_lab?: boolean | null
          school_id: string
          subject_code: string
          subject_name: string
          updated_at?: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          periods_per_week?: number | null
          requires_lab?: boolean | null
          school_id?: string
          subject_code?: string
          subject_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      teacher_subjects: {
        Row: {
          created_at: string
          id: string
          max_periods_per_week: number | null
          subject_id: string
          teacher_id: string
          year_groups: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          max_periods_per_week?: number | null
          subject_id: string
          teacher_id: string
          year_groups: string[]
        }
        Update: {
          created_at?: string
          id?: string
          max_periods_per_week?: number | null
          subject_id?: string
          teacher_id?: string
          year_groups?: string[]
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          academic_year: string
          class_id: string
          classroom_id: string
          created_at: string
          day_of_week: number
          id: string
          is_active: boolean | null
          notes: string | null
          period_id: string
          school_id: string
          subject_id: string
          teacher_id: string
          term: string | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          class_id: string
          classroom_id: string
          created_at?: string
          day_of_week: number
          id?: string
          is_active?: boolean | null
          notes?: string | null
          period_id: string
          school_id: string
          subject_id: string
          teacher_id: string
          term?: string | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          class_id?: string
          classroom_id?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_active?: boolean | null
          notes?: string | null
          period_id?: string
          school_id?: string
          subject_id?: string
          teacher_id?: string
          term?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      timetable_periods: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_active: boolean | null
          is_break: boolean | null
          period_name: string
          period_number: number
          school_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          is_active?: boolean | null
          is_break?: boolean | null
          period_name: string
          period_number: number
          school_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean | null
          is_break?: boolean | null
          period_name?: string
          period_number?: number
          school_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          department: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          school_id: string
          user_id: string
          year_group: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          department?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["app_role"]
          school_id: string
          user_id: string
          year_group?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          department?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string
          user_id?: string
          year_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { user_uuid: string; school_uuid?: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
          school_id: string
          department: string
          year_group: string
        }[]
      }
      has_permission: {
        Args: {
          user_uuid: string
          school_uuid: string
          resource: Database["public"]["Enums"]["resource_type"]
          permission: Database["public"]["Enums"]["permission_type"]
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "school_admin"
        | "teacher"
        | "form_tutor"
        | "dsl"
        | "nurse"
        | "hod"
        | "parent"
        | "student"
      approval_status: "pending" | "approved" | "rejected" | "escalated"
      enrollment_pathway:
        | "standard_digital"
        | "sibling_automatic"
        | "internal_progression"
        | "staff_child"
        | "partner_school"
        | "emergency_safeguarding"
      enrollment_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "documents_pending"
        | "assessment_scheduled"
        | "assessment_complete"
        | "interview_scheduled"
        | "interview_complete"
        | "pending_approval"
        | "approved"
        | "offer_sent"
        | "offer_accepted"
        | "offer_declined"
        | "enrolled"
        | "rejected"
        | "withdrawn"
        | "on_hold"
        | "requires_override"
      override_reason:
        | "policy_exception"
        | "emergency_circumstances"
        | "safeguarding_priority"
        | "staff_discretion"
        | "technical_issue"
        | "data_correction"
      permission_type: "read" | "write" | "delete" | "approve" | "escalate"
      resource_type:
        | "students"
        | "grades"
        | "attendance"
        | "medical_records"
        | "safeguarding_logs"
        | "financial_data"
        | "reports"
        | "staff_management"
        | "system_settings"
        | "communications"
        | "timetables"
        | "admissions"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "school_admin",
        "teacher",
        "form_tutor",
        "dsl",
        "nurse",
        "hod",
        "parent",
        "student",
      ],
      approval_status: ["pending", "approved", "rejected", "escalated"],
      enrollment_pathway: [
        "standard_digital",
        "sibling_automatic",
        "internal_progression",
        "staff_child",
        "partner_school",
        "emergency_safeguarding",
      ],
      enrollment_status: [
        "draft",
        "submitted",
        "under_review",
        "documents_pending",
        "assessment_scheduled",
        "assessment_complete",
        "interview_scheduled",
        "interview_complete",
        "pending_approval",
        "approved",
        "offer_sent",
        "offer_accepted",
        "offer_declined",
        "enrolled",
        "rejected",
        "withdrawn",
        "on_hold",
        "requires_override",
      ],
      override_reason: [
        "policy_exception",
        "emergency_circumstances",
        "safeguarding_priority",
        "staff_discretion",
        "technical_issue",
        "data_correction",
      ],
      permission_type: ["read", "write", "delete", "approve", "escalate"],
      resource_type: [
        "students",
        "grades",
        "attendance",
        "medical_records",
        "safeguarding_logs",
        "financial_data",
        "reports",
        "staff_management",
        "system_settings",
        "communications",
        "timetables",
        "admissions",
      ],
    },
  },
} as const
