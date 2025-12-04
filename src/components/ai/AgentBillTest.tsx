import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function AgentBillTest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testAI = async () => {
    setLoading(true);
    setStatus('idle');
    setResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-ai', {
        body: { message: message || "Hello Agent Bill! Are you integrated and working?" }
      });

      if (error) throw error;

      if (data.success) {
        setResponse(data.response);
        setStatus('success');
        toast.success('Agent Bill is integrated and responding!');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      console.error('AI test error:', error);
      setStatus('error');
      setResponse(error.message || 'Failed to connect to Agent Bill');
      toast.error('Failed to connect to Agent Bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Agent Bill Integration Test</CardTitle>
              <CardDescription>Test if the AI assistant is properly integrated</CardDescription>
            </div>
          </div>
          <Badge variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
            {status === 'success' && <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>}
            {status === 'error' && <><XCircle className="h-3 w-3 mr-1" /> Error</>}
            {status === 'idle' && 'Not tested'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message to test Agent Bill..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && testAI()}
          />
          <Button onClick={testAI} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {response && (
          <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className="text-sm font-medium mb-1">
              {status === 'success' ? 'Agent Bill says:' : 'Error:'}
            </p>
            <p className="text-sm">{response}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• Uses Lovable AI Gateway with Gemini 2.5 Flash</p>
          <p>• Edge function: test-ai</p>
        </div>
      </CardContent>
    </Card>
  );
}
