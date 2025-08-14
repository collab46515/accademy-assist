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
      console.log('Creating simple test account...');
      
      // Fixed test credentials
      const studentEmail = 'test.student@pappaya.academy';
      const parentEmail = 'test.parent@pappaya.academy';
      const studentPassword = 'TestStudent123';
      const parentPassword = 'TestParent123';
      
      console.log('Test credentials:', { studentEmail, parentEmail });
      
      // Try to sign up the test student
      const { data: studentSignup, error: studentError } = await supabase.auth.signUp({
        email: studentEmail,
        password: studentPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (studentError && !studentError.message.includes('already registered')) {
        throw new Error(`Student signup failed: ${studentError.message}`);
      }
      
      // Try to sign up the test parent
      const { data: parentSignup, error: parentError } = await supabase.auth.signUp({
        email: parentEmail,
        password: parentPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (parentError && !parentError.message.includes('already registered')) {
        throw new Error(`Parent signup failed: ${parentError.message}`);
      }
      
      console.log('✅ Test accounts created or already exist');
      
      setTestCredentials({
        student: { email: studentEmail, password: studentPassword },
        parent: { email: parentEmail, password: parentPassword }
      });
      
      toast({
        title: "Test Accounts Ready!",
        description: "You can now log in with the credentials shown below",
      });
      
    } catch (error: any) {
      console.error('Error creating test account:', error);
      toast({
        title: "Error",
        description: error.message,
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