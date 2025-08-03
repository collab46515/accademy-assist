import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  employee_id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: string;
  position: string;
  manager_id?: string;
  start_date: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  work_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  location?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  bank_account_details?: any;
  tax_information?: any;
  benefits?: any;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  department_head_id?: string;
  budget?: number;
  cost_center?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  break_duration?: number;
  total_hours?: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  basic_salary: number;
  allowances: number;
  overtime_pay: number;
  bonus: number;
  gross_salary: number;
  tax_deduction: number;
  insurance_deduction: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  status: 'draft' | 'processed' | 'paid';
  pay_date?: string;
  created_at: string;
  updated_at: string;
}

export function useHRData() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

  // Fetch all HR data - disabled until migration
  const fetchHRData = async () => {
    console.log('HR tables not yet created. Please approve the database migration.');
  };

  // Create new employee - disabled until migration
  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Update employee - disabled until migration
  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Create department - disabled until migration
  const createDepartment = async (deptData: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Create leave request - disabled until migration
  const createLeaveRequest = async (leaveData: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Approve/Reject leave request - disabled until migration
  const processLeaveRequest = async (id: string, action: 'approved' | 'rejected', reason?: string) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Record attendance - disabled until migration
  const recordAttendance = async (attendanceData: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Process payroll - disabled until migration
  const processPayroll = async (payrollData: Omit<PayrollRecord, 'id' | 'created_at' | 'updated_at'>) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  // Update payroll status - disabled until migration
  const updatePayrollStatus = async (id: string, status: 'draft' | 'processed' | 'paid', payDate?: string) => {
    throw new Error('HR tables not created yet. Please approve the database migration.');
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  return {
    loading,
    employees,
    departments,
    leaveRequests,
    attendanceRecords,
    payrollRecords,
    createEmployee,
    updateEmployee,
    createDepartment,
    createLeaveRequest,
    processLeaveRequest,
    recordAttendance,
    processPayroll,
    updatePayrollStatus,
    refreshData: fetchHRData,
  };
}