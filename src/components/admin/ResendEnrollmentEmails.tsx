import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailResult {
  applicationNumber: string;
  studentName: string;
  success: boolean;
  error?: string;
  emailsSent?: number;
}

interface BatchEmailResponse {
  success: boolean;
  totalApplications: number;
  successCount: number;
  failureCount: number;
  results: EmailResult[];
  message?: string;
}

export function ResendEnrollmentEmails() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BatchEmailResponse | null>(null);
  const { toast } = useToast();

  const handleResendEmails = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('resend-enrollment-emails');

      if (error) {
        throw new Error(error.message);
      }

      setResults(data);
      
      if (data.success) {
        toast({
          title: "Emails Resent Successfully",
          description: `${data.successCount} emails sent successfully out of ${data.totalApplications} applications.`,
        });
      } else {
        toast({
          title: "Email Resend Failed", 
          description: data.message || "An error occurred while resending emails.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error resending emails:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend enrollment emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Resend Enrollment Emails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will resend welcome emails with login credentials to all previously enrolled students and their parents.
          </p>
          
          <Button 
            onClick={handleResendEmails} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending Emails...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend All Enrollment Emails
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Email Resend Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.message && !results.totalApplications && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{results.message}</AlertDescription>
              </Alert>
            )}

            {results.totalApplications > 0 && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{results.totalApplications}</div>
                    <div className="text-sm text-muted-foreground">Total Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.successCount}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{results.failureCount}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Detailed Results:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {results.results.map((result, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{result.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.applicationNumber}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Success
                              </Badge>
                              {result.emailsSent && (
                                <span className="text-xs text-muted-foreground">
                                  {result.emailsSent} email(s)
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <Badge variant="destructive">Failed</Badge>
                              {result.error && (
                                <span className="text-xs text-red-600 max-w-32 truncate" title={result.error}>
                                  {result.error}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}