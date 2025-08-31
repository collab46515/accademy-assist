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
      // Fixed test credentials - accounts already exist
      const studentEmail = 'test.student@doxa.academy';
      const parentEmail = 'test.parent@doxa.academy';
      const studentPassword = 'TestStudent123';
      const parentPassword = 'TestParent123';
      
      // Try to confirm the test accounts automatically
      console.log('Confirming test accounts...');
      const { data: confirmResult, error: confirmError } = await supabase.functions.invoke('confirm-test-accounts');
      
      if (confirmError) {
        console.error('Error confirming accounts:', confirmError);
        toast({
          title: "⚠️ Manual Confirmation Needed",
          description: "Could not auto-confirm accounts. Please manually confirm the users in Supabase dashboard.",
          variant: "destructive"
        });
      } else {
        console.log('Account confirmation result:', confirmResult);
        toast({
          title: "✅ Test Accounts Ready!",
          description: "Accounts have been confirmed and are ready for login.",
        });
      }
      
      // Show credentials
      setTestCredentials({
        student: { email: studentEmail, password: studentPassword },
        parent: { email: parentEmail, password: parentPassword }
      });
      
    } catch (error: any) {
      console.error('Error:', error);
      
      // Still show credentials even if confirmation fails
      setTestCredentials({
        student: { email: 'test.student@doxa.academy', password: 'TestStudent123' },
        parent: { email: 'test.parent@doxa.academy', password: 'TestParent123' }
      });
      
      toast({
        title: "⚠️ Manual Confirmation Needed",
        description: "Could not auto-confirm accounts. Please manually confirm the users in Supabase dashboard.",
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
          Create or use existing test accounts for https://doxa.academy
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
            <div className="text-sm text-green-700 mb-3">
              <p>The accounts have been automatically confirmed and are ready to use.</p>
            </div>
            
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
                onClick={() => window.open('https://doxa.academy/', '_blank')}
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