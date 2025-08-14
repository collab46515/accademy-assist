import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Copy, Eye, EyeOff } from 'lucide-react';

export function SimpleTestAccount() {
  const [creating, setCreating] = useState(false);
  const [testCredentials, setTestCredentials] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const createSimpleTestAccount = async () => {
    setCreating(true);
    
    try {
      console.log('Creating verified test accounts...');
      
      // Fixed test credentials
      const studentEmail = 'test.student@pappaya.academy';
      const parentEmail = 'test.parent@pappaya.academy';
      const studentPassword = 'TestStudent123';
      const parentPassword = 'TestParent123';
      
      // Call edge function to create verified accounts
      const { data, error } = await supabase.functions.invoke('create-student-accounts', {
        body: {
          student_data: {
            email: studentEmail,
            first_name: 'Test',
            last_name: 'Student',
            password: studentPassword,
            student_number: 'TEST001',
            year_group: 'Year 7',
            form_class: '7A',
            emergency_contact_name: 'Test Parent',
            emergency_contact_phone: '+44 7000 000000'
          },
          parent_data: {
            email: parentEmail,
            first_name: 'Test',
            last_name: 'Parent',
            password: parentPassword,
            relationship: 'Parent'
          },
          school_id: '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
          application_id: 'test-fixed-accounts'
        }
      });

      if (error) {
        // If accounts already exist, that's fine
        if (error.message?.includes('already registered') || error.message?.includes('duplicate key')) {
          console.log('Accounts already exist, showing credentials');
        } else {
          throw error;
        }
      }
      
      console.log('✅ Test accounts ready');
      
      setTestCredentials({
        student: { email: studentEmail, password: studentPassword },
        parent: { email: parentEmail, password: parentPassword }
      });
      
      toast({
        title: "Test Accounts Ready!",
        description: "Verified accounts created. You can now log in immediately!",
      });
      
    } catch (error: any) {
      console.error('Error creating test account:', error);
      
      // Still show credentials even if there was an error - they might already exist
      setTestCredentials({
        student: { email: 'test.student@pappaya.academy', password: 'TestStudent123' },
        parent: { email: 'test.parent@pappaya.academy', password: 'TestParent123' }
      });
      
      toast({
        title: "Accounts May Already Exist",
        description: "Try logging in with the credentials below. If it fails, disable email confirmation in Supabase settings.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚀 Quick Test Login Accounts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create or use existing test accounts for https://pappaya.academy
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createSimpleTestAccount}
          disabled={creating}
          className="w-full"
        >
          {creating ? 'Creating Test Accounts...' : 'Create/Get Test Login Accounts'}
        </Button>

        {testCredentials && (
          <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">✅ Test Accounts Ready!</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-white border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-700">👨‍🎓 Student Account</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${testCredentials.student.email}\n${testCredentials.student.password}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm"><strong>Email:</strong> {testCredentials.student.email}</p>
                <p className="text-sm">
                  <strong>Password:</strong> 
                  {showPasswords ? testCredentials.student.password : '••••••••••••'}
                </p>
              </div>
              
              <div className="p-3 bg-white border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-700">👩‍👦 Parent Account</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${testCredentials.parent.email}\n${testCredentials.parent.password}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm"><strong>Email:</strong> {testCredentials.parent.email}</p>
                <p className="text-sm">
                  <strong>Password:</strong> 
                  {showPasswords ? testCredentials.parent.password : '••••••••••••'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPasswords ? 'Hide' : 'Show'} Passwords
              </Button>
              
              <Button
                onClick={() => window.open('https://pappaya.academy/', '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                🚀 Go to Login Page
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}