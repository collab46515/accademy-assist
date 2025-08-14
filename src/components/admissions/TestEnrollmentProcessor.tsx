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
      console.log('🧪 Starting direct enrollment test...');

      // Test 1: Create student profile directly
      const studentUserId = crypto.randomUUID();
      const studentEmail = `test-student-${Date.now()}@example.com`;
      
      console.log('Step 1: Creating student profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: studentUserId,
          email: studentEmail,
          first_name: 'Test',
          last_name: 'Student',
          must_change_password: true
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }
      console.log('✅ Profile created:', profileData);

      // Test 2: Create student record
      console.log('Step 2: Creating student record...');
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: studentUserId,
          school_id: '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
          student_number: `TEST${Date.now()}`,
          year_group: 'Year 7',
          is_enrolled: true
        })
        .select()
        .single();

      if (studentError) {
        console.error('❌ Student creation failed:', studentError);
        throw new Error(`Student creation failed: ${studentError.message}`);
      }
      console.log('✅ Student created:', studentData);

      // Test 3: Create parent profile
      const parentUserId = crypto.randomUUID();
      const parentEmail = `test-parent-${Date.now()}@example.com`;
      
      console.log('Step 3: Creating parent profile...');
      const { data: parentProfileData, error: parentProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: parentUserId,
          email: parentEmail,
          first_name: 'Test',
          last_name: 'Parent',
          must_change_password: true
        })
        .select()
        .single();

      if (parentProfileError) {
        console.error('❌ Parent profile creation failed:', parentProfileError);
        throw new Error(`Parent profile creation failed: ${parentProfileError.message}`);
      }
      console.log('✅ Parent profile created:', parentProfileData);

      // Test 4: Link parent to student
      console.log('Step 4: Linking parent to student...');
      console.log('Student ID for linking:', studentData.id);
      console.log('Parent User ID for linking:', parentUserId);
      
      const { data: linkData, error: linkError } = await supabase
        .from('student_parents')
        .insert({
          student_id: studentData.id, // This should be the students.id
          parent_id: parentUserId,    // This should be the parent's user_id
          relationship: 'Parent'
        })
        .select()
        .single();

      if (linkError) {
        console.error('❌ Parent-Student linking failed:', linkError);
        console.error('Full error object:', JSON.stringify(linkError, null, 2));
        throw new Error(`Parent-Student linking failed: ${linkError.message}`);
      }
      console.log('✅ Parent-Student link created:', linkData);

      setResult({
        success: true,
        studentData,
        parentProfileData,
        linkData,
        message: 'Direct enrollment test successful!'
      });

      toast({
        title: "Test Successful",
        description: "Direct enrollment test completed successfully!",
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
        <CardTitle>🧪 Test Enrollment Processor</CardTitle>
        <p className="text-muted-foreground">
          Test direct database enrollment to debug foreign key issues
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testDirectEnrollment}
          disabled={processing}
          className="w-full"
        >
          {processing ? 'Testing...' : 'Run Direct Enrollment Test'}
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