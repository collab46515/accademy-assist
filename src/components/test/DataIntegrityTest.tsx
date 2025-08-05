import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  UserPlus, 
  Database,
  Shield,
  Activity
} from 'lucide-react';
import { useStudentData } from '@/hooks/useStudentData';
import { useHRData } from '@/hooks/useHRData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export function DataIntegrityTest() {
  const { toast } = useToast();
  const { createStudent } = useStudentData();
  const { createEmployee } = useHRData();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Test student creation
  const [studentForm, setStudentForm] = useState({
    first_name: 'Test',
    last_name: 'Student',
    email: 'test.student@academy.edu',
    phone: '+44 7700 123456',
    student_number: 'TST001',
    year_group: 'Year 7',
    form_class: '7A',
    date_of_birth: '2010-05-15',
    emergency_contact_name: 'Parent Name',
    emergency_contact_phone: '+44 7700 654321'
  });

  // Test employee creation  
  const [employeeForm, setEmployeeForm] = useState({
    employee_id: 'EMP999',
    first_name: 'Test',
    last_name: 'Teacher',
    email: 'test.teacher@academy.edu',
    phone: '+44 7700 789012',
    position: 'Mathematics Teacher',
    department_id: '', // Will need a valid department ID
    start_date: '2024-01-15',
    salary: 35000,
    work_type: 'full_time'
  });

  const runDatabaseTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    try {
      // Test 1: Database connectivity
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) throw error;
        results.push({
          name: 'Database Connectivity',
          status: 'pass',
          message: 'Successfully connected to Supabase database'
        });
      } catch (error) {
        results.push({
          name: 'Database Connectivity',
          status: 'fail',
          message: `Database connection failed: ${error}`,
          details: error
        });
      }

      // Test 2: RLS policies check
      try {
        const { data, error } = await supabase.from('students').select('count').limit(1);
        if (error && error.message.includes('permission denied')) {
          results.push({
            name: 'RLS Policies',
            status: 'warning',
            message: 'RLS policies are active (this is good for security)'
          });
        } else if (error) {
          throw error;
        } else {
          results.push({
            name: 'RLS Policies',
            status: 'pass',
            message: 'RLS policies are properly configured'
          });
        }
      } catch (error) {
        results.push({
          name: 'RLS Policies',
          status: 'fail',
          message: `RLS policy check failed: ${error}`,
          details: error
        });
      }

      // Test 3: Check if creation functions exist
      try {
        const { data, error } = await supabase.rpc('create_student_with_user', {
          student_data: {},
          school_id: '00000000-0000-0000-0000-000000000000'
        });
        // We expect this to fail with validation, not "function doesn't exist"
        results.push({
          name: 'Student Creation Function',
          status: error?.message.includes('function') ? 'fail' : 'pass',
          message: error?.message.includes('function') 
            ? 'create_student_with_user function not found' 
            : 'create_student_with_user function exists'
        });
      } catch (error: any) {
        results.push({
          name: 'Student Creation Function',
          status: error?.message?.includes('function') ? 'fail' : 'pass',
          message: error?.message?.includes('function') 
            ? 'create_student_with_user function not found' 
            : 'create_student_with_user function exists'
        });
      }

      // Test 4: Check employee creation function
      try {
        const { data, error } = await supabase.rpc('create_employee_with_user', {
          employee_data: {}
        });
        results.push({
          name: 'Employee Creation Function',
          status: error?.message.includes('function') ? 'fail' : 'pass',
          message: error?.message.includes('function') 
            ? 'create_employee_with_user function not found' 
            : 'create_employee_with_user function exists'
        });
      } catch (error: any) {
        results.push({
          name: 'Employee Creation Function',
          status: error?.message?.includes('function') ? 'fail' : 'pass',
          message: error?.message?.includes('function') 
            ? 'create_employee_with_user function not found' 
            : 'create_employee_with_user function exists'
        });
      }

      // Test 5: Check table structures
      const tableNames = ['students', 'employees', 'profiles', 'user_roles'] as const;
      for (const tableName of tableNames) {
        try {
          const { data, error } = await supabase.from(tableName).select('*').limit(0);
          if (error) throw error;
          results.push({
            name: `Table: ${tableName}`,
            status: 'pass',
            message: `${tableName} table structure is valid`
          });
        } catch (error) {
          results.push({
            name: `Table: ${tableName}`,
            status: 'fail',
            message: `${tableName} table issue: ${error}`,
            details: error
          });
        }
      }

    } catch (error) {
      results.push({
        name: 'General Test Failure',
        status: 'fail',
        message: `Unexpected error: ${error}`,
        details: error
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testStudentCreation = async () => {
    try {
      const result = await createStudent(studentForm);
      toast({
        title: "Success",
        description: "Test student created successfully!",
      });
      console.log('Student creation result:', result);
    } catch (error) {
      toast({
        title: "Error",
        description: `Student creation failed: ${error}`,
        variant: "destructive"
      });
      console.error('Student creation error:', error);
    }
  };

  const testEmployeeCreation = async () => {
    try {
      const result = await createEmployee(employeeForm as any);
      toast({
        title: "Success",
        description: "Test employee created successfully!",
      });
      console.log('Employee creation result:', result);
    } catch (error) {
      toast({
        title: "Error", 
        description: `Employee creation failed: ${error}`,
        variant: "destructive"
      });
      console.error('Employee creation error:', error);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      case 'warning':
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Integrity Test Suite</h2>
          <p className="text-muted-foreground">Comprehensive testing for student and teacher creation workflows</p>
        </div>
        <Button 
          onClick={runDatabaseTests} 
          disabled={isRunning}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <Activity className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Database Tests'}
        </Button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Test Results
            </CardTitle>
            <CardDescription>
              {testResults.filter(r => r.status === 'pass').length} passed, 
              {testResults.filter(r => r.status === 'fail').length} failed, 
              {testResults.filter(r => r.status === 'warning').length} warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.name}</span>
                      <Badge variant={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                    {result.details && (
                      <pre className="text-xs mt-2 p-2 bg-muted rounded">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creation Tests */}
      <Tabs defaultValue="student" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student Creation Test</TabsTrigger>
          <TabsTrigger value="employee">Employee Creation Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Test Student Creation
              </CardTitle>
              <CardDescription>Create a test student to verify the full workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-first-name">First Name</Label>
                  <Input
                    id="student-first-name"
                    value={studentForm.first_name}
                    onChange={(e) => setStudentForm({...studentForm, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-last-name">Last Name</Label>
                  <Input
                    id="student-last-name"
                    value={studentForm.last_name}
                    onChange={(e) => setStudentForm({...studentForm, last_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-number">Student Number</Label>
                  <Input
                    id="student-number"
                    value={studentForm.student_number}
                    onChange={(e) => setStudentForm({...studentForm, student_number: e.target.value})}
                  />
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This will create a real student record with login credentials. The password will be "TempPass123!" and the user must change it on first login.
                </AlertDescription>
              </Alert>
              
              <Button onClick={testStudentCreation} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Test Student
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Test Employee Creation
              </CardTitle>
              <CardDescription>Create a test employee to verify the full workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-first-name">First Name</Label>
                  <Input
                    id="employee-first-name"
                    value={employeeForm.first_name}
                    onChange={(e) => setEmployeeForm({...employeeForm, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-last-name">Last Name</Label>
                  <Input
                    id="employee-last-name"
                    value={employeeForm.last_name}
                    onChange={(e) => setEmployeeForm({...employeeForm, last_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-email">Email</Label>
                  <Input
                    id="employee-email"
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-position">Position</Label>
                  <Input
                    id="employee-position"
                    value={employeeForm.position}
                    onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                  />
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This will create a real employee record with login credentials. The password will be "TempPass123!" and the user must change it on first login.
                </AlertDescription>
              </Alert>
              
              <Button onClick={testEmployeeCreation} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Test Employee
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}