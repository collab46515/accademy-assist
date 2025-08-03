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
