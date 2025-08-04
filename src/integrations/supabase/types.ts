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
        }
        Insert: {
          category_name: string
          created_at?: string
          depreciation_rate?: number | null
          description?: string | null
          id?: string
        }
        Update: {
          category_name?: string
          created_at?: string
          depreciation_rate?: number | null
          description?: string | null
          id?: string
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
      document_categories: {
        Row: {
          category_name: string
          created_at: string
          description: string | null
          id: string
          is_confidential: boolean | null
          retention_period_months: number | null
        }
        Insert: {
          category_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_confidential?: boolean | null
          retention_period_months?: number | null
        }
        Update: {
          category_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_confidential?: boolean | null
          retention_period_months?: number | null
        }
        Relationships: []
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
          term: string
          total_amount: number
          updated_at: string
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
          term: string
          total_amount?: number
          updated_at?: string
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
          term?: string
          total_amount?: number
          updated_at?: string
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
      installment_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          frequency: string
          id: string
          interest_rate: number | null
          name: string
          number_of_installments: number
          school_id: string
          start_date: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          frequency: string
          id?: string
          interest_rate?: number | null
          name: string
          number_of_installments: number
          school_id: string
          start_date: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          frequency?: string
          id?: string
          interest_rate?: number | null
          name?: string
          number_of_installments?: number
          school_id?: string
          start_date?: string
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
          school_id: string
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
          school_id: string
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
      can_access_student: {
        Args: { student_uuid: string }
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
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
