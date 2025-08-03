import { useState, useEffect } from 'react';
import { useCollectionSession } from '@/hooks/useCollectionSession';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, DollarSign, User, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionWithDetails {
  id: string;
  cashier_id: string;
  school_id: string;
  session_start: string;
  session_end?: string;
  opening_cash_amount: number;
  closing_cash_amount?: number;
  expected_cash_amount: number;
  variance_amount: number;
  status: string;
  notes?: string;
  supervisor_approved_by?: string;
  supervisor_approved_at?: string;
  supervisor_notes?: string;
  created_at: string;
  updated_at: string;
  cashier_name?: string;
  supervisor_name?: string;
  payment_count?: number;
  total_payments?: number;
}

export function SessionReportsAndApproval() {
  const { user } = useAuth();
  const { currentSchool } = useRBAC();
  const { approveSession } = useCollectionSession();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null);
  const [supervisorNotes, setSupervisorNotes] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  useEffect(() => {
    if (currentSchool) {
      fetchSessions();
    }
  }, [currentSchool]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      // Fetch sessions with payment counts
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('collection_sessions')
        .select('*')
        .eq('school_id', currentSchool!.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Fetch payment counts for each session
      const sessionsWithDetails = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { data: paymentsData } = await supabase
            .from('payment_records')
            .select('amount_paid')
            .eq('collection_session_id', session.id);

          const paymentCount = paymentsData?.length || 0;
          const totalPayments = paymentsData?.reduce((sum, p) => sum + p.amount_paid, 0) || 0;

          return {
            ...session,
            payment_count: paymentCount,
            total_payments: totalPayments,
          };
        })
      );

      setSessions(sessionsWithDetails);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collection sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSession = async () => {
    if (!selectedSession) return;

    await approveSession(selectedSession.id, supervisorNotes);
    setSupervisorNotes('');
    setShowApprovalDialog(false);
    setSelectedSession(null);
    fetchSessions(); // Refresh the data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'closed': return 'bg-yellow-500';
      case 'reconciled': return 'bg-blue-500';
      case 'approved': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatVariance = (variance: number) => {
    const color = variance === 0 ? 'text-green-600' : variance > 0 ? 'text-blue-600' : 'text-red-600';
    return (
      <span className={color}>
        £{Math.abs(variance).toFixed(2)} {variance > 0 ? 'Over' : variance < 0 ? 'Short' : ''}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading session reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Collection Session Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <SessionsTable 
                sessions={sessions}
                onSelectSession={setSelectedSession}
                onOpenApproval={() => setShowApprovalDialog(true)}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <SessionsTable 
                sessions={sessions.filter(s => s.status === 'closed')}
                onSelectSession={setSelectedSession}
                onOpenApproval={() => setShowApprovalDialog(true)}
              />
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <SessionsTable 
                sessions={sessions.filter(s => s.status === 'approved')}
                onSelectSession={setSelectedSession}
                onOpenApproval={() => setShowApprovalDialog(true)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Collection Session</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Session ID:</strong> {selectedSession.id.slice(0, 8)}...
                </div>
                <div>
                  <strong>Date:</strong> {new Date(selectedSession.session_start).toLocaleDateString()}
                </div>
                <div>
                  <strong>Expected:</strong> £{selectedSession.expected_cash_amount.toFixed(2)}
                </div>
                <div>
                  <strong>Actual:</strong> £{(selectedSession.closing_cash_amount || 0).toFixed(2)}
                </div>
                <div className="col-span-2">
                  <strong>Variance:</strong> {formatVariance(selectedSession.variance_amount)}
                </div>
              </div>

              <div>
                <Label htmlFor="supervisor-notes">Supervisor Notes</Label>
                <Textarea
                  id="supervisor-notes"
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="Add any notes about this session approval..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleApproveSession}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Session
                </Button>
                <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SessionsTableProps {
  sessions: SessionWithDetails[];
  onSelectSession: (session: SessionWithDetails) => void;
  onOpenApproval: () => void;
}

function SessionsTable({ sessions, onSelectSession, onOpenApproval }: SessionsTableProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      closed: 'bg-yellow-500',
      reconciled: 'bg-blue-500',
      approved: 'bg-purple-500',
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-500'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatVariance = (variance: number) => {
    const color = variance === 0 ? 'text-green-600' : variance > 0 ? 'text-blue-600' : 'text-red-600';
    return (
      <span className={color}>
        £{Math.abs(variance).toFixed(2)} {variance > 0 ? 'Over' : variance < 0 ? 'Short' : ''}
      </span>
    );
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Session ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payments</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Variance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                {new Date(session.session_start).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-mono">
                {session.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                {getStatusBadge(session.status)}
              </TableCell>
              <TableCell>
                {session.payment_count} (£{(session.total_payments || 0).toFixed(2)})
              </TableCell>
              <TableCell>
                £{session.expected_cash_amount.toFixed(2)}
              </TableCell>
              <TableCell>
                £{(session.closing_cash_amount || 0).toFixed(2)}
              </TableCell>
              <TableCell>
                {formatVariance(session.variance_amount)}
              </TableCell>
              <TableCell>
                {session.status === 'closed' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onSelectSession(session);
                      onOpenApproval();
                    }}
                  >
                    Approve
                  </Button>
                )}
                {session.status === 'approved' && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Approved
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}