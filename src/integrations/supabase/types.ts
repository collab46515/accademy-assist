export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      accounting_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_setting: boolean
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_setting?: boolean
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_setting?: boolean
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          capacity: number
          category: string
          cost: number | null
          created_at: string
          description: string | null
          enrolled: number
          id: string
          instructor: string
          location: string | null
          name: string
          requirements: string[] | null
          schedule: string
          school_id: string
          status: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          category: string
          cost?: number | null
          created_at?: string
          description?: string | null
          enrolled?: number
          id?: string
          instructor: string
          location?: string | null
          name: string
          requirements?: string[] | null
          schedule: string
          school_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          category?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          enrolled?: number
          id?: string
          instructor?: string
          location?: string | null
          name?: string
          requirements?: string[] | null
          schedule?: string
          school_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      activities_participants: {
        Row: {
          achievements: string[] | null
          activity_id: string
          attendance_count: number | null
          created_at: string
          enrollment_date: string
          id: string
          school_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          activity_id: string
          attendance_count?: number | null
          created_at?: string
          enrollment_date?: string
          id?: string
          school_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          activity_id?: string
          attendance_count?: number | null
          created_at?: string
          enrollment_date?: string
          id?: string
          school_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_participants_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      application_documents: {
        Row: {
          application_id: string
          created_at: string | null
          document_name: string
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          document_name: string
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          document_name?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      application_notes: {
        Row: {
          application_id: string
          author_id: string
          author_name: string
          author_role: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          is_private: boolean | null
          updated_at: string
        }
        Insert: {
          application_id: string
          author_id: string
          author_name: string
          author_role?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_private?: boolean | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          author_id?: string
          author_name?: string
          author_role?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_application_notes_application_id"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructions: string | null
          is_active: boolean | null
          passing_score: number | null
          test_name: string
          test_type: string | null
          test_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          passing_score?: number | null
          test_name: string
          test_type?: string | null
          test_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          passing_score?: number | null
          test_name?: string
          test_type?: string | null
          test_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_categories: {
        Row: {
          category_name: string
          created_at: string
          depreciation_rate: number | null
          description: string | null
          id: string
          is_active: boolean
        }
        Insert: {
          category_name: string
          created_at?: string
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
        }
        Update: {
          category_name?: string
          created_at?: string
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          attachment_urls: string[] | null
          created_at: string | null
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          is_late: boolean | null
          marks_awarded: number | null
          status: string
          student_id: string
          submission_text: string | null
          submitted_at: string | null
          updated_at: string | null
          voice_feedback_url: string | null
        }
        Insert: {
          assignment_id: string
          attachment_urls?: string[] | null
          created_at?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean | null
          marks_awarded?: number | null
          status?: string
          student_id: string
          submission_text?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          voice_feedback_url?: string | null
        }
        Update: {
          assignment_id?: string
          attachment_urls?: string[] | null
          created_at?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean | null
          marks_awarded?: number | null
          status?: string
          student_id?: string
          submission_text?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          voice_feedback_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          allow_late_submissions: boolean | null
          assignment_type: string
          attachment_urls: string[] | null
          created_at: string | null
          created_by: string
          curriculum_topic_id: string | null
          description: string
          due_date: string
          id: string
          instructions: string | null
          late_penalty_percentage: number | null
          lesson_plan_id: string | null
          school_id: string
          status: string
          subject: string
          submission_type: string
          title: string
          total_marks: number
          updated_at: string | null
          year_group: string
        }
        Insert: {
          allow_late_submissions?: boolean | null
          assignment_type: string
          attachment_urls?: string[] | null
          created_at?: string | null
          created_by: string
          curriculum_topic_id?: string | null
          description: string
          due_date: string
          id?: string
          instructions?: string | null
          late_penalty_percentage?: number | null
          lesson_plan_id?: string | null
          school_id: string
          status?: string
          subject: string
          submission_type?: string
          title: string
          total_marks?: number
          updated_at?: string | null
          year_group: string
        }
        Update: {
          allow_late_submissions?: boolean | null
          assignment_type?: string
          attachment_urls?: string[] | null
          created_at?: string | null
          created_by?: string
          curriculum_topic_id?: string | null
          description?: string
          due_date?: string
          id?: string
          instructions?: string | null
          late_penalty_percentage?: number | null
          lesson_plan_id?: string | null
          school_id?: string
          status?: string
          subject?: string
          submission_type?: string
          title?: string
          total_marks?: number
          updated_at?: string | null
          year_group?: string
        }
        Relationships: []
      }
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
          is_submitted: boolean | null
          marked_at: string
          notes: string | null
          period: number | null
          reason: string | null
          school_id: string
          session: string | null
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
          is_submitted?: boolean | null
          marked_at?: string
          notes?: string | null
          period?: number | null
          reason?: string | null
          school_id: string
          session?: string | null
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
          is_submitted?: boolean | null
          marked_at?: string
          notes?: string | null
          period?: number | null
          reason?: string | null
          school_id?: string
          session?: string | null
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
      attendance_session_summaries: {
        Row: {
          absent_count: number
          class_id: string
          created_at: string
          date: string
          id: string
          is_submitted: boolean | null
          late_count: number
          notes: string | null
          present_count: number
          school_id: string
          session: string
          submitted_at: string | null
          submitted_by: string | null
          total_students: number
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          absent_count?: number
          class_id: string
          created_at?: string
          date: string
          id?: string
          is_submitted?: boolean | null
          late_count?: number
          notes?: string | null
          present_count?: number
          school_id: string
          session: string
          submitted_at?: string | null
          submitted_by?: string | null
          total_students?: number
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          absent_count?: number
          class_id?: string
          created_at?: string
          date?: string
          id?: string
          is_submitted?: boolean | null
          late_count?: number
          notes?: string | null
          present_count?: number
          school_id?: string
          session?: string
          submitted_at?: string | null
          submitted_by?: string | null
          total_students?: number
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      background_checks: {
        Row: {
          application_id: string | null
          check_type: string
          completed_date: string | null
          cost: number | null
          created_at: string | null
          details: Json | null
          document_url: string | null
          id: string
          initiated_by: string | null
          initiated_date: string | null
          result: string | null
          status: string | null
          updated_at: string | null
          vendor_name: string | null
        }
        Insert: {
          application_id?: string | null
          check_type: string
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          details?: Json | null
          document_url?: string | null
          id?: string
          initiated_by?: string | null
          initiated_date?: string | null
          result?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Update: {
          application_id?: string | null
          check_type?: string
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          details?: Json | null
          document_url?: string | null
          id?: string
          initiated_by?: string | null
          initiated_date?: string | null
          result?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "background_checks_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "background_checks_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      benefit_plans: {
        Row: {
          coverage_details: Json | null
          created_at: string
          employee_contribution: number | null
          employer_contribution: number | null
          id: string
          is_active: boolean | null
          plan_description: string | null
          plan_name: string
          plan_type: string
          provider_name: string | null
          updated_at: string
        }
        Insert: {
          coverage_details?: Json | null
          created_at?: string
          employee_contribution?: number | null
          employer_contribution?: number | null
          id?: string
          is_active?: boolean | null
          plan_description?: string | null
          plan_name: string
          plan_type: string
          provider_name?: string | null
          updated_at?: string
        }
        Update: {
          coverage_details?: Json | null
          created_at?: string
          employee_contribution?: number | null
          employer_contribution?: number | null
          id?: string
          is_active?: boolean | null
          plan_description?: string | null
          plan_name?: string
          plan_type?: string
          provider_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          balance_due: number
          bill_date: string
          bill_number: string
          category: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          due_date: string
          id: string
          notes: string | null
          paid_amount: number
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          vendor_id: string | null
          vendor_name: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          balance_due?: number
          bill_date: string
          bill_number: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          due_date: string
          id?: string
          notes?: string | null
          paid_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          vendor_id?: string | null
          vendor_name: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          balance_due?: number
          bill_date?: string
          bill_number?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          paid_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          account_id: string | null
          actual_amount: number
          budget_name: string
          budgeted_amount: number
          created_at: string
          created_by: string | null
          currency: string
          department: string | null
          fiscal_year: string
          id: string
          is_active: boolean
          notes: string | null
          period_type: string
          updated_at: string
          variance: number
          variance_percentage: number
        }
        Insert: {
          account_id?: string | null
          actual_amount?: number
          budget_name: string
          budgeted_amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          department?: string | null
          fiscal_year: string
          id?: string
          is_active?: boolean
          notes?: string | null
          period_type?: string
          updated_at?: string
          variance?: number
          variance_percentage?: number
        }
        Update: {
          account_id?: string | null
          actual_amount?: number
          budget_name?: string
          budgeted_amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          department?: string | null
          fiscal_year?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          period_type?: string
          updated_at?: string
          variance?: number
          variance_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_assessments: {
        Row: {
          application_id: string | null
          assessment_test_id: string | null
          assigned_date: string | null
          completed_at: string | null
          created_at: string | null
          detailed_results: Json | null
          due_date: string | null
          id: string
          max_score: number | null
          notes: string | null
          percentage_score: number | null
          score: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          assessment_test_id?: string | null
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          detailed_results?: Json | null
          due_date?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          percentage_score?: number | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          assessment_test_id?: string | null
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          detailed_results?: Json | null
          due_date?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          percentage_score?: number | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_assessments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_assessments_assessment_test_id_fkey"
            columns: ["assessment_test_id"]
            isOneToOne: false
            referencedRelation: "assessment_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_pool: {
        Row: {
          added_by: string | null
          availability_date: string | null
          cover_letter_url: string | null
          created_at: string | null
          current_company: string | null
          current_position: string | null
          education_level: string | null
          email: string
          expected_salary_max: number | null
          expected_salary_min: number | null
          experience_years: number | null
          first_name: string
          github_url: string | null
          id: string
          last_name: string
          linkedin_url: string | null
          location: string | null
          notes: string | null
          notice_period_weeks: number | null
          phone: string | null
          portfolio_url: string | null
          rating: number | null
          resume_url: string | null
          skills: Json | null
          source: string | null
          source_details: Json | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          willing_to_relocate: boolean | null
        }
        Insert: {
          added_by?: string | null
          availability_date?: string | null
          cover_letter_url?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          education_level?: string | null
          email: string
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          experience_years?: number | null
          first_name: string
          github_url?: string | null
          id?: string
          last_name: string
          linkedin_url?: string | null
          location?: string | null
          notes?: string | null
          notice_period_weeks?: number | null
          phone?: string | null
          portfolio_url?: string | null
          rating?: number | null
          resume_url?: string | null
          skills?: Json | null
          source?: string | null
          source_details?: Json | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          willing_to_relocate?: boolean | null
        }
        Update: {
          added_by?: string | null
          availability_date?: string | null
          cover_letter_url?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          education_level?: string | null
          email?: string
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          experience_years?: number | null
          first_name?: string
          github_url?: string | null
          id?: string
          last_name?: string
          linkedin_url?: string | null
          location?: string | null
          notes?: string | null
          notice_period_weeks?: number | null
          phone?: string | null
          portfolio_url?: string | null
          rating?: number | null
          resume_url?: string | null
          skills?: Json | null
          source?: string | null
          source_details?: Json | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          willing_to_relocate?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_pool_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          balance_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          level: number
          parent_account_id: string | null
          updated_at: string
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          balance_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          parent_account_id?: string | null
          updated_at?: string
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          balance_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          parent_account_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      class_analytics: {
        Row: {
          analytics_data: Json
          assignment_id: string
          class_id: string
          created_at: string
          generated_at: string
          id: string
          insights: Json | null
          school_id: string
        }
        Insert: {
          analytics_data?: Json
          assignment_id: string
          class_id: string
          created_at?: string
          generated_at?: string
          id?: string
          insights?: Json | null
          school_id: string
        }
        Update: {
          analytics_data?: Json
          assignment_id?: string
          class_id?: string
          created_at?: string
          generated_at?: string
          id?: string
          insights?: Json | null
          school_id?: string
        }
        Relationships: []
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
      classes: {
        Row: {
          academic_year: string | null
          capacity: number | null
          class_name: string
          classroom_id: string | null
          created_at: string | null
          current_enrollment: number | null
          form_teacher_id: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          school_id: string
          updated_at: string | null
          year_group: string
        }
        Insert: {
          academic_year?: string | null
          capacity?: number | null
          class_name: string
          classroom_id?: string | null
          created_at?: string | null
          current_enrollment?: number | null
          form_teacher_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          school_id: string
          updated_at?: string | null
          year_group: string
        }
        Update: {
          academic_year?: string | null
          capacity?: number | null
          class_name?: string
          classroom_id?: string | null
          created_at?: string | null
          current_enrollment?: number | null
          form_teacher_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          school_id?: string
          updated_at?: string | null
          year_group?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
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
      collection_sessions: {
        Row: {
          cashier_id: string
          closing_cash_amount: number | null
          created_at: string
          expected_cash_amount: number | null
          id: string
          notes: string | null
          opening_cash_amount: number | null
          school_id: string
          session_end: string | null
          session_start: string
          status: string
          supervisor_approved_at: string | null
          supervisor_approved_by: string | null
          supervisor_notes: string | null
          updated_at: string
          variance_amount: number | null
        }
        Insert: {
          cashier_id: string
          closing_cash_amount?: number | null
          created_at?: string
          expected_cash_amount?: number | null
          id?: string
          notes?: string | null
          opening_cash_amount?: number | null
          school_id: string
          session_end?: string | null
          session_start?: string
          status?: string
          supervisor_approved_at?: string | null
          supervisor_approved_by?: string | null
          supervisor_notes?: string | null
          updated_at?: string
          variance_amount?: number | null
        }
        Update: {
          cashier_id?: string
          closing_cash_amount?: number | null
          created_at?: string
          expected_cash_amount?: number | null
          id?: string
          notes?: string | null
          opening_cash_amount?: number | null
          school_id?: string
          session_end?: string | null
          session_start?: string
          status?: string
          supervisor_approved_at?: string | null
          supervisor_approved_by?: string | null
          supervisor_notes?: string | null
          updated_at?: string
          variance_amount?: number | null
        }
        Relationships: []
      }
      comment_bank: {
        Row: {
          category: string
          comment_template: string
          created_at: string
          created_by: string
          grade_level: string
          id: string
          is_active: boolean | null
          school_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          category?: string
          comment_template: string
          created_at?: string
          created_by: string
          grade_level: string
          id?: string
          is_active?: boolean | null
          school_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          category?: string
          comment_template?: string
          created_at?: string
          created_by?: string
          grade_level?: string
          id?: string
          is_active?: boolean | null
          school_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      communication_recipients: {
        Row: {
          communication_id: string
          created_at: string
          delivered_at: string | null
          delivery_method: string | null
          delivery_status: string | null
          id: string
          read_at: string | null
          recipient_id: string
          recipient_type: string
        }
        Insert: {
          communication_id: string
          created_at?: string
          delivered_at?: string | null
          delivery_method?: string | null
          delivery_status?: string | null
          id?: string
          read_at?: string | null
          recipient_id: string
          recipient_type: string
        }
        Update: {
          communication_id?: string
          created_at?: string
          delivered_at?: string | null
          delivery_method?: string | null
          delivery_status?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string
          recipient_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_recipients_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          content_template: string
          created_at: string
          created_by: string
          default_audience_type:
            | Database["public"]["Enums"]["audience_type"]
            | null
          default_priority:
            | Database["public"]["Enums"]["communication_priority"]
            | null
          description: string | null
          id: string
          is_active: boolean | null
          school_id: string
          subject_template: string
          tags: string[] | null
          template_name: string
          template_type: Database["public"]["Enums"]["communication_type"]
          updated_at: string
        }
        Insert: {
          content_template: string
          created_at?: string
          created_by: string
          default_audience_type?:
            | Database["public"]["Enums"]["audience_type"]
            | null
          default_priority?:
            | Database["public"]["Enums"]["communication_priority"]
            | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          school_id: string
          subject_template: string
          tags?: string[] | null
          template_name: string
          template_type: Database["public"]["Enums"]["communication_type"]
          updated_at?: string
        }
        Update: {
          content_template?: string
          created_at?: string
          created_by?: string
          default_audience_type?:
            | Database["public"]["Enums"]["audience_type"]
            | null
          default_priority?:
            | Database["public"]["Enums"]["communication_priority"]
            | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          school_id?: string
          subject_template?: string
          tags?: string[] | null
          template_name?: string
          template_type?: Database["public"]["Enums"]["communication_type"]
          updated_at?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachments: Json | null
          audience_details: Json | null
          audience_type: Database["public"]["Enums"]["audience_type"]
          communication_type: Database["public"]["Enums"]["communication_type"]
          content: string
          created_at: string
          created_by: string
          delivery_count: number | null
          id: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["communication_priority"]
          read_count: number | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          scheduled_for: string | null
          school_id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["communication_status"]
          tags: string[] | null
          title: string
          total_recipients: number | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          audience_details?: Json | null
          audience_type: Database["public"]["Enums"]["audience_type"]
          communication_type: Database["public"]["Enums"]["communication_type"]
          content: string
          created_at?: string
          created_by: string
          delivery_count?: number | null
          id?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["communication_priority"]
          read_count?: number | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_for?: string | null
          school_id: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"]
          tags?: string[] | null
          title: string
          total_recipients?: number | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachments?: Json | null
          audience_details?: Json | null
          audience_type?: Database["public"]["Enums"]["audience_type"]
          communication_type?: Database["public"]["Enums"]["communication_type"]
          content?: string
          created_at?: string
          created_by?: string
          delivery_count?: number | null
          id?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["communication_priority"]
          read_count?: number | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_for?: string | null
          school_id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"]
          tags?: string[] | null
          title?: string
          total_recipients?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      company_assets: {
        Row: {
          asset_name: string
          asset_tag: string
          assigned_to: string | null
          assignment_date: string | null
          brand: string | null
          category_id: string
          created_at: string
          current_value: number | null
          id: string
          location: string | null
          model: string | null
          purchase_cost: number | null
          purchase_date: string | null
          serial_number: string | null
          status: string
          updated_at: string
          warranty_expiry: string | null
        }
        Insert: {
          asset_name: string
          asset_tag: string
          assigned_to?: string | null
          assignment_date?: string | null
          brand?: string | null
          category_id: string
          created_at?: string
          current_value?: number | null
          id?: string
          location?: string | null
          model?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_expiry?: string | null
        }
        Update: {
          asset_name?: string
          asset_tag?: string
          assigned_to?: string | null
          assignment_date?: string | null
          brand?: string | null
          category_id?: string
          created_at?: string
          current_value?: number | null
          id?: string
          location?: string | null
          model?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_assets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_assets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_actions: {
        Row: {
          action_date: string
          action_type: string
          complaint_id: string
          created_at: string
          description: string
          id: string
          taken_by: string
        }
        Insert: {
          action_date?: string
          action_type: string
          complaint_id: string
          created_at?: string
          description: string
          id?: string
          taken_by: string
        }
        Update: {
          action_date?: string
          action_type?: string
          complaint_id?: string
          created_at?: string
          description?: string
          id?: string
          taken_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaint_actions_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_communications: {
        Row: {
          attachments: string[] | null
          communication_date: string
          communication_type: string
          complaint_id: string
          created_at: string | null
          direction: string
          id: string
          logged_by: string
          participants: string[] | null
          summary: string
        }
        Insert: {
          attachments?: string[] | null
          communication_date: string
          communication_type: string
          complaint_id: string
          created_at?: string | null
          direction: string
          id?: string
          logged_by: string
          participants?: string[] | null
          summary: string
        }
        Update: {
          attachments?: string[] | null
          communication_date?: string
          communication_type?: string
          complaint_id?: string
          created_at?: string | null
          direction?: string
          id?: string
          logged_by?: string
          participants?: string[] | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaint_communications_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          actions_taken: string[] | null
          anonymous: boolean | null
          assigned_to: string | null
          complainant_email: string | null
          complainant_name: string
          complainant_phone: string | null
          complainant_relationship: string | null
          complaint_number: string
          complaint_type: Database["public"]["Enums"]["complaint_type"]
          created_at: string | null
          description: string
          desired_outcome: string | null
          escalated_to: string | null
          evidence_urls: string[] | null
          id: string
          incident_date: string | null
          lessons_learned: string | null
          location: string | null
          priority: Database["public"]["Enums"]["complaint_priority"] | null
          resolution: string | null
          resolved_at: string | null
          school_id: string
          staff_involved: string[] | null
          status: Database["public"]["Enums"]["record_status"] | null
          student_involved: string | null
          submitted_by: string | null
          target_resolution_date: string | null
          title: string
          updated_at: string | null
          witnesses: string[] | null
        }
        Insert: {
          actions_taken?: string[] | null
          anonymous?: boolean | null
          assigned_to?: string | null
          complainant_email?: string | null
          complainant_name: string
          complainant_phone?: string | null
          complainant_relationship?: string | null
          complaint_number?: string
          complaint_type: Database["public"]["Enums"]["complaint_type"]
          created_at?: string | null
          description: string
          desired_outcome?: string | null
          escalated_to?: string | null
          evidence_urls?: string[] | null
          id?: string
          incident_date?: string | null
          lessons_learned?: string | null
          location?: string | null
          priority?: Database["public"]["Enums"]["complaint_priority"] | null
          resolution?: string | null
          resolved_at?: string | null
          school_id: string
          staff_involved?: string[] | null
          status?: Database["public"]["Enums"]["record_status"] | null
          student_involved?: string | null
          submitted_by?: string | null
          target_resolution_date?: string | null
          title: string
          updated_at?: string | null
          witnesses?: string[] | null
        }
        Update: {
          actions_taken?: string[] | null
          anonymous?: boolean | null
          assigned_to?: string | null
          complainant_email?: string | null
          complainant_name?: string
          complainant_phone?: string | null
          complainant_relationship?: string | null
          complaint_number?: string
          complaint_type?: Database["public"]["Enums"]["complaint_type"]
          created_at?: string | null
          description?: string
          desired_outcome?: string | null
          escalated_to?: string | null
          evidence_urls?: string[] | null
          id?: string
          incident_date?: string | null
          lessons_learned?: string | null
          location?: string | null
          priority?: Database["public"]["Enums"]["complaint_priority"] | null
          resolution?: string | null
          resolved_at?: string | null
          school_id?: string
          staff_involved?: string[] | null
          status?: Database["public"]["Enums"]["record_status"] | null
          student_involved?: string | null
          submitted_by?: string | null
          target_resolution_date?: string | null
          title?: string
          updated_at?: string | null
          witnesses?: string[] | null
        }
        Relationships: []
      }
      curriculum_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          created_at: string | null
          gap_id: string | null
          id: string
          message: string
          priority: string | null
          read_at: string | null
          recipient_id: string
          school_id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          created_at?: string | null
          gap_id?: string | null
          id?: string
          message: string
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          school_id: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string | null
          gap_id?: string | null
          id?: string
          message?: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          school_id?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_alerts_gap_id_fkey"
            columns: ["gap_id"]
            isOneToOne: false
            referencedRelation: "curriculum_gaps"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_frameworks: {
        Row: {
          academic_periods: Json
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          grade_levels: Json
          id: string
          is_active: boolean
          is_template: boolean
          name: string
          period_type: Database["public"]["Enums"]["academic_period_type"]
          school_id: string | null
          subjects: Json
          type: Database["public"]["Enums"]["curriculum_type"]
          updated_at: string
        }
        Insert: {
          academic_periods?: Json
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          grade_levels?: Json
          id?: string
          is_active?: boolean
          is_template?: boolean
          name: string
          period_type?: Database["public"]["Enums"]["academic_period_type"]
          school_id?: string | null
          subjects?: Json
          type: Database["public"]["Enums"]["curriculum_type"]
          updated_at?: string
        }
        Update: {
          academic_periods?: Json
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          grade_levels?: Json
          id?: string
          is_active?: boolean
          is_template?: boolean
          name?: string
          period_type?: Database["public"]["Enums"]["academic_period_type"]
          school_id?: string | null
          subjects?: Json
          type?: Database["public"]["Enums"]["curriculum_type"]
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_gaps: {
        Row: {
          alert_count: number | null
          alert_sent: boolean | null
          assigned_teacher_id: string | null
          completed_lessons: number
          coverage_percentage: number
          created_at: string | null
          days_behind: number | null
          deadline_date: string | null
          id: string
          last_lesson_date: string | null
          planned_lessons: number
          projected_completion_date: string | null
          risk_level: string | null
          school_id: string
          subject: string
          topic_id: string
          topic_name: string
          updated_at: string | null
          year_group: string
        }
        Insert: {
          alert_count?: number | null
          alert_sent?: boolean | null
          assigned_teacher_id?: string | null
          completed_lessons?: number
          coverage_percentage?: number
          created_at?: string | null
          days_behind?: number | null
          deadline_date?: string | null
          id?: string
          last_lesson_date?: string | null
          planned_lessons?: number
          projected_completion_date?: string | null
          risk_level?: string | null
          school_id: string
          subject: string
          topic_id: string
          topic_name: string
          updated_at?: string | null
          year_group: string
        }
        Update: {
          alert_count?: number | null
          alert_sent?: boolean | null
          assigned_teacher_id?: string | null
          completed_lessons?: number
          coverage_percentage?: number
          created_at?: string | null
          days_behind?: number | null
          deadline_date?: string | null
          id?: string
          last_lesson_date?: string | null
          planned_lessons?: number
          projected_completion_date?: string | null
          risk_level?: string | null
          school_id?: string
          subject?: string
          topic_id?: string
          topic_name?: string
          updated_at?: string | null
          year_group?: string
        }
        Relationships: []
      }
      curriculum_imports: {
        Row: {
          created_at: string
          errors: Json | null
          failed_records: number | null
          file_name: string
          file_size: number | null
          framework_id: string | null
          id: string
          import_type: string
          imported_by: string | null
          school_id: string | null
          successful_records: number | null
          total_records: number | null
        }
        Insert: {
          created_at?: string
          errors?: Json | null
          failed_records?: number | null
          file_name: string
          file_size?: number | null
          framework_id?: string | null
          id?: string
          import_type: string
          imported_by?: string | null
          school_id?: string | null
          successful_records?: number | null
          total_records?: number | null
        }
        Update: {
          created_at?: string
          errors?: Json | null
          failed_records?: number | null
          file_name?: string
          file_size?: number | null
          framework_id?: string | null
          id?: string
          import_type?: string
          imported_by?: string | null
          school_id?: string | null
          successful_records?: number | null
          total_records?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_imports_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "curriculum_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_topics: {
        Row: {
          academic_period: string | null
          assessment_criteria: Json | null
          created_at: string
          description: string | null
          difficulty_level: number | null
          estimated_hours: number | null
          framework_id: string
          grade_level: string
          id: string
          is_mandatory: boolean
          learning_objectives: Json | null
          parent_topic_id: string | null
          prerequisites: Json | null
          resources: Json | null
          skills: Json | null
          subject: string
          tags: Json | null
          title: string
          topic_code: string | null
          topic_order: number | null
          updated_at: string
        }
        Insert: {
          academic_period?: string | null
          assessment_criteria?: Json | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          estimated_hours?: number | null
          framework_id: string
          grade_level: string
          id?: string
          is_mandatory?: boolean
          learning_objectives?: Json | null
          parent_topic_id?: string | null
          prerequisites?: Json | null
          resources?: Json | null
          skills?: Json | null
          subject: string
          tags?: Json | null
          title: string
          topic_code?: string | null
          topic_order?: number | null
          updated_at?: string
        }
        Update: {
          academic_period?: string | null
          assessment_criteria?: Json | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          estimated_hours?: number | null
          framework_id?: string
          grade_level?: string
          id?: string
          is_mandatory?: boolean
          learning_objectives?: Json | null
          parent_topic_id?: string | null
          prerequisites?: Json | null
          resources?: Json | null
          skills?: Json | null
          subject?: string
          tags?: Json | null
          title?: string
          topic_code?: string | null
          topic_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_topics_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "curriculum_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_topics_parent_topic_id_fkey"
            columns: ["parent_topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      department_coverage: {
        Row: {
          behind_topics: number
          completed_topics: number
          created_at: string | null
          critical_topics: number
          department: string
          id: string
          in_progress_topics: number
          last_updated: string | null
          not_started_topics: number
          on_track_topics: number
          overall_coverage_percentage: number
          school_id: string
          total_topics: number
          year_group: string
        }
        Insert: {
          behind_topics?: number
          completed_topics?: number
          created_at?: string | null
          critical_topics?: number
          department: string
          id?: string
          in_progress_topics?: number
          last_updated?: string | null
          not_started_topics?: number
          on_track_topics?: number
          overall_coverage_percentage?: number
          school_id: string
          total_topics?: number
          year_group: string
        }
        Update: {
          behind_topics?: number
          completed_topics?: number
          created_at?: string | null
          critical_topics?: number
          department?: string
          id?: string
          in_progress_topics?: number
          last_updated?: string | null
          not_started_topics?: number
          on_track_topics?: number
          overall_coverage_percentage?: number
          school_id?: string
          total_topics?: number
          year_group?: string
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
          is_active: boolean
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
          is_active?: boolean
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
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          category_name: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_confidential: boolean | null
          retention_period_months: number | null
        }
        Insert: {
          category_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_confidential?: boolean | null
          retention_period_months?: number | null
        }
        Update: {
          category_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_confidential?: boolean | null
          retention_period_months?: number | null
        }
        Relationships: []
      }
      driver_checkins: {
        Row: {
          checkin_time: string
          checkin_type: string
          created_at: string
          driver_id: string | null
          fuel_level_percent: number | null
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          odometer_reading: number | null
          photo_url: string | null
          school_id: string
          trip_instance_id: string | null
          vehicle_condition: string | null
          vehicle_id: string | null
          vehicle_issues: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          checkin_time?: string
          checkin_type: string
          created_at?: string
          driver_id?: string | null
          fuel_level_percent?: number | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          odometer_reading?: number | null
          photo_url?: string | null
          school_id: string
          trip_instance_id?: string | null
          vehicle_condition?: string | null
          vehicle_id?: string | null
          vehicle_issues?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          checkin_time?: string
          checkin_type?: string
          created_at?: string
          driver_id?: string | null
          fuel_level_percent?: number | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          odometer_reading?: number | null
          photo_url?: string | null
          school_id?: string
          trip_instance_id?: string | null
          vehicle_condition?: string | null
          vehicle_id?: string | null
          vehicle_issues?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_checkins_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_checkins_trip_instance_id_fkey"
            columns: ["trip_instance_id"]
            isOneToOne: false
            referencedRelation: "trip_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_checkins_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_performance: {
        Row: {
          checkin_compliance_rate: number | null
          checkins_completed: number | null
          checkins_expected: number | null
          complaints_received: number | null
          completed_trips: number | null
          created_at: string | null
          driver_id: string | null
          fuel_efficiency_score: number | null
          id: string
          incidents_reported: number | null
          late_arrivals: number | null
          on_time_arrivals: number | null
          overall_rating: number | null
          period_end: string
          period_start: string
          punctuality_score: number | null
          rating_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          safety_score: number | null
          school_id: string
          total_distance_km: number | null
          total_fuel_used: number | null
          total_trips: number | null
          updated_at: string | null
        }
        Insert: {
          checkin_compliance_rate?: number | null
          checkins_completed?: number | null
          checkins_expected?: number | null
          complaints_received?: number | null
          completed_trips?: number | null
          created_at?: string | null
          driver_id?: string | null
          fuel_efficiency_score?: number | null
          id?: string
          incidents_reported?: number | null
          late_arrivals?: number | null
          on_time_arrivals?: number | null
          overall_rating?: number | null
          period_end: string
          period_start: string
          punctuality_score?: number | null
          rating_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          safety_score?: number | null
          school_id: string
          total_distance_km?: number | null
          total_fuel_used?: number | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Update: {
          checkin_compliance_rate?: number | null
          checkins_completed?: number | null
          checkins_expected?: number | null
          complaints_received?: number | null
          completed_trips?: number | null
          created_at?: string | null
          driver_id?: string | null
          fuel_efficiency_score?: number | null
          id?: string
          incidents_reported?: number | null
          late_arrivals?: number | null
          on_time_arrivals?: number | null
          overall_rating?: number | null
          period_end?: string
          period_start?: string
          punctuality_score?: number | null
          rating_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          safety_score?: number | null
          school_id?: string
          total_distance_km?: number | null
          total_fuel_used?: number | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_performance_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          aadhar_document_url: string | null
          aadhar_number: string | null
          address: string | null
          background_check_date: string | null
          background_check_document_url: string | null
          background_check_status: string | null
          birth_date: string | null
          blood_group: string | null
          contractor_id: string | null
          created_at: string
          dbs_check_date: string | null
          dbs_expiry: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          employee_type: string | null
          employment_type: string | null
          first_aid_cert_date: string | null
          first_aid_expiry: string | null
          first_name: string
          gender: string | null
          hire_date: string
          hmv_permit_expiry: string | null
          hmv_permit_number: string | null
          id: string
          id_card_issued: boolean | null
          id_card_number: string | null
          last_name: string
          license_expiry: string
          license_number: string
          license_type: string[]
          marital_status: string | null
          medical_certificate_url: string | null
          medical_fitness_date: string | null
          medical_fitness_expiry: string | null
          notes: string | null
          permanent_address: string | null
          phone: string
          photo_url: string | null
          police_verification_date: string | null
          police_verification_status: string | null
          psv_badge_expiry: string | null
          psv_badge_number: string | null
          school_id: string
          status: string
          uniform_size: string | null
          updated_at: string
        }
        Insert: {
          aadhar_document_url?: string | null
          aadhar_number?: string | null
          address?: string | null
          background_check_date?: string | null
          background_check_document_url?: string | null
          background_check_status?: string | null
          birth_date?: string | null
          blood_group?: string | null
          contractor_id?: string | null
          created_at?: string
          dbs_check_date?: string | null
          dbs_expiry?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          employee_type?: string | null
          employment_type?: string | null
          first_aid_cert_date?: string | null
          first_aid_expiry?: string | null
          first_name: string
          gender?: string | null
          hire_date: string
          hmv_permit_expiry?: string | null
          hmv_permit_number?: string | null
          id?: string
          id_card_issued?: boolean | null
          id_card_number?: string | null
          last_name: string
          license_expiry: string
          license_number: string
          license_type?: string[]
          marital_status?: string | null
          medical_certificate_url?: string | null
          medical_fitness_date?: string | null
          medical_fitness_expiry?: string | null
          notes?: string | null
          permanent_address?: string | null
          phone: string
          photo_url?: string | null
          police_verification_date?: string | null
          police_verification_status?: string | null
          psv_badge_expiry?: string | null
          psv_badge_number?: string | null
          school_id: string
          status?: string
          uniform_size?: string | null
          updated_at?: string
        }
        Update: {
          aadhar_document_url?: string | null
          aadhar_number?: string | null
          address?: string | null
          background_check_date?: string | null
          background_check_document_url?: string | null
          background_check_status?: string | null
          birth_date?: string | null
          blood_group?: string | null
          contractor_id?: string | null
          created_at?: string
          dbs_check_date?: string | null
          dbs_expiry?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          employee_type?: string | null
          employment_type?: string | null
          first_aid_cert_date?: string | null
          first_aid_expiry?: string | null
          first_name?: string
          gender?: string | null
          hire_date?: string
          hmv_permit_expiry?: string | null
          hmv_permit_number?: string | null
          id?: string
          id_card_issued?: boolean | null
          id_card_number?: string | null
          last_name?: string
          license_expiry?: string
          license_number?: string
          license_type?: string[]
          marital_status?: string | null
          medical_certificate_url?: string | null
          medical_fitness_date?: string | null
          medical_fitness_expiry?: string | null
          notes?: string | null
          permanent_address?: string | null
          phone?: string
          photo_url?: string | null
          police_verification_date?: string | null
          police_verification_status?: string | null
          psv_badge_expiry?: string | null
          psv_badge_number?: string | null
          school_id?: string
          status?: string
          uniform_size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "transport_contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_benefits: {
        Row: {
          beneficiaries: Json | null
          benefit_plan_id: string
          coverage_end_date: string | null
          coverage_start_date: string
          created_at: string
          employee_id: string
          enrollment_date: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          beneficiaries?: Json | null
          benefit_plan_id: string
          coverage_end_date?: string | null
          coverage_start_date: string
          created_at?: string
          employee_id: string
          enrollment_date: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          beneficiaries?: Json | null
          benefit_plan_id?: string
          coverage_end_date?: string | null
          coverage_start_date?: string
          created_at?: string
          employee_id?: string
          enrollment_date?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_benefit_plan_id_fkey"
            columns: ["benefit_plan_id"]
            isOneToOne: false
            referencedRelation: "benefit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          access_level: string
          category_id: string
          created_at: string
          document_name: string
          document_type: string | null
          employee_id: string
          expiry_date: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_verified: boolean | null
          updated_at: string
          uploaded_by: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          access_level?: string
          category_id: string
          created_at?: string
          document_name: string
          document_type?: string | null
          employee_id: string
          expiry_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string
          uploaded_by: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          access_level?: string
          category_id?: string
          created_at?: string
          document_name?: string
          document_type?: string | null
          employee_id?: string
          expiry_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string
          uploaded_by?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
      engagement_surveys: {
        Row: {
          created_at: string
          created_by: string
          end_date: string
          id: string
          is_anonymous: boolean | null
          start_date: string
          status: string
          survey_description: string | null
          survey_questions: Json
          survey_title: string
          target_departments: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_date: string
          id?: string
          is_anonymous?: boolean | null
          start_date: string
          status?: string
          survey_description?: string | null
          survey_questions?: Json
          survey_title: string
          target_departments?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_date?: string
          id?: string
          is_anonymous?: boolean | null
          start_date?: string
          status?: string
          survey_description?: string | null
          survey_questions?: Json
          survey_title?: string
          target_departments?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_surveys_created_by_fkey"
            columns: ["created_by"]
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
          assessment_data: Json | null
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
          interview_data: Json | null
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
          review_completed: boolean | null
          review_data: Json | null
          review_notes: string | null
          review_stage_status: string | null
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
          assessment_data?: Json | null
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
          interview_data?: Json | null
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
          review_completed?: boolean | null
          review_data?: Json | null
          review_notes?: string | null
          review_stage_status?: string | null
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
          assessment_data?: Json | null
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
          interview_data?: Json | null
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
          review_completed?: boolean | null
          review_data?: Json | null
          review_notes?: string | null
          review_stage_status?: string | null
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
      exam_boards: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          full_name: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      exam_candidates: {
        Row: {
          access_arrangements: string[] | null
          exam_session_id: string | null
          id: string
          registered_at: string
          seat_number: string | null
          status: string
          student_id: string | null
        }
        Insert: {
          access_arrangements?: string[] | null
          exam_session_id?: string | null
          id?: string
          registered_at?: string
          seat_number?: string | null
          status?: string
          student_id?: string | null
        }
        Update: {
          access_arrangements?: string[] | null
          exam_session_id?: string | null
          id?: string
          registered_at?: string
          seat_number?: string | null
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_candidates_exam_session_id_fkey"
            columns: ["exam_session_id"]
            isOneToOne: false
            referencedRelation: "exam_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_candidates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          exam_id: string | null
          feedback: string | null
          grade: string | null
          id: string
          marked_at: string
          marked_by: string | null
          marks_obtained: number
          percentage: number
          rank: number | null
          student_id: string | null
        }
        Insert: {
          exam_id?: string | null
          feedback?: string | null
          grade?: string | null
          id?: string
          marked_at?: string
          marked_by?: string | null
          marks_obtained: number
          percentage: number
          rank?: number | null
          student_id?: string | null
        }
        Update: {
          exam_id?: string | null
          feedback?: string | null
          grade?: string | null
          id?: string
          marked_at?: string
          marked_by?: string | null
          marks_obtained?: number
          percentage?: number
          rank?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          created_at: string
          end_time: string
          exam_id: string | null
          id: string
          invigilator_id: string | null
          max_candidates: number
          room: string | null
          session_date: string
          session_name: string
          start_time: string
          status: string
        }
        Insert: {
          created_at?: string
          end_time: string
          exam_id?: string | null
          id?: string
          invigilator_id?: string | null
          max_candidates?: number
          room?: string | null
          session_date: string
          session_name: string
          start_time: string
          status?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          exam_id?: string | null
          id?: string
          invigilator_id?: string | null
          max_candidates?: number
          room?: string | null
          session_date?: string
          session_name?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_sessions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_term: string | null
          academic_year: string
          created_at: string
          created_by: string | null
          duration_minutes: number
          end_time: string
          exam_board: string | null
          exam_date: string
          exam_type: string
          grade_level: string | null
          id: string
          instructions: string | null
          is_active: boolean
          school_id: string | null
          start_time: string
          subject: string
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          academic_term?: string | null
          academic_year: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          end_time: string
          exam_board?: string | null
          exam_date: string
          exam_type: string
          grade_level?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          school_id?: string | null
          start_time: string
          subject: string
          title: string
          total_marks?: number
          updated_at?: string
        }
        Update: {
          academic_term?: string | null
          academic_year?: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          end_time?: string
          exam_board?: string | null
          exam_date?: string
          exam_type?: string
          grade_level?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          school_id?: string | null
          start_time?: string
          subject?: string
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: []
      }
      expense_items: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          expense_date: string
          expense_report_id: string
          id: string
          is_reimbursable: boolean | null
          receipt_url: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          expense_date: string
          expense_report_id: string
          id?: string
          is_reimbursable?: boolean | null
          receipt_url?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          expense_report_id?: string
          id?: string
          is_reimbursable?: boolean | null
          receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_items_expense_report_id_fkey"
            columns: ["expense_report_id"]
            isOneToOne: false
            referencedRelation: "expense_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_reports: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          created_at: string
          currency: string | null
          employee_id: string
          id: string
          reimbursement_date: string | null
          report_title: string
          status: string
          submission_date: string
          total_amount: number
          travel_request_id: string | null
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          currency?: string | null
          employee_id: string
          id?: string
          reimbursement_date?: string | null
          report_title: string
          status?: string
          submission_date?: string
          total_amount: number
          travel_request_id?: string | null
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          currency?: string | null
          employee_id?: string
          id?: string
          reimbursement_date?: string | null
          report_title?: string
          status?: string
          submission_date?: string
          total_amount?: number
          travel_request_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_reports_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_reports_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_reports_travel_request_id_fkey"
            columns: ["travel_request_id"]
            isOneToOne: false
            referencedRelation: "travel_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean | null
          message: string
          priority: string
          school_id: string
          target_audience: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          message: string
          priority?: string
          school_id: string
          target_audience?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: string
          school_id?: string
          target_audience?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fee_discounts: {
        Row: {
          applicable_fee_types: string[] | null
          conditions: string | null
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          id: string
          name: string
          school_id: string
          status: string
          updated_at: string
          valid_from: string
          valid_to: string
          value: number
        }
        Insert: {
          applicable_fee_types?: string[] | null
          conditions?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          id?: string
          name: string
          school_id: string
          status?: string
          updated_at?: string
          valid_from: string
          valid_to: string
          value: number
        }
        Update: {
          applicable_fee_types?: string[] | null
          conditions?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          id?: string
          name?: string
          school_id?: string
          status?: string
          updated_at?: string
          valid_from?: string
          valid_to?: string
          value?: number
        }
        Relationships: []
      }
      fee_heads: {
        Row: {
          amount: number
          applicable_classes: string[] | null
          applicable_genders: string[] | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          recurrence: string
          school_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          applicable_classes?: string[] | null
          applicable_genders?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          recurrence?: string
          school_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          applicable_classes?: string[] | null
          applicable_genders?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          recurrence?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      fee_structures: {
        Row: {
          academic_year: string
          applicable_year_groups: string[] | null
          created_at: string
          description: string | null
          fee_heads: Json
          id: string
          name: string
          school_id: string
          status: string
          student_type: string | null
          term: string
          total_amount: number
          updated_at: string
          year_group_amounts: Json | null
        }
        Insert: {
          academic_year: string
          applicable_year_groups?: string[] | null
          created_at?: string
          description?: string | null
          fee_heads?: Json
          id?: string
          name: string
          school_id: string
          status?: string
          student_type?: string | null
          term: string
          total_amount?: number
          updated_at?: string
          year_group_amounts?: Json | null
        }
        Update: {
          academic_year?: string
          applicable_year_groups?: string[] | null
          created_at?: string
          description?: string | null
          fee_heads?: Json
          id?: string
          name?: string
          school_id?: string
          status?: string
          student_type?: string | null
          term?: string
          total_amount?: number
          updated_at?: string
          year_group_amounts?: Json | null
        }
        Relationships: []
      }
      fee_waivers: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          created_at: string
          fee_type: string
          id: string
          notes: string | null
          original_amount: number
          reason: string
          request_date: string
          requested_by: string | null
          school_id: string
          status: string
          student_id: string
          student_name: string
          supporting_documents: string[] | null
          updated_at: string
          waived_amount: number
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          fee_type: string
          id?: string
          notes?: string | null
          original_amount: number
          reason: string
          request_date?: string
          requested_by?: string | null
          school_id: string
          status?: string
          student_id: string
          student_name: string
          supporting_documents?: string[] | null
          updated_at?: string
          waived_amount: number
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          fee_type?: string
          id?: string
          notes?: string | null
          original_amount?: number
          reason?: string
          request_date?: string
          requested_by?: string | null
          school_id?: string
          status?: string
          student_id?: string
          student_name?: string
          supporting_documents?: string[] | null
          updated_at?: string
          waived_amount?: number
        }
        Relationships: []
      }
      field_permissions: {
        Row: {
          created_at: string
          field_name: string
          id: string
          is_editable: boolean
          is_required: boolean
          is_visible: boolean
          module_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          is_editable?: boolean
          is_required?: boolean
          is_visible?: boolean
          module_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          is_editable?: boolean
          is_required?: boolean
          is_visible?: boolean
          module_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      gradebook_records: {
        Row: {
          assessment_id: string | null
          assessment_type: string
          created_at: string | null
          grade_points: number | null
          grade_text: string
          id: string
          notes: string | null
          percentage: number | null
          recorded_at: string | null
          recorded_by: string
          student_id: string
          subject: string
          term: string
          topic_id: string | null
          updated_at: string | null
          year_group: string
        }
        Insert: {
          assessment_id?: string | null
          assessment_type: string
          created_at?: string | null
          grade_points?: number | null
          grade_text: string
          id?: string
          notes?: string | null
          percentage?: number | null
          recorded_at?: string | null
          recorded_by: string
          student_id: string
          subject: string
          term: string
          topic_id?: string | null
          updated_at?: string | null
          year_group: string
        }
        Update: {
          assessment_id?: string | null
          assessment_type?: string
          created_at?: string | null
          grade_points?: number | null
          grade_text?: string
          id?: string
          notes?: string | null
          percentage?: number | null
          recorded_at?: string | null
          recorded_by?: string
          student_id?: string
          subject?: string
          term?: string
          topic_id?: string | null
          updated_at?: string | null
          year_group?: string
        }
        Relationships: []
      }
      grading_results: {
        Row: {
          assignment_id: string | null
          class_analytics: Json | null
          created_at: string
          feedback: Json | null
          graded_by: string
          grading_type: string
          id: string
          max_marks: number | null
          overall_grade: string | null
          question_grades: Json | null
          rubric_id: string | null
          rubric_scores: Json | null
          school_id: string
          submission_id: string
          total_marks: number | null
          updated_at: string
        }
        Insert: {
          assignment_id?: string | null
          class_analytics?: Json | null
          created_at?: string
          feedback?: Json | null
          graded_by: string
          grading_type?: string
          id?: string
          max_marks?: number | null
          overall_grade?: string | null
          question_grades?: Json | null
          rubric_id?: string | null
          rubric_scores?: Json | null
          school_id: string
          submission_id: string
          total_marks?: number | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string | null
          class_analytics?: Json | null
          created_at?: string
          feedback?: Json | null
          graded_by?: string
          grading_type?: string
          id?: string
          max_marks?: number | null
          overall_grade?: string | null
          question_grades?: Json | null
          rubric_id?: string | null
          rubric_scores?: Json | null
          school_id?: string
          submission_id?: string
          total_marks?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      grading_rubrics: {
        Row: {
          created_at: string
          created_by: string
          criteria: Json
          description: string | null
          id: string
          is_active: boolean
          is_template: boolean
          point_scale: Json
          school_id: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          criteria?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          is_template?: boolean
          point_scale?: Json
          school_id: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          criteria?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          is_template?: boolean
          point_scale?: Json
          school_id?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      house_points: {
        Row: {
          activity_id: string | null
          awarded_by: string
          awarded_date: string
          created_at: string
          house: string
          id: string
          points: number
          reason: string
          school_id: string
          student_id: string
        }
        Insert: {
          activity_id?: string | null
          awarded_by: string
          awarded_date?: string
          created_at?: string
          house: string
          id?: string
          points?: number
          reason: string
          school_id: string
          student_id: string
        }
        Update: {
          activity_id?: string | null
          awarded_by?: string
          awarded_date?: string
          created_at?: string
          house?: string
          id?: string
          points?: number
          reason?: string
          school_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_points_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          created_at: string
          head_of_house_id: string | null
          house_code: string
          house_color: string | null
          house_motto: string | null
          house_name: string
          id: string
          is_active: boolean
          points: number | null
          school_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          head_of_house_id?: string | null
          house_code: string
          house_color?: string | null
          house_motto?: string | null
          house_name: string
          id?: string
          is_active?: boolean
          points?: number | null
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          head_of_house_id?: string | null
          house_code?: string
          house_color?: string | null
          house_motto?: string | null
          house_name?: string
          id?: string
          is_active?: boolean
          points?: number | null
          school_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "houses_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          interest_rate: number | null
          name: string
          number_of_installments: number
          school_id: string
          start_date: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          interest_rate?: number | null
          name: string
          number_of_installments: number
          school_id: string
          start_date?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          interest_rate?: number | null
          name?: string
          number_of_installments?: number
          school_id?: string
          start_date?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      installment_schedules: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          installment_number: number
          plan_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          installment_number: number
          plan_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          installment_number?: number
          plan_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_schedules_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_schedules: {
        Row: {
          application_id: string | null
          candidate_feedback: string | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          interview_notes: string | null
          interview_stage_id: string | null
          interview_type: string | null
          interviewer_feedback: Json | null
          interviewer_ids: Json
          location: string | null
          meeting_link: string | null
          overall_rating: number | null
          recommendation: string | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          candidate_feedback?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          interview_notes?: string | null
          interview_stage_id?: string | null
          interview_type?: string | null
          interviewer_feedback?: Json | null
          interviewer_ids: Json
          location?: string | null
          meeting_link?: string | null
          overall_rating?: number | null
          recommendation?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          candidate_feedback?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          interview_notes?: string | null
          interview_stage_id?: string | null
          interview_type?: string | null
          interviewer_feedback?: Json | null
          interviewer_ids?: Json
          location?: string | null
          meeting_link?: string | null
          overall_rating?: number | null
          recommendation?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_schedules_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_schedules_interview_stage_id_fkey"
            columns: ["interview_stage_id"]
            isOneToOne: false
            referencedRelation: "interview_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_stages: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          evaluation_criteria: Json | null
          id: string
          interviewers: Json | null
          is_mandatory: boolean | null
          job_posting_id: string | null
          required_skills_focus: Json | null
          stage_name: string
          stage_order: number
          stage_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          evaluation_criteria?: Json | null
          id?: string
          interviewers?: Json | null
          is_mandatory?: boolean | null
          job_posting_id?: string | null
          required_skills_focus?: Json | null
          stage_name: string
          stage_order: number
          stage_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          evaluation_criteria?: Json | null
          id?: string
          interviewers?: Json | null
          is_mandatory?: boolean | null
          job_posting_id?: string | null
          required_skills_focus?: Json | null
          stage_name?: string
          stage_order?: number
          stage_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_stages_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          tax_rate: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          line_total: number
          quantity?: number
          tax_rate?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          tax_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_due: number
          created_at: string
          created_by: string | null
          currency: string
          customer_address: Json | null
          customer_email: string | null
          customer_name: string
          discount_amount: number
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          paid_amount: number
          status: string
          subtotal: number
          tax_amount: number
          terms_conditions: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          balance_due?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_address?: Json | null
          customer_email?: string | null
          customer_name: string
          discount_amount?: number
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          paid_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          balance_due?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_address?: Json | null
          customer_email?: string | null
          customer_name?: string
          discount_amount?: number
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          paid_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          application_score: number | null
          application_source: string | null
          application_status: string
          auto_screening_passed: boolean | null
          candidate_id: string | null
          cover_letter: string | null
          created_at: string
          current_stage: string | null
          id: string
          interview_notes: string | null
          interview_scheduled_at: string | null
          interviewer_id: string | null
          job_posting_id: string
          priority_level: number | null
          rejection_feedback: string | null
          rejection_reason: string | null
          resume_score: number | null
          resume_url: string | null
          screening_answers: Json | null
          updated_at: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          application_score?: number | null
          application_source?: string | null
          application_status?: string
          auto_screening_passed?: boolean | null
          candidate_id?: string | null
          cover_letter?: string | null
          created_at?: string
          current_stage?: string | null
          id?: string
          interview_notes?: string | null
          interview_scheduled_at?: string | null
          interviewer_id?: string | null
          job_posting_id: string
          priority_level?: number | null
          rejection_feedback?: string | null
          rejection_reason?: string | null
          resume_score?: number | null
          resume_url?: string | null
          screening_answers?: Json | null
          updated_at?: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          application_score?: number | null
          application_source?: string | null
          application_status?: string
          auto_screening_passed?: boolean | null
          candidate_id?: string | null
          cover_letter?: string | null
          created_at?: string
          current_stage?: string | null
          id?: string
          interview_notes?: string | null
          interview_scheduled_at?: string | null
          interviewer_id?: string | null
          job_posting_id?: string
          priority_level?: number | null
          rejection_feedback?: string | null
          rejection_reason?: string | null
          resume_score?: number | null
          resume_url?: string | null
          screening_answers?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_pool"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_offers: {
        Row: {
          accepted_date: string | null
          application_id: string | null
          approved_by: string | null
          base_salary: number
          benefits_package: Json | null
          bonus_structure: Json | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          department: string | null
          equity_details: Json | null
          id: string
          negotiation_notes: string | null
          notice_period_weeks: number | null
          offer_expiry_date: string | null
          offer_letter_url: string | null
          position_title: string
          probation_period_months: number | null
          rejected_reason: string | null
          reporting_manager: string | null
          response_date: string | null
          sent_date: string | null
          special_conditions: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          work_arrangement: string | null
        }
        Insert: {
          accepted_date?: string | null
          application_id?: string | null
          approved_by?: string | null
          base_salary: number
          benefits_package?: Json | null
          bonus_structure?: Json | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          department?: string | null
          equity_details?: Json | null
          id?: string
          negotiation_notes?: string | null
          notice_period_weeks?: number | null
          offer_expiry_date?: string | null
          offer_letter_url?: string | null
          position_title: string
          probation_period_months?: number | null
          rejected_reason?: string | null
          reporting_manager?: string | null
          response_date?: string | null
          sent_date?: string | null
          special_conditions?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          work_arrangement?: string | null
        }
        Update: {
          accepted_date?: string | null
          application_id?: string | null
          approved_by?: string | null
          base_salary?: number
          benefits_package?: Json | null
          bonus_structure?: Json | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          department?: string | null
          equity_details?: Json | null
          id?: string
          negotiation_notes?: string | null
          notice_period_weeks?: number | null
          offer_expiry_date?: string | null
          offer_letter_url?: string | null
          position_title?: string
          probation_period_months?: number | null
          rejected_reason?: string | null
          reporting_manager?: string | null
          response_date?: string | null
          sent_date?: string | null
          special_conditions?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          work_arrangement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_offers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_offers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_offers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_offers_reporting_manager_fkey"
            columns: ["reporting_manager"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          applications_count: number | null
          closing_date: string | null
          created_at: string
          department_id: string | null
          employment_type: string
          external_job_boards: Json | null
          id: string
          job_description: string
          job_title: string
          location: string | null
          posted_by: string
          posting_channels: Json | null
          posting_date: string
          requirements: string | null
          requisition_id: string | null
          salary_range_max: number | null
          salary_range_min: number | null
          screening_questions: Json | null
          seo_keywords: string[] | null
          status: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          application_deadline?: string | null
          applications_count?: number | null
          closing_date?: string | null
          created_at?: string
          department_id?: string | null
          employment_type: string
          external_job_boards?: Json | null
          id?: string
          job_description: string
          job_title: string
          location?: string | null
          posted_by: string
          posting_channels?: Json | null
          posting_date?: string
          requirements?: string | null
          requisition_id?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          screening_questions?: Json | null
          seo_keywords?: string[] | null
          status?: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          application_deadline?: string | null
          applications_count?: number | null
          closing_date?: string | null
          created_at?: string
          department_id?: string | null
          employment_type?: string
          external_job_boards?: Json | null
          id?: string
          job_description?: string
          job_title?: string
          location?: string | null
          posted_by?: string
          posting_channels?: Json | null
          posting_date?: string
          requirements?: string | null
          requisition_id?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          screening_questions?: Json | null
          seo_keywords?: string[] | null
          status?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_requisition_id_fkey"
            columns: ["requisition_id"]
            isOneToOne: false
            referencedRelation: "job_requisitions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_requisitions: {
        Row: {
          approval_status: string | null
          approved_by: string | null
          approved_date: string | null
          budget_allocated: number | null
          created_at: string | null
          currency: string | null
          employment_type: string | null
          experience_level: string | null
          hiring_manager_id: string | null
          hr_partner_id: string | null
          id: string
          job_description: string
          job_title: string
          justification: string | null
          location: string | null
          number_of_positions: number | null
          preferred_skills: Json | null
          remote_work_allowed: boolean | null
          requested_by: string
          requested_date: string | null
          requesting_department_id: string | null
          required_skills: Json | null
          requisition_number: string
          salary_range_max: number | null
          salary_range_min: number | null
          status: string | null
          target_start_date: string | null
          updated_at: string | null
          urgent_priority: boolean | null
        }
        Insert: {
          approval_status?: string | null
          approved_by?: string | null
          approved_date?: string | null
          budget_allocated?: number | null
          created_at?: string | null
          currency?: string | null
          employment_type?: string | null
          experience_level?: string | null
          hiring_manager_id?: string | null
          hr_partner_id?: string | null
          id?: string
          job_description: string
          job_title: string
          justification?: string | null
          location?: string | null
          number_of_positions?: number | null
          preferred_skills?: Json | null
          remote_work_allowed?: boolean | null
          requested_by: string
          requested_date?: string | null
          requesting_department_id?: string | null
          required_skills?: Json | null
          requisition_number: string
          salary_range_max?: number | null
          salary_range_min?: number | null
          status?: string | null
          target_start_date?: string | null
          updated_at?: string | null
          urgent_priority?: boolean | null
        }
        Update: {
          approval_status?: string | null
          approved_by?: string | null
          approved_date?: string | null
          budget_allocated?: number | null
          created_at?: string | null
          currency?: string | null
          employment_type?: string | null
          experience_level?: string | null
          hiring_manager_id?: string | null
          hr_partner_id?: string | null
          id?: string
          job_description?: string
          job_title?: string
          justification?: string | null
          location?: string | null
          number_of_positions?: number | null
          preferred_skills?: Json | null
          remote_work_allowed?: boolean | null
          requested_by?: string
          requested_date?: string | null
          requesting_department_id?: string | null
          required_skills?: Json | null
          requisition_number?: string
          salary_range_max?: number | null
          salary_range_min?: number | null
          status?: string | null
          target_start_date?: string | null
          updated_at?: string | null
          urgent_priority?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "job_requisitions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requisitions_hiring_manager_id_fkey"
            columns: ["hiring_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requisitions_hr_partner_id_fkey"
            columns: ["hr_partner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requisitions_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requisitions_requesting_department_id_fkey"
            columns: ["requesting_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
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
      lesson_plan_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          created_at: string
          id: string
          lesson_plan_id: string
          permissions: Json | null
          role: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          created_at?: string
          id?: string
          lesson_plan_id: string
          permissions?: Json | null
          role: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          created_at?: string
          id?: string
          lesson_plan_id?: string
          permissions?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plan_assignments_lesson_plan_id_fkey"
            columns: ["lesson_plan_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plan_comments: {
        Row: {
          comment: string
          comment_type: string | null
          created_at: string
          id: string
          is_private: boolean | null
          lesson_plan_id: string
          user_id: string
        }
        Insert: {
          comment: string
          comment_type?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          lesson_plan_id: string
          user_id: string
        }
        Update: {
          comment?: string
          comment_type?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          lesson_plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plan_comments_lesson_plan_id_fkey"
            columns: ["lesson_plan_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          approval_comments: string | null
          approved_at: string | null
          approved_by: string | null
          assessment: Json | null
          collaboration: Json | null
          created_at: string
          curriculum_topic_id: string | null
          differentiation: Json | null
          duration_minutes: number
          form_class: string | null
          id: string
          integration: Json | null
          learning_objectives: Json | null
          lesson_date: string
          lesson_sections: Json | null
          period_id: string | null
          post_lesson_reflection: Json | null
          resources: Json | null
          school_id: string
          sequence: Json | null
          status: string
          subject: string
          success_criteria: Json | null
          teacher_id: string
          title: string
          updated_at: string
          year_group: string
        }
        Insert: {
          approval_comments?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assessment?: Json | null
          collaboration?: Json | null
          created_at?: string
          curriculum_topic_id?: string | null
          differentiation?: Json | null
          duration_minutes?: number
          form_class?: string | null
          id?: string
          integration?: Json | null
          learning_objectives?: Json | null
          lesson_date: string
          lesson_sections?: Json | null
          period_id?: string | null
          post_lesson_reflection?: Json | null
          resources?: Json | null
          school_id: string
          sequence?: Json | null
          status?: string
          subject: string
          success_criteria?: Json | null
          teacher_id: string
          title: string
          updated_at?: string
          year_group: string
        }
        Update: {
          approval_comments?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assessment?: Json | null
          collaboration?: Json | null
          created_at?: string
          curriculum_topic_id?: string | null
          differentiation?: Json | null
          duration_minutes?: number
          form_class?: string | null
          id?: string
          integration?: Json | null
          learning_objectives?: Json | null
          lesson_date?: string
          lesson_sections?: Json | null
          period_id?: string | null
          post_lesson_reflection?: Json | null
          resources?: Json | null
          school_id?: string
          sequence?: Json | null
          status?: string
          subject?: string
          success_criteria?: Json | null
          teacher_id?: string
          title?: string
          updated_at?: string
          year_group?: string
        }
        Relationships: []
      }
      library_accession_sequence: {
        Row: {
          last_accession_number: number
          school_id: string
          updated_at: string
        }
        Insert: {
          last_accession_number?: number
          school_id: string
          updated_at?: string
        }
        Update: {
          last_accession_number?: number
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_accession_sequence_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_audit_log: {
        Row: {
          action: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          performed_at: string
          performed_by: string | null
          school_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string | null
          school_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string | null
          school_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_audit_log_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_book_copies: {
        Row: {
          accession_number: number
          acquisition_date: string
          barcode: string | null
          call_number: string
          condition: string | null
          copy_number: number
          created_at: string
          created_by: string | null
          donation_id: string | null
          id: string
          invoice_number: string | null
          is_reference: boolean
          price: number | null
          purchase_id: string | null
          rack_id: string | null
          remarks: string | null
          rfid_tag: string | null
          school_id: string
          shelf_number: string | null
          source: Database["public"]["Enums"]["library_source_type"]
          status: Database["public"]["Enums"]["library_book_status"]
          title_id: string
          updated_at: string
          vendor_name: string | null
          withdrawn_approved_by: string | null
          withdrawn_date: string | null
          withdrawn_reason: string | null
        }
        Insert: {
          accession_number: number
          acquisition_date?: string
          barcode?: string | null
          call_number: string
          condition?: string | null
          copy_number?: number
          created_at?: string
          created_by?: string | null
          donation_id?: string | null
          id?: string
          invoice_number?: string | null
          is_reference?: boolean
          price?: number | null
          purchase_id?: string | null
          rack_id?: string | null
          remarks?: string | null
          rfid_tag?: string | null
          school_id: string
          shelf_number?: string | null
          source?: Database["public"]["Enums"]["library_source_type"]
          status?: Database["public"]["Enums"]["library_book_status"]
          title_id: string
          updated_at?: string
          vendor_name?: string | null
          withdrawn_approved_by?: string | null
          withdrawn_date?: string | null
          withdrawn_reason?: string | null
        }
        Update: {
          accession_number?: number
          acquisition_date?: string
          barcode?: string | null
          call_number?: string
          condition?: string | null
          copy_number?: number
          created_at?: string
          created_by?: string | null
          donation_id?: string | null
          id?: string
          invoice_number?: string | null
          is_reference?: boolean
          price?: number | null
          purchase_id?: string | null
          rack_id?: string | null
          remarks?: string | null
          rfid_tag?: string | null
          school_id?: string
          shelf_number?: string | null
          source?: Database["public"]["Enums"]["library_source_type"]
          status?: Database["public"]["Enums"]["library_book_status"]
          title_id?: string
          updated_at?: string
          vendor_name?: string | null
          withdrawn_approved_by?: string | null
          withdrawn_date?: string | null
          withdrawn_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_book_copies_rack_id_fkey"
            columns: ["rack_id"]
            isOneToOne: false
            referencedRelation: "library_racks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_book_copies_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_book_copies_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "library_book_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      library_book_titles: {
        Row: {
          authors: string[]
          available_copies: number
          binding: string | null
          book_type: Database["public"]["Enums"]["library_book_type"]
          call_number_base: string | null
          category: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          ddc_number: string | null
          description: string | null
          edition: string | null
          id: string
          isbn: string | null
          keywords: string[] | null
          language: string
          pages: number | null
          publication_year: number | null
          publisher: string | null
          school_id: string
          subcategory: string | null
          subtitle: string | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          authors?: string[]
          available_copies?: number
          binding?: string | null
          book_type?: Database["public"]["Enums"]["library_book_type"]
          call_number_base?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          ddc_number?: string | null
          description?: string | null
          edition?: string | null
          id?: string
          isbn?: string | null
          keywords?: string[] | null
          language?: string
          pages?: number | null
          publication_year?: number | null
          publisher?: string | null
          school_id: string
          subcategory?: string | null
          subtitle?: string | null
          title: string
          total_copies?: number
          updated_at?: string
        }
        Update: {
          authors?: string[]
          available_copies?: number
          binding?: string | null
          book_type?: Database["public"]["Enums"]["library_book_type"]
          call_number_base?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          ddc_number?: string | null
          description?: string | null
          edition?: string | null
          id?: string
          isbn?: string | null
          keywords?: string[] | null
          language?: string
          pages?: number | null
          publication_year?: number | null
          publisher?: string | null
          school_id?: string
          subcategory?: string | null
          subtitle?: string | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_book_titles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_circulation: {
        Row: {
          copy_id: string
          created_at: string
          due_date: string
          fine_amount: number | null
          fine_paid: boolean | null
          id: string
          is_overdue: boolean
          issue_date: string
          issued_by: string | null
          last_renewed_date: string | null
          member_id: string
          overdue_days: number | null
          remarks: string | null
          renewal_count: number
          return_condition: string | null
          return_date: string | null
          returned_by: string | null
          school_id: string
          status: string
          updated_at: string
        }
        Insert: {
          copy_id: string
          created_at?: string
          due_date: string
          fine_amount?: number | null
          fine_paid?: boolean | null
          id?: string
          is_overdue?: boolean
          issue_date?: string
          issued_by?: string | null
          last_renewed_date?: string | null
          member_id: string
          overdue_days?: number | null
          remarks?: string | null
          renewal_count?: number
          return_condition?: string | null
          return_date?: string | null
          returned_by?: string | null
          school_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          copy_id?: string
          created_at?: string
          due_date?: string
          fine_amount?: number | null
          fine_paid?: boolean | null
          id?: string
          is_overdue?: boolean
          issue_date?: string
          issued_by?: string | null
          last_renewed_date?: string | null
          member_id?: string
          overdue_days?: number | null
          remarks?: string | null
          renewal_count?: number
          return_condition?: string | null
          return_date?: string | null
          returned_by?: string | null
          school_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_circulation_copy_id_fkey"
            columns: ["copy_id"]
            isOneToOne: false
            referencedRelation: "library_book_copies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_circulation_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "library_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_circulation_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_donations: {
        Row: {
          accession_end: number | null
          accession_start: number | null
          acknowledgement_date: string | null
          acknowledgement_letter_ref: string | null
          acknowledgement_sent: boolean | null
          created_at: string
          created_by: string | null
          donation_date: string
          donation_number: string
          donor_address: string | null
          donor_contact: string | null
          donor_email: string | null
          donor_name: string
          donor_type: string | null
          estimated_value: number | null
          id: string
          occasion: string | null
          purpose: string | null
          received_by: string | null
          remarks: string | null
          school_id: string
          thanked_by: string | null
          total_books: number
          updated_at: string
        }
        Insert: {
          accession_end?: number | null
          accession_start?: number | null
          acknowledgement_date?: string | null
          acknowledgement_letter_ref?: string | null
          acknowledgement_sent?: boolean | null
          created_at?: string
          created_by?: string | null
          donation_date?: string
          donation_number: string
          donor_address?: string | null
          donor_contact?: string | null
          donor_email?: string | null
          donor_name: string
          donor_type?: string | null
          estimated_value?: number | null
          id?: string
          occasion?: string | null
          purpose?: string | null
          received_by?: string | null
          remarks?: string | null
          school_id: string
          thanked_by?: string | null
          total_books?: number
          updated_at?: string
        }
        Update: {
          accession_end?: number | null
          accession_start?: number | null
          acknowledgement_date?: string | null
          acknowledgement_letter_ref?: string | null
          acknowledgement_sent?: boolean | null
          created_at?: string
          created_by?: string | null
          donation_date?: string
          donation_number?: string
          donor_address?: string | null
          donor_contact?: string | null
          donor_email?: string | null
          donor_name?: string
          donor_type?: string | null
          estimated_value?: number | null
          id?: string
          occasion?: string | null
          purpose?: string | null
          received_by?: string | null
          remarks?: string | null
          school_id?: string
          thanked_by?: string | null
          total_books?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_donations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_fines: {
        Row: {
          balance: number
          circulation_id: string | null
          closure_date: string | null
          collected_by: string | null
          copy_id: string | null
          created_at: string
          due_date: string | null
          fine_amount: number
          fine_date: string
          fine_type: string
          id: string
          member_id: string
          paid_amount: number
          payment_date: string | null
          payment_method: string | null
          receipt_number: string | null
          recovery_action: string | null
          remarks: string | null
          replacement_accession_number: number | null
          replacement_date: string | null
          replacement_received: boolean | null
          school_id: string
          status: Database["public"]["Enums"]["library_fine_status"]
          updated_at: string
        }
        Insert: {
          balance: number
          circulation_id?: string | null
          closure_date?: string | null
          collected_by?: string | null
          copy_id?: string | null
          created_at?: string
          due_date?: string | null
          fine_amount: number
          fine_date?: string
          fine_type: string
          id?: string
          member_id: string
          paid_amount?: number
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          recovery_action?: string | null
          remarks?: string | null
          replacement_accession_number?: number | null
          replacement_date?: string | null
          replacement_received?: boolean | null
          school_id: string
          status?: Database["public"]["Enums"]["library_fine_status"]
          updated_at?: string
        }
        Update: {
          balance?: number
          circulation_id?: string | null
          closure_date?: string | null
          collected_by?: string | null
          copy_id?: string | null
          created_at?: string
          due_date?: string | null
          fine_amount?: number
          fine_date?: string
          fine_type?: string
          id?: string
          member_id?: string
          paid_amount?: number
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          recovery_action?: string | null
          remarks?: string | null
          replacement_accession_number?: number | null
          replacement_date?: string | null
          replacement_received?: boolean | null
          school_id?: string
          status?: Database["public"]["Enums"]["library_fine_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_fines_circulation_id_fkey"
            columns: ["circulation_id"]
            isOneToOne: false
            referencedRelation: "library_circulation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_fines_copy_id_fkey"
            columns: ["copy_id"]
            isOneToOne: false
            referencedRelation: "library_book_copies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_fines_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "library_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_fines_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_members: {
        Row: {
          admission_number: string | null
          blocked_reason: string | null
          card_expiry_date: string | null
          card_issued_date: string | null
          class_name: string | null
          created_at: string
          current_borrowed: number
          department: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          is_blocked: boolean
          library_card_number: string | null
          member_type: Database["public"]["Enums"]["library_member_type"]
          parent_contact: string | null
          phone: string | null
          roll_number: string | null
          school_id: string
          section: string | null
          staff_db_id: string | null
          staff_id: string | null
          student_id: string | null
          total_borrowed: number
          total_fines_pending: number
          updated_at: string
        }
        Insert: {
          admission_number?: string | null
          blocked_reason?: string | null
          card_expiry_date?: string | null
          card_issued_date?: string | null
          class_name?: string | null
          created_at?: string
          current_borrowed?: number
          department?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          library_card_number?: string | null
          member_type: Database["public"]["Enums"]["library_member_type"]
          parent_contact?: string | null
          phone?: string | null
          roll_number?: string | null
          school_id: string
          section?: string | null
          staff_db_id?: string | null
          staff_id?: string | null
          student_id?: string | null
          total_borrowed?: number
          total_fines_pending?: number
          updated_at?: string
        }
        Update: {
          admission_number?: string | null
          blocked_reason?: string | null
          card_expiry_date?: string | null
          card_issued_date?: string | null
          class_name?: string | null
          created_at?: string
          current_borrowed?: number
          department?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          library_card_number?: string | null
          member_type?: Database["public"]["Enums"]["library_member_type"]
          parent_contact?: string | null
          phone?: string | null
          roll_number?: string | null
          school_id?: string
          section?: string | null
          staff_db_id?: string | null
          staff_id?: string | null
          student_id?: string | null
          total_borrowed?: number
          total_fines_pending?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_members_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_members_staff_db_id_fkey"
            columns: ["staff_db_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      library_purchases: {
        Row: {
          accession_end: number | null
          accession_start: number | null
          approved_by: string | null
          approved_date: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          id: string
          invoice_amount: number | null
          invoice_date: string | null
          invoice_number: string | null
          net_amount: number
          order_date: string | null
          order_number: string | null
          payment_date: string | null
          payment_reference: string | null
          payment_status: string | null
          purchase_date: string
          purchase_number: string
          remarks: string | null
          school_id: string
          tax_amount: number | null
          total_amount: number
          total_books: number
          updated_at: string
          vendor_address: string | null
          vendor_contact: string | null
          vendor_gst: string | null
          vendor_name: string
        }
        Insert: {
          accession_end?: number | null
          accession_start?: number | null
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          invoice_amount?: number | null
          invoice_date?: string | null
          invoice_number?: string | null
          net_amount?: number
          order_date?: string | null
          order_number?: string | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          purchase_date?: string
          purchase_number: string
          remarks?: string | null
          school_id: string
          tax_amount?: number | null
          total_amount?: number
          total_books?: number
          updated_at?: string
          vendor_address?: string | null
          vendor_contact?: string | null
          vendor_gst?: string | null
          vendor_name: string
        }
        Update: {
          accession_end?: number | null
          accession_start?: number | null
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          invoice_amount?: number | null
          invoice_date?: string | null
          invoice_number?: string | null
          net_amount?: number
          order_date?: string | null
          order_number?: string | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          purchase_date?: string
          purchase_number?: string
          remarks?: string | null
          school_id?: string
          tax_amount?: number | null
          total_amount?: number
          total_books?: number
          updated_at?: string
          vendor_address?: string | null
          vendor_contact?: string | null
          vendor_gst?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_purchases_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_racks: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          floor: string | null
          id: string
          is_active: boolean
          rack_code: string
          rack_name: string
          room: string | null
          school_id: string
          section: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean
          rack_code: string
          rack_name: string
          room?: string | null
          school_id: string
          section?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean
          rack_code?: string
          rack_name?: string
          room?: string | null
          school_id?: string
          section?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_racks_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_reservations: {
        Row: {
          created_at: string
          expiry_date: string | null
          fulfilled_copy_id: string | null
          fulfilled_date: string | null
          id: string
          member_id: string
          notification_sent: boolean | null
          notified_date: string | null
          queue_position: number | null
          reserved_date: string
          school_id: string
          status: string
          title_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          fulfilled_copy_id?: string | null
          fulfilled_date?: string | null
          id?: string
          member_id: string
          notification_sent?: boolean | null
          notified_date?: string | null
          queue_position?: number | null
          reserved_date?: string
          school_id: string
          status?: string
          title_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          fulfilled_copy_id?: string | null
          fulfilled_date?: string | null
          id?: string
          member_id?: string
          notification_sent?: boolean | null
          notified_date?: string | null
          queue_position?: number | null
          reserved_date?: string
          school_id?: string
          status?: string
          title_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_reservations_fulfilled_copy_id_fkey"
            columns: ["fulfilled_copy_id"]
            isOneToOne: false
            referencedRelation: "library_book_copies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_reservations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "library_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_reservations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_reservations_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "library_book_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      library_settings: {
        Row: {
          academic_year: string | null
          allow_reservations: boolean
          created_at: string
          grace_period_days: number
          id: string
          lost_book_processing_fee: number
          school_id: string
          staff_fine_per_day: number
          staff_loan_days: number
          staff_max_books: number
          staff_max_renewals: number
          student_fine_per_day: number
          student_loan_days: number
          student_max_books: number
          student_max_renewals: number
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          allow_reservations?: boolean
          created_at?: string
          grace_period_days?: number
          id?: string
          lost_book_processing_fee?: number
          school_id: string
          staff_fine_per_day?: number
          staff_loan_days?: number
          staff_max_books?: number
          staff_max_renewals?: number
          student_fine_per_day?: number
          student_loan_days?: number
          student_max_books?: number
          student_max_renewals?: number
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          allow_reservations?: boolean
          created_at?: string
          grace_period_days?: number
          id?: string
          lost_book_processing_fee?: number
          school_id?: string
          staff_fine_per_day?: number
          staff_loan_days?: number
          staff_max_books?: number
          staff_max_renewals?: number
          student_fine_per_day?: number
          student_loan_days?: number
          student_max_books?: number
          student_max_renewals?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_stock_verification_items: {
        Row: {
          condition_at_verification: string | null
          copy_id: string
          created_at: string
          found_at_location: string | null
          found_at_rack_id: string | null
          id: string
          remarks: string | null
          status: Database["public"]["Enums"]["library_verification_status"]
          verification_id: string
          verified_by: string | null
          verified_date: string | null
        }
        Insert: {
          condition_at_verification?: string | null
          copy_id: string
          created_at?: string
          found_at_location?: string | null
          found_at_rack_id?: string | null
          id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["library_verification_status"]
          verification_id: string
          verified_by?: string | null
          verified_date?: string | null
        }
        Update: {
          condition_at_verification?: string | null
          copy_id?: string
          created_at?: string
          found_at_location?: string | null
          found_at_rack_id?: string | null
          id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["library_verification_status"]
          verification_id?: string
          verified_by?: string | null
          verified_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_stock_verification_items_copy_id_fkey"
            columns: ["copy_id"]
            isOneToOne: false
            referencedRelation: "library_book_copies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_stock_verification_items_found_at_rack_id_fkey"
            columns: ["found_at_rack_id"]
            isOneToOne: false
            referencedRelation: "library_racks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_stock_verification_items_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "library_stock_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      library_stock_verifications: {
        Row: {
          accession_range_end: number | null
          accession_range_start: number | null
          approval_date: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          rack_ids: string[] | null
          remarks: string | null
          school_id: string
          start_date: string
          status: string
          supervised_by: string | null
          total_damaged: number
          total_expected: number
          total_found: number
          total_missing: number
          total_withdrawn: number
          updated_at: string
          verification_name: string
          verification_number: string
          verified_by: string[] | null
        }
        Insert: {
          accession_range_end?: number | null
          accession_range_start?: number | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          rack_ids?: string[] | null
          remarks?: string | null
          school_id: string
          start_date: string
          status?: string
          supervised_by?: string | null
          total_damaged?: number
          total_expected?: number
          total_found?: number
          total_missing?: number
          total_withdrawn?: number
          updated_at?: string
          verification_name: string
          verification_number: string
          verified_by?: string[] | null
        }
        Update: {
          accession_range_end?: number | null
          accession_range_start?: number | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          rack_ids?: string[] | null
          remarks?: string | null
          school_id?: string
          start_date?: string
          status?: string
          supervised_by?: string | null
          total_damaged?: number
          total_expected?: number
          total_found?: number
          total_missing?: number
          total_withdrawn?: number
          updated_at?: string
          verification_name?: string
          verification_number?: string
          verified_by?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "library_stock_verifications_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      library_withdrawals: {
        Row: {
          approval_authority: string | null
          approval_date: string
          approval_reference: string | null
          approved_by: string
          created_at: string
          created_by: string | null
          disposal_amount: number | null
          disposal_date: string | null
          disposal_method: string | null
          disposal_remarks: string | null
          id: string
          reason: string
          remarks: string | null
          school_id: string
          total_books: number
          total_value: number | null
          updated_at: string
          withdrawal_date: string
          withdrawal_number: string
        }
        Insert: {
          approval_authority?: string | null
          approval_date: string
          approval_reference?: string | null
          approved_by: string
          created_at?: string
          created_by?: string | null
          disposal_amount?: number | null
          disposal_date?: string | null
          disposal_method?: string | null
          disposal_remarks?: string | null
          id?: string
          reason: string
          remarks?: string | null
          school_id: string
          total_books?: number
          total_value?: number | null
          updated_at?: string
          withdrawal_date?: string
          withdrawal_number: string
        }
        Update: {
          approval_authority?: string | null
          approval_date?: string
          approval_reference?: string | null
          approved_by?: string
          created_at?: string
          created_by?: string | null
          disposal_amount?: number | null
          disposal_date?: string | null
          disposal_method?: string | null
          disposal_remarks?: string | null
          id?: string
          reason?: string
          remarks?: string | null
          school_id?: string
          total_books?: number
          total_value?: number | null
          updated_at?: string
          withdrawal_date?: string
          withdrawal_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_withdrawals_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_incidents: {
        Row: {
          created_at: string | null
          description: string
          follow_up_notes: string | null
          follow_up_required: boolean | null
          hospital_details: Json | null
          hospital_referral: boolean | null
          id: string
          incident_date: string
          incident_number: string
          incident_type: Database["public"]["Enums"]["incident_type"]
          location: string
          medication_administered: Json | null
          parent_notification_time: string | null
          parent_notified: boolean | null
          reported_by: string
          reviewed_by: string | null
          school_id: string
          severity: Database["public"]["Enums"]["incident_severity"]
          staff_present: string[] | null
          status: Database["public"]["Enums"]["record_status"] | null
          student_id: string
          symptoms: string[] | null
          treated_by: string | null
          treatment_given: string | null
          updated_at: string | null
          witnesses: string[] | null
        }
        Insert: {
          created_at?: string | null
          description: string
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          hospital_details?: Json | null
          hospital_referral?: boolean | null
          id?: string
          incident_date: string
          incident_number?: string
          incident_type: Database["public"]["Enums"]["incident_type"]
          location: string
          medication_administered?: Json | null
          parent_notification_time?: string | null
          parent_notified?: boolean | null
          reported_by: string
          reviewed_by?: string | null
          school_id: string
          severity?: Database["public"]["Enums"]["incident_severity"]
          staff_present?: string[] | null
          status?: Database["public"]["Enums"]["record_status"] | null
          student_id: string
          symptoms?: string[] | null
          treated_by?: string | null
          treatment_given?: string | null
          updated_at?: string | null
          witnesses?: string[] | null
        }
        Update: {
          created_at?: string | null
          description?: string
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          hospital_details?: Json | null
          hospital_referral?: boolean | null
          id?: string
          incident_date?: string
          incident_number?: string
          incident_type?: Database["public"]["Enums"]["incident_type"]
          location?: string
          medication_administered?: Json | null
          parent_notification_time?: string | null
          parent_notified?: boolean | null
          reported_by?: string
          reviewed_by?: string | null
          school_id?: string
          severity?: Database["public"]["Enums"]["incident_severity"]
          staff_present?: string[] | null
          status?: Database["public"]["Enums"]["record_status"] | null
          student_id?: string
          symptoms?: string[] | null
          treated_by?: string | null
          treatment_given?: string | null
          updated_at?: string | null
          witnesses?: string[] | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          created_by: string
          dietary_requirements: string | null
          doctor_details: Json | null
          emergency_contact_medical: Json | null
          id: string
          medical_conditions: string[] | null
          medical_notes: string | null
          medications: Json | null
          school_id: string
          special_needs: string | null
          student_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          created_by: string
          dietary_requirements?: string | null
          doctor_details?: Json | null
          emergency_contact_medical?: Json | null
          id?: string
          medical_conditions?: string[] | null
          medical_notes?: string | null
          medications?: Json | null
          school_id: string
          special_needs?: string | null
          student_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          created_by?: string
          dietary_requirements?: string | null
          doctor_details?: Json | null
          emergency_contact_medical?: Json | null
          id?: string
          medical_conditions?: string[] | null
          medical_notes?: string | null
          medications?: Json | null
          school_id?: string
          special_needs?: string | null
          student_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      medical_visits: {
        Row: {
          attended_by: string | null
          chief_complaint: string | null
          created_at: string
          created_by: string
          discharge_time: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          medications_administered: Json | null
          parent_notification_time: string | null
          parent_notified: boolean | null
          recommendations: string | null
          reference_number: string
          status: Database["public"]["Enums"]["medical_visit_status"]
          student_id: string
          symptoms: string | null
          treatment_given: string | null
          updated_at: string
          visit_type: Database["public"]["Enums"]["medical_visit_type"]
          vital_signs: Json | null
        }
        Insert: {
          attended_by?: string | null
          chief_complaint?: string | null
          created_at?: string
          created_by: string
          discharge_time?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          medications_administered?: Json | null
          parent_notification_time?: string | null
          parent_notified?: boolean | null
          recommendations?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["medical_visit_status"]
          student_id: string
          symptoms?: string | null
          treatment_given?: string | null
          updated_at?: string
          visit_type: Database["public"]["Enums"]["medical_visit_type"]
          vital_signs?: Json | null
        }
        Update: {
          attended_by?: string | null
          chief_complaint?: string | null
          created_at?: string
          created_by?: string
          discharge_time?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          medications_administered?: Json | null
          parent_notification_time?: string | null
          parent_notified?: boolean | null
          recommendations?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["medical_visit_status"]
          student_id?: string
          symptoms?: string | null
          treatment_given?: string | null
          updated_at?: string
          visit_type?: Database["public"]["Enums"]["medical_visit_type"]
          vital_signs?: Json | null
        }
        Relationships: []
      }
      medicine_administration: {
        Row: {
          administered_by: string
          administration_time: string
          consent_document_url: string | null
          created_at: string | null
          dosage: string
          id: string
          medication_name: string
          notes: string | null
          parent_consent: boolean | null
          reason: string | null
          school_id: string
          side_effects: string | null
          student_id: string
          witnessed_by: string | null
        }
        Insert: {
          administered_by: string
          administration_time: string
          consent_document_url?: string | null
          created_at?: string | null
          dosage: string
          id?: string
          medication_name: string
          notes?: string | null
          parent_consent?: boolean | null
          reason?: string | null
          school_id: string
          side_effects?: string | null
          student_id: string
          witnessed_by?: string | null
        }
        Update: {
          administered_by?: string
          administration_time?: string
          consent_document_url?: string | null
          created_at?: string | null
          dosage?: string
          id?: string
          medication_name?: string
          notes?: string | null
          parent_consent?: boolean | null
          reason?: string | null
          school_id?: string
          side_effects?: string | null
          student_id?: string
          witnessed_by?: string | null
        }
        Relationships: []
      }
      module_features: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          feature_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          module_id: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          feature_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          module_id: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          feature_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_features_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_module_id: string | null
          route: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_module_id?: string | null
          route: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_module_id?: string | null
          route?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_parent_module_id_fkey"
            columns: ["parent_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          buddy_assigned: string | null
          checklist_progress: Json | null
          completion_percentage: number | null
          created_at: string | null
          hr_contact: string | null
          id: string
          job_offer_id: string | null
          new_hire_email: string
          notes: string | null
          onboarding_template_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buddy_assigned?: string | null
          checklist_progress?: Json | null
          completion_percentage?: number | null
          created_at?: string | null
          hr_contact?: string | null
          id?: string
          job_offer_id?: string | null
          new_hire_email: string
          notes?: string | null
          onboarding_template_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buddy_assigned?: string | null
          checklist_progress?: Json | null
          completion_percentage?: number | null
          created_at?: string | null
          hr_contact?: string | null
          id?: string
          job_offer_id?: string | null
          new_hire_email?: string
          notes?: string | null
          onboarding_template_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_buddy_assigned_fkey"
            columns: ["buddy_assigned"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_progress_hr_contact_fkey"
            columns: ["hr_contact"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_progress_job_offer_id_fkey"
            columns: ["job_offer_id"]
            isOneToOne: false
            referencedRelation: "job_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_progress_onboarding_template_id_fkey"
            columns: ["onboarding_template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_templates: {
        Row: {
          checklist_items: Json
          created_at: string | null
          created_by: string | null
          department_id: string | null
          document_requirements: Json | null
          equipment_requirements: Json | null
          id: string
          is_active: boolean | null
          position_level: string | null
          template_name: string
          training_modules: Json | null
          updated_at: string | null
        }
        Insert: {
          checklist_items: Json
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          document_requirements?: Json | null
          equipment_requirements?: Json | null
          id?: string
          is_active?: boolean | null
          position_level?: string | null
          template_name: string
          training_modules?: Json | null
          updated_at?: string | null
        }
        Update: {
          checklist_items?: Json
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          document_requirements?: Json | null
          equipment_requirements?: Json | null
          id?: string
          is_active?: boolean | null
          position_level?: string | null
          template_name?: string
          training_modules?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_templates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      outstanding_fees: {
        Row: {
          created_at: string
          due_date: string
          fee_type: string
          id: string
          last_reminder_sent: string | null
          original_amount: number
          outstanding_amount: number | null
          paid_amount: number | null
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          payment_plan_id: string | null
          school_id: string
          status: string
          student_id: string
          student_name: string
          updated_at: string
          year_group: string | null
        }
        Insert: {
          created_at?: string
          due_date: string
          fee_type: string
          id?: string
          last_reminder_sent?: string | null
          original_amount: number
          outstanding_amount?: number | null
          paid_amount?: number | null
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          payment_plan_id?: string | null
          school_id: string
          status?: string
          student_id: string
          student_name: string
          updated_at?: string
          year_group?: string | null
        }
        Update: {
          created_at?: string
          due_date?: string
          fee_type?: string
          id?: string
          last_reminder_sent?: string | null
          original_amount?: number
          outstanding_amount?: number | null
          paid_amount?: number | null
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          payment_plan_id?: string | null
          school_id?: string
          status?: string
          student_id?: string
          student_name?: string
          updated_at?: string
          year_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outstanding_fees_payment_plan_id_fkey"
            columns: ["payment_plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_settings: {
        Row: {
          api_key: string | null
          configuration: Json | null
          created_at: string
          gateway_id: string
          gateway_name: string
          id: string
          is_enabled: boolean
          secret_key: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          configuration?: Json | null
          created_at?: string
          gateway_id: string
          gateway_name: string
          id?: string
          is_enabled?: boolean
          secret_key?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          configuration?: Json | null
          created_at?: string
          gateway_id?: string
          gateway_name?: string
          id?: string
          is_enabled?: boolean
          secret_key?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          amount_due: number | null
          amount_paid: number | null
          cashier_id: string | null
          cashier_name: string | null
          collection_session_id: string | null
          created_at: string
          fee_type: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          parent_name: string | null
          payment_date: string
          payment_method: string
          payment_time: string | null
          receipt_number: string | null
          reference_number: string | null
          school_id: string
          status: string
          student_class: string | null
          student_id: string
          student_name: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          amount_due?: number | null
          amount_paid?: number | null
          cashier_id?: string | null
          cashier_name?: string | null
          collection_session_id?: string | null
          created_at?: string
          fee_type?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          parent_name?: string | null
          payment_date?: string
          payment_method?: string
          payment_time?: string | null
          receipt_number?: string | null
          reference_number?: string | null
          school_id: string
          status?: string
          student_class?: string | null
          student_id: string
          student_name?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          amount_due?: number | null
          amount_paid?: number | null
          cashier_id?: string | null
          cashier_name?: string | null
          collection_session_id?: string | null
          created_at?: string
          fee_type?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          parent_name?: string | null
          payment_date?: string
          payment_method?: string
          payment_time?: string | null
          receipt_number?: string | null
          reference_number?: string | null
          school_id?: string
          status?: string
          student_class?: string | null
          student_id?: string
          student_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_collection_session_id_fkey"
            columns: ["collection_session_id"]
            isOneToOne: false
            referencedRelation: "collection_sessions"
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
      performance_goals: {
        Row: {
          category: string
          created_at: string
          created_by: string
          employee_id: string
          goal_description: string | null
          goal_title: string
          id: string
          priority: string
          progress_percentage: number | null
          status: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          employee_id: string
          goal_description?: string | null
          goal_title: string
          id?: string
          priority?: string
          progress_percentage?: number | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          employee_id?: string
          goal_description?: string | null
          goal_title?: string
          id?: string
          priority?: string
          progress_percentage?: number | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_goals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          approved_at: string | null
          areas_for_improvement: string | null
          created_at: string
          development_plan: string | null
          employee_id: string
          goals_achievement: number | null
          id: string
          overall_rating: number | null
          review_period_end: string
          review_period_start: string
          review_type: string
          reviewer_id: string
          status: string
          strengths: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          areas_for_improvement?: string | null
          created_at?: string
          development_plan?: string | null
          employee_id: string
          goals_achievement?: number | null
          id?: string
          overall_rating?: number | null
          review_period_end: string
          review_period_start: string
          review_type: string
          reviewer_id: string
          status?: string
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          areas_for_improvement?: string | null
          created_at?: string
          development_plan?: string | null
          employee_id?: string
          goals_achievement?: number | null
          id?: string
          overall_rating?: number | null
          review_period_end?: string
          review_period_start?: string
          review_type?: string
          reviewer_id?: string
          status?: string
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhaar_number: string | null
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_login: string | null
          last_name: string
          must_change_password: boolean | null
          pan_number: string | null
          password_reset_at: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhaar_number?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name: string
          must_change_password?: boolean | null
          pan_number?: string | null
          password_reset_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhaar_number?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          must_change_password?: boolean | null
          pan_number?: string | null
          password_reset_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          client_name: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          project_code: string | null
          project_manager_id: string | null
          project_name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_code?: string | null
          project_manager_id?: string | null
          project_name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_code?: string | null
          project_manager_id?: string | null
          project_name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          line_total: number
          purchase_order_id: string
          quantity: number
          received_quantity: number
          tax_rate: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          line_total: number
          purchase_order_id: string
          quantity?: number
          received_quantity?: number
          tax_rate?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          line_total?: number
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number
          tax_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_line_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          currency: string
          delivery_address: Json | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          status: string
          subtotal: number
          tax_amount: number
          terms_conditions: string | null
          total_amount: number
          updated_at: string
          vendor_id: string | null
          vendor_name: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          delivery_address?: Json | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date: string
          po_number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          vendor_id?: string | null
          vendor_name: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          delivery_address?: Json | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      recruitment_metrics: {
        Row: {
          applications_received: number | null
          cost_per_hire: number | null
          created_at: string | null
          id: string
          interviews_conducted: number | null
          job_posting_id: string | null
          metric_date: string | null
          offers_accepted: number | null
          offers_made: number | null
          qualified_candidates: number | null
          source_breakdown: Json | null
          stage_conversion_rates: Json | null
          time_to_hire_days: number | null
        }
        Insert: {
          applications_received?: number | null
          cost_per_hire?: number | null
          created_at?: string | null
          id?: string
          interviews_conducted?: number | null
          job_posting_id?: string | null
          metric_date?: string | null
          offers_accepted?: number | null
          offers_made?: number | null
          qualified_candidates?: number | null
          source_breakdown?: Json | null
          stage_conversion_rates?: Json | null
          time_to_hire_days?: number | null
        }
        Update: {
          applications_received?: number | null
          cost_per_hire?: number | null
          created_at?: string | null
          id?: string
          interviews_conducted?: number | null
          job_posting_id?: string | null
          metric_date?: string | null
          offers_accepted?: number | null
          offers_made?: number | null
          qualified_candidates?: number | null
          source_breakdown?: Json | null
          stage_conversion_rates?: Json | null
          time_to_hire_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_metrics_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_checks: {
        Row: {
          application_id: string | null
          conducted_by: string | null
          contacted_date: string | null
          created_at: string | null
          feedback: Json | null
          id: string
          notes: string | null
          overall_recommendation: string | null
          reference_company: string | null
          reference_email: string | null
          reference_name: string
          reference_phone: string | null
          reference_title: string | null
          relationship_to_candidate: string | null
          response_date: string | null
          updated_at: string | null
          verification_status: string | null
          would_rehire: boolean | null
        }
        Insert: {
          application_id?: string | null
          conducted_by?: string | null
          contacted_date?: string | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          notes?: string | null
          overall_recommendation?: string | null
          reference_company?: string | null
          reference_email?: string | null
          reference_name: string
          reference_phone?: string | null
          reference_title?: string | null
          relationship_to_candidate?: string | null
          response_date?: string | null
          updated_at?: string | null
          verification_status?: string | null
          would_rehire?: boolean | null
        }
        Update: {
          application_id?: string | null
          conducted_by?: string | null
          contacted_date?: string | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          notes?: string | null
          overall_recommendation?: string | null
          reference_company?: string | null
          reference_email?: string | null
          reference_name?: string
          reference_phone?: string | null
          reference_title?: string | null
          relationship_to_candidate?: string | null
          response_date?: string | null
          updated_at?: string | null
          verification_status?: string | null
          would_rehire?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_checks_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_checks_conducted_by_fkey"
            columns: ["conducted_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      report_cards: {
        Row: {
          academic_term: string
          academic_year: string
          attendance_data: Json
          class_name: string
          comments_data: Json
          created_at: string
          curriculum_coverage: Json
          effort_data: Json
          generated_at: string
          generated_by: string
          grades_data: Json
          id: string
          parent_access_enabled: boolean | null
          parent_viewed_at: string | null
          pdf_generated_at: string | null
          pdf_url: string | null
          published_at: string | null
          school_id: string
          status: string
          student_id: string
          student_name: string
          student_photo_url: string | null
          targets: Json
          teacher_id: string
          teacher_name: string
          updated_at: string
          year_group: string
        }
        Insert: {
          academic_term: string
          academic_year: string
          attendance_data?: Json
          class_name: string
          comments_data?: Json
          created_at?: string
          curriculum_coverage?: Json
          effort_data?: Json
          generated_at?: string
          generated_by: string
          grades_data?: Json
          id?: string
          parent_access_enabled?: boolean | null
          parent_viewed_at?: string | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          published_at?: string | null
          school_id: string
          status?: string
          student_id: string
          student_name: string
          student_photo_url?: string | null
          targets?: Json
          teacher_id: string
          teacher_name: string
          updated_at?: string
          year_group: string
        }
        Update: {
          academic_term?: string
          academic_year?: string
          attendance_data?: Json
          class_name?: string
          comments_data?: Json
          created_at?: string
          curriculum_coverage?: Json
          effort_data?: Json
          generated_at?: string
          generated_by?: string
          grades_data?: Json
          id?: string
          parent_access_enabled?: boolean | null
          parent_viewed_at?: string | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          published_at?: string | null
          school_id?: string
          status?: string
          student_id?: string
          student_name?: string
          student_photo_url?: string | null
          targets?: Json
          teacher_id?: string
          teacher_name?: string
          updated_at?: string
          year_group?: string
        }
        Relationships: []
      }
      role_module_permissions: {
        Row: {
          can_approve: boolean
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          created_at: string
          id: string
          module_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          can_approve?: boolean
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          module_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          can_approve?: boolean
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          module_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_module_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
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
      route_efficiency: {
        Row: {
          actual_distance_km: number | null
          actual_duration_minutes: number | null
          analysis_date: string
          assigned_students: number | null
          average_riders: number | null
          average_stop_duration_seconds: number | null
          cost_per_student_per_trip: number | null
          cost_per_trip: number | null
          created_at: string | null
          distance_variance_percentage: number | null
          duration_variance_percentage: number | null
          efficiency_score: number | null
          id: string
          planned_distance_km: number | null
          planned_duration_minutes: number | null
          recommendations: Json | null
          ridership_rate: number | null
          route_id: string | null
          school_id: string
          stops_with_delays: number | null
          total_stops: number | null
          updated_at: string | null
        }
        Insert: {
          actual_distance_km?: number | null
          actual_duration_minutes?: number | null
          analysis_date: string
          assigned_students?: number | null
          average_riders?: number | null
          average_stop_duration_seconds?: number | null
          cost_per_student_per_trip?: number | null
          cost_per_trip?: number | null
          created_at?: string | null
          distance_variance_percentage?: number | null
          duration_variance_percentage?: number | null
          efficiency_score?: number | null
          id?: string
          planned_distance_km?: number | null
          planned_duration_minutes?: number | null
          recommendations?: Json | null
          ridership_rate?: number | null
          route_id?: string | null
          school_id: string
          stops_with_delays?: number | null
          total_stops?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_distance_km?: number | null
          actual_duration_minutes?: number | null
          analysis_date?: string
          assigned_students?: number | null
          average_riders?: number | null
          average_stop_duration_seconds?: number | null
          cost_per_student_per_trip?: number | null
          cost_per_trip?: number | null
          created_at?: string | null
          distance_variance_percentage?: number | null
          duration_variance_percentage?: number | null
          efficiency_score?: number | null
          id?: string
          planned_distance_km?: number | null
          planned_duration_minutes?: number | null
          recommendations?: Json | null
          ridership_rate?: number | null
          route_id?: string | null
          school_id?: string
          stops_with_delays?: number | null
          total_stops?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      route_profiles: {
        Row: {
          apply_school_holidays: boolean | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          custom_holiday_ids: string[] | null
          days_of_week: number[] | null
          description: string | null
          end_time: string
          frequency: string
          id: string
          profile_code: string | null
          profile_name: string
          requires_approval: boolean | null
          school_id: string
          start_time: string
          status: string
          student_pool_criteria: Json | null
          student_pool_type: string
          trip_category: string
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          apply_school_holidays?: boolean | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          custom_holiday_ids?: string[] | null
          days_of_week?: number[] | null
          description?: string | null
          end_time: string
          frequency?: string
          id?: string
          profile_code?: string | null
          profile_name: string
          requires_approval?: boolean | null
          school_id: string
          start_time: string
          status?: string
          student_pool_criteria?: Json | null
          student_pool_type?: string
          trip_category?: string
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          apply_school_holidays?: boolean | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          custom_holiday_ids?: string[] | null
          days_of_week?: number[] | null
          description?: string | null
          end_time?: string
          frequency?: string
          id?: string
          profile_code?: string | null
          profile_name?: string
          requires_approval?: boolean | null
          school_id?: string
          start_time?: string
          status?: string
          student_pool_criteria?: Json | null
          student_pool_type?: string
          trip_category?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      route_stops: {
        Row: {
          created_at: string
          distance_from_school: number | null
          drop_time: string | null
          estimated_travel_time: number | null
          geofence_radius_meters: number | null
          id: string
          is_active: boolean | null
          landmark: string | null
          latitude: number | null
          location_address: string | null
          longitude: number | null
          notes: string | null
          pickup_time: string
          route_id: string
          school_id: string | null
          stop_name: string
          stop_order: number
          stop_type: string | null
          student_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          distance_from_school?: number | null
          drop_time?: string | null
          estimated_travel_time?: number | null
          geofence_radius_meters?: number | null
          id?: string
          is_active?: boolean | null
          landmark?: string | null
          latitude?: number | null
          location_address?: string | null
          longitude?: number | null
          notes?: string | null
          pickup_time: string
          route_id: string
          school_id?: string | null
          stop_name: string
          stop_order: number
          stop_type?: string | null
          student_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          distance_from_school?: number | null
          drop_time?: string | null
          estimated_travel_time?: number | null
          geofence_radius_meters?: number | null
          id?: string
          is_active?: boolean | null
          landmark?: string | null
          latitude?: number | null
          location_address?: string | null
          longitude?: number | null
          notes?: string | null
          pickup_time?: string
          route_id?: string
          school_id?: string | null
          stop_name?: string
          stop_order?: number
          stop_type?: string | null
          student_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      safeguarding_actions: {
        Row: {
          action_description: string
          action_type: string
          assigned_to: string
          completion_date: string | null
          concern_id: string
          created_at: string | null
          created_by: string
          due_date: string | null
          evidence_urls: string[] | null
          id: string
          outcome: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          assigned_to: string
          completion_date?: string | null
          concern_id: string
          created_at?: string | null
          created_by: string
          due_date?: string | null
          evidence_urls?: string[] | null
          id?: string
          outcome?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          assigned_to?: string
          completion_date?: string | null
          concern_id?: string
          created_at?: string | null
          created_by?: string
          due_date?: string | null
          evidence_urls?: string[] | null
          id?: string
          outcome?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safeguarding_actions_concern_id_fkey"
            columns: ["concern_id"]
            isOneToOne: false
            referencedRelation: "safeguarding_concerns"
            referencedColumns: ["id"]
          },
        ]
      }
      safeguarding_concerns: {
        Row: {
          agencies_contacted: string[] | null
          case_notes: string | null
          closed_at: string | null
          concern_details: string
          concern_number: string
          concern_type: Database["public"]["Enums"]["safeguarding_concern_type"]
          created_at: string | null
          dsl_assigned: string | null
          id: string
          immediate_action_taken: string | null
          incident_date: string | null
          location: string | null
          next_review_date: string | null
          outcome: string | null
          parent_notification_details: string | null
          parents_informed: boolean | null
          police_involved: boolean | null
          police_reference: string | null
          reported_by: string
          risk_level: Database["public"]["Enums"]["safeguarding_risk_level"]
          school_id: string
          social_services_involved: boolean | null
          social_services_reference: string | null
          status: Database["public"]["Enums"]["record_status"] | null
          student_id: string
          updated_at: string | null
          witnesses: string[] | null
        }
        Insert: {
          agencies_contacted?: string[] | null
          case_notes?: string | null
          closed_at?: string | null
          concern_details: string
          concern_number?: string
          concern_type: Database["public"]["Enums"]["safeguarding_concern_type"]
          created_at?: string | null
          dsl_assigned?: string | null
          id?: string
          immediate_action_taken?: string | null
          incident_date?: string | null
          location?: string | null
          next_review_date?: string | null
          outcome?: string | null
          parent_notification_details?: string | null
          parents_informed?: boolean | null
          police_involved?: boolean | null
          police_reference?: string | null
          reported_by: string
          risk_level: Database["public"]["Enums"]["safeguarding_risk_level"]
          school_id: string
          social_services_involved?: boolean | null
          social_services_reference?: string | null
          status?: Database["public"]["Enums"]["record_status"] | null
          student_id: string
          updated_at?: string | null
          witnesses?: string[] | null
        }
        Update: {
          agencies_contacted?: string[] | null
          case_notes?: string | null
          closed_at?: string | null
          concern_details?: string
          concern_number?: string
          concern_type?: Database["public"]["Enums"]["safeguarding_concern_type"]
          created_at?: string | null
          dsl_assigned?: string | null
          id?: string
          immediate_action_taken?: string | null
          incident_date?: string | null
          location?: string | null
          next_review_date?: string | null
          outcome?: string | null
          parent_notification_details?: string | null
          parents_informed?: boolean | null
          police_involved?: boolean | null
          police_reference?: string | null
          reported_by?: string
          risk_level?: Database["public"]["Enums"]["safeguarding_risk_level"]
          school_id?: string
          social_services_involved?: boolean | null
          social_services_reference?: string | null
          status?: Database["public"]["Enums"]["record_status"] | null
          student_id?: string
          updated_at?: string | null
          witnesses?: string[] | null
        }
        Relationships: []
      }
      safeguarding_reviews: {
        Row: {
          attendees: string[] | null
          concern_id: string
          conducted_by: string
          created_at: string | null
          decisions_made: string[] | null
          id: string
          next_actions: string[] | null
          next_review_date: string | null
          review_date: string
          review_notes: string
          review_type: string
          risk_assessment: string | null
        }
        Insert: {
          attendees?: string[] | null
          concern_id: string
          conducted_by: string
          created_at?: string | null
          decisions_made?: string[] | null
          id?: string
          next_actions?: string[] | null
          next_review_date?: string | null
          review_date: string
          review_notes: string
          review_type: string
          risk_assessment?: string | null
        }
        Update: {
          attendees?: string[] | null
          concern_id?: string
          conducted_by?: string
          created_at?: string | null
          decisions_made?: string[] | null
          id?: string
          next_actions?: string[] | null
          next_review_date?: string | null
          review_date?: string
          review_notes?: string
          review_type?: string
          risk_assessment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safeguarding_reviews_concern_id_fkey"
            columns: ["concern_id"]
            isOneToOne: false
            referencedRelation: "safeguarding_concerns"
            referencedColumns: ["id"]
          },
        ]
      }
      school_curriculum_adoption: {
        Row: {
          academic_year: string
          adopted_at: string
          customizations: Json | null
          framework_id: string
          id: string
          is_active: boolean
          school_id: string
        }
        Insert: {
          academic_year: string
          adopted_at?: string
          customizations?: Json | null
          framework_id: string
          id?: string
          is_active?: boolean
          school_id: string
        }
        Update: {
          academic_year?: string
          adopted_at?: string
          customizations?: Json | null
          framework_id?: string
          id?: string
          is_active?: boolean
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_curriculum_adoption_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "curriculum_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      school_module_features: {
        Row: {
          created_at: string | null
          feature_id: string
          id: string
          is_enabled: boolean | null
          module_id: string
          school_id: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feature_id: string
          id?: string
          is_enabled?: boolean | null
          module_id: string
          school_id: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feature_id?: string
          id?: string
          is_enabled?: boolean | null
          module_id?: string
          school_id?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_module_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "module_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_module_features_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_module_features_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_modules: {
        Row: {
          created_at: string
          custom_workflow: Json | null
          id: string
          is_enabled: boolean
          module_id: string
          school_id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_workflow?: Json | null
          id?: string
          is_enabled?: boolean
          module_id: string
          school_id: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_workflow?: Json | null
          id?: string
          is_enabled?: boolean
          module_id?: string
          school_id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_modules_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
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
          academic_year_end: string | null
          academic_year_start: string | null
          address: string | null
          branch_name: string | null
          branch_principal_email: string | null
          branch_principal_name: string | null
          branch_principal_phone: string | null
          code: string
          colors: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          custom_domain: string | null
          establishment_type: string | null
          founded_year: number | null
          geofence_radius_meters: number | null
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          is_active: boolean
          logo_url: string | null
          module_config: Json | null
          motto: string | null
          name: string
          principal_name: string | null
          school_head_email: string | null
          school_head_name: string | null
          school_head_phone: string | null
          settings: Json | null
          transport_admin_email: string | null
          transport_admin_name: string | null
          transport_admin_phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          academic_year_end?: string | null
          academic_year_start?: string | null
          address?: string | null
          branch_name?: string | null
          branch_principal_email?: string | null
          branch_principal_name?: string | null
          branch_principal_phone?: string | null
          code: string
          colors?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_domain?: string | null
          establishment_type?: string | null
          founded_year?: number | null
          geofence_radius_meters?: number | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          module_config?: Json | null
          motto?: string | null
          name: string
          principal_name?: string | null
          school_head_email?: string | null
          school_head_name?: string | null
          school_head_phone?: string | null
          settings?: Json | null
          transport_admin_email?: string | null
          transport_admin_name?: string | null
          transport_admin_phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          academic_year_end?: string | null
          academic_year_start?: string | null
          address?: string | null
          branch_name?: string | null
          branch_principal_email?: string | null
          branch_principal_name?: string | null
          branch_principal_phone?: string | null
          code?: string
          colors?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_domain?: string | null
          establishment_type?: string | null
          founded_year?: number | null
          geofence_radius_meters?: number | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          module_config?: Json | null
          motto?: string | null
          name?: string
          principal_name?: string | null
          school_head_email?: string | null
          school_head_name?: string | null
          school_head_phone?: string | null
          settings?: Json | null
          transport_admin_email?: string | null
          transport_admin_name?: string | null
          transport_admin_phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string
          emergency_contact: Json | null
          employment_type: string
          end_date: string | null
          first_name: string
          form_tutor_class: string | null
          id: string
          is_active: boolean
          last_name: string
          phone: string | null
          position: string
          qualifications: Json | null
          school_id: string
          staff_number: string
          start_date: string
          teaching_subjects: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          emergency_contact?: Json | null
          employment_type?: string
          end_date?: string | null
          first_name: string
          form_tutor_class?: string | null
          id?: string
          is_active?: boolean
          last_name: string
          phone?: string | null
          position: string
          qualifications?: Json | null
          school_id: string
          staff_number: string
          start_date: string
          teaching_subjects?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          emergency_contact?: Json | null
          employment_type?: string
          end_date?: string | null
          first_name?: string
          form_tutor_class?: string | null
          id?: string
          is_active?: boolean
          last_name?: string
          phone?: string | null
          position?: string
          qualifications?: Json | null
          school_id?: string
          staff_number?: string
          start_date?: string
          teaching_subjects?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      standby_resources: {
        Row: {
          assigned_at: string | null
          available_from: string | null
          available_until: string | null
          created_at: string
          currently_assigned_to: string | null
          days_available: number[] | null
          driver_id: string | null
          id: string
          is_available: boolean | null
          notes: string | null
          resource_type: string
          route_profile_id: string | null
          school_id: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          currently_assigned_to?: string | null
          days_available?: number[] | null
          driver_id?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          resource_type: string
          route_profile_id?: string | null
          school_id: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          currently_assigned_to?: string | null
          days_available?: number[] | null
          driver_id?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          resource_type?: string
          route_profile_id?: string | null
          school_id?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "standby_resources_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standby_resources_route_profile_id_fkey"
            columns: ["route_profile_id"]
            isOneToOne: false
            referencedRelation: "route_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standby_resources_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standby_resources_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_fee_assignments: {
        Row: {
          amount_due: number
          amount_paid: number
          assigned_date: string
          class_name: string | null
          created_at: string
          due_date: string
          fee_structure_id: string
          id: string
          school_id: string
          status: string
          student_id: string
          updated_at: string
          year_group: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number
          assigned_date?: string
          class_name?: string | null
          created_at?: string
          due_date: string
          fee_structure_id: string
          id?: string
          school_id: string
          status?: string
          student_id: string
          updated_at?: string
          year_group?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          assigned_date?: string
          class_name?: string | null
          created_at?: string
          due_date?: string
          fee_structure_id?: string
          id?: string
          school_id?: string
          status?: string
          student_id?: string
          updated_at?: string
          year_group?: string | null
        }
        Relationships: []
      }
      student_medical_info: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          consent_date: string | null
          consent_for_treatment: boolean | null
          created_at: string
          current_medications: Json | null
          emergency_contacts: Json | null
          id: string
          medical_conditions: string[] | null
          medical_notes: string | null
          special_dietary_requirements: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          consent_date?: string | null
          consent_for_treatment?: boolean | null
          created_at?: string
          current_medications?: Json | null
          emergency_contacts?: Json | null
          id?: string
          medical_conditions?: string[] | null
          medical_notes?: string | null
          special_dietary_requirements?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          consent_date?: string | null
          consent_for_treatment?: boolean | null
          created_at?: string
          current_medications?: Json | null
          emergency_contacts?: Json | null
          id?: string
          medical_conditions?: string[] | null
          medical_notes?: string | null
          special_dietary_requirements?: string | null
          student_id?: string
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
        Relationships: [
          {
            foreignKeyName: "student_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_submissions: {
        Row: {
          assignment_id: string | null
          content: string | null
          created_at: string
          file_urls: Json | null
          id: string
          metadata: Json | null
          processed_content: string | null
          processing_status: string | null
          school_id: string
          student_id: string
          submission_type: string
          submitted_at: string
          submitted_by: string
          updated_at: string
        }
        Insert: {
          assignment_id?: string | null
          content?: string | null
          created_at?: string
          file_urls?: Json | null
          id?: string
          metadata?: Json | null
          processed_content?: string | null
          processing_status?: string | null
          school_id: string
          student_id: string
          submission_type?: string
          submitted_at?: string
          submitted_by: string
          updated_at?: string
        }
        Update: {
          assignment_id?: string | null
          content?: string | null
          created_at?: string
          file_urls?: Json | null
          id?: string
          metadata?: Json | null
          processed_content?: string | null
          processing_status?: string | null
          school_id?: string
          student_id?: string
          submission_type?: string
          submitted_at?: string
          submitted_by?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_transport: {
        Row: {
          created_at: string
          drop_stop_id: string | null
          emergency_contact: string | null
          end_date: string | null
          fee_frequency: string
          id: string
          parent_phone: string | null
          pickup_stop_id: string | null
          route_id: string
          school_id: string
          special_instructions: string | null
          start_date: string
          status: string
          stop_id: string
          student_id: string
          transport_fee: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          drop_stop_id?: string | null
          emergency_contact?: string | null
          end_date?: string | null
          fee_frequency?: string
          id?: string
          parent_phone?: string | null
          pickup_stop_id?: string | null
          route_id: string
          school_id: string
          special_instructions?: string | null
          start_date?: string
          status?: string
          stop_id: string
          student_id: string
          transport_fee?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          drop_stop_id?: string | null
          emergency_contact?: string | null
          end_date?: string | null
          fee_frequency?: string
          id?: string
          parent_phone?: string | null
          pickup_stop_id?: string | null
          route_id?: string
          school_id?: string
          special_instructions?: string | null
          start_date?: string
          status?: string
          stop_id?: string
          student_id?: string
          transport_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_transport_drop_stop_id_fkey"
            columns: ["drop_stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_transport_pickup_stop_id_fkey"
            columns: ["pickup_stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_transport_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_transport_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      student_trip_assignments: {
        Row: {
          assignment_type: string
          created_at: string
          id: string
          parent_name: string | null
          parent_notification_preference: string | null
          parent_phone: string | null
          school_id: string
          special_instructions: string | null
          status: string
          student_id: string
          trip_id: string
          trip_stop_id: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          assignment_type?: string
          created_at?: string
          id?: string
          parent_name?: string | null
          parent_notification_preference?: string | null
          parent_phone?: string | null
          school_id: string
          special_instructions?: string | null
          status?: string
          student_id: string
          trip_id: string
          trip_stop_id: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          assignment_type?: string
          created_at?: string
          id?: string
          parent_name?: string | null
          parent_notification_preference?: string | null
          parent_phone?: string | null
          school_id?: string
          special_instructions?: string | null
          status?: string
          student_id?: string
          trip_id?: string
          trip_stop_id?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_trip_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_trip_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_trip_assignments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "transport_trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_trip_assignments_trip_stop_id_fkey"
            columns: ["trip_stop_id"]
            isOneToOne: false
            referencedRelation: "trip_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      student_trip_logs: {
        Row: {
          action_time: string
          action_type: string
          created_at: string
          id: string
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          parent_notification_time: string | null
          parent_notified: boolean | null
          recorded_by: string | null
          recorded_method: string | null
          school_id: string
          student_assignment_id: string | null
          student_id: string
          trip_instance_id: string | null
          trip_stop_id: string | null
        }
        Insert: {
          action_time?: string
          action_type: string
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          parent_notification_time?: string | null
          parent_notified?: boolean | null
          recorded_by?: string | null
          recorded_method?: string | null
          school_id: string
          student_assignment_id?: string | null
          student_id: string
          trip_instance_id?: string | null
          trip_stop_id?: string | null
        }
        Update: {
          action_time?: string
          action_type?: string
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          parent_notification_time?: string | null
          parent_notified?: boolean | null
          recorded_by?: string | null
          recorded_method?: string | null
          school_id?: string
          student_assignment_id?: string | null
          student_id?: string
          trip_instance_id?: string | null
          trip_stop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_trip_logs_student_assignment_id_fkey"
            columns: ["student_assignment_id"]
            isOneToOne: false
            referencedRelation: "student_trip_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_trip_logs_trip_instance_id_fkey"
            columns: ["trip_instance_id"]
            isOneToOne: false
            referencedRelation: "trip_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_trip_logs_trip_stop_id_fkey"
            columns: ["trip_stop_id"]
            isOneToOne: false
            referencedRelation: "trip_stops"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      survey_responses: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          employee_id: string | null
          id: string
          responses: Json
          survey_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          employee_id?: string | null
          id?: string
          responses?: Json
          survey_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          employee_id?: string | null
          id?: string
          responses?: Json
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "engagement_surveys"
            referencedColumns: ["id"]
          },
        ]
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
      time_entries: {
        Row: {
          approved_by: string | null
          created_at: string
          employee_id: string
          end_time: string | null
          hourly_rate: number | null
          hours_worked: number | null
          id: string
          is_billable: boolean | null
          project_id: string | null
          start_time: string
          status: string
          task_description: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          employee_id: string
          end_time?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          is_billable?: boolean | null
          project_id?: string | null
          start_time: string
          status?: string
          task_description: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          employee_id?: string
          end_time?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          is_billable?: boolean | null
          project_id?: string | null
          start_time?: string
          status?: string
          task_description?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      topic_coverage: {
        Row: {
          academic_year: string
          actual_end_date: string | null
          actual_start_date: string | null
          assessment_completed: boolean | null
          class_id: string | null
          completion_percentage: number | null
          created_at: string
          id: string
          marked_at: string | null
          marked_by: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          resources_used: Json | null
          school_id: string
          status: Database["public"]["Enums"]["coverage_status"]
          teacher_id: string | null
          teaching_notes: string | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          actual_end_date?: string | null
          actual_start_date?: string | null
          assessment_completed?: boolean | null
          class_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          marked_at?: string | null
          marked_by?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          resources_used?: Json | null
          school_id: string
          status?: Database["public"]["Enums"]["coverage_status"]
          teacher_id?: string | null
          teaching_notes?: string | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          actual_end_date?: string | null
          actual_start_date?: string | null
          assessment_completed?: boolean | null
          class_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          marked_at?: string | null
          marked_by?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          resources_used?: Json | null
          school_id?: string
          status?: Database["public"]["Enums"]["coverage_status"]
          teacher_id?: string | null
          teaching_notes?: string | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_coverage_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      training_courses: {
        Row: {
          cost_per_person: number | null
          course_description: string | null
          course_materials: Json | null
          course_provider: string | null
          course_title: string
          course_type: string
          created_at: string
          duration_hours: number | null
          id: string
          max_participants: number | null
          updated_at: string
        }
        Insert: {
          cost_per_person?: number | null
          course_description?: string | null
          course_materials?: Json | null
          course_provider?: string | null
          course_title: string
          course_type: string
          created_at?: string
          duration_hours?: number | null
          id?: string
          max_participants?: number | null
          updated_at?: string
        }
        Update: {
          cost_per_person?: number | null
          course_description?: string | null
          course_materials?: Json | null
          course_provider?: string | null
          course_title?: string
          course_type?: string
          created_at?: string
          duration_hours?: number | null
          id?: string
          max_participants?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      training_enrollments: {
        Row: {
          certificate_issued: boolean | null
          completion_date: string | null
          course_id: string
          created_at: string
          employee_id: string
          enrollment_date: string
          final_score: number | null
          id: string
          progress_percentage: number | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          certificate_issued?: boolean | null
          completion_date?: string | null
          course_id: string
          created_at?: string
          employee_id: string
          enrollment_date?: string
          final_score?: number | null
          id?: string
          progress_percentage?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          certificate_issued?: boolean | null
          completion_date?: string | null
          course_id?: string
          created_at?: string
          employee_id?: string
          enrollment_date?: string
          final_score?: number | null
          id?: string
          progress_percentage?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          auto_resolved: boolean | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: string
          resolved_at: string | null
          resolved_by: string | null
          school_id: string
          title: string
          trip_instance_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          auto_resolved?: boolean | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          school_id: string
          title: string
          trip_instance_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          auto_resolved?: boolean | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          school_id?: string
          title?: string
          trip_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_alerts_trip_instance_id_fkey"
            columns: ["trip_instance_id"]
            isOneToOne: false
            referencedRelation: "trip_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_analytics: {
        Row: {
          average_boarding_time_seconds: number | null
          average_trip_duration_minutes: number | null
          cancelled_trips: number | null
          complaints_count: number | null
          completed_trips: number | null
          cost_per_km: number | null
          cost_per_student: number | null
          created_at: string | null
          delayed_trips: number | null
          fuel_efficiency_km_per_litre: number | null
          id: string
          incidents_count: number | null
          metadata: Json | null
          no_shows: number | null
          on_time_percentage: number | null
          report_date: string
          report_type: string
          route_id: string | null
          school_id: string
          total_cost: number | null
          total_delay_minutes: number | null
          total_distance_km: number | null
          total_fuel_litres: number | null
          total_students_transported: number | null
          total_trips: number | null
          updated_at: string | null
        }
        Insert: {
          average_boarding_time_seconds?: number | null
          average_trip_duration_minutes?: number | null
          cancelled_trips?: number | null
          complaints_count?: number | null
          completed_trips?: number | null
          cost_per_km?: number | null
          cost_per_student?: number | null
          created_at?: string | null
          delayed_trips?: number | null
          fuel_efficiency_km_per_litre?: number | null
          id?: string
          incidents_count?: number | null
          metadata?: Json | null
          no_shows?: number | null
          on_time_percentage?: number | null
          report_date: string
          report_type?: string
          route_id?: string | null
          school_id: string
          total_cost?: number | null
          total_delay_minutes?: number | null
          total_distance_km?: number | null
          total_fuel_litres?: number | null
          total_students_transported?: number | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Update: {
          average_boarding_time_seconds?: number | null
          average_trip_duration_minutes?: number | null
          cancelled_trips?: number | null
          complaints_count?: number | null
          completed_trips?: number | null
          cost_per_km?: number | null
          cost_per_student?: number | null
          created_at?: string | null
          delayed_trips?: number | null
          fuel_efficiency_km_per_litre?: number | null
          id?: string
          incidents_count?: number | null
          metadata?: Json | null
          no_shows?: number | null
          on_time_percentage?: number | null
          report_date?: string
          report_type?: string
          route_id?: string | null
          school_id?: string
          total_cost?: number | null
          total_delay_minutes?: number | null
          total_distance_km?: number | null
          total_fuel_litres?: number | null
          total_students_transported?: number | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transport_attendance: {
        Row: {
          attendance_date: string
          created_at: string
          drop_status: string | null
          drop_stop_id: string | null
          drop_time: string | null
          id: string
          marked_by: string
          notes: string | null
          pickup_status: string | null
          pickup_stop_id: string | null
          pickup_time: string | null
          route_id: string
          school_id: string
          student_id: string
          student_transport_id: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          attendance_date?: string
          created_at?: string
          drop_status?: string | null
          drop_stop_id?: string | null
          drop_time?: string | null
          id?: string
          marked_by: string
          notes?: string | null
          pickup_status?: string | null
          pickup_stop_id?: string | null
          pickup_time?: string | null
          route_id: string
          school_id: string
          student_id: string
          student_transport_id: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          attendance_date?: string
          created_at?: string
          drop_status?: string | null
          drop_stop_id?: string | null
          drop_time?: string | null
          id?: string
          marked_by?: string
          notes?: string | null
          pickup_status?: string | null
          pickup_stop_id?: string | null
          pickup_time?: string | null
          route_id?: string
          school_id?: string
          student_id?: string
          student_transport_id?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_attendance_drop_stop_id_fkey"
            columns: ["drop_stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_attendance_pickup_stop_id_fkey"
            columns: ["pickup_stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_attendance_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_attendance_student_transport_id_fkey"
            columns: ["student_transport_id"]
            isOneToOne: false
            referencedRelation: "student_transport"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_attendance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_contractors: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_ifsc_code: string | null
          contact_email: string | null
          contact_person_name: string | null
          contact_phone: string | null
          contractor_name: string
          created_at: string
          gst_number: string | null
          id: string
          notes: string | null
          office_address: string | null
          pan_number: string | null
          school_id: string
          status: string
          updated_at: string
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          contact_email?: string | null
          contact_person_name?: string | null
          contact_phone?: string | null
          contractor_name: string
          created_at?: string
          gst_number?: string | null
          id?: string
          notes?: string | null
          office_address?: string | null
          pan_number?: string | null
          school_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          contact_email?: string | null
          contact_person_name?: string | null
          contact_phone?: string | null
          contractor_name?: string
          created_at?: string
          gst_number?: string | null
          id?: string
          notes?: string | null
          office_address?: string | null
          pan_number?: string | null
          school_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_contractors_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_costs: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          cost_category: string
          cost_date: string
          created_at: string | null
          currency: string | null
          description: string | null
          driver_id: string | null
          id: string
          invoice_number: string | null
          metadata: Json | null
          notes: string | null
          receipt_url: string | null
          route_id: string | null
          school_id: string
          updated_at: string | null
          vehicle_id: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          cost_category: string
          cost_date: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          driver_id?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json | null
          notes?: string | null
          receipt_url?: string | null
          route_id?: string | null
          school_id: string
          updated_at?: string | null
          vehicle_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          cost_category?: string
          cost_date?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          driver_id?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json | null
          notes?: string | null
          receipt_url?: string | null
          route_id?: string | null
          school_id?: string
          updated_at?: string | null
          vehicle_id?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_costs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_costs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_emergency_contacts: {
        Row: {
          contact_name: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          is_authorized_pickup: boolean | null
          notes: string | null
          phone_primary: string
          phone_secondary: string | null
          priority_order: number | null
          relationship: string
          school_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_authorized_pickup?: boolean | null
          notes?: string | null
          phone_primary: string
          phone_secondary?: string | null
          priority_order?: number | null
          relationship: string
          school_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_authorized_pickup?: boolean | null
          notes?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          priority_order?: number | null
          relationship?: string
          school_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      transport_geofences: {
        Row: {
          center_lat: number
          center_lng: number
          created_at: string
          geofence_type: string
          id: string
          is_active: boolean | null
          name: string
          notification_template_id: string | null
          radius_meters: number
          reference_id: string | null
          school_id: string
          trigger_on_entry: boolean | null
          trigger_on_exit: boolean | null
          updated_at: string
        }
        Insert: {
          center_lat: number
          center_lng: number
          created_at?: string
          geofence_type: string
          id?: string
          is_active?: boolean | null
          name: string
          notification_template_id?: string | null
          radius_meters?: number
          reference_id?: string | null
          school_id: string
          trigger_on_entry?: boolean | null
          trigger_on_exit?: boolean | null
          updated_at?: string
        }
        Update: {
          center_lat?: number
          center_lng?: number
          created_at?: string
          geofence_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          notification_template_id?: string | null
          radius_meters?: number
          reference_id?: string | null
          school_id?: string
          trigger_on_entry?: boolean | null
          trigger_on_exit?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_geofences_notification_template_id_fkey"
            columns: ["notification_template_id"]
            isOneToOne: false
            referencedRelation: "transport_notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_holidays: {
        Row: {
          affects_transport: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          holiday_date: string
          holiday_name: string
          holiday_type: string
          id: string
          school_id: string
          updated_at: string
        }
        Insert: {
          affects_transport?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          holiday_date: string
          holiday_name: string
          holiday_type: string
          id?: string
          school_id: string
          updated_at?: string
        }
        Update: {
          affects_transport?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          holiday_date?: string
          holiday_name?: string
          holiday_type?: string
          id?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_holidays_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_incidents: {
        Row: {
          authorities_notified: boolean | null
          created_at: string
          description: string
          id: string
          incident_date: string
          incident_type: string
          insurance_claim: boolean | null
          location: string | null
          parent_notified: boolean | null
          reported_by: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          route_id: string | null
          school_id: string
          severity: string
          status: string
          students_affected: string[] | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          authorities_notified?: boolean | null
          created_at?: string
          description: string
          id?: string
          incident_date?: string
          incident_type: string
          insurance_claim?: boolean | null
          location?: string | null
          parent_notified?: boolean | null
          reported_by: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          route_id?: string | null
          school_id: string
          severity?: string
          status?: string
          students_affected?: string[] | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          authorities_notified?: boolean | null
          created_at?: string
          description?: string
          id?: string
          incident_date?: string
          incident_type?: string
          insurance_claim?: boolean | null
          location?: string | null
          parent_notified?: boolean | null
          reported_by?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          route_id?: string | null
          school_id?: string
          severity?: string
          status?: string
          students_affected?: string[] | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_incidents_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_incidents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_notification_logs: {
        Row: {
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          event_trigger: string
          external_id: string | null
          id: string
          message: string
          read_at: string | null
          recipient_contact: string
          recipient_id: string
          recipient_type: string
          retry_count: number | null
          school_id: string
          sent_at: string | null
          status: string
          subject: string | null
          template_id: string | null
          trip_event_id: string | null
          trip_instance_id: string | null
          variables_used: Json | null
        }
        Insert: {
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_trigger: string
          external_id?: string | null
          id?: string
          message: string
          read_at?: string | null
          recipient_contact: string
          recipient_id: string
          recipient_type: string
          retry_count?: number | null
          school_id: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
          trip_event_id?: string | null
          trip_instance_id?: string | null
          variables_used?: Json | null
        }
        Update: {
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_trigger?: string
          external_id?: string | null
          id?: string
          message?: string
          read_at?: string | null
          recipient_contact?: string
          recipient_id?: string
          recipient_type?: string
          retry_count?: number | null
          school_id?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
          trip_event_id?: string | null
          trip_instance_id?: string | null
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_notification_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "transport_notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_notification_logs_trip_event_id_fkey"
            columns: ["trip_event_id"]
            isOneToOne: false
            referencedRelation: "trip_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_notification_logs_trip_instance_id_fkey"
            columns: ["trip_instance_id"]
            isOneToOne: false
            referencedRelation: "trip_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_notification_preferences: {
        Row: {
          arrival_notify_minutes: number | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          notify_arrival_soon: boolean | null
          notify_delays: boolean | null
          notify_emergencies: boolean | null
          notify_student_alight: boolean | null
          notify_student_board: boolean | null
          notify_trip_end: boolean | null
          notify_trip_start: boolean | null
          parent_id: string
          phone_number: string | null
          preferred_channel: string | null
          push_token: string | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          school_id: string
          student_id: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          arrival_notify_minutes?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          notify_arrival_soon?: boolean | null
          notify_delays?: boolean | null
          notify_emergencies?: boolean | null
          notify_student_alight?: boolean | null
          notify_student_board?: boolean | null
          notify_trip_end?: boolean | null
          notify_trip_start?: boolean | null
          parent_id: string
          phone_number?: string | null
          preferred_channel?: string | null
          push_token?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          school_id: string
          student_id: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          arrival_notify_minutes?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          notify_arrival_soon?: boolean | null
          notify_delays?: boolean | null
          notify_emergencies?: boolean | null
          notify_student_alight?: boolean | null
          notify_student_board?: boolean | null
          notify_trip_end?: boolean | null
          notify_trip_start?: boolean | null
          parent_id?: string
          phone_number?: string | null
          preferred_channel?: string | null
          push_token?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          school_id?: string
          student_id?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      transport_notification_templates: {
        Row: {
          body_template: string
          created_at: string
          created_by: string | null
          event_trigger: string
          id: string
          is_active: boolean | null
          school_id: string
          send_to_admin: boolean | null
          send_to_driver: boolean | null
          send_to_parent: boolean | null
          subject_template: string | null
          template_name: string
          template_type: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          body_template: string
          created_at?: string
          created_by?: string | null
          event_trigger: string
          id?: string
          is_active?: boolean | null
          school_id: string
          send_to_admin?: boolean | null
          send_to_driver?: boolean | null
          send_to_parent?: boolean | null
          subject_template?: string | null
          template_name: string
          template_type: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          body_template?: string
          created_at?: string
          created_by?: string | null
          event_trigger?: string
          id?: string
          is_active?: boolean | null
          school_id?: string
          send_to_admin?: boolean | null
          send_to_driver?: boolean | null
          send_to_parent?: boolean | null
          subject_template?: string | null
          template_name?: string
          template_type?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      transport_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          notification_type: string
          priority: string
          read_at: string | null
          recipient_ids: string[] | null
          recipient_type: string
          route_id: string | null
          school_id: string
          sent_at: string | null
          sent_by: string
          status: string
          title: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          notification_type: string
          priority?: string
          read_at?: string | null
          recipient_ids?: string[] | null
          recipient_type: string
          route_id?: string | null
          school_id: string
          sent_at?: string | null
          sent_by: string
          status?: string
          title: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          notification_type?: string
          priority?: string
          read_at?: string | null
          recipient_ids?: string[] | null
          recipient_type?: string
          route_id?: string | null
          school_id?: string
          sent_at?: string | null
          sent_by?: string
          status?: string
          title?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_notifications_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_notifications_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_routes: {
        Row: {
          assistant_id: string | null
          created_at: string
          distance_km: number | null
          driver_id: string | null
          end_time: string | null
          estimated_duration: number | null
          id: string
          route_code: string
          route_name: string
          route_type: string
          school_id: string
          start_time: string
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string
          distance_km?: number | null
          driver_id?: string | null
          end_time?: string | null
          estimated_duration?: number | null
          id?: string
          route_code: string
          route_name: string
          route_type?: string
          school_id: string
          start_time: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          created_at?: string
          distance_km?: number | null
          driver_id?: string | null
          end_time?: string | null
          estimated_duration?: number | null
          id?: string
          route_code?: string
          route_name?: string
          route_type?: string
          school_id?: string
          start_time?: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_trips: {
        Row: {
          assigned_students_count: number | null
          attender_id: string | null
          created_at: string
          driver_id: string | null
          end_point: string | null
          estimated_distance_km: number | null
          estimated_duration_minutes: number | null
          estimated_fuel_required: number | null
          id: string
          route_profile_id: string
          scheduled_end_time: string | null
          scheduled_start_time: string
          school_id: string
          start_point: string | null
          status: string
          trip_code: string | null
          trip_name: string
          trip_type: string
          updated_at: string
          vehicle_capacity: number | null
          vehicle_id: string | null
        }
        Insert: {
          assigned_students_count?: number | null
          attender_id?: string | null
          created_at?: string
          driver_id?: string | null
          end_point?: string | null
          estimated_distance_km?: number | null
          estimated_duration_minutes?: number | null
          estimated_fuel_required?: number | null
          id?: string
          route_profile_id: string
          scheduled_end_time?: string | null
          scheduled_start_time: string
          school_id: string
          start_point?: string | null
          status?: string
          trip_code?: string | null
          trip_name: string
          trip_type?: string
          updated_at?: string
          vehicle_capacity?: number | null
          vehicle_id?: string | null
        }
        Update: {
          assigned_students_count?: number | null
          attender_id?: string | null
          created_at?: string
          driver_id?: string | null
          end_point?: string | null
          estimated_distance_km?: number | null
          estimated_duration_minutes?: number | null
          estimated_fuel_required?: number | null
          id?: string
          route_profile_id?: string
          scheduled_end_time?: string | null
          scheduled_start_time?: string
          school_id?: string
          start_point?: string | null
          status?: string
          trip_code?: string | null
          trip_name?: string
          trip_type?: string
          updated_at?: string
          vehicle_capacity?: number | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_trips_attender_id_fkey"
            columns: ["attender_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_trips_route_profile_id_fkey"
            columns: ["route_profile_id"]
            isOneToOne: false
            referencedRelation: "route_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_trips_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_requests: {
        Row: {
          accommodation_required: boolean | null
          approval_notes: string | null
          approved_by: string | null
          created_at: string
          departure_date: string
          destination: string
          employee_id: string
          estimated_cost: number | null
          id: string
          return_date: string
          status: string
          transportation_type: string | null
          trip_purpose: string
          updated_at: string
        }
        Insert: {
          accommodation_required?: boolean | null
          approval_notes?: string | null
          approved_by?: string | null
          created_at?: string
          departure_date: string
          destination: string
          employee_id: string
          estimated_cost?: number | null
          id?: string
          return_date: string
          status?: string
          transportation_type?: string | null
          trip_purpose: string
          updated_at?: string
        }
        Update: {
          accommodation_required?: boolean | null
          approval_notes?: string | null
          approved_by?: string | null
          created_at?: string
          departure_date?: string
          destination?: string
          employee_id?: string
          estimated_cost?: number | null
          id?: string
          return_date?: string
          status?: string
          transportation_type?: string | null
          trip_purpose?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_events: {
        Row: {
          admin_notification_sent: boolean | null
          affected_students_count: number | null
          created_at: string
          description: string
          event_time: string
          event_type: string
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          parent_notification_sent: boolean | null
          photos: string[] | null
          reported_by: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          school_id: string
          severity: string | null
          trip_instance_id: string | null
          updated_at: string
        }
        Insert: {
          admin_notification_sent?: boolean | null
          affected_students_count?: number | null
          created_at?: string
          description: string
          event_time?: string
          event_type: string
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          parent_notification_sent?: boolean | null
          photos?: string[] | null
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          school_id: string
          severity?: string | null
          trip_instance_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_notification_sent?: boolean | null
          affected_students_count?: number | null
          created_at?: string
          description?: string
          event_time?: string
          event_type?: string
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          parent_notification_sent?: boolean | null
          photos?: string[] | null
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          school_id?: string
          severity?: string | null
          trip_instance_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_events_trip_instance_id_fkey"
            columns: ["trip_instance_id"]
            isOneToOne: false
            referencedRelation: "trip_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_instances: {
        Row: {
          actual_attender_id: string | null
          actual_distance_km: number | null
          actual_driver_id: string | null
          actual_end_time: string | null
          actual_start_time: string | null
          actual_vehicle_id: string | null
          created_at: string
          delay_minutes: number | null
          delay_reason: string | null
          fuel_consumed_litres: number | null
          gps_tracking_id: string | null
          id: string
          instance_date: string
          school_id: string | null
          status: string
          total_students_boarded: number | null
          total_students_dropped: number | null
          total_students_expected: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          actual_attender_id?: string | null
          actual_distance_km?: number | null
          actual_driver_id?: string | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          actual_vehicle_id?: string | null
          created_at?: string
          delay_minutes?: number | null
          delay_reason?: string | null
          fuel_consumed_litres?: number | null
          gps_tracking_id?: string | null
          id?: string
          instance_date: string
          school_id?: string | null
          status?: string
          total_students_boarded?: number | null
          total_students_dropped?: number | null
          total_students_expected?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          actual_attender_id?: string | null
          actual_distance_km?: number | null
          actual_driver_id?: string | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          actual_vehicle_id?: string | null
          created_at?: string
          delay_minutes?: number | null
          delay_reason?: string | null
          fuel_consumed_litres?: number | null
          gps_tracking_id?: string | null
          id?: string
          instance_date?: string
          school_id?: string | null
          status?: string
          total_students_boarded?: number | null
          total_students_dropped?: number | null
          total_students_expected?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_instances_actual_attender_id_fkey"
            columns: ["actual_attender_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_instances_actual_driver_id_fkey"
            columns: ["actual_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_instances_actual_vehicle_id_fkey"
            columns: ["actual_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_instances_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "transport_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_location_logs: {
        Row: {
          accuracy_meters: number | null
          altitude: number | null
          created_at: string
          driver_id: string | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          school_id: string | null
          source: string | null
          speed_kmh: number | null
          trip_instance_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          accuracy_meters?: number | null
          altitude?: number | null
          created_at?: string
          driver_id?: string | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          school_id?: string | null
          source?: string | null
          speed_kmh?: number | null
          trip_instance_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          accuracy_meters?: number | null
          altitude?: number | null
          created_at?: string
          driver_id?: string | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          school_id?: string | null
          source?: string | null
          speed_kmh?: number | null
          trip_instance_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_location_logs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_location_logs_trip_instance_id_fkey"
            columns: ["trip_instance_id"]
            isOneToOne: false
            referencedRelation: "trip_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_location_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_stops: {
        Row: {
          assigned_students_count: number | null
          assignment_status: string | null
          created_at: string
          distance_from_previous_km: number | null
          estimated_wait_minutes: number | null
          geofence_radius_meters: number | null
          id: string
          latitude: number | null
          location_address: string | null
          longitude: number | null
          scheduled_arrival_time: string
          scheduled_departure_time: string | null
          stop_id: string | null
          stop_name: string
          stop_order: number
          total_students_at_stop: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          assigned_students_count?: number | null
          assignment_status?: string | null
          created_at?: string
          distance_from_previous_km?: number | null
          estimated_wait_minutes?: number | null
          geofence_radius_meters?: number | null
          id?: string
          latitude?: number | null
          location_address?: string | null
          longitude?: number | null
          scheduled_arrival_time: string
          scheduled_departure_time?: string | null
          stop_id?: string | null
          stop_name: string
          stop_order: number
          total_students_at_stop?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          assigned_students_count?: number | null
          assignment_status?: string | null
          created_at?: string
          distance_from_previous_km?: number | null
          estimated_wait_minutes?: number | null
          geofence_radius_meters?: number | null
          id?: string
          latitude?: number | null
          location_address?: string | null
          longitude?: number | null
          scheduled_arrival_time?: string
          scheduled_departure_time?: string | null
          stop_id?: string | null
          stop_name?: string
          stop_order?: number
          total_students_at_stop?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_stops_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stops_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "transport_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          department: string | null
          fee_collection_role:
            | Database["public"]["Enums"]["fee_collection_role"]
            | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          school_id: string | null
          user_id: string
          year_group: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          department?: string | null
          fee_collection_role?:
            | Database["public"]["Enums"]["fee_collection_role"]
            | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id: string
          year_group?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          department?: string | null
          fee_collection_role?:
            | Database["public"]["Enums"]["fee_collection_role"]
            | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
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
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vehicle_compliance_docs: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string
          document_url: string | null
          expiry_date: string | null
          id: string
          insurance_policy_number: string | null
          insurance_premium: number | null
          insurance_provider: string | null
          issue_date: string | null
          issuing_authority: string | null
          notes: string | null
          permit_states: string[] | null
          permit_type: string | null
          reminder_sent: boolean | null
          status: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_premium?: number | null
          insurance_provider?: string | null
          issue_date?: string | null
          issuing_authority?: string | null
          notes?: string | null
          permit_states?: string[] | null
          permit_type?: string | null
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_premium?: number | null
          insurance_provider?: string | null
          issue_date?: string | null
          issuing_authority?: string | null
          notes?: string | null
          permit_states?: string[] | null
          permit_type?: string | null
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_compliance_docs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_contracts: {
        Row: {
          contract_document_url: string | null
          contract_end_date: string
          contract_number: string | null
          contract_start_date: string
          contractor_id: string
          created_at: string
          id: string
          payment_amount: number
          payment_frequency: string | null
          payment_type: string
          school_id: string
          status: string
          terms_and_conditions: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          contract_document_url?: string | null
          contract_end_date: string
          contract_number?: string | null
          contract_start_date: string
          contractor_id: string
          created_at?: string
          id?: string
          payment_amount: number
          payment_frequency?: string | null
          payment_type: string
          school_id: string
          status?: string
          terms_and_conditions?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          contract_document_url?: string | null
          contract_end_date?: string
          contract_number?: string | null
          contract_start_date?: string
          contractor_id?: string
          created_at?: string
          id?: string
          payment_amount?: number
          payment_frequency?: string | null
          payment_type?: string
          school_id?: string
          status?: string
          terms_and_conditions?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_contracts_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "transport_contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_contracts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_contracts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_parts: {
        Row: {
          created_at: string
          expected_replacement_date: string | null
          id: string
          installation_date: string
          installation_odometer: number | null
          manufacturer: string | null
          notes: string | null
          part_category: string | null
          part_name: string
          part_serial_number: string | null
          replaced_part_id: string | null
          replacement_cost: number | null
          standard_lifetime_kms: number | null
          standard_lifetime_months: number | null
          status: string
          updated_at: string
          vehicle_id: string
          warranty_expiry_date: string | null
          warranty_kms: number | null
          warranty_months: number | null
          warranty_type: string | null
        }
        Insert: {
          created_at?: string
          expected_replacement_date?: string | null
          id?: string
          installation_date: string
          installation_odometer?: number | null
          manufacturer?: string | null
          notes?: string | null
          part_category?: string | null
          part_name: string
          part_serial_number?: string | null
          replaced_part_id?: string | null
          replacement_cost?: number | null
          standard_lifetime_kms?: number | null
          standard_lifetime_months?: number | null
          status?: string
          updated_at?: string
          vehicle_id: string
          warranty_expiry_date?: string | null
          warranty_kms?: number | null
          warranty_months?: number | null
          warranty_type?: string | null
        }
        Update: {
          created_at?: string
          expected_replacement_date?: string | null
          id?: string
          installation_date?: string
          installation_odometer?: number | null
          manufacturer?: string | null
          notes?: string | null
          part_category?: string | null
          part_name?: string
          part_serial_number?: string | null
          replaced_part_id?: string | null
          replacement_cost?: number | null
          standard_lifetime_kms?: number | null
          standard_lifetime_months?: number | null
          status?: string
          updated_at?: string
          vehicle_id?: string
          warranty_expiry_date?: string | null
          warranty_kms?: number | null
          warranty_months?: number | null
          warranty_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_parts_replaced_part_id_fkey"
            columns: ["replaced_part_id"]
            isOneToOne: false
            referencedRelation: "vehicle_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_parts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_utilization: {
        Row: {
          average_occupancy: number | null
          breakdowns_count: number | null
          created_at: string | null
          fuel_consumed_litres: number | null
          fuel_cost: number | null
          id: string
          maintenance_cost: number | null
          occupancy_rate: number | null
          report_date: string
          school_id: string
          total_capacity: number | null
          total_distance_km: number | null
          total_hours_used: number | null
          trips_count: number | null
          updated_at: string | null
          utilization_percentage: number | null
          vehicle_id: string | null
        }
        Insert: {
          average_occupancy?: number | null
          breakdowns_count?: number | null
          created_at?: string | null
          fuel_consumed_litres?: number | null
          fuel_cost?: number | null
          id?: string
          maintenance_cost?: number | null
          occupancy_rate?: number | null
          report_date: string
          school_id: string
          total_capacity?: number | null
          total_distance_km?: number | null
          total_hours_used?: number | null
          trips_count?: number | null
          updated_at?: string | null
          utilization_percentage?: number | null
          vehicle_id?: string | null
        }
        Update: {
          average_occupancy?: number | null
          breakdowns_count?: number | null
          created_at?: string | null
          fuel_consumed_litres?: number | null
          fuel_cost?: number | null
          id?: string
          maintenance_cost?: number | null
          occupancy_rate?: number | null
          report_date?: string
          school_id?: string
          total_capacity?: number | null
          total_distance_km?: number | null
          total_hours_used?: number | null
          trips_count?: number | null
          updated_at?: string | null
          utilization_percentage?: number | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_utilization_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          assistant_id: string | null
          capacity: number
          chassis_number: string | null
          color: string | null
          contractor_id: string | null
          created_at: string
          current_mileage_kmpl: number | null
          current_odometer: number | null
          driver_id: string | null
          engine_number: string | null
          fuel_type: string | null
          gps_device_id: string | null
          gps_device_status: string | null
          id: string
          insurance_expiry: string | null
          last_maintenance: string | null
          make: string | null
          make_model: string | null
          manufacturer_mileage_kmpl: number | null
          model: string | null
          next_maintenance: string | null
          ownership_type: string | null
          purchase_date: string | null
          purchase_price: number | null
          registration_number: string | null
          retirement_date: string | null
          school_id: string
          status: string
          tank_capacity_litres: number | null
          updated_at: string
          vehicle_number: string
          vehicle_type: string
          virtual_fuel_litres: number | null
          year_manufactured: number | null
        }
        Insert: {
          assistant_id?: string | null
          capacity: number
          chassis_number?: string | null
          color?: string | null
          contractor_id?: string | null
          created_at?: string
          current_mileage_kmpl?: number | null
          current_odometer?: number | null
          driver_id?: string | null
          engine_number?: string | null
          fuel_type?: string | null
          gps_device_id?: string | null
          gps_device_status?: string | null
          id?: string
          insurance_expiry?: string | null
          last_maintenance?: string | null
          make?: string | null
          make_model?: string | null
          manufacturer_mileage_kmpl?: number | null
          model?: string | null
          next_maintenance?: string | null
          ownership_type?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_number?: string | null
          retirement_date?: string | null
          school_id: string
          status?: string
          tank_capacity_litres?: number | null
          updated_at?: string
          vehicle_number: string
          vehicle_type?: string
          virtual_fuel_litres?: number | null
          year_manufactured?: number | null
        }
        Update: {
          assistant_id?: string | null
          capacity?: number
          chassis_number?: string | null
          color?: string | null
          contractor_id?: string | null
          created_at?: string
          current_mileage_kmpl?: number | null
          current_odometer?: number | null
          driver_id?: string | null
          engine_number?: string | null
          fuel_type?: string | null
          gps_device_id?: string | null
          gps_device_status?: string | null
          id?: string
          insurance_expiry?: string | null
          last_maintenance?: string | null
          make?: string | null
          make_model?: string | null
          manufacturer_mileage_kmpl?: number | null
          model?: string | null
          next_maintenance?: string | null
          ownership_type?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_number?: string | null
          retirement_date?: string | null
          school_id?: string
          status?: string
          tank_capacity_litres?: number | null
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string
          virtual_fuel_litres?: number | null
          year_manufactured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "transport_contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: Json | null
          bank_details: Json | null
          contact_person: string | null
          created_at: string
          currency: string
          email: string | null
          id: string
          is_active: boolean
          notes: string | null
          payment_terms: string | null
          phone: string | null
          tax_number: string | null
          updated_at: string
          vendor_code: string
          vendor_name: string
        }
        Insert: {
          address?: Json | null
          bank_details?: Json | null
          contact_person?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          tax_number?: string | null
          updated_at?: string
          vendor_code: string
          vendor_name: string
        }
        Update: {
          address?: Json | null
          bank_details?: Json | null
          contact_person?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          tax_number?: string | null
          updated_at?: string
          vendor_code?: string
          vendor_name?: string
        }
        Relationships: []
      }
      year_groups: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_stage: string | null
          school_id: string | null
          sort_order: number
          updated_at: string
          year_code: string
          year_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_stage?: string | null
          school_id?: string | null
          sort_order?: number
          updated_at?: string
          year_code: string
          year_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_stage?: string | null
          school_id?: string | null
          sort_order?: number
          updated_at?: string
          year_code?: string
          year_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "year_groups_school_id_fkey"
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
      calculate_gap_risk_level: {
        Args: {
          coverage_percentage: number
          days_behind: number
          deadline_date: string
        }
        Returns: string
      }
      can_access_lesson_plan: {
        Args: { lesson_plan_id: string; user_id?: string }
        Returns: boolean
      }
      can_access_student: { Args: { student_uuid: string }; Returns: boolean }
      can_access_student_in_school: {
        Args: { student_school_id: string }
        Returns: boolean
      }
      can_approve_lesson_plan: {
        Args: { lesson_plan_id: string; user_id?: string }
        Returns: boolean
      }
      can_edit_lesson_plan: {
        Args: { lesson_plan_id: string; user_id?: string }
        Returns: boolean
      }
      can_manage_attendance_summary: {
        Args: { target_school_id: string }
        Returns: boolean
      }
      check_must_change_password: { Args: never; Returns: boolean }
      clear_password_change_requirement: { Args: never; Returns: undefined }
      create_complete_student_enrollment: {
        Args: {
          application_id: string
          created_by?: string
          parent_data: Json
          school_id: string
          student_data: Json
        }
        Returns: Json
      }
      create_employee_with_user: {
        Args: { created_by?: string; employee_data: Json }
        Returns: Json
      }
      create_student_with_user: {
        Args: { created_by?: string; school_id: string; student_data: Json }
        Returns: Json
      }
      decrement_activity_enrollment: {
        Args: { activity_id: string }
        Returns: undefined
      }
      generate_receipt_number: { Args: never; Returns: string }
      generate_report_card_data: {
        Args: {
          p_academic_term: string
          p_academic_year: string
          p_student_id: string
        }
        Returns: Json
      }
      get_next_accession_number: {
        Args: { p_school_id: string }
        Returns: number
      }
      get_user_roles: {
        Args: { school_uuid?: string; user_uuid: string }
        Returns: {
          department: string
          role: Database["public"]["Enums"]["app_role"]
          school_id: string
          year_group: string
        }[]
      }
      get_user_school_ids: { Args: { _user_id: string }; Returns: string[] }
      has_library_access: { Args: { p_school_id: string }; Returns: boolean }
      has_permission: {
        Args: {
          permission: Database["public"]["Enums"]["permission_type"]
          resource: Database["public"]["Enums"]["resource_type"]
          school_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
      increment_activity_enrollment: {
        Args: { activity_id: string }
        Returns: undefined
      }
      is_super_admin: { Args: { user_uuid: string }; Returns: boolean }
      remove_demo_profiles_and_roles: { Args: never; Returns: Json }
      request_password_reset: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      reset_public_data_preserve_auth: { Args: never; Returns: Json }
      self_serve_create_school: { Args: { school_data: Json }; Returns: string }
    }
    Enums: {
      academic_period_type: "term" | "semester" | "quarter" | "year" | "custom"
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
        | "ta"
      approval_status: "pending" | "approved" | "rejected" | "escalated"
      audience_type:
        | "entire_school"
        | "specific_classes"
        | "specific_teachers"
        | "specific_parents"
        | "specific_students"
        | "year_groups"
        | "departments"
        | "custom_list"
      communication_priority: "low" | "normal" | "high" | "urgent"
      communication_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "rejected"
        | "sent"
        | "scheduled"
      communication_type:
        | "announcement"
        | "newsletter"
        | "emergency_alert"
        | "event_notification"
        | "academic_update"
        | "administrative_notice"
        | "parent_communication"
        | "staff_memo"
      complaint_priority: "low" | "medium" | "high" | "urgent"
      complaint_status:
        | "submitted"
        | "under_review"
        | "investigating"
        | "resolved"
        | "closed"
      complaint_type:
        | "academic"
        | "behavioral"
        | "bullying"
        | "staff_conduct"
        | "facilities"
        | "discrimination"
        | "other"
      coverage_status: "not_started" | "in_progress" | "completed" | "reviewed"
      curriculum_type:
        | "english_national"
        | "common_core"
        | "cbse"
        | "icse"
        | "cambridge"
        | "ib"
        | "custom"
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
        | "admission_decision"
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
      fee_collection_role: "cashier" | "supervisor" | "admin"
      incident_severity: "minor" | "moderate" | "serious" | "critical"
      incident_type:
        | "injury"
        | "illness"
        | "accident"
        | "medication"
        | "emergency"
        | "other"
      library_book_status:
        | "available"
        | "issued"
        | "reserved"
        | "lost"
        | "withdrawn"
        | "repair"
        | "processing"
      library_book_type: "circulation" | "reference"
      library_fine_status: "pending" | "paid" | "waived" | "partially_paid"
      library_member_type: "student" | "staff"
      library_source_type: "purchase" | "donation"
      library_verification_status: "found" | "missing" | "withdrawn" | "pending"
      medical_visit_status: "pending" | "in_progress" | "completed" | "referred"
      medical_visit_type:
        | "routine_checkup"
        | "illness"
        | "injury"
        | "medication_administration"
        | "emergency"
        | "follow_up"
      override_reason:
        | "policy_exception"
        | "emergency_circumstances"
        | "safeguarding_priority"
        | "staff_discretion"
        | "technical_issue"
        | "data_correction"
      permission_type: "read" | "write" | "delete" | "approve" | "escalate"
      record_status:
        | "open"
        | "in_progress"
        | "resolved"
        | "closed"
        | "escalated"
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
      safeguarding_concern_type:
        | "physical_abuse"
        | "emotional_abuse"
        | "sexual_abuse"
        | "neglect"
        | "bullying"
        | "self_harm"
        | "domestic_violence"
        | "online_safety"
        | "radicalisation"
        | "other"
      safeguarding_risk_level: "low" | "medium" | "high" | "critical"
      safeguarding_status:
        | "reported"
        | "assessed"
        | "investigating"
        | "action_taken"
        | "monitoring"
        | "closed"
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
      academic_period_type: ["term", "semester", "quarter", "year", "custom"],
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
        "ta",
      ],
      approval_status: ["pending", "approved", "rejected", "escalated"],
      audience_type: [
        "entire_school",
        "specific_classes",
        "specific_teachers",
        "specific_parents",
        "specific_students",
        "year_groups",
        "departments",
        "custom_list",
      ],
      communication_priority: ["low", "normal", "high", "urgent"],
      communication_status: [
        "draft",
        "pending_approval",
        "approved",
        "rejected",
        "sent",
        "scheduled",
      ],
      communication_type: [
        "announcement",
        "newsletter",
        "emergency_alert",
        "event_notification",
        "academic_update",
        "administrative_notice",
        "parent_communication",
        "staff_memo",
      ],
      complaint_priority: ["low", "medium", "high", "urgent"],
      complaint_status: [
        "submitted",
        "under_review",
        "investigating",
        "resolved",
        "closed",
      ],
      complaint_type: [
        "academic",
        "behavioral",
        "bullying",
        "staff_conduct",
        "facilities",
        "discrimination",
        "other",
      ],
      coverage_status: ["not_started", "in_progress", "completed", "reviewed"],
      curriculum_type: [
        "english_national",
        "common_core",
        "cbse",
        "icse",
        "cambridge",
        "ib",
        "custom",
      ],
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
        "admission_decision",
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
      fee_collection_role: ["cashier", "supervisor", "admin"],
      incident_severity: ["minor", "moderate", "serious", "critical"],
      incident_type: [
        "injury",
        "illness",
        "accident",
        "medication",
        "emergency",
        "other",
      ],
      library_book_status: [
        "available",
        "issued",
        "reserved",
        "lost",
        "withdrawn",
        "repair",
        "processing",
      ],
      library_book_type: ["circulation", "reference"],
      library_fine_status: ["pending", "paid", "waived", "partially_paid"],
      library_member_type: ["student", "staff"],
      library_source_type: ["purchase", "donation"],
      library_verification_status: ["found", "missing", "withdrawn", "pending"],
      medical_visit_status: ["pending", "in_progress", "completed", "referred"],
      medical_visit_type: [
        "routine_checkup",
        "illness",
        "injury",
        "medication_administration",
        "emergency",
        "follow_up",
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
      record_status: ["open", "in_progress", "resolved", "closed", "escalated"],
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
      safeguarding_concern_type: [
        "physical_abuse",
        "emotional_abuse",
        "sexual_abuse",
        "neglect",
        "bullying",
        "self_harm",
        "domestic_violence",
        "online_safety",
        "radicalisation",
        "other",
      ],
      safeguarding_risk_level: ["low", "medium", "high", "critical"],
      safeguarding_status: [
        "reported",
        "assessed",
        "investigating",
        "action_taken",
        "monitoring",
        "closed",
      ],
    },
  },
} as const
