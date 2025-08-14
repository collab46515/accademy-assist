import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function TestEnrollmentProcessor() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testDirectEnrollment = async () => {
    setProcessing(true);
    setResult(null);

    try {
      console.log('🧪 Starting test enrollment with auth users...');

      // Create test student data
      const studentEmail = `test-student-${Date.now()}@pappaya.academy`;
      const parentEmail = `test-parent-${Date.now()}@pappaya.academy`;
      const studentPassword = `TestStudent123!`;
      const parentPassword = `TestParent123!`;

      const studentData = {
        email: studentEmail,
        first_name: 'Test',
        last_name: 'Student',
        password: studentPassword,
        student_number: `TEST${Date.now()}`,
        year_group: 'Year 7',
        form_class: '7A',
        emergency_contact_name: 'Test Parent',
        emergency_contact_phone: '+44 7000 000000'
      };

      const parentData = {
        email: parentEmail,
        first_name: 'Test',
        last_name: 'Parent',
        password: parentPassword,
        relationship: 'Parent'
      };

      console.log('Step 1: Creating auth users and database records...');
      const { data: enrollmentResult, error: enrollmentError } = await supabase
        .functions.invoke('create-student-accounts', {
          body: {
            student_data: studentData,
            parent_data: parentData,
            school_id: '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
            application_id: `test-app-${Date.now()}`
          }
        });

      if (enrollmentError) {
        console.error('❌ Enrollment failed:', enrollmentError);
        throw new Error(`Enrollment failed: ${enrollmentError.message}`);
      }

      console.log('✅ Enrollment successful:', enrollmentResult);

      // Send test email
      console.log('Step 2: Sending test email...');
      const emailData = {
        studentData: {
          email: studentEmail,
          name: 'Test Student',
          studentNumber: studentData.student_number,
          yearGroup: studentData.year_group,
          tempPassword: studentPassword
        },
        parentData: {
          email: parentEmail,
          name: 'Test Parent',
          tempPassword: parentPassword,
          relationship: 'Parent'
        },
        schoolName: 'Pappaya Academy'
      };

      const { data: emailResult, error: emailError } = await supabase
        .functions.invoke('send-enrollment-emails', {
          body: emailData
        });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
      } else {
        console.log('✅ Test emails sent:', emailResult);
      }

      setResult({
        success: true,
        credentials: {
          student: { email: studentEmail, password: studentPassword },
          parent: { email: parentEmail, password: parentPassword }
        },
        enrollmentResult,
        emailResult,
        message: 'Test enrollment with auth users successful!'
      });

      toast({
        title: "Test Successful",
        description: `Created test accounts - Student: ${studentEmail} | Parent: ${parentEmail}`,
      });

    } catch (error: any) {
      console.error('🚨 Test failed:', error);
      setResult({
        success: false,
        error: error.message,
        message: 'Test failed - check console for details'
      });

      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Create Test Login Account</CardTitle>
        <p className="text-muted-foreground">
          Create a test student and parent with working login credentials
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testDirectEnrollment}
          disabled={processing}
          className="w-full"
        >
          {processing ? 'Creating Test Accounts...' : 'Create Test Login Accounts'}
        </Button>

        {result && (
          <div className="p-4 border rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}