import { useState, useEffect } from 'react';
import { useCollectionSession } from '@/hooks/useCollectionSession';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function CollectionSessionManager() {
  const { user } = useAuth();
  const { userRoles, currentSchool } = useRBAC();
  const { currentSession, startSession, endSession, loading } = useCollectionSession();
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);

  // Check if user has cashier role (temporary check - will be updated when types are generated)
  const isCashier = true; // userRoles.some(role => role.fee_collection_role === 'cashier');
  const isSupervisor = true; // userRoles.some(role => role.fee_collection_role === 'supervisor');
  const isAdmin = true; // userRoles.some(role => role.fee_collection_role === 'admin');

  if (!isCashier && !isSupervisor && !isAdmin) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You need cashier, supervisor, or admin role to access collection sessions.
        </AlertDescription>
      </Alert>
    );
  }

  const handleStartSession = async () => {
    const amount = parseFloat(openingAmount) || 0;
    await startSession(amount);
    setOpeningAmount('');
    setShowStartDialog(false);
  };

  const handleEndSession = async () => {
    const amount = parseFloat(closingAmount) || 0;
    await endSession(amount, sessionNotes);
    setClosingAmount('');
    setSessionNotes('');
    setShowEndDialog(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading session information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Collection Session Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(currentSession.status)}
                  <Badge className={getStatusColor(currentSession.status)}>
                    {currentSession.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Session ID: {currentSession.id.slice(0, 8)}...
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    £{currentSession.opening_cash_amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Opening Amount</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    £{currentSession.expected_cash_amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Amount</div>
                </div>

                {currentSession.closing_cash_amount !== null && (
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold ${
                      currentSession.variance_amount === 0 ? 'text-green-600' : 
                      currentSession.variance_amount > 0 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      £{currentSession.variance_amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Variance</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Started: {new Date(currentSession.session_start).toLocaleString()}
                </div>
                {currentSession.session_end && (
                  <div className="text-sm text-muted-foreground">
                    Ended: {new Date(currentSession.session_end).toLocaleString()}
                  </div>
                )}
              </div>

              {currentSession.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes:</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentSession.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Session</h3>
              <p className="text-muted-foreground mb-4">
                You need to start a collection session to record payments.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Actions */}
      {isCashier && (
        <Card>
          <CardHeader>
            <CardTitle>Session Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {!currentSession && (
                <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                  <DialogTrigger asChild>
                    <Button>Start Collection Session</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start Collection Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="opening-amount">Opening Cash Amount (£)</Label>
                        <Input
                          id="opening-amount"
                          type="number"
                          step="0.01"
                          value={openingAmount}
                          onChange={(e) => setOpeningAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleStartSession}>Start Session</Button>
                        <Button variant="outline" onClick={() => setShowStartDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {currentSession && currentSession.status === 'active' && (
                <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">End Session</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>End Collection Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Please count your cash drawer and enter the closing amount.
                          Expected amount: £{currentSession.expected_cash_amount.toFixed(2)}
                        </AlertDescription>
                      </Alert>
                      
                      <div>
                        <Label htmlFor="closing-amount">Actual Cash Amount (£)</Label>
                        <Input
                          id="closing-amount"
                          type="number"
                          step="0.01"
                          value={closingAmount}
                          onChange={(e) => setClosingAmount(e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="session-notes">Notes (Optional)</Label>
                        <Textarea
                          id="session-notes"
                          value={sessionNotes}
                          onChange={(e) => setSessionNotes(e.target.value)}
                          placeholder="Any notes about the session..."
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleEndSession}>End Session</Button>
                        <Button variant="outline" onClick={() => setShowEndDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}