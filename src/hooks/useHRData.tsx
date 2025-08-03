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
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

  // Fetch all HR data
  const fetchHRData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (employeesError) throw employeesError;

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (departmentsError) throw departmentsError;

      // Fetch leave requests
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (leaveError) throw leaveError;

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false })
        .limit(100);

      if (attendanceError) throw attendanceError;

      // Fetch payroll records
      const { data: payrollData, error: payrollError } = await supabase
        .from('payroll_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (payrollError) throw payrollError;

      setEmployees(employeesData || []);
      setDepartments(departmentsData || []);
      setLeaveRequests(leaveData || []);
      setAttendanceRecords(attendanceData || []);
      setPayrollRecords(payrollData || []);

    } catch (error) {
      console.error('Error fetching HR data:', error);
      toast({
        title: "Error",
        description: "Failed to load HR data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new employee
  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Employee created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: "Failed to create employee. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update employee
  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => prev.map(emp => emp.id === id ? data : emp));
      toast({
        title: "Success",
        description: "Employee updated successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create department
  const createDepartment = async (deptData: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([deptData])
        .select()
        .single();

      if (error) throw error;

      setDepartments(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Department created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create leave request
  const createLeaveRequest = async (leaveData: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{ ...leaveData, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;

      setLeaveRequests(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Leave request submitted successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating leave request:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Approve/Reject leave request
  const processLeaveRequest = async (id: string, action: 'approved' | 'rejected', reason?: string) => {
    try {
      const updates: any = {
        status: action,
        approved_at: new Date().toISOString(),
      };

      if (action === 'rejected' && reason) {
        updates.rejection_reason = reason;
      }

      const { data, error } = await supabase
        .from('leave_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLeaveRequests(prev => prev.map(req => req.id === id ? data : req));
      toast({
        title: "Success",
        description: `Leave request ${action} successfully.`,
      });

      return data;
    } catch (error) {
      console.error('Error processing leave request:', error);
      toast({
        title: "Error",
        description: "Failed to process leave request. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Record attendance
  const recordAttendance = async (attendanceData: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert([attendanceData])
        .select()
        .single();

      if (error) throw error;

      setAttendanceRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Attendance recorded successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Process payroll
  const processPayroll = async (payrollData: Omit<PayrollRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('payroll_records')
        .insert([payrollData])
        .select()
        .single();

      if (error) throw error;

      setPayrollRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Payroll processed successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast({
        title: "Error",
        description: "Failed to process payroll. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update payroll status
  const updatePayrollStatus = async (id: string, status: 'draft' | 'processed' | 'paid', payDate?: string) => {
    try {
      const updates: any = { status };
      if (payDate) updates.pay_date = payDate;

      const { data, error } = await supabase
        .from('payroll_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPayrollRecords(prev => prev.map(record => record.id === id ? data : record));
      toast({
        title: "Success",
        description: `Payroll ${status} successfully.`,
      });

      return data;
    } catch (error) {
      console.error('Error updating payroll status:', error);
      toast({
        title: "Error",
        description: "Failed to update payroll status. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchHRData();

    // Subscribe to real-time updates
    const employeesChannel = supabase
      .channel('employees-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, () => {
        fetchHRData();
      })
      .subscribe();

    const leaveChannel = supabase
      .channel('leave-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, () => {
        fetchHRData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(employeesChannel);
      supabase.removeChannel(leaveChannel);
    };
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